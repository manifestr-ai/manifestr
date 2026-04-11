import React from "react";

interface DataPanelProps {
  store: any;
}

export default function DataPanel({ store }: DataPanelProps) {
  if (!store) return null;

  return (
    <div className="h-[90px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-6">
      {/* Chart Title */}
      <div className="flex flex-col items-start min-w-[250px]">
        <span className="text-[#6A7282] text-[12px] mb-1.5">Chart Title</span>
        <input
          type="text"
          value={store.chartTitle}
          onChange={(e) => store.setChartTitle(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-[13px] focus:outline-none focus:border-blue-500"
          placeholder="Enter chart title"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA] mx-6" />

      {/* Data Info */}
      <div className="flex flex-col items-start">
        <span className="text-[#6A7282] text-[12px] mb-1">Data Points</span>
        <div className="flex gap-4 text-[11px]">
          <span className="text-[#4A5565]">
            Labels: <strong>{store.labels.length}</strong>
          </span>
          <span className="text-[#4A5565]">
            Series: <strong>{store.datasets.length}</strong>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA] mx-6" />

      {/* Quick Actions */}
      <div className="flex flex-col items-center">
        <span className="text-[#6A7282] text-[12px] mb-1.5">Quick Actions</span>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const newLabel = `Item ${store.labels.length + 1}`;
              store.setLabels([...store.labels, newLabel]);
              store.setDatasets(store.datasets.map((ds: any) => ({
                ...ds,
                data: [...ds.data, Math.floor(Math.random() * 100)]
              })));
            }}
            className="px-3 py-1 bg-blue-500 text-white text-[11px] rounded-md hover:bg-blue-600 transition-colors"
          >
            + Add Data Point
          </button>
          <button
            onClick={() => {
              if (store.labels.length > 1) {
                store.setLabels(store.labels.slice(0, -1));
                store.setDatasets(store.datasets.map((ds: any) => ({
                  ...ds,
                  data: ds.data.slice(0, -1)
                })));
              }
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-[11px] rounded-md hover:bg-gray-300 transition-colors"
          >
            Remove Last
          </button>
        </div>
      </div>
    </div>
  );
}
