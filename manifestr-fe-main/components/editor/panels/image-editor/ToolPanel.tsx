import React from "react";
import InsertPanel from "./InsertPanel";
// import FormatPanel from "./FormatPanel";
// import LayoutPanel from "./LayoutPanel";
// import AnimationPanel from "./AnimationPanel";

interface ToolPanelProps {
  activeTool: string;
  store: any;
}

export default function ToolPanel({ activeTool, store }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "insert":
      return <InsertPanel store={store} />;

    // case "format":
    //   return <FormatPanel store={store} />;

    // case "layout":
    //   return <LayoutPanel store={store} />;

    // case "animation":
    //   return <AnimationPanel store={store} />;

    default:
      return null;
  }
}