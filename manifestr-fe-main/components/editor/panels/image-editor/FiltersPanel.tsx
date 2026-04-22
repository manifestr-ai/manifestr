import React from "react";

interface FiltersPanelProps {
  store: any;
}

export default function FiltersPanel({ store }: FiltersPanelProps) {
  const selectedElements = Array.isArray(store.selectedElements) ? store.selectedElements : [];
  const selectedImages = selectedElements.filter(
    (el: any) => el?.type === "image" && typeof el?.set === "function",
  );
  const hasSelectedImages = selectedImages.length > 0;
  const activePreset = (() => {
    if (!hasSelectedImages) return "None";
    const first =
      typeof selectedImages[0]?.custom?.imageFilterPreset === "string"
        ? selectedImages[0].custom.imageFilterPreset
        : "None";
    const allSame = selectedImages.every((el: any) => {
      const p =
        typeof el?.custom?.imageFilterPreset === "string"
          ? el.custom.imageFilterPreset
          : "None";
      return p === first;
    });
    return allSame ? first : "";
  })();

  const applyPreset = (preset: string) => {
    const currentSelected = Array.isArray(store.selectedElements) ? store.selectedElements : [];
    const targets = currentSelected.filter(
      (el: any) => el?.type === "image" && typeof el?.set === "function",
    );
    if (targets.length === 0) return;

    targets.forEach((target: any) => {
      const baseReset = {
        blurEnabled: false,
        blurRadius: 0,
        grayscaleEnabled: false,
        sepiaEnabled: false,
        brightnessEnabled: false,
        brightness: 0,
        filters: {},
        custom: {
          ...(target.custom || {}),
          imageFilterPreset: preset,
        },
      };

      if (preset === "None") {
        target.set(baseReset);
        return;
      }

      if (preset === "Vintage") {
        target.set({
          ...baseReset,
          sepiaEnabled: true,
          brightnessEnabled: true,
          brightness: -0.05,
          filters: {
            contrast: { intensity: 0.15 },
            saturation: { intensity: -0.2 },
          },
        });
        return;
      }

      if (preset === "B&W") {
        target.set({
          ...baseReset,
          grayscaleEnabled: true,
          filters: {
            contrast: { intensity: 0.2 },
          },
        });
        return;
      }

      if (preset === "Vibrant") {
        target.set({
          ...baseReset,
          brightnessEnabled: true,
          brightness: 0.05,
          filters: {
            saturation: { intensity: 0.45 },
            contrast: { intensity: 0.15 },
          },
        });
        return;
      }

      if (preset === "Cool") {
        target.set({
          ...baseReset,
          filters: {
            hue: { intensity: -0.15 },
            saturation: { intensity: 0.1 },
          },
        });
        return;
      }

      if (preset === "Warm") {
        target.set({
          ...baseReset,
          filters: {
            hue: { intensity: 0.12 },
            saturation: { intensity: 0.12 },
          },
        });
        return;
      }

      if (preset === "High Contrast") {
        target.set({
          ...baseReset,
          filters: {
            contrast: { intensity: 0.45 },
            saturation: { intensity: 0.1 },
          },
        });
        return;
      }

      if (preset === "Soft") {
        target.set({
          ...baseReset,
          brightnessEnabled: true,
          brightness: 0.02,
          filters: {
            contrast: { intensity: -0.15 },
          },
        });
        return;
      }

      if (preset === "Blur") {
        target.set({
          ...baseReset,
          blurEnabled: true,
          blurRadius: 6,
        });
        return;
      }

      if (preset === "Sharpen") {
        target.set({
          ...baseReset,
          filters: {
            sharpen: { intensity: 0.35 },
            contrast: { intensity: 0.25 },
          },
        });
        return;
      }

      if (preset === "Noise") {
        target.set({
          ...baseReset,
          filters: {
            noise: { intensity: 0.25 },
          },
        });
        return;
      }

      if (preset === "Grain") {
        target.set({
          ...baseReset,
          filters: {
            noise: { intensity: 0.15 },
            contrast: { intensity: 0.05 },
          },
        });
      }
    });
  };

  const FilterButton = ({ label }: { label: string }) => (
    <button
      type="button"
      disabled={!hasSelectedImages}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        applyPreset(label);
      }}
      className={`flex flex-col justify-center items-center gap-2 w-[98px] p-[9px] rounded-[14px] border border-[#E5E7EB]
        transition
        ${
          activePreset === label
            ? "border-blue-500  bg-[#F9FAFB]  shadow-sm"
            : hasSelectedImages
              ? "bg-white hover:bg-gray-100"
              : "bg-white opacity-60"
        }
      `}
    >
      {/* Preview Box */}
      <div className="w-[70px] h-[45px] rounded-md mb-1 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            background:
              label === "None"
                ? "linear-gradient(135deg, #8B5CF6, #EC4899, #F97316)"
                : label === "Vintage"
                  ? "linear-gradient(135deg, #D4A373, #B08968)"
                  : label === "B&W"
                    ? "linear-gradient(135deg, #9CA3AF, #4B5563)"
                    : label === "Vibrant"
                      ? "linear-gradient(135deg, #EC4899, #F97316)"
                      : label === "Cool"
                        ? "linear-gradient(135deg, #14B8A6, #0EA5E9)"
                        : label === "Warm"
                          ? "linear-gradient(135deg, #F59E0B, #F97316)"
                          : label === "High Contrast"
                            ? "linear-gradient(135deg, #DB2777, #BE123C)"
                            : label === "Soft"
                              ? "linear-gradient(135deg, #FBCFE8, #F472B6)"
                              : label === "Blur"
                                ? "linear-gradient(135deg, #E879F9, #F472B6)"
                                : label === "Sharpen"
                                  ? "linear-gradient(135deg, #F43F5E, #F97316)"
                                  : label === "Noise"
                                    ? "linear-gradient(135deg, #EC4899, #F97316)"
                                    : label === "Grain"
                                      ? "linear-gradient(135deg, #F472B6, #FB7185)"
                                      : "#ddd",
            filter: label === "Blur" ? "blur(2px)" : "none",
          }}
        />
      </div>

      {/* Label */}
      <span className="text-[11px] text-[#6B7280]">{label}</span>
    </button>
  );

  return (
    <div className="h-[102px] bg-white border-b px-6 flex items-center gap-4 overflow-x-auto">
      <div className=" flex items-center mr-6">
        <span className="text-[13px] text-[#6B7280] font-medium">Filters</span>
      </div>

      {/* Toolbar Buttons */}
      <div className="flex items-center gap-3">
        <FilterButton label="None" />
        <FilterButton label="Vintage" />
        <FilterButton label="B&W" />
        <FilterButton label="Vibrant" />
        <FilterButton label="Cool" />
        <FilterButton label="Warm" />
        <FilterButton label="High Contrast" />
        <FilterButton label="Soft" />
        <FilterButton label="Blur" />
        <FilterButton label="Sharpen" />
        <FilterButton label="Noise" />
        <FilterButton label="Grain" />
      </div>
    </div>
  );
}
