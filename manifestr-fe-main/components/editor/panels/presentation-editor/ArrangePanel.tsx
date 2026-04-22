import { useMemo } from "react";
import { Popover, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

interface ArrangePanelProps {
  store: any;
}

export default observer(function ArrangePanel({ store }: ArrangePanelProps) {
  const selected = store.selectedElements || [];
  const page = store.activePage;
  const hasSelection = Array.isArray(selected) && selected.length > 0;

  const selectionBounds = useMemo(() => {
    if (!hasSelection) return null;
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    selected.forEach((el: any) => {
      const x = typeof el?.x === "number" ? el.x : 0;
      const y = typeof el?.y === "number" ? el.y : 0;
      const w = typeof el?.width === "number" ? el.width : 0;
      const h = typeof el?.height === "number" ? el.height : 0;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    });

    if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }, [hasSelection, selected]);

  const safeSet = (el: any, patch: Record<string, any>) => {
    if (!el?.set) return;
    el.set(patch);
  };

  const align = (kind: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!selectionBounds) return;
    const { minX, minY, maxX, maxY, width, height } = selectionBounds;
    selected.forEach((el: any) => {
      const w = typeof el?.width === "number" ? el.width : 0;
      const h = typeof el?.height === "number" ? el.height : 0;
      if (kind === "left") safeSet(el, { x: minX });
      if (kind === "center") safeSet(el, { x: Math.round(minX + (width - w) / 2) });
      if (kind === "right") safeSet(el, { x: Math.round(maxX - w) });
      if (kind === "top") safeSet(el, { y: minY });
      if (kind === "middle") safeSet(el, { y: Math.round(minY + (height - h) / 2) });
      if (kind === "bottom") safeSet(el, { y: Math.round(maxY - h) });
    });
  };

  const distribute = (axis: "horizontal" | "vertical") => {
    if (!selectionBounds) return;
    if (selected.length < 3) return;

    const items = selected
      .map((el: any) => ({
        el,
        x: typeof el?.x === "number" ? el.x : 0,
        y: typeof el?.y === "number" ? el.y : 0,
        width: typeof el?.width === "number" ? el.width : 0,
        height: typeof el?.height === "number" ? el.height : 0,
      }))
      .sort((a: any, b: any) => (axis === "horizontal" ? a.x - b.x : a.y - b.y));

    if (axis === "horizontal") {
      const min = selectionBounds.minX;
      const max = selectionBounds.maxX;
      const total = items.reduce((sum: number, it: any) => sum + it.width, 0);
      const available = max - min - total;
      const gap = available / (items.length - 1);
      let cursor = min;
      items.forEach((it: any) => {
        safeSet(it.el, { x: Math.round(cursor) });
        cursor += it.width + gap;
      });
      return;
    }

    const min = selectionBounds.minY;
    const max = selectionBounds.maxY;
    const total = items.reduce((sum: number, it: any) => sum + it.height, 0);
    const available = max - min - total;
    const gap = available / (items.length - 1);
    let cursor = min;
    items.forEach((it: any) => {
      safeSet(it.el, { y: Math.round(cursor) });
      cursor += it.height + gap;
    });
  };

  const group = () => {
    if (!hasSelection) return;
    if (typeof store.groupElements !== "function") return;
    try {
      if (typeof store.selectElements === "function") store.selectElements(selected);
      store.groupElements.length > 0 ? store.groupElements(selected) : store.groupElements();
    } catch {}
  };

  const ungroup = () => {
    if (!hasSelection) return;
    if (typeof store.ungroupElements !== "function") return;
    try {
      store.ungroupElements.length > 0 ? store.ungroupElements(selected) : store.ungroupElements();
    } catch {}
  };

  const reorder = (kind: "front" | "forward" | "backward" | "back") => {
    if (!page || selected.length === 0) return;
    const ids = selected.map((e: any) => e?.id).filter(Boolean);
    if (ids.length === 0) return;

    try {
      if (kind === "front" && typeof page.moveElementsTop === "function") {
        page.moveElementsTop(ids);
      } else if (kind === "back" && typeof page.moveElementsBottom === "function") {
        page.moveElementsBottom(ids);
      } else if (kind === "forward" && typeof page.moveElementsUp === "function") {
        page.moveElementsUp(ids);
      } else if (kind === "backward" && typeof page.moveElementsDown === "function") {
        page.moveElementsDown(ids);
      }
      store.selectElements?.(ids);
    } catch {}
  };

  const rotate = (kind: "cw" | "ccw" | "180" | "flipH" | "flipV" | "reset") => {
    if (!hasSelection) return;
    selected.forEach((el: any) => {
      const currentRotation = typeof el?.rotation === "number" ? el.rotation : 0;
      if (kind === "cw") safeSet(el, { rotation: currentRotation + 90 });
      if (kind === "ccw") safeSet(el, { rotation: currentRotation - 90 });
      if (kind === "180") safeSet(el, { rotation: currentRotation + 180 });
      if (kind === "flipH") safeSet(el, { scaleX: (el.scaleX || 1) * -1 });
      if (kind === "flipV") safeSet(el, { scaleY: (el.scaleY || 1) * -1 });
      if (kind === "reset")
        safeSet(el, { rotation: 0, scaleX: 1, scaleY: 1 });
    });
  };

  // if (!selected || selected.length === 0) {
  //   return (
  //     <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
  //       Select an element to arrange
  //     </div>
  //   );
  // }

  const labelClass = hasSelection ? "text-[#4A5565]" : "text-[#9CA3AF]";
  const buttonClass = `flex flex-col items-center justify-center w-[44px] rounded-md transition ${
    hasSelection ? "bg-transparent hover:bg-[#E9EBF0]" : "bg-transparent opacity-60"
  } py-2`;

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      <div className="flex flex-col items-center min-w-[210px]">
        <div className="h-[102px] bg-white border-b flex items-center px-6 gap-10">
          {/* Align */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-500 mb-2">Align</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "left", label: "Left" },
                    { key: "center", label: "Center" },
                    { key: "right", label: "Right" },
                    { key: "top", label: "Top" },
                    { key: "middle", label: "Middle" },
                    { key: "bottom", label: "Bottom" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={!hasSelection}
                      onClick={() => align(opt.key as any)}
                      className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <button className={buttonClass} type="button" tabIndex={0} aria-label="Align">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M15.75 3.75H2.25"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.25 9H2.25"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.75 14.25H2.25"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span
                className={`text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] mt-2 ${labelClass}`}
                style={{ fontFamily: "Inter" }}
              >
                Align
              </span>
            </button>
          </Popover>

          {/* Distribute */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-500 mb-2">Distribute</div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    disabled={!hasSelection || selected.length < 3}
                    onClick={() => distribute("horizontal")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Horizontal
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection || selected.length < 3}
                    onClick={() => distribute("vertical")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Vertical
                  </button>
                </div>
                <div className="text-[11px] text-gray-400 mt-2">
                  Select 3+ elements
                </div>
              </div>
            }
          >
            <button className={buttonClass} type="button" tabIndex={0} aria-label="Distribute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M14.25 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V3.75C15.75 2.92157 15.0784 2.25 14.25 2.25Z"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.25 6.75H15.75"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.25 11.25H15.75"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.75 2.25V15.75"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.25 2.25V15.75"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span
                className={`text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] mt-2 ${labelClass}`}
                style={{ fontFamily: "Inter" }}
              >
                Distribute
              </span>
            </button>
          </Popover>

          {/* Group */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-500 mb-2">Group</div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    disabled={!hasSelection || selected.length < 2}
                    onClick={group}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Group
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={ungroup}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Ungroup
                  </button>
                </div>
              </div>
            }
          >
            <button className={buttonClass} type="button" tabIndex={0} aria-label="Group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M2.25 5.25V3.75C2.25 2.925 2.925 2.25 3.75 2.25H5.25"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.75 2.25H14.25C15.075 2.25 15.75 2.925 15.75 3.75V5.25"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.75 12.75V14.25C15.75 15.075 15.075 15.75 14.25 15.75H12.75"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.25 15.75H3.75C2.925 15.75 2.25 15.075 2.25 14.25V12.75"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.75 5.25H6C5.58579 5.25 5.25 5.58579 5.25 6V8.25C5.25 8.66421 5.58579 9 6 9H9.75C10.1642 9 10.5 8.66421 10.5 8.25V6C10.5 5.58579 10.1642 5.25 9.75 5.25Z"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 9H8.25C7.83579 9 7.5 9.33579 7.5 9.75V12C7.5 12.4142 7.83579 12.75 8.25 12.75H12C12.4142 12.75 12.75 12.4142 12.75 12V9.75C12.75 9.33579 12.4142 9 12 9Z"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span
                className={`text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] mt-2 ${labelClass}`}
                style={{ fontFamily: "Inter" }}
              >
                Group
              </span>
            </button>
          </Popover>

          {/* Arrange */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-500 mb-2">Arrange</div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => reorder("front")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Bring to Front
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => reorder("forward")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Bring Forward
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => reorder("backward")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Send Backward
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => reorder("back")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Send to Back
                  </button>
                </div>
              </div>
            }
          >
            <button className={buttonClass} type="button" tabIndex={0} aria-label="Arrange">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M10.5 6H7.5C6.67157 6 6 6.67157 6 7.5V10.5C6 11.3284 6.67157 12 7.5 12H10.5C11.3284 12 12 11.3284 12 10.5V7.5C12 6.67157 11.3284 6 10.5 6Z"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 7.5C2.60218 7.5 2.22064 7.34196 1.93934 7.06066C1.65804 6.77936 1.5 6.39782 1.5 6V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H6C6.39782 1.5 6.77936 1.65804 7.06066 1.93934C7.34196 2.22064 7.5 2.60218 7.5 3"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.5 15C10.5 15.3978 10.658 15.7794 10.9393 16.0607C11.2206 16.342 11.6022 16.5 12 16.5H15C15.3978 16.5 15.7794 16.342 16.0607 16.0607C16.342 15.7794 16.5 15.3978 16.5 15V12C16.5 11.6022 16.342 11.2206 16.0607 10.9393C15.7794 10.658 15.3978 10.5 15 10.5"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span
                className={`text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] mt-2 ${labelClass}`}
                style={{ fontFamily: "Inter" }}
              >
                Arrange
              </span>
            </button>
          </Popover>

          {/* Rotate */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-500 mb-2">Rotate</div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => rotate("cw")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Rotate 90°
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => rotate("ccw")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Rotate -90°
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => rotate("180")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Rotate 180°
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => rotate("flipH")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Flip Horizontal
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => rotate("flipV")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Flip Vertical
                  </button>
                  <button
                    type="button"
                    disabled={!hasSelection}
                    onClick={() => rotate("reset")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left disabled:opacity-60"
                  >
                    Reset
                  </button>
                </div>
              </div>
            }
          >
            <button className={buttonClass} type="button" tabIndex={0} aria-label="Rotate">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M15.75 9C15.75 10.335 15.3541 11.6401 14.6124 12.7501C13.8707 13.8601 12.8165 14.7253 11.5831 15.2362C10.3497 15.7471 8.99252 15.8808 7.68314 15.6203C6.37377 15.3599 5.17104 14.717 4.22703 13.773C3.28303 12.829 2.64015 11.6262 2.3797 10.3169C2.11925 9.00749 2.25292 7.65029 2.76382 6.41689C3.27471 5.18349 4.13987 4.12928 5.2499 3.38758C6.35994 2.64588 7.66498 2.25 9 2.25C10.89 2.25 12.6975 3 14.055 4.305L15.75 6"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.75 2.25V6H12"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span
                className={`text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] mt-2 ${labelClass}`}
                style={{ fontFamily: "Inter" }}
              >
                Rotate
              </span>
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
});
