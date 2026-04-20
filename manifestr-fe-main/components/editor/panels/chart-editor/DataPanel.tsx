import React from "react";

interface DataPanelProps {
  store: any;
}

export default function DataPanel({ store }: DataPanelProps) {
  // Icon URLs from Figma - DATA TAB
  const imgImport = "https://www.figma.com/api/mcp/asset/1089af09-6f3d-4f5f-907f-3b5223fb34e7";
  const imgVault = "https://www.figma.com/api/mcp/asset/82aa2aec-784e-47c1-9c96-2ea324280126";
  const imgUpload = "https://www.figma.com/api/mcp/asset/a6f600d0-b8f0-4eab-bf12-a37e37f8ac99";
  const imgManual = "https://www.figma.com/api/mcp/asset/a530b4e5-3db4-41f6-9527-15787e62e203";
  const imgAutoFormat = "https://www.figma.com/api/mcp/asset/03dff6bb-2bdb-4b72-b837-9832663078f1";
  const imgMissing = "https://www.figma.com/api/mcp/asset/60baa77a-5408-488c-86f8-f6f805b848ca";
  const imgClean = "https://www.figma.com/api/mcp/asset/fcba760a-278a-4818-adec-8da15a152014";
  const imgSort = "https://www.figma.com/api/mcp/asset/02d42060-9d63-45b5-ba4d-eec517c1a679";
  const imgFilter = "https://www.figma.com/api/mcp/asset/281057ae-5fef-4eef-9c15-9180abe66d23";
  const imgTextColumns = "https://www.figma.com/api/mcp/asset/0cdfd49f-0e56-427a-9601-3bc19171b7e4";
  const imgValidation = "https://www.figma.com/api/mcp/asset/4bc037f1-3033-4805-a698-0fe4680d3987";
  const imgGroup = "https://www.figma.com/api/mcp/asset/cdef8fa6-8982-400f-bc9b-ca74d9e4be4a";
  const imgUngroup = "https://www.figma.com/api/mcp/asset/cc7277c0-ef50-470b-9e95-b906883f0df7";
  const imgExport = "https://www.figma.com/api/mcp/asset/f26f3162-ca21-43a8-986b-5cb839ff5c4e";

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[78px] overflow-x-auto px-6">
      {/* Data Input */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs">
          Data Input
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[88px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgImport} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Import Data
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[92px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgVault} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Vault Source
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[85px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgUpload} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                File Upload
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[102px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgManual} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Manual Entry
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Data Preparation */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Data Preparation
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[93px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgAutoFormat} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Auto-Format
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[95px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgMissing} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Missing Data
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[83px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgClean} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Clean Data
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Sort & Filter */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Sort & Filter
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgSort} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Sort
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgFilter} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Filter
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Data Tools */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Data Tools
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[110px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgTextColumns} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Text to Columns
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[78px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgValidation} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Validation
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Outline */}
      <div className="h-[78px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Outline
        </p>
        <div className="flex gap-2">
          <button className="border border-transparent h-[54px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgGroup} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Group
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[54px] w-[71px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgUngroup} />
              <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
                Ungroup
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Export */}
      <div className="h-[78px] w-[68px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Export
        </p>
        <button className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors">
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <img alt="" className="block size-[18px]" src={imgExport} />
            <p className="font-inter font-normal leading-[14px] text-[#364153] text-[11px] tracking-[0.065px]">
              Export
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
