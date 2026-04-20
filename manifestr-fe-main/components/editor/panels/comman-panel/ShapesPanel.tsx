import React from "react";

interface ShapesPanelProps {
  store: any;
}

const shapes = [
  {
    name: "Rectangle",
    render: () => (
      <div className="w-6 h-4 border border-black rounded-sm bg-transparent" />
    ),
    action: (store: any) =>
      store.activePage.addElement({
        type: "figure",
        subtype: "rect",
        width: 150,
        height: 100,
        stroke: "#000000",
        fill: "none",
      }),
  },
  {
    name: "Circle",
    render: () => (
      <div className="w-5 h-5 border border-black rounded-full bg-transparent" />
    ),
    action: (store: any) =>
      store.activePage.addElement({
        type: "figure",
        subType: "circle",
        width: 100,
        height: 100,
        stroke: "#000000",
        fill: "none",
      }),
  },
  {
    name: "Triangle",
    render: () => (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <polygon points="10,0 20,16 0,16" fill="none" stroke="black" strokeWidth={2} />
      </svg>
    ),
    action: (store: any) =>
      store.activePage.addElement({
        type: "figure",
        subType: "triangle",
        width: 120,
        height: 120,
        stroke: "#000000",
        fill: "none",
      }),
  },
];
  
  

export default function ShapesPanel({ store }: ShapesPanelProps) {
  if (!store) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-gray-400">Shapes</span>

      <div className="grid grid-cols-3 gap-3">
        {shapes.map((shape) => (
          <button
            key={shape.name}
            onClick={() => shape.action(store)}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded hover:bg-gray-100 transition"
          >
            {shape.render()}

            <span className="text-[10px] text-gray-600">
              {shape.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}