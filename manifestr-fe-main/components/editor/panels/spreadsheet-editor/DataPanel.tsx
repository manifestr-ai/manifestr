import React, { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "../../../ui/Toast";

interface DataPanelProps {
  store: any;
}

export default function DataPanel({ store }: DataPanelProps) {
  const { success, error: showError, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  if (!store) return null;

  const getActiveInfo = useCallback(() => {
    try {
      const workbook = store.getActiveWorkbook?.();
      const sheet = workbook?.getActiveSheet?.();
      const selection = sheet?.getSelection?.();
      if (!workbook || !sheet) return null;
      return { workbook, sheet, selection };
    } catch {
      return null;
    }
  }, [store]);

  const getPosition = useCallback((sheet: any, selection: any) => {
    let row = 0,
      col = 0,
      numRows = 1,
      numCols = 1;
    try {
      const activeRange =
        selection && typeof selection.getActiveRange === "function"
          ? selection.getActiveRange()
          : typeof sheet.getActiveRange === "function"
            ? sheet.getActiveRange()
            : null;
      if (activeRange) {
        if (typeof activeRange.getRange === "function") {
          const r = activeRange.getRange();
          row = r?.startRow ?? 0;
          col = r?.startColumn ?? 0;
          const endRow = r?.endRow ?? row;
          const endCol = r?.endColumn ?? col;
          numRows = endRow - row + 1;
          numCols = endCol - col + 1;
        } else if (
          typeof activeRange.getRow === "function" &&
          typeof activeRange.getColumn === "function"
        ) {
          row = activeRange.getRow();
          col = activeRange.getColumn();
          if (typeof activeRange.getHeight === "function") {
            numRows = activeRange.getHeight();
          }
          if (typeof activeRange.getWidth === "function") {
            numCols = activeRange.getWidth();
          }
          if (typeof activeRange.getLastRow === "function") {
            numRows = activeRange.getLastRow() - row + 1;
          }
          if (typeof activeRange.getLastColumn === "function") {
            numCols = activeRange.getLastColumn() - col + 1;
          }
        }
      }
    } catch {
      // defaults
    }
    return { row, col, numRows, numCols };
  }, []);

  const safeToComparable = useCallback((v: any) => {
    if (v === null || v === undefined) return { type: "empty", value: "" };
    if (typeof v === "number" && Number.isFinite(v))
      return { type: "number", value: v };
    const s = String(v);
    const asNum = Number(s);
    if (s.trim() !== "" && Number.isFinite(asNum))
      return { type: "number", value: asNum };
    return { type: "string", value: s.toLowerCase() };
  }, []);

  const sortOptions = useMemo(
    () => [
      { id: "asc", label: "A → Z / Small → Large" },
      { id: "desc", label: "Z → A / Large → Small" },
    ],
    [],
  );

  const handleSort = useCallback(
    async (direction: "asc" | "desc") => {
      const info0 = getActiveInfo();
      if (!info0) {
        showError("Select a range to sort first.");
        return;
      }
      const { sheet, selection } = info0;
      const { row, col, numRows, numCols } = getPosition(sheet, selection);
      if (numRows < 2) {
        showError("Select at least 2 rows to sort.");
        return;
      }

      try {
        // Read values into a 2D array.
        const rows: any[][] = [];
        for (let r = 0; r < numRows; r++) {
          const currentRow: any[] = [];
          for (let c = 0; c < numCols; c++) {
            const cell = sheet.getRange(row + r, col + c, 1, 1);
            const v = typeof cell.getValue === "function" ? cell.getValue() : "";
            currentRow.push(v);
          }
          rows.push(currentRow);
        }

        // Stable sort by the first column in the selection.
        const decorated = rows.map((r, idx) => ({
          idx,
          key: safeToComparable(r[0]),
          row: r,
        }));
        decorated.sort((a, b) => {
          const ak = a.key;
          const bk = b.key;
          if (ak.type !== bk.type) {
            // numbers first, then strings, then empty
            const order = { number: 0, string: 1, empty: 2 } as any;
            return order[ak.type] - order[bk.type];
          }
          if (ak.value < bk.value) return direction === "asc" ? -1 : 1;
          if (ak.value > bk.value) return direction === "asc" ? 1 : -1;
          return a.idx - b.idx;
        });

        // Write values back.
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            const cell = sheet.getRange(row + r, col + c, 1, 1);
            if (typeof cell.setValue === "function") {
              cell.setValue(decorated[r].row[c]);
            }
          }
        }

        success("Sorted selection.");
      } catch (e) {
        console.error(e);
        showError("Sort failed for this selection.");
      } finally {
        setShowSortOptions(false);
      }
    },
    [getActiveInfo, getPosition, safeToComparable, showError, success],
  );

  const handleFilter = useCallback(
    (mode: "equals" | "contains") => {
      const info0 = getActiveInfo();
      if (!info0) {
        showError("Select a range to filter first.");
        return;
      }
      const { sheet, selection } = info0;
      const { row, col, numRows, numCols } = getPosition(sheet, selection);
      if (numRows < 2) {
        showError("Select at least 2 rows to filter.");
        return;
      }
      if (typeof window === "undefined") return;
      const needle = window.prompt(
        `Filter ${mode === "equals" ? "equals" : "contains"} (matches first column of selection):`,
      );
      if (needle === null) return;
      const q = needle.trim().toLowerCase();
      setShowFilterOptions(false);

      try {
        for (let r = 0; r < numRows; r++) {
          const cell = sheet.getRange(row + r, col, 1, 1);
          const v = typeof cell.getValue === "function" ? cell.getValue() : "";
          const s = String(v ?? "").toLowerCase();
          const match = mode === "equals" ? s === q : s.includes(q);

          const targetRow = row + r;
          // Prefer a visibility API if available, otherwise collapse by row height.
          if (typeof sheet.setRowVisible === "function") {
            sheet.setRowVisible(targetRow, match);
          } else if (typeof sheet.setRowHeight === "function") {
            sheet.setRowHeight(targetRow, match ? undefined : 0);
          }
        }
        success("Filter applied (use Ungroup to show all if needed).");
      } catch (e) {
        console.error(e);
        showError("Filter failed in this Univer build.");
      }
    },
    [getActiveInfo, getPosition, showError, success],
  );

  const handleClearFilter = useCallback(() => {
    const info0 = getActiveInfo();
    if (!info0) return;
    const { sheet, selection } = info0;
    const { row, numRows } = getPosition(sheet, selection);
    try {
      for (let r = 0; r < numRows; r++) {
        const targetRow = row + r;
        if (typeof sheet.setRowVisible === "function") {
          sheet.setRowVisible(targetRow, true);
        } else if (typeof sheet.setRowHeight === "function") {
          // "undefined" usually resets to default in many APIs; otherwise no-op.
          sheet.setRowHeight(targetRow, undefined);
        }
      }
      success("Filter cleared.");
    } catch {
      showError("Could not clear filter.");
    } finally {
      setShowFilterOptions(false);
    }
  }, [getActiveInfo, getPosition, showError, success]);

  const handleTextToColumns = useCallback(() => {
    const info0 = getActiveInfo();
    if (!info0) {
      showError("Select cells first.");
      return;
    }
    const { sheet, selection } = info0;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    if (typeof window === "undefined") return;
    const delim =
      window.prompt("Delimiter for splitting (e.g. , | ; | space):", ",") ??
      ",";
    const delimiter = delim === "space" ? " " : delim;
    if (delimiter.trim() === "") return;

    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          const v = typeof cell.getValue === "function" ? cell.getValue() : "";
          const parts = String(v ?? "").split(delimiter);
          for (let i = 0; i < parts.length; i++) {
            const out = sheet.getRange(row + r, col + c + i, 1, 1);
            if (typeof out.setValue === "function") out.setValue(parts[i]);
          }
        }
      }
      success("Split into columns.");
    } catch (e) {
      console.error(e);
      showError("Text to Columns failed.");
    }
  }, [getActiveInfo, getPosition, showError, success]);

  const handleGroup = useCallback(() => {
    const info0 = getActiveInfo();
    if (!info0) return;
    const { sheet, selection } = info0;
    const { row, numRows } = getPosition(sheet, selection);
    if (numRows < 2) {
      showError("Select multiple rows to group (collapse).");
      return;
    }
    try {
      // Collapse all but first row in selection.
      for (let r = 1; r < numRows; r++) {
        const targetRow = row + r;
        if (typeof sheet.setRowVisible === "function") {
          sheet.setRowVisible(targetRow, false);
        } else if (typeof sheet.setRowHeight === "function") {
          sheet.setRowHeight(targetRow, 0);
        }
      }
      success("Grouped (collapsed) rows.");
    } catch {
      showError("Group failed.");
    }
  }, [getActiveInfo, getPosition, showError, success]);

  const handleUngroup = useCallback(() => {
    const info0 = getActiveInfo();
    if (!info0) return;
    const { sheet, selection } = info0;
    const { row, numRows } = getPosition(sheet, selection);
    try {
      for (let r = 0; r < numRows; r++) {
        const targetRow = row + r;
        if (typeof sheet.setRowVisible === "function") {
          sheet.setRowVisible(targetRow, true);
        } else if (typeof sheet.setRowHeight === "function") {
          sheet.setRowHeight(targetRow, undefined);
        }
      }
      success("Ungrouped (expanded) rows.");
    } catch {
      showError("Ungroup failed.");
    }
  }, [getActiveInfo, getPosition, showError, success]);

  const parseCsv = useCallback((text: string) => {
    // Simple CSV parser with quoted fields support.
    const rows: string[][] = [];
    let row: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (ch === '"' && inQuotes && next === '"') {
        cur += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (!inQuotes && (ch === "," || ch === "\t")) {
        row.push(cur);
        cur = "";
        continue;
      }
      if (!inQuotes && (ch === "\n" || ch === "\r")) {
        if (ch === "\r" && next === "\n") i++;
        row.push(cur);
        cur = "";
        rows.push(row);
        row = [];
        continue;
      }
      cur += ch;
    }
    row.push(cur);
    rows.push(row);
    return rows.filter((r) => r.length > 1 || (r[0] ?? "").trim() !== "");
  }, []);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (file: File) => {
      const info0 = getActiveInfo();
      if (!info0) {
        showError("Spreadsheet not ready.");
        return;
      }
      const { sheet, selection } = info0;
      const { row, col } = getPosition(sheet, selection);

      const text = await file.text();
      const data = parseCsv(text);
      if (data.length === 0) {
        showError("No data found in file.");
        return;
      }

      try {
        for (let r = 0; r < data.length; r++) {
          for (let c = 0; c < data[r].length; c++) {
            const cell = sheet.getRange(row + r, col + c, 1, 1);
            const raw = data[r][c];
            const n = Number(raw);
            const value =
              raw.trim() !== "" && Number.isFinite(n) && !/^0\d+/.test(raw)
                ? n
                : raw;
            if (typeof cell.setValue === "function") cell.setValue(value);
          }
        }
        success(`Imported ${data.length} rows.`);
      } catch (e) {
        console.error(e);
        showError("Import failed.");
      }
    },
    [getActiveInfo, getPosition, parseCsv, showError, success],
  );

  const handleExport = useCallback(() => {
    const info0 = getActiveInfo();
    if (!info0) {
      showError("Select a range to export.");
      return;
    }
    const { sheet, selection } = info0;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    if (typeof window === "undefined") return;

    try {
      const lines: string[] = [];
      for (let r = 0; r < numRows; r++) {
        const fields: string[] = [];
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          const v = typeof cell.getValue === "function" ? cell.getValue() : "";
          const s = String(v ?? "");
          const escaped =
            /[",\n\r\t]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          fields.push(escaped);
        }
        lines.push(fields.join(","));
      }
      const csv = lines.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      success("Exported selection to CSV.");
    } catch (e) {
      console.error(e);
      showError("Export failed.");
    }
  }, [getActiveInfo, getPosition, showError, success]);

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Sort & Filter */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Sort & Filter
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Sort */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={() => setShowSortOptions((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17.4987 13.3359L14.1654 16.6693L10.832 13.3359"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.168 16.6693V3.33594"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 6.66927L5.83333 3.33594L9.16667 6.66927"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83203 3.33594V16.6693"
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
              Sort
            </span>
          </button>
          {showSortOptions && (
            <div className="absolute mt-[86px] bg-white border border-[#E5E7EB] rounded-md shadow-sm p-1 z-50">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                  onClick={() => handleSort(opt.id as any)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Filter */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={() => setShowFilterOptions((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M8.33433 16.6667C8.33426 16.8215 8.37734 16.9733 8.45874 17.1051C8.54014 17.2368 8.65664 17.3433 8.79517 17.4125L10.4618 18.2458C10.5889 18.3093 10.7301 18.3393 10.872 18.3329C11.014 18.3264 11.1519 18.2838 11.2727 18.2091C11.3935 18.1344 11.4932 18.03 11.5624 17.9059C11.6315 17.7818 11.6677 17.6421 11.6677 17.5V11.6667C11.6679 11.2537 11.8214 10.8554 12.0985 10.5492L18.1177 3.89167C18.2256 3.77213 18.2965 3.6239 18.3219 3.4649C18.3473 3.3059 18.3262 3.14294 18.2609 2.99573C18.1957 2.84851 18.0892 2.72335 17.9543 2.63538C17.8195 2.5474 17.662 2.50038 17.501 2.5H2.501C2.33984 2.50006 2.18215 2.54685 2.04704 2.6347C1.91193 2.72255 1.80519 2.84769 1.73976 2.99497C1.67432 3.14225 1.65299 3.30534 1.67836 3.46449C1.70372 3.62364 1.77469 3.77203 1.88267 3.89167L7.9035 10.5492C8.18062 10.8554 8.33415 11.2537 8.33433 11.6667V16.6667Z"
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
              Filter
            </span>
          </button>
          {showFilterOptions && (
            <div className="absolute mt-[86px] bg-white border border-[#E5E7EB] rounded-md shadow-sm p-1 z-50">
              <button
                type="button"
                className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                onClick={() => handleFilter("equals")}
              >
                Equals…
              </button>
              <button
                type="button"
                className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                onClick={() => handleFilter("contains")}
              >
                Contains…
              </button>
              <button
                type="button"
                className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                onClick={handleClearFilter}
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Data Tools */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Data Tools
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Text to Columns */}
          <button
            className="flex flex-col items-center justify-center w-[80px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleTextToColumns}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 2.5V17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.5 2.5V17.5"
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
              Text to Columns
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Outline */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Outline
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Group */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleGroup}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M2.5 5.83333V4.16667C2.5 3.25 3.25 2.5 4.16667 2.5H5.83333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.168 2.5H15.8346C16.7513 2.5 17.5013 3.25 17.5013 4.16667V5.83333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5013 14.1641V15.8307C17.5013 16.7474 16.7513 17.4974 15.8346 17.4974H14.168"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83333 17.4974H4.16667C3.25 17.4974 2.5 16.7474 2.5 15.8307V14.1641"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.832 5.83594H6.66536C6.20513 5.83594 5.83203 6.20903 5.83203 6.66927V9.16927C5.83203 9.62951 6.20513 10.0026 6.66536 10.0026H10.832C11.2923 10.0026 11.6654 9.62951 11.6654 9.16927V6.66927C11.6654 6.20903 11.2923 5.83594 10.832 5.83594Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.332 10H9.16536C8.70513 10 8.33203 10.3731 8.33203 10.8333V13.3333C8.33203 13.7936 8.70513 14.1667 9.16536 14.1667H13.332C13.7923 14.1667 14.1654 13.7936 14.1654 13.3333V10.8333C14.1654 10.3731 13.7923 10 13.332 10Z"
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
              Group
            </span>
          </button>

          {/* Ungroup */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleUngroup}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.0013 3.33594H5.0013C4.54106 3.33594 4.16797 3.70903 4.16797 4.16927V7.5026C4.16797 7.96284 4.54106 8.33594 5.0013 8.33594H10.0013C10.4615 8.33594 10.8346 7.96284 10.8346 7.5026V4.16927C10.8346 3.70903 10.4615 3.33594 10.0013 3.33594Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.0013 11.6641H10.0013C9.54106 11.6641 9.16797 12.0372 9.16797 12.4974V15.8307C9.16797 16.291 9.54106 16.6641 10.0013 16.6641H15.0013C15.4615 16.6641 15.8346 16.291 15.8346 15.8307V12.4974C15.8346 12.0372 15.4615 11.6641 15.0013 11.6641Z"
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
              Ungroup
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Get External Data */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Get External Data
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Import */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleImportClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 12.5V2.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83203 8.33594L9.9987 12.5026L14.1654 8.33594"
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
              Import
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,text/csv,text/tab-separated-values"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              handleImportFile(file);
              // reset value so importing same file again triggers change
              e.currentTarget.value = "";
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Export */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Export
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Export */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleExport}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 2.5V12.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1654 6.66667L9.9987 2.5L5.83203 6.66667"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
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
              Export
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
