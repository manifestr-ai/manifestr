import React, { useState, useEffect, useMemo } from "react";

interface AdjustPanelProps {
  store: any;
}

const DEFAULT_ADJUST_VALUES = {
  exposure: 0,
  brightness: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const setFilterIntensity = (filters: any, key: string, intensity: number) => {
  const next = { ...(filters || {}) };
  const enabled = Math.abs(intensity) > 0.0001;
  if (!enabled) {
    if (key in next) delete next[key];
    return next;
  }
  next[key] = { ...(next[key] || {}), intensity };
  return next;
};

const getPresetBase = (preset: string) => {
  const baseReset = {
    brightnessEnabled: false,
    brightness: 0,
    filters: {},
  } as any;

  if (!preset || preset === "None") return baseReset;
  if (preset === "Vintage") {
    return {
      ...baseReset,
      brightnessEnabled: true,
      brightness: -0.05,
      filters: {
        contrast: { intensity: 0.15 },
        saturation: { intensity: -0.2 },
      },
    };
  }
  if (preset === "B&W") {
    return {
      ...baseReset,
      filters: {
        contrast: { intensity: 0.2 },
      },
    };
  }
  if (preset === "Vibrant") {
    return {
      ...baseReset,
      brightnessEnabled: true,
      brightness: 0.05,
      filters: {
        saturation: { intensity: 0.45 },
        contrast: { intensity: 0.15 },
      },
    };
  }
  if (preset === "Cool") {
    return {
      ...baseReset,
      filters: {
        hue: { intensity: -0.15 },
        saturation: { intensity: 0.1 },
      },
    };
  }
  if (preset === "Warm") {
    return {
      ...baseReset,
      filters: {
        hue: { intensity: 0.12 },
        saturation: { intensity: 0.12 },
      },
    };
  }
  if (preset === "High Contrast") {
    return {
      ...baseReset,
      filters: {
        contrast: { intensity: 0.45 },
        saturation: { intensity: 0.1 },
      },
    };
  }
  if (preset === "Soft") {
    return {
      ...baseReset,
      brightnessEnabled: true,
      brightness: 0.02,
      filters: {
        contrast: { intensity: -0.15 },
      },
    };
  }
  if (preset === "Sharpen") {
    return {
      ...baseReset,
      filters: {
        sharpen: { intensity: 0.35 },
        contrast: { intensity: 0.25 },
      },
    };
  }
  if (preset === "Noise") {
    return {
      ...baseReset,
      filters: {
        noise: { intensity: 0.25 },
      },
    };
  }
  if (preset === "Grain") {
    return {
      ...baseReset,
      filters: {
        noise: { intensity: 0.15 },
        contrast: { intensity: 0.05 },
      },
    };
  }
  if (preset === "Blur") {
    return baseReset;
  }

  return baseReset;
};

export default function AdjustPanel({ store }: AdjustPanelProps) {
  const [values, setValues] = useState(DEFAULT_ADJUST_VALUES);

  const page = store?.activePage;
  const pageChildren = Array.isArray(page?.children) ? page.children : [];
  const selectedElements = Array.isArray(store?.selectedElements) ? store.selectedElements : [];
  const selectedImages = selectedElements.filter(
    (el: any) => el?.type === "image" && typeof el?.set === "function",
  );
  const baseImage = pageChildren.find(
    (c: any) => c?.type === "image" && c?.name === "base-image" && typeof c?.set === "function",
  );
  const targets = selectedImages.length > 0 ? selectedImages : baseImage ? [baseImage] : [];
  const targetsKey = targets.map((t: any) => t?.id).filter(Boolean).join("|");
  const memoTargets = useMemo(() => targets, [targetsKey]);
  const hasTargets = memoTargets.length > 0;
  const primaryTarget = memoTargets[0];

  const getAdjustBase = (el: any) => {
    const preset =
      typeof el?.custom?.imageFilterPreset === "string" ? el.custom.imageFilterPreset : "None";
    const existing = el?.custom?.imageAdjustBase;
    if (existing && typeof existing === "object" && existing.preset === preset) return existing;

    const baseFromPreset = getPresetBase(preset);
    const nextBase = {
      preset,
      brightnessEnabled: !!baseFromPreset.brightnessEnabled,
      brightness: Number(baseFromPreset.brightness) || 0,
      filters: { ...(baseFromPreset.filters || {}) },
    };
    el.set({
      custom: {
        ...(el.custom || {}),
        imageAdjustBase: nextBase,
      },
    });
    return nextBase;
  };

  useEffect(() => {
    const fromEl = primaryTarget?.custom?.imageAdjust;
    if (fromEl && typeof fromEl === "object") {
      setValues({
        exposure: Number(fromEl.exposure) || 0,
        brightness: Number(fromEl.brightness) || 0,
        contrast: Number(fromEl.contrast) || 0,
        highlights: Number(fromEl.highlights) || 0,
        shadows: Number(fromEl.shadows) || 0,
      });
      return;
    }
    setValues(DEFAULT_ADJUST_VALUES);
  }, [primaryTarget?.id]);

  useEffect(() => {
    if (!hasTargets) return;

    const exposure = (Number(values.exposure) || 0) / 100;
    const brightness = (Number(values.brightness) || 0) / 100;
    const contrast = (Number(values.contrast) || 0) / 100;
    const highlights = (Number(values.highlights) || 0) / 100;
    const shadows = (Number(values.shadows) || 0) / 100;

    const exposureIntensity = clamp(exposure * 0.5, -1, 1);
    const brightnessIntensity = clamp(brightness * 0.35, -1, 1);
    const contrastIntensity = clamp(contrast * 0.8, -1, 1);
    const highlightsIntensity = clamp(highlights * 0.8, -1, 1);
    const shadowsIntensity = clamp(shadows * 0.8, -1, 1);

    memoTargets.forEach((el: any) => {
      if (el?.type !== "image" || typeof el?.set !== "function") return;
      const base = getAdjustBase(el);
      const baseBrightness = Number(base?.brightness) || 0;
      const baseFilters = base?.filters || {};

      const nextBrightness = clamp(
        baseBrightness +
          brightnessIntensity +
          exposureIntensity * 0.35 +
          highlightsIntensity * 0.12 +
          shadowsIntensity * 0.12,
        -1,
        1,
      );
      const nextBrightnessEnabled = Math.abs(nextBrightness) > 0.0001;

      const baseContrast = Number(baseFilters?.contrast?.intensity) || 0;
      const baseExposure = Number(baseFilters?.exposure?.intensity) || 0;
      const baseHighlights = Number(baseFilters?.highlights?.intensity) || 0;
      const baseShadows = Number(baseFilters?.shadows?.intensity) || 0;

      let nextFilters = { ...(baseFilters || {}) };
      nextFilters = setFilterIntensity(nextFilters, "contrast", baseContrast + contrastIntensity);
      nextFilters = setFilterIntensity(nextFilters, "exposure", baseExposure + exposureIntensity);
      nextFilters = setFilterIntensity(
        nextFilters,
        "highlights",
        baseHighlights + highlightsIntensity,
      );
      nextFilters = setFilterIntensity(nextFilters, "shadows", baseShadows + shadowsIntensity);

      el.set({
        brightnessEnabled: nextBrightnessEnabled,
        brightness: nextBrightnessEnabled ? nextBrightness : 0,
        filters: nextFilters,
        custom: {
          ...(el.custom || {}),
          imageAdjust: values,
        },
      });
    });
  }, [values, memoTargets, hasTargets]);

  const handleChange = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const resetAll = () => {
    setValues(DEFAULT_ADJUST_VALUES);
    if (!hasTargets) return;
    memoTargets.forEach((el: any) => {
      if (el?.type !== "image" || typeof el?.set !== "function") return;
      const preset =
        typeof el?.custom?.imageFilterPreset === "string" ? el.custom.imageFilterPreset : "None";
      const base = getPresetBase(preset);
      const nextCustom = { ...(el.custom || {}) } as any;
      delete nextCustom.imageAdjust;
      delete nextCustom.imageAdjustBase;
      el.set({
        brightnessEnabled:
          !!base.brightnessEnabled && Math.abs(Number(base.brightness) || 0) > 0.0001,
        brightness: Number(base.brightness) || 0,
        filters: { ...(base.filters || {}) },
        custom: nextCustom,
      });
    });
  };

  const Slider = ({ label, keyName, icon }: any) => (
    <div className="flex items-center gap-3 flex-1">
      <span dangerouslySetInnerHTML={{ __html: icon }} />

      <div className="flex flex-col">
        <span className="text-[12px] text-[#6B7280]">{label}</span>

        <div className="flex items-center gap-3 mt-1">
          {/* slider */}
          <input
            type="range"
            min="-100"
            max="100"
            value={values[keyName]}
            disabled={!hasTargets}
            onChange={(e) => handleChange(keyName, Number(e.target.value))}
            className="outline-none appearance-none"
            style={{
              width: "133px",
              height: "16px",
              borderRadius: "16777200px",
              border: "1px solid #D1D5DC",
              color: "#fff",
            }}
          />

          {/* value */}
          <span className="text-[12px] text-[#6B7280] w-[40px]">
            {values[keyName] > 0 ? `+${values[keyName]}` : values[keyName]}
          </span>
        </div>
      </div>
    </div>
  );

  let svgBright = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_10291_379220)">
    <path d="M7.9987 10.6654C9.47146 10.6654 10.6654 9.47146 10.6654 7.9987C10.6654 6.52594 9.47146 5.33203 7.9987 5.33203C6.52594 5.33203 5.33203 6.52594 5.33203 7.9987C5.33203 9.47146 6.52594 10.6654 7.9987 10.6654Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 1.33203V2.66536" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 13.332V14.6654" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.28516 3.28516L4.22516 4.22516" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.7734 11.7734L12.7134 12.7134" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1.33203 8H2.66536" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.332 8H14.6654" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.22516 11.7734L3.28516 12.7134" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.7134 3.28516L11.7734 4.22516" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_10291_379220">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`;
  let svgContrast = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_10291_379261)">
    <path d="M7.9987 14.6654C11.6806 14.6654 14.6654 11.6806 14.6654 7.9987C14.6654 4.3168 11.6806 1.33203 7.9987 1.33203C4.3168 1.33203 1.33203 4.3168 1.33203 7.9987C1.33203 11.6806 4.3168 14.6654 7.9987 14.6654Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 12C9.06087 12 10.0783 11.5786 10.8284 10.8284C11.5786 10.0783 12 9.06087 12 8C12 6.93913 11.5786 5.92172 10.8284 5.17157C10.0783 4.42143 9.06087 4 8 4V12Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_10291_379261">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`;

  return (
    <div className="h-[102px] bg-white border-b px-6 flex items-center gap-2 overflow-x-auto">
      <div className="flex flex-col items-center min-w-[300px]">
        <div className="flex flex-row items-center gap-[2px]">
          <Slider label="Exposure" keyName="exposure" icon={svgBright} />
          <Slider label="Brightness" keyName="brightness" icon={svgBright} />
          <Slider label="Contrast" keyName="contrast" icon={svgContrast} />
          <Slider label="Highlights" keyName="highlights" icon={svgBright} />
          <Slider label="Shadows" keyName="shadows" icon={svgBright} />
        </div>
      </div>
      {/* Divider */}
      <div className="w-px h-[40px] bg-gray-200" />

      <div className="flex flex-col items-center min-w-[150px]">
        <div className="flex flex-row items-center">
          {/* Reset */}
          <button
            onClick={resetAll}
            disabled={!hasTargets}
            className="inline-flex justify-center items-start gap-[8px] rounded-[14px] bg-[#F3F4F6] text-sm"
            style={{
              padding: "8.5px 15.453px 7.5px 16px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M14 8C14 9.18669 13.6481 10.3467 12.9888 11.3334C12.3295 12.3201 11.3925 13.0892 10.2961 13.5433C9.19975 13.9974 7.99335 14.1162 6.82946 13.8847C5.66558 13.6532 4.59648 13.0818 3.75736 12.2426C2.91825 11.4035 2.3468 10.3344 2.11529 9.17054C1.88378 8.00666 2.0026 6.80026 2.45673 5.7039C2.91085 4.60754 3.67989 3.67047 4.66658 3.01118C5.65328 2.35189 6.81331 2 8 2C9.68 2 11.2867 2.66667 12.4933 3.82667L14 5.33333"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.0013 2V5.33333H10.668"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
