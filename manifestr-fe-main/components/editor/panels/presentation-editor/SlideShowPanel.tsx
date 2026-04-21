import React, { useEffect, useMemo, useRef, useState } from "react";
import { Popover, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

interface SlideShowPanelProps {
  store: any;
}

type TransitionEffect = "none" | "fade" | "slide" | "push" | "zoom";
type TransitionDirection = "left" | "right" | "up" | "down";
type TransitionSpec = {
  effect: TransitionEffect;
  direction: TransitionDirection;
  durationMs: number;
};

type SlideShowSettings = {
  loop: boolean;
  autoplay: boolean;
  autoplayIntervalMs: number;
  showProgress: boolean;
  useTransitions: boolean;
};

const DEFAULT_TRANSITION: TransitionSpec = {
  effect: "none",
  direction: "right",
  durationMs: 600,
};

const DEFAULT_SETTINGS: SlideShowSettings = {
  loop: false,
  autoplay: false,
  autoplayIntervalMs: 4000,
  showProgress: true,
  useTransitions: true,
};

function isFn(v: any): v is (...args: any[]) => any {
  return typeof v === "function";
}

function coerceTransitionSpec(value: any): TransitionSpec {
  const effect: TransitionEffect =
    value?.effect === "fade" ||
    value?.effect === "slide" ||
    value?.effect === "push" ||
    value?.effect === "zoom" ||
    value?.effect === "none"
      ? value.effect
      : DEFAULT_TRANSITION.effect;

  const direction: TransitionDirection =
    value?.direction === "left" ||
    value?.direction === "right" ||
    value?.direction === "up" ||
    value?.direction === "down"
      ? value.direction
      : DEFAULT_TRANSITION.direction;

  const durationMs =
    typeof value?.durationMs === "number" && Number.isFinite(value.durationMs)
      ? Math.max(0, Math.min(5000, Math.round(value.durationMs)))
      : DEFAULT_TRANSITION.durationMs;

  return { effect, direction, durationMs };
}

function coerceSettings(value: any): SlideShowSettings {
  const loop = typeof value?.loop === "boolean" ? value.loop : DEFAULT_SETTINGS.loop;
  const autoplay =
    typeof value?.autoplay === "boolean" ? value.autoplay : DEFAULT_SETTINGS.autoplay;
  const autoplayIntervalMs =
    typeof value?.autoplayIntervalMs === "number" && Number.isFinite(value.autoplayIntervalMs)
      ? Math.max(1000, Math.min(60000, Math.round(value.autoplayIntervalMs)))
      : DEFAULT_SETTINGS.autoplayIntervalMs;
  const showProgress =
    typeof value?.showProgress === "boolean"
      ? value.showProgress
      : DEFAULT_SETTINGS.showProgress;
  const useTransitions =
    typeof value?.useTransitions === "boolean"
      ? value.useTransitions
      : DEFAULT_SETTINGS.useTransitions;
  return { loop, autoplay, autoplayIntervalMs, showProgress, useTransitions };
}

export default observer(function SlideShowPanel({ store }: SlideShowPanelProps) {
  const page = store?.activePage;
  const pages: any[] = Array.isArray(store?.pages) ? store.pages : [];

  const [settings, setSettings] = useState<SlideShowSettings>(() =>
    coerceSettings(store?.custom?.slideshowSettings),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"present" | "presenter">("present");
  const [slideIndex, setSlideIndex] = useState(0);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [currUrl, setCurrUrl] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const activeIndex = useMemo(() => {
    if (!page || pages.length === 0) return 0;
    const idx = pages.findIndex((p) => p?.id === page.id);
    return idx >= 0 ? idx : 0;
  }, [page?.id, pages.length]);

  useEffect(() => {
    if (!isFn(store?.set)) return;
    const prevCustom = store.custom && typeof store.custom === "object" ? store.custom : {};
    store.set({ custom: { ...prevCustom, slideshowSettings: settings } });
  }, [settings, store]);

  const getTransitionForPage = (p: any): TransitionSpec => {
    if (!settings.useTransitions) return { ...DEFAULT_TRANSITION, effect: "none" };
    return coerceTransitionSpec(p?.custom?.transition);
  };

  const ensureSlideUrl = async (pageId: string): Promise<string | null> => {
    if (!pageId || !isFn(store?.toDataURL)) return null;
    const cached = cacheRef.current.get(pageId);
    if (cached) return cached;
    const url = await store.toDataURL({ pageId, pixelRatio: 1 });
    cacheRef.current.set(pageId, url);
    return url;
  };

  const preloadImage = (url: string) => {
    if (!url || typeof window === "undefined") return;
    const img = new Image();
    img.src = url;
  };

  const goTo = async (idx: number, direction: "forward" | "backward") => {
    if (pages.length === 0) return;
    const clamped =
      idx < 0 ? (settings.loop ? pages.length - 1 : 0) : idx >= pages.length ? (settings.loop ? 0 : pages.length - 1) : idx;

    const nextPage = pages[clamped];
    if (!nextPage?.id) return;

    const outgoingUrl = currUrl;
    const incomingUrl = await ensureSlideUrl(nextPage.id);
    if (!incomingUrl) return;

    const transitionSpec = getTransitionForPage(nextPage);
    const effective: TransitionSpec =
      transitionSpec.effect === "none" ? transitionSpec : transitionSpec;

    setPrevUrl(outgoingUrl);
    setCurrUrl(incomingUrl);
    setSlideIndex(clamped);

    if (settings.useTransitions && effective.effect !== "none") {
      setAnimating(false);
      requestAnimationFrame(() => {
        setAnimating(true);
        window.setTimeout(() => {
          setPrevUrl(null);
          setAnimating(false);
        }, Math.max(0, effective.durationMs));
      });
    } else {
      setPrevUrl(null);
      setAnimating(false);
    }

    const nextIdx = direction === "forward" ? clamped + 1 : clamped - 1;
    const nextClamped =
      nextIdx < 0 ? pages.length - 1 : nextIdx >= pages.length ? 0 : nextIdx;
    const nextPageId = pages[nextClamped]?.id;
    if (nextPageId) {
      ensureSlideUrl(nextPageId)
        .then((u) => {
          if (u) {
            setNextUrl(u);
            preloadImage(u);
          }
        })
        .catch(() => {});
    }
  };

  const openFromStart = async () => {
    if (pages.length === 0) return;
    setMode("present");
    setIsOpen(true);
    setStartedAt(Date.now());
    setPrevUrl(null);
    setNextUrl(null);
    cacheRef.current.clear();
    const firstId = pages[0]?.id;
    if (!firstId) return;
    const firstUrl = await ensureSlideUrl(firstId);
    if (!firstUrl) return;
    setSlideIndex(0);
    setCurrUrl(firstUrl);
    const secondId = pages[1]?.id;
    if (secondId) {
      const secondUrl = await ensureSlideUrl(secondId);
      if (secondUrl) {
        setNextUrl(secondUrl);
        preloadImage(secondUrl);
      }
    }
  };

  const openPresenterView = async () => {
    if (pages.length === 0) return;
    setMode("presenter");
    setIsOpen(true);
    setStartedAt(Date.now());
    setPrevUrl(null);
    setNextUrl(null);
    cacheRef.current.clear();
    const startIdx = 0;
    const startId = pages[startIdx]?.id;
    if (!startId) return;
    const url = await ensureSlideUrl(startId);
    if (!url) return;
    setSlideIndex(startIdx);
    setCurrUrl(url);
    const nextId = pages[startIdx + 1]?.id;
    if (nextId) {
      const u = await ensureSlideUrl(nextId);
      if (u) {
        setNextUrl(u);
        preloadImage(u);
      }
    }
  };

  const close = () => {
    setIsOpen(false);
    setPrevUrl(null);
    setCurrUrl(null);
    setNextUrl(null);
    setAnimating(false);
    setStartedAt(null);
    if (isFn(store?.stop)) store.stop();
  };

  const next = () => goTo(slideIndex + 1, "forward");
  const prev = () => goTo(slideIndex - 1, "backward");

  const requestFullscreen = async () => {
    const el = containerRef.current;
    if (!el || typeof document === "undefined") return;
    const d: any = document;
    if (d.fullscreenElement) {
      await d.exitFullscreen?.();
      return;
    }
    await (el as any).requestFullscreen?.();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        next();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, slideIndex, currUrl, settings.loop, settings.useTransitions]);

  useEffect(() => {
    if (!isOpen) return;
    if (!settings.autoplay) return;
    const timeout = window.setTimeout(() => {
      next();
    }, Math.max(1000, settings.autoplayIntervalMs));
    return () => window.clearTimeout(timeout);
  }, [isOpen, settings.autoplay, settings.autoplayIntervalMs, slideIndex]);

  const elapsed = useMemo(() => {
    if (!startedAt) return "0:00";
    const ms = Date.now() - startedAt;
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [startedAt, slideIndex]);

  const currentTransition = useMemo(() => {
    const p = pages[slideIndex];
    return getTransitionForPage(p);
  }, [pages, slideIndex, settings.useTransitions]);

  const enterFromTransform = useMemo(() => {
    if (!settings.useTransitions) return "none";
    if (currentTransition.effect === "zoom") return "scale(0.9)";
    if (currentTransition.effect === "slide" || currentTransition.effect === "push") {
      if (currentTransition.direction === "left") return "translateX(-100%)";
      if (currentTransition.direction === "right") return "translateX(100%)";
      if (currentTransition.direction === "up") return "translateY(-100%)";
      return "translateY(100%)";
    }
    return "none";
  }, [currentTransition.effect, currentTransition.direction, settings.useTransitions]);

  const initialOpacity = useMemo(() => {
    if (!settings.useTransitions) return 1;
    return currentTransition.effect === "fade" || currentTransition.effect === "zoom" ? 0 : 1;
  }, [currentTransition.effect, settings.useTransitions]);

  const incomingStyle: React.CSSProperties = useMemo(() => {
    const duration = settings.useTransitions ? currentTransition.durationMs : 0;
    return {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      transform:
        !settings.useTransitions || currentTransition.effect === "none"
          ? "none"
          : animating
            ? "none"
            : enterFromTransform,
      opacity:
        !settings.useTransitions || currentTransition.effect === "none"
          ? 1
          : animating
            ? 1
            : initialOpacity,
      transition:
        !settings.useTransitions || currentTransition.effect === "none"
          ? "none"
          : `transform ${duration}ms ease, opacity ${duration}ms ease`,
    };
  }, [
    animating,
    currentTransition.durationMs,
    currentTransition.effect,
    enterFromTransform,
    initialOpacity,
    settings.useTransitions,
  ]);

  const outgoingStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    opacity: 1,
  };

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999]"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={close}
        >
          <div
            ref={containerRef}
            className="w-full h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="text-white text-[13px]">
                  Slide {slideIndex + 1} / {pages.length}
                </div>
                {mode === "presenter" && (
                  <div className="text-white/70 text-[12px]">Presenter View</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-white/10 text-white text-[12px] hover:bg-white/15"
                  onClick={prev}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-white/10 text-white text-[12px] hover:bg-white/15"
                  onClick={next}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-white/10 text-white text-[12px] hover:bg-white/15"
                  onClick={requestFullscreen}
                >
                  Fullscreen
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-white/10 text-white text-[12px] hover:bg-white/15"
                  onClick={close}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-stretch gap-4 px-4 pb-4">
              <div
                className="relative flex-1 rounded-xl overflow-hidden bg-black"
                style={{ aspectRatio: `${store?.width || 16} / ${store?.height || 9}` }}
              >
                {prevUrl && <img src={prevUrl} alt="Previous slide" style={outgoingStyle} />}
                {currUrl ? (
                  <img src={currUrl} alt="Current slide" style={incomingStyle} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm">
                    Loading slide...
                  </div>
                )}

                {settings.showProgress && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-[3px] bg-white/15">
                      <div
                        className="h-[3px] bg-white/70"
                        style={{ width: `${((slideIndex + 1) / Math.max(1, pages.length)) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {mode === "presenter" && (
                <div className="w-[320px] shrink-0 flex flex-col gap-3">
                  <div className="rounded-xl bg-white/6 border border-white/10 p-3">
                    <div className="text-white/80 text-[12px] mb-2">Timer</div>
                    <div className="text-white text-[22px] font-medium">{elapsed}</div>
                  </div>
                  <div className="rounded-xl bg-white/6 border border-white/10 p-3">
                    <div className="text-white/80 text-[12px] mb-2">Next slide</div>
                    <div className="relative rounded-lg overflow-hidden bg-black" style={{ aspectRatio: "16 / 9" }}>
                      {nextUrl ? (
                        <img
                          src={nextUrl}
                          alt="Next slide"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/60 text-[12px]">
                          —
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/6 border border-white/10 p-3 flex-1">
                    <div className="text-white/80 text-[12px] mb-2">Notes</div>
                    <div className="text-white/60 text-[12px]">
                      Notes are not available yet.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Present */}
      <div className="flex flex-col items-center min-w-[250px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Present
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* From Start */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            disabled={pages.length === 0}
            onClick={openFromStart}
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
              From Start
            </span>
          </button>

          {/* Presenter View */}
          <button
            className="flex flex-col items-center justify-center w-[85px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            disabled={pages.length === 0}
            onClick={openPresenterView}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clip-path="url(#clip0_10298_390709)">
                <path
                  d="M13.332 2H2.66536C1.92898 2 1.33203 2.59695 1.33203 3.33333V10C1.33203 10.7364 1.92898 11.3333 2.66536 11.3333H13.332C14.0684 11.3333 14.6654 10.7364 14.6654 10V3.33333C14.6654 2.59695 14.0684 2 13.332 2Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.33203 14H10.6654"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 11.3359V14.0026"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10298_390709">
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
              Presenter View
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Setup */}
      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Setup
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Slide Show Settings */}
          <Popover
            position={Position.BOTTOM}
            minimal
            content={
              <div className="p-3 w-[320px]">
                <div className="text-[12px] text-[#111827] mb-2">Slide show settings</div>
                <div className="space-y-2">
                  <label className="flex items-center justify-between gap-3 text-[12px] text-[#111827]">
                    <span>Use transitions</span>
                    <input
                      type="checkbox"
                      checked={settings.useTransitions}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, useTransitions: e.target.checked }))
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-[12px] text-[#111827]">
                    <span>Show progress</span>
                    <input
                      type="checkbox"
                      checked={settings.showProgress}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, showProgress: e.target.checked }))
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-[12px] text-[#111827]">
                    <span>Loop</span>
                    <input
                      type="checkbox"
                      checked={settings.loop}
                      onChange={(e) => setSettings((s) => ({ ...s, loop: e.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-[12px] text-[#111827]">
                    <span>Autoplay</span>
                    <input
                      type="checkbox"
                      checked={settings.autoplay}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, autoplay: e.target.checked }))
                      }
                    />
                  </label>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-[#111827]">Autoplay interval</span>
                    <select
                      className="border border-[#E5E7EB] rounded-md px-2 py-1 text-[12px]"
                      value={settings.autoplayIntervalMs}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, autoplayIntervalMs: Number(e.target.value) }))
                      }
                      disabled={!settings.autoplay}
                    >
                      {[2000, 3000, 4000, 5000, 7000, 10000, 15000].map((ms) => (
                        <option key={ms} value={ms}>
                          {(ms / 1000).toFixed(0)}s
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] hover:bg-[#F3F4F6]"
                    onClick={() => setSettings(DEFAULT_SETTINGS)}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-[#E5E7EB] text-[11px] hover:bg-[#F3F4F6]"
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => openFromStart(), 0);
                    }}
                  >
                    Present
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[100px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
              <g clip-path="url(#clip0_10298_390720)">
                <path
                  d="M6.44558 2.75613C6.48232 2.36969 6.66181 2.01083 6.94898 1.74965C7.23616 1.48848 7.6104 1.34375 7.99858 1.34375C8.38677 1.34375 8.761 1.48848 9.04818 1.74965C9.33536 2.01083 9.51485 2.36969 9.55158 2.75613C9.57366 3.00577 9.65556 3.24641 9.79034 3.45769C9.92512 3.66897 10.1088 3.84467 10.3259 3.96992C10.543 4.09516 10.787 4.16627 11.0374 4.17721C11.2878 4.18816 11.5371 4.13862 11.7643 4.0328C12.117 3.87265 12.5167 3.84948 12.8856 3.96779C13.2545 4.0861 13.5661 4.33743 13.7599 4.67287C13.9537 5.0083 14.0158 5.40385 13.934 5.78251C13.8522 6.16118 13.6325 6.49588 13.3176 6.72147C13.1125 6.86536 12.9451 7.05654 12.8295 7.27882C12.714 7.50109 12.6536 7.74794 12.6536 7.99847C12.6536 8.24899 12.714 8.49584 12.8295 8.71812C12.9451 8.94039 13.1125 9.13157 13.3176 9.27547C13.6325 9.50105 13.8522 9.83575 13.934 10.2144C14.0158 10.5931 13.9537 10.9886 13.7599 11.3241C13.5661 11.6595 13.2545 11.9108 12.8856 12.0291C12.5167 12.1475 12.117 12.1243 11.7643 11.9641C11.5371 11.8583 11.2878 11.8088 11.0374 11.8197C10.787 11.8307 10.543 11.9018 10.3259 12.027C10.1088 12.1523 9.92512 12.328 9.79034 12.5392C9.65556 12.7505 9.57366 12.9912 9.55158 13.2408C9.51485 13.6272 9.33536 13.9861 9.04818 14.2473C8.761 14.5085 8.38677 14.6532 7.99858 14.6532C7.6104 14.6532 7.23616 14.5085 6.94898 14.2473C6.66181 13.9861 6.48232 13.6272 6.44558 13.2408C6.42355 12.9911 6.34165 12.7503 6.20683 12.539C6.07201 12.3276 5.88823 12.1519 5.67107 12.0266C5.45391 11.9014 5.20976 11.8303 4.9593 11.8194C4.70884 11.8085 4.45945 11.8582 4.23225 11.9641C3.87951 12.1243 3.4798 12.1475 3.11092 12.0291C2.74203 11.9108 2.43036 11.6595 2.23657 11.3241C2.04278 10.9886 1.98073 10.5931 2.06249 10.2144C2.14425 9.83575 2.36398 9.50105 2.67892 9.27547C2.884 9.13157 3.0514 8.94039 3.16698 8.71812C3.28255 8.49584 3.34289 8.24899 3.34289 7.99847C3.34289 7.74794 3.28255 7.50109 3.16698 7.27882C3.0514 7.05654 2.884 6.86536 2.67892 6.72147C2.36443 6.49576 2.14508 6.1612 2.06352 5.78279C1.98195 5.40438 2.04399 5.00916 2.23757 4.67394C2.43116 4.33872 2.74246 4.08745 3.11098 3.96896C3.4795 3.85047 3.87891 3.87322 4.23158 4.0328C4.45876 4.13862 4.70808 4.18816 4.95845 4.17721C5.20882 4.16627 5.45287 4.09516 5.66994 3.96992C5.88701 3.84467 6.07071 3.66897 6.20549 3.45769C6.34028 3.24641 6.42217 3.00577 6.44425 2.75613"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10298_390720">
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
              Slide Show Settings
            </span>
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
});
