import React from "react";

interface StylePanelProps {
  store: any;
}

export default function StylePanel({ store }: StylePanelProps) {
  // Icon URLs from Figma - STYLE TAB
  const imgInsertStyle = "https://www.figma.com/api/mcp/asset/4a387516-66ad-4328-a4f2-b4d4263662d0";
  const imgTheme = "https://www.figma.com/api/mcp/asset/77d8d64d-0220-4be9-987f-f4e0f9e4edd1";
  const imgShadow = "https://www.figma.com/api/mcp/asset/f876f56f-8989-40cc-987f-0d6e01000730";
  const imgOutline = "https://www.figma.com/api/mcp/asset/895b58cf-2619-4881-8917-77f3346540c5";
  const imgGlow = "https://www.figma.com/api/mcp/asset/7d417954-cc25-4cdd-9f0f-1ae2db22a57f";
  const imgGradient = "https://www.figma.com/api/mcp/asset/166af798-235e-4024-a78c-ca79333e9cab";

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[78px] overflow-x-auto px-6">
      {/* Insert Style */}
      <div className="h-[78px] w-[86px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Insert Style
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <img alt="" className="block size-[18px]" src={imgInsertStyle} />
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
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <img alt="" className="block size-[18px]" src={imgTheme} />
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
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgShadow} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Shadow
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgOutline} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Outline
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgGlow} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Glow
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[73px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgGradient} />
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
