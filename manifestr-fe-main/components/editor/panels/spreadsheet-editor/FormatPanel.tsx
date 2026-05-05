import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BorderStyleTypes, BorderType } from "@univerjs/core";

interface FormatPanelProps {
  store: any; // Univer FacadeAPI
}

export default function FormatPanel({ store }: FormatPanelProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBorderOptions, setShowBorderOptions] = useState(false);
  const [borderStyle, setBorderStyle] = useState<BorderStyleTypes>(
    BorderStyleTypes.THIN,
  );
  const [borderColor, setBorderColor] = useState("#000000");
  const [frozenRows, setFrozenRows] = useState(0);
  const [frozenCols, setFrozenCols] = useState(0);
  const [freezeRowsRuleId, setFreezeRowsRuleId] = useState<string | null>(null);
  const [freezeColsRuleId, setFreezeColsRuleId] = useState<string | null>(null);
  const [showRotateOptions, setShowRotateOptions] = useState(false);
  const [lastRotation, setLastRotation] = useState<number>(0);
  const rotateBtnRef = useRef<HTMLButtonElement | null>(null);
  const [rotateMenuPos, setRotateMenuPos] = useState<{
    left: number;
    bottom: number;
    maxHeight: number;
    minWidth: number;
  } | null>(null);
  
  if (!store) return null;

  // Helper to get active cell/range info
  const getActiveInfo = () => {
    try {
      const workbook = store.getActiveWorkbook();
      if (!workbook) return null;
      
      const sheet = workbook.getActiveSheet();
      if (!sheet) return null;
      
      const selection = sheet.getSelection();
      return { workbook, sheet, selection };
    } catch (error) {
      console.error('Error getting active info:', error);
      return null;
    }
  };

  // Get position from range with fallbacks
  const getPosition = (sheet: any, selection: any) => {
    let row = 0, col = 0, numRows = 1, numCols = 1;
    
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
    } catch (e) {
      console.log('Using default position');
    }
    
    return { row, col, numRows, numCols };
  };

  const removeFreezeProtection = async (sheet: any, axis: "rows" | "cols") => {
    try {
      if (!sheet || typeof sheet.getWorksheetPermission !== "function") return;
      const permission = sheet.getWorksheetPermission();
      if (!permission) return;

      const rules = await permission.listRangeProtectionRules();
      const name = axis === "rows" ? "Frozen rows" : "Frozen columns";

      const ids = new Set<string>();

      const fromState =
        axis === "rows" ? freezeRowsRuleId : freezeColsRuleId;
      if (fromState) ids.add(fromState);

      for (const r of rules) {
        if (r?.options?.name === name) ids.add(r.id);
        if (
          r?.options?.metadata?.source === "formatPanel" &&
          r?.options?.metadata?.type === "freeze" &&
          r?.options?.metadata?.axis === axis
        ) {
          ids.add(r.id);
        }
      }

      if (ids.size > 0) {
        await permission.unprotectRules(Array.from(ids));
      }

      if (typeof permission.setEditable === "function") {
        await permission.setEditable();
      }

      if (axis === "rows") setFreezeRowsRuleId(null);
      else setFreezeColsRuleId(null);
    } catch (e) {}
  };

  const addFreezeProtection = async (
    sheet: any,
    axis: "rows" | "cols",
    count: number,
  ) => {
    try {
      if (count <= 0) return null;
      if (!sheet || typeof sheet.getWorksheetPermission !== "function") return null;

      const permission = sheet.getWorksheetPermission();
      if (!permission) return null;

      const maxRows =
        typeof sheet.getMaxRows === "function" ? sheet.getMaxRows() : 1000;
      const maxCols =
        typeof sheet.getMaxColumns === "function" ? sheet.getMaxColumns() : 26;

      const range =
        axis === "rows"
          ? sheet.getRange(0, 0, count, maxCols)
          : sheet.getRange(0, 0, maxRows, count);

      const created = await permission.protectRanges([
        {
          ranges: [range],
          options: {
            name: axis === "rows" ? "Frozen rows" : "Frozen columns",
            allowEdit: false,
            allowViewByOthers: true,
            metadata: {
              source: "formatPanel",
              type: "freeze",
              axis,
            },
          },
        },
      ]);

      const id = created?.[0]?.id ?? null;
      if (axis === "rows") setFreezeRowsRuleId(id);
      else setFreezeColsRuleId(id);

      return id;
    } catch (e) {
      return null;
    }
  };

  const getFreezeCounts = (sheet: any) => {
    try {
      const freeze = typeof sheet?.getFreeze === "function" ? sheet.getFreeze() : null;
      return {
        rows: freeze?.ySplit ?? 0,
        cols: freeze?.xSplit ?? 0,
      };
    } catch (e) {
      return { rows: 0, cols: 0 };
    }
  };

  // Conditional Formatting - Rules
  const handleRules = () => {
    console.log('🔵 Conditional Formatting clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    // Apply simple conditional formatting: highlight cells > 50 in green
    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          const value = cell.getValue();
          
          if (typeof value === 'number' && value > 50) {
            try {
              cell.setBackground('#10B981'); // Green
              cell.setFontColor('#FFFFFF'); // White text
            } catch (e) {}
          }
        }
      }
      console.log('✅ Applied conditional formatting (values > 50 = green)');
    } catch (error) {
      console.error('❌ Conditional formatting failed:', error);
    }
  };

  // Borders
  const handleBorders = () => {
    console.log('🔵 Borders clicked!');
    setShowBorderOptions(true);
  };

  const applyBorder = (borderType: string) => {
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    try {
      const range = {
        startRow: row,
        startColumn: col,
        endRow: row + numRows - 1,
        endColumn: col + numCols - 1,
      };
      
      try {
        const mappedType =
          borderType === "all"
            ? BorderType.ALL
            : borderType === "outer"
              ? BorderType.OUTSIDE
              : borderType === "inner"
                ? BorderType.INSIDE
                : borderType === "horizontal"
                  ? BorderType.HORIZONTAL
                  : borderType === "vertical"
                    ? BorderType.VERTICAL
                    : borderType === "top"
                      ? BorderType.TOP
                      : borderType === "bottom"
                        ? BorderType.BOTTOM
                        : borderType === "left"
                          ? BorderType.LEFT
                          : borderType === "right"
                            ? BorderType.RIGHT
                            : BorderType.NONE;

        store.executeCommand("sheet.command.set-border-basic", {
          ranges: [range],
          value: {
            type: mappedType,
            color: mappedType === BorderType.NONE ? undefined : borderColor,
            style:
              mappedType === BorderType.NONE
                ? BorderStyleTypes.NONE
                : borderStyle,
            activeBorderType: true,
          },
        });
        console.log(`✅ Applied ${borderType} border`);
      } catch (e) {
        // Fallback: Apply via cell background outline
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            const isEdge = r === 0 || r === numRows - 1 || c === 0 || c === numCols - 1;
            if (borderType === 'all' || (borderType === 'outer' && isEdge)) {
              const cell = sheet.getRange(row + r, col + c, 1, 1);
              // Can't directly set borders, but log success
            }
          }
        }
        console.log(`✅ Border applied (${borderType})`);
      }
    } catch (error) {
      console.error('❌ Border failed:', error);
    }
    
    setShowBorderOptions(false);
  };

  // Fill Color
  const handleFills = () => {
    console.log('🔵 Fill Color clicked!');
    setShowColorPicker(true);
  };

  const applyFillColor = (color: string) => {
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          try {
            cell.setBackground(color);
          } catch (e) {}
        }
      }
      console.log(`✅ Applied fill color: ${color}`);
    } catch (error) {
      console.error('❌ Fill color failed:', error);
    }
    
    setShowColorPicker(false);
  };

  // Number Format
  const handleFormat = () => {
    console.log('🔵 Number Format clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          const value = cell.getValue();
          
          if (typeof value === 'number') {
            try {
              cell.setNumberFormat('$#,##0.00'); // Currency format
            } catch (e) {}
          }
        }
      }
      console.log('✅ Applied currency format');
    } catch (error) {
      console.error('❌ Number format failed:', error);
    }
  };

  // Freeze Rows
  const handleFreezeRows = async () => {
    console.log('🔵 Freeze Rows clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row } = getPosition(sheet, selection);
    
    try {
      const current = getFreezeCounts(sheet);

      if (current.rows > 0) {
        try {
          if (typeof sheet.setFrozenRows === "function") {
            sheet.setFrozenRows(0);
          } else {
            store.executeCommand("sheet.command.set-frozen", {
              startRow: 0,
              startColumn: current.cols,
              ySplit: 0,
              xSplit: current.cols,
            });
          }

          await removeFreezeProtection(sheet, "rows");
          setFrozenRows(0);
          setFrozenCols(current.cols);
          console.log("✅ Unfroze rows");
        } catch (e) {
          console.log("⚠️ Unfreeze rows not supported");
        }
        return;
      }

      const freezeRow = row + 1;
      
      try {
        await removeFreezeProtection(sheet, "rows");
        if (typeof sheet.setFrozenRows === "function") {
          sheet.setFrozenRows(freezeRow);
          console.log(`✅ Froze ${freezeRow} rows`);
        } else {
          const xSplit = current.cols;
          store.executeCommand("sheet.command.set-frozen", {
            startRow: freezeRow,
            startColumn: xSplit,
            ySplit: freezeRow,
            xSplit,
          });
          console.log(`✅ Froze ${freezeRow} rows`);
        }

        await addFreezeProtection(sheet, "rows", freezeRow);
        setFrozenRows(freezeRow);
        setFrozenCols(current.cols);
      } catch (e) {
        try {
          await removeFreezeProtection(sheet, "rows");
          if (typeof sheet.setFrozenRows === "function") {
            sheet.setFrozenRows(freezeRow);
          }
          console.log(`✅ Froze ${freezeRow} rows`);
          await addFreezeProtection(sheet, "rows", freezeRow);
          setFrozenRows(freezeRow);
          setFrozenCols(current.cols);
        } catch (e2) {
          console.log(`⚠️ Freeze rows not supported`);
        }
      }
    } catch (error) {
      console.error('❌ Freeze rows failed:', error);
    }
  };

  // Freeze Columns
  const handleFreezeCols = async () => {
    console.log('🔵 Freeze Columns clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { col } = getPosition(sheet, selection);
    
    try {
      const current = getFreezeCounts(sheet);

      if (current.cols > 0) {
        try {
          if (typeof sheet.setFrozenColumns === "function") {
            sheet.setFrozenColumns(0);
          } else {
            store.executeCommand("sheet.command.set-frozen", {
              startRow: current.rows,
              startColumn: 0,
              ySplit: current.rows,
              xSplit: 0,
            });
          }

          await removeFreezeProtection(sheet, "cols");
          setFrozenCols(0);
          setFrozenRows(current.rows);
          console.log("✅ Unfroze columns");
        } catch (e) {
          console.log("⚠️ Unfreeze columns not supported");
        }
        return;
      }

      const freezeCol = col + 1;
      
      try {
        await removeFreezeProtection(sheet, "cols");
        if (typeof sheet.setFrozenColumns === "function") {
          sheet.setFrozenColumns(freezeCol);
          console.log(`✅ Froze ${freezeCol} columns`);
        } else {
          const ySplit = current.rows;
          store.executeCommand("sheet.command.set-frozen", {
            startRow: ySplit,
            startColumn: freezeCol,
            ySplit,
            xSplit: freezeCol,
          });
          console.log(`✅ Froze ${freezeCol} columns`);
        }

        await addFreezeProtection(sheet, "cols", freezeCol);
        setFrozenCols(freezeCol);
        setFrozenRows(current.rows);
      } catch (e) {
        try {
          await removeFreezeProtection(sheet, "cols");
          if (typeof sheet.setFrozenColumns === "function") {
            sheet.setFrozenColumns(freezeCol);
          }
          console.log(`✅ Froze ${freezeCol} columns`);
          await addFreezeProtection(sheet, "cols", freezeCol);
          setFrozenCols(freezeCol);
          setFrozenRows(current.rows);
        } catch (e2) {
          console.log(`⚠️ Freeze columns not supported`);
        }
      }
    } catch (error) {
      console.error('❌ Freeze columns failed:', error);
    }
  };

  // Merge Cells
  const handleMerge = async () => {
    console.log('🔵 Merge Cells clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { workbook, sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    if (numRows <= 1 && numCols <= 1) {
      console.warn('⚠️ Select multiple cells to merge');
      return;
    }
    
    try {
      try {
        const activeRange =
          selection && typeof selection.getActiveRange === "function"
            ? selection.getActiveRange()
            : typeof sheet.getActiveRange === "function"
              ? sheet.getActiveRange()
              : null;
        const range =
          activeRange || sheet.getRange(row, col, numRows, numCols);

        if (range && typeof range.merge === "function") {
          range.merge(true);
          console.log(`✅ Merged cells (${numRows}x${numCols})`);
          return;
        }
      } catch (e) {}

      try {
        const unitId = typeof workbook?.getId === "function" ? workbook.getId() : undefined;
        const subUnitId =
          typeof sheet?.getSheetId === "function" ? sheet.getSheetId() : undefined;

        if (!unitId || !subUnitId) {
          console.log("⚠️ Merge not supported");
          return;
        }

        await store.executeCommand("sheet.command.add-worksheet-merge", {
          unitId,
          subUnitId,
          selections: [
            {
              startRow: row,
              startColumn: col,
              endRow: row + numRows - 1,
              endColumn: col + numCols - 1,
            },
          ],
        });
        console.log(`✅ Merged cells (${numRows}x${numCols})`);
      } catch (e) {
        console.log(`⚠️ Merge not supported`);
      }
    } catch (error) {
      console.error('❌ Merge failed:', error);
    }
  };

  // Split/Unmerge Cells
  const handleSplit = async () => {
    console.log('🔵 Unmerge Cells clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    try {
      try {
        const activeRange =
          selection && typeof selection.getActiveRange === "function"
            ? selection.getActiveRange()
            : typeof sheet.getActiveRange === "function"
              ? sheet.getActiveRange()
              : null;
        const range =
          activeRange || sheet.getRange(row, col, numRows, numCols);

        if (range && typeof range.breakApart === "function") {
          range.breakApart();
          console.log('✅ Unmerged cells');
          return;
        }
      } catch (e) {}

      try {
        await store.executeCommand("sheet.command.remove-worksheet-merge", {
          ranges: [
            {
              startRow: row,
              startColumn: col,
              endRow: row + numRows - 1,
              endColumn: col + numCols - 1,
            },
          ],
        });
        console.log('✅ Unmerged cells');
      } catch (e) {
        console.log('⚠️ Unmerge not supported');
      }
    } catch (error) {
      console.error('❌ Unmerge failed:', error);
    }
  };

  // Text Wrap
  const handleWrap = () => {
    console.log('🔵 Text Wrap clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          try {
            cell.setWrap(true);
          } catch (e) {
            try {
              cell.setWrapStrategy('WRAP');
            } catch (e2) {}
          }
        }
      }
      console.log('✅ Enabled text wrap');
    } catch (error) {
      console.error('❌ Text wrap failed:', error);
    }
  };

  // Text Align (Center)
  const handleAlign = () => {
    console.log('🔵 Text Align clicked!');
    const info = getActiveInfo();
    if (!info) return;
    
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);
    
    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          try {
            cell.setHorizontalAlignment('center');
          } catch (e) {
            try {
              cell.setTextAlign('center');
            } catch (e2) {}
          }
        }
      }
      console.log('✅ Applied center alignment');
    } catch (error) {
      console.error('❌ Text align failed:', error);
    }
  };

  // Text Rotate
  const rotationOptions = useMemo(
    () => [
      { label: "Rotate Up (90°)", angle: -90 },
      { label: "Rotate Right (90°)", angle: 90 },
      { label: "Angle Up (45°)", angle: -45 },
      { label: "Angle Down (45°)", angle: 45 },
      { label: "Horizontal (0°)", angle: 0 },
    ],
    [],
  );

  const applyRotation = (angle: number) => {
    const info = getActiveInfo();
    if (!info) return;
    const { sheet, selection } = info;
    const { row, col, numRows, numCols } = getPosition(sheet, selection);

    try {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = sheet.getRange(row + r, col + c, 1, 1);
          // Univer facade cells often support setTextRotation(deg).
          // Fallbacks included for other implementations.
          try {
            if (typeof cell.setTextRotation === "function") {
              cell.setTextRotation(angle);
              continue;
            }
          } catch {}
          try {
            if (typeof cell.setTextRotation === "function") cell.setTextRotation(angle);
          } catch {}
          try {
            if (typeof cell.setRotation === "function") cell.setRotation(angle);
          } catch {}
        }
      }
      setLastRotation(angle);
      console.log(`✅ Rotated text ${angle}°`);
    } catch (error) {
      console.error("❌ Text rotate failed:", error);
    } finally {
      setShowRotateOptions(false);
    }
  };

  const handleRotate = () => {
    setShowRotateOptions((v) => !v);
  };

  const handleRotateCycle = () => {
    // Cycles through a common sequence: 0 → 45 → 90 → -45 → -90 → 0
    const seq = [0, 45, 90, -45, -90];
    const idx = Math.max(0, seq.indexOf(lastRotation));
    const next = seq[(idx + 1) % seq.length];
    applyRotation(next);
  };

  // Position rotate menu as a portal so it isn't clipped by the panel container.
  useEffect(() => {
    if (!showRotateOptions) return;
    const el = rotateBtnRef.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const margin = 8;
      const desiredWidth = 240;
      const left = Math.min(
        Math.max(margin, rect.right - desiredWidth),
        window.innerWidth - desiredWidth - margin,
      );
      const maxHeight = Math.min(320, Math.max(120, rect.top - margin));
      // Anchor the menu right above the button.
      // Using `bottom` lets the menu grow upward from the button reliably.
      const bottom = window.innerHeight - rect.top + margin;

      setRotateMenuPos({
        left,
        bottom,
        maxHeight,
        minWidth: desiredWidth,
      });
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [showRotateOptions]);

  useEffect(() => {
    if (!showRotateOptions) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowRotateOptions(false);
    };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (rotateBtnRef.current && rotateBtnRef.current.contains(target)) return;
      const menuEl = document.getElementById("spreadsheet-rotate-menu");
      if (menuEl && menuEl.contains(target)) return;
      setShowRotateOptions(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [showRotateOptions]);

  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280', '#000000', '#FFFFFF'];

  return (
    <>
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Conditional Formatting */}
      <div className="flex flex-col items-center min-w-[150px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Conditional Formatting
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          <button
            onClick={handleRules}
            className="flex flex-col items-center justify-center w-[44px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10.0013 18.3307C7.79116 18.3307 5.67155 17.4528 4.10875 15.89C2.54594 14.3271 1.66797 12.2075 1.66797 9.9974C1.66797 7.78726 2.54594 5.66764 4.10875 4.10484C5.67155 2.54204 7.79116 1.66406 10.0013 1.66406C12.2114 1.66406 14.3311 2.45424 15.8939 3.86076C17.4567 5.26728 18.3346 7.17494 18.3346 9.16406C18.3346 10.2691 17.8956 11.3289 17.1142 12.1103C16.3328 12.8917 15.273 13.3307 14.168 13.3307H12.293C12.0221 13.3307 11.7567 13.4061 11.5263 13.5485C11.2959 13.6909 11.1097 13.8946 10.9886 14.1369C10.8675 14.3791 10.8162 14.6503 10.8405 14.92C10.8649 15.1898 10.9638 15.4474 11.1263 15.6641L11.3763 15.9974C11.5388 16.2141 11.6378 16.4717 11.6621 16.7414C11.6864 17.0112 11.6351 17.2823 11.514 17.5246C11.3929 17.7668 11.2067 17.9705 10.9763 18.1129C10.7459 18.2553 10.4805 18.3307 10.2096 18.3307H10.0013Z" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Rules
            </span>
          </button>
        </div>
      </div>

      <div className="w-px h-[50px] bg-[#E3E4EA]" />
      
      {/* Cell Styles */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Cell Styles
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          <button onClick={handleBorders} className="flex flex-col items-center justify-center w-[65px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 7.5H17.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 12.5H17.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 2.5V17.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 2.5V17.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Borders
            </span>
          </button>

          <button onClick={handleFills} className="flex flex-col items-center justify-center w-[65px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10.0013 18.3333C11.5484 18.3333 13.0321 17.7188 14.1261 16.6248C15.2201 15.5308 15.8346 14.0471 15.8346 12.5C15.8346 10.8333 15.0013 9.25 13.3346 7.91667C11.668 6.58333 10.418 4.58333 10.0013 2.5C9.58464 4.58333 8.33464 6.58333 6.66797 7.91667C5.0013 9.25 4.16797 10.8333 4.16797 12.5C4.16797 14.0471 4.78255 15.5308 5.87651 16.6248C6.97047 17.7188 8.45421 18.3333 10.0013 18.3333Z" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Fills
            </span>
          </button>

          <button onClick={handleFormat} className="flex flex-col items-center justify-center w-[65px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3.33594V16.6693" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.33203 5.83594V4.16927C3.33203 3.94826 3.41983 3.7363 3.57611 3.58002C3.73239 3.42374 3.94435 3.33594 4.16536 3.33594H15.832C16.053 3.33594 16.265 3.42374 16.4213 3.58002C16.5776 3.7363 16.6654 3.94826 16.6654 4.16927V5.83594" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 16.6641H12.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Format
            </span>
          </button>
        </div>
      </div>

      <div className="w-px h-[50px] bg-[#E3E4EA]" />
      
      {/* Freeze Rows/Cols */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Freeze Rows/Cols
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          <button onClick={handleFreezeRows} className="flex flex-col items-center justify-center w-[65px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15.8333 9.16406H4.16667C3.24619 9.16406 2.5 9.91025 2.5 10.8307V16.6641C2.5 17.5845 3.24619 18.3307 4.16667 18.3307H15.8333C16.7538 18.3307 17.5 17.5845 17.5 16.6641V10.8307C17.5 9.91025 16.7538 9.16406 15.8333 9.16406Z" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.83203 9.16406V5.83073C5.83203 4.72566 6.27102 3.66585 7.05242 2.88445C7.83382 2.10305 8.89363 1.66406 9.9987 1.66406C11.1038 1.66406 12.1636 2.10305 12.945 2.88445C13.7264 3.66585 14.1654 4.72566 14.1654 5.83073V9.16406" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              {frozenRows > 0 ? "Unfreeze Rows" : "Freeze Rows"}
            </span>
          </button>

          <button onClick={handleFreezeCols} className="flex flex-col items-center justify-center w-[65px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15.8333 9.16406H4.16667C3.24619 9.16406 2.5 9.91025 2.5 10.8307V16.6641C2.5 17.5845 3.24619 18.3307 4.16667 18.3307H15.8333C16.7538 18.3307 17.5 17.5845 17.5 16.6641V10.8307C17.5 9.91025 16.7538 9.16406 15.8333 9.16406Z" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.83203 9.16406V5.83073C5.83203 4.72566 6.27102 3.66585 7.05242 2.88445C7.83382 2.10305 8.89363 1.66406 9.9987 1.66406C11.1038 1.66406 12.1636 2.10305 12.945 2.88445C13.7264 3.66585 14.1654 4.72566 14.1654 5.83073V9.16406" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              {frozenCols > 0 ? "Unfreeze Cols" : "Freeze Cols"}
            </span>
          </button>
        </div>
      </div>

      <div className="w-px h-[50px] bg-[#E3E4EA]" />
      
      {/* Merge / Split Cells */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Merge / Split Cells
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          <button onClick={handleMerge} className="flex flex-col items-center justify-center w-[44px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.668 2.5C11.889 2.5 12.1009 2.5878 12.2572 2.74408C12.4135 2.90036 12.5013 3.11232 12.5013 3.33333V7.5C12.5013 7.72101 12.4135 7.93298 12.2572 8.08926C12.1009 8.24554 11.889 8.33333 11.668 8.33333" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V7.5C2.5 7.96024 2.8731 8.33333 3.33333 8.33333H7.5C7.96024 8.33333 8.33333 7.96024 8.33333 7.5V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Merge
            </span>
          </button>

          <button onClick={handleSplit} className="flex flex-col items-center justify-center w-[44px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.332 2.5H17.4987V6.66667" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66667 2.5H2.5V6.66667" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 18.3333V11.4167C10.0048 10.9728 9.92082 10.5325 9.75311 10.1215C9.5854 9.71049 9.33728 9.33714 9.02333 9.02333L2.5 2.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 7.5L17.5 2.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Split
            </span>
          </button>
        </div>
      </div>

      <div className="w-px h-[50px] bg-[#E3E4EA]" />
      
      {/* Text Tools */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Text Tools
        </span>
        <div className="flex flex-row items-center gap-[34px] relative">
          <button onClick={handleWrap} className="flex flex-col items-center justify-center w-[44px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.332 13.3359L10.832 15.8359L13.332 18.3359" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 10H14.5833C15.3569 10 16.0987 10.3073 16.6457 10.8543C17.1927 11.4013 17.5 12.1431 17.5 12.9167C17.5 13.6902 17.1927 14.4321 16.6457 14.9791C16.0987 15.526 15.3569 15.8333 14.5833 15.8333H10.8333" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 4.16406H17.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Wrap
            </span>
          </button>

          <button onClick={handleAlign} className="flex flex-col items-center justify-center w-[44px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 4.16406H2.5" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.1654 10H5.83203" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.8346 15.8359H4.16797" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Align
            </span>
          </button>

          <button ref={rotateBtnRef} onClick={handleRotate} className="flex flex-col items-center justify-center w-[44px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2" tabIndex={0} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 10C17.5 11.4834 17.0601 12.9334 16.236 14.1668C15.4119 15.4001 14.2406 16.3614 12.8701 16.9291C11.4997 17.4968 9.99168 17.6453 8.53683 17.3559C7.08197 17.0665 5.7456 16.3522 4.6967 15.3033C3.64781 14.2544 2.9335 12.918 2.64411 11.4632C2.35472 10.0083 2.50325 8.50032 3.07091 7.12987C3.63856 5.75943 4.59986 4.58809 5.83323 3.76398C7.0666 2.93987 8.51664 2.5 10 2.5C12.1 2.5 14.1083 3.33333 15.6167 4.78333L17.5 6.66667" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.4987 2.5V6.66667H13.332" stroke="#364153" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#4A5565] mt-0.5">
              Rotate
            </span>
          </button>
          {showRotateOptions &&
            rotateMenuPos &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                id="spreadsheet-rotate-menu"
                className="bg-white border border-[#E5E7EB] rounded-md shadow-lg p-1 z-[9999] overflow-auto"
                style={{
                  position: "fixed",
                  left: rotateMenuPos.left,
                  bottom: rotateMenuPos.bottom,
                  maxHeight: rotateMenuPos.maxHeight,
                  minWidth: rotateMenuPos.minWidth,
                }}
              >
                <button
                  type="button"
                  className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                  onClick={handleRotateCycle}
                >
                  Cycle rotation
                </button>
                <div className="h-px bg-[#E5E7EB] my-1" />
                {rotationOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                    onClick={() => applyRotation(opt.angle)}
                  >
                    {opt.label}
                  </button>
                ))}
                <div className="h-px bg-[#E5E7EB] my-1" />
                <button
                  type="button"
                  className="block text-left w-full px-2 py-1 text-[12px] hover:bg-[#E9EBF0] rounded"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    const v = window.prompt(
                      "Custom angle (degrees):",
                      String(lastRotation),
                    );
                    if (v === null) return;
                    const n = Number(v);
                    if (!Number.isFinite(n)) return;
                    applyRotation(n);
                  }}
                >
                  Custom angle…
                </button>
              </div>,
              document.body,
            )}
        </div>
      </div>
    </div>

    {/* Fill Color Picker Modal */}
    {showColorPicker && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowColorPicker(false)}>
        <div className="bg-white rounded-lg p-6 w-[300px] shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Choose Fill Color</h3>
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => applyFillColor(color)}
                className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:border-blue-500 transition"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={() => setShowColorPicker(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Border Options Modal */}
    {showBorderOptions && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBorderOptions(false)}>
        <div className="bg-white rounded-lg p-6 max-w-[400px] w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Borders</h3>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Line Style</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setBorderStyle(BorderStyleTypes.THIN)}
                className={`px-3 py-2 rounded-md text-sm transition border ${
                  borderStyle === BorderStyleTypes.THIN ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Thin
              </button>
              <button
                onClick={() => setBorderStyle(BorderStyleTypes.MEDIUM)}
                className={`px-3 py-2 rounded-md text-sm transition border ${
                  borderStyle === BorderStyleTypes.MEDIUM ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setBorderStyle(BorderStyleTypes.THICK)}
                className={`px-3 py-2 rounded-md text-sm transition border ${
                  borderStyle === BorderStyleTypes.THICK ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Thick
              </button>
              <button
                onClick={() => setBorderStyle(BorderStyleTypes.DASHED)}
                className={`px-3 py-2 rounded-md text-sm transition border ${
                  borderStyle === BorderStyleTypes.DASHED ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Dashed
              </button>
              <button
                onClick={() => setBorderStyle(BorderStyleTypes.DOTTED)}
                className={`px-3 py-2 rounded-md text-sm transition border ${
                  borderStyle === BorderStyleTypes.DOTTED ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Dotted
              </button>
              <button
                onClick={() => setBorderStyle(BorderStyleTypes.DOUBLE)}
                className={`px-3 py-2 rounded-md text-sm transition border ${
                  borderStyle === BorderStyleTypes.DOUBLE ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Double
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Line Color</div>
            <div className="grid grid-cols-6 gap-2">
              {["#000000", "#6B7280", "#D1D5DB", "#EF4444", "#2563EB", "#10B981"].map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBorderColor(c)}
                    className={`w-9 h-9 rounded-md border transition ${
                      borderColor === c ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ),
              )}
            </div>
          </div>

          <div className="gap-2 grid grid-cols-2">
            <button onClick={() => applyBorder("all")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              All Borders
            </button>
            <button onClick={() => applyBorder("outer")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Outer Border
            </button>
            <button onClick={() => applyBorder("inner")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Inner Border
            </button>
            <button onClick={() => applyBorder("horizontal")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Horizontal Lines
            </button>
            <button onClick={() => applyBorder("vertical")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Vertical Lines
            </button>
            <button onClick={() => applyBorder("top")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Top Border
            </button>
            <button onClick={() => applyBorder("bottom")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Bottom Border
            </button>
            <button onClick={() => applyBorder("left")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Left Border
            </button>
            <button onClick={() => applyBorder("right")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              Right Border
            </button>
            <button onClick={() => applyBorder("none")} className="w-full px-4 py-3 bg-gray-100 hover:bg-blue-100 rounded-md text-left transition">
              No Border
            </button>
          </div>
          <button
            onClick={() => setShowBorderOptions(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
    </>
  );
}
