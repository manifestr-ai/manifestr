/**
 * Collaborative Univer Sheet
 *
 * Real-time collaboration for Univer spreadsheets with Y.js + Supabase Realtime
 * Shows active users, syncs changes across clients
 *
 * SAFE: NEW component, existing UniverSheet unchanged
 */

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { useRouter } from "next/router";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import sheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US";
import { createUniver, LocaleType, mergeLocales } from "@univerjs/presets";
import {
  FUNCTION_LIST_USER,
  functionEnUS,
  functionUser,
} from "./custom-function";
import { WORKBOOK_DATA } from "./data";
import * as Y from "yjs";
import { SupabaseProvider } from "../../lib/supabase-yjs-provider";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";
import EditorBottomToolbar from "../editor/EditorBottomToolbar";
import ToolPanel from "../editor/panels/presentation-editor/ToolPanel";

import "@univerjs/preset-sheets-core/lib/index.css";

interface CollaborativeUniverSheetProps {
  onAPIReady?: (univerAPI: any) => void;
  data?: any;
  generationId: string;
}

// Generate consistent color for user
const getUserColor = (userId: string): string => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const CollaborativeUniverSheet = forwardRef<any, CollaborativeUniverSheetProps>(
  ({ onAPIReady, data, generationId }, ref) => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const univerAPIRef = useRef<any>(null);
    const [ydoc] = useState(() => new Y.Doc());
    const [provider, setProvider] = useState<SupabaseProvider | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [activeUsers, setActiveUsers] = useState<any[]>([]);
    const [lastSavedContent, setLastSavedContent] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
      "saved",
    );

    useImperativeHandle(ref, () => ({
      getAPI: () => univerAPIRef.current,
    }));

    // Handle auth errors
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

    // Initialize Univer + Collaboration
    useEffect(() => {
      if (!containerRef.current) return;

      const { univerAPI } = createUniver({
        locale: LocaleType.EN_US,
        locales: {
          [LocaleType.EN_US]: mergeLocales(sheetsCoreEnUS, functionEnUS),
        },
        presets: [
          UniverSheetsCorePreset({
            container: containerRef.current,
            header: true,
            footer: {
              menus: false,
              sheetBar: true,   // keep tabs
              statisticBar: false,
              zoomSlider: false,
            },
            formula: {
              function: functionUser,
              description: FUNCTION_LIST_USER,
            },
          }),
        ],
      });

      univerAPIRef.current = univerAPI;

      let workbookData = data || WORKBOOK_DATA;

      // LOG WHAT WE RECEIVED
      console.log('📊 [Collab] Received workbook data:', {
        hasData: !!data,
        dataType: typeof data,
        dataKeys: data ? Object.keys(data) : [],
        hasSheets: data?.sheets ? Object.keys(data.sheets).length : 0,
        sheetOrder: data?.sheetOrder,
        generationId
      });
      
      // LOG SHEET DETAILS
      if (data?.sheets) {
        console.log('📋 [Collab] Sheet Details:');
        Object.keys(data.sheets).forEach(sheetKey => {
          const sheet = data.sheets[sheetKey];
          const cellCount = sheet.cellData ? Object.keys(sheet.cellData).reduce((total, rowKey) => {
            const row = sheet.cellData[rowKey];
            return total + (row ? Object.keys(row).length : 0);
          }, 0) : 0;
          console.log(`  - ${sheet.name}: ${cellCount} cells`, sheet.cellData ? 'HAS cellData' : 'NO cellData');
          
          // LOG SAMPLE CELL DATA STRUCTURE
          if (sheet.cellData && Object.keys(sheet.cellData).length > 0) {
            const firstRowKey = Object.keys(sheet.cellData)[0];
            const firstRow = sheet.cellData[firstRowKey];
            if (firstRow) {
              const firstCellKey = Object.keys(firstRow)[0];
              const firstCell = firstRow[firstCellKey];
              console.log(`    Sample cell [${firstRowKey}][${firstCellKey}]:`, firstCell);
            }
          }
        });
      }

      // Validation
      const isValid =
        workbookData &&
        typeof workbookData === "object" &&
        Object.keys(workbookData).length > 0 &&
        (workbookData.sheets || workbookData.sheetOrder);

      if (!isValid) {
        console.warn('⚠️ [Collab] Invalid workbook data, using fallback');
        workbookData = WORKBOOK_DATA;
      }

      // Sanitization: Ensure sheetOrder consistency
      if (workbookData && workbookData.sheets) {
        const sheetKeys = Object.keys(workbookData.sheets);

        if (
          !workbookData.sheetOrder ||
          !Array.isArray(workbookData.sheetOrder)
        ) {
          workbookData.sheetOrder = sheetKeys;
        } else {
          const validOrder = workbookData.sheetOrder.filter((id) =>
            sheetKeys.includes(id),
          );

          if (validOrder.length === 0 && sheetKeys.length > 0) {
            workbookData.sheetOrder = sheetKeys;
          } else {
            workbookData.sheetOrder = validOrder;
          }
        }

        if (workbookData.sheetOrder.length === 0) {
          workbookData = WORKBOOK_DATA;
        }
      }

      try {
        console.log('🚀 [Collab] Creating Univer workbook...');
        
        // CRITICAL FIX: Wait for Univer to fully initialize BEFORE creating workbook
        // Univer's internal event system (onPointerDown$) needs time to set up
        setTimeout(() => {
          try {
            univerAPI.createWorkbook(workbookData);
            console.log('✅ [Collab] Workbook created successfully');
            
            // Double-verify after another delay
            setTimeout(() => {
              const workbook = univerAPI.getActiveWorkbook();
              if (!workbook) {
                console.error('❌ [Collab] Workbook creation failed - getActiveWorkbook() returned null');
              } else {
                console.log('✅ [Collab] Active workbook verified:', {
                  id: workbook.getId?.(),
                  hasSheets: !!workbook.getSheets,
                  hasSaveMethod: typeof workbook.save === 'function'
                });
                
                if (typeof workbook.save !== 'function') {
                  console.warn('⚠️ [Collab] save() method still not available');
                }
              }
            }, 300);
          } catch (e) {
            console.error("❌ [Collab] Failed to create workbook:", e);
            // Try with fallback data
            try {
              console.log('⚠️ [Collab] Attempting with fallback data...');
              univerAPI.createWorkbook(WORKBOOK_DATA);
            } catch (fallbackError) {
              console.error('❌ [Collab] Fallback also failed:', fallbackError);
            }
          }
        }, 100); // Initial delay for Univer's event system to initialize
        
      } catch (e) {
        console.error("❌ [Collab] Initialization error:", e);
      }

      if (onAPIReady) {
        onAPIReady(univerAPI);
      }

      return () => {
        try {
          univerAPI?.dispose();
          univerAPIRef.current = null;
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      };
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

    // Y.js <-> Univer Sync - FIXED to prevent workbook recreation on own changes
    useEffect(() => {
      if (!provider || !univerAPIRef.current) return;

      const ymap = ydoc.getMap("univer-state");
      let isSyncing = false;
      let lastLocalVersion = 0;
      let initTimeout: any;

      // Wait for workbook to be ready before setting up sync
      const waitForWorkbook = () => {
        const workbook = univerAPIRef.current?.getActiveWorkbook();
        if (!workbook) {
          console.log('⏳ [Collab] Waiting for workbook to be ready for Y.js sync...');
          return false;
        }
        return true;
      };

      // Delay sync initialization to ensure workbook is ready
      initTimeout = setTimeout(() => {
        if (!waitForWorkbook()) {
          console.warn('⚠️ [Collab] Workbook not ready after timeout, skipping Y.js sync init');
          return;
        }
        
        console.log('✅ [Collab] Workbook ready, initializing Y.js sync');

        // Initialize Y.js with current state if empty
        if (!ymap.has("json") && univerAPIRef.current) {
          const workbook = univerAPIRef.current.getActiveWorkbook();
          if (workbook && typeof workbook.save === 'function') {
            lastLocalVersion = 1;
            ymap.set("version", lastLocalVersion);
            ymap.set("json", JSON.stringify(workbook.save()));
            console.log('🔧 [Collab] Initialized Y.js state (v1)');
          }
        } else {
          // Load existing version
          lastLocalVersion = ymap.get("version") as number || 0;
          console.log('🔧 [Collab] Connected to existing Y.js state (v' + lastLocalVersion + ')');
        }
      }, 500); // Wait for workbook creation

      // Y.js → Univer (remote changes from OTHER users)
      const onYChange = () => {
        if (isSyncing || !univerAPIRef.current) return;
        
        // SAFETY: Check if workbook exists
        const workbook = univerAPIRef.current.getActiveWorkbook();
        if (!workbook) {
          console.warn('⚠️ [Collab] Workbook not available during Y.js change, skipping');
          return;
        }
        
        const remoteVersion = ymap.get("version") as number | undefined;
        
        // CRITICAL FIX: Skip if this change originated from us!
        if (remoteVersion && remoteVersion === lastLocalVersion) {
          console.log('⏭️ [Collab] Skipping sync - this was our own change (v' + remoteVersion + ')');
          return;
        }
        
        isSyncing = true;

        try {
          const remoteJSON = ymap.get("json");
          if (remoteJSON) {
            if (workbook && typeof workbook.save === 'function') {
              const currentJSON = JSON.stringify(workbook.save());
              const remoteJSONStr = remoteJSON as string;
              if (currentJSON !== remoteJSONStr) {
                console.log('🔄 [Collab] Applying remote changes from another user (v' + remoteVersion + ')');
                const remoteData = JSON.parse(remoteJSONStr);
                // Dispose and recreate workbook with new data
                const workbookId = workbook.getId() as string;
                univerAPIRef.current.disposeUnit(workbookId);
                
                // Add small delay before recreating to avoid race conditions
                setTimeout(() => {
                  if (univerAPIRef.current) {
                    univerAPIRef.current.createWorkbook(remoteData);
                    lastLocalVersion = remoteVersion || 0;
                  }
                }, 50);
              }
            } else {
              console.warn('⚠️ [Collab] Workbook or save() method not available');
            }
          }
        } catch (error) {
          console.error("Failed to sync from Y.js:", error);
        } finally {
          isSyncing = false;
        }
      };

      ymap.observe(onYChange);

      // Univer → Y.js (local changes TO other users)
      const syncToYjs = () => {
        if (isSyncing || !univerAPIRef.current) return;
        
        // SAFETY: Check if workbook exists
        const workbook = univerAPIRef.current.getActiveWorkbook();
        if (!workbook) return;
        
        isSyncing = true;

        try {
          if (workbook && typeof workbook.save === 'function') {
            const json = JSON.stringify(workbook.save());
            const currentRemote = ymap.get("json") as string | undefined;
            if (json !== currentRemote) {
              // Increment version to mark this as OUR change
              lastLocalVersion = (ymap.get("version") as number || 0) + 1;
              ymap.set("version", lastLocalVersion);
              ymap.set("json", json);
              console.log('📤 [Collab] Synced local edit to Y.js (v' + lastLocalVersion + ')');
            }
          } else {
            console.warn('⚠️ [Collab] Workbook or save() method not available for sync');
          }
        } catch (error) {
          console.error("Failed to sync to Y.js:", error);
        } finally {
          isSyncing = false;
        }
      };

      // Listen to Univer commands (debounced to avoid excessive syncs)
      let syncTimeout: any;
      let commandDisposable: any;
      
      // Delay attaching command listener until workbook is ready
      const attachCommandListener = setTimeout(() => {
        if (univerAPIRef.current) {
          commandDisposable = univerAPIRef.current.onCommandExecuted(
            (command: any) => {
              setIsEditing(true);
              // Debounce to avoid syncing every keystroke
              if (syncTimeout) clearTimeout(syncTimeout);
              syncTimeout = setTimeout(() => syncToYjs(), 200);
            },
          );
        }
      }, 500);

      return () => {
        if (initTimeout) clearTimeout(initTimeout);
        if (syncTimeout) clearTimeout(syncTimeout);
        if (attachCommandListener) clearTimeout(attachCommandListener);
        ymap.unobserve(onYChange);
        commandDisposable?.dispose();
      };
    }, [provider, ydoc]);

    // Initialize lastSavedContent
    useEffect(() => {
      if (univerAPIRef.current && !lastSavedContent) {
        const workbook = univerAPIRef.current.getActiveWorkbook();
        if (workbook && typeof workbook.save === 'function') {
          setLastSavedContent(JSON.stringify(workbook.save()));
        }
      }
    }, [univerAPIRef.current]);

    // AUTO-SAVE to database
    useEffect(() => {
      if (!univerAPIRef.current || !generationId) return;

      let timeout: any;
      let initTimeout: any;
      let disposable: any;

      const saveToDatabase = async () => {
        try {
          const workbook = univerAPIRef.current?.getActiveWorkbook();
          if (!workbook || typeof workbook.save !== 'function') {
            console.warn('⚠️ [Collab] Workbook or save() not available for database save');
            return;
          }

          const currentContent = JSON.stringify(workbook.save());

          // SMART SAVE: Only save if content actually changed
          if (currentContent === lastSavedContent) {
            setSaveStatus("saved");
            return;
          }

          setSaveStatus("saving");
          const snapshot = workbook.save();
          await api.patch(`/ai/generation/${generationId}`, {
            content: snapshot,
          });

          setLastSavedContent(currentContent);
          setSaveStatus("saved");
          console.log("Auto-saved spreadsheet");
        } catch (error: any) {
          if (handleAuthError(error)) return;
          setSaveStatus("error");
          console.error("Auto-save failed:", error);
        }
      };

      // SAFETY: Wait for workbook to be ready before attaching auto-save listener
      initTimeout = setTimeout(() => {
        const workbook = univerAPIRef.current?.getActiveWorkbook();
        if (!workbook) {
          console.warn('⚠️ [Collab] Workbook not ready for auto-save, skipping listener attachment');
          return;
        }

        console.log('✅ [Collab] Attaching auto-save listener');
        
        // Listen to changes
        disposable = univerAPIRef.current?.onCommandExecuted(
          (command: any) => {
            setIsEditing(true);
            if (timeout) clearTimeout(timeout);
            setSaveStatus("saving");
            timeout = setTimeout(() => {
              saveToDatabase();
              // Mark as not editing 3 seconds after last change
              setTimeout(() => setIsEditing(false), 3000);
            }, 2000);
          },
        );
      }, 600); // Wait for workbook initialization

      return () => {
        if (initTimeout) clearTimeout(initTimeout);
        disposable?.dispose();
        if (timeout) clearTimeout(timeout);
        saveToDatabase(); // Final save on unmount
      };
    }, [generationId, lastSavedContent]);

    // AUTO-REFRESH content from database every 10 seconds
    useEffect(() => {
      if (!generationId || !univerAPIRef.current) return;

      const refreshFromDatabase = async () => {
        // Don't refresh while user is editing!
        if (isEditing) return;

        try {
          const response = await api.get(`/ai/generation/${generationId}`);

          if (response.data?.status === "success") {
            const latestContent = response.data.data?.result?.editorState;

            if (latestContent && univerAPIRef.current) {
              const workbook = univerAPIRef.current.getActiveWorkbook();
              if (!workbook || typeof workbook.save !== 'function') {
                console.warn('⚠️ [Collab] Workbook or save() not available for refresh');
                return;
              }

              const currentContent = workbook.save();
              const latestJSON =
                typeof latestContent === "string"
                  ? JSON.parse(latestContent)
                  : latestContent;

              // Update if content changed
              if (
                JSON.stringify(currentContent) !== JSON.stringify(latestJSON)
              ) {
                try {
                  // SAFETY: Check if univerAPIRef is still available
                  if (!univerAPIRef.current) {
                    console.warn('⚠️ [Collab] Univer API not available during refresh');
                    return;
                  }
                  
                  // Dispose current workbook and load new data
                  const workbookId = workbook.getId() as string;
                  univerAPIRef.current.disposeUnit(workbookId);
                  
                  // Add delay before recreating
                  setTimeout(() => {
                    if (univerAPIRef.current) {
                      univerAPIRef.current.createWorkbook(latestJSON);
                    }
                  }, 50);
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
    }, [generationId, isEditing]);

  
    return (
      <>
        {/* Active Users Bar */}
        {/* {activeUsers.length > 0 && (
          <div className="absolute top-0 left-0 right-0 bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between z-[9999]">
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
        )} */}

        {/* Save Status Indicator */}
        {/* <div className="absolute top-4 right-[200px] z-[9999] flex gap-2">
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
                </div> */}

     

        <div ref={containerRef} className="w-full h-full" />

        

      
      </>
    );
  },
);

CollaborativeUniverSheet.displayName = "CollaborativeUniverSheet";

export default CollaborativeUniverSheet;
