import React, { useState } from "react";
import ToolPanel from "./panels/docs-editor/ToolPanel";

interface DocsEditorBottomToolbarProps {
  store?: any;
  editor?: any;
}

export default function DocsEditorBottomToolbar({ store, editor }: DocsEditorBottomToolbarProps) {
  const [activeTool, setActiveTool] = useState<string | null>("format");

  // Icon URLs from Figma
  const imgAIPrompt = "https://www.figma.com/api/mcp/asset/75e42433-bc9b-4596-a961-c842d9c63add";
  const imgFormat = "https://www.figma.com/api/mcp/asset/13a3f1da-cf15-4551-8e68-d20acea74cff";
  const imgInsert = "https://www.figma.com/api/mcp/asset/a17aa667-81f1-4674-82ea-7386764c8c4d";
  const imgLayout = "https://www.figma.com/api/mcp/asset/b49eddc8-269b-4108-b609-e3153685cca6";
  const imgReferences = "https://www.figma.com/api/mcp/asset/20ec8492-a4ef-4f64-9a62-5a904a5adff4";
  const imgReview = "https://www.figma.com/api/mcp/asset/afa6036d-bf6e-47c2-83d9-6ac4a8e3b04d";
  const imgStyle = "https://www.figma.com/api/mcp/asset/d7e1b147-ed28-4fba-9b90-c2ab581227b9";

  const tools = [
    {
      id: "ai-prompt",
      label: "AI Prompter",
      icon: imgAIPrompt,
    },
    {
      id: "format",
      label: "Format",
      icon: imgFormat,
    },
    {
      id: "insert",
      label: "Insert",
      icon: imgInsert,
    },
    {
      id: "layout",
      label: "Layout",
      icon: imgLayout,
    },
    {
      id: "references",
      label: "References",
      icon: imgReferences,
    },
    {
      id: "review",
      label: "Review",
      icon: imgReview,
    },
    {
      id: "style",
      label: "Style",
      icon: imgStyle,
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
              <img 
                alt="" 
                className="block size-4" 
                src={tool.icon} 
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
