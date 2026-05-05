import React, { useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import TopHeader from "../components/spreadsheet/TopHeader";
import { RightSidebar } from "../components/spreadsheet/RightSidebar";
import {
  FloatingSheetTab,
  FloatingFAB,
} from "../components/spreadsheet/FloatingElements";
import dynamic from "next/dynamic";

const ChartEditor = dynamic(
  () => import("../components/chart-editor/ChartEditor"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-900 text-xl font-semibold">Loading Chart Editor...</p>
        </div>
      </div>
    )
  }
);

export default function ChartEditorPage() {
  const router = useRouter();
  const { id: generationId } = router.query;

  // Ensure generationId is string
  const actualGenerationId = typeof generationId === 'string' 
    ? generationId 
    : Array.isArray(generationId) 
      ? generationId[0] 
      : undefined;

  const [store, setStore] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const chartDownloadRef = useRef<(() => void) | null>(null);

  const clampZoom = (value: number) => Math.min(2, Math.max(0.5, value));

  const handleZoomIn = () => {
    setZoom((prev) => clampZoom(Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => clampZoom(Number((prev - 0.1).toFixed(2))));
  };

  const handleZoomReset = () => setZoom(1);

  const handleDownloadChart = () => {
    if (chartDownloadRef.current) {
      chartDownloadRef.current();
    }
  };

  const setChartDownloadFn = (fn: () => void) => {
    chartDownloadRef.current = fn;
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      <Head>
        <title>Chart Editor | Manifestr</title>
      </Head>

      {/* Top Section */}
      <div className="flex-none z-30">
        <TopHeader 
          store={store}
          editorType="chart"
          documentId={actualGenerationId}
          documentTitle="Chart"
          enableCollaboration={!!actualGenerationId}
          onDownload={handleDownloadChart}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex relative overflow-hidden bg-gray-100">
        {/* Chart Editor Container (Full Size) */}
        <div className="flex-grow overflow-hidden relative z-10" style={{ zoom } as any}>
          <ChartEditor 
            generationId={actualGenerationId}
            onStoreReady={setStore}
            onActiveToolChange={setActiveTool}
            onDownloadReady={setChartDownloadFn}
          />
        </div>

        {/* Right Sidebar (Floating over grid on the right) - Hide when AI Prompter is active */}
        {activeTool !== "ai_prompter" && (
          <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <RightSidebar
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
                documentId={actualGenerationId}
                documentTitle="Chart"
                documentType="chart"
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
