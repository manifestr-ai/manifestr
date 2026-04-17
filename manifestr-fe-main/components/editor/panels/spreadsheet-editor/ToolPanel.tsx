import React from "react";
import InsertPanel from "./InsertPanel";
// import FormatPanel from "./FormatPanel";
// import ArrangePanel from "./ArrangePanel";
// import StylePanel from "../comman-panel/StylePanel";
// import LayoutPanel from "./LayoutPanel";
// import AnimationPanel from "./AnimationPanel";
// import TransitionsPanel from "./TransitionsPanel";
// import SlideShowPanel from "./SlideShowPanel";

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

    // case "arrange":
    //   return <ArrangePanel store={store} />;

    // case "style":
    //   return <StylePanel store={store} />;

    // case "layout":
    //   return <LayoutPanel store={store} />;

    // case "animation":
    //   return <AnimationPanel store={store} />;

    // case "transition":
    //   return <TransitionsPanel store={store} />;

    // case "slideshow":
    //   return <SlideShowPanel store={store} />;

    default:
      return null;
  }
}
