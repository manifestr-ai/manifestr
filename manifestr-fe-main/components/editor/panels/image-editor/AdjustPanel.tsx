import React, { useState, useEffect } from "react";

interface AdjustPanelProps {
  store: any;
}

export default function AdjustPanel({ store }: AdjustPanelProps) {
  const selected = store.selectedElements?.[0];

  const [values, setValues] = useState({
    exposure: 0,
    brightness: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
  });

  // Apply simulated effects
  useEffect(() => {
    if (!selected) return;

    // Simulate brightness via opacity + slight tint
    selected.set({
      opacity: 1 - values.exposure * 0.01,
    });

    // Simulate contrast via scale trick (visual feel)
    selected.set({
      scaleX: 1 + values.contrast * 0.001,
      scaleY: 1 + values.contrast * 0.001,
    });

  }, [values, selected]);

  if (!selected || selected.type !== "image") {
    return (
      <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
        Select an image to adjust
      </div>
    );
  }

  const handleChange = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const resetAll = () => {
    setValues({
      exposure: 0,
      brightness: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
    });

    selected.set({
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
    });
  };

  const Slider = ({ label, keyName }: any) => (
    <div className="flex flex-col items-start w-[140px]">
      <div className="flex justify-between w-full text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{values[keyName] > 0 ? `+${values[keyName]}` : values[keyName]}</span>
      </div>

      <input
        type="range"
        min="-100"
        max="100"
        value={values[keyName]}
        onChange={(e) => handleChange(keyName, Number(e.target.value))}
        className="border rounded py-1 pt-2"
        style={{ height: "18px" }}
      />
    </div>
  );

  return (
    <div className="h-[100px] bg-white border-b px-6 flex items-center gap-6">

      <Slider label="Exposure" keyName="exposure" />
      <Slider label="Brightness" keyName="brightness" />
      <Slider label="Contrast" keyName="contrast" />
      <Slider label="Highlights" keyName="highlights" />
      <Slider label="Shadows" keyName="shadows" />

      {/* Divider */}
      <div className="w-px h-[40px] bg-gray-200" />

      {/* Reset */}
      <button
        onClick={resetAll}
        className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
      >
        Reset All
      </button>
    </div>
  );
}