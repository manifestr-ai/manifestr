import React, { useEffect, useMemo, useRef, useState } from "react";
import { Popover, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";
import {
  buildChartSvg,
  createDefaultChartSpec,
  makeSvgDataUrl,
  parseChartSpecFromName,
  serializeChartSpecToName,
  type PresentationChartSpec,
  type PresentationChartType,
} from "./chartSvg";

// For demonstration, these can be static.
// In real usage, swap with your store's fonts list.
const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Oswald",
];
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

interface FormatPanelProps {
  store: any;
}

export default observer(function FormatPanel({ store }: FormatPanelProps) {
  const selected = store.selectedElements?.[0];
  const chartSpec = useMemo(
    () => parseChartSpecFromName(selected?.name),
    [selected?.name],
  );
  const isChart = selected?.type === "image" && !!chartSpec;

  const [draftChartSpec, setDraftChartSpec] = useState<PresentationChartSpec | null>(
    null,
  );

  const [formatPainter, setFormatPainter] = useState<{
    sourceId: string;
    payload: Record<string, any>;
  } | null>(null);
  const lastAppliedPainterTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (isChart && chartSpec) {
      setDraftChartSpec(chartSpec);
      return;
    }
    setDraftChartSpec(null);
  }, [isChart, chartSpec]);

  useEffect(() => {
    if (!formatPainter) return;
    if (!selected || selected.type !== "text" || typeof selected.set !== "function")
      return;
    if (selected.id === formatPainter.sourceId) return;
    if (lastAppliedPainterTargetRef.current === selected.id) return;
    lastAppliedPainterTargetRef.current = selected.id;
    selected.set(formatPainter.payload);
    setFormatPainter(null);
  }, [formatPainter, selected]);

  const applyChartSpec = (spec: PresentationChartSpec) => {
    if (!selected?.set) return;
    const svg = buildChartSvg(spec);
    selected.set({
      name: serializeChartSpecToName(spec),
      src: makeSvgDataUrl(svg),
    });
  };

  const coerceChartType = (type: PresentationChartType) => {
    if (!draftChartSpec) return;

    if (type === "scatter") {
      const next = createDefaultChartSpec("scatter");
      setDraftChartSpec(next);
      applyChartSpec(next);
      return;
    }

    if (draftChartSpec.kind === "scatter") {
      const next = createDefaultChartSpec(type);
      setDraftChartSpec(next);
      applyChartSpec(next);
      return;
    }

    const next: PresentationChartSpec = {
      ...draftChartSpec,
      type,
      title:
        type === "stacked-column"
          ? "Stacked Column Chart"
          : type === "column"
            ? "Column Chart"
            : type === "bar"
              ? "Bar Chart"
              : type === "line"
                ? "Line Chart"
                : type === "area"
                  ? "Area Chart"
                  : type === "pie"
                    ? "Pie Chart"
                    : type === "donut"
                      ? "Donut Chart"
                      : "Chart",
    };

    if (type === "stacked-column" && next.series.length < 2) {
      next.series = [
        next.series[0] || { name: "Series 1", values: next.labels.map(() => 0) },
        { name: "Series 2", values: next.labels.map(() => 0) },
      ];
    }

    setDraftChartSpec(next);
    applyChartSpec(next);
  };

  const addNewSlide = () => {
    if (typeof store.addPage === "function") {
      const created = store.addPage();
      if (created?.select) {
        created.select();
        return;
      }
      const last = store.pages?.[store.pages.length - 1];
      if (last?.select) last.select();
    }
  };

  const deleteActiveSlide = () => {
    const active = store.activePage;
    if (!active?.id) return;
    if (typeof store.deletePages !== "function") return;
    if (store.pages?.length <= 1) return;
    const shouldDelete = window.confirm("Delete this slide?");
    if (!shouldDelete) return;
    store.deletePages([active.id]);
  };

  const duplicateActiveSlide = () => {
    if (!store?.activePage) return;
    const activeId = store.activePage.id;
    const snapshot = typeof store.toJSON === "function" ? store.toJSON() : null;
    const activeSnap =
      snapshot?.pages?.find?.((p: any) => p?.id === activeId) || null;
    if (!activeSnap) return;

    if (typeof store.addPage !== "function") return;
    const created = store.addPage();
    const newPage =
      created || (store.pages ? store.pages[store.pages.length - 1] : null);
    if (!newPage) return;

    try {
      const children = Array.isArray(activeSnap.children) ? activeSnap.children : [];
      children.forEach((child: any) => {
        const { id, ...rest } = child || {};
        if (!rest?.type) return;
        newPage.addElement(rest);
      });
      if (newPage.set && activeSnap.layout) {
        newPage.set({ layout: activeSnap.layout });
      }
    } catch {}

    if (newPage.select) newPage.select();
  };

  // Make sure all needed properties are available, or use fallbacks
  const fontFamily = selected?.fontFamily || "Inter";
  const fontSize = selected?.fontSize || 18;
  const fontWeight = selected?.fontWeight || "normal";
  const fontStyle = selected?.fontStyle || "normal";
  const textDecoration = selected?.textDecoration || "none";
  const textDecorLine =
    typeof textDecoration === "string" ? textDecoration : "none";
  const align = selected?.align || "left";
  const fill = selected?.fill || "#000000";

  if (isChart && draftChartSpec) {
    const chartTypeValue = draftChartSpec.type;

    const chartTypeOptions: { value: PresentationChartType; label: string }[] = [
      { value: "column", label: "Column" },
      { value: "stacked-column", label: "Stacked Column" },
      { value: "bar", label: "Bar" },
      { value: "line", label: "Line" },
      { value: "area", label: "Area" },
      { value: "scatter", label: "Scatter" },
      { value: "pie", label: "Pie" },
      { value: "donut", label: "Donut" },
    ];

    const renderDataEditor = () => {
      if (draftChartSpec.kind === "scatter") {
        return (
          <div className="w-[520px]">
            <div className="text-xs text-gray-500 mb-2">Points</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-gray-500">#</div>
              <div className="text-gray-500">X</div>
              <div className="text-gray-500">Y</div>
              {draftChartSpec.points.map((p, i) => (
                <React.Fragment key={i}>
                  <div className="text-gray-700">{i + 1}</div>
                  <input
                    className="border rounded px-2 py-1"
                    value={String(p.x)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const next = {
                        ...draftChartSpec,
                        points: draftChartSpec.points.map((pt, idx) =>
                          idx === i ? { ...pt, x: val } : pt,
                        ),
                      };
                      setDraftChartSpec(next);
                      applyChartSpec(next);
                    }}
                  />
                  <input
                    className="border rounded px-2 py-1"
                    value={String(p.y)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const next = {
                        ...draftChartSpec,
                        points: draftChartSpec.points.map((pt, idx) =>
                          idx === i ? { ...pt, y: val } : pt,
                        ),
                      };
                      setDraftChartSpec(next);
                      applyChartSpec(next);
                    }}
                  />
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
                onClick={() => {
                  const next = {
                    ...draftChartSpec,
                    points: [...draftChartSpec.points, { x: 0, y: 0 }],
                  };
                  setDraftChartSpec(next);
                  applyChartSpec(next);
                }}
              >
                Add Point
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
                onClick={() => {
                  if (draftChartSpec.points.length <= 1) return;
                  const next = {
                    ...draftChartSpec,
                    points: draftChartSpec.points.slice(0, -1),
                  };
                  setDraftChartSpec(next);
                  applyChartSpec(next);
                }}
              >
                Remove Point
              </button>
            </div>
          </div>
        );
      }

      const labels = draftChartSpec.labels;
      const series = draftChartSpec.series;

      return (
        <div className="w-[620px]">
          <div className="text-xs text-gray-500 mb-2">Data</div>
          <div
            className="grid gap-2 text-xs"
            style={{
              gridTemplateColumns: `160px repeat(${series.length}, 120px)`,
            }}
          >
            <div className="text-gray-500">Category</div>
            {series.map((s, i) => (
              <input
                key={i}
                className="border rounded px-2 py-1 font-medium"
                value={s.name}
                onChange={(e) => {
                  const next = {
                    ...draftChartSpec,
                    series: series.map((ser, idx) =>
                      idx === i ? { ...ser, name: e.target.value } : ser,
                    ),
                  };
                  setDraftChartSpec(next);
                  applyChartSpec(next);
                }}
              />
            ))}

            {labels.map((label, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <input
                  className="border rounded px-2 py-1"
                  value={label}
                  onChange={(e) => {
                    const next = {
                      ...draftChartSpec,
                      labels: labels.map((l, idx) =>
                        idx === rowIdx ? e.target.value : l,
                      ),
                    };
                    setDraftChartSpec(next);
                    applyChartSpec(next);
                  }}
                />
                {series.map((ser, colIdx) => (
                  <input
                    key={colIdx}
                    className="border rounded px-2 py-1"
                    value={String(ser.values[rowIdx] ?? 0)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const nextSeries = series.map((s, sIdx) => {
                        if (sIdx !== colIdx) return s;
                        const nextValues = [...s.values];
                        nextValues[rowIdx] = val;
                        return { ...s, values: nextValues };
                      });
                      const next = { ...draftChartSpec, series: nextSeries };
                      setDraftChartSpec(next);
                      applyChartSpec(next);
                    }}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
              onClick={() => {
                const nextLabels = [...labels, `Q${labels.length + 1}`];
                const nextSeries = series.map((s) => ({
                  ...s,
                  values: [...s.values, 0],
                }));
                const next = { ...draftChartSpec, labels: nextLabels, series: nextSeries };
                setDraftChartSpec(next);
                applyChartSpec(next);
              }}
            >
              Add Category
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
              onClick={() => {
                if (labels.length <= 1) return;
                const nextLabels = labels.slice(0, -1);
                const nextSeries = series.map((s) => ({
                  ...s,
                  values: s.values.slice(0, -1),
                }));
                const next = { ...draftChartSpec, labels: nextLabels, series: nextSeries };
                setDraftChartSpec(next);
                applyChartSpec(next);
              }}
            >
              Remove Category
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
              onClick={() => {
                const nextSeries = [
                  ...series,
                  {
                    name: `Series ${series.length + 1}`,
                    values: labels.map(() => 0),
                  },
                ];
                const next = { ...draftChartSpec, series: nextSeries };
                setDraftChartSpec(next);
                applyChartSpec(next);
              }}
            >
              Add Series
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded border text-xs hover:bg-gray-50"
              onClick={() => {
                if (series.length <= 1) return;
                const nextSeries = series.slice(0, -1);
                const next = { ...draftChartSpec, series: nextSeries };
                setDraftChartSpec(next);
                applyChartSpec(next);
              }}
            >
              Remove Series
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="h-[102px] bg-white border-b flex items-center px-6 gap-4 overflow-x-auto">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-3">Chart</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={chartTypeValue}
                onChange={(e) => coerceChartType(e.target.value as PresentationChartType)}
                className="border rounded px-2 py-1 text-sm"
              >
                {chartTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <Popover
              position={Position.BOTTOM}
              content={
                <div className="p-4 bg-white border rounded shadow-lg max-h-[420px] overflow-auto">
                  {renderDataEditor()}
                </div>
              }
            >
              <button
                type="button"
                className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
              >
                Edit Data
              </button>
            </Popover>
            <button
              type="button"
              className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
              onClick={() => {
                const next = createDefaultChartSpec(chartTypeValue);
                setDraftChartSpec(next);
                applyChartSpec(next);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[102px] bg-white border-b flex items-center px-6 gap-4 overflow-x-auto">
      {/* Font */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-3">Font</span>
        <div className="flex gap-2">
          {/* Font Family */}
          <div className="flex flex-col items-center min-w-[100px] py-2">
            <div className="relative group w-full">
              <button
                className="flex items-center justify-center w-full px-1 py-0.5 rounded bg-transparent focus:outline-none appearance-none"
                style={{
                  color: "#364153",
                  fontFamily: "Inter",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
                tabIndex={0}
              >
                <span
                  className="truncate"
                  style={{
                    color: "#364153",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "16px",
                  }}
                >
                  {fontFamily}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{ width: "12px", height: "12px", flexShrink: 0 }}
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="#6A7282"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <select
                value={fontFamily}
                onChange={(e) => selected.set({ fontFamily: e.target.value })}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                style={{ fontFamily }}
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] ">
              Font
            </span>
          </div>

          {/* Font Size */}
          <div className="flex flex-col items-center min-w-[72px] py-2">
            <div className="relative group w-full">
              <button
                className="flex items-center justify-center w-full px-1 py-0.5 rounded bg-transparent focus:outline-none appearance-none"
                style={{
                  color: "#364153",
                  fontFamily: "Inter",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
                tabIndex={0}
              >
                <span
                  className="truncate"
                  style={{
                    color: "#364153",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "16px",
                  }}
                >
                  {fontSize}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{ width: "12px", height: "12px", flexShrink: 0 }}
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="#6A7282"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <select
                value={fontSize}
                onChange={(e) =>
                  selected.set({ fontSize: Number(e.target.value) })
                }
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                style={{ fontFamily: "Inter" }}
              >
                {FONT_SIZES.map((size) => (
                  <option
                    key={size}
                    value={size}
                    style={{ fontFamily: "Inter" }}
                  >
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] ">
              Size
            </span>
          </div>

          {/* Bold */}
          <button
            onClick={() =>
              selected.set({
                fontWeight: fontWeight === "bold" ? "normal" : "bold",
              })
            }
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${fontWeight === "bold" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] font-bold text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 7.9974H10C10.7072 7.9974 11.3855 8.27835 11.8856 8.77844C12.3857 9.27854 12.6667 9.95682 12.6667 10.6641C12.6667 11.3713 12.3857 12.0496 11.8856 12.5497C11.3855 13.0498 10.7072 13.3307 10 13.3307H4.66667C4.48986 13.3307 4.32029 13.2605 4.19526 13.1355C4.07024 13.0104 4 12.8409 4 12.6641V3.33073C4 3.15392 4.07024 2.98435 4.19526 2.85932C4.32029 2.7343 4.48986 2.66406 4.66667 2.66406H9.33333C10.0406 2.66406 10.7189 2.94501 11.219 3.44511C11.719 3.94521 12 4.62349 12 5.33073C12 6.03797 11.719 6.71625 11.219 7.21635C10.7189 7.71644 10.0406 7.9974 9.33333 7.9974"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Bold
            </span>
          </button>

          {/* Italic */}
          <button
            onClick={() =>
              selected.set({
                fontStyle: fontStyle === "italic" ? "normal" : "italic",
              })
            }
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition
      ${fontStyle === "italic" ? "bg-[#E9EBF0]" : "bg-transparent"}
      hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] italic text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M12.668 2.66406H6.66797"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.33203 13.3359H3.33203"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 2.66406L6 13.3307"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 ">
              Italic
            </span>
          </button>

          {/* Underline */}
          <button
            onClick={() =>
              selected.set({
                textDecoration:
                  textDecorLine === "underline" ? "none" : "underline",
              })
            }
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${textDecorLine === "underline" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0]`}
          >
            <span className="text-[18px] underline text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 2.66406V6.66406C4 7.72493 4.42143 8.74234 5.17157 9.49249C5.92172 10.2426 6.93913 10.6641 8 10.6641C9.06087 10.6641 10.0783 10.2426 10.8284 9.49249C11.5786 8.74234 12 7.72493 12 6.66406V2.66406"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.66797 13.3359H13.3346"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 ">
              Underline
            </span>
          </button>

          {/* Color */}
          <div className="flex flex-col items-center justify-center w-[44px] ">
            <div className="relative flex flex-col items-center">
              {/* T icon */}
              <span className="text-[18px] text-[#2B2F38] leading-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 2.66406V13.3307"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.66797 4.66406V3.33073C2.66797 3.15392 2.73821 2.98435 2.86323 2.85932C2.98826 2.7343 3.15782 2.66406 3.33464 2.66406H12.668C12.8448 2.66406 13.0143 2.7343 13.1394 2.85932C13.2644 2.98435 13.3346 3.15392 13.3346 3.33073V4.66406"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 13.3359H10"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              {/* color line */}
              <div
                className="w-[18px] h-[2px] mt-[2px]"
                style={{ backgroundColor: fill }}
              />

              {/* hidden input */}
              <input
                type="color"
                value={fill}
                onChange={(e) => selected.set({ fill: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Color
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Paragraph */}
      <div className="flex gap-4 items-center">
        {/* Paragraph */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-3">Paragraph</span>
          <div className="flex gap-2">
            {/* Format Painter */}
            <button
              className={`flex flex-col items-center justify-center w-[68px] rounded-md transition ${
                formatPainter ? "bg-[#E9EBF0]" : "bg-transparent"
              } hover:bg-[#E9EBF0] py-2`}
              onClick={() => {
                if (!selected || selected.type !== "text" || !selected.set) return;
                setFormatPainter({
                  sourceId: selected.id,
                  payload: {
                    fontFamily: selected.fontFamily,
                    fontSize: selected.fontSize,
                    fontWeight: selected.fontWeight,
                    fontStyle: selected.fontStyle,
                    textDecoration: selected.textDecoration,
                    fill: selected.fill,
                    align: selected.align,
                    lineHeight: selected.lineHeight,
                  },
                });
                lastAppliedPainterTargetRef.current = null;
              }}
              aria-label="Format Painter"
            >
              <span className="text-[18px] text-[#2B2F38] leading-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <g clip-path="url(#clip0_10297_387925)">
                    <path
                      d="M10.967 13.4191L2.95703 11.2344"
                      stroke="#364153"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.7825 1.9663C13.9304 1.81847 14.1059 1.7012 14.299 1.62119C14.4922 1.54118 14.6992 1.5 14.9083 1.5C15.1174 1.5 15.3244 1.54118 15.5175 1.62119C15.7107 1.7012 15.8862 1.81847 16.034 1.9663C16.1819 2.11414 16.2992 2.28964 16.3792 2.4828C16.4592 2.67596 16.5003 2.88298 16.5003 3.09205C16.5003 3.30112 16.4592 3.50815 16.3792 3.7013C16.2992 3.89446 16.1819 4.06997 16.034 4.2178L13.0205 7.23205C12.9502 7.30237 12.9107 7.39774 12.9107 7.49718C12.9107 7.59661 12.9502 7.69198 13.0205 7.7623L13.7285 8.4703C14.0675 8.80927 14.2579 9.26897 14.2579 9.7483C14.2579 10.2276 14.0675 10.6873 13.7285 11.0263L13.0205 11.7343C12.9502 11.8046 12.8549 11.8441 12.7554 11.8441C12.656 11.8441 12.5606 11.8046 12.4903 11.7343L6.26605 5.5108C6.19574 5.44048 6.15625 5.34511 6.15625 5.24568C6.15625 5.14624 6.19574 5.05087 6.26605 4.98055L6.97405 4.27255C7.31301 3.93364 7.77271 3.74324 8.25205 3.74324C8.73138 3.74324 9.19108 3.93364 9.53005 4.27255L10.238 4.98055C10.3084 5.05085 10.4037 5.09035 10.5032 5.09035C10.6026 5.09035 10.698 5.05085 10.7683 4.98055L13.7825 1.9663Z"
                      stroke="#364153"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.74921 6C5.39621 8.0325 3.77171 8.595 1.81196 8.961C1.74695 8.97287 1.68615 9.00148 1.63556 9.044C1.58498 9.08653 1.54635 9.14151 1.52348 9.20351C1.50062 9.26552 1.49431 9.33241 1.50518 9.3976C1.51604 9.46279 1.54371 9.52402 1.58546 9.57525L7.07546 16.2375C7.18697 16.3559 7.33396 16.4349 7.49427 16.4625C7.65458 16.4901 7.81951 16.4648 7.96421 16.3905C9.55046 15.3037 11.9992 12.594 11.9992 11.25"
                      stroke="#364153"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10297_387925">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span
                className="text-[#4A5565] font-inter mt-1"
                style={{
                  fontFamily: "Inter",
                  fontSize: "10px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "15px",
                  letterSpacing: "0.117px",
                  width: "72px",
                }}
              >
                Format Painter
              </span>
            </button>

            {/* Alignment buttons */}
            {[
              {
                value: "left",
                label: "Left",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 3.33594H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10 8H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.3333 12.6641H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
              {
                value: "center",
                label: "Center",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 3.33594H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.3346 8H4.66797"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.6654 12.6641H3.33203"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
              {
                value: "right",
                label: "Right",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 3.33594H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 8H6"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.0013 12.6641H4.66797"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  if (!selected || selected.type !== "text" || !selected.set) return;
                  selected.set({ align: option.value });
                }}
                className={`flex flex-col items-center justify-center w-[44px] rounded-md transition ${align === option.value ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0]`}
                aria-label={`Align ${option.label}`}
                type="button"
              >
                <span className="text-[18px] text-[#2B2F38] leading-none">
                  {option.icon}
                </span>
                <span
                  style={{
                    color: "#4A5565",
                    fontFamily: "Inter",
                    fontSize: "9px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "11.25px",
                    letterSpacing: "0.167px",
                  }}
                  className="mt-1"
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Slides */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-3">Slides</span>
        <div className="flex gap-2">
          {/* New Slide */}
          <button
            onClick={() => {
              addNewSlide();
            }}
            className="flex flex-col items-center justify-center w-[68px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            aria-label="New Slide"
            type="button"
          >
            <span className="text-[22px] text-[#364153] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
              >
                <path
                  d="M4.12891 6.75H13.4622"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.79688 2.08594V11.4193"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span
              style={{
                color: "#4A5565",
                fontFamily: "Inter",
                fontSize: "9px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "11.25px",
                letterSpacing: "0.167px",
                marginTop: "0.25rem", // matches mt-1 in Tailwind
              }}
            >
              New Slide
            </span>
          </button>

          {/* Duplicate */}
          <button
            onClick={() => {
              duplicateActiveSlide();
            }}
            className="flex flex-col items-center justify-center w-[68px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            aria-label="Duplicate"
            type="button"
          >
            <span className="text-[22px] text-[#364153] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_10297_387969)">
                  <path
                    d="M13.332 5.33594H6.66536C5.92898 5.33594 5.33203 5.93289 5.33203 6.66927V13.3359C5.33203 14.0723 5.92898 14.6693 6.66536 14.6693H13.332C14.0684 14.6693 14.6654 14.0723 14.6654 13.3359V6.66927C14.6654 5.93289 14.0684 5.33594 13.332 5.33594Z"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.66536 10.6693C1.93203 10.6693 1.33203 10.0693 1.33203 9.33594V2.66927C1.33203 1.93594 1.93203 1.33594 2.66536 1.33594H9.33203C10.0654 1.33594 10.6654 1.93594 10.6654 2.66927"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10297_387969">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span
              style={{
                color: "#4A5565",
                fontFamily: "Inter",
                fontSize: "9px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "11.25px",
                letterSpacing: "0.167px",
                marginTop: "0.25rem", // matches mt-1 in Tailwind
              }}
            >
              Duplicate
            </span>
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              deleteActiveSlide();
            }}
            className="flex flex-col items-center justify-center w-[68px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            aria-label="Delete"
            type="button"
          >
            <span className="text-[22px] text-[#364153] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6.66797 7.33594V11.3359"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.33203 7.33594V11.3359"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.6654 4V13.3333C12.6654 13.687 12.5249 14.0261 12.2748 14.2761C12.0248 14.5262 11.6857 14.6667 11.332 14.6667H4.66536C4.31174 14.6667 3.9726 14.5262 3.72256 14.2761C3.47251 14.0261 3.33203 13.687 3.33203 13.3333V4"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 4H14"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.33203 4.0026V2.66927C5.33203 2.31565 5.47251 1.97651 5.72256 1.72646C5.9726 1.47641 6.31174 1.33594 6.66536 1.33594H9.33203C9.68565 1.33594 10.0248 1.47641 10.2748 1.72646C10.5249 1.97651 10.6654 2.31565 10.6654 2.66927V4.0026"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span
              style={{
                color: "#4A5565",
                fontFamily: "Inter",
                fontSize: "9px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "11.25px",
                letterSpacing: "0.167px",
                marginTop: "0.25rem", // matches mt-1 in Tailwind
              }}
            >
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});
