import React from "react";
import { Maximize, Layout, ArrowUpDown, Layers, Minimize, Sparkles, Type, MousePointer, Move, Grid3x3, Heading, FileText, RotateCw } from "lucide-react";

interface PageLayoutPanelProps {
  store: any;
}

export default function PageLayoutPanel({ store }: PageLayoutPanelProps) {

  const [headingsActive, setHeadingsActive] = React.useState(true);

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[78px] overflow-x-auto px-6">
      {/* Responsive Sizing */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Responsive Sizing
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Maximize className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Auto-fit
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Layout className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Padding
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Layer Control */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Layer Control
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <ArrowUpDown className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Reorder
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[73px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Layers className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Stacking
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Scaling */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Scaling
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[70px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Minimize className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Min/Max
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[82px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Sparkles className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                AI Suggest
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Alignment */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Alignment
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[81px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Type className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Title/Label
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[92px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <MousePointer className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Click-to-Edit
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Interaction */}
      <div className="h-[78px] w-[96px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Interaction
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <Move className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Drag Reorder
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Sheet Options */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Sheet Options
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent bg-[rgba(255,255,255,0.5)] h-[54px] w-[72px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Grid3x3 className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Gridlines
              </p>
            </div>
          </button>
          <button
            onClick={() => setHeadingsActive(!headingsActive)}
            className={`border h-[54px] w-[75px] shrink-0 rounded-[14px] transition-all ${
              headingsActive
                ? "bg-[#eff6ff] border-[#8ec5ff] shadow-sm"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Heading className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className={`font-inter font-normal leading-[14px] text-[11px] tracking-[0.065px] ${
                headingsActive ? "text-[#155dfc]" : "text-[#364153]"
              }`}>
                Headings
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Page Setup */}
      <div className="h-[78px] w-[86px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Page Setup
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <FileText className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Page Setup
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Margins */}
      <div className="h-[78px] w-[68px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Margins
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <Layout className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Margins
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Orientation */}
      <div className="h-[78px] w-[85px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Orientation
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <RotateCw className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Orientation
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
