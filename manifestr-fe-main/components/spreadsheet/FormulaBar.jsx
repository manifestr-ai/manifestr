import React, { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

/**
 * Custom formula bar (Figma MANIFESTR User Portal — spreadsheet toolbar).
 * Univer’s built-in formula bar is hidden via global.css; this bar sits above the grid.
 */
export default function FormulaBar({ univerAPI }) {
  const [cellAddress, setCellAddress] = useState("A1");
  const [formulaValue, setFormulaValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const availableFormulas = [
    "SUM",
    "AVERAGE",
    "COUNT",
    "MAX",
    "MIN",
    "IF",
    "VLOOKUP",
    "HLOOKUP",
    "CONCAT",
    "LEFT",
    "RIGHT",
    "MID",
    "LEN",
    "UPPER",
    "LOWER",
    "TRIM",
    "CUSTOMSUM",
    "CUSTOM_ASYNC_OBJECT",
    "CUSTOM_ASYNC_ARRAY",
    "AND",
    "OR",
    "NOT",
    "TODAY",
    "NOW",
    "DATE",
    "TIME",
  ];

  useEffect(() => {
    if (!univerAPI) return;

    const updateFormulaBar = () => {
      if (isEditing) return;

      try {
        const activeWorkbook = univerAPI.getActiveWorkbook();
        if (!activeWorkbook) return;

        const activeSheet = activeWorkbook.getActiveSheet();
        if (!activeSheet) return;

        const selection = activeSheet.getSelection();
        const activeRange = selection?.getActiveRange?.();
        if (!activeRange || typeof activeRange.getRange !== "function") return;

        const { startRow, startColumn } = activeRange.getRange();
        setCellAddress(columnToLetter(startColumn) + (startRow + 1));

        const cell = activeSheet.getRange(startRow, startColumn, 1, 1);
        const cellFormula =
          typeof cell.getFormula === "function" ? cell.getFormula() : null;
        const cellData =
          typeof cell.getValue === "function" ? cell.getValue() : null;

        if (cellFormula) {
          const f = String(cellFormula);
          setFormulaValue(f.startsWith("=") ? f : `=${f}`);
        } else {
          setFormulaValue(
            cellData !== undefined && cellData !== null
              ? String(cellData)
              : "",
          );
        }
      } catch {
        /* ignore */
      }
    };

    const interval = setInterval(updateFormulaBar, 150);
    return () => clearInterval(interval);
  }, [univerAPI, isEditing]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormulaValue(value);

    if (value.startsWith("=")) {
      const lastWord = value.split(/[(),\s+\-*/]/).pop().toUpperCase();
      if (lastWord.length > 0) {
        const filtered = availableFormulas.filter(
          (f) => f.startsWith(lastWord) && f !== lastWord,
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const applyEditToCell = (sheet, row, col, raw) => {
    const cell = sheet.getRange(row, col, 1, 1);
    const trimmed = raw.trim();

    if (trimmed === "") {
      if (typeof cell.setValue === "function") {
        try {
          cell.setValue("");
          return true;
        } catch {
          /* fall through */
        }
      }
      return false;
    }

    if (trimmed.startsWith("=")) {
      const withEq = trimmed;
      const withoutEq = trimmed.slice(1);
      if (typeof cell.setFormula === "function") {
        try {
          cell.setFormula(withEq);
          return true;
        } catch {
          try {
            cell.setFormula(withoutEq);
            return true;
          } catch {
            /* fall through */
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
            return false;
          }
        }
      }
      return false;
    }

    if (typeof cell.setValue === "function") {
      try {
        cell.setValue(trimmed);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const applyFormula = () => {
    if (!univerAPI) return;

    try {
      const activeWorkbook = univerAPI.getActiveWorkbook();
      if (!activeWorkbook) return;

      const activeSheet = activeWorkbook.getActiveSheet();
      if (!activeSheet) return;

      const selection = activeSheet.getSelection();
      const activeRange = selection?.getActiveRange?.();
      if (!activeRange || typeof activeRange.getRange !== "function") return;

      const { startRow, startColumn } = activeRange.getRange();
      applyEditToCell(activeSheet, startRow, startColumn, formulaValue);
      setIsEditing(false);
      inputRef.current?.blur();
    } catch {
      /* ignore */
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (univerAPI) {
      try {
        const activeWorkbook = univerAPI.getActiveWorkbook();
        const activeSheet = activeWorkbook?.getActiveSheet();
        const selection = activeSheet?.getSelection();
        const activeRange = selection?.getActiveRange?.();

        if (activeSheet && activeRange && typeof activeRange.getRange === "function") {
          const { startRow, startColumn } = activeRange.getRange();
          const cell = activeSheet.getRange(startRow, startColumn, 1, 1);
          const cellFormula =
            typeof cell.getFormula === "function" ? cell.getFormula() : null;
          const cellData =
            typeof cell.getValue === "function" ? cell.getValue() : null;

          if (cellFormula) {
            const f = String(cellFormula);
            setFormulaValue(f.startsWith("=") ? f : `=${f}`);
          } else {
            setFormulaValue(
              cellData !== undefined && cellData !== null
                ? String(cellData)
                : "",
            );
          }
        }
      } catch {
        /* ignore */
      }
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFormula();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  const insertSuggestion = (formula) => {
    const parts = formulaValue.split(/([(),\s+\-*/])/);
    parts[parts.length - 1] = formula;
    const newValue = parts.join("") + "(";
    setFormulaValue(newValue);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="flex w-full shrink-0 items-center gap-3 px-6 py-[9px]"
      data-component="spreadsheet-formula-bar"
    >
      {/* Name box — Figma: 60×34, radius 4, fill #F3F4F6, stroke #E5E7EB */}
      <div
        className="flex h-[34px] w-[60px] shrink-0 items-center justify-center rounded border border-[#e5e7eb] bg-[#f3f4f6] text-center font-sans text-[14px] font-normal leading-5 text-[#0a0a0a]"
        aria-hidden
      >
        {cellAddress}
      </div>

      {/* Confirm / cancel — Figma: 28px hit targets, 4px gap */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={applyFormula}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#16a34a] transition-colors hover:bg-[#f3f4f6]"
          aria-label="Apply"
        >
          <Check className="size-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#ef4444] transition-colors hover:bg-[#f3f4f6]"
          aria-label="Cancel"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div className="relative min-w-0 flex-1">
        <input
          ref={inputRef}
          type="text"
          value={formulaValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsEditing(true)}
          placeholder="Enter value or formula (e.g., =SUM(A1:A10))"
          className="h-8 w-full min-w-0 rounded-md border border-transparent bg-[#f3f3f5] px-3 font-sans text-[14px] leading-5 text-[#0a0a0a] placeholder:text-[#717182] outline-none ring-0 focus:border-transparent focus:bg-[#f3f3f5] focus:ring-1 focus:ring-[#e5e7eb]"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-64 overflow-y-auto rounded-md border border-[#e5e7eb] bg-white shadow-lg">
            {suggestions.map((formula, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertSuggestion(formula)}
                className="w-full border-b border-[#f3f4f6] px-3 py-2 text-left font-mono text-sm text-[#0a0a0a] last:border-b-0 hover:bg-[#eff6ff] hover:text-[#2563eb]"
              >
                {formula}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function columnToLetter(column) {
  let temp;
  let letter = "";
  let c = column;
  while (c >= 0) {
    temp = c % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    c = Math.floor(c / 26) - 1;
  }
  return letter;
}
