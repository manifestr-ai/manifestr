import React from "react";

interface FiltersPanelProps {
  store: any;
}

export default function FiltersPanel({ store }: FiltersPanelProps) {
  const selected = store.selectedElements?.[0];

  // if (!selected || selected.type !== "image") {
  //   return (
  //     <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
  //       Select an image to apply filters
  //     </div>
  //   );
  // }

  const applyFilter = (type: string) => {
    switch (type) {
      case "grayscale":
        selected.set({
          opacity: 0.9,
          fill: "#888888",
        });
        break;

      case "sepia":
        selected.set({
          opacity: 0.95,
          fill: "#704214",
        });
        break;

      case "blur":
        selected.set({
          blurRadius: 5,
        });
        break;

      case "brighten":
        selected.set({
          opacity: 1,
          fill: "#ffffff",
        });
        break;

      case "darken":
        selected.set({
          opacity: 0.7,
        });
        break;

      case "reset":
        selected.set({
          opacity: 1,
          fill: "",
          blurRadius: 0,
        });
        break;

      default:
        break;
    }
  };

  const FilterButton = ({ label, active }: any) => (
    <button
      className={`flex flex-col justify-center items-center gap-2 w-[98px] p-[9px] rounded-[14px] border border-[#E5E7EB]
        transition
        ${
          active
            ? "border-blue-500  bg-[#F9FAFB]  shadow-sm"
            : "bg-white hover:bg-gray-100"
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
