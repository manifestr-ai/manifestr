import React from "react";
import AIPromptPanel from "./AIPromptPanel";
import FormatPanel from "./FormatPanel";
import InsertPanel from "./InsertPanel";
import LayoutPanel from "./LayoutPanel";
import ReferencesPanel from "./ReferencesPanel";
import ReviewPanel from "./ReviewPanel";
import StylePanel from "./StylePanel";

interface ToolPanelProps {
  activeTool: string | null;
  store?: any;
}

export default function ToolPanel({ activeTool, store }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "ai-prompt":
      return <AIPromptPanel store={store} />;
    case "format":
      return <FormatPanel store={store} />;
    case "insert":
      return <InsertPanel store={store} />;
    case "layout":
      return <LayoutPanel store={store} />;
    case "references":
      return <ReferencesPanel store={store} />;
    case "review":
      return <ReviewPanel store={store} />;
    case "style":
      return <StylePanel store={store} />;
    default:
      return null;
  }
}
