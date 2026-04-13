import React, { useState } from "react";

interface FormatPanelProps {
  store?: any;
}

export default function FormatPanel({ store }: FormatPanelProps) {
  // Icon URLs from Figma - FORMAT TAB
  const imgCut = "https://www.figma.com/api/mcp/asset/0f6e6651-677e-400c-84fb-932a3756b0f9";
  const imgCopy = "https://www.figma.com/api/mcp/asset/6941d466-a05e-4067-adae-46c4609b675c";
  const imgPaste = "https://www.figma.com/api/mcp/asset/a6675df6-c205-4fff-982e-ccfd2bf6a395";
  const imgClear = "https://www.figma.com/api/mcp/asset/1f1a8028-abd9-4067-85d2-8437b366c277";
  const imgDropdown = "https://www.figma.com/api/mcp/asset/586235f5-9d68-4efa-93c9-45d860cbfd4b";
  const imgBold = "https://www.figma.com/api/mcp/asset/7e3b074f-2d0c-45ac-b754-ae54daedfba3";
  const imgItalic = "https://www.figma.com/api/mcp/asset/15aafe29-9195-4f8b-ba9b-495f211a5673";
  const imgUnderline = "https://www.figma.com/api/mcp/asset/27c8c6a9-8609-4391-997a-9a55414ad8d9";
  const imgTextColor = "https://www.figma.com/api/mcp/asset/d94d780c-4b01-4da2-b8de-ae878bfed96a";
  const imgHighlight = "https://www.figma.com/api/mcp/asset/bb913643-312f-4235-b7fd-0c671a4b4812";
  const imgAlignLeft = "https://www.figma.com/api/mcp/asset/92afd248-4994-4759-8cc6-36c00c666ae2";
  const imgAlignCenter = "https://www.figma.com/api/mcp/asset/d9ea7836-1ec7-47c2-b325-726270fc00a7";
  const imgAlignRight = "https://www.figma.com/api/mcp/asset/96ed8982-6cf8-48c1-8747-5761c948f95b";
  const imgAlignJustify = "https://www.figma.com/api/mcp/asset/e7a0eeb1-5ff0-4f00-8c81-36809944fa81";
  const imgBullets = "https://www.figma.com/api/mcp/asset/012cc8fd-4287-4cbc-ad04-12e6b62b55d7";
  const imgNumbers = "https://www.figma.com/api/mcp/asset/96d25f30-2541-4328-b535-5bc47fbf7961";
  const imgOutdent = "https://www.figma.com/api/mcp/asset/af0eef3c-6920-422a-817e-77557465eb42";
  const imgIndent = "https://www.figma.com/api/mcp/asset/8a8c9f53-19a3-4f49-8e5c-5b8323b7c37b";
  const imgSpacing = "https://www.figma.com/api/mcp/asset/d94bd09f-acc6-4e88-ab9e-e26c7d0964b4";
  const imgStrike = "https://www.figma.com/api/mcp/asset/b1959782-a5fb-4039-8715-3299cf09601f";
  const imgSubscript = "https://www.figma.com/api/mcp/asset/6c2c5c21-2e41-4a21-adc3-eca45d5421d8";
  const imgSuperscript = "https://www.figma.com/api/mcp/asset/d5e4bf77-6a3c-4ac3-9c77-16e0233f887b";

  const [style, setStyle] = useState("Normal");
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState("12pt");

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-5 h-[89px] overflow-x-auto px-6">
      {/* Quick Actions */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Quick Actions
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgCut} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Cut</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgCopy} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Copy</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgPaste} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Paste</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgClear} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Clear</p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Style */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Style</p>
        <div className="relative">
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="border border-[#d1d5dc] rounded-md h-[34px] w-[144px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
          >
            <option>Normal</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>
          <img alt="" className="absolute right-3 top-[11px] size-3 pointer-events-none" src={imgDropdown} />
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Font */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Font</p>
        <div className="flex gap-2.5 items-center">
          <div className="relative">
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[249px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>Inter</option>
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
            </select>
            <img alt="" className="absolute right-3 top-[11px] size-3 pointer-events-none" src={imgDropdown} />
          </div>
          <div className="relative">
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[80px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>8pt</option>
              <option>10pt</option>
              <option>12pt</option>
              <option>14pt</option>
              <option>16pt</option>
              <option>18pt</option>
              <option>24pt</option>
            </select>
            <img alt="" className="absolute right-3 top-[11px] size-3 pointer-events-none" src={imgDropdown} />
          </div>
          <button className="border border-transparent rounded-[10px] size-[30px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            <img alt="" className="block size-[18px]" src={imgBold} />
          </button>
          <button className="border border-transparent rounded-[10px] size-[30px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            <img alt="" className="block size-[18px]" src={imgItalic} />
          </button>
          <button className="border border-transparent rounded-[10px] size-[30px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            <img alt="" className="block size-[18px]" src={imgUnderline} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Text & Highlight Colors */}
      <div className="h-[81px] flex gap-5 shrink-0 pt-2">
        <div className="border border-transparent h-[65px] w-[39px] rounded-[14px] hover:bg-gray-50 transition-colors flex flex-col items-center justify-start pt-2 gap-1">
          <img alt="" className="block size-[18px]" src={imgTextColor} />
          <div className="bg-black h-1.5 w-8 rounded"></div>
          <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">Text</p>
        </div>
        <div className="border border-transparent h-[65px] w-[47px] rounded-[14px] hover:bg-gray-50 transition-colors flex flex-col items-center justify-start pt-2 gap-1">
          <img alt="" className="block size-[18px]" src={imgHighlight} />
          <div className="bg-yellow-400 h-1.5 w-8 rounded"></div>
          <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">Highlight</p>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Alignment */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Alignment</p>
        <div className="flex gap-2">
          <button className="border border-transparent rounded-[10px] size-[30px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            <img alt="" className="block size-4" src={imgAlignLeft} />
          </button>
          <button className="border border-transparent rounded-[10px] size-[30px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            <img alt="" className="block size-4" src={imgAlignCenter} />
          </button>
          <button className="border border-transparent rounded-[10px] size-[30px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            <img alt="" className="block size-4" src={imgAlignRight} />
          </button>
          <button className="border border-transparent rounded-[10px] size-[30px] hover:bg-gray-50 transition-colors flex items-center justify-center">
            <img alt="" className="block size-4" src={imgAlignJustify} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Lists & Spacing */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Lists & Spacing</p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgBullets} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Bullets</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgNumbers} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Numbers</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgOutdent} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Outdent</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgIndent} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Indent</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgSpacing} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Spacing</p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* More */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">More</p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgStrike} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Strike</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgSubscript} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Subscript</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgSuperscript} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Super</p>
          </button>
        </div>
      </div>
    </div>
  );
}
