import React from "react";

interface InsertPanelProps {
  store?: any;
}

export default function InsertPanel({ store }: InsertPanelProps) {
  // Icon URLs from Figma - INSERT TAB
  const imgImage = "https://www.figma.com/api/mcp/asset/68bc1e1f-7c1d-4b52-a00b-55f8444d10a3";
  const imgTable = "https://www.figma.com/api/mcp/asset/6de9984a-c7cc-46d3-a0fc-c039f39db82e";
  const imgLink = "https://www.figma.com/api/mcp/asset/b0117435-0469-40a9-8aa8-7524cab1df81";
  const imgDivider = "https://www.figma.com/api/mcp/asset/0188dfe6-2984-44fb-ab75-da4e602140ef";
  const imgDate = "https://www.figma.com/api/mcp/asset/1fe45ac6-b0b1-4b77-8e8c-ea5a1ee8fd85";
  const imgPageBreak = "https://www.figma.com/api/mcp/asset/f7b2dc0e-e934-468c-b026-87d0575d0ead";
  const imgHeader = "https://www.figma.com/api/mcp/asset/fc61b620-3d66-4401-886c-c9440f62a18e";
  const imgPageNumber = "https://www.figma.com/api/mcp/asset/944d9319-13ec-440b-b573-bbe69ab7126c";

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[79px] overflow-x-auto px-6">
      {/* Media Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Media
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgImage} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Image
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgTable} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Table
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Links & Elements Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Links & Elements
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgLink} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Link
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgDivider} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Divider
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgDate} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Date
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Page Elements Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Page Elements
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[86px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgPageBreak} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Page Break
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgHeader} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Header
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgHeader} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Footer
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgPageNumber} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Page #
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
