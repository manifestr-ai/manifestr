import React from "react";

interface PageLayoutPanelProps {
  store: any;
}

export default function PageLayoutPanel({ store }: PageLayoutPanelProps) {
  // Icon URLs from Figma - PAGE LAYOUT TAB
  const imgAutoFit = "https://www.figma.com/api/mcp/asset/46384c7d-ad75-4d81-8334-255a00c4e97b";
  const imgPadding = "https://www.figma.com/api/mcp/asset/7f91f6df-417f-4064-93e7-5f3a212d8243";
  const imgReorder = "https://www.figma.com/api/mcp/asset/6a5b990f-0fe3-4521-afc9-aac98e027135";
  const imgStacking = "https://www.figma.com/api/mcp/asset/164566d6-b9d1-4ed9-8965-32f07a115273";
  const imgMinMax = "https://www.figma.com/api/mcp/asset/c5cdfb00-3332-4bb3-ad3e-341eda4dccc8";
  const imgAISuggest = "https://www.figma.com/api/mcp/asset/7e2bde2d-515b-4289-996a-5ca3d2792332";
  const imgTitleLabel = "https://www.figma.com/api/mcp/asset/c7ab351f-76e0-4175-8015-516f2527b065";
  const imgClickEdit = "https://www.figma.com/api/mcp/asset/bf0c040e-fc94-478f-a58a-dfbdbc5f32eb";
  const imgDragReorder = "https://www.figma.com/api/mcp/asset/98879636-e8c7-4b3c-8729-e194a7091167";
  const imgGridlines = "https://www.figma.com/api/mcp/asset/92317d60-0b0c-436e-875e-486cd4fbe014";
  const imgHeadings = "https://www.figma.com/api/mcp/asset/892c6e67-a96e-40ad-a5bc-8a7f781d3d2d";
  const imgPageSetup = "https://www.figma.com/api/mcp/asset/ffbdf035-6574-4175-8c99-5bc177db0452";
  const imgOrientation = "https://www.figma.com/api/mcp/asset/447ec6ba-d708-4229-bea5-1fd9d4ae62c1";

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
              <img alt="" className="block size-[18px]" src={imgAutoFit} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Auto-fit
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgPadding} />
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
              <img alt="" className="block size-[18px]" src={imgReorder} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Reorder
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[73px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgStacking} />
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
              <img alt="" className="block size-[18px]" src={imgMinMax} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Min/Max
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[82px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgAISuggest} />
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
              <img alt="" className="block size-[18px]" src={imgTitleLabel} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Title/Label
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[92px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgClickEdit} />
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
            <img alt="" className="block size-[18px]" src={imgDragReorder} />
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
              <img alt="" className="block size-[18px]" src={imgGridlines} />
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
              <img alt="" className="block size-[18px]" src={imgHeadings} />
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
            <img alt="" className="block size-[18px]" src={imgPageSetup} />
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
            <img alt="" className="block size-[18px]" src={imgAutoFit} />
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
            <img alt="" className="block size-[18px]" src={imgOrientation} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Orientation
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
