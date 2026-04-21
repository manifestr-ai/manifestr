import React from "react";
import { Table2, Plus, BarChart3, Shapes, Smile, Link2, Hash } from "lucide-react";

interface InsertPanelProps {
  store: any;
}

export default function InsertPanel({ store }: InsertPanelProps) {

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[104px] overflow-x-auto px-6">
      {/* Tables */}
      <div className="h-[88px] w-[75px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Tables
        </p>
        <button
          onClick={() => store?.openTableModal?.()}
          className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col gap-1.5 items-center justify-center h-full">
            <Table2 className="size-5" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-4 text-[#364153] text-xs">
              Table
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Rows & Columns */}
      <div className="h-[104px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center h-4 pt-1.5">
          Rows & Columns
        </p>
        <div className="flex gap-2 h-20">
          <button
            onClick={() => store?.insertRow?.()}
            className="border border-transparent h-20 w-[83px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Plus className="size-5" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                Insert Row
              </p>
            </div>
          </button>
          <button
            onClick={() => store?.insertColumn?.()}
            className="border border-transparent h-20 w-[93px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Plus className="size-5" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                Insert Column
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Charts */}
      <div className="h-[88px] w-[75px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Charts
        </p>
        <button
          onClick={() => {
            store?.setActiveTool?.("charts");
            store?.showToast?.("Chart tools opened");
          }}
          className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col gap-1.5 items-center justify-center h-full">
            <BarChart3 className="size-5" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-4 text-[#364153] text-xs">
              Chart
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Illustrations */}
      <div className="h-[88px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Illustrations
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => store?.openInsertPicker?.('shapes')}
            className="border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col gap-1.5 items-center justify-center h-full">
              <Shapes className="size-5" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-4 text-[#364153] text-xs">
                Shapes
              </p>
            </div>
          </button>
          <button
            onClick={() => store?.openInsertPicker?.('icons')}
            className="border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col gap-1.5 items-center justify-center h-full">
              <Smile className="size-5" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-4 text-[#364153] text-xs">
                Icons
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Links */}
      <div className="h-[88px] w-[75px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Links
        </p>
        <button
          onClick={() => store?.openInsertPicker?.('link')}
          className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col gap-1.5 items-center justify-center h-full">
            <Link2 className="size-5" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-4 text-[#364153] text-xs">
              Link
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Symbols */}
      <div className="h-[88px] w-[76px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Symbols
        </p>
        <button
          onClick={() => store?.openInsertPicker?.('symbols')}
          className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col gap-1.5 items-center justify-center h-full">
            <Hash className="size-5" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-4 text-[#364153] text-xs">
              Symbol
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
