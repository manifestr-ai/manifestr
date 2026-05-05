import React, { useCallback, useMemo, useState } from "react";
import { useToast } from "../../../ui/Toast";

interface PageLayoutPanelProps {
  store: any;
}

export default function PageLayoutPanel({ store }: PageLayoutPanelProps) {
  const { success, error: showError, info } = useToast();
  const [gridlinesOn, setGridlinesOn] = useState(true);
  const [headingsOn, setHeadingsOn] = useState(true);
  const [savedHeaderSizes, setSavedHeaderSizes] = useState<{
    colHeaderHeight: number;
    rowHeaderWidth: number;
  } | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [marginPreset, setMarginPreset] = useState<
    "normal" | "narrow" | "wide"
  >("normal");

  if (!store) return null;

  const getActiveSheet = useCallback(() => {
    try {
      const wb = store.getActiveWorkbook?.();
      const sheet = wb?.getActiveSheet?.();
      return sheet ?? null;
    } catch {
      return null;
    }
  }, [store]);

  const tryMany = useCallback((calls: Array<() => any>) => {
    for (const fn of calls) {
      try {
        const res = fn();
        if (res !== false) return true;
      } catch {
        // continue
      }
    }
    return false;
  }, []);

  const handleToggleGridlines = useCallback(() => {
    const sheet = getActiveSheet();
    if (!sheet) {
      showError("Spreadsheet not ready.");
      return;
    }

    // Univer Facade API (documented)
    // https://docs.univer.ai/guides/sheets/features/core/gridlines
    try {
      const currentlyHidden =
        typeof sheet.hasHiddenGridLines === "function"
          ? sheet.hasHiddenGridLines()
          : false;
      const nextHidden = !currentlyHidden;
      if (typeof sheet.setHiddenGridlines === "function") {
        sheet.setHiddenGridlines(nextHidden);
        setGridlinesOn(!nextHidden);
        success(`Gridlines ${nextHidden ? "hidden" : "shown"}.`);
        return;
      }
    } catch {
      // fall through to older guesses
    }

    const next = !gridlinesOn;
    setGridlinesOn(next);
    const ok = tryMany([
      () => sheet.setShowGridlines?.(next),
      () => sheet.setGridlinesVisible?.(next),
      () => sheet.setGridlineVisible?.(next),
    ]);

    if (ok) success(`Gridlines ${next ? "shown" : "hidden"}.`);
    else info("Gridlines toggle isn't supported in this Univer build.");
  }, [getActiveSheet, gridlinesOn, info, showError, success, tryMany]);

  const handleToggleHeadings = useCallback(() => {
    const sheet = getActiveSheet();
    if (!sheet) {
      showError("Spreadsheet not ready.");
      return;
    }

    // Facade API doesn't expose a direct "hide headings" toggle, but it does allow
    // controlling header sizes. Setting them to 0 effectively hides headings.
    // See: setColumnHeaderHeight / setRowHeaderWidth on FWorksheet.
    try {
      const next = !headingsOn;
      if (next) {
        // turning ON headings: restore previous sizes (or defaults)
        const restore = savedHeaderSizes ?? { colHeaderHeight: 24, rowHeaderWidth: 40 };
        if (typeof sheet.setColumnHeaderHeight === "function") {
          sheet.setColumnHeaderHeight(restore.colHeaderHeight);
        }
        if (typeof sheet.setRowHeaderWidth === "function") {
          sheet.setRowHeaderWidth(restore.rowHeaderWidth);
        }
        setHeadingsOn(true);
        success("Headings shown.");
        return;
      }

      // turning OFF headings: remember current (best-effort) then set to 0
      // If getters aren't available, we just remember defaults so we can restore later.
      if (!savedHeaderSizes) {
        setSavedHeaderSizes({ colHeaderHeight: 24, rowHeaderWidth: 40 });
      }
      if (typeof sheet.setColumnHeaderHeight === "function") {
        sheet.setColumnHeaderHeight(0);
      }
      if (typeof sheet.setRowHeaderWidth === "function") {
        sheet.setRowHeaderWidth(0);
      }
      setHeadingsOn(false);
      success("Headings hidden.");
      return;
    } catch {
      // fall through
    }

    const next = !headingsOn;
    setHeadingsOn(next);
    const ok = tryMany([
      () => sheet.setShowHeadings?.(next),
      () => sheet.setHeadingsVisible?.(next),
      () => sheet.setRowColHeaderVisible?.(next),
    ]);

    if (ok) success(`Headings ${next ? "shown" : "hidden"}.`);
    else info("Headings toggle isn't supported in this Univer build.");
  }, [
    getActiveSheet,
    headingsOn,
    info,
    savedHeaderSizes,
    showError,
    success,
    tryMany,
  ]);

  const handleOrientation = useCallback(() => {
    const next = orientation === "portrait" ? "landscape" : "portrait";
    setOrientation(next);
    // Univer core preset doesn't reliably expose print/page orientation APIs.
    info(`Orientation set to ${next.toUpperCase()} (print setup not available in this build).`);
  }, [info, orientation]);

  const marginPresets = useMemo(
    () => ({
      normal: { top: 1, right: 1, bottom: 1, left: 1 },
      narrow: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 },
      wide: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
    }),
    [],
  );

  const handleMargins = useCallback(() => {
    const next =
      marginPreset === "normal"
        ? "narrow"
        : marginPreset === "narrow"
          ? "wide"
          : "normal";
    setMarginPreset(next);

    // Univer core preset doesn't reliably expose print/page margin APIs.
    // We still track the selected preset in UI.
    success(`Margins preset: ${next.toUpperCase()}`);
  }, [
    getActiveSheet,
    info,
    marginPreset,
    marginPresets,
    showError,
    success,
    tryMany,
  ]);

  const handlePageSetup = useCallback(() => {
    if (typeof window === "undefined") return;
    const scaleStr =
      window.prompt("Scale percent (for export/print):", "100") ?? "100";
    const scale = Number(scaleStr);
    if (!Number.isFinite(scale) || scale <= 0) {
      showError("Invalid scale value.");
      return;
    }
    info(`Scale set to ${scale}% (print setup not available in this build).`);
  }, [info, showError]);

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Sheet Options */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Sheet Options
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Gridlines */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleToggleGridlines}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 2.5V17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 10H17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
                stroke="#364153"
                stroke-width="1.66667"
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
              Gridlines
            </span>
          </button>

          {/* Headings */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleToggleHeadings}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M1.72006 10.2869C1.65061 10.0998 1.65061 9.89398 1.72006 9.70688C2.39647 8.06676 3.54465 6.66442 5.01903 5.67763C6.49341 4.69085 8.22759 4.16406 10.0017 4.16406C11.7759 4.16406 13.51 4.69085 14.9844 5.67763C16.4588 6.66442 17.607 8.06676 18.2834 9.70688C18.3528 9.89398 18.3528 10.0998 18.2834 10.2869C17.607 11.927 16.4588 13.3293 14.9844 14.3161C13.51 15.3029 11.7759 15.8297 10.0017 15.8297C8.22759 15.8297 6.49341 15.3029 5.01903 14.3161C3.54465 13.3293 2.39647 11.927 1.72006 10.2869Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                stroke="#364153"
                stroke-width="1.66667"
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
              Headings
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Page Setup */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Page Setup
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Page Setup */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handlePageSetup}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.0013 15H3.33464C2.89261 15 2.46868 14.8244 2.15612 14.5118C1.84356 14.1993 1.66797 13.7754 1.66797 13.3333V9.16667C1.66797 8.72464 1.84356 8.30072 2.15612 7.98816C2.46868 7.6756 2.89261 7.5 3.33464 7.5H16.668C17.11 7.5 17.5339 7.6756 17.8465 7.98816C18.159 8.30072 18.3346 8.72464 18.3346 9.16667V13.3333C18.3346 13.7754 18.159 14.1993 17.8465 14.5118C17.5339 14.8244 17.11 15 16.668 15H15.0013"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 7.4974V2.4974C5 2.27638 5.0878 2.06442 5.24408 1.90814C5.40036 1.75186 5.61232 1.66406 5.83333 1.66406H14.1667C14.3877 1.66406 14.5996 1.75186 14.7559 1.90814C14.9122 2.06442 15 2.27638 15 2.4974V7.4974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1667 11.6641H5.83333C5.3731 11.6641 5 12.0372 5 12.4974V17.4974C5 17.9576 5.3731 18.3307 5.83333 18.3307H14.1667C14.6269 18.3307 15 17.9576 15 17.4974V12.4974C15 12.0372 14.6269 11.6641 14.1667 11.6641Z"
                stroke="#364153"
                stroke-width="1.66667"
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
              Page Setup
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Margins */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Margins
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Margins */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleMargins}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.5 2.5H17.5V7.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5013 2.5L11.668 8.33333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 17.4974L8.33333 11.6641"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 17.5H2.5V12.5"
                stroke="#364153"
                stroke-width="1.66667"
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
              Margins
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Orientation */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Orientation
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Orientation */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleOrientation}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.4987 1.66406H4.9987C4.55667 1.66406 4.13275 1.83966 3.82019 2.15222C3.50763 2.46478 3.33203 2.8887 3.33203 3.33073V16.6641C3.33203 17.1061 3.50763 17.53 3.82019 17.8426C4.13275 18.1551 4.55667 18.3307 4.9987 18.3307H14.9987C15.4407 18.3307 15.8646 18.1551 16.1772 17.8426C16.4898 17.53 16.6654 17.1061 16.6654 16.6641V5.83073L12.4987 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.668 1.66406V4.9974C11.668 5.43942 11.8436 5.86335 12.1561 6.17591C12.4687 6.48847 12.8926 6.66406 13.3346 6.66406H16.668"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.33464 7.5H6.66797"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3346 10.8359H6.66797"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3346 14.1641H6.66797"
                stroke="#364153"
                stroke-width="1.66667"
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
              Orientation
            </span>
          </button>
        </div>
      </div>

 
    </div>
  );
}
