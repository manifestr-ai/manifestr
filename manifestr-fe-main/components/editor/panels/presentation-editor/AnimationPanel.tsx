import React, { useEffect, useMemo, useState } from "react";
import { Popover, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

interface AnimationPanelProps {
  store: any;
}

type AnimationType = "enter" | "exit" | "loop";
type AnimationName =
  | "none"
  | "fade"
  | "move"
  | "zoom"
  | "rotate"
  | "blink"
  | "bounce"
  | "cameraZoom";
type Direction =
  | "right"
  | "left"
  | "up"
  | "down"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
type ZoomDirection = "in" | "out";
type StartMode = "on-click" | "with-previous" | "after-previous";

type AnimationSpec = {
  type: AnimationType;
  name: AnimationName;
  duration: number;
  delay: number;
  enabled: boolean;
  data: Record<string, any>;
};

const DEFAULT_ANIMATION: AnimationSpec = {
  type: "enter",
  name: "none",
  duration: 700,
  delay: 0,
  enabled: true,
  data: { start: "on-click" satisfies StartMode },
};

const EFFECTS: Array<{ id: AnimationName; label: string; description: string }> = [
  { id: "none", label: "None", description: "No animation" },
  { id: "fade", label: "Fade", description: "Fade in/out" },
  { id: "move", label: "Move", description: "Move from direction" },
  { id: "zoom", label: "Zoom", description: "Zoom in/out" },
  { id: "rotate", label: "Rotate", description: "Rotate around center" },
  { id: "blink", label: "Blink", description: "Blink effect" },
  { id: "bounce", label: "Bounce", description: "Bounce effect" },
  { id: "cameraZoom", label: "Camera Zoom", description: "Zoom camera to element" },
];

const DIRECTIONS: Array<{ id: Direction; label: string }> = [
  { id: "right", label: "Right" },
  { id: "left", label: "Left" },
  { id: "down", label: "Down" },
  { id: "up", label: "Up" },
  { id: "top-left", label: "Top Left" },
  { id: "top-right", label: "Top Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "bottom-right", label: "Bottom Right" },
];

const START_MODES: Array<{ id: StartMode; label: string; description: string }> = [
  { id: "on-click", label: "On Click", description: "Starts when you click" },
  { id: "with-previous", label: "With Previous", description: "Starts at same time" },
  { id: "after-previous", label: "After Previous", description: "Starts after previous" },
];

function isFn(v: any): v is (...args: any[]) => any {
  return typeof v === "function";
}

function coerceAnimationType(v: any): AnimationType {
  return v === "exit" || v === "loop" || v === "enter" ? v : "enter";
}

function coerceAnimationName(v: any): AnimationName {
  return EFFECTS.some((e) => e.id === v) ? v : "none";
}

function coerceStartMode(v: any): StartMode {
  return v === "with-previous" || v === "after-previous" || v === "on-click" ? v : "on-click";
}

function normalizeAnimation(anyAnim: any): AnimationSpec {
  const type = coerceAnimationType(anyAnim?.type);
  const name = coerceAnimationName(anyAnim?.name);
  const duration =
    typeof anyAnim?.duration === "number" && Number.isFinite(anyAnim.duration)
      ? Math.max(0, Math.min(5000, Math.round(anyAnim.duration)))
      : DEFAULT_ANIMATION.duration;
  const delay =
    typeof anyAnim?.delay === "number" && Number.isFinite(anyAnim.delay)
      ? Math.max(0, Math.min(5000, Math.round(anyAnim.delay)))
      : DEFAULT_ANIMATION.delay;
  const enabled = typeof anyAnim?.enabled === "boolean" ? anyAnim.enabled : true;
  const data = anyAnim?.data && typeof anyAnim.data === "object" ? anyAnim.data : {};
  const start = coerceStartMode(data.start);
  const nextData = { ...data, start };

  return { type, name, duration, delay, enabled, data: nextData };
}

export default observer(function AnimationPanel({ store }: AnimationPanelProps) {
  const selectedElements: any[] = store?.selectedElements || [];
  const hasSelection = selectedElements.length > 0;
  const page = store?.activePage;

  const [anim, setAnim] = useState<AnimationSpec>(DEFAULT_ANIMATION);

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
    const first = selectedElements[0];
    const current = Array.isArray(first?.animations) && first.animations.length > 0 ? first.animations[0] : null;
    setAnim(current ? normalizeAnimation(current) : DEFAULT_ANIMATION);
  }, [selectedElements.map((e) => e?.id).join("|")]);

  const buildDataForName = (name: AnimationName, base: AnimationSpec): Record<string, any> => {
    const start = coerceStartMode(base.data?.start);
    if (name === "move") {
      return { start, direction: base.data?.direction || "right", strength: base.data?.strength ?? 1 };
    }
    if (name === "zoom") {
      return { start, direction: base.data?.direction || "in", strength: base.data?.strength ?? 1 };
    }
    if (name === "cameraZoom") {
      return { start, direction: base.data?.direction || "in", strength: base.data?.strength ?? 1 };
    }
    if (name === "bounce") {
      return { start, strength: base.data?.strength ?? 1 };
    }
    return { start };
  };

  const applyToSelected = (next: AnimationSpec) => {
    setAnim(next);
    if (!hasSelection) return;
    withHistoryTransaction(() => {
      selectedElements.forEach((el) => {
        if (!el || !isFn(el.set)) return;
        if (next.name === "none") {
          el.set({ animations: [] });
          return;
        }
        el.set({
          animations: [
            {
              type: next.type,
              name: next.name,
              delay: next.delay,
              duration: next.duration,
              enabled: next.enabled,
              data: buildDataForName(next.name, next),
            },
          ],
        });
      });
    });
  };

  const setEffect = (name: AnimationName) => {
    const next: AnimationSpec = {
      ...anim,
      name,
      data: buildDataForName(name, anim),
      enabled: name === "none" ? true : anim.enabled,
    };
    applyToSelected(next);
  };

  const setDirection = (direction: Direction) => {
    const next: AnimationSpec = {
      ...anim,
      data: { ...anim.data, direction },
    };
    applyToSelected(next);
  };

  const setZoomDirection = (direction: ZoomDirection) => {
    const next: AnimationSpec = {
      ...anim,
      data: { ...anim.data, direction },
    };
    applyToSelected(next);
  };

  const setDuration = (duration: number) => applyToSelected({ ...anim, duration });
  const setDelay = (delay: number) => applyToSelected({ ...anim, delay });
  const setType = (type: AnimationType) => applyToSelected({ ...anim, type });
  const setStartMode = (start: StartMode) =>
    applyToSelected({ ...anim, data: { ...anim.data, start } });

  const clearAnimation = () => applyToSelected(DEFAULT_ANIMATION);

  const previewSelected = () => {
    if (!page || !isFn(store?.play)) return;
    const ids = selectedElements.map((e) => e?.id).filter(Boolean);
    if (ids.length === 0) return;
    const maxTime = Math.max(0, anim.delay + anim.duration) + 300;
    store.play({
      animatedElementsIds: ids,
      startTime: page.startTime || 0,
      endTime: (page.startTime || 0) + maxTime,
      repeat: false,
    });
  };

  const playAll = () => {
    if (!isFn(store?.play)) return;
    store.play();
  };

  const effectLabel = useMemo(() => {
    const f = EFFECTS.find((e) => e.id === anim.name);
    return f ? f.label : "None";
  }, [anim.name]);

  const durationLabel = useMemo(() => {
    const s = (anim.duration / 1000).toFixed(2).replace(/\.00$/, "");
    return `${s}s`;
  }, [anim.duration]);

  const delayLabel = useMemo(() => {
    const s = (anim.delay / 1000).toFixed(2).replace(/\.00$/, "");
    return `${s}s`;
  }, [anim.delay]);

  const directionLabel = useMemo(() => {
    const d = DIRECTIONS.find((x) => x.id === anim.data?.direction);
    return d ? d.label : "Right";
  }, [anim.data?.direction]);

  // if (!selected || selected.length === 0) {
  //   return (
  //     <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
  //       Select an element to arrange
  //     </div>
  //   );
  // }
  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
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
            className={`px-3 py-2 rounded-md transition border border-[#E5E7EB] text-[11px] ${
              hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
            }`}
            type="button"
            disabled={!hasSelection}
            onClick={clearAnimation}
          >
            Reset
          </button>
        </div>
      </div>

      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Animation Effects */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Animation Effects
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Add Effect */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[280px]">
                <div className="grid grid-cols-2 gap-2">
                  {EFFECTS.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      disabled={!hasSelection}
                      className={`border rounded-md px-2 py-2 text-left ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      } ${anim.name === e.id ? "border-[#2563EB]" : "border-[#E5E7EB]"}`}
                      onClick={() => setEffect(e.id)}
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
              className={`flex flex-col items-center justify-center w-[88px] rounded-md transition bg-transparent py-2 ${
                hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
              }`}
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
                <g clip-path="url(#clip0_10297_389949)">
                  <path
                    d="M2.66503 9.32986C2.53888 9.33029 2.41519 9.29492 2.30834 9.22785C2.20148 9.16078 2.11586 9.06477 2.0614 8.95097C2.00694 8.83717 1.9859 8.71025 2.0007 8.58497C2.0155 8.45968 2.06555 8.34117 2.14503 8.24319L8.74503 1.44319C8.79454 1.38605 8.86201 1.34743 8.93636 1.33368C9.0107 1.31993 9.08752 1.33187 9.15419 1.36753C9.22086 1.40319 9.27342 1.46046 9.30326 1.52993C9.33309 1.59941 9.33842 1.67696 9.31837 1.74986L8.03837 5.76319C8.00062 5.86421 7.98795 5.97287 8.00143 6.07987C8.01491 6.18686 8.05414 6.28898 8.11576 6.37748C8.17738 6.46598 8.25955 6.5382 8.35522 6.58797C8.45089 6.63773 8.5572 6.66355 8.66503 6.66319H13.3317C13.4579 6.66276 13.5815 6.69814 13.6884 6.76521C13.7952 6.83228 13.8809 6.92829 13.9353 7.04209C13.9898 7.15589 14.0108 7.2828 13.996 7.40809C13.9812 7.53338 13.9312 7.65189 13.8517 7.74986L7.2517 14.5499C7.20219 14.607 7.13473 14.6456 7.06038 14.6594C6.98603 14.6731 6.90922 14.6612 6.84255 14.6255C6.77588 14.5899 6.72331 14.5326 6.69348 14.4631C6.66364 14.3936 6.65832 14.3161 6.67837 14.2432L7.95837 10.2299C7.99611 10.1288 8.00879 10.0202 7.99531 9.91319C7.98183 9.8062 7.94259 9.70407 7.88097 9.61558C7.81935 9.52708 7.73719 9.45485 7.64152 9.40509C7.54585 9.35532 7.43954 9.32951 7.3317 9.32986H2.66503Z"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10297_389949">
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
                {effectLabel}
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Effect Options
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Direction */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                {anim.name === "zoom" || anim.name === "cameraZoom" ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "in" as ZoomDirection, label: "In" },
                      { id: "out" as ZoomDirection, label: "Out" },
                    ].map((z) => (
                      <button
                        key={z.id}
                        type="button"
                        disabled={!hasSelection}
                        className={`border rounded-md px-2 py-2 text-left ${
                          !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                        } ${
                          (anim.data?.direction || "in") === z.id
                            ? "border-[#2563EB]"
                            : "border-[#E5E7EB]"
                        }`}
                        onClick={() => setZoomDirection(z.id)}
                      >
                        <div className="text-[12px] text-[#111827]">{z.label}</div>
                        <div className="text-[10px] text-[#6A7282]">Zoom direction</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {DIRECTIONS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        disabled={!hasSelection}
                        className={`border rounded-md px-2 py-2 text-left ${
                          !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                        } ${
                          (anim.data?.direction || "right") === d.id
                            ? "border-[#2563EB]"
                            : "border-[#E5E7EB]"
                        }`}
                        onClick={() => setDirection(d.id)}
                      >
                        <div className="text-[12px] text-[#111827]">{d.label}</div>
                        <div className="text-[10px] text-[#6A7282]">Direction</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          >
            <button
              className={`flex flex-col items-center justify-center w-[60px] rounded-md transition bg-transparent py-2 ${
                hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
              }`}
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
              Direction
            </span>
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
                {anim.name === "zoom" || anim.name === "cameraZoom"
                  ? (anim.data?.direction || "in") === "out"
                    ? "Out"
                    : "In"
                  : directionLabel}
              </span>
            </button>
          </Popover>

          {/* Duration */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="text-[12px] text-[#111827] mb-2">Duration</div>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={50}
                  value={anim.duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full"
                  disabled={!hasSelection}
                />
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[200, 400, 700, 1000, 1500, 2000, 3000].map((ms) => (
                    <button
                      key={ms}
                      type="button"
                      disabled={!hasSelection}
                      className={`border rounded-md px-2 py-2 text-[11px] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      } ${anim.duration === ms ? "border-[#2563EB]" : "border-[#E5E7EB]"}`}
                      onClick={() => setDuration(ms)}
                    >
                      {(ms / 1000).toFixed(1)}s
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button
              className={`flex flex-col items-center justify-center w-[60px] rounded-md transition bg-transparent py-2 ${
                hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
              }`}
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
              <g clip-path="url(#clip0_10297_389966)">
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
                <clipPath id="clip0_10297_389966">
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
              Duration
            </span>
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

      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Timing
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Start */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[320px]">
                <div className="text-[12px] text-[#111827] mb-2">Start</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {START_MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      disabled={!hasSelection}
                      className={`border rounded-md px-2 py-2 text-left ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      } ${
                        coerceStartMode(anim.data?.start) === m.id
                          ? "border-[#2563EB]"
                          : "border-[#E5E7EB]"
                      }`}
                      onClick={() => setStartMode(m.id)}
                    >
                      <div className="text-[12px] text-[#111827]">{m.label}</div>
                      <div className="text-[10px] text-[#6A7282]">{m.description}</div>
                    </button>
                  ))}
                </div>
                <div className="text-[12px] text-[#111827] mb-2">Type</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["enter", "exit", "loop"] as AnimationType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      disabled={!hasSelection}
                      className={`border rounded-md px-2 py-2 text-[11px] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      } ${anim.type === t ? "border-[#2563EB]" : "border-[#E5E7EB]"}`}
                      onClick={() => setType(t)}
                    >
                      {t === "enter" ? "Enter" : t === "exit" ? "Exit" : "Loop"}
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button
              className={`flex flex-col items-center justify-center w-[60px] rounded-md transition bg-transparent py-2 ${
                hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
              }`}
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
              Start
            </span>
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
                {coerceStartMode(anim.data?.start) === "after-previous"
                  ? "After"
                  : coerceStartMode(anim.data?.start) === "with-previous"
                    ? "With"
                    : "Click"}
              </span>
            </button>
          </Popover>

          {/* Delay */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[260px]">
                <div className="text-[12px] text-[#111827] mb-2">Delay</div>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={50}
                  value={anim.delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-full"
                  disabled={!hasSelection}
                />
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[0, 200, 500, 800, 1200, 2000].map((ms) => (
                    <button
                      key={ms}
                      type="button"
                      disabled={!hasSelection}
                      className={`border rounded-md px-2 py-2 text-[11px] ${
                        !hasSelection ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F3F4F6]"
                      } ${anim.delay === ms ? "border-[#2563EB]" : "border-[#E5E7EB]"}`}
                      onClick={() => setDelay(ms)}
                    >
                      {ms === 0 ? "0s" : `${(ms / 1000).toFixed(1)}s`}
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button
              className={`flex flex-col items-center justify-center w-[60px] rounded-md transition bg-transparent py-2 ${
                hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
              }`}
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
              <g clip-path="url(#clip0_10297_389986)">
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
                <clipPath id="clip0_10297_389986">
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
              Delay
            </span>
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
                {delayLabel}
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[280px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Advanced
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Animation Pane */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[320px]">
                <div className="text-[12px] text-[#111827] mb-2">Selected element animations</div>
                {!hasSelection ? (
                  <div className="text-[12px] text-[#6A7282]">Select an element first</div>
                ) : (
                  <div className="space-y-2">
                    {selectedElements.slice(0, 3).map((el) => {
                      const a =
                        Array.isArray(el?.animations) && el.animations.length > 0
                          ? normalizeAnimation(el.animations[0])
                          : DEFAULT_ANIMATION;
                      return (
                        <div
                          key={el.id}
                          className="flex items-center justify-between border border-[#E5E7EB] rounded-md px-2 py-2"
                        >
                          <div className="min-w-0">
                            <div className="text-[12px] text-[#111827] truncate">
                              {el.name || el.type}
                            </div>
                            <div className="text-[10px] text-[#6A7282]">
                              {a.name} · {(a.duration / 1000).toFixed(1)}s · delay{" "}
                              {(a.delay / 1000).toFixed(1)}s
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-2 py-1 rounded border border-[#E5E7EB] text-[11px] hover:bg-[#F3F4F6]"
                            onClick={() => {
                              if (!isFn(el?.set)) return;
                              withHistoryTransaction(() => el.set({ animations: [] }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                    {selectedElements.length > 3 && (
                      <div className="text-[10px] text-[#6A7282]">
                        Showing first 3 selected elements
                      </div>
                    )}
                  </div>
                )}
              </div>
            }
          >
            <button
              className={`flex flex-col items-center justify-center w-[95px]  rounded-md transition bg-transparent py-2 ${
                hasSelection ? "hover:bg-[#E9EBF0]" : "opacity-40 cursor-not-allowed"
              }`}
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
              <g clip-path="url(#clip0_10297_389997)">
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
              </g>
              <defs>
                <clipPath id="clip0_10297_389997">
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
              Animation Pane
            </span>
            </button>
          </Popover>

          {/* Preview */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            disabled={!hasSelection}
            onClick={previewSelected}
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

          {/* Play All */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={playAll}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3.33203 3.33373C3.33196 3.09912 3.39379 2.86865 3.51129 2.66559C3.62878 2.46252 3.79777 2.29406 4.0012 2.17719C4.20463 2.06033 4.43529 1.99921 4.66989 2.00001C4.90449 2.0008 5.13474 2.06349 5.33736 2.18173L13.3354 6.84706C13.5372 6.96418 13.7048 7.13223 13.8213 7.3344C13.9379 7.53657 13.9993 7.76579 13.9995 7.99915C13.9997 8.23251 13.9387 8.46184 13.8225 8.66422C13.7063 8.86659 13.539 9.03493 13.3374 9.15239L5.33736 13.8191C5.13474 13.9373 4.90449 14 4.66989 14.0008C4.43529 14.0016 4.20463 13.9405 4.0012 13.8236C3.79777 13.7067 3.62878 13.5383 3.51129 13.3352C3.39379 13.1321 3.33196 12.9017 3.33203 12.6671V3.33373Z"
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
              Play All
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});
