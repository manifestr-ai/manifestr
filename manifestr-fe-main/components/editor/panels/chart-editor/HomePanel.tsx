import React from "react";

interface HomePanelProps {
  store: any;
}

export default function HomePanel({ store }: HomePanelProps) {
  // Icon URLs from Figma
  const imgTemplates = "https://www.figma.com/api/mcp/asset/1d31d99d-afd9-4946-bb5c-806ba8345bcb";
  const imgBold = "https://www.figma.com/api/mcp/asset/4541aa5e-4fc7-46b2-9291-bdec1ab77fb4";
  const imgItalic = "https://www.figma.com/api/mcp/asset/bbeb3244-bc27-4b45-88c2-cbb0f8fc5783";
  const imgUnderline = "https://www.figma.com/api/mcp/asset/8680c3a2-d8f7-41ff-8c0c-8ff6467925c1";
  const imgLeft = "https://www.figma.com/api/mcp/asset/034a92ca-63a7-401c-a9b9-22139e33c0cc";
  const imgCenter = "https://www.figma.com/api/mcp/asset/6708a106-610a-45e3-b4fc-d05ab7bd1b63";
  const imgRight = "https://www.figma.com/api/mcp/asset/d704b347-6d0a-4b91-ae91-ff1a825c9575";

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex gap-4 items-center pl-6 pt-px h-[88px]">
      {/* File Section */}
      <div className="h-[88px] w-[92.125px] shrink-0">
        <div className="flex flex-col gap-2 items-start size-full">
          <div className="h-4 w-[92.125px] shrink-0">
            <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
              File
            </p>
          </div>
          <div className="flex-1 w-[92.125px] border border-transparent rounded-[14px]">
            <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
              <div className="shrink-0 size-5">
                <img alt="" className="block size-full" src={imgTemplates} />
              </div>
              <div className="h-4 shrink-0">
                <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                  Templates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Font Section */}
      <div className="h-[88px] w-[254.508px] shrink-0">
        <div className="flex flex-col gap-2 items-start size-full">
          <div className="h-4 w-[254.508px] shrink-0">
            <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
              Font
            </p>
          </div>
          <div className="flex-1 w-[254.508px]">
            <div className="flex gap-2 items-center size-full">
              <button className="border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <img alt="" className="block size-full" src={imgBold} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Bold
                    </p>
                  </div>
                </div>
              </button>
              <button className="border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <img alt="" className="block size-full" src={imgItalic} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Italic
                    </p>
                  </div>
                </div>
              </button>
              <button className="border border-transparent flex-1 h-16 rounded-[14px] hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <img alt="" className="block size-full" src={imgUnderline} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Underline
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Alignment Section */}
      <div className="h-[88px] w-[241px] shrink-0">
        <div className="flex flex-col gap-2 items-start size-full">
          <div className="h-4 w-[241px] shrink-0">
            <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
              Alignment
            </p>
          </div>
          <div className="flex-1 w-[241px]">
            <div className="flex gap-2 items-center size-full">
              <button className="border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <img alt="" className="block size-full" src={imgLeft} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Left
                    </p>
                  </div>
                </div>
              </button>
              <button className="border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <img alt="" className="block size-full" src={imgCenter} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Center
                    </p>
                  </div>
                </div>
              </button>
              <button className="border border-transparent flex-1 h-16 rounded-[14px] hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <img alt="" className="block size-full" src={imgRight} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Right
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
