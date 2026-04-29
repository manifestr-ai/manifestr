import React from "react";
import InsertPanel from "./InsertPanel";
import HomePanel from "./HomePanel";
import FormatPanel from "./FormatPanel";
import FormulasPanel from "./FormulasPanel";
import DataPanel from "./DataPanel";
import PageLayoutPanel from "./PageLayoutPanel";
import StylePanel from "./StylePanel";
import AiPrompterPanel from "../comman-panel/AiPrompterPanel";

interface ToolPanelProps {
  activeTool: string;
  store: any;
  setActiveTool?: (tool: any) => void;
}

export default function ToolPanel({ activeTool, store, setActiveTool }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "ai_prompter":
      return (
        <AiPrompterPanel 
          store={store} 
          editorType="spreadsheet"
          onClose={() => setActiveTool?.(null)}
        />
      );

    case "insert":
      return <InsertPanel store={store} />;

    case "home":
      return <HomePanel store={store} />;

    case "format":
      return <FormatPanel store={store} />;

    case "style":
      return <StylePanel store={store} />;

    case "page_layout":
      return <PageLayoutPanel store={store} />;

    case "formulas":
      return <FormulasPanel store={store} />;

    case "data":
      return <DataPanel store={store} />;

    default:
      return null;
  }
}
