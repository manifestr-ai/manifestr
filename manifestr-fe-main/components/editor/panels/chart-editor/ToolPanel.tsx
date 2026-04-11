import React from "react";
import ChartTypePanel from "./ChartTypePanel";
import DataPanel from "./DataPanel";
import StylePanel from "./StylePanel";

interface ToolPanelProps {
  activeTool: string;
  store: any;
}

export default function ToolPanel({ activeTool, store }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "charts":
      return <ChartTypePanel store={store} />;

    case "data":
      return <DataPanel store={store} />;

    case "style":
      return <StylePanel store={store} />;

    default:
      return null;
  }
}
