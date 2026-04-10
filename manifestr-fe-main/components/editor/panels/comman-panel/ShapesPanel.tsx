import React from "react";

interface ShapesPanelProps {
  store: any;
}

const shapes = [
  {
    name: "Rectangle",
    render: () => <div className="w-6 h-4 bg-gray-600 rounded-sm" />,
    action: (store: any) =>
      store.activePage.addElement({
        type: "figure",
        subtype: "rect",
        width: 150,
        height: 100,
      }),
  },
  {
    name: "Circle",
    render: () => <div className="w-5 h-5 bg-gray-600 rounded-full" />,
    action: (store: any) =>
      store.activePage.addElement({
        type: "figure",
        subType: "circle", // Use capital T
        width: 100,
        height: 100,
        fill: "#10B981",
      }),
  },
  {
    name: "Triangle",
    render: () => (
      <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-gray-600" />
    ),
    action: (store: any) =>
      store.activePage.addElement({
        type: "figure",
        subType: "triangle", // Use capital T
        width: 120,
        height: 120,
        fill: "#EF4444",
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