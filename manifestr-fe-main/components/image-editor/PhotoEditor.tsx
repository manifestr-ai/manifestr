import React, { useEffect, useRef, useState } from "react";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel, DEFAULT_SECTIONS } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { observer } from "mobx-react-lite";

import { Button } from "@blueprintjs/core";

import EditorBottomToolbar from "../editor/EditorBottomToolbar";
import ToolPanel from "../editor/panels/image-editor/ToolPanel";

interface PhotoEditorProps {
  imageSrc?: string;
  onStoreReady?: (store: any) => void;
}

const sections = DEFAULT_SECTIONS.filter(
  (section) =>
    section.name !== "pages" &&
    section.name !== "templates" &&
    section.name !== "videos",
);

type DrawingState =
  | {
      tool: "brush" | "pen";
      color: string;
      size: number;
      opacity: number;
      preset?: string;
    }
  | null;

type EffectState =
  | {
      tool: "gradient";
      color1: string;
      color2: string;
      angle: number;
      opacity: number;
      applyTo: "page" | "selection";
    }
  | {
      tool: "blur";
      radius: number;
      target: "base" | "selection";
    }
  | {
      tool: "erase";
      size: number;
      preset?: string;
    }
  | null;

const makeSvgDataUrl = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const toSmoothPath = (points: Array<{ x: number; y: number }>) => {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  const p = points;
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 1; i < p.length - 1; i++) {
    const midX = (p[i].x + p[i + 1].x) / 2;
    const midY = (p[i].y + p[i + 1].y) / 2;
    d += ` Q ${p[i].x} ${p[i].y} ${midX} ${midY}`;
  }
  const last = p[p.length - 1];
  d += ` T ${last.x} ${last.y}`;
  return d;
};

const getLargestCanvasRect = (container: HTMLElement) => {
  const canvases = Array.from(container.querySelectorAll("canvas"));
  if (!canvases.length) return null;
  let best: DOMRect | null = null;
  let bestArea = -1;
  canvases.forEach((c) => {
    const r = c.getBoundingClientRect();
    const area = r.width * r.height;
    if (area > bestArea) {
      bestArea = area;
      best = r;
    }
  });
  return best;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const DrawingControls = ({
  drawing,
  setDrawing,
}: {
  drawing: DrawingState;
  setDrawing: React.Dispatch<React.SetStateAction<DrawingState>>;
}) => {
  if (!drawing) return null;

  const presets =
    drawing.tool === "brush"
      ? [
          { label: "Soft", size: 18, opacity: 0.6 },
          { label: "Hard", size: 14, opacity: 0.85 },
          { label: "Marker", size: 26, opacity: 0.35 },
        ]
      : [
          { label: "Fine", size: 3, opacity: 1 },
          { label: "Medium", size: 5, opacity: 1 },
          { label: "Bold", size: 8, opacity: 0.95 },
        ];

  return (
    <div className="absolute left-4 bottom-4 z-50 bg-white border border-[#e5e7eb] rounded-lg shadow-md px-4 py-3 flex items-center gap-4">
      <div className="text-[13px] font-medium text-[#111827] capitalize">
        {drawing.tool}
      </div>

      <div className="flex items-center gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() =>
              setDrawing((d) =>
                d
                  ? { ...d, size: p.size, opacity: p.opacity, preset: p.label }
                  : d,
              )
            }
            className={`px-2 py-1 rounded border text-[12px] ${
              drawing.preset === p.label
                ? "border-[#2563EB] text-[#2563EB] bg-[#EEF2FF]"
                : "border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-[#6B7280]">Color</span>
        <input
          type="color"
          value={drawing.color}
          onChange={(e) =>
            setDrawing((d) => (d ? { ...d, color: e.target.value } : d))
          }
          className="w-8 h-8 p-0 border-0 bg-transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-[#6B7280]">Size</span>
        <input
          type="range"
          min={1}
          max={drawing.tool === "brush" ? 60 : 20}
          value={drawing.size}
          onChange={(e) =>
            setDrawing((d) => (d ? { ...d, size: Number(e.target.value) } : d))
          }
        />
        <span className="text-[12px] text-[#111827] w-6 text-right">
          {drawing.size}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-[#6B7280]">Opacity</span>
        <input
          type="range"
          min={5}
          max={100}
          value={Math.round(drawing.opacity * 100)}
          onChange={(e) =>
            setDrawing((d) =>
              d ? { ...d, opacity: Number(e.target.value) / 100 } : d,
            )
          }
        />
        <span className="text-[12px] text-[#111827] w-8 text-right">
          {Math.round(drawing.opacity * 100)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setDrawing(null)}
        className="px-3 py-1.5 rounded bg-[#111827] text-white text-[12px]"
      >
        Done
      </button>
    </div>
  );
};

const EffectsControls = ({
  effect,
  setEffect,
  onApplyGradient,
  onApplyBlur,
  onClearInk,
  hasSelection,
}: {
  effect: EffectState;
  setEffect: React.Dispatch<React.SetStateAction<EffectState>>;
  onApplyGradient: (next?: Partial<Extract<EffectState, { tool: "gradient" }>>) => void;
  onApplyBlur: (next?: Partial<Extract<EffectState, { tool: "blur" }>>) => void;
  onClearInk: () => void;
  hasSelection: boolean;
}) => {
  if (!effect) return null;

  if (effect.tool === "gradient") {
    const angles = [0, 45, 90, 135];
    return (
      <div className="absolute left-4 bottom-4 z-50 bg-white border border-[#e5e7eb] rounded-lg shadow-md px-4 py-3 flex items-center gap-4">
        <div className="text-[13px] font-medium text-[#111827]">Gradient</div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280]">From</span>
          <input
            type="color"
            value={effect.color1}
            onChange={(e) =>
              setEffect((prev) =>
                prev && prev.tool === "gradient"
                  ? { ...prev, color1: e.target.value }
                  : prev,
              )
            }
            className="w-8 h-8 p-0 border-0 bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280]">To</span>
          <input
            type="color"
            value={effect.color2}
            onChange={(e) =>
              setEffect((prev) =>
                prev && prev.tool === "gradient"
                  ? { ...prev, color2: e.target.value }
                  : prev,
              )
            }
            className="w-8 h-8 p-0 border-0 bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          {angles.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() =>
                setEffect((prev) =>
                  prev && prev.tool === "gradient" ? { ...prev, angle: a } : prev,
                )
              }
              className={`px-2 py-1 rounded border text-[12px] ${
                effect.angle === a
                  ? "border-[#2563EB] text-[#2563EB] bg-[#EEF2FF]"
                  : "border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
              }`}
            >
              {a}°
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280]">Opacity</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(effect.opacity * 100)}
            onChange={(e) =>
              setEffect((prev) =>
                prev && prev.tool === "gradient"
                  ? { ...prev, opacity: Number(e.target.value) / 100 }
                  : prev,
              )
            }
          />
          <span className="text-[12px] text-[#111827] w-8 text-right">
            {Math.round(effect.opacity * 100)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setEffect((prev) =>
                prev && prev.tool === "gradient"
                  ? {
                      ...prev,
                      applyTo: prev.applyTo === "selection" ? "page" : "selection",
                    }
                  : prev,
              )
            }
            className="px-2 py-1 rounded border border-[#e5e7eb] text-[12px] text-[#374151] hover:bg-[#f3f4f6]"
          >
            {effect.applyTo === "selection"
              ? hasSelection
                ? "Selection"
                : "Selection (none)"
              : "Page"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onApplyGradient()}
          className="px-3 py-1.5 rounded bg-[#111827] text-white text-[12px]"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={() => setEffect(null)}
          className="px-3 py-1.5 rounded border border-[#e5e7eb] text-[12px] text-[#374151] hover:bg-[#f3f4f6]"
        >
          Close
        </button>
      </div>
    );
  }

  if (effect.tool === "blur") {
    const presets = [
      { label: "Sharp", radius: 0 },
      { label: "Light", radius: 2 },
      { label: "Medium", radius: 6 },
      { label: "Strong", radius: 12 },
    ];
    return (
      <div className="absolute left-4 bottom-4 z-50 bg-white border border-[#e5e7eb] rounded-lg shadow-md px-4 py-3 flex items-center gap-4">
        <div className="text-[13px] font-medium text-[#111827]">Blur/Sharp</div>

        <div className="flex items-center gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setEffect((prev) =>
                  prev && prev.tool === "blur" ? { ...prev, radius: p.radius } : prev,
                );
                onApplyBlur({ radius: p.radius });
              }}
              className={`px-2 py-1 rounded border text-[12px] ${
                effect.radius === p.radius
                  ? "border-[#2563EB] text-[#2563EB] bg-[#EEF2FF]"
                  : "border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280]">Radius</span>
          <input
            type="range"
            min={0}
            max={24}
            value={effect.radius}
            onChange={(e) =>
              setEffect((prev) =>
                prev && prev.tool === "blur"
                  ? { ...prev, radius: Number(e.target.value) }
                  : prev,
              )
            }
            onMouseUp={() => onApplyBlur()}
            onTouchEnd={() => onApplyBlur()}
          />
          <span className="text-[12px] text-[#111827] w-7 text-right">
            {effect.radius}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setEffect((prev) =>
              prev && prev.tool === "blur"
                ? { ...prev, target: prev.target === "selection" ? "base" : "selection" }
                : prev,
            )
          }
          className="px-2 py-1 rounded border border-[#e5e7eb] text-[12px] text-[#374151] hover:bg-[#f3f4f6]"
        >
          {effect.target === "selection"
            ? hasSelection
              ? "Selection"
              : "Selection (none)"
            : "Base image"}
        </button>

        <button
          type="button"
          onClick={() => onApplyBlur()}
          className="px-3 py-1.5 rounded bg-[#111827] text-white text-[12px]"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={() => setEffect(null)}
          className="px-3 py-1.5 rounded border border-[#e5e7eb] text-[12px] text-[#374151] hover:bg-[#f3f4f6]"
        >
          Close
        </button>
      </div>
    );
  }

  const presets = [
    { label: "Small", size: 10 },
    { label: "Medium", size: 20 },
    { label: "Large", size: 36 },
  ];

  return (
    <div className="absolute left-4 bottom-4 z-50 bg-white border border-[#e5e7eb] rounded-lg shadow-md px-4 py-3 flex items-center gap-4">
      <div className="text-[13px] font-medium text-[#111827]">Eraser</div>

      <div className="flex items-center gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() =>
              setEffect((prev) =>
                prev && prev.tool === "erase"
                  ? { ...prev, size: p.size, preset: p.label }
                  : prev,
              )
            }
            className={`px-2 py-1 rounded border text-[12px] ${
              effect.tool === "erase" && effect.preset === p.label
                ? "border-[#2563EB] text-[#2563EB] bg-[#EEF2FF]"
                : "border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-[#6B7280]">Size</span>
        <input
          type="range"
          min={2}
          max={80}
          value={effect.tool === "erase" ? effect.size : 20}
          onChange={(e) =>
            setEffect((prev) =>
              prev && prev.tool === "erase"
                ? { ...prev, size: Number(e.target.value), preset: undefined }
                : prev,
            )
          }
        />
        <span className="text-[12px] text-[#111827] w-8 text-right">
          {effect.tool === "erase" ? effect.size : 20}
        </span>
      </div>

      <button
        type="button"
        onClick={onClearInk}
        className="px-2 py-1 rounded border border-[#e5e7eb] text-[12px] text-[#374151] hover:bg-[#f3f4f6]"
      >
        Clear
      </button>

      <button
        type="button"
        onClick={() => setEffect(null)}
        className="px-3 py-1.5 rounded bg-[#111827] text-white text-[12px]"
      >
        Done
      </button>
    </div>
  );
};

const InkingOverlay = observer(
  ({
    store,
    containerRef,
    drawing,
    eraser,
    inkRevision,
  }: {
    store: any;
    containerRef: React.RefObject<HTMLDivElement | null>;
    drawing: DrawingState;
    eraser: Extract<EffectState, { tool: "erase" }> | null;
    inkRevision: number;
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const initializedRef = useRef(false);
    const initTokenRef = useRef(0);
    const drawingRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const commitTimeoutRef = useRef<number | null>(null);
    const lastCommitRef = useRef(0);
    const [eraserCircle, setEraserCircle] = useState<{
      left: number;
      top: number;
      size: number;
      visible: boolean;
    } | null>(null);

    const active = !!drawing || !!eraser;

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
      });

    const ensureCanvas = () => {
      const w = Number(store?.width) || 0;
      const h = Number(store?.height) || 0;
      if (w <= 0 || h <= 0) return null;
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const c = canvasRef.current;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
      return c;
    };

    const getInkElement = (createIfMissing: boolean) => {
      const page = store?.activePage;
      if (!page) return null;
      const children = Array.isArray(page?.children) ? page.children : [];
      const existing = children.find((el: any) => el?.name === "ink-layer");
      if (existing) return existing;
      if (!createIfMissing || typeof page?.addElement !== "function") return null;
      const w = Number(store?.width) || 0;
      const h = Number(store?.height) || 0;
      if (w <= 0 || h <= 0) return null;
      const blank = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#ffffff" opacity="0"/></svg>`;
      return page.addElement({
        type: "image",
        src: makeSvgDataUrl(blank),
        x: 0,
        y: 0,
        width: w,
        height: h,
        selectable: false,
        draggable: false,
        resizable: false,
        alwaysOnTop: true,
        name: "ink-layer",
        custom: { tool: "ink" },
      });
    };

    const commitNow = () => {
      const c = canvasRef.current;
      if (!c) return;
      const ink = getInkElement(true);
      if (!ink || typeof ink?.set !== "function") return;
      ink.set({ src: c.toDataURL("image/png") });
      lastCommitRef.current = performance.now();
    };

    const scheduleCommit = (force?: boolean) => {
      if (force) {
        if (commitTimeoutRef.current !== null) {
          window.clearTimeout(commitTimeoutRef.current);
          commitTimeoutRef.current = null;
        }
        commitNow();
        return;
      }
      const now = performance.now();
      const elapsed = now - lastCommitRef.current;
      const delay = elapsed >= 120 ? 0 : 120 - elapsed;
      if (commitTimeoutRef.current !== null) return;
      commitTimeoutRef.current = window.setTimeout(() => {
        commitTimeoutRef.current = null;
        commitNow();
      }, delay);
    };

    const getRects = () => {
      const containerEl = containerRef.current;
      if (!containerEl) return null;
      const containerBox = containerEl.getBoundingClientRect();
      const canvasRect = getLargestCanvasRect(containerEl);
      if (!canvasRect) return null;
      const w = Number(store?.width) || 0;
      const h = Number(store?.height) || 0;
      if (w <= 0 || h <= 0 || canvasRect.width <= 0 || canvasRect.height <= 0)
        return null;

      const scale = Math.min(canvasRect.width / w, canvasRect.height / h);
      const pagePixelWidth = w * scale;
      const pagePixelHeight = h * scale;
      const pageLeft = canvasRect.left + (canvasRect.width - pagePixelWidth) / 2;
      const pageTop = canvasRect.top + (canvasRect.height - pagePixelHeight) / 2;

      const pageRectClient = {
        left: pageLeft,
        top: pageTop,
        right: pageLeft + pagePixelWidth,
        bottom: pageTop + pagePixelHeight,
        width: pagePixelWidth,
        height: pagePixelHeight,
      };

      return { containerBox, pageRectClient, scale };
    };

    const clientToPage = (clientX: number, clientY: number) => {
      const rects = getRects();
      if (!rects) return null;
      const { pageRectClient } = rects;
      const inside =
        clientX >= pageRectClient.left &&
        clientX <= pageRectClient.right &&
        clientY >= pageRectClient.top &&
        clientY <= pageRectClient.bottom;
      if (!inside) return null;
      const w = Number(store?.width) || 0;
      const h = Number(store?.height) || 0;
      if (w <= 0 || h <= 0 || pageRectClient.width <= 0 || pageRectClient.height <= 0)
        return null;
      const x = ((clientX - pageRectClient.left) / pageRectClient.width) * w;
      const y = ((clientY - pageRectClient.top) / pageRectClient.height) * h;
      return { x: clamp(x, 0, w), y: clamp(y, 0, h) };
    };

    const updateEraserCircle = (clientX: number, clientY: number) => {
      if (!eraser) return;
      const rects = getRects();
      if (!rects) return;
      const { containerBox, pageRectClient, scale } = rects;
      const inside =
        clientX >= pageRectClient.left &&
        clientX <= pageRectClient.right &&
        clientY >= pageRectClient.top &&
        clientY <= pageRectClient.bottom;
      if (!inside) {
        setEraserCircle((prev) => (prev ? { ...prev, visible: false } : prev));
        return;
      }
      const pxSize = Math.max(2, (Number(eraser.size) || 20) * scale);
      const left = clientX - containerBox.left - pxSize / 2;
      const top = clientY - containerBox.top - pxSize / 2;
      setEraserCircle({ left, top, size: pxSize, visible: true });
    };

    const initInk = async () => {
      if (!active) return;
      const token = ++initTokenRef.current;
      const c = ensureCanvas();
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      const page = store?.activePage;
      const children = page && Array.isArray(page?.children) ? page.children : [];
      const ink = getInkElement(false);

      ctx.clearRect(0, 0, c.width, c.height);

      const inkSrc = ink?.src;
      if (typeof inkSrc === "string" && inkSrc.length > 0) {
        try {
          const img = await loadImage(inkSrc);
          if (token !== initTokenRef.current) return;
          ctx.drawImage(img, 0, 0, c.width, c.height);
        } catch {}
      }

      const strokes = children.filter(
        (el: any) => el?.name === "brush-stroke" || el?.name === "pen-stroke",
      );
      for (const s of strokes) {
        const src = s?.src;
        const x = Number(s?.x) || 0;
        const y = Number(s?.y) || 0;
        const w = Number(s?.width) || 0;
        const h = Number(s?.height) || 0;
        if (!src || w <= 0 || h <= 0) continue;
        try {
          const img = await loadImage(src);
          if (token !== initTokenRef.current) return;
          ctx.drawImage(img, x, y, w, h);
          if (typeof s?.remove === "function") s.remove();
        } catch {}
      }

      initializedRef.current = true;
      scheduleCommit(true);
    };

    useEffect(() => {
      if (!active) return;
      initInk();
    }, [active, store?.activePage?.id, store?.width, store?.height]);

    useEffect(() => {
      if (!active) return;
      const c = ensureCanvas();
      const ctx = c?.getContext("2d");
      if (!c || !ctx) return;
      ctx.clearRect(0, 0, c.width, c.height);
      initializedRef.current = true;
      scheduleCommit(true);
    }, [inkRevision, active]);

    const drawSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const c = ensureCanvas();
      const ctx = c?.getContext("2d");
      if (!c || !ctx) return;
      if (!initializedRef.current) return;

      if (eraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = 1;
        ctx.lineWidth = Math.max(2, Number(eraser.size) || 20);
        ctx.strokeStyle = "#000000";
      } else if (drawing) {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = Math.max(0, Math.min(1, Number(drawing.opacity) || 1));
        ctx.lineWidth = Math.max(1, Number(drawing.size) || 1);
        ctx.strokeStyle = drawing.color || "#111827";
      } else {
        return;
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.closePath();
    };

    if (!active) return null;

    return (
      <div
        className="absolute inset-0 z-40"
        style={{ cursor: eraser ? "none" : "crosshair" }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const p = clientToPage(e.clientX, e.clientY);
          if (!p) return;
          drawingRef.current = true;
          pointerIdRef.current = e.pointerId;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          lastPointRef.current = p;
          updateEraserCircle(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
          updateEraserCircle(e.clientX, e.clientY);
          if (!drawingRef.current) return;
          if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
          const p = clientToPage(e.clientX, e.clientY);
          if (!p) return;
          const last = lastPointRef.current;
          if (!last) {
            lastPointRef.current = p;
            return;
          }
          drawSegment(last, p);
          lastPointRef.current = p;
          scheduleCommit();
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
          drawingRef.current = false;
          pointerIdRef.current = null;
          lastPointRef.current = null;
          scheduleCommit(true);
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
          drawingRef.current = false;
          pointerIdRef.current = null;
          lastPointRef.current = null;
          scheduleCommit(true);
        }}
      >
        {eraser && eraserCircle?.visible && (
          <div
            style={{
              position: "absolute",
              left: eraserCircle.left,
              top: eraserCircle.top,
              width: eraserCircle.size,
              height: eraserCircle.size,
              borderRadius: "9999px",
              border: "2px solid rgba(17,24,39,0.65)",
              boxSizing: "border-box",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    );
  },
);

const EditorUI = observer(
  ({
    store,
    workspaceContainerRef,
    drawing,
    setDrawing,
    effect,
    setEffect,
    onApplyGradient,
    onApplyBlur,
    onClearInk,
    hasSelection,
    inkRevision,
  }: {
    store: any;
    workspaceContainerRef: React.RefObject<HTMLDivElement | null>;
    drawing: DrawingState;
    setDrawing: React.Dispatch<React.SetStateAction<DrawingState>>;
    effect: EffectState;
    setEffect: React.Dispatch<React.SetStateAction<EffectState>>;
    onApplyGradient: () => void;
    onApplyBlur: (next?: Partial<Extract<EffectState, { tool: "blur" }>>) => void;
    onClearInk: () => void;
    hasSelection: boolean;
    inkRevision: number;
  }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#e7e7e7]">
      {/* TOP CENTER TOGGLE */}
      {/* <div className="flex justify-center pt-4">
        <div className="bg-white rounded-full shadow-sm p-1 flex gap-1">
          <button className="px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium">
            Image
          </button>
          <button className="px-4 py-1.5 rounded-full text-sm text-gray-500">
            Video
          </button>
        </div>
      </div> */}

      {/* CANVAS AREA */}
      <div
        ref={workspaceContainerRef}
        className="flex-grow flex items-center justify-center relative  overflow-hidden"
      >
        <Workspace store={store} pageControlsEnabled={false} />
        <InkingOverlay
          store={store}
          containerRef={workspaceContainerRef}
          drawing={drawing}
          eraser={effect && effect.tool === "erase" ? effect : null}
          inkRevision={inkRevision}
        />
        {drawing ? (
          <DrawingControls drawing={drawing} setDrawing={setDrawing} />
        ) : (
          <EffectsControls
            effect={effect}
            setEffect={setEffect}
            onApplyGradient={onApplyGradient}
            onApplyBlur={onApplyBlur}
            onClearInk={onClearInk}
            hasSelection={hasSelection}
          />
        )}
      </div>
    </div>
  );
},
);

const PhotoEditor = observer(function PhotoEditor({
  imageSrc = "/assets/dummy/dummy-trainer.jpg",
  onStoreReady,
}: PhotoEditorProps) {
  const [store] = useState(() =>
    createStore({
      key: "ftRB7anj9zd88zwAlJKy",
      showCredit: false,
    }),
  );

  useEffect(() => {
    if (onStoreReady && store) {
      onStoreReady(store);
    }
  }, [store, onStoreReady]);

  useEffect(() => {
    console.log(
      "🖼️ PhotoEditor: Loading image:",
      imageSrc?.substring(0, 80) + "...",
    );

    // Ensure a page exists
    if (store.pages.length === 0) {
      store.addPage();
    }

    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow CORS for external images
      img.src = imageSrc;

      img.onload = () => {
        console.log(
          "✅ Image loaded successfully! Size:",
          img.width,
          "x",
          img.height,
        );

        // Set workspace size to match the image
        store.setSize(img.width, img.height);

        // Clear any existing elements on the active page
        const page = store.activePage;
        if (page) {
          // Clear all existing elements (Polotno stores children in a MobX array)
          page.set({ children: [] });

          // Add the image as a new element
          page.addElement({
            type: "image",
            src: imageSrc,
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
            selectable: true,
            draggable: true,
            alwaysOnTop: false,
            name: "base-image",
          });

          console.log(" Image added to Polotno canvas");
        }
      };

      img.onerror = (err) => {
        console.error(" Failed to load image:", imageSrc, err);
      };
    }
  }, [imageSrc, store]);

  const [activeTool, setActiveTool] = useState<
    | "ai_prompter"
    | "format"
    | "adjust"
    | "text"
    | "color"
    | "effects"
    | "filter"
    | "insert"
  >("insert");
  const [drawing, setDrawing] = useState<DrawingState>(null);
  const [effect, setEffect] = useState<EffectState>(null);
  const workspaceContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTool !== "format") {
      setDrawing(null);
      setEffect(null);
    }
  }, [activeTool]);

  const page = store?.activePage;
  const pageChildren = Array.isArray(page?.children) ? page.children : [];
  const selectedElements = Array.isArray(store?.selectedElements)
    ? store.selectedElements
    : [];
  const hasSelection = selectedElements.length > 0;

  const removeElementById = (id: string) => {
    if (!id) return;
    const anyPage: any = page as any;
    if (anyPage && typeof anyPage?.removeElement === "function") {
      anyPage.removeElement(id);
      return;
    }
    const el = pageChildren.find((c: any) => c?.id === id);
    if (el && typeof el?.remove === "function") el.remove();
  };

  const applyGradient = () => {
    if (!effect || effect.tool !== "gradient") return;
    if (!page || typeof page?.addElement !== "function") return;
    const storeW = Number(store?.width) || 0;
    const storeH = Number(store?.height) || 0;
    if (storeW <= 0 || storeH <= 0) return;

    const angle = Number(effect.angle) || 0;
    const opacity = Math.max(0, Math.min(1, Number(effect.opacity) || 0));
    const c1 = effect.color1 || "#2563EB";
    const c2 = effect.color2 || "#60A5FA";

    const makeSvg = (w: number, h: number) =>
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox" gradientTransform="rotate(${angle} 0.5 0.5)"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="0" y="0" width="${w}" height="${h}" fill="url(#g)" opacity="${opacity}"/></svg>`;

    const created: any[] = [];
    const useSelection = effect.applyTo === "selection" && hasSelection;

    if (!useSelection) {
      const overlay = page.addElement({
        type: "image",
        src: makeSvgDataUrl(makeSvg(storeW, storeH)),
        x: 0,
        y: 0,
        width: storeW,
        height: storeH,
        selectable: true,
        draggable: true,
        alwaysOnTop: true,
        name: "gradient-overlay",
        custom: { tool: "gradient", angle, opacity, color1: c1, color2: c2 },
      });
      if (overlay) created.push(overlay);
    } else {
      selectedElements.forEach((el: any) => {
        const w = Number(el?.width) || 0;
        const h = Number(el?.height) || 0;
        if (w <= 0 || h <= 0) return;
        const overlay = page.addElement({
          type: "image",
          src: makeSvgDataUrl(makeSvg(w, h)),
          x: Number(el?.x) || 0,
          y: Number(el?.y) || 0,
          width: w,
          height: h,
          selectable: true,
          draggable: true,
          alwaysOnTop: true,
          name: "gradient-overlay",
          custom: {
            tool: "gradient",
            targetId: el?.id,
            angle,
            opacity,
            color1: c1,
            color2: c2,
          },
        });
        if (overlay) created.push(overlay);
      });
    }

    if (created.length && typeof store?.selectElements === "function") {
      store.selectElements(created);
    }
  };

  const applyBlur = (next?: Partial<Extract<EffectState, { tool: "blur" }>>) => {
    if (!page) return;
    const current =
      effect && effect.tool === "blur" ? { ...effect, ...(next || {}) } : null;
    if (!current) return;

    const radius = Math.max(0, Number(current.radius) || 0);
    const applyTo = current.target === "selection" && hasSelection ? "selection" : "base";

    const targets =
      applyTo === "selection"
        ? selectedElements
        : pageChildren.filter((c: any) => c?.type === "image" && c?.name === "base-image");

    const fallbackTargets =
      targets.length > 0
        ? targets
        : applyTo === "base"
          ? pageChildren.filter((c: any) => c?.type === "image").slice(0, 1)
          : [];

    fallbackTargets.forEach((el: any) => {
      if (el?.type !== "image" || typeof el?.set !== "function") return;
      if (radius <= 0) {
        el.set({ blurEnabled: false, blurRadius: 0 });
        return;
      }
      el.set({ blurEnabled: true, blurRadius: radius });
    });
  };
  const [inkRevision, setInkRevision] = useState(0);
  const clearInk = () => setInkRevision((v) => v + 1);

  return (
    <div className="w-full h-full bg-[#f3f4f6] flex flex-col relative">
      <div className="flex-1 flex overflow-hidden">
        <EditorUI
          store={store}
          workspaceContainerRef={workspaceContainerRef}
          drawing={drawing}
          setDrawing={setDrawing}
          effect={effect}
          setEffect={setEffect}
          onApplyGradient={applyGradient}
          onApplyBlur={applyBlur}
          onClearInk={clearInk}
          hasSelection={hasSelection}
          inkRevision={inkRevision}
        />
      </div>
      {/* BOTTOM TOOLBAR */}

      

      {/* TOP PANELS (except AI Prompter) */}
      {activeTool !== "ai_prompter" && (
        <ToolPanel
          activeTool={activeTool}
          store={store}
          setActiveTool={setActiveTool}
          drawing={drawing}
          setDrawing={setDrawing}
          effect={effect}
          setEffect={setEffect}
        />
      )}

      <EditorBottomToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        editorType="image"
      />

      {/* AI PROMPTER BELOW TOOLBAR */}
      {activeTool === "ai_prompter" && (
        <ToolPanel
          activeTool={activeTool}
          store={store}
          setActiveTool={setActiveTool}
          drawing={drawing}
          setDrawing={setDrawing}
          effect={effect}
          setEffect={setEffect}
        />
      )}
    </div>
  );
});

export default PhotoEditor;
