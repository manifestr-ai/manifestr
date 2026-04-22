import React from "react";

interface ShapesPanelProps {
  store: any;
}

type ShapeConfig = {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  svg: string;
};

const makeSvgDataUrl = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const shapeConfigs: ShapeConfig[] = [
  {
    name: "Rectangle",
    width: 220,
    height: 140,
    icon: <div className="w-6 h-4 border border-black rounded-sm bg-transparent" />,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="140"><rect x="8" y="8" width="204" height="124" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
  },
  {
    name: "Rounded Rect",
    width: 220,
    height: 140,
    icon: <div className="w-6 h-4 border border-black rounded-md bg-transparent" />,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="140"><rect x="8" y="8" width="204" height="124" rx="18" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
  },
  {
    name: "Circle",
    width: 170,
    height: 170,
    icon: <div className="w-5 h-5 border border-black rounded-full bg-transparent" />,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="170" height="170"><circle cx="85" cy="85" r="72" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="160"><polygon points="95,10 180,150 10,150" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="160"><polygon points="95,12 178,80 95,148 12,80" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="165"><polygon points="95,10 175,60 145,154 45,154 15,60" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="150"><polygon points="60,8 160,8 212,75 160,142 60,142 8,75" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="100,12 126,66 186,72 142,114 154,176 100,146 46,176 58,114 14,72 74,66" fill="none" stroke="#111827" stroke-width="4"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="130"><path d="M20 65h170M160 25l60 40-60 40" fill="none" stroke="#111827" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="130"><path d="M230 65H60M90 25L30 65l60 40" fill="none" stroke="#111827" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="80"><line x1="10" y1="66" x2="250" y2="14" stroke="#111827" stroke-width="6"/></svg>`,
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
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="170"><path d="M12 12h226v106H104l-38 38v-38H12z" fill="none" stroke="#111827" stroke-width="4" stroke-linejoin="round"/></svg>`,
  },
];

export default function ShapesPanel({ store }: ShapesPanelProps) {
  if (!store) return null;

  const addShape = (shape: ShapeConfig) => {
    store.activePage?.addElement?.({
      type: "image",
      src: makeSvgDataUrl(shape.svg),
      x: Math.round((store.width - shape.width) / 2),
      y: Math.round((store.height - shape.height) / 2),
      width: shape.width,
      height: shape.height,
    });
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
