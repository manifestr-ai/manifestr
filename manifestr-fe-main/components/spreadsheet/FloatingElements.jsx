import React from "react";
import { Plus, PenLine } from "lucide-react";

/**
 * Spreadsheet-style sheet tab (Figma 12090:21399 / 12090:21400).
 * Use only on spreadsheet routes — Univer already renders real sheet tabs on `spreadsheet-editor`.
 * Other editors should mount `FloatingFAB` only.
 */
const TAB_W = 146;
const PLUS_LEFT = 106;

export function FloatingSheetTab() {
  return (
    <div
      className="pointer-events-auto absolute bottom-32 left-8 z-20"
      data-figma-node="12090:21399"
      data-name="SheetTabs"
    >
      <div
        className="relative h-[34px]"
        style={{ width: Math.max(TAB_W, PLUS_LEFT + 32) }}
      >
        <button
          type="button"
          className="absolute left-0 top-0 box-border flex h-[34px] w-[146px] shrink-0 items-center gap-1 rounded-tl-[4px] rounded-tr-[4px] border border-solid border-[#18181b] border-b-[0.5px] border-t-2 bg-white pb-px pl-3 pr-3 pt-[2px] text-left hover:bg-gray-50/80"
          data-figma-node="12090:21400"
          aria-label="Rename sheet"
        >
          <span
            className="min-w-0 flex-1 truncate font-sans text-[14px] font-medium leading-5 tracking-[-0.1504px] text-[#0a0a0a]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Sheet 1
          </span>
          <PenLine
            className="shrink-0 text-[#0a0a0a]"
            size={12}
            strokeWidth={2}
            aria-hidden
          />
        </button>
        <button
          type="button"
          className="absolute top-0 z-10 flex size-8 items-center justify-center rounded-lg bg-white text-[#0a0a0a] transition hover:bg-gray-50"
          style={{ left: PLUS_LEFT }}
          data-figma-node="12090:21405"
          aria-label="Add sheet"
        >
          <Plus size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function FloatingFAB() {
  return (
    <button className="absolute bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-2xl transition-transform hover:scale-105 sm:right-6 sm:h-16 sm:w-16 lg:right-8">
      <span className="font-serif text-2xl italic text-white">M.</span>
    </button>
  );
}
