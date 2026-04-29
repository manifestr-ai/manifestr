import React from "react";

interface ShapesPanelProps {
  store: any;
}

type ShapeConfig = {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  figureSubType:
    | "rect"
    | "circle"
    | "triangle"
    | "diamond"
    | "pentagon"
    | "hexagon"
    | "star"
    | "rightArrow"
    | "leftArrow"
    | "speechBubble"
    | "line";
  cornerRadius?: number;
};

const shapeConfigs: ShapeConfig[] = [
  {
    name: "Rectangle",
    width: 220,
    height: 140,
    icon: <div className="w-6 h-4 border border-black rounded-sm bg-transparent" />,
    figureSubType: "rect",
  },
  {
    name: "Rounded Rect",
    width: 220,
    height: 140,
    icon: <div className="w-6 h-4 border border-black rounded-md bg-transparent" />,
    figureSubType: "rect",
    cornerRadius: 18,
  },
  {
    name: "Circle",
    width: 170,
    height: 170,
    icon: <div className="w-5 h-5 border border-black rounded-full bg-transparent" />,
    figureSubType: "circle",
  },
  {
    name: "Triangle",
    width: 190,
    height: 160,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <polygon points="10,1 19,15 1,15" fill="none" stroke="black" strokeWidth={2} />
      </svg>
    ),
    figureSubType: "triangle",
  },
  {
    name: "Diamond",
    width: 190,
    height: 160,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <polygon points="10,1 19,8 10,15 1,8" fill="none" stroke="black" strokeWidth={2} />
      </svg>
    ),
    figureSubType: "diamond",
  },
  {
    name: "Pentagon",
    width: 190,
    height: 165,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <polygon points="10,1 18,6 15,15 5,15 2,6" fill="none" stroke="black" strokeWidth={2} />
      </svg>
    ),
    figureSubType: "pentagon",
  },
  {
    name: "Hexagon",
    width: 220,
    height: 150,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <polygon points="6,1 14,1 19,8 14,15 6,15 1,8" fill="none" stroke="black" strokeWidth={2} />
      </svg>
    ),
    figureSubType: "hexagon",
  },
  {
    name: "Star",
    width: 200,
    height: 200,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <polygon points="10,1 12.8,6.2 18.5,6.7 14,10.4 15.3,15.5 10,12.7 4.7,15.5 6,10.4 1.5,6.7 7.2,6.2" fill="none" stroke="black" strokeWidth={1.5} />
      </svg>
    ),
    figureSubType: "star",
  },
  {
    name: "Arrow Right",
    width: 250,
    height: 130,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <path d="M2 8h13M11 4l4 4-4 4" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    figureSubType: "rightArrow",
  },
  {
    name: "Arrow Left",
    width: 250,
    height: 130,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <path d="M18 8H5M9 4L5 8l4 4" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    figureSubType: "leftArrow",
  },
  {
    name: "Line",
    width: 260,
    height: 80,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <line x1="2" y1="12" x2="18" y2="4" stroke="black" strokeWidth={2} />
      </svg>
    ),
    figureSubType: "line",
  },
  {
    name: "Speech",
    width: 250,
    height: 170,
    icon: (
      <svg width={20} height={16} viewBox="0 0 20 16" className="block">
        <path d="M2 2h16v10H8l-3 3v-3H2z" fill="none" stroke="black" strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    ),
    figureSubType: "speechBubble",
  },
];

export default function ShapesPanel({ store }: ShapesPanelProps) {
  if (!store) return null;

  const addShape = (shape: ShapeConfig) => {
    const page = store.activePage;
    if (!page?.addElement) return;
    const el = page.addElement({
      type: "figure",
      subType: shape.figureSubType,
      x: Math.round((store.width - shape.width) / 2),
      y: Math.round((store.height - shape.height) / 2),
      width: shape.width,
      height: shape.height,
      fill: "rgba(0,0,0,0)",
      stroke: "#111827",
      strokeWidth: shape.figureSubType === "line" ? 6 : 4,
      cornerRadius: shape.cornerRadius || 0,
    });
    if (el) store.selectElements([el]);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-gray-400">Shapes</span>

      <div className="grid grid-cols-3 gap-2 max-h-[260px] overflow-y-auto pr-1">
        {shapeConfigs.map((shape) => (
          <button
            key={shape.name}
            onClick={() => addShape(shape)}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded hover:bg-gray-100 transition"
          >
            {shape.icon}

            <span className="text-[10px] text-gray-600">
              {shape.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
