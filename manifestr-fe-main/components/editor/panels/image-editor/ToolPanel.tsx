import React from "react";
import InsertPanel from "./InsertPanel";
import FormatPanel from "./FormatPanel";
import AdjustPanel from "./AdjustPanel";
import StylePanel from "../comman-panel/StylePanel";
import TransformPanel from "./TransformPanel";
import FiltersPanel from "./FiltersPanel";
import TextPanel from "./TextPanel";
import ColorPanel from "./ColorPanel";
import EffectPanel from "./EffectPanel";
import AiPrompterPanel from "../comman-panel/AiPrompterPanel";

interface ToolPanelProps {
  activeTool: string;
  store: any;
}

export default function ToolPanel({ activeTool, store }: ToolPanelProps) {
  if (!activeTool) return null;

  switch (activeTool) {
    case "ai_prompter":
      return <AiPrompterPanel store={store} />;
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

    case "text":
      return <TextPanel store={store} />;

    case "color":
      return <ColorPanel store={store} />;

    case "effects":
      return <EffectPanel store={store} />;

    default:
      return null;
  }
}
