/**
 * Collaborative Presentation Editor
 *
 * Real-time collaboration for Polotno presentations with Y.js + Supabase Realtime
 * Shows active users, syncs changes across clients
 *
 * SAFE: NEW component, existing editor unchanged
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { PagesTimeline } from "polotno/pages-timeline";
import { observer } from "mobx-react-lite";
import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import pptxgen from "pptxgenjs";
import * as Y from "yjs";
import { SupabaseProvider } from "../../lib/supabase-yjs-provider";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";
import deck1 from "../../assets/decks/Deck.1.polotno.json";
import deck2 from "../../assets/decks/Deck.2.polotno.json";
import deck5 from "../../assets/decks/Deck.5.poltno.json";
import deck6 from "../../assets/decks/Deck.6.polotno.json";
import deck7 from "../../assets/decks/Deck.7.poltno.json";
import deck8 from "../../assets/decks/Deck.8.polotno.json";
import deck11 from "../../assets/decks/Deck.11.poltno.json";
import deck15 from "../../assets/decks/Deck.15.polotno.json";

const ALL_DECKS = [deck1, deck2, deck5, deck6, deck7, deck8, deck11, deck15];

// Generate consistent color for user
const getUserColor = (userId: string): string => {
  const colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
  ];
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickFallbackDeck(): any {
  const seed =
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("id")) ||
    "default";
  return ALL_DECKS[hashString(seed) % ALL_DECKS.length];
}

const PolotnoEditorUI = observer(({ store }: { store: any }) => {
  const handleDownloadPPTX = async () => {
    try {
      const pptx = new pptxgen();

      const widthInch = store.width / 96;
      const heightInch = store.height / 96;

      pptx.defineLayout({
        name: "CUSTOM",
        width: widthInch,
        height: heightInch,
      });
      pptx.layout = "CUSTOM";

      for (const page of store.pages) {
        const slide = pptx.addSlide();
        const dataUrl = await store.toDataURL({
          pageId: page.id,
          pixelRatio: 2,
        });

        slide.addImage({
          data: dataUrl,
          x: 0,
          y: 0,
          w: widthInch,
          h: heightInch,
        });
      }

      pptx.writeFile({ fileName: "presentation.pptx" });
    } catch (err) {
      console.error("Failed to generate PPTX:", err);
      alert("Failed to generate PowerPoint. Please try PDF instead.");
    }
  };

  const downloadMenu = (
    <Menu>
      <MenuItem
        icon="document"
        text="Download PDF"
        onClick={() => store.saveAsPDF({ fileName: "presentation.pdf" })}
      />
      <MenuItem
        icon="presentation"
        text="Download PPTX (Beta)"
        onClick={handleDownloadPPTX}
      />
    </Menu>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-auto">
        <Toolbar store={store} />
      </div>
      <div className="flex flex-row h-full w-full overflow-hidden">
        <div
          className="flex-none h-full"
          style={{ width: "400px", display: "flex", flexDirection: "column" }}
        >
          <SidePanel store={store} />
        </div>
        <div className="flex-grow h-full relative relative-app-workspace bg-gray-100 flex flex-col">
          <Workspace store={store} />
          <ZoomButtons store={store} />
          <div className="absolute top-4 right-20 z-10">
            <Popover content={downloadMenu} position={Position.BOTTOM_RIGHT}>
              <Button
                className="!bg-gray-900 !text-white !border-none hover:!bg-gray-800"
                rightIcon="caret-down"
              >
                Download
              </Button>
            </Popover>
          </div>
        </div>
      </div>
      <div className="h-auto bg-white border-t border-gray-200">
        <PagesTimeline store={store} />
      </div>
    </div>
  );
});

interface CollaborativePresentationEditorProps {
  data?: any;
  generationId: string;
}

export default function CollaborativePresentationEditor({
  data,
  generationId,
}: CollaborativePresentationEditorProps) {
  const router = useRouter();
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<SupabaseProvider | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [lastSavedContent, setLastSavedContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved",
  );

  // Create Polotno store
  const [store] = useState(() => {
    const s = createStore({
      key: "ftRB7anj9zd88zwAlJKy",
      showCredit: false,
    });

    const deck =
      data && Array.isArray(data.pages) && data.pages.length > 0
        ? data
        : pickFallbackDeck();

    try {
      s.loadJSON(deck);
    } catch {
      s.addPage();
    }

    return s;
  });

  // Handle auth errors - redirect to login
  const handleAuthError = (error: any) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/login");
      return true;
    }
    return false;
  };

  // Get current user info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }, []);

  // Initialize collaboration provider
  useEffect(() => {
    if (!generationId || !currentUser?.id) return;

    const newProvider = new SupabaseProvider(ydoc, generationId, supabase);
    setProvider(newProvider);

    // Start collaboration session
    const startSession = async () => {
      try {
        await api.post("/collaborations/session/start", {
          documentId: generationId,
          sessionId: ydoc.clientID.toString(),
          userColor: getUserColor(currentUser.id),
        });
      } catch (error: any) {
        if (handleAuthError(error)) return;
      }
    };

    startSession();

    // Cleanup on unmount
    return () => {
      newProvider.destroy();
      api
        .post("/collaborations/session/end", { documentId: generationId })
        .catch(() => {});
    };
  }, [generationId, currentUser, ydoc]);

  // Fetch active users periodically
  useEffect(() => {
    if (!generationId) return;

    const fetchActiveUsers = async () => {
      try {
        const response = await api.get(
          `/collaborations/${generationId}/active-users`,
        );
        if (response.data.status === "success") {
          setActiveUsers(response.data.data);
        }
      } catch (error: any) {
        if (handleAuthError(error)) return;
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 5000);

    return () => clearInterval(interval);
  }, [generationId]);

  // Y.js <-> Polotno Store Sync
  useEffect(() => {
    if (!provider) return;

    const ymap = ydoc.getMap("polotno-state");
    let isSyncing = false;

    // Y.js → Polotno (remote changes)
    const onYChange = () => {
      if (isSyncing) return;
      isSyncing = true;

      try {
        const remoteJSON = ymap.get("json");
        if (typeof remoteJSON === "string" && remoteJSON.length > 0) {
          const currentJSON = JSON.stringify(store.toJSON());
          if (currentJSON !== remoteJSON) {
            store.loadJSON(JSON.parse(remoteJSON));
          }
        }
      } catch (error) {
        console.error("Failed to sync from Y.js:", error);
      } finally {
        isSyncing = false;
      }
    };

    ymap.observe(onYChange);

    // Polotno → Y.js (local changes)
    const onStoreChange = () => {
      if (isSyncing) return;
      isSyncing = true;

      try {
        const json = JSON.stringify(store.toJSON());
        const currentRemote = ymap.get("json");
        if (json !== currentRemote) {
          ymap.set("json", json);
        }
      } catch (error) {
        console.error("Failed to sync to Y.js:", error);
      } finally {
        isSyncing = false;
      }
    };

    const unsubscribe = store.on("change", onStoreChange);

    // Initialize Y.js with current store state if empty
    if (!ymap.has("json")) {
      ymap.set("json", JSON.stringify(store.toJSON()));
    }

    return () => {
      ymap.unobserve(onYChange);
      unsubscribe();
    };
  }, [provider, store, ydoc]);

  // Initialize lastSavedContent
  useEffect(() => {
    if (store && !lastSavedContent) {
      setLastSavedContent(JSON.stringify(store.toJSON()));
    }
  }, [store]);

  // AUTO-SAVE to database
  useEffect(() => {
    if (!store || !generationId) return;

    let timeout: any;

    const saveToDatabase = async () => {
      try {
        const currentContent = JSON.stringify(store.toJSON());

        // SMART SAVE: Only save if content actually changed
        if (currentContent === lastSavedContent) {
          setSaveStatus("saved");
          return;
        }

        setSaveStatus("saving");
        const json = store.toJSON();
        await api.patch(`/ai/generation/${generationId}`, {
          content: json,
        });

        setLastSavedContent(currentContent);
        setSaveStatus("saved");
        console.log("Auto-saved presentation");
      } catch (error: any) {
        if (handleAuthError(error)) return;
        setSaveStatus("error");
        console.error("Auto-save failed:", error);
      }
    };

    const unsubscribe = store.on("change", () => {
      setIsEditing(true);
      if (timeout) clearTimeout(timeout);
      setSaveStatus("saving");
      timeout = setTimeout(() => {
        saveToDatabase();
        // Mark as not editing 3 seconds after last change
        setTimeout(() => setIsEditing(false), 3000);
      }, 2000);
    });

    return () => {
      unsubscribe();
      if (timeout) clearTimeout(timeout);
      saveToDatabase(); // Final save on unmount
    };
  }, [store, generationId, lastSavedContent]);

  // AUTO-REFRESH content from database every 10 seconds
  useEffect(() => {
    if (!generationId || !store) return;

    const refreshFromDatabase = async () => {
      // Don't refresh while user is editing!
      if (isEditing) return;

      try {
        const response = await api.get(`/ai/generation/${generationId}`);

        if (response.data?.status === "success") {
          const latestContent = response.data.data?.result?.editorState;

          if (latestContent) {
            const currentContent = store.toJSON();
            const latestJSON =
              typeof latestContent === "string"
                ? JSON.parse(latestContent)
                : latestContent;

            // Update if content changed
            if (JSON.stringify(currentContent) !== JSON.stringify(latestJSON)) {
              try {
                store.loadJSON(latestJSON);
              } catch (e) {
                console.error("Failed to load latest content:", e);
              }
            }
          }
        }
      } catch (error: any) {
        if (handleAuthError(error)) return;
      }
    };

    // Run on mount and every 10 seconds
    refreshFromDatabase();
    const interval = setInterval(refreshFromDatabase, 10000);

    return () => clearInterval(interval);
  }, [generationId, store, isEditing]);

  return (
    <div className="w-full h-full bg-white relative">
      {/* Active Users Bar */}
      {activeUsers.length > 0 && (
        <div className="absolute top-0 left-0 right-0 bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-900">
              {activeUsers.length} editing now:
            </span>
            <div className="flex -space-x-2">
              {activeUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: user.user_color || "#3b82f6" }}
                  title={
                    user.users
                      ? `${user.users.first_name || ""} ${user.users.last_name || ""}`.trim() ||
                        user.users.email
                      : "User"
                  }
                >
                  {(user.users
                    ? `${user.users.first_name || ""} ${user.users.last_name || ""}`.trim() ||
                      user.users.email
                    : user.users?.email || "U")[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <span className="text-xs text-blue-700">
            Changes sync automatically
          </span>
        </div>
      )}

      {/* Save Status Indicator */}
      <div className="absolute top-4 right-[200px] z-10 flex gap-2">
        <div className="pointer-events-none flex items-center">
          {saveStatus === "saving" && (
            <span className="text-gray-500 text-sm bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 font-medium">
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-green-600 text-sm bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 font-medium flex items-center gap-1">
              ✓ Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-red-500 text-sm bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 font-medium">
              Save Failed
            </span>
          )}
        </div>
      </div>

      <PolotnoEditorUI store={store} />
    </div>
  );
}
