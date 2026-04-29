import React from "react";
import InsertPanel from "./InsertPanel";
import FormatPanel from "./FormatPanel";
import ArrangePanel from "./ArrangePanel";
import StylePanel from "../comman-panel/StylePanel";
import LayoutPanel from "./LayoutPanel";
import AnimationPanel from "./AnimationPanel";
import TransitionsPanel from "./TransitionsPanel";
import SlideShowPanel from "./SlideShowPanel";
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
          editorType="presentation"
          onClose={() => setActiveTool?.(null)}
        />
      );
    case "insert":
      return <InsertPanel store={store} />;

    case "format":
      return <FormatPanel store={store} />;

    case "arrange":
      return <ArrangePanel store={store} />;

    case "style":
      return <StylePanel store={store} />;

    case "layout":
      return <LayoutPanel store={store} />;

    case "animation":
      return <AnimationPanel store={store} />;

    case "transition":
      return <TransitionsPanel store={store} />;

    case "slideshow":
      return <SlideShowPanel store={store} />;

    default:
      return null;
  }
}
