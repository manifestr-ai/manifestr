/**
 * Collaborative Presentation Editor
 *
 * Real-time collaboration for Polotno presentations with Y.js + Supabase Realtime
 * Shows active users, syncs changes across clients
 *
 * SAFE: NEW component, existing editor unchanged
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import EditorBottomToolbar from "../editor/EditorBottomToolbar";
import ToolPanel from "../editor/panels/presentation-editor/ToolPanel";
import StyleGuideModal from "../editor/StyleGuideModal";
import { useToast } from "../ui/Toast";

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

const PolotnoEditorUI = observer(
  ({ store, workspaceRef }: { store: any; workspaceRef: any }) => {
    return (
      <div className="flex flex-1 h-full w-full overflow-hidden bg-[#e7e7e7]">
        {/* LEFT SLIDE PANEL */}
        <div
          className="
         flex flex-col
         border-r border-[#E5E7EB]
         bg-white
         pt-2
         transition-all
          lg:w-[140px] lg:max-w-[140px] lg:min-w-[70px]
          sm:w-[70px] sm:max-w-[70px] sm:min-w-[70px]
          xs:w-[60px] xs:max-w-[60px] xs:min-w-[60px]
     
    
       "
        >
          {/* NEW BUTTON */}
          <div className="flex justify-center w-full mb-[10px]">
            <button
              className="
                
                bg-[#18181B] text-white
                rounded-[6px] text-[13px] font-medium border-none
                lg:w-[90px] lg:h-[26px]
                sm:w-[80px] sm:h-[24px]
                xs:w-[72px] xs:h-[22px]
              "
              onClick={() => {
                store.addPage();
              }}
            >
              + New
            </button>
          </div>

          {/* SLIDES */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: "10px",
            }}
          >
            <div className="flex flex-col items-center gap-[10px]">
              {store.pages.map((page: any, index: number) => {
                const isActive = page === store.activePage;

                return (
                  <div
                    key={page.id}
                    onClick={() => page.select()}
                    className={`
                      flex items-center justify-center 
                      rounded-[8px] 
                      bg-white
                      text-[12px] 
                      text-[#111827] 
                      cursor-pointer 
                      box-border
                      
                      lg:w-[96px] lg:h-[52px]
                      sm:w-[72px] sm:h-[36px]
                      xs:w-[60px] xs:h-[30px]
                      border
                      ${isActive ? "border-[#2563EB] border-2" : "border-[#E5E7EB] border"}
                    `}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER WORKSPACE */}

        <div
          ref={workspaceRef}
          className="flex-1 relative overflow-hidden"
          style={{
            boxShadow: "-8px 0 32px -8px rgba(16,24,40,0.38)",
          }}
        >
          <Workspace
            store={store}
            components={{
              PageControls: ({ page }) => (
                <div
                  style={{
                    position: "absolute",
                    top: "4%", // Exactly on slide content area
                    right: "25%",
                    zIndex: 10,
                  }}
                >
                  <Button
                    icon="trash"
                    minimal
                    intent="none"
                    onClick={() => {
                      // Defensive: check page.id exists and store.deletePages available
                      if (!page?.id || typeof store.deletePages !== "function")
                        return;

                      const shouldDelete = window.confirm(
                        "Are you sure you want to delete this slide?",
                      );
                      if (shouldDelete) {
                        store.deletePages([page.id]);
                      }
                    }}
                  />
                </div>
              ),
            }}
          />

          {/* Wrap ZoomButtons to position them on the right */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "100px",
              zIndex: 10,
            }}
          >
            <ZoomButtons store={store} />
          </div>
        </div>
      </div>
    );
  },
);

interface CollaborativePresentationEditorProps {
  data?: any;
  generationId: string;
  onStoreReady?: (store: any) => void;
  onActiveToolChange?: (tool: string | null) => void;
}
// ================= MAIN COMPONENT =================

export default function CollaborativePresentationEditor({
  data,
  generationId,
  onStoreReady,
  onActiveToolChange,
}: CollaborativePresentationEditorProps) {
  const router = useRouter();

  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<SupabaseProvider | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [showStyleGuideModal, setShowStyleGuideModal] = useState(false);
  const { success } = useToast();
  const [lastSavedContent, setLastSavedContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved",
  );
  const [isOpen, setIsOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

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

    return s; // ✅ ONLY RETURN HERE
  });

  useEffect(() => {
    if (onStoreReady && store) {
      onStoreReady(store);
    }
  }, [store, onStoreReady]);

  useEffect(() => {
    if (store) {
      store.setScale(0.46); // 0.46 equals 46%
    }
  }, [store]);
  // useEffect(() => {
  //   const fitToWidth = () => {
  //     if (!workspaceRef.current) return;

  //     const containerWidth = workspaceRef.current.clientWidth - 200;

  //     // ✅ ONLY WIDTH — THIS IS THE FIX
  //     const scale = containerWidth / store.width;

  //     store.setScale(scale);
  //   };

  //   setTimeout(fitToWidth, 0);

  //   window.addEventListener("resize", fitToWidth);
  //   return () => window.removeEventListener("resize", fitToWidth);
  // }, [store]);

  const handleAuthError = (error: any) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/login");
      return true;
    }
    return false;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!generationId || !currentUser?.id) return;

    const newProvider = new SupabaseProvider(ydoc, generationId, supabase);
    setProvider(newProvider);

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

    return () => {
      newProvider.destroy();
      api
        .post("/collaborations/session/end", { documentId: generationId })
        .catch(() => {});
    };
  }, [generationId, currentUser, ydoc]);

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
    const interval = setInterval(fetchActiveUsers, 15000); // Increased from 5s to 15s to reduce load

    return () => clearInterval(interval);
  }, [generationId]);

  useEffect(() => {
    if (!provider) return;

    const ymap = ydoc.getMap("polotno-state");
    let isSyncing = false;

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

    if (!ymap.has("json")) {
      ymap.set("json", JSON.stringify(store.toJSON()));
    }

    return () => {
      ymap.unobserve(onYChange);
      unsubscribe();
    };
  }, [provider, store, ydoc]);

  useEffect(() => {
    if (store && !lastSavedContent) {
      setLastSavedContent(JSON.stringify(store.toJSON()));
    }
  }, [store]);

  useEffect(() => {
    if (!store || !generationId) return;

    let timeout: any;

    const saveToDatabase = async () => {
      try {
        const currentContent = JSON.stringify(store.toJSON());

        if (currentContent === lastSavedContent) {
          setSaveStatus("saved");
          return;
        }

        setSaveStatus("saving");

        await api.patch(`/ai/generation/${generationId}`, {
          content: store.toJSON(),
        });

        setLastSavedContent(currentContent);
        setSaveStatus("saved");
      } catch (error: any) {
        if (handleAuthError(error)) return;
        setSaveStatus("error");
      }
    };

    const unsubscribe = store.on("change", () => {
      setIsEditing(true);
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        saveToDatabase();
        setTimeout(() => setIsEditing(false), 3000);
      }, 2000);
    });

    return () => {
      unsubscribe();
      if (timeout) clearTimeout(timeout);
      saveToDatabase();
    };
  }, [store, generationId, lastSavedContent]);

  const [activeTool, setActiveTool] = useState<
    | "ai_prompter"
    | "format"
    | "insert"
    | "layout"
    | "arrange"
    | "style"
    | "transition"
    | "animation"
    | "slideshow"
  >("insert");

  // Notify parent about activeTool changes
  useEffect(() => {
    if (onActiveToolChange) {
      onActiveToolChange(activeTool);
    }
  }, [activeTool, onActiveToolChange]);

  // Handle style guide selection - REGENERATE with style guide
  const handleSelectStyleGuide = async (styleGuide: any) => {
    console.log('🎨 Regenerating presentation with style guide:', styleGuide);
    
    try {
      setShowStyleGuideModal(false);
      
      // Show loading state
      success(`🔄 Regenerating presentation with "${styleGuide.brand_name || styleGuide.name}" theme...`);
      
      // Get current context
      const currentTitle = store.pages[0]?.children.find((c: any) => c.type === 'text')?.text || 'Professional Presentation';
      const pageCount = store.pages.length || 5;
      const currentPresentation = store.toJSON();
      
      // If we have a generation ID, use modify endpoint to update the SAME presentation
      if (generationId) {
        console.log('📝 Updating existing presentation with ID:', generationId);
        
        const response = await api.post('/presentation-generator/modify', {
          prompt: `Apply brand style guide: ${styleGuide.brand_name || styleGuide.name} to this ${currentTitle}`,
          presentationData: currentPresentation,
          styleGuideId: styleGuide.id,
          styleGuide: {
            colors: styleGuide.colors,
            typography: styleGuide.typography,
            brandName: styleGuide.brand_name || styleGuide.name,
            logo: styleGuide.logo
          },
          generationId: generationId,
          meta: { 
            editorType: 'presentation',
            applyStyleGuide: true,
            updateExisting: true
          }
        });
        
        console.log('📽️  Modified presentation response:', response.data);
        
        if (response.data?.data?.presentationData && store) {
          const updatedPresentation = response.data.data.presentationData;
          console.log('✅ Loading updated presentation data into store');
          
          // Clear existing pages (correct method: deletePages)
          const pageIds = store.pages.map((p: any) => p.id);
          store.deletePages(pageIds);
          
          // Load updated presentation
          try {
            store.loadJSON(updatedPresentation);
            console.log('✅ Presentation updated successfully!');
            success(`✅ Presentation regenerated with "${styleGuide.brand_name || styleGuide.name}" theme!`);
          } catch (loadError) {
            console.error('❌ Error loading JSON:', loadError);
            // Force page reload as fallback
            setTimeout(() => window.location.reload(), 500);
          }
        } else {
          // Fallback: reload page
          console.log('🔄 Reloading page to show updated presentation...');
          setTimeout(() => window.location.reload(), 500);
        }
        
      } else {
        // No ID - create new presentation
        console.log('📝 Creating new presentation with style guide');
        
        const response = await api.post('/presentation-generator/generate', {
          prompt: `${currentTitle}. Apply brand style guide: ${styleGuide.brand_name || styleGuide.name}`,
          pageCount: pageCount,
          styleGuideId: styleGuide.id,
          styleGuide: {
            colors: styleGuide.colors,
            typography: styleGuide.typography,
            brandName: styleGuide.brand_name || styleGuide.name,
            logo: styleGuide.logo
          },
          meta: { 
            editorType: 'presentation',
            applyStyleGuide: true
          }
        });
        
        console.log('📽️  API Response:', response.data);
        
        if (response.data?.data?.presentationData && store) {
          const newPresentation = response.data.data.presentationData;
          console.log('✅ Loading regenerated presentation data into store');
          
          // Clear existing pages (correct method: deletePages)
          const pageIds = store.pages.map((p: any) => p.id);
          store.deletePages(pageIds);
          
          // Load new presentation
          try {
            store.loadJSON(newPresentation);
            console.log('✅ Presentation loaded successfully!');
            
            // If we got a jobId, update URL
            if (response.data?.data?.jobId) {
              window.history.replaceState({}, '', `/presentation-editor?id=${response.data.data.jobId}`);
            }
            
            success(`✅ Presentation regenerated with "${styleGuide.brand_name || styleGuide.name}" theme!`);
          } catch (loadError) {
            console.error('❌ Error loading JSON:', loadError);
            setTimeout(() => window.location.reload(), 500);
          }
        } else {
          console.warn('⚠️ No presentation data in response, reloading page...');
          setTimeout(() => window.location.reload(), 1000);
        }
      }
      
    } catch (error: any) {
      console.error('❌ Failed to regenerate presentation:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Unknown error';
      success(`⚠️ Regeneration in progress... Check console: ${errorMsg}`);
    }
  };

  return (
    <div className="w-full h-full bg-[#f3f4f6] flex flex-col relative">
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
      
      {/* HEADER */}
      <div
        className="
          flex
          
          h-[54px]
          px-0
          py-0
          justify-center
          items-center
          border-b
          border-[#E5E7EB]
          bg-white
          "
        style={{ paddingTop: activeUsers.length > 0 ? "56.5px" : "12.5px", paddingBottom: "13.5px" }}
      >
        <div className="text-sm text-gray-700 flex items-center">
          <span
            style={{
              color: "#0A0A0A",
              fontFamily: "Inter",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "28px",
              letterSpacing: "-0.449px",
            }}
          >
            Presentation
          </span>

          <span
            className="ml-2"
            style={{
              color: "#6A7282",
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.15px",
            }}
          >
            Slide{" "}
            <span style={{ color: "#000" }}>
              {store.activePage ? store.pages.indexOf(store.activePage) + 1 : 1}
            </span>{" "}
            of {store.pages.length}
          </span>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="h-[60px] flex items-center gap-3 px-6 border-b border-gray-200 bg-white">
        <button
          className={`
            px-3 py-2 flex items-center gap-2 transition 
            font-medium rounded-[10px] 
            bg-gray-100 text-[#0A0A0A]
            hover:bg-gray-200 hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-blue-400
            active:bg-gray-300
            text-[13px] sm:text-[14px] 
            leading-5 
            md:px-4
          `}
          style={{
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: 500,
            letterSpacing: "-0.15px",
          }}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="w-4 h-4 md:w-4 md:h-4"
          >
            <path
              d="M10.0013 1.33594H4.0013C3.64768 1.33594 3.30854 1.47641 3.05849 1.72646C2.80844 1.97651 2.66797 2.31565 2.66797 2.66927V13.3359C2.66797 13.6896 2.80844 14.0287 3.05849 14.2787C3.30854 14.5288 3.64768 14.6693 4.0013 14.6693H12.0013C12.3549 14.6693 12.6941 14.5288 12.9441 14.2787C13.1942 14.0287 13.3346 13.6896 13.3346 13.3359V4.66927L10.0013 1.33594Z"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.33203 1.33594V4.0026C9.33203 4.35623 9.47251 4.69536 9.72256 4.94541C9.9726 5.19546 10.3117 5.33594 10.6654 5.33594H13.332"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.66536 6H5.33203"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6654 8.66406H5.33203"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6654 11.3359H5.33203"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden lg:inline">Insert From the Vault</span>
        </button>

        <div
          style={{
            width: "1px",
            height: "24px",
            flexShrink: 0,
            background: "#D1D5DC",
            marginLeft: "8px",
            marginRight: "8px",
          }}
        />

        <button
          onClick={() => setShowStyleGuideModal(true)}
          className="px-3 py-2 flex items-center gap-2 rounded-[10px] bg-[#F3F4F6] text-[#0A0A0A] font-medium transition hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-gray-300
            text-[13px] xs:text-[14px] sm:px-4 sm:py-2"
          style={{
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.15px",
          }}
          type="button"
        >
          <svg
            className="w-5 h-5 xs:w-4 xs:h-4"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g clipPath="url(#clip0_10389_80842)">
              <path
                d="M7.34106 1.87239C7.36962 1.71946 7.45077 1.58133 7.57045 1.48193C7.69014 1.38254 7.84081 1.32812 7.99639 1.32812C8.15196 1.32812 8.30264 1.38254 8.42232 1.48193C8.54201 1.58133 8.62316 1.71946 8.65172 1.87239L9.35239 5.57772C9.40215 5.84115 9.53017 6.08347 9.71974 6.27304C9.90931 6.4626 10.1516 6.59062 10.4151 6.64039L14.1204 7.34106C14.2733 7.36962 14.4114 7.45077 14.5108 7.57045C14.6102 7.69014 14.6647 7.84081 14.6647 7.99639C14.6647 8.15196 14.6102 8.30264 14.5108 8.42232C14.4114 8.54201 14.2733 8.62316 14.1204 8.65172L10.4151 9.35239C10.1516 9.40215 9.90931 9.53017 9.71974 9.71974C9.53017 9.90931 9.40215 10.1516 9.35239 10.4151L8.65172 14.1204C8.62316 14.2733 8.54201 14.4114 8.42232 14.5108C8.30264 14.6102 8.15196 14.6647 7.99639 14.6647C7.84081 14.6647 7.69014 14.6102 7.57045 14.5108C7.45077 14.4114 7.36962 14.2733 7.34106 14.1204L6.64039 10.4151C6.59062 10.1516 6.4626 9.90931 6.27304 9.71974C6.08347 9.53017 5.84115 9.40215 5.57772 9.35239L1.87239 8.65172C1.71946 8.62316 1.58133 8.54201 1.48193 8.42232C1.38254 8.30264 1.32812 8.15196 1.32812 7.99639C1.32812 7.84081 1.38254 7.69014 1.48193 7.57045C1.58133 7.45077 1.71946 7.36962 1.87239 7.34106L5.57772 6.64039C5.84115 6.59062 6.08347 6.4626 6.27304 6.27304C6.4626 6.08347 6.59062 5.84115 6.64039 5.57772L7.34106 1.87239Z"
                stroke="#0A0A0A"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3359 1.33594V4.0026"
                stroke="#0A0A0A"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.6667 2.66406H12"
                stroke="#0A0A0A"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.66927 14.6667C3.40565 14.6667 4.0026 14.0697 4.0026 13.3333C4.0026 12.597 3.40565 12 2.66927 12C1.93289 12 1.33594 12.597 1.33594 13.3333C1.33594 14.0697 1.93289 14.6667 2.66927 14.6667Z"
                stroke="#0A0A0A"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_10389_80842">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="hidden lg:inline">Insert Theme</span>
        </button>
      </div>

      {/* EDITOR */}
      <div className="flex-1 flex overflow-hidden">
        <PolotnoEditorUI store={store} workspaceRef={workspaceRef} />
      </div>

      {/* Sorter */}
      {/* TOGGLE BUTTON */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 11,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: `translate(-50%, -50%) ${isOpen ? "rotate(180deg)" : "rotate(0deg)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "35px",
            height: "35px",
            background: "#FFF",
            border: "1px solid #E5E7EB",
            borderRadius: "50%",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            color: "#B0B6BC",
            opacity: 0.85,
            zIndex: 20,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
            {/* Up-pointing arrow head only */}
            <polyline
              points="5,9 8,6 11,9"
              fill="none"
              stroke="#18181B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        style={{
          width: "100%",
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "6px",
          flexDirection: "row",
          alignItems: "stretch",
          minHeight: "56px",
          display: isOpen ? "flex" : "none",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {/* Left: Sorter Sidebar */}
        <div
          className="flex flex-col justify-center items-center flex-shrink-0"
          style={{
            width: "139px",
            height: "120px",
            paddingRight: "0.008px",
            borderRight: "1px solid #E5E7EB",
            background: "#FFF",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "#F7F8FA",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
              boxSizing: "border-box",
            }}
            title="Sorter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                stroke="#4A5565"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 6H14"
                stroke="#4A5565"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 10H14"
                stroke="#4A5565"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 2V14"
                stroke="#4A5565"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 2V14"
                stroke="#4A5565"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: "12px",
                color: "#6B7280",
                marginTop: "4px",
                userSelect: "none",
                letterSpacing: "0.01em",
              }}
            >
              Sorter
            </span>
          </div>
        </div>

        {/* Right: Speaker Notes Area */}

        <div
          style={{
            width: "100%",
            borderTop: "1px solid #E5E7EB",
            background: "#FFFFFF",
          }}
        >
          <div className="flex items-center justify-between px-6 h-[45px] w-full flex-shrink-0 self-stretch border-b border-gray-200">
            {/* Left Icon: Document */}
            <div
              style={{
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                color: "#B0B6BC",
                opacity: 0.75,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M10.0013 1.33594H4.0013C3.64768 1.33594 3.30854 1.47641 3.05849 1.72646C2.80844 1.97651 2.66797 2.31565 2.66797 2.66927V13.3359C2.66797 13.6896 2.80844 14.0287 3.05849 14.2787C3.30854 14.5288 3.64768 14.6693 4.0013 14.6693H12.0013C12.3549 14.6693 12.6941 14.5288 12.9441 14.2787C13.1942 14.0287 13.3346 13.6896 13.3346 13.3359V4.66927L10.0013 1.33594Z"
                  stroke="#4A5565"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.33203 1.33594V4.0026C9.33203 4.35623 9.47251 4.69536 9.72256 4.94541C9.9726 5.19546 10.3117 5.33594 10.6654 5.33594H13.332"
                  stroke="#4A5565"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66536 6H5.33203"
                  stroke="#4A5565"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.6654 8.66406H5.33203"
                  stroke="#4A5565"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.6654 11.3359H5.33203"
                  stroke="#4A5565"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Right Icons: Eye and Screen */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#B0B6BC",
                opacity: 0.75,
              }}
            >
              {/* Eye icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clipPath="url(#clip0_10382_80263)">
                  <path
                    d="M7.15625 3.37846C8.70917 3.1934 10.28 3.52167 11.6288 4.31316C12.9777 5.10465 14.0304 6.31584 14.6263 7.76179C14.6818 7.91147 14.6818 8.07612 14.6263 8.22579C14.3812 8.81979 14.0575 9.37813 13.6636 9.88579"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.38942 9.43737C9.01222 9.80169 8.50702 10.0033 7.98262 9.99872C7.45823 9.99417 6.9566 9.78383 6.58579 9.41301C6.21497 9.0422 6.00463 8.54057 6.00008 8.01618C5.99552 7.49178 6.19711 6.98658 6.56142 6.60938"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.6556 11.6704C10.7713 12.1943 9.78458 12.5218 8.76251 12.6307C7.74045 12.7396 6.70691 12.6274 5.73203 12.3017C4.75715 11.976 3.86374 11.4443 3.11242 10.7429C2.36109 10.0415 1.76944 9.18665 1.37761 8.23642C1.32205 8.08674 1.32205 7.92209 1.37761 7.77242C1.9687 6.33899 3.00872 5.13591 4.34161 4.34375"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.33594 1.32812L14.6693 14.6615"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10382_80263">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {/* Screen icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M13.3359 2H2.66927C1.93289 2 1.33594 2.59695 1.33594 3.33333V10C1.33594 10.7364 1.93289 11.3333 2.66927 11.3333H13.3359C14.0723 11.3333 14.6693 10.7364 14.6693 10V3.33333C14.6693 2.59695 14.0723 2 13.3359 2Z"
                  stroke="#18181B"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33594 14H10.6693"
                  stroke="#18181B"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 11.3281V13.9948"
                  stroke="#18181B"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* TEXT AREA */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="flex-1 font-inter text-[14px] not-italic font-normal leading-[22.75px] text-[rgba(10,10,10,0.50)] outline-none whitespace-pre-wrap px-6 pt-6 pb-0"
            onFocus={(e) => {
              if (
                e.currentTarget.innerText ===
                "Click to add speaker notes for this slide..."
              ) {
                e.currentTarget.innerText = "";
              }
            }}
            onBlur={(e) => {
              if (e.currentTarget.innerText.trim() === "") {
                e.currentTarget.innerText =
                  "Click to add speaker notes for this slide...";
              }
            }}
          >
            Click to add speaker notes for this slide...
          </div>
        </div>
      </div>

      {/* BOTTOM TOOLBAR */}

      {/* TOP PANELS (except AI Prompter) */}
      {activeTool !== "ai_prompter" && (
        <ToolPanel activeTool={activeTool} store={store} setActiveTool={setActiveTool} />
      )}

      <EditorBottomToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        editorType="presentation"
      />

      {/* AI PROMPTER BELOW TOOLBAR */}
      {activeTool === "ai_prompter" && (
        <ToolPanel activeTool={activeTool} store={store} setActiveTool={setActiveTool} />
      )}
      
      {/* Style Guide Modal */}
      <StyleGuideModal
        isOpen={showStyleGuideModal}
        onClose={() => setShowStyleGuideModal(false)}
        onSelect={handleSelectStyleGuide}
        editorType="presentation"
      />
    </div>
  );
}
