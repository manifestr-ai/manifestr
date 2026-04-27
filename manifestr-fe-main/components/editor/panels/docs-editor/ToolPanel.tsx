import React from "react";
import AiPrompterPanel from "../comman-panel/AiPrompterPanel";
import FormatPanel from "./FormatPanel";
import InsertPanel from "./InsertPanel";
import LayoutPanel from "./LayoutPanel";
import ReferencesPanel from "./ReferencesPanel";
import ReviewPanel from "./ReviewPanel";
import StylePanel from "./StylePanel";

interface ToolPanelProps {
  activeTool: string | null;
  store?: any;
  editor?: any;
}

export default function ToolPanel({ activeTool, store, editor }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "ai_prompter":
    case "ai-prompt":
      return <AiPrompterPanel store={store} editorType="document" />;
    case "format":
      return <FormatPanel store={store} editor={editor} />;
    case "insert":
      return <InsertPanel store={store} editor={editor} />;
    case "layout":
      return <LayoutPanel store={store} editor={editor} />;
    case "references":
      return <ReferencesPanel store={store} editor={editor} />;
    case "review":
      return <ReviewPanel store={store} editor={editor} />;
    case "style":
      return <StylePanel store={store} editor={editor} />;
    default:
      return null;
  }
}
