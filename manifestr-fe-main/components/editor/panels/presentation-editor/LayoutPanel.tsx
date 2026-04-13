import React from "react";

interface LayoutPanelProps {
  store: any;
}

export default function LayoutPanel({ store }: LayoutPanelProps) {
  const page = store.activePage;

  if (!page) {
    return (
      <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
        No slide selected
      </div>
    );
  }

  return (
    <div className="h-[90px] bg-white border-b flex items-center px-6 gap-10">
      {/* Slide Size */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Size</span>

        <div className="flex gap-2">
          <input
            type="number"
            value={store.width}
            onChange={(e) =>
              store.setSize(Number(e.target.value), store.height)
            }
            className="w-16 px-2 py-1 border rounded text-sm"
          />

          <span className="text-gray-400">×</span>

          <input
            type="number"
            value={store.height}
            onChange={(e) => store.setSize(store.width, Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded text-sm"
          />
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Background Color */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Background</span>

        <input
          type="color"
          value={page.background || "#ffffff"}
          onChange={(e) => page.set({ background: e.target.value })}
        />
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Quick Layouts */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Layouts</span>

        <div className="flex gap-2">
          {/* Title + Subtitle */}
          <button
            onClick={() => {
              page.set({ children: [] });

              page.addElement({
                type: "text",
                text: "Title",
                fontSize: 40,
                x: 50,
                y: 50,
              });

              page.addElement({
                type: "text",
                text: "Subtitle",
                fontSize: 20,
                x: 50,
                y: 120,
              });
            }}
            className="px-2 py-1 border rounded text-xs"
          >
            Title
          </button>

          {/* Two Columns */}
          <button
            onClick={() => {
              page.set({ children: [] });

              page.addElement({
                type: "text",
                text: "Left",
                x: 50,
                y: 80,
              });

              page.addElement({
                type: "text",
                text: "Right",
                x: store.width / 2,
                y: 80,
              });
            }}
            className="px-2 py-1 border rounded text-xs"
          >
            2 Col
          </button>
        </div>
      </div>
    </div>
  );
}
