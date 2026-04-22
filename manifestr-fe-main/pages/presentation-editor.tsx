import React, { useRef, useState } from "react";
import Head from "next/head";
import TopHeader from "../components/spreadsheet/TopHeader";
import { RightSidebar } from "../components/spreadsheet/RightSidebar";
import BottomToolbar from "../components/spreadsheet/BottomToolbar";
import {
  FloatingSheetTab,
  FloatingFAB,
} from "../components/spreadsheet/FloatingElements";
import dynamic from "next/dynamic";
import useGenerationLoader from "../hooks/useGenerationLoader";
import GenerationLoaderUI from "../components/shared/GenerationLoaderUI";

const PresentationEditor = dynamic(
  () => import("../components/presentation-editor/PresentationEditor"),
  { ssr: false },
);

const CollaborativePresentationEditor = dynamic(
  () =>
    import("../components/presentation-editor/CollaborativePresentationEditor"),
  { ssr: false },
);

export default function PresentationEditorPage() {
  const { loading, error, status, content, id } = useGenerationLoader();
  // When AI content arrives, force a full remount of PresentationEditor so the
  // Polotno store is created fresh — calling loadJSON() on a live store while
  // MobX observers are active causes "dead parent" crashes.
  const isValidContent =
    content &&
    Array.isArray((content as any).pages) &&
    (content as any).pages.length > 0;
  const editorKey = isValidContent ? "ai-generated" : "preview";

  // Ensure generationId is string
  const actualGenerationId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined;

  const useCollaboration = !!actualGenerationId; // Enable collaboration if we have a generation ID

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
    <GenerationLoaderUI loading={loading} status={status} error={error}>
      <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
        <Head>
          <title>Presentation Editor | Manifestr</title>
        </Head>

        {/* Top Section */}
        <div className="flex-none z-30">
          <TopHeader
            store={store}
            editorType="presentation"
            documentId={actualGenerationId}
            documentTitle={content?.title || "Untitled presentation"}
            enableCollaboration={useCollaboration}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex relative overflow-hidden bg-gray-100">
          {/* Grid Container (Full Size) */}
          <div className="flex-grow overflow-hidden relative z-10 h-full">
            {useCollaboration && actualGenerationId ? (
              <CollaborativePresentationEditor
                key={editorKey}
                data={content}
                generationId={actualGenerationId}
                onStoreReady={setStore}
              />
            ) : (
              <PresentationEditor
                key={editorKey}
                data={content}
                generationId={actualGenerationId}
                onStoreReady={setStore}
              />
            )}
          </div>

          {/* Right Sidebar (Floating over grid on the right) */}
          <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <RightSidebar
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
                documentId={actualGenerationId}
                documentTitle={content?.title || "Untitled presentation"}
              />
            </div>
          </div>

          {/* Floating Elements */}
          <FloatingSheetTab />
          <FloatingFAB />
        </div>
      </div>
    </GenerationLoaderUI>
  );
}
