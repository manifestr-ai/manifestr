import React from "react";
import InsertPanel from "./InsertPanel";
import FormatPanel from "../comman-panel/FormatPanel";
import AdjustPanel from "./AdjustPanel";
import StylePanel from "../comman-panel/StylePanel";
import TransformPanel from "./TransformPanel";
import FiltersPanel from "./FiltersPanel";


interface ToolPanelProps {
  activeTool: string;
  store: any;
}

export default function ToolPanel({ activeTool, store }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "insert":
      return <InsertPanel store={store} />;

    case "format":
      return <FormatPanel store={store} />;

    case "adjust":
      return <AdjustPanel store={store} />;

    case "style":
      return <StylePanel store={store} />;

    case "transform":
      return <TransformPanel store={store} />;

    case "filter":
      return <FiltersPanel store={store} />;

    default:
      return null;
  }
}
