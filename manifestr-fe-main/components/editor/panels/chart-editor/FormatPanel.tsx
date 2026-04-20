import React from "react";

interface FormatPanelProps {
  store: any;
}

export default function FormatPanel({ store }: FormatPanelProps) {
  // Icon URLs from Figma
  const imgRules = "https://www.figma.com/api/mcp/asset/31287771-b9c0-49e7-b560-623c35511d00";
  const imgBorders = "https://www.figma.com/api/mcp/asset/a0a25c28-4fcb-4f00-8e07-99a611b4b57d";
  const imgFills = "https://www.figma.com/api/mcp/asset/98e95801-511f-4fdf-a95c-5c87653ef481";
  const imgFormats = "https://www.figma.com/api/mcp/asset/1ec7442c-50bb-424b-992c-8b2f5c085b84";
  const imgFreeze = "https://www.figma.com/api/mcp/asset/0ccbe550-9823-49c5-add3-730d0e8fbb96";
  const imgMerge = "https://www.figma.com/api/mcp/asset/fbced4d7-4d75-4b06-9680-f34470c0affd";
  const imgSplit = "https://www.figma.com/api/mcp/asset/5f660781-d69d-4e3c-9cfe-d426f801710a";
  const imgWrap = "https://www.figma.com/api/mcp/asset/05b016e1-d988-42bc-bd7d-a845ecebae0b";
  const imgAlign = "https://www.figma.com/api/mcp/asset/c44cbd00-3bda-4bd1-a434-b6ff2c5fcd74";
  const imgRotate = "https://www.figma.com/api/mcp/asset/14e11a50-35bd-4fc8-86b0-2932cb89be2e";

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[78px] overflow-x-auto px-6">
      {/* Conditional Formatting */}
      <div className="h-[78px] w-[145px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs">
          Conditional Formatting
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <img alt="" className="block size-[18px]" src={imgRules} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Rules
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Cell Styles */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Cell Styles
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgBorders} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Borders
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgFills} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Fills
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgFormats} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Formats
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Freeze Rows/Cols */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Freeze Rows/Cols
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[90px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgFreeze} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Freeze Rows
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[88px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgFreeze} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Freeze Cols
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Merge / Split Cells */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Merge / Split Cells
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgMerge} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Merge
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgSplit} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Split
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Text Tools */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Text Tools
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgWrap} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Wrap
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgAlign} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Align
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgRotate} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Rotate
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
