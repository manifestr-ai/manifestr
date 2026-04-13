import React from "react";

interface ReviewPanelProps {
  store?: any;
}

export default function ReviewPanel({ store }: ReviewPanelProps) {
  // Icon URLs from Figma - REVIEW TAB
  const imgFind = "https://www.figma.com/api/mcp/asset/593e4508-39e2-40e9-9ef0-0f769a0f51d1";
  const imgReplace = "https://www.figma.com/api/mcp/asset/2af02242-f31a-40a4-8ba4-f95c3eda2546";
  const imgSelectAll = "https://www.figma.com/api/mcp/asset/e63c397b-e718-4a12-acb7-b257e4d50858";
  const imgSpellCheck = "https://www.figma.com/api/mcp/asset/533ed37c-880b-4f02-bfd4-718d8287d9d5";
  const imgThesaurus = "https://www.figma.com/api/mcp/asset/3baba350-b98c-448e-b154-3b85ce717fc8";
  const imgWordCount = "https://www.figma.com/api/mcp/asset/d466074f-b741-427c-8131-1c916263231d";
  const imgNewComment = "https://www.figma.com/api/mcp/asset/00f42780-9039-4a71-9c88-232e0ff51e09";
  const imgShowComments = "https://www.figma.com/api/mcp/asset/b23f40b2-ea60-42f2-a755-cef1d9293d99";
  const imgTrackChanges = "https://www.figma.com/api/mcp/asset/c2ca3f1c-bf47-456a-8875-5eaf23b792e9";

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[79px] overflow-x-auto px-6">
      {/* Find & Replace Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Find & Replace
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgFind} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Find
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgReplace} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Replace
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[79px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgSelectAll} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Select All
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Proofing Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Proofing
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[83px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgSpellCheck} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Spell Check
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[76px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgThesaurus} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Thesaurus
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[89px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgWordCount} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Word Count
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Comments & Tracking Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Comments & Tracking
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[55px] w-[97px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgNewComment} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                New Comment
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[104px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgShowComments} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Show Comments
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[98px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgTrackChanges} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Track Changes
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
