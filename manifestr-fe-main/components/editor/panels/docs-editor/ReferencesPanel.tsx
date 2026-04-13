import React, { useState } from "react";

interface ReferencesPanelProps {
  store?: any;
}

export default function ReferencesPanel({ store }: ReferencesPanelProps) {
  // Icon URLs from Figma - REFERENCES TAB
  const imgInsertTOC = "https://www.figma.com/api/mcp/asset/6f236302-505f-4ab4-9ed5-c6e21f5bea26";
  const imgUpdate = "https://www.figma.com/api/mcp/asset/0da7cf3c-bc29-41a2-a5bc-7eb69996a654";
  const imgFootnote = "https://www.figma.com/api/mcp/asset/5cd8a72e-640c-4fe6-a57c-4e71c0133908";
  const imgEndnote = "https://www.figma.com/api/mcp/asset/ab24e227-6686-4518-8f1b-be3c640e04de";
  const imgDropdown = "https://www.figma.com/api/mcp/asset/949f329a-96e4-4653-a325-b5ca4afa5715";
  const imgCitation = "https://www.figma.com/api/mcp/asset/4b54869a-43b3-48de-bb98-fb1e50c436e6";
  const imgSources = "https://www.figma.com/api/mcp/asset/e0277955-2dae-4f03-ad7b-a4dfb5e0cb16";
  const imgBibliography = "https://www.figma.com/api/mcp/asset/b24a71d0-fbf3-4cb7-a353-84f44a80a543";
  const imgCaption = "https://www.figma.com/api/mcp/asset/b06be560-5f83-458a-ba23-b1073d107833";
  const imgCrossRef = "https://www.figma.com/api/mcp/asset/e76f39cc-108b-4ae8-bbe1-ac4114824f2d";
  const imgInsertIndex = "https://www.figma.com/api/mcp/asset/f40efa34-3d62-422a-a2f4-8ca53c429f4c";

  const [citationStyle, setCitationStyle] = useState("APA");

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[79px] overflow-x-auto px-6">
      {/* Table of Contents */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Table of Contents
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[78px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgInsertTOC} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Insert TOC
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgUpdate} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Update
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Notes */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Notes
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[75px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgFootnote} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Footnote
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgEndnote} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Endnote
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Citations */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Citations
        </p>
        <div className="flex gap-2 items-end">
          <div className="relative">
            <select
              value={citationStyle}
              onChange={(e) => setCitationStyle(e.target.value)}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[140px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>APA</option>
              <option>MLA</option>
              <option>Chicago</option>
              <option>Harvard</option>
            </select>
            <img alt="" className="absolute right-3 top-[11px] size-3 pointer-events-none" src={imgDropdown} />
          </div>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgCitation} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Citation
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgSources} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Sources
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[86px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgBibliography} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Bibliography
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Captions & References */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Captions & References
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgCaption} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Caption
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[78px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgCrossRef} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Cross-ref
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Index */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Index
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[82px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgInsertIndex} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Insert Index
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgUpdate} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Update
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
