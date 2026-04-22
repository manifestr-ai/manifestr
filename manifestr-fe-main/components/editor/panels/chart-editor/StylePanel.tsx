import React from "react";
import { Plus, Palette, Layers, Square, Sparkles, Droplets } from "lucide-react";

interface StylePanelProps {
  store: any;
}

export default function StylePanel({ store }: StylePanelProps) {
  const hasSelection = !!store?.selectedTextTarget
  const selectedEffects = store?.getSelectedTextEffects ? store.getSelectedTextEffects() : null
  const shadowActive = !!selectedEffects && selectedEffects.shadow?.preset && selectedEffects.shadow.preset !== "none"
  const outlineActive = !!selectedEffects && selectedEffects.outline?.preset && selectedEffects.outline.preset !== "none"
  const glowActive = !!selectedEffects && selectedEffects.glow?.preset && selectedEffects.glow.preset !== "none"
  const gradientActive = !!selectedEffects && !!selectedEffects.gradient?.enabled

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[78px] overflow-x-auto px-6">
      {/* Insert Style */}
      <div className="h-[78px] w-[86px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Insert Style
        </p>
        <button
          disabled={!hasSelection}
          onClick={() => store?.openStylePicker?.("insert-style")}
          className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <Plus className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Insert Style
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Themes */}
      <div className="h-[78px] w-[98px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Themes
        </p>
        <button
          onClick={() => store?.openStylePicker?.("theme")}
          className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <Palette className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Select Theme
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Text Effects */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Text Effects
        </p>
        <div className="flex gap-2">
          <button
            disabled={!hasSelection}
            onClick={() => store?.openStylePicker?.("shadow")}
            className={`border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] transition-colors ${
              !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"
            } ${shadowActive ? "bg-gray-50" : ""}`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Layers className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Shadow
              </p>
            </div>
          </button>
          <button
            disabled={!hasSelection}
            onClick={() => store?.openStylePicker?.("outline")}
            className={`border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] transition-colors ${
              !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"
            } ${outlineActive ? "bg-gray-50" : ""}`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Square className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Outline
              </p>
            </div>
          </button>
          <button
            disabled={!hasSelection}
            onClick={() => store?.openStylePicker?.("glow")}
            className={`border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] transition-colors ${
              !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"
            } ${glowActive ? "bg-gray-50" : ""}`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Sparkles className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Glow
              </p>
            </div>
          </button>
          <button
            disabled={!hasSelection}
            onClick={() => store?.openStylePicker?.("gradient")}
            className={`border border-transparent h-[54px] w-[73px] shrink-0 rounded-[14px] transition-colors ${
              !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"
            } ${gradientActive ? "bg-gray-50" : ""}`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Droplets className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Gradient
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
