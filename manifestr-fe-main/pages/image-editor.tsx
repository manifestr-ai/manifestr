import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import TopHeader from "../components/spreadsheet/TopHeader";
import { RightSidebar } from "../components/spreadsheet/RightSidebar";
import BottomToolbar from "../components/spreadsheet/BottomToolbar";
import dynamic from "next/dynamic";
import {
  FloatingSheetTab,
  FloatingFAB,
} from "../components/spreadsheet/FloatingElements";
import api from "../lib/api";

const PhotoEditor = dynamic(
  () => import("../components/image-editor/PhotoEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        Loading editor...
      </div>
    ),
  },
);

export default function ImageEditor() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const imageIdParam = router.query.id;
  const actualImageId =
    typeof imageIdParam === "string"
      ? imageIdParam
      : Array.isArray(imageIdParam)
        ? imageIdParam[0]
        : undefined;

  useEffect(() => {
    // CASE 1: Direct URL parameter (immediate generation)
    const urlParam = router.query.url as string;
    if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam);
      setImageUrl(decodedUrl);
      setLoading(false);
      return;
    }

    // CASE 2: Job ID parameter (fetch from backend with auth)
    const jobId = router.query.id as string;
    if (jobId) {
      setLoading(true);

      api
        .get(`/ai/status/${jobId}`)
        .then((response) => {
          const data = response.data;

          // Try multiple possible paths for image URL
          let generatedImageUrl = null;

          // Path 1: Direct from result.editorState
          if (data.data?.result?.editorState?.imageUrl) {
            generatedImageUrl = data.data.result.editorState.imageUrl;
          }
          // Path 2: From result (for image jobs)
          else if (data.data?.result?.imageUrl) {
            generatedImageUrl = data.data.result.imageUrl;
          }
          // Path 3: Direct in data
          else if (data.data?.imageUrl) {
            generatedImageUrl = data.data.imageUrl;
          }

          if (generatedImageUrl) {
            setImageUrl(generatedImageUrl);
          } else {
            console.error("❌ No image URL found in job result");
            setImageUrl("/assets/dummy/dummy-trainer.jpg");
          }
        })
        .catch((err) => {
          console.error("❌ Failed to fetch job:", err);
          setImageUrl("/assets/dummy/dummy-trainer.jpg");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // No params - use default
      setImageUrl("/assets/dummy/dummy-trainer.jpg");
      setLoading(false);
    }
  }, [router.query]);

  // Fetch active users
  useEffect(() => {
    if (!actualImageId) return;

    const fetchActiveUsers = async () => {
      try {
        const response = await api.get(
          `/collaborations/${actualImageId}/active-users`,
        );
        if (response.data.status === "success") {
          setActiveUsers(response.data.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch active users:", error);
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 5000);

    return () => clearInterval(interval);
  }, [actualImageId]);

  // Start collaboration session
  useEffect(() => {
    if (!actualImageId) return;

    const startSession = async () => {
      try {
        await api.post("/collaborations/session/start", {
          documentId: actualImageId,
          sessionId: `img-${Date.now()}`,
          userColor: "#3b82f6",
        });
      } catch (error: any) {
        console.error("Failed to start collaboration session:", error);
      }
    };

    startSession();

    return () => {
      api
        .post("/collaborations/session/end", { documentId: actualImageId })
        .catch(() => {});
    };
  }, [actualImageId]);

  const [store, setStore] = useState<any>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const clampZoom = (value: number) => Math.min(3, Math.max(0.2, value));

  const getStoreScale = () => {
    const scale =
      store && typeof store.scale === "number" && Number.isFinite(store.scale)
        ? store.scale
        : 1;
    return scale;
  };

  const setStoreScale = (value: number) => {
    if (!store || typeof store.setScale !== "function") return;
    store.setScale(clampZoom(value));
  };

  const handleZoomIn = () => setStoreScale(getStoreScale() + 0.1);
  const handleZoomOut = () => setStoreScale(getStoreScale() - 0.1);
  const handleZoomReset = () => setStoreScale(1);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      <Head>
        <title>Image Editor | Manifestr</title>
      </Head>

      {/* Top Section */}
      <div className="flex-none z-30">
        <TopHeader
          store={store}
          editorType="image"
          documentId={actualImageId}
          documentTitle="Image"
          enableCollaboration={!!actualImageId}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex relative overflow-hidden bg-gray-100">
        {/* Grid Container (Full Size) */}
        <div className="flex-grow overflow-hidden relative z-10">
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

          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Loading AI-generated image...
                </p>
                <p className="text-gray-400 text-sm mt-2">Please wait...</p>
              </div>
            </div>
          ) : imageUrl && imageUrl !== "/assets/dummy/dummy-trainer.jpg" ? (
            <div className={activeUsers.length > 0 ? "pt-12" : ""} style={{ height: '100%' }}>
              <PhotoEditor 
                key={imageUrl} 
                imageSrc={imageUrl} 
                onStoreReady={setStore}
                onActiveToolChange={setActiveTool}
              />
            </div>
          ) : imageUrl ? (
            <div className={activeUsers.length > 0 ? "pt-12" : ""} style={{ height: '100%' }}>
              <PhotoEditor 
                key="default" 
                imageSrc={imageUrl} 
                onStoreReady={setStore}
                onActiveToolChange={setActiveTool}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <p className="text-gray-600 text-lg">No image loaded</p>
                <p className="text-gray-400 text-sm mt-2">
                  Go to Create Project → DESIGN studio to generate an AI image
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Floating over grid on the right) - Hide when AI Prompter is active */}
        {activeTool !== "ai_prompter" && (
          <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <RightSidebar
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
                documentId={actualImageId}
                documentTitle="Image"
                documentType="image"
              />
            </div>
          </div>
        )}

        {/* Floating Elements */}
        <FloatingSheetTab />
        <FloatingFAB />
      </div>
    </div>
  );
}
