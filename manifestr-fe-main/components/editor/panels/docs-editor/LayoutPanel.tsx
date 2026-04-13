import React, { useState } from "react";

interface LayoutPanelProps {
  store?: any;
}

export default function LayoutPanel({ store }: LayoutPanelProps) {
  // Icon URLs from Figma
  const imgMargins = "https://www.figma.com/api/mcp/asset/13c86d99-13e2-43aa-9f95-0598919ab075";
  const imgOrientation = "https://www.figma.com/api/mcp/asset/915dfe16-3c60-42ba-85e5-93070355a52e";
  const imgSize = "https://www.figma.com/api/mcp/asset/e124d1cd-0fd3-4fdd-a351-bb589d865291";
  const imgColumns = "https://www.figma.com/api/mcp/asset/e5efdd2e-ce83-4d67-8347-f7d0d6755e64";
  const imgBreaks = "https://www.figma.com/api/mcp/asset/1e06051c-982d-4057-9fe8-4f837c6a5547";

  const [indentLeft, setIndentLeft] = useState(0);
  const [indentRight, setIndentRight] = useState(0);
  const [spacingBefore, setSpacingBefore] = useState(0);
  const [spacingAfter, setSpacingAfter] = useState(0);

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-5 h-[120px] overflow-x-auto px-6">
      {/* Page Setup Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Page Setup
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgMargins} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Margins
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[86px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgOrientation} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Orientation
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgSize} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Size
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Layout Options Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Layout Options
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[76px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgColumns} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Columns
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgBreaks} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Breaks
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Paragraph Spacing Section */}
      <div className="h-[81px] flex flex-col shrink-0 w-[388px]">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center mb-2">
          Paragraph Spacing
        </p>
        <div className="flex items-center gap-3">
          {/* Indent Label */}
          <p className="font-inter font-normal leading-[15px] text-[#6a7282] text-[10px] tracking-[0.117px]">
            Indent
          </p>

          {/* Indent Inputs */}
          <div className="flex gap-2">
            {/* Left */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                Left
              </p>
              <input
                type="number"
                value={indentLeft}
                onChange={(e) => setIndentLeft(Number(e.target.value))}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                cm
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                Right
              </p>
              <input
                type="number"
                value={indentRight}
                onChange={(e) => setIndentRight(Number(e.target.value))}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                cm
              </p>
            </div>
          </div>

          {/* Spacing Label */}
          <p className="font-inter font-normal leading-[15px] text-[#6a7282] text-[10px] tracking-[0.117px]">
            Spacing
          </p>

          {/* Spacing Inputs */}
          <div className="flex gap-2">
            {/* Before */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                Before
              </p>
              <input
                type="number"
                value={spacingBefore}
                onChange={(e) => setSpacingBefore(Number(e.target.value))}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                pt
              </p>
            </div>

            {/* After */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                After
              </p>
              <input
                type="number"
                value={spacingAfter}
                onChange={(e) => setSpacingAfter(Number(e.target.value))}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                pt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
