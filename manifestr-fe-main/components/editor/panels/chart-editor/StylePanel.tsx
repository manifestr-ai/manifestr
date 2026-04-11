import React from "react";

interface StylePanelProps {
  store: any;
}

export default function StylePanel({ store }: StylePanelProps) {
  if (!store) return null;

  return (
    <div className="h-[90px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0">
      {/* Color Schemes */}
      <div className="flex flex-col items-center min-w-[400px]">
        <span className="text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-1.5">
          Color Schemes
        </span>

        <div className="flex flex-row items-center gap-[24px] justify-center">
          {Object.entries(store.colorSchemes).map(([key, colors]: [string, any]) => (
            <button
              key={key}
              onClick={() => store.setSelectedColorScheme(key)}
              className={`flex flex-col items-center group transition-all ${
                store.selectedColorScheme === key ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              type="button"
            >
              <div className={`flex gap-1 p-1.5 rounded-lg ${
                store.selectedColorScheme === key 
                  ? 'bg-blue-50 border-2 border-blue-500' 
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
              }`}>
                {colors.slice(0, 5).map((color: string, i: number) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className={`text-[9px] font-inter capitalize mt-1 ${
                store.selectedColorScheme === key ? 'text-[#18181b] font-semibold' : 'text-[#4A5565]'
              }`}>
                {key}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Display Options */}
      <div className="flex flex-col items-center min-w-[250px]">
        <span className="text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-1.5">
          Display Options
        </span>

        <div className="flex flex-row items-center gap-[20px]">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={store.showLegend}
              onChange={(e) => store.setShowLegend(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-[11px] text-[#4A5565] group-hover:text-[#18181b] transition-colors">
              Show Legend
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={store.showGrid}
              onChange={(e) => store.setShowGrid(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-[11px] text-[#4A5565] group-hover:text-[#18181b] transition-colors">
              Show Grid
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
