import React from "react";
import { FileSpreadsheet, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, RotateCcw } from "lucide-react";

interface HomePanelProps {
  store: any;
}

export default function HomePanel({ store }: HomePanelProps) {
  const hasSelection = !!store?.selectedTextTarget
  const selectedFormat = store?.getSelectedTextFormat ? store.getSelectedTextFormat() : null

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
                <FileSpreadsheet className="size-full" stroke="#364153" strokeWidth={1.5} />
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
              <button
                disabled={!hasSelection}
                onClick={() => store?.toggleTextFormat?.('bold')}
                className={`border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] transition-colors ${
                  !hasSelection ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                } ${selectedFormat?.bold ? 'bg-gray-50' : ''}`}
              >
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <Bold className="size-full" stroke="#364153" strokeWidth={1.5} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Bold
                    </p>
                  </div>
                </div>
              </button>
              <button
                disabled={!hasSelection}
                onClick={() => store?.toggleTextFormat?.('italic')}
                className={`border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] transition-colors ${
                  !hasSelection ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                } ${selectedFormat?.italic ? 'bg-gray-50' : ''}`}
              >
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <Italic className="size-full" stroke="#364153" strokeWidth={1.5} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Italic
                    </p>
                  </div>
                </div>
              </button>
              <button
                disabled={!hasSelection}
                onClick={() => store?.toggleTextFormat?.('underline')}
                className={`border border-transparent flex-1 h-16 rounded-[14px] transition-colors ${
                  !hasSelection ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                } ${selectedFormat?.underline ? 'bg-gray-50' : ''}`}
              >
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <Underline className="size-full" stroke="#364153" strokeWidth={1.5} />
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
              <button
                disabled={!hasSelection}
                onClick={() => store?.setSelectedTextAlign?.('left')}
                className={`border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] transition-colors ${
                  !hasSelection ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <AlignLeft className="size-full" stroke="#364153" strokeWidth={1.5} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Left
                    </p>
                  </div>
                </div>
              </button>
              <button
                disabled={!hasSelection}
                onClick={() => store?.setSelectedTextAlign?.('center')}
                className={`border border-transparent h-16 w-[75px] shrink-0 rounded-[14px] transition-colors ${
                  !hasSelection ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <AlignCenter className="size-full" stroke="#364153" strokeWidth={1.5} />
                  </div>
                  <div className="h-4 shrink-0">
                    <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                      Center
                    </p>
                  </div>
                </div>
              </button>
              <button
                disabled={!hasSelection}
                onClick={() => store?.setSelectedTextAlign?.('right')}
                className={`border border-transparent flex-1 h-16 rounded-[14px] transition-colors ${
                  !hasSelection ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
                  <div className="shrink-0 size-5">
                    <AlignRight className="size-full" stroke="#364153" strokeWidth={1.5} />
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

      {/* Section Divider */}
      <div className="bg-[#d1d5dc] h-16 w-px shrink-0" />

      {/* Reset Section */}
      <div className="h-[88px] w-[92.125px] shrink-0">
        <div className="flex flex-col gap-2 items-start size-full">
          <div className="h-4 w-[92.125px] shrink-0">
            <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
              Reset
            </p>
          </div>
          <button
            onClick={() => store?.resetChart?.()}
            className="flex-1 w-[92.125px] border border-transparent rounded-[14px] hover:bg-gray-50 transition-colors"
            type="button"
          >
            <div className="flex flex-col gap-1.5 items-center justify-center p-px size-full">
              <div className="shrink-0 size-5">
                <RotateCcw className="size-full" stroke="#364153" strokeWidth={1.5} />
              </div>
              <div className="h-4 shrink-0">
                <p className="font-inter font-normal leading-4 text-[#364153] text-xs whitespace-nowrap">
                  Reset
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
