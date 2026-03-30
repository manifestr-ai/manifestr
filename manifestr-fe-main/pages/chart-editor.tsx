import React, { useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import TopHeader from "../components/spreadsheet/TopHeader";
import BottomToolbar from "../components/spreadsheet/BottomToolbar";
import {
  FloatingSheetTab,
  FloatingFAB,
} from "../components/spreadsheet/FloatingElements";
import ChartJsEditor from "../components/chart-editor/ChartJsEditor";
import dynamic from "next/dynamic";

const CollaborativeChartJsEditor = dynamic(
  () => import("../components/chart-editor/CollaborativeChartJsEditor"),
  { ssr: false }
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
  
  const useCollaboration = !!actualGenerationId; // Enable collaboration if we have a generation ID

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      <Head>
        <title>Chart Editor | Manifestr</title>
      </Head>

      {/* Top Section */}
      <div className="flex-none z-30">
        <TopHeader 
          editorType="document"
          documentId={actualGenerationId}
          documentTitle="Chart"
          enableCollaboration={useCollaboration}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex relative overflow-hidden">
        {useCollaboration && actualGenerationId ? (
          <CollaborativeChartJsEditor generationId={actualGenerationId} />
        ) : (
          <ChartJsEditor />
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex-none z-30">
        <BottomToolbar />
      </div>
    </div>
  );
}
