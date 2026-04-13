import React from "react";

interface StylePanelProps {
  store?: any;
}

export default function StylePanel({ store }: StylePanelProps) {
  // Icon URLs from Figma - STYLE TAB
  const imgInsertStyle = "https://www.figma.com/api/mcp/asset/b7240381-dbcb-40ff-8aa8-25f33db4b7f1";
  const imgTheme = "https://www.figma.com/api/mcp/asset/5f923d21-23ef-4ca7-a6d3-6576cac1d71a";
  const imgColor = "https://www.figma.com/api/mcp/asset/c065955f-f732-4779-9358-d74eb5b253a9";
  const imgPattern = "https://www.figma.com/api/mcp/asset/48e879c5-54aa-40c5-a752-bc00f3dfba85";
  const imgShadow = "https://www.figma.com/api/mcp/asset/095c1b48-e1b1-47a6-a6af-1deac6a4424b";
  const imgOutline = "https://www.figma.com/api/mcp/asset/2315b5da-2e3c-423b-a462-5b4d8346af6c";
  const imgGlow = "https://www.figma.com/api/mcp/asset/055aadf6-064a-49af-bd89-be67aa980dc2";
  const imgGradient = "https://www.figma.com/api/mcp/asset/af8802ca-da5e-4114-9859-872c5c35d119";

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[89px] overflow-x-auto px-6">
      {/* Insert Style */}
      <div className="h-[79px] w-[81px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Insert Style
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <img alt="" className="block size-[18px]" src={imgInsertStyle} />
            <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
              Insert Style
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Themes */}
      <div className="h-[79px] w-[92px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Themes
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <img alt="" className="block size-[18px]" src={imgTheme} />
            <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
              Select Theme
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Background */}
      <div className="h-[80px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Background
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[65px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgColor} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Color
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors mt-[10px]">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgPattern} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Pattern
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Text Effects */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Text Effects
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgShadow} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Shadow
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgOutline} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Outline
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgGlow} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Glow
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[73px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgGradient} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Gradient
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
