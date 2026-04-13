import React from "react";

interface FiltersPanelProps {
  store: any;
}

export default function FiltersPanel({ store }: FiltersPanelProps) {
  const selected = store.selectedElements?.[0];

  if (!selected || selected.type !== "image") {
    return (
      <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
        Select an image to apply filters
      </div>
    );
  }

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

  const FilterButton = ({ label, type }: any) => (
    <button
      onClick={() => applyFilter(type)}
      className="flex flex-col items-center justify-center w-[80px] h-[60px] border rounded hover:bg-gray-100 transition text-xs"
    >
      {label}
    </button>
  );

  return (
    <div className="h-[110px] bg-white border-b px-6 flex items-center gap-4 overflow-x-auto">

      <FilterButton label="Grayscale" type="grayscale" />
      <FilterButton label="Sepia" type="sepia" />
      <FilterButton label="Blur" type="blur" />
      <FilterButton label="Bright" type="brighten" />
      <FilterButton label="Dark" type="darken" />

      {/* Divider */}
      <div className="w-px h-[50px] bg-gray-200 mx-2" />

      <FilterButton label="Reset" type="reset" />

      

    </div>
  );
}