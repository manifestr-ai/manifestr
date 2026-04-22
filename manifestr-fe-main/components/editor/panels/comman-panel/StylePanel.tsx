import React, { useEffect, useMemo, useState } from "react";
import { Popover, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

interface StylePanelProps {
  store: any;
}

type ColorSchemeId =
  | "blue"
  | "emerald"
  | "purple"
  | "orange"
  | "teal"
  | "red"
  | "pink"
  | "slate";

const COLOR_SCHEMES: Record<
  ColorSchemeId,
  {
    id: ColorSchemeId;
    label: string;
    primary: string;
    secondary: string;
    neutral: string;
    textOnPrimary: string;
  }
> = {
  blue: {
    id: "blue",
    label: "Blue",
    primary: "#2563EB",
    secondary: "#60A5FA",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    primary: "#059669",
    secondary: "#34D399",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
  purple: {
    id: "purple",
    label: "Purple",
    primary: "#7C3AED",
    secondary: "#A78BFA",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
  orange: {
    id: "orange",
    label: "Orange",
    primary: "#EA580C",
    secondary: "#FB923C",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
  teal: {
    id: "teal",
    label: "Teal",
    primary: "#0D9488",
    secondary: "#2DD4BF",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
  red: {
    id: "red",
    label: "Red",
    primary: "#DC2626",
    secondary: "#FB7185",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
  pink: {
    id: "pink",
    label: "Pink",
    primary: "#DB2777",
    secondary: "#FB7185",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
  slate: {
    id: "slate",
    label: "Slate",
    primary: "#334155",
    secondary: "#94A3B8",
    neutral: "#111827",
    textOnPrimary: "#FFFFFF",
  },
};

type ThemeId = "light" | "dark" | "slate" | "paper" | "midnight" | "fog" | "ocean" | "sunset";

const THEMES: Record<
  ThemeId,
  {
    id: ThemeId;
    label: string;
    background: string;
    defaultText: string;
    scheme: ColorSchemeId;
  }
> = {
  light: {
    id: "light",
    label: "Light",
    background: "#FFFFFF",
    defaultText: "#111827",
    scheme: "blue",
  },
  dark: {
    id: "dark",
    label: "Dark",
    background: "#0B1220",
    defaultText: "#F9FAFB",
    scheme: "emerald",
  },
  slate: {
    id: "slate",
    label: "Slate",
    background: "#0F172A",
    defaultText: "#E5E7EB",
    scheme: "purple",
  },
  paper: {
    id: "paper",
    label: "Paper",
    background: "#FFFBEB",
    defaultText: "#111827",
    scheme: "orange",
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    background: "#020617",
    defaultText: "#F9FAFB",
    scheme: "blue",
  },
  fog: {
    id: "fog",
    label: "Fog",
    background: "#F8FAFC",
    defaultText: "#0F172A",
    scheme: "slate",
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    background: "#ECFEFF",
    defaultText: "#0F172A",
    scheme: "teal",
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    background: "#FFF7ED",
    defaultText: "#111827",
    scheme: "pink",
  },
};

function isFn(v: any): v is (...args: any[]) => any {
  return typeof v === "function";
}

function makeLinearGradient(angle: number, from: string, to: string) {
  return `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`;
}

export default observer(function StylePanel({ store }: StylePanelProps) {
  const selectedElements: any[] = store?.selectedElements || [];
  const selected = selectedElements[0];
  const hasSelection = selectedElements.length > 0;
  const page = store?.activePage;
  const backgroundFill = (() => {
    const children: any[] = page?.children || [];
    const bg = children.find(
      (el) =>
        el &&
        el.name === "__slide_background__" &&
        el.type === "shape" &&
        el.shapeType === "rect",
    );
    return typeof bg?.fill === "string" ? bg.fill : "#FFFFFF";
  })();

  const [themeId, setThemeId] = useState<ThemeId>("light");
  const [schemeId, setSchemeId] = useState<ColorSchemeId>("blue");
  const [gradientFrom, setGradientFrom] = useState("#2563EB");
  const [gradientTo, setGradientTo] = useState("#60A5FA");

  const scheme = useMemo(() => COLOR_SCHEMES[schemeId], [schemeId]);
  useEffect(() => {
    setGradientFrom(COLOR_SCHEMES[schemeId].primary);
    setGradientTo(COLOR_SCHEMES[schemeId].secondary);
  }, [schemeId]);

  const canUndo = !!store?.history?.canUndo;
  const canRedo = !!store?.history?.canRedo;
  const undo = () => {
    if (!isFn(store?.history?.undo)) return;
    store.history.undo();
  };
  const redo = () => {
    if (!isFn(store?.history?.redo)) return;
    store.history.redo();
  };
  const withHistoryTransaction = (fn: () => void) => {
    if (isFn(store?.history?.startTransaction) && isFn(store?.history?.endTransaction)) {
      store.history.startTransaction();
      try {
        fn();
      } finally {
        store.history.endTransaction();
      }
      return;
    }
    fn();
  };

  const applyToSelected = (payload: Record<string, any>) => {
    selectedElements.forEach((el) => {
      if (!el || !isFn(el.set)) return;
      el.set(payload);
    });
  };

  const applyFill = (fill: string) => {
    selectedElements.forEach((el) => {
      if (!el || !isFn(el.set)) return;
      if (el.type === "shape" || el.type === "text") {
        el.set({ fill });
        return;
      }
    });
  };

  const applyOutline = (stroke: string, strokeWidth: number) => {
    selectedElements.forEach((el) => {
      if (!el || !isFn(el.set)) return;
      if (el.type === "shape" || el.type === "text") {
        el.set({ stroke, strokeWidth });
        return;
      }
      if (el.type === "image") {
        el.set({ borderColor: stroke, borderSize: strokeWidth });
      }
    });
  };

  const applyShadowPreset = (
    preset:
      | { kind: "none" }
      | {
          kind: "shadow";
          blur: number;
          offsetX: number;
          offsetY: number;
          opacity: number;
          color: string;
        },
  ) => {
    if (preset.kind === "none") {
      applyToSelected({ shadowEnabled: false });
      return;
    }
    applyToSelected({
      shadowEnabled: true,
      shadowBlur: preset.blur,
      shadowOffsetX: preset.offsetX,
      shadowOffsetY: preset.offsetY,
      shadowOpacity: preset.opacity,
      shadowColor: preset.color,
    });
  };

  const applyGlowPreset = (color: string, strength: "soft" | "medium" | "strong") => {
    const blur = strength === "soft" ? 14 : strength === "medium" ? 22 : 34;
    const opacity = strength === "soft" ? 0.45 : strength === "medium" ? 0.6 : 0.75;
    applyToSelected({
      shadowEnabled: true,
      shadowBlur: blur,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowOpacity: opacity,
      shadowColor: color,
    });
  };

  const ensureBackground = () => {
    if (!page || !isFn(page.addElement)) return null;
    const children: any[] = page?.children || [];
    const existing = children.find(
      (el) =>
        el &&
        el.name === "__slide_background__" &&
        el.type === "shape" &&
        el.shapeType === "rect",
    );

    if (existing && isFn(existing.set)) return existing;

    const bg = page.addElement({
      type: "shape",
      name: "__slide_background__",
      shapeType: "rect",
      x: 0,
      y: 0,
      width: store?.width || 1920,
      height: store?.height || 1080,
      fill: "#FFFFFF",
      strokeWidth: 0,
      selectable: false,
      removable: false,
      draggable: false,
      resizable: false,
      contentEditable: false,
    });

    if (bg?.id && isFn(page.moveElementsBottom)) {
      page.moveElementsBottom([bg.id]);
    }
    return bg;
  };

  const setBackgroundColor = (color: string) => {
    const bg = ensureBackground();
    if (!bg || !isFn(bg.set)) return;
    bg.set({
      fill: color,
      x: 0,
      y: 0,
      width: store?.width || bg.width,
      height: store?.height || bg.height,
    });
    if (bg?.id && isFn(page?.moveElementsBottom)) {
      page.moveElementsBottom([bg.id]);
    }
  };

  const applyTheme = (nextThemeId: ThemeId) => {
    const next = THEMES[nextThemeId];
    setThemeId(nextThemeId);
    setSchemeId(next.scheme);
    setBackgroundColor(next.background);
    const children: any[] = page?.children || [];
    children.forEach((el) => {
      if (!el || !isFn(el.set)) return;
      if (el.type === "text") {
        el.set({ fill: next.defaultText });
      }
    });
  };

  const resetSelectionStyles = () => {
    if (!hasSelection) return;
    const defaultText = THEMES[themeId]?.defaultText || "#111827";
    withHistoryTransaction(() => {
      selectedElements.forEach((el) => {
        if (!el || !isFn(el.set)) return;
        if (el.type === "text") {
          el.set({
            fill: defaultText,
            strokeWidth: 0,
            stroke: "black",
            shadowEnabled: false,
            textDecoration: "",
            fontStyle: "normal",
            fontWeight: "normal",
          });
          return;
        }
        if (el.type === "shape") {
          el.set({
            fill: "#FFFFFF",
            strokeWidth: 0,
            stroke: "black",
            shadowEnabled: false,
          });
          return;
        }
        if (el.type === "image") {
          el.set({
            borderSize: 0,
            borderColor: "black",
            shadowEnabled: false,
          });
        }
      });
    });
  };

  const resetSlideBackground = () => {
    setBackgroundColor(THEMES[themeId]?.background || "#FFFFFF");
  };

  // if (!selected) {
  //   return (
  //     <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
  //       Select an element to style
  //     </div>
  //   );
  // }

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0">
      <div className="flex flex-col items-center min-w-[200px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          History
        </span>
        <div className="flex flex-row items-center gap-[16px]">
          <button
            className={`px-3 py-2 rounded-md transition border border-[#E5E7EB] text-[11px] ${
              canUndo ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
            }`}
            tabIndex={0}
            type="button"
            disabled={!canUndo}
            onClick={undo}
          >
            Undo
          </button>
          <button
            className={`px-3 py-2 rounded-md transition border border-[#E5E7EB] text-[11px] ${
              canRedo ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
            }`}
            tabIndex={0}
            type="button"
            disabled={!canRedo}
            onClick={redo}
          >
            Redo
          </button>
          <button
            className={`px-3 py-2 rounded-md transition border border-[#E5E7EB] text-[11px] ${
              hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
            }`}
            tabIndex={0}
            type="button"
            disabled={!hasSelection}
            onClick={resetSelectionStyles}
          >
            Reset
          </button>
        </div>
      </div>

      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Themes */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Themes
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Select Theme */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                    const t = THEMES[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => applyTheme(id)}
                        className={`flex items-center gap-2 border rounded-md px-2 py-2 ${
                          themeId === id ? "border-[#2563EB]" : "border-[#E5E7EB]"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: t.background }}
                        />
                        <div className="text-left">
                          <div className="text-[12px] text-[#111827]">{t.label}</div>
                          <div className="text-[10px] text-[#6A7282]">
                            {COLOR_SCHEMES[t.scheme].label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] hover:bg-[#F3F4F6]"
                    onClick={() => applyTheme("light")}
                  >
                    Reset Theme
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_10297_389247)">
                  <path
                    d="M7.34496 1.87239C7.37353 1.71946 7.45468 1.58133 7.57436 1.48193C7.69404 1.38254 7.84472 1.32812 8.00029 1.32812C8.15587 1.32812 8.30655 1.38254 8.42623 1.48193C8.54591 1.58133 8.62706 1.71946 8.65563 1.87239L9.35629 5.57772C9.40606 5.84115 9.53408 6.08347 9.72365 6.27304C9.91322 6.4626 10.1555 6.59062 10.419 6.64039L14.1243 7.34106C14.2772 7.36962 14.4154 7.45077 14.5147 7.57045C14.6141 7.69014 14.6686 7.84081 14.6686 7.99639C14.6686 8.15196 14.6141 8.30264 14.5147 8.42232C14.4154 8.54201 14.2772 8.62316 14.1243 8.65172L10.419 9.35239C10.1555 9.40215 9.91322 9.53017 9.72365 9.71974C9.53408 9.90931 9.40606 10.1516 9.35629 10.4151L8.65563 14.1204C8.62706 14.2733 8.54591 14.4114 8.42623 14.5108C8.30655 14.6102 8.15587 14.6647 8.00029 14.6647C7.84472 14.6647 7.69404 14.6102 7.57436 14.5108C7.45468 14.4114 7.37353 14.2733 7.34496 14.1204L6.64429 10.4151C6.59453 10.1516 6.46651 9.90931 6.27694 9.71974C6.08737 9.53017 5.84506 9.40215 5.58163 9.35239L1.87629 8.65172C1.72336 8.62316 1.58524 8.54201 1.48584 8.42232C1.38644 8.30264 1.33203 8.15196 1.33203 7.99639C1.33203 7.84081 1.38644 7.69014 1.48584 7.57045C1.58524 7.45077 1.72336 7.36962 1.87629 7.34106L5.58163 6.64039C5.84506 6.59062 6.08737 6.4626 6.27694 6.27304C6.46651 6.08347 6.59453 5.84115 6.64429 5.57772L7.34496 1.87239Z"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.332 1.33594V4.0026"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.6667 2.66406H12"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10297_389247">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span
                className="
                text-[9px]
                font-inter
                font-normal
                not-italic
                leading-[11.25px]
                tracking-[0.167px]
                text-[#4A5565]
                mt-0.5
                group-hover:text-[#18181b]
                transition-colors
              "
                style={{ fontFamily: "Inter" }}
              >
                Select Theme
              </span>
            </button>
          </Popover>

          {/* Color Scheme */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[240px]">
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(COLOR_SCHEMES) as ColorSchemeId[]).map((id) => {
                    const s = COLOR_SCHEMES[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setSchemeId(id);
                          if (hasSelection) applyFill(s.primary);
                        }}
                        className={`flex items-center gap-2 border rounded-md px-2 py-2 ${
                          schemeId === id ? "border-[#2563EB]" : "border-[#E5E7EB]"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded"
                          style={{
                            background: makeLinearGradient(135, s.primary, s.secondary),
                          }}
                        />
                        <div className="text-[12px] text-[#111827]">{s.label}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] hover:bg-[#F3F4F6]"
                    onClick={() => setSchemeId("blue")}
                  >
                    Reset Scheme
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.9987 14.6693C6.23059 14.6693 4.5349 13.9669 3.28465 12.7166C2.03441 11.4664 1.33203 9.77071 1.33203 8.0026C1.33203 6.23449 2.03441 4.5388 3.28465 3.28856C4.5349 2.03832 6.23059 1.33594 7.9987 1.33594C9.76681 1.33594 11.4625 1.96808 12.7127 3.0933C13.963 4.21851 14.6654 5.74464 14.6654 7.33594C14.6654 8.21999 14.3142 9.06784 13.6891 9.69296C13.0639 10.3181 12.2161 10.6693 11.332 10.6693H9.83203C9.61537 10.6693 9.40298 10.7296 9.21868 10.8435C9.03437 10.9574 8.88543 11.1204 8.78853 11.3142C8.69164 11.508 8.65062 11.7249 8.67008 11.9407C8.68954 12.1565 8.7687 12.3626 8.8987 12.5359L9.0987 12.8026C9.2287 12.9759 9.30786 13.182 9.32732 13.3978C9.34677 13.6136 9.30576 13.8306 9.20886 14.0244C9.11197 14.2181 8.96302 14.3811 8.77872 14.495C8.59441 14.6089 8.38203 14.6693 8.16536 14.6693H7.9987Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.0013 4.66667C9.1854 4.66667 9.33464 4.51743 9.33464 4.33333C9.33464 4.14924 9.1854 4 9.0013 4C8.81721 4 8.66797 4.14924 8.66797 4.33333C8.66797 4.51743 8.81721 4.66667 9.0013 4.66667Z"
                  fill="#364153"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.6654 7.33073C11.8495 7.33073 11.9987 7.18149 11.9987 6.9974C11.9987 6.8133 11.8495 6.66406 11.6654 6.66406C11.4813 6.66406 11.332 6.8133 11.332 6.9974C11.332 7.18149 11.4813 7.33073 11.6654 7.33073Z"
                  fill="#364153"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.33333 8.66667C4.51743 8.66667 4.66667 8.51743 4.66667 8.33333C4.66667 8.14924 4.51743 8 4.33333 8C4.14924 8 4 8.14924 4 8.33333C4 8.51743 4.14924 8.66667 4.33333 8.66667Z"
                  fill="#364153"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.66536 5.33073C5.84946 5.33073 5.9987 5.18149 5.9987 4.9974C5.9987 4.8133 5.84946 4.66406 5.66536 4.66406C5.48127 4.66406 5.33203 4.8133 5.33203 4.9974C5.33203 5.18149 5.48127 5.33073 5.66536 5.33073Z"
                  fill="#364153"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span
                className="
                text-[9px]
                font-inter
                font-normal
                not-italic
                leading-[11.25px]
                tracking-[0.167px]
                text-[#4A5565]
                mt-0.5
                group-hover:text-[#18181b]
                transition-colors
              "
                style={{ fontFamily: "Inter" }}
              >
                Color Scheme
              </span>
            </button>
          </Popover>

          {/* Background */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[240px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] text-[#111827]">Slide background</div>
                  <input
                    type="color"
                    value={backgroundFill}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    "#FFFFFF",
                    "#F3F4F6",
                    "#111827",
                    "#0B1220",
                    scheme.primary,
                    scheme.secondary,
                    "#FFFBEB",
                    "#ECFDF5",
                    "#EFF6FF",
                    "#FDF2F8",
                    "#FAF5FF",
                    "#FFF7ED",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="w-7 h-7 rounded border border-[#E5E7EB]"
                      style={{ backgroundColor: c }}
                      onClick={() => setBackgroundColor(c)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] hover:bg-[#F3F4F6]"
                    onClick={resetSlideBackground}
                  >
                    Reset Background
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_10297_389264)">
                  <path
                    d="M9.74891 11.9342L2.62891 9.99219"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.2516 1.75043C12.383 1.61902 12.539 1.51478 12.7107 1.44366C12.8824 1.37254 13.0664 1.33594 13.2523 1.33594C13.4381 1.33594 13.6221 1.37254 13.7938 1.44366C13.9655 1.51478 14.1215 1.61902 14.2529 1.75043C14.3843 1.88184 14.4886 2.03784 14.5597 2.20954C14.6308 2.38123 14.6674 2.56525 14.6674 2.75109C14.6674 2.93694 14.6308 3.12096 14.5597 3.29265C14.4886 3.46435 14.3843 3.62035 14.2529 3.75176L11.5743 6.43109C11.5118 6.4936 11.4767 6.57837 11.4767 6.66676C11.4767 6.75515 11.5118 6.83992 11.5743 6.90243L12.2036 7.53176C12.5048 7.83306 12.6741 8.24169 12.6741 8.66776C12.6741 9.09383 12.5048 9.50246 12.2036 9.80376L11.5743 10.4331C11.5117 10.4956 11.427 10.5307 11.3386 10.5307C11.2502 10.5307 11.1654 10.4956 11.1029 10.4331L5.57025 4.90109C5.50776 4.83858 5.47266 4.75382 5.47266 4.66543C5.47266 4.57704 5.50776 4.49227 5.57025 4.42976L6.19959 3.80043C6.50089 3.49917 6.90951 3.32993 7.33559 3.32993C7.76166 3.32993 8.17028 3.49917 8.47159 3.80043L9.10092 4.42976C9.16343 4.49225 9.2482 4.52736 9.33659 4.52736C9.42497 4.52736 9.50974 4.49225 9.57225 4.42976L12.2516 1.75043Z"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.0019 5.33594C4.79923 7.1426 3.35523 7.6426 1.61323 7.96794C1.55544 7.97849 1.5014 8.00392 1.45644 8.04172C1.41147 8.07952 1.37713 8.12839 1.35681 8.1835C1.33649 8.23862 1.33088 8.29808 1.34054 8.35603C1.3502 8.41397 1.3748 8.4684 1.4119 8.51394L6.2919 14.4359C6.39102 14.5412 6.52168 14.6114 6.66418 14.6359C6.80667 14.6605 6.95328 14.638 7.0819 14.5719C8.4919 13.6059 10.6686 11.1973 10.6686 10.0026"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10297_389264">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span
                className="
                text-[9px]
                font-inter
                font-normal
                not-italic
                leading-[11.25px]
                tracking-[0.167px]
                text-[#4A5565]
                mt-0.5
                group-hover:text-[#18181b]
                transition-colors
              "
                style={{ fontFamily: "Inter" }}
              >
                Background
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Quick Styles */}
      <div className="flex flex-col items-center min-w-[150px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Quick Styles
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Quick Style */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: "filled",
                      label: "Filled",
                      onClick: () => applyToSelected({ fill: scheme.primary, strokeWidth: 0 }),
                    },
                    {
                      id: "outlined",
                      label: "Outlined",
                      onClick: () => applyOutline(scheme.primary, 3),
                    },
                    {
                      id: "subtle",
                      label: "Subtle",
                      onClick: () =>
                        applyToSelected({
                          fill: "#F3F4F6",
                          stroke: "#CBD5E1",
                          strokeWidth: 2,
                        }),
                    },
                    {
                      id: "gradient",
                      label: "Gradient",
                      onClick: () =>
                        applyFill(makeLinearGradient(135, scheme.primary, scheme.secondary)),
                    },
                    {
                      id: "shadowed",
                      label: "Shadowed",
                      onClick: () => {
                        applyToSelected({ fill: scheme.primary, strokeWidth: 0 });
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 14,
                          offsetX: 6,
                          offsetY: 6,
                          opacity: 0.28,
                          color: "#000000",
                        });
                      },
                    },
                    {
                      id: "pill",
                      label: "Pill",
                      onClick: () =>
                        applyToSelected({
                          fill: scheme.primary,
                          strokeWidth: 0,
                          cornerRadius: 999,
                        }),
                    },
                    {
                      id: "glass",
                      label: "Glass",
                      onClick: () =>
                        applyToSelected({
                          fill: "rgba(255,255,255,0.3)",
                          stroke: "rgba(255,255,255,0.6)",
                          strokeWidth: 2,
                        }),
                    },
                    {
                      id: "outlineFill",
                      label: "Outline + Fill",
                      onClick: () =>
                        applyToSelected({
                          fill: scheme.secondary,
                          stroke: scheme.neutral,
                          strokeWidth: 2,
                        }),
                    },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!hasSelection}
                      onClick={s.onClick}
                      className={`border rounded-md px-2 py-2 text-left ${
                        !hasSelection
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <div className="text-[12px] text-[#111827]">{s.label}</div>
                      <div className="text-[10px] text-[#6A7282]">Apply to selection</div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      hasSelection ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={resetSelectionStyles}
                    disabled={!hasSelection}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.9987 3.9974C8.36689 3.9974 8.66536 3.69892 8.66536 3.33073C8.66536 2.96254 8.36689 2.66406 7.9987 2.66406C7.63051 2.66406 7.33203 2.96254 7.33203 3.33073C7.33203 3.69892 7.63051 3.9974 7.9987 3.9974Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.6667 3.9974C13.0349 3.9974 13.3333 3.69892 13.3333 3.33073C13.3333 2.96254 13.0349 2.66406 12.6667 2.66406C12.2985 2.66406 12 2.96254 12 3.33073C12 3.69892 12.2985 3.9974 12.6667 3.9974Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33464 3.9974C3.70283 3.9974 4.0013 3.69892 4.0013 3.33073C4.0013 2.96254 3.70283 2.66406 3.33464 2.66406C2.96645 2.66406 2.66797 2.96254 2.66797 3.33073C2.66797 3.69892 2.96645 3.9974 3.33464 3.9974Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.9987 8.66927C8.36689 8.66927 8.66536 8.37079 8.66536 8.0026C8.66536 7.63441 8.36689 7.33594 7.9987 7.33594C7.63051 7.33594 7.33203 7.63441 7.33203 8.0026C7.33203 8.37079 7.63051 8.66927 7.9987 8.66927Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.6667 8.66927C13.0349 8.66927 13.3333 8.37079 13.3333 8.0026C13.3333 7.63441 13.0349 7.33594 12.6667 7.33594C12.2985 7.33594 12 7.63441 12 8.0026C12 8.37079 12.2985 8.66927 12.6667 8.66927Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33464 8.66927C3.70283 8.66927 4.0013 8.37079 4.0013 8.0026C4.0013 7.63441 3.70283 7.33594 3.33464 7.33594C2.96645 7.33594 2.66797 7.63441 2.66797 8.0026C2.66797 8.37079 2.96645 8.66927 3.33464 8.66927Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.9987 13.3333C8.36689 13.3333 8.66536 13.0349 8.66536 12.6667C8.66536 12.2985 8.36689 12 7.9987 12C7.63051 12 7.33203 12.2985 7.33203 12.6667C7.33203 13.0349 7.63051 13.3333 7.9987 13.3333Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.6667 13.3333C13.0349 13.3333 13.3333 13.0349 13.3333 12.6667C13.3333 12.2985 13.0349 12 12.6667 12C12.2985 12 12 12.2985 12 12.6667C12 13.0349 12.2985 13.3333 12.6667 13.3333Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33464 13.3333C3.70283 13.3333 4.0013 13.0349 4.0013 12.6667C4.0013 12.2985 3.70283 12 3.33464 12C2.96645 12 2.66797 12.2985 2.66797 12.6667C2.66797 13.0349 2.96645 13.3333 3.33464 13.3333Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span
                className="
                text-[9px]
                font-inter
                font-normal
                not-italic
                leading-[11.25px]
                tracking-[0.167px]
                text-[#4A5565]
                mt-0.5
                group-hover:text-[#18181b]
                transition-colors
              "
                style={{ fontFamily: "Inter" }}
              >
                Quick Style
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Shape Format */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Shape Format
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Shape Fill */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[240px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] text-[#111827]">Fill</div>
                  <input
                    type="color"
                    value={typeof selected?.fill === "string" ? selected.fill : scheme.primary}
                    onChange={(e) => applyFill(e.target.value)}
                    disabled={!hasSelection}
                  />
                </div>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyFill("transparent")}
                    className={`px-2 py-1 rounded border border-[#E5E7EB] text-[11px] ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    No Fill
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyFill(makeLinearGradient(135, gradientFrom, gradientTo))}
                    className={`px-2 py-1 rounded border border-[#E5E7EB] text-[11px] ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    Gradient
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    scheme.primary,
                    scheme.secondary,
                    "#111827",
                    "#FFFFFF",
                    "#F3F4F6",
                    "#FEF3C7",
                    "#DBEAFE",
                    "#DCFCE7",
                    "#FCE7F3",
                    "#EDE9FE",
                    "#FFF7ED",
                    "#E5E7EB",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      disabled={!hasSelection}
                      className={`w-7 h-7 rounded border border-[#E5E7EB] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => applyFill(c)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      hasSelection ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={resetSelectionStyles}
                    disabled={!hasSelection}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M9.74891 11.9342L2.62891 9.99219"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.2516 1.75043C12.383 1.61902 12.539 1.51478 12.7107 1.44366C12.8824 1.37254 13.0664 1.33594 13.2523 1.33594C13.4381 1.33594 13.6221 1.37254 13.7938 1.44366C13.9655 1.51478 14.1215 1.61902 14.2529 1.75043C14.3843 1.88184 14.4886 2.03784 14.5597 2.20954C14.6308 2.38123 14.6674 2.56525 14.6674 2.75109C14.6674 2.93694 14.6308 3.12096 14.5597 3.29265C14.4886 3.46435 14.3843 3.62035 14.2529 3.75176L11.5743 6.43109C11.5118 6.4936 11.4767 6.57837 11.4767 6.66676C11.4767 6.75515 11.5118 6.83992 11.5743 6.90243L12.2036 7.53176C12.5048 7.83306 12.6741 8.24169 12.6741 8.66776C12.6741 9.09383 12.5048 9.50246 12.2036 9.80376L11.5743 10.4331C11.5117 10.4956 11.427 10.5307 11.3386 10.5307C11.2502 10.5307 11.1654 10.4956 11.1029 10.4331L5.57025 4.90109C5.50776 4.83858 5.47266 4.75382 5.47266 4.66543C5.47266 4.57704 5.50776 4.49227 5.57025 4.42976L6.19959 3.80043C6.50089 3.49917 6.90951 3.32993 7.33559 3.32993C7.76166 3.32993 8.17028 3.49917 8.47159 3.80043L9.10092 4.42976C9.16343 4.49225 9.2482 4.52736 9.33659 4.52736C9.42497 4.52736 9.50974 4.49225 9.57225 4.42976L12.2516 1.75043Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.0019 5.33594C4.79923 7.1426 3.35523 7.6426 1.61323 7.96794C1.55544 7.97849 1.5014 8.00392 1.45644 8.04172C1.41147 8.07952 1.37713 8.12839 1.35681 8.1835C1.33649 8.23862 1.33088 8.29808 1.34054 8.35603C1.3502 8.41397 1.3748 8.4684 1.4119 8.51394L6.2919 14.4359C6.39102 14.5412 6.52168 14.6114 6.66418 14.6359C6.80667 14.6605 6.95328 14.638 7.0819 14.5719C8.4919 13.6059 10.6686 11.1973 10.6686 10.0026"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
          text-[9px]
          font-inter
          font-normal
          not-italic
          leading-[11.25px]
          tracking-[0.167px]
          text-[#4A5565]
          mt-0.5
          group-hover:text-[#18181b]
          transition-colors
        "
              style={{ fontFamily: "Inter" }}
            >
              Shape Fill
            </span>
            </button>
          </Popover>

          {/* Outline */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] text-[#111827]">Outline</div>
                  <input
                    type="color"
                    value={
                      typeof selected?.stroke === "string" ? selected.stroke : scheme.neutral
                    }
                    onChange={(e) => applyOutline(e.target.value, 3)}
                    disabled={!hasSelection}
                  />
                </div>
                <div className="flex gap-2 mb-2">
                  {[0, 1, 2, 3, 5, 8, 12].map((w) => (
                    <button
                      key={w}
                      type="button"
                      disabled={!hasSelection}
                      onClick={() => applyOutline(scheme.neutral, w)}
                      className={`px-2 py-1 rounded border border-[#E5E7EB] text-[11px] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {w === 0 ? "None" : `${w}px`}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    scheme.neutral,
                    scheme.primary,
                    scheme.secondary,
                    "#FFFFFF",
                    "#111827",
                    "#94A3B8",
                    "#FCA5A5",
                    "#FDE68A",
                    "#86EFAC",
                    "#93C5FD",
                    "#C4B5FD",
                    "#F9A8D4",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      disabled={!hasSelection}
                      className={`w-7 h-7 rounded border border-[#E5E7EB] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => applyOutline(c, 3)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      hasSelection ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={() => applyOutline("black", 0)}
                    disabled={!hasSelection}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
          text-[9px]
          font-inter
          font-normal
          not-italic
          leading-[11.25px]
          tracking-[0.167px]
          text-[#4A5565]
          mt-0.5
          group-hover:text-[#18181b]
          transition-colors
        "
              style={{ fontFamily: "Inter" }}
            >
              Outline
            </span>
            </button>
          </Popover>

          {/* Effects */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[240px]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => {
                      applyToSelected({ shadowEnabled: false });
                      applyToSelected({ strokeWidth: 0 });
                      applyFill(scheme.primary);
                    }}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">None</div>
                    <div className="text-[10px] text-[#6A7282]">Reset effects</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() =>
                      applyShadowPreset({
                        kind: "shadow",
                        blur: 12,
                        offsetX: 4,
                        offsetY: 4,
                        opacity: 0.3,
                        color: "#000000",
                      })
                    }
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Shadow</div>
                    <div className="text-[10px] text-[#6A7282]">Soft drop shadow</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyGlowPreset(scheme.secondary, "medium")}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Glow</div>
                    <div className="text-[10px] text-[#6A7282]">Outer glow</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyFill(makeLinearGradient(135, scheme.primary, scheme.secondary))}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Gradient</div>
                    <div className="text-[10px] text-[#6A7282]">Fill gradient</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyOutline(scheme.neutral, 3)}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Outline</div>
                    <div className="text-[10px] text-[#6A7282]">Stroke outline</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() =>
                      applyShadowPreset({
                        kind: "shadow",
                        blur: 22,
                        offsetX: 0,
                        offsetY: 10,
                        opacity: 0.25,
                        color: "#000000",
                      })
                    }
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Depth</div>
                    <div className="text-[10px] text-[#6A7282]">Drop depth shadow</div>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      hasSelection ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={() => applyToSelected({ shadowEnabled: false })}
                    disabled={!hasSelection}
                  >
                    Clear Effects
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M14.4285 2.42849L13.5752 1.57515C13.5001 1.49936 13.4108 1.4392 13.3124 1.39814C13.214 1.35708 13.1085 1.33594 13.0018 1.33594C12.8952 1.33594 12.7896 1.35708 12.6912 1.39814C12.5928 1.4392 12.5035 1.49936 12.4285 1.57515L1.57515 12.4285C1.49936 12.5035 1.4392 12.5928 1.39814 12.6912C1.35708 12.7896 1.33594 12.8952 1.33594 13.0018C1.33594 13.1085 1.35708 13.214 1.39814 13.3124C1.4392 13.4108 1.49936 13.5001 1.57515 13.5752L2.42849 14.4285C2.50303 14.5051 2.59218 14.566 2.69065 14.6076C2.78912 14.6491 2.89493 14.6706 3.00182 14.6706C3.10871 14.6706 3.21452 14.6491 3.31299 14.6076C3.41146 14.566 3.50061 14.5051 3.57515 14.4285L14.4285 3.57515C14.5051 3.50061 14.566 3.41146 14.6076 3.31299C14.6491 3.21452 14.6706 3.10871 14.6706 3.00182C14.6706 2.89493 14.6491 2.78912 14.6076 2.69065C14.566 2.59218 14.5051 2.50303 14.4285 2.42849Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.33203 4.66406L11.332 6.66406"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.33203 4V6.66667"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.668 9.33594V12.0026"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 1.33594V2.66927"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.66667 5.33594H2"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.9987 10.6641H11.332"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.33333 2H6"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
          text-[9px]
          font-inter
          font-normal
          not-italic
          leading-[11.25px]
          tracking-[0.167px]
          text-[#4A5565]
          mt-0.5
          group-hover:text-[#18181b]
          transition-colors
        "
              style={{ fontFamily: "Inter" }}
            >
              Effects
            </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Text Effects */}
      <div className="flex flex-col items-center min-w-[310px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Text Effects
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Shadow */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "None", onClick: () => applyShadowPreset({ kind: "none" }) },
                    {
                      label: "Soft",
                      onClick: () =>
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 10,
                          offsetX: 3,
                          offsetY: 3,
                          opacity: 0.25,
                          color: "#000000",
                        }),
                    },
                    {
                      label: "Medium",
                      onClick: () =>
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 16,
                          offsetX: 6,
                          offsetY: 6,
                          opacity: 0.3,
                          color: "#000000",
                        }),
                    },
                    {
                      label: "Hard",
                      onClick: () =>
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 6,
                          offsetX: 9,
                          offsetY: 9,
                          opacity: 0.4,
                          color: "#000000",
                        }),
                    },
                    {
                      label: "Top Left",
                      onClick: () =>
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 14,
                          offsetX: -6,
                          offsetY: -6,
                          opacity: 0.25,
                          color: "#000000",
                        }),
                    },
                    {
                      label: "Long",
                      onClick: () =>
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 18,
                          offsetX: 16,
                          offsetY: 16,
                          opacity: 0.2,
                          color: "#000000",
                        }),
                    },
                    {
                      label: "Soft Center",
                      onClick: () =>
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 26,
                          offsetX: 0,
                          offsetY: 0,
                          opacity: 0.2,
                          color: "#000000",
                        }),
                    },
                    {
                      label: "Depth",
                      onClick: () =>
                        applyShadowPreset({
                          kind: "shadow",
                          blur: 26,
                          offsetX: 0,
                          offsetY: 12,
                          opacity: 0.22,
                          color: "#000000",
                        }),
                    },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      disabled={!hasSelection}
                      onClick={p.onClick}
                      className={`border rounded-md px-2 py-2 text-left ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <div className="text-[12px] text-[#111827]">{p.label}</div>
                      <div className="text-[10px] text-[#6A7282]">Apply to selection</div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      hasSelection ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={() => applyShadowPreset({ kind: "none" })}
                    disabled={!hasSelection}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.9987 14.6693C11.6806 14.6693 14.6654 11.6845 14.6654 8.0026C14.6654 4.32071 11.6806 1.33594 7.9987 1.33594C4.3168 1.33594 1.33203 4.32071 1.33203 8.0026C1.33203 11.6845 4.3168 14.6693 7.9987 14.6693Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.00181 1.33594C7.11775 2.21999 6.62109 3.41903 6.62109 4.66927C6.62109 5.91951 7.11775 7.11855 8.00181 8.0026C8.88586 8.88666 10.0849 9.38332 11.3351 9.38332C12.5854 9.38332 13.7844 8.88666 14.6685 8.0026"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
    text-[9px]
    font-inter
    font-normal
    not-italic
    leading-[11.25px]
    tracking-[0.167px]
    text-[#4A5565]
    mt-0.5
    group-hover:text-[#18181b]
    transition-colors
  "
              style={{ fontFamily: "Inter" }}
            >
              Shadow
            </span>
            </button>
          </Popover>

          {/* Outline */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] text-[#111827]">Text outline</div>
                  <input
                    type="color"
                    value={typeof selected?.stroke === "string" ? selected.stroke : scheme.primary}
                    onChange={(e) => applyOutline(e.target.value, 2)}
                    disabled={!hasSelection}
                  />
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 5].map((w) => (
                    <button
                      key={w}
                      type="button"
                      disabled={!hasSelection}
                      onClick={() => applyOutline(scheme.primary, w)}
                      className={`px-2 py-1 rounded border border-[#E5E7EB] text-[11px] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {w === 0 ? "None" : `${w}px`}
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
          text-[9px]
          font-inter
          font-normal
          not-italic
          leading-[11.25px]
          tracking-[0.167px]
          text-[#4A5565]
          mt-0.5
          group-hover:text-[#18181b]
          transition-colors
        "
              style={{ fontFamily: "Inter" }}
            >
              Outline
            </span>
            </button>
          </Popover>

          {/* Glow */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyShadowPreset({ kind: "none" })}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">None</div>
                    <div className="text-[10px] text-[#6A7282]">Remove glow</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyGlowPreset(scheme.secondary, "soft")}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Soft</div>
                    <div className="text-[10px] text-[#6A7282]">Subtle glow</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyGlowPreset(scheme.secondary, "medium")}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Medium</div>
                    <div className="text-[10px] text-[#6A7282]">Clear glow</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => applyGlowPreset(scheme.primary, "strong")}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Strong</div>
                    <div className="text-[10px] text-[#6A7282]">Neon glow</div>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="text-[11px] text-[#6A7282]">Color</div>
                    <input
                      type="color"
                      value={scheme.secondary}
                      onChange={(e) => applyGlowPreset(e.target.value, "medium")}
                      disabled={!hasSelection}
                    />
                  </div>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.34496 1.87239C7.37353 1.71946 7.45468 1.58133 7.57436 1.48193C7.69404 1.38254 7.84472 1.32812 8.00029 1.32812C8.15587 1.32812 8.30655 1.38254 8.42623 1.48193C8.54591 1.58133 8.62706 1.71946 8.65563 1.87239L9.35629 5.57772C9.40606 5.84115 9.53408 6.08347 9.72365 6.27304C9.91322 6.4626 10.1555 6.59062 10.419 6.64039L14.1243 7.34106C14.2772 7.36962 14.4154 7.45077 14.5147 7.57045C14.6141 7.69014 14.6686 7.84081 14.6686 7.99639C14.6686 8.15196 14.6141 8.30264 14.5147 8.42232C14.4154 8.54201 14.2772 8.62316 14.1243 8.65172L10.419 9.35239C10.1555 9.40215 9.91322 9.53017 9.72365 9.71974C9.53408 9.90931 9.40606 10.1516 9.35629 10.4151L8.65563 14.1204C8.62706 14.2733 8.54591 14.4114 8.42623 14.5108C8.30655 14.6102 8.15587 14.6647 8.00029 14.6647C7.84472 14.6647 7.69404 14.6102 7.57436 14.5108C7.45468 14.4114 7.37353 14.2733 7.34496 14.1204L6.64429 10.4151C6.59453 10.1516 6.46651 9.90931 6.27694 9.71974C6.08737 9.53017 5.84506 9.40215 5.58163 9.35239L1.87629 8.65172C1.72336 8.62316 1.58524 8.54201 1.48584 8.42232C1.38644 8.30264 1.33203 8.15196 1.33203 7.99639C1.33203 7.84081 1.38644 7.69014 1.48584 7.57045C1.58524 7.45077 1.72336 7.36962 1.87629 7.34106L5.58163 6.64039C5.84506 6.59062 6.08737 6.4626 6.27694 6.27304C6.46651 6.08347 6.59453 5.84115 6.64429 5.57772L7.34496 1.87239Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.332 1.33594V4.0026"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6667 2.66406H12"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
    text-[9px]
    font-inter
    font-normal
    not-italic
    leading-[11.25px]
    tracking-[0.167px]
    text-[#4A5565]
    mt-0.5
    group-hover:text-[#18181b]
    transition-colors
  "
              style={{ fontFamily: "Inter" }}
            >
              Glow
            </span>
            </button>
          </Popover>

          {/* Gradient */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[280px]">
                <div className="text-[12px] text-[#111827] mb-2">Gradient fill</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[11px] text-[#6A7282]">From</div>
                  <input
                    type="color"
                    value={gradientFrom}
                    onChange={(e) => {
                      const v = e.target.value;
                      setGradientFrom(v);
                      applyFill(makeLinearGradient(135, v, gradientTo));
                    }}
                    disabled={!hasSelection}
                  />
                  <div className="text-[11px] text-[#6A7282]">To</div>
                  <input
                    type="color"
                    value={gradientTo}
                    onChange={(e) => {
                      const v = e.target.value;
                      setGradientTo(v);
                      applyFill(makeLinearGradient(135, gradientFrom, v));
                    }}
                    disabled={!hasSelection}
                  />
                </div>
                <div className="flex gap-2">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                    <button
                      key={a}
                      type="button"
                      disabled={!hasSelection}
                      onClick={() => applyFill(makeLinearGradient(a, gradientFrom, gradientTo))}
                      className={`px-2 py-1 rounded border border-[#E5E7EB] text-[11px] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {a}°
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: "Ocean", from: "#0D9488", to: "#60A5FA" },
                    { label: "Sunset", from: "#FB7185", to: "#F59E0B" },
                    { label: "Purple", from: "#7C3AED", to: "#A78BFA" },
                    { label: "Lime", from: "#22C55E", to: "#A3E635" },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      disabled={!hasSelection}
                      onClick={() => {
                        setGradientFrom(p.from);
                        setGradientTo(p.to);
                        applyFill(makeLinearGradient(135, p.from, p.to));
                      }}
                      className={`border rounded-md px-2 py-2 text-left ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <div className="text-[12px] text-[#111827]">{p.label}</div>
                      <div
                        className="h-2 rounded mt-1"
                        style={{ background: makeLinearGradient(90, p.from, p.to) }}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      hasSelection ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={() => applyFill(scheme.primary)}
                    disabled={!hasSelection}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4.66667 10.8646C6.13333 10.8646 7.33333 9.64458 7.33333 8.16458C7.33333 7.39125 6.95333 6.65792 6.19333 6.03792C5.43333 5.41792 4.86 4.49792 4.66667 3.53125C4.47333 4.49792 3.90667 5.42458 3.14 6.03792C2.37333 6.65125 2 7.39792 2 8.16458C2 9.64458 3.2 10.8646 4.66667 10.8646Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.37193 4.40229C8.83043 3.66971 9.15546 2.86165 9.33193 2.01562C9.66526 3.68229 10.6653 5.28229 11.9986 6.34896C13.3319 7.41563 13.9986 8.68229 13.9986 10.0156C14.0024 10.9372 13.7325 11.8391 13.2231 12.607C12.7137 13.375 11.9878 13.9744 11.1373 14.3293C10.2869 14.6842 9.35021 14.7786 8.44604 14.6005C7.54188 14.4224 6.71095 13.9799 6.05859 13.329"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
    text-[9px]
    font-inter
    font-normal
    not-italic
    leading-[11.25px]
    tracking-[0.167px]
    text-[#4A5565]
    mt-0.5
    group-hover:text-[#18181b]
    transition-colors
  "
              style={{ fontFamily: "Inter" }}
            >
              Gradient
            </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Styles */}
      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Styles
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* WordArt */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[280px]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!hasSelection || selected?.type !== "text"}
                    onClick={() => {
                      applyToSelected({
                        fill: makeLinearGradient(135, scheme.primary, scheme.secondary),
                        stroke: "#111827",
                        strokeWidth: 2,
                      });
                      applyGlowPreset(scheme.secondary, "soft");
                    }}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection || selected?.type !== "text"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Gradient</div>
                    <div className="text-[10px] text-[#6A7282]">Fill + outline + glow</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection || selected?.type !== "text"}
                    onClick={() => {
                      applyToSelected({
                        fill: "#FDE68A",
                        stroke: "#92400E",
                        strokeWidth: 3,
                      });
                      applyShadowPreset({
                        kind: "shadow",
                        blur: 10,
                        offsetX: 4,
                        offsetY: 4,
                        opacity: 0.35,
                        color: "#000000",
                      });
                    }}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection || selected?.type !== "text"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Gold</div>
                    <div className="text-[10px] text-[#6A7282]">Classic WordArt</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection || selected?.type !== "text"}
                    onClick={() => {
                      applyToSelected({
                        fill: "#FFFFFF",
                        stroke: scheme.primary,
                        strokeWidth: 4,
                      });
                      applyGlowPreset(scheme.primary, "medium");
                    }}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection || selected?.type !== "text"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Neon</div>
                    <div className="text-[10px] text-[#6A7282]">Outline + glow</div>
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection || selected?.type !== "text"}
                    onClick={() => {
                      applyToSelected({ fill: scheme.primary, strokeWidth: 0 });
                      applyShadowPreset({
                        kind: "shadow",
                        blur: 14,
                        offsetX: 6,
                        offsetY: 6,
                        opacity: 0.35,
                        color: "#000000",
                      });
                    }}
                    className={`border rounded-md px-2 py-2 text-left ${
                      !hasSelection || selected?.type !== "text"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="text-[12px] text-[#111827]">Shadow</div>
                    <div className="text-[10px] text-[#6A7282]">Bold + shadow</div>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      hasSelection && selected?.type === "text"
                        ? "hover:bg-[#F3F4F6]"
                        : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (!hasSelection || selected?.type !== "text") return;
                      applyToSelected({
                        fill: THEMES[themeId]?.defaultText || "#111827",
                        strokeWidth: 0,
                        shadowEnabled: false,
                      });
                    }}
                    disabled={!hasSelection || selected?.type !== "text"}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] ${
                      canUndo ? "hover:bg-[#F3F4F6]" : "opacity-40 cursor-not-allowed"
                    }`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    Undo
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
              disabled={!hasSelection || selected?.type !== "text"}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.34496 1.87239C7.37353 1.71946 7.45468 1.58133 7.57436 1.48193C7.69404 1.38254 7.84472 1.32812 8.00029 1.32812C8.15587 1.32812 8.30655 1.38254 8.42623 1.48193C8.54591 1.58133 8.62706 1.71946 8.65563 1.87239L9.35629 5.57772C9.40606 5.84115 9.53408 6.08347 9.72365 6.27304C9.91322 6.4626 10.1555 6.59062 10.419 6.64039L14.1243 7.34106C14.2772 7.36962 14.4154 7.45077 14.5147 7.57045C14.6141 7.69014 14.6686 7.84081 14.6686 7.99639C14.6686 8.15196 14.6141 8.30264 14.5147 8.42232C14.4154 8.54201 14.2772 8.62316 14.1243 8.65172L10.419 9.35239C10.1555 9.40215 9.91322 9.53017 9.72365 9.71974C9.53408 9.90931 9.40606 10.1516 9.35629 10.4151L8.65563 14.1204C8.62706 14.2733 8.54591 14.4114 8.42623 14.5108C8.30655 14.6102 8.15587 14.6647 8.00029 14.6647C7.84472 14.6647 7.69404 14.6102 7.57436 14.5108C7.45468 14.4114 7.37353 14.2733 7.34496 14.1204L6.64429 10.4151C6.59453 10.1516 6.46651 9.90931 6.27694 9.71974C6.08737 9.53017 5.84506 9.40215 5.58163 9.35239L1.87629 8.65172C1.72336 8.62316 1.58524 8.54201 1.48584 8.42232C1.38644 8.30264 1.33203 8.15196 1.33203 7.99639C1.33203 7.84081 1.38644 7.69014 1.48584 7.57045C1.58524 7.45077 1.72336 7.36962 1.87629 7.34106L5.58163 6.64039C5.84506 6.59062 6.08737 6.4626 6.27694 6.27304C6.46651 6.08347 6.59453 5.84115 6.64429 5.57772L7.34496 1.87239Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.332 1.33594V4.0026"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6667 2.66406H12"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
text-[9px]
font-inter
font-normal
not-italic
leading-[11.25px]
tracking-[0.167px]
text-[#4A5565]
mt-0.5
group-hover:text-[#18181b]
transition-colors
"
              style={{ fontFamily: "Inter" }}
            >
              WordArt
            </span>
            </button>
          </Popover>

          {/* Theme */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                    const t = THEMES[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => applyTheme(id)}
                        className={`flex items-center gap-2 border rounded-md px-2 py-2 ${
                          themeId === id ? "border-[#2563EB]" : "border-[#E5E7EB]"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: t.background }}
                        />
                        <div className="text-left">
                          <div className="text-[12px] text-[#111827]">{t.label}</div>
                          <div className="text-[10px] text-[#6A7282]">
                            {COLOR_SCHEMES[t.scheme].label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              tabIndex={0}
              type="button"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8.55363 1.45618C8.37993 1.37694 8.19123 1.33594 8.0003 1.33594C7.80938 1.33594 7.62068 1.37694 7.44697 1.45618L1.73363 4.05618C1.61533 4.10834 1.51475 4.19377 1.44414 4.30208C1.37353 4.41038 1.33594 4.53689 1.33594 4.66618C1.33594 4.79547 1.37353 4.92197 1.44414 5.03027C1.51475 5.13858 1.61533 5.22401 1.73363 5.27618L7.45363 7.88284C7.62734 7.96208 7.81604 8.00308 8.00697 8.00308C8.19789 8.00308 8.38659 7.96208 8.5603 7.88284L14.2803 5.28284C14.3986 5.23068 14.4992 5.14524 14.5698 5.03694C14.6404 4.92863 14.678 4.80213 14.678 4.67284C14.678 4.54355 14.6404 4.41705 14.5698 4.30875C14.4992 4.20044 14.3986 4.115 14.2803 4.06284L8.55363 1.45618Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.33203 8C1.33172 8.12751 1.36798 8.25244 1.43651 8.35997C1.50505 8.46749 1.60298 8.55311 1.7187 8.60667L7.45203 11.2133C7.62483 11.2916 7.81234 11.3321 8.00203 11.3321C8.19172 11.3321 8.37923 11.2916 8.55203 11.2133L14.272 8.61333C14.39 8.56029 14.4901 8.47406 14.5599 8.36516C14.6297 8.25625 14.6664 8.12937 14.6654 8"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.33203 11.3359C1.33172 11.4634 1.36798 11.5884 1.43651 11.6959C1.50505 11.8034 1.60298 11.889 1.7187 11.9426L7.45203 14.5493C7.62483 14.6275 7.81234 14.668 8.00203 14.668C8.19172 14.668 8.37923 14.6275 8.55203 14.5493L14.272 11.9493C14.39 11.8962 14.4901 11.81 14.5599 11.7011C14.6297 11.5922 14.6664 11.4653 14.6654 11.3359"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span
              className="
text-[9px]
font-inter
font-normal
not-italic
leading-[11.25px]
tracking-[0.167px]
text-[#4A5565]
mt-0.5
group-hover:text-[#18181b]
transition-colors
"
              style={{ fontFamily: "Inter" }}
            >
              Theme
            </span>
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
});
