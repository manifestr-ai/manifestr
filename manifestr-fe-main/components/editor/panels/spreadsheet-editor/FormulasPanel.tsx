import React, { useCallback, useMemo, useState } from "react";
import { useToast } from "../../../ui/Toast";

interface FormulasPanelProps {
  store: any;
}

function colIndexToA1Letter(zeroBasedCol: number): string {
  let n = zeroBasedCol + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function cellToA1(row: number, col: number): string {
  return `${colIndexToA1Letter(col)}${row + 1}`;
}

function rangeToA1(sr: number, sc: number, er: number, ec: number): string {
  const a = cellToA1(sr, sc);
  const b = cellToA1(er, ec);
  return sr === er && sc === ec ? a : `${a}:${b}`;
}

export default function FormulasPanel({ store }: FormulasPanelProps) {
  const { success, error: showError } = useToast();
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [showRoundOptions, setShowRoundOptions] = useState(false);
  const [showDurationOptions, setShowDurationOptions] = useState(false);

  const getActiveInfo = useCallback(() => {
    if (!store) return null;
    try {
      const workbook = store.getActiveWorkbook();
      if (!workbook) return null;
      const sheet = workbook.getActiveSheet();
      if (!sheet) return null;
      const selection = sheet.getSelection();
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
      } else if (selection && typeof selection.getCurrentCell === "function") {
        const activeCell = selection.getCurrentCell();
        if (activeCell) {
          row = activeCell.actualRow ?? activeCell.row ?? 0;
          col = activeCell.actualColumn ?? activeCell.column ?? 0;
        }
      }
    } catch {
      /* keep defaults */
    }
    return { row, col, numRows, numCols };
  }, []);

  const setFormulaAt = useCallback(
    (sheet: any, row: number, col: number, formulaOrExpr: string) => {
      const cell = sheet.getRange(row, col, 1, 1);
      const withEq = formulaOrExpr.trim().startsWith("=")
        ? formulaOrExpr.trim()
        : `=${formulaOrExpr.trim()}`;
      const withoutEq = withEq.startsWith("=") ? withEq.slice(1) : withEq;

      // Different Univer builds vary: some expect "=SUM(A1:A2)", others "SUM(A1:A2)".
      if (typeof cell.setFormula === "function") {
        try {
          cell.setFormula(withEq);
          return true;
        } catch {
          try {
            cell.setFormula(withoutEq);
            return true;
          } catch {
            // fall through
          }
        }
      }
      if (typeof cell.setValue === "function") {
        try {
          cell.setValue(withEq);
          return true;
        } catch {
          try {
            cell.setValue(withoutEq);
            return true;
          } catch {
            // fall through
          }
        }
        return true;
      }
      return false;
    },
    [],
  );

  const applyNumberFormatToSelection = useCallback(
    (pattern: string) => {
      const info = getActiveInfo();
      if (!info) {
        showError("Select a cell or range first.");
        return;
      }
      const { sheet, selection } = info;
      const { row, col, numRows, numCols } = getPosition(sheet, selection);
      try {
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            const cell = sheet.getRange(row + r, col + c, 1, 1);
            if (typeof cell.setNumberFormat === "function") {
              cell.setNumberFormat(pattern);
            }
          }
        }
        success("Number format applied.");
      } catch {
        showError("Could not apply number format.");
      }
    },
    [getActiveInfo, getPosition, showError, success],
  );

  const currencyOptions = useMemo(
    () => [
      { label: "USD ($) 2 decimals", pattern: "$#,##0.00" },
      { label: "USD ($) no decimals", pattern: "$#,##0" },
      { label: "EUR (€) 2 decimals", pattern: "€#,##0.00" },
      { label: "GBP (£) 2 decimals", pattern: "£#,##0.00" },
      { label: "INR (₹) 2 decimals", pattern: "₹#,##0.00" },
    ],
    [],
  );

  const dateOptions = useMemo(
    () => [
      { label: "MM/DD/YYYY", pattern: "mm/dd/yyyy" },
      { label: "DD/MM/YYYY", pattern: "dd/mm/yyyy" },
      { label: "YYYY-MM-DD", pattern: "yyyy-mm-dd" },
      { label: "MMM D, YYYY", pattern: "mmm d, yyyy" },
      { label: "DD-MMM-YYYY", pattern: "dd-mmm-yyyy" },
      { label: "Time (HH:MM)", pattern: "hh:mm" },
      { label: "Time (HH:MM:SS)", pattern: "hh:mm:ss" },
    ],
    [],
  );

  const roundOptions = useMemo(
    () => [
      { label: "0 decimals", pattern: "0" },
      { label: "1 decimal", pattern: "0.0" },
      { label: "2 decimals", pattern: "0.00" },
      { label: "3 decimals", pattern: "0.000" },
    ],
    [],
  );

  const durationOptions = useMemo(
    () => [
      { label: "h:mm", pattern: "[h]:mm" },
      { label: "h:mm:ss", pattern: "[h]:mm:ss" },
      { label: "mm:ss", pattern: "mm:ss" },
    ],
    [],
  );

  const handleSum = useCallback(() => {
    const info = getActiveInfo();
    if (!info) {
      showError("Select a cell or range first.");
      return;
    }
    const { sheet, selection } = info;
    const { row: sr, col: sc, numRows, numCols } = getPosition(
      sheet,
      selection,
    );
    const er = sr + numRows - 1;
    const ec = sc + numCols - 1;
    const maxRows =
      typeof sheet.getMaxRows === "function" ? sheet.getMaxRows() : 1048576;
    const maxCols =
      typeof sheet.getMaxColumns === "function" ? sheet.getMaxColumns() : 16384;

    let outRow = sr;
    let outCol = sc;
    let expr: string;

    if (numRows === 1 && numCols === 1) {
      outRow = sr;
      outCol = sc;
      expr = sr > 0 ? `SUM(${rangeToA1(0, sc, sr - 1, sc)})` : "SUM()";
    } else {
      expr = `SUM(${rangeToA1(sr, sc, er, ec)})`;
      if (er + 1 < maxRows) {
        outRow = er + 1;
        outCol = sc;
      } else if (ec + 1 < maxCols) {
        outRow = sr;
        outCol = ec + 1;
      } else {
        outRow = sr;
        outCol = sc;
      }
    }

    if (setFormulaAt(sheet, outRow, outCol, expr)) {
      success("Inserted SUM formula.");
    } else {
      showError("Could not insert formula.");
    }
  }, [getActiveInfo, getPosition, setFormulaAt, showError, success]);

  const handleAverage = useCallback(() => {
    const info = getActiveInfo();
    if (!info) {
      showError("Select a cell or range first.");
      return;
    }
    const { sheet, selection } = info;
    const { row: sr, col: sc, numRows, numCols } = getPosition(
      sheet,
      selection,
    );
    const er = sr + numRows - 1;
    const ec = sc + numCols - 1;
    const maxRows =
      typeof sheet.getMaxRows === "function" ? sheet.getMaxRows() : 1048576;
    const maxCols =
      typeof sheet.getMaxColumns === "function" ? sheet.getMaxColumns() : 16384;

    let outRow = sr;
    let outCol = sc;
    let expr: string;

    if (numRows === 1 && numCols === 1) {
      outRow = sr;
      outCol = sc;
      expr =
        sr > 0 ? `AVERAGE(${rangeToA1(0, sc, sr - 1, sc)})` : "AVERAGE()";
    } else {
      expr = `AVERAGE(${rangeToA1(sr, sc, er, ec)})`;
      if (er + 1 < maxRows) {
        outRow = er + 1;
        outCol = sc;
      } else if (ec + 1 < maxCols) {
        outRow = sr;
        outCol = ec + 1;
      } else {
        outRow = sr;
        outCol = sc;
      }
    }

    if (setFormulaAt(sheet, outRow, outCol, expr)) {
      success("Inserted AVERAGE formula.");
    } else {
      showError("Could not insert formula.");
    }
  }, [getActiveInfo, getPosition, setFormulaAt, showError, success]);

  // ROUND in this UI behaves like "round formatting" (avoid circular/self-references).
  const handleRound = useCallback(() => {
    setShowRoundOptions((v) => !v);
  }, []);

  const handleIf = useCallback(() => {
    const info = getActiveInfo();
    if (!info) {
      showError("Select a cell or range first.");
      return;
    }
    const { sheet, selection } = info;
    const { row: sr, col: sc } = getPosition(sheet, selection);
    let expr: string;
    if (sc > 0) {
      const ref = cellToA1(sr, sc - 1);
      expr = `IF(${ref}>0,"Yes","No")`;
    } else if (sr > 0) {
      const ref = cellToA1(sr - 1, sc);
      expr = `IF(${ref}>0,"Yes","No")`;
    } else {
      expr = `IF(1=1,"Yes","No")`;
    }
    if (setFormulaAt(sheet, sr, sc, expr)) {
      success("Inserted IF formula.");
    } else {
      showError("Could not insert formula.");
    }
  }, [getActiveInfo, getPosition, setFormulaAt, showError, success]);

  const handleVlookup = useCallback(() => {
    const info = getActiveInfo();
    if (!info) {
      showError("Select a cell or range first.");
      return;
    }
    const { sheet, selection } = info;
    const { row: sr, col: sc } = getPosition(sheet, selection);
    if (sr === 0 && sc === 0) {
      showError(
        "For VLOOKUP, select a cell to the right of or below the lookup value.",
      );
      return;
    }
    let lookupR = sr;
    let lookupC = sc;
    if (sc > 0) {
      lookupC = sc - 1;
    } else {
      lookupR = sr - 1;
    }
    const lookup = cellToA1(lookupR, lookupC);
    if (typeof window === "undefined") return;
    const tableRange =
      window.prompt("Table range for VLOOKUP (A1 notation):", "$A$1:$D$20") ??
      "";
    if (tableRange.trim() === "") return;
    const colIndexStr =
      window.prompt("Return column index (1-based):", "2") ?? "";
    const colIndex = Number(colIndexStr);
    const exactStr =
      window.prompt("Exact match? (true/false)", "false") ?? "false";
    const exact = exactStr.trim().toLowerCase() === "true";
    const safeCol = Number.isFinite(colIndex) && colIndex > 0 ? colIndex : 2;
    const expr = `VLOOKUP(${lookup},${tableRange.trim()},${safeCol},${exact ? "TRUE" : "FALSE"})`;
    if (setFormulaAt(sheet, sr, sc, expr)) {
      success("Inserted VLOOKUP formula (adjust lookup value and table range as needed).");
    } else {
      showError("Could not insert formula.");
    }
  }, [getActiveInfo, getPosition, setFormulaAt, showError, success]);

  const handleIndex = useCallback(() => {
    const info = getActiveInfo();
    if (!info) {
      showError("Select a cell or range first.");
      return;
    }
    const { sheet, selection } = info;
    const { row: sr, col: sc } = getPosition(sheet, selection);
    if (typeof window === "undefined") return;
    const arrayRange =
      window.prompt("Array range for INDEX (A1 notation):", "$A$1:$D$20") ?? "";
    if (arrayRange.trim() === "") return;
    const rowNumStr = window.prompt("Row number within array:", "1") ?? "1";
    const colNumStr = window.prompt("Column number within array:", "1") ?? "1";
    const rowNum = Number(rowNumStr);
    const colNum = Number(colNumStr);
    const safeRow = Number.isFinite(rowNum) && rowNum > 0 ? rowNum : 1;
    const safeCol = Number.isFinite(colNum) && colNum > 0 ? colNum : 1;
    const expr = `INDEX(${arrayRange.trim()},${safeRow},${safeCol})`;
    if (setFormulaAt(sheet, sr, sc, expr)) {
      success("Inserted INDEX formula (adjust array and row/column numbers as needed).");
    } else {
      showError("Could not insert formula.");
    }
  }, [getActiveInfo, getPosition, setFormulaAt, showError, success]);

  const handleConcat = useCallback(() => {
    const info = getActiveInfo();
    if (!info) {
      showError("Select a cell or range first.");
      return;
    }
    const { sheet, selection } = info;
    const { row: sr, col: sc, numRows, numCols } = getPosition(
      sheet,
      selection,
    );
    let expr: string;
    if (numCols >= 2) {
      expr = `CONCAT(${cellToA1(sr, sc)},${cellToA1(sr, sc + 1)})`;
    } else if (sc > 0) {
      expr = `CONCAT(${cellToA1(sr, sc - 1)},${cellToA1(sr, sc)})`;
    } else {
      expr = `CONCAT(${cellToA1(sr, sc)},"")`;
    }
    if (setFormulaAt(sheet, sr, sc, expr)) {
      success("Inserted CONCAT formula.");
    } else {
      showError("Could not insert formula.");
    }
  }, [getActiveInfo, getPosition, setFormulaAt, showError, success]);

  const handleCurrency = useCallback(() => {
    setShowCurrencyOptions((v) => !v);
  }, []);

  const handlePercentage = useCallback(() => {
    const info = getActiveInfo();
    if (!info) {
      showError("Select a cell or range first.");
      return;
    }
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);

    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          try {
            const v = typeof cell.getValue === "function" ? cell.getValue() : undefined;
            // Users often type "3" expecting "3%". In spreadsheets, percent formatting
            // interprets 3 as 300%. Convert numbers >= 1 to their fractional form.
            if (typeof v === "number" && Number.isFinite(v)) {
              const abs = Math.abs(v);
              if (abs >= 1) {
                if (typeof cell.setValue === "function") {
                  cell.setValue(v / 100);
                }
              }
            }
            if (typeof cell.setNumberFormat === "function") {
              cell.setNumberFormat("0.00%");
            }
          } catch {
            // ignore per-cell failures
          }
        }
      }
      success("Percentage format applied.");
    } catch {
      showError("Could not apply percentage format.");
    }
  }, [getActiveInfo, getPosition, showError, success]);

  const handleDates = useCallback(() => {
    setShowDateOptions((v) => !v);
  }, []);

  const handleDurations = useCallback(() => {
    setShowDurationOptions((v) => !v);
  }, []);

  const handleCustom = useCallback(() => {
    if (typeof window === "undefined") return;
    const pattern = window.prompt(
      "Enter a custom number format pattern (Excel-style), e.g. #,##0.00 or \"$\"#,##0",
    );
    if (pattern === null || pattern.trim() === "") return;
    applyNumberFormatToSelection(pattern.trim());
  }, [applyNumberFormatToSelection]);

  const handleExcelCompatible = useCallback(() => {
    applyNumberFormatToSelection("General");
  }, [applyNumberFormatToSelection]);

  if (!store) return null;

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Math & Trig */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Math & Trig
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* SUM */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleSum}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              SUM
            </span>
          </button>

          {/* AVERAGE */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleAverage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              AVERAGE
            </span>
          </button>

          {/* ROUND */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleRound}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              ROUND
            </span>
          </button>
          {showRoundOptions && (
            <div className="absolute mt-[86px] bg-white border border-[#E5E7EB] rounded-md shadow-sm p-1">
              {roundOptions.map((opt) => (
                <button
                  key={opt.pattern}
                  type="button"
                  className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                  onClick={() => {
                    applyNumberFormatToSelection(opt.pattern);
                    setShowRoundOptions(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Logical */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Logical
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* IF */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleIf}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              IF
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Lookup */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Lookup
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* VLOOKUP */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleVlookup}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              VLOOKUP
            </span>
          </button>

          {/* INDEX */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleIndex}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              INDEX
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Text */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Text
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* CONCAT */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleConcat}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              CONCAT
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Number Formats */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Number Formats
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Currency */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleCurrency}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 1.66406V18.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1667 4.16406H7.91667C7.14312 4.16406 6.40125 4.47135 5.85427 5.01833C5.30729 5.56532 5 6.30718 5 7.08073C5 7.85428 5.30729 8.59614 5.85427 9.14312C6.40125 9.69011 7.14312 9.9974 7.91667 9.9974H12.0833C12.8569 9.9974 13.5987 10.3047 14.1457 10.8517C14.6927 11.3986 15 12.1405 15 12.9141C15 13.6876 14.6927 14.4295 14.1457 14.9765C13.5987 15.5234 12.8569 15.8307 12.0833 15.8307H5"
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
              Currency
            </span>
          </button>
          {showCurrencyOptions && (
            <div className="absolute mt-[86px] bg-white border border-[#E5E7EB] rounded-md shadow-sm p-1">
              {currencyOptions.map((opt) => (
                <button
                  key={opt.pattern}
                  type="button"
                  className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                  onClick={() => {
                    applyNumberFormatToSelection(opt.pattern);
                    setShowCurrencyOptions(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Percentage */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handlePercentage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8307 4.16406L4.16406 15.8307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.41927 7.5026C6.56986 7.5026 7.5026 6.56986 7.5026 5.41927C7.5026 4.26868 6.56986 3.33594 5.41927 3.33594C4.26868 3.33594 3.33594 4.26868 3.33594 5.41927C3.33594 6.56986 4.26868 7.5026 5.41927 7.5026Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.5833 16.6667C15.7339 16.6667 16.6667 15.7339 16.6667 14.5833C16.6667 13.4327 15.7339 12.5 14.5833 12.5C13.4327 12.5 12.5 13.4327 12.5 14.5833C12.5 15.7339 13.4327 16.6667 14.5833 16.6667Z"
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
              Percentage
            </span>
          </button>

          {/* Dates */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleDates}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6.66406 1.66406V4.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 1.66406V4.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.8333 3.33594H4.16667C3.24619 3.33594 2.5 4.08213 2.5 5.0026V16.6693C2.5 17.5897 3.24619 18.3359 4.16667 18.3359H15.8333C16.7538 18.3359 17.5 17.5897 17.5 16.6693V5.0026C17.5 4.08213 16.7538 3.33594 15.8333 3.33594Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 8.33594H17.5"
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
              Dates
            </span>
          </button>
          {showDateOptions && (
            <div className="absolute mt-[86px] bg-white border border-[#E5E7EB] rounded-md shadow-sm p-1">
              {dateOptions.map((opt) => (
                <button
                  key={opt.pattern}
                  type="button"
                  className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                  onClick={() => {
                    applyNumberFormatToSelection(opt.pattern);
                    setShowDateOptions(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Advanced */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Advanced
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Durations */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleDurations}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 5V10L13.3333 11.6667"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.9974 18.3307C14.5998 18.3307 18.3307 14.5998 18.3307 9.9974C18.3307 5.39502 14.5998 1.66406 9.9974 1.66406C5.39502 1.66406 1.66406 5.39502 1.66406 9.9974C1.66406 14.5998 5.39502 18.3307 9.9974 18.3307Z"
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
              Durations
            </span>
          </button>
          {showDurationOptions && (
            <div className="absolute mt-[86px] bg-white border border-[#E5E7EB] rounded-md shadow-sm p-1">
              {durationOptions.map((opt) => (
                <button
                  key={opt.pattern}
                  type="button"
                  className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                  onClick={() => {
                    applyNumberFormatToSelection(opt.pattern);
                    setShowDurationOptions(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Custom */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleCustom}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M11.6641 14.1641H4.16406"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.8359 5.83594H8.33594"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1641 16.6641C15.5448 16.6641 16.6641 15.5448 16.6641 14.1641C16.6641 12.7834 15.5448 11.6641 14.1641 11.6641C12.7834 11.6641 11.6641 12.7834 11.6641 14.1641C11.6641 15.5448 12.7834 16.6641 14.1641 16.6641Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83594 8.33594C7.21665 8.33594 8.33594 7.21665 8.33594 5.83594C8.33594 4.45523 7.21665 3.33594 5.83594 3.33594C4.45523 3.33594 3.33594 4.45523 3.33594 5.83594C3.33594 7.21665 4.45523 8.33594 5.83594 8.33594Z"
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
              Custom
            </span>
          </button>

          {/* Excel-Compatible */}
          <button
            className="flex flex-col items-center justify-center w-[80px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
            onClick={handleExcelCompatible}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M3.33594 18.3307H15.0026C15.4446 18.3307 15.8686 18.1551 16.1811 17.8426C16.4937 17.53 16.6693 17.1061 16.6693 16.6641V5.83073L12.5026 1.66406H5.0026C4.56058 1.66406 4.13665 1.83966 3.82409 2.15222C3.51153 2.46478 3.33594 2.8887 3.33594 3.33073V6.66406"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.6641 1.66406V4.9974C11.6641 5.43942 11.8397 5.86335 12.1522 6.17591C12.4648 6.48847 12.8887 6.66406 13.3307 6.66406H16.6641"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 12.5026L4.16667 14.1693L7.5 10.8359"
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
              Excel-Compatible
            </span>
          </button>

       
        </div>
      </div>
    </div>
  );
}
