import React, { useState } from "react";

interface TransformPanelProps {
  store: any;
}

export default function TransformPanel({ store }: TransformPanelProps) {
  const selected = store.selectedElements?.[0];

  const [isCropping, setIsCropping] = useState(false);
  const [cropBox, setCropBox] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 150,
  });

  if (!selected) {
    return (
      <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
        Select an element to transform
      </div>
    );
  }

  const centerElement = () => {
    selected.set({
      x: store.width / 2 - selected.width / 2,
      y: store.height / 2 - selected.height / 2,
    });
  };

  const rotate = () => {
    selected.set({
      rotation: (selected.rotation || 0) + 90,
    });
  };

  const flipHorizontal = () => {
    selected.set({
      flipX: !selected.flipX,
    });
  };

  const flipVertical = () => {
    selected.set({
      flipY: !selected.flipY,
    });
  };

  const crop = () => {
    selected.set({
      cropX: 0.1,
      cropY: 0.1,
      cropWidth: 0.8,
      cropHeight: 0.8,
    });
  };

  return (
    <div className="h-[102px] bg-white border-b px-6 flex items-center gap-10 overflow-x-auto">
      {/* Move */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Move</span>
        <button
          onClick={centerElement}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
        >
          Center
        </button>
      </div>

      {/* Crop */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Crop</span>
        <button
          onClick={crop}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
        >
          Crop
        </button>
      </div>

      {/* Rotate */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Rotate</span>
        <button
          onClick={rotate}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
        >
          90°
        </button>
      </div>

      {/* Flip */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Flip</span>
        <div className="flex gap-2">
          <button
            onClick={flipHorizontal}
            className="px-2 py-1 border rounded text-sm"
          >
            H
          </button>
          <button
            onClick={flipVertical}
            className="px-2 py-1 border rounded text-sm"
          >
            V
          </button>
        </div>
      </div>

      {/* Resize */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Size</span>
        <div className="flex gap-2">
          <input
            type="number"
            value={Math.round(selected.width)}
            onChange={(e) => selected.set({ width: Number(e.target.value) })}
            className="w-16 px-2 py-1 border rounded text-sm"
          />
          <input
            type="number"
            value={Math.round(selected.height)}
            onChange={(e) => selected.set({ height: Number(e.target.value) })}
            className="w-16 px-2 py-1 border rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
}
