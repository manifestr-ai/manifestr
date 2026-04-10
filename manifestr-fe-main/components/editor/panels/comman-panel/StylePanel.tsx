import React from "react";

interface StylePanelProps {
  store: any;
}

export default function StylePanel({ store }: StylePanelProps) {
  const selected = store.selectedElements?.[0];

  if (!selected) {
    return (
      <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
        Select an element to style
      </div>
    );
  }

  return (
    <div className="h-[90px] bg-white border-b flex items-center px-6 gap-10">
      {/* Fill Color */}
      {"fill" in selected && (
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Fill</span>

          <input
            type="color"
            value={selected.fill || "#000000"}
            onChange={(e) => selected.set({ fill: e.target.value })}
          />
        </div>
      )}

      {/* Stroke Color */}
      {"stroke" in selected && (
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Stroke</span>

          <input
            type="color"
            value={selected.stroke || "#000000"}
            onChange={(e) => selected.set({ stroke: e.target.value })}
          />
        </div>
      )}

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Stroke Width */}
      {"strokeWidth" in selected && (
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Border</span>

          <input
            type="number"
            value={selected.strokeWidth || 0}
            onChange={(e) =>
              selected.set({ strokeWidth: Number(e.target.value) })
            }
            className="w-14 px-2 py-1 border rounded text-sm"
          />
        </div>
      )}

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Opacity */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Opacity</span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selected.opacity ?? 1}
          onChange={(e) => selected.set({ opacity: Number(e.target.value) })}
          className="border rounded py-1 pt-2"
          style={{ height: "18px" }}
        />
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Radius (for images / shapes) */}
      {"cornerRadius" in selected && (
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Radius</span>

          <input
            type="number"
            value={selected.cornerRadius || 0}
            onChange={(e) =>
              selected.set({ cornerRadius: Number(e.target.value) })
            }
            className="w-14 px-2 py-1 border rounded text-sm"
          />
        </div>
      )}
    </div>
  );
}
