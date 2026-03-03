import React, { useRef, useState } from "react";
import Head from "next/head";
import TopHeader from "../components/spreadsheet/TopHeader";
import RightSidebar from "../components/spreadsheet/RightSidebar";
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

  return (
    <GenerationLoaderUI loading={loading} status={status} error={error}>
      <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
        <Head>
          <title>Presentation Editor | Manifestr</title>
        </Head>

        {/* Top Section */}
        <div className="flex-none z-30">
          <TopHeader />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex relative overflow-hidden bg-gray-100">
          {/* Grid Container (Full Size) */}
          <div className="flex-grow overflow-hidden relative z-10 h-full">
            <PresentationEditor
              key={editorKey}
              data={content}
              generationId={Array.isArray(id) ? id[0] : id}
            />
          </div>

          {/* Right Sidebar (Floating over grid on the right) */}
          <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <RightSidebar />
            </div>
          </div>

          {/* Floating Elements */}
          <FloatingSheetTab />
          <FloatingFAB />
        </div>

        {/* Bottom Section */}
        <div className="flex-none z-30">
          <BottomToolbar />
        </div>
      </div>
    </GenerationLoaderUI>
  );
}
