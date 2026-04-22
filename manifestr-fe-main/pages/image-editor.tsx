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

  const [store, setStore] = useState<any>(null);

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
            <PhotoEditor key={imageUrl} imageSrc={imageUrl} onStoreReady={setStore} />
          ) : imageUrl ? (
            <PhotoEditor key="default" imageSrc={imageUrl} onStoreReady={setStore} />
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

        {/* Right Sidebar (Floating over grid on the right) */}
        <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <RightSidebar
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              documentId={actualImageId}
              documentTitle="Image"
            />
          </div>
        </div>

        {/* Floating Elements */}
        <FloatingSheetTab />
        <FloatingFAB />
      </div>
    </div>
  );
}
