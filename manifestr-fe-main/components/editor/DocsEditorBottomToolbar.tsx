import React, { useState } from "react";
import ToolPanel from "./panels/docs-editor/ToolPanel";
import { Sparkles, Type, Plus, PanelBottomOpen, Link2, MessageSquare, Wand2 } from "lucide-react";

interface DocsEditorBottomToolbarProps {
  store?: any;
  editor?: any;
}

export default function DocsEditorBottomToolbar({ store, editor }: DocsEditorBottomToolbarProps) {
  const [activeTool, setActiveTool] = useState<string | null>("format");

  const tools = [
    {
      id: "ai-prompt",
      label: "AI Prompter",
      icon: Sparkles,
    },
    {
      id: "format",
      label: "Format",
      icon: Type,
    },
    {
      id: "insert",
      label: "Insert",
      icon: Plus,
    },
    {
      id: "layout",
      label: "Layout",
      icon: PanelBottomOpen,
    },
    {
      id: "references",
      label: "References",
      icon: Link2,
    },
    {
      id: "review",
      label: "Review",
      icon: MessageSquare,
    },
    {
      id: "style",
      label: "Style",
      icon: Wand2,
    },
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === "ai-prompt") {
      return;
    }
    setActiveTool(activeTool === toolId ? null : toolId);
  };

  return (
    <div className="flex flex-col">
      {/* Tool Panel (shows above toolbar) */}
      {activeTool && activeTool !== "ai-prompt" && (
        <ToolPanel activeTool={activeTool} store={store} editor={editor} />
      )}

      {/* Bottom Toolbar */}
      <div className="bg-[#3a3a3a] flex items-center gap-2 pl-6 h-[60px]">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`flex items-center gap-2 h-9 px-4 rounded-md transition-all ${
                isActive
                  ? "bg-white shadow-sm"
                  : "hover:bg-[#4a4a4a]"
              }`}
            >
              <tool.icon
                className="size-4" 
                stroke={isActive ? "#101828" : "#d1d5dc"}
                strokeWidth={1.5} 
              />
              <p className={`font-inter font-normal text-sm leading-5 tracking-[-0.15px] whitespace-nowrap ${
                isActive ? "text-[#101828]" : "text-[#d1d5dc]"
              }`}>
                {tool.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
