import React from "react";

interface FormatPanelProps {
  store: any;
}

export default function FormatPanel({ store }: FormatPanelProps) {
  const selected = store.selectedElements?.[0];

  const isText = selected?.type === "text";

  if (!isText) {
    return (
      <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
        Select a text element to format
      </div>
    );
  }

  return (
    <div className="h-[90px] bg-white border-b flex items-center px-6 gap-10">
      {/* Font Size */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Font Size</span>

        <input
          type="number"
          value={selected.fontSize || 16}
          onChange={(e) => selected.set({ fontSize: Number(e.target.value) })}
          className="w-16 px-2 py-1 border rounded text-sm"
        />
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Bold / Italic */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Style</span>

        <div className="flex gap-2">
          <button
            onClick={() =>
              selected.set({
                fontWeight: selected.fontWeight === "bold" ? "normal" : "bold",
              })
            }
            className={`px-2 py-1 border rounded ${
              selected.fontWeight === "bold" ? "bg-gray-200" : ""
            }`}
          >
            B
          </button>

          <button
            onClick={() =>
              selected.set({
                fontStyle:
                  selected.fontStyle === "italic" ? "normal" : "italic",
              })
            }
            className={`px-2 py-1 border rounded ${
              selected.fontStyle === "italic" ? "bg-gray-200" : ""
            }`}
          >
            I
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Alignment */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Align</span>

        <div className="flex gap-2">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => selected.set({ align })}
              className={`px-2 py-1 border rounded ${
                selected.align === align ? "bg-gray-200" : ""
              }`}
            >
              {align[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Text Color */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Color</span>

        <input
          type="color"
          value={selected.fill || "#000000"}
          onChange={(e) => selected.set({ fill: e.target.value })}
        />
      </div>
    </div>
  );
}
