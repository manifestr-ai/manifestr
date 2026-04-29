import React from "react";
import AIPanel from "./AIPanel";
import HomePanel from "./HomePanel";
import InsertPanel from "./InsertPanel";
import FormatPanel from "./FormatPanel";
import ChartTypePanel from "./ChartTypePanel";
import DataPanel from "./DataPanel";
import PageLayoutPanel from "./PageLayoutPanel";
import StylePanel from "./StylePanel";

interface ToolPanelProps {
  activeTool: string;
  store: any;
  setActiveTool?: (tool: any) => void;
}

export default function ToolPanel({ activeTool, store, setActiveTool }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "ai":
      return <AIPanel store={store} />;

    case "home":
      return <HomePanel store={store} />;

    case "insert":
      return <InsertPanel store={store} />;

    case "format":
      return <FormatPanel store={store} />;

    case "charts":
      return <ChartTypePanel store={store} />;

    case "data":
      return <DataPanel store={store} />;

    case "page-layout":
      return <PageLayoutPanel store={store} />;

    case "style":
      return <StylePanel store={store} />;

    default:
      return null;
  }
}
