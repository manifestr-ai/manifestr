import React, { useEffect, useMemo, useState } from "react";
import { Popover, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

interface TransitionsPanelProps {
  store: any;
}

type TransitionEffect = "none" | "fade" | "slide" | "push" | "zoom";
type TransitionDirection = "left" | "right" | "up" | "down";

type TransitionSpec = {
  effect: TransitionEffect;
  direction: TransitionDirection;
  durationMs: number;
};

const DEFAULT_TRANSITION: TransitionSpec = {
  effect: "none",
  direction: "right",
  durationMs: 600,
};

const EFFECTS: Array<{ id: TransitionEffect; label: string; description: string }> = [
  { id: "none", label: "None", description: "No transition" },
  { id: "fade", label: "Fade", description: "Smooth fade" },
  { id: "slide", label: "Slide", description: "Slide in" },
  { id: "push", label: "Push", description: "Push in" },
  { id: "zoom", label: "Zoom", description: "Zoom in" },
];

const DIRECTIONS: Array<{ id: TransitionDirection; label: string }> = [
  { id: "right", label: "Right" },
  { id: "left", label: "Left" },
  { id: "down", label: "Down" },
  { id: "up", label: "Up" },
];

function isFn(v: any): v is (...args: any[]) => any {
  return typeof v === "function";
}

function coerceTransitionSpec(value: any): TransitionSpec {
  const effect: TransitionEffect = EFFECTS.some((e) => e.id === value?.effect)
    ? value.effect
    : DEFAULT_TRANSITION.effect;

  const direction: TransitionDirection = DIRECTIONS.some((d) => d.id === value?.direction)
    ? value.direction
    : DEFAULT_TRANSITION.direction;

  const durationMs =
    typeof value?.durationMs === "number" && Number.isFinite(value.durationMs)
      ? Math.max(0, Math.min(5000, Math.round(value.durationMs)))
      : DEFAULT_TRANSITION.durationMs;

  return { effect, direction, durationMs };
}

export default observer(function TransitionsPanel({ store }: TransitionsPanelProps) {
  const page = store?.activePage;

  const [transition, setTransition] = useState<TransitionSpec>(DEFAULT_TRANSITION);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [previewAnimate, setPreviewAnimate] = useState(false);

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

  useEffect(() => {
    if (!page) return;
    const spec = coerceTransitionSpec(page?.custom?.transition);
    setTransition(spec);
  }, [page?.id]);

  const applyToPage = (targetPage: any, spec: TransitionSpec) => {
    if (!targetPage || !isFn(targetPage.set)) return;
    const prevCustom = targetPage.custom && typeof targetPage.custom === "object" ? targetPage.custom : {};
    targetPage.set({
      custom: {
        ...prevCustom,
        transition: spec,
      },
    });
  };

  const applyTransition = (patch: Partial<TransitionSpec>) => {
    if (!page) return;
    const next: TransitionSpec = {
      ...transition,
      ...patch,
    };
    setTransition(next);
    withHistoryTransaction(() => applyToPage(page, next));
  };

  const applyToAll = () => {
    if (!Array.isArray(store?.pages) || store.pages.length === 0) return;
    withHistoryTransaction(() => {
      store.pages.forEach((p: any) => applyToPage(p, transition));
    });
  };

  const resetTransition = (scope: "current" | "all") => {
    setTransition(DEFAULT_TRANSITION);
    if (scope === "current") {
      if (!page) return;
      withHistoryTransaction(() => applyToPage(page, DEFAULT_TRANSITION));
      return;
    }
    if (!Array.isArray(store?.pages)) return;
    withHistoryTransaction(() => {
      store.pages.forEach((p: any) => applyToPage(p, DEFAULT_TRANSITION));
    });
  };

  const preview = async () => {
    if (!page || !isFn(store?.toDataURL)) return;
    setPreviewDataUrl(null);
    setIsPreviewOpen(true);
    setPreviewAnimate(false);
    try {
      const url = await store.toDataURL({ pageId: page.id, pixelRatio: 0.75 });
      setPreviewDataUrl(url);
      requestAnimationFrame(() => setPreviewAnimate(true));
    } catch {
      setIsPreviewOpen(false);
    }
  };

  const effectLabel = useMemo(() => {
    const f = EFFECTS.find((e) => e.id === transition.effect);
    return f ? f.label : "None";
  }, [transition.effect]);

  const dirLabel = useMemo(() => {
    const d = DIRECTIONS.find((x) => x.id === transition.direction);
    return d ? d.label : "Right";
  }, [transition.direction]);

  const durationLabel = useMemo(() => {
    const s = (transition.durationMs / 1000).toFixed(2).replace(/\.00$/, "");
    return `${s}s`;
  }, [transition.durationMs]);

  // if (!selected || selected.length === 0) {
  //   return (
  //     <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
  //       Select an element to arrange
  //     </div>
  //   );
  // }
  if (!page) {
    return (
      <div className="h-[102px] flex items-center justify-center text-gray-400 text-sm">
        No slide selected
      </div>
    );
  }

  const previewContainerStyle: React.CSSProperties = {
    width: "min(78vw, 980px)",
    aspectRatio: "16 / 9",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
  };

  const enterFromTransform = (() => {
    if (transition.effect === "zoom") return "scale(0.9)";
    if (transition.effect === "slide" || transition.effect === "push") {
      if (transition.direction === "left") return "translateX(-100%)";
      if (transition.direction === "right") return "translateX(100%)";
      if (transition.direction === "up") return "translateY(-100%)";
      return "translateY(100%)";
    }
    return "none";
  })();

  const initialOpacity = transition.effect === "fade" || transition.effect === "zoom" ? 0 : 1;

  const previewImageStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transform: previewAnimate ? "none" : enterFromTransform,
    opacity: previewAnimate ? 1 : initialOpacity,
    transition:
      transition.effect === "none"
        ? "none"
        : `transform ${transition.durationMs}ms ease, opacity ${transition.durationMs}ms ease`,
  };

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            style={previewContainerStyle}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {previewDataUrl ? (
              <img src={previewDataUrl} alt="Transition preview" style={previewImageStyle} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                Preparing preview...
              </div>
            )}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-md bg-white/90 border border-[#E5E7EB] text-[12px] hover:bg-white"
                onClick={() => {
                  setPreviewAnimate(false);
                  requestAnimationFrame(() => setPreviewAnimate(true));
                }}
              >
                Replay
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-md bg-white/90 border border-[#E5E7EB] text-[12px] hover:bg-white"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md bg-white/90 border border-[#E5E7EB] text-[12px]">
              {effectLabel} · {dirLabel} · {durationLabel}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center min-w-[200px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          History
        </span>
        <div className="flex flex-row items-center gap-[12px]">
          <button
            className={`px-3 py-2 rounded-md transition border border-[#E5E7EB] text-[11px] ${
              canUndo ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
            }`}
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
            type="button"
            disabled={!canRedo}
            onClick={redo}
          >
            Redo
          </button>
          <button
            className="px-3 py-2 rounded-md transition border border-[#E5E7EB] text-[11px] hover:bg-[#E9EBF0]"
            type="button"
            onClick={() => resetTransition("current")}
          >
            Reset
          </button>
        </div>
      </div>

      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Transition Effects */}
      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Transition Effects
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Select Effect */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="grid grid-cols-2 gap-2">
                  {EFFECTS.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      className={`border rounded-md px-2 py-2 text-left hover:bg-[#F3F4F6] ${
                        transition.effect === e.id ? "border-[#2563EB]" : "border-[#E5E7EB]"
                      }`}
                      onClick={() => applyTransition({ effect: e.id })}
                    >
                      <div className="text-[12px] text-[#111827]">{e.label}</div>
                      <div className="text-[10px] text-[#6A7282]">{e.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[80px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                  d="M3.33203 8H12.6654"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 3.33594L12.6667 8.0026L8 12.6693"
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
                {effectLabel}
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Direction
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Direction */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[220px]">
                <div className="grid grid-cols-2 gap-2">
                  {DIRECTIONS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`border rounded-md px-2 py-2 text-left hover:bg-[#F3F4F6] ${
                        transition.direction === d.id ? "border-[#2563EB]" : "border-[#E5E7EB]"
                      }`}
                      onClick={() => applyTransition({ direction: d.id })}
                    >
                      <div className="text-[12px] text-[#111827]">{d.label}</div>
                      <div className="text-[10px] text-[#6A7282]">Direction</div>
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[64px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                <g clip-path="url(#clip0_10297_389641)">
                  <path
                    d="M12 5.33594L14.6667 8.0026L12 10.6693"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1.33203 8H14.6654"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.9987 5.33594L1.33203 8.0026L3.9987 10.6693"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10297_389641">
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
                {dirLabel}
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Timing
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Duration */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="text-[12px] text-[#111827] mb-2">Duration</div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="range"
                    min={0}
                    max={3000}
                    step={50}
                    value={transition.durationMs}
                    onChange={(e) => applyTransition({ durationMs: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 300, 500, 700, 1000, 1500, 2000].map((ms) => (
                    <button
                      key={ms}
                      type="button"
                      className={`border rounded-md px-2 py-2 text-[11px] hover:bg-[#F3F4F6] ${
                        transition.durationMs === ms ? "border-[#2563EB]" : "border-[#E5E7EB]"
                      }`}
                      onClick={() => applyTransition({ durationMs: ms })}
                    >
                      {ms === 0 ? "0s" : `${(ms / 1000).toFixed(1)}s`}
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[64px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                <g clip-path="url(#clip0_10297_389652)">
                  <path
                    d="M8 4V8L10.6667 9.33333"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.9987 14.6693C11.6806 14.6693 14.6654 11.6845 14.6654 8.0026C14.6654 4.32071 11.6806 1.33594 7.9987 1.33594C4.3168 1.33594 1.33203 4.32071 1.33203 8.0026C1.33203 11.6845 4.3168 14.6693 7.9987 14.6693Z"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10297_389652">
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
                {durationLabel}
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[250px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Apply
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Apply to All */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={applyToAll}
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
              <path
                d="M4.66797 2V14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 5H4.66667"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 8H14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 11H4.66667"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.332 2V14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.332 5H13.9987"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.332 11H13.9987"
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
              Apply to All
            </span>
          </button>

          {/* Preview */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={preview}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M9.33333 2.73438L8 4.00104"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.39818 5.33021L1.46484 4.79688"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.00104 8L2.73438 9.33333"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.80078 1.46875L5.33411 3.40208"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.02639 6.46173C6.00054 6.40083 5.99348 6.3336 6.0061 6.26865C6.01872 6.20371 6.05046 6.14402 6.09724 6.09724C6.14402 6.05046 6.20371 6.01872 6.26865 6.0061C6.3336 5.99348 6.40083 6.00054 6.46173 6.02639L13.7951 9.02639C13.8603 9.05317 13.9154 9.09996 13.9524 9.16004C13.9894 9.22011 14.0064 9.29037 14.0009 9.3607C13.9954 9.43103 13.9677 9.49781 13.9219 9.55143C13.876 9.60504 13.8144 9.64273 13.7457 9.65906L10.8464 10.3531C10.7267 10.3817 10.6173 10.4428 10.5302 10.5298C10.4431 10.6167 10.3818 10.7261 10.3531 10.8457L9.65973 13.7457C9.64357 13.8146 9.60593 13.8765 9.55224 13.9226C9.49856 13.9686 9.43161 13.9964 9.36109 14.0019C9.29058 14.0074 9.22014 13.9903 9.15997 13.9531C9.0998 13.9159 9.05302 13.8606 9.02639 13.7951L6.02639 6.46173Z"
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
              Preview
            </span>
          </button>

          <button
            className="flex flex-col items-center justify-center w-[44px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={() => resetTransition("all")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M13.3333 8.0013C13.3333 10.9468 10.9455 13.3346 8 13.3346C5.05448 13.3346 2.66667 10.9468 2.66667 8.0013C2.66667 5.05578 5.05448 2.66797 8 2.66797"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 1.33594V2.66927"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 2.66797H8.0013"
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
              Reset
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});
