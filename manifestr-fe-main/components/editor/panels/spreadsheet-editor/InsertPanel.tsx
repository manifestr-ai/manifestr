import React, { useMemo, useState } from "react";
import { shapeConfigs as presentationShapeConfigs, type ShapeConfig } from "../comman-panel/ShapesPanel";

interface InsertPanelProps {
  store: any; // Univer FacadeAPI
}

export default function InsertPanel({ store }: InsertPanelProps) {
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Helper to get active cell
  const getActiveCell = () => {
    if (!store) return null;
    try {
      const workbook = store.getActiveWorkbook();
      if (!workbook) return null;
      
      const sheet = workbook.getActiveSheet();
      if (!sheet) return null;
      
      const selection = sheet.getSelection();
      return { workbook, sheet, selection };
    } catch (error) {
      console.error('Error getting active cell:', error);
      return null;
    }
  };

  // Helper to set cell value
  const setCellValue = (row: number, col: number, value: any) => {
    try {
      const cellInfo = getActiveCell();
      if (!cellInfo) return false;

      const { sheet } = cellInfo;
      const range = sheet.getRange(row, col, 1, 1);
      range.setValue(value);
      console.log(`✅ Set cell (${row},${col}) = ${value}`);
      return true;
    } catch (error) {
      console.error('Error setting cell value:', error);
      return false;
    }
  };

  // Insert Row - BULLETPROOF with multiple fallbacks
  const handleInsertRow = () => {
    console.log('🔵 Insert Row clicked!');
    
    if (!store) {
      console.error('⚠️ Spreadsheet not ready');
      return;
    }

    try {
      const cellInfo = getActiveCell();
      if (!cellInfo) {
        console.warn('⚠️ Please select a cell first');
        return;
      }

      const { sheet, selection } = cellInfo;
      
      // Method 1: Try getting current row from active range
      try {
        const range = sheet.getActiveRange();
        let row = 0;
        
        if (range && typeof range.getRow === 'function') {
          row = range.getRow();
        } else if (range && typeof range.getStartRow === 'function') {
          row = range.getStartRow();
        } else if (selection) {
          const activeCell = selection.getActiveCell();
          if (activeCell) row = activeCell.row;
        }
        
        console.log(`🔵 Current row: ${row}`);
        
        // Try insertRowAfter
        if (typeof sheet.insertRowAfter === 'function') {
          sheet.insertRowAfter(row);
          console.log(`✅ ROW INSERTED after row ${row + 1}!`);
          return;
        }
      } catch (e1) {
        console.log('⚠️ Method 1 failed, trying Method 2...');
      }

      // Method 2: Try Univer command
      try {
        const result = store.executeCommand('sheet.command.insert-row');
        console.log('✅ ROW INSERTED via command!', result);
        return;
      } catch (e2) {
        console.log('⚠️ Method 2 failed, trying Method 3...');
      }

      // Method 3: Try insertRows
      try {
        const range = sheet.getActiveRange();
        let row = 0;
        
        if (range && typeof range.getRow === 'function') {
          row = range.getRow();
        } else if (range && typeof range.getStartRow === 'function') {
          row = range.getStartRow();
        } else if (selection) {
          const activeCell = selection.getActiveCell();
          if (activeCell) row = activeCell.row;
        }
        
        sheet.insertRows(row + 1, 1);
        console.log(`✅ ROW INSERTED at row ${row + 2}!`);
        return;
      } catch (e3) {
        console.log('⚠️ Method 3 failed.');
      }

      // All methods failed
      console.error('❌ All insert row methods failed');
      
    } catch (error) {
      console.error('❌ Insert row catastrophic failure:', error);
    }
  };

  // Insert Column - BULLETPROOF with multiple fallbacks
  const handleInsertColumn = () => {
    console.log('🔵 Insert Column clicked!');
    
    if (!store) {
      console.error('⚠️ Spreadsheet not ready');
      return;
    }

    try {
      const cellInfo = getActiveCell();
      if (!cellInfo) {
        console.warn('⚠️ Please select a cell first');
        return;
      }

      const { sheet, selection } = cellInfo;
      
      // Method 1: Try getting current column from active range
      try {
        const range = sheet.getActiveRange();
        let col = 0;
        
        if (range && typeof range.getColumn === 'function') {
          col = range.getColumn();
        } else if (range && typeof range.getStartColumn === 'function') {
          col = range.getStartColumn();
        } else if (selection) {
          const activeCell = selection.getActiveCell();
          if (activeCell) col = activeCell.column;
        }
        
        console.log(`🔵 Current column: ${col}`);
        
        // Try insertColumnAfter
        if (typeof sheet.insertColumnAfter === 'function') {
          sheet.insertColumnAfter(col);
          console.log(`✅ COLUMN INSERTED after column ${String.fromCharCode(65 + col)}!`);
          return;
        }
      } catch (e1) {
        console.log('⚠️ Method 1 failed, trying Method 2...');
      }

      // Method 2: Try Univer command
      try {
        const result = store.executeCommand('sheet.command.insert-column');
        console.log('✅ COLUMN INSERTED via command!', result);
        return;
      } catch (e2) {
        console.log('⚠️ Method 2 failed, trying Method 3...');
      }

      // Method 3: Try insertColumns
      try {
        const range = sheet.getActiveRange();
        let col = 0;
        
        if (range && typeof range.getColumn === 'function') {
          col = range.getColumn();
        } else if (range && typeof range.getStartColumn === 'function') {
          col = range.getStartColumn();
        } else if (selection) {
          const activeCell = selection.getActiveCell();
          if (activeCell) col = activeCell.column;
        }
        
        sheet.insertColumns(col + 1, 1);
        console.log(`✅ COLUMN INSERTED at column ${String.fromCharCode(66 + col)}!`);
        return;
      } catch (e3) {
        console.log('⚠️ Method 3 failed.');
      }

      // All methods failed
      console.error('❌ All insert column methods failed');
      
    } catch (error) {
      console.error('❌ Insert column catastrophic failure:', error);
    }
  };

  // Insert Table (creates formatted table) - BULLETPROOF
  const handleInsertTable = () => {
    console.log('🔵 Insert Table clicked!');
    
    if (!store) {
      console.error('⚠️ Spreadsheet not ready');
      return;
    }

    try {
      const cellInfo = getActiveCell();
      if (!cellInfo) {
        console.warn('⚠️ Please select a cell first');
        return;
      }

      const { sheet, selection } = cellInfo;
      
      // Try to get active range position
      let startRow = 0;
      let startCol = 0;
      
      try {
        const range = sheet.getActiveRange();
        if (range && typeof range.getRow === 'function') {
          startRow = range.getRow();
          startCol = range.getColumn();
        } else if (range && typeof range.getStartRow === 'function') {
          startRow = range.getStartRow();
          startCol = range.getStartColumn();
        } else if (selection) {
          const activeCell = selection.getActiveCell();
          if (activeCell) {
            startRow = activeCell.row;
            startCol = activeCell.column;
          }
        }
      } catch (e) {
        console.log('Using fallback position (0,0)');
      }
      
      console.log(`🔵 Creating table at row ${startRow}, col ${startCol}`);
      
      // Create 5x5 table with header
      const headers = ['Column A', 'Column B', 'Column C', 'Column D', 'Column E'];
      
      let successCount = 0;
      
      // Set headers
      for (let c = 0; c < 5; c++) {
        try {
          const cell = sheet.getRange(startRow, startCol + c, 1, 1);
          cell.setValue(headers[c]);
          
          try {
            cell.setFontWeight('bold');
          } catch (e) {}
          
          try {
            cell.setBackground('#4F46E5');
          } catch (e) {}
          
          try {
            cell.setFontColor('#FFFFFF');
          } catch (e) {}
          
          successCount++;
        } catch (e) {
          console.warn(`Failed to set header at column ${c}:`, e);
        }
      }
      
      // Set sample data
      for (let r = 1; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          try {
            const cell = sheet.getRange(startRow + r, startCol + c, 1, 1);
            cell.setValue(`Data ${r}-${c + 1}`);
            
            if (r % 2 === 0) {
              try {
                cell.setBackground('#F3F4F6');
              } catch (e) {}
            }
            successCount++;
          } catch (e) {
            console.warn(`Failed to set data at row ${r}, col ${c}:`, e);
          }
        }
      }
      
      if (successCount > 0) {
        console.log(`✅ TABLE CREATED at row ${startRow + 1}, col ${String.fromCharCode(65 + startCol)} (${successCount} cells)`);
      } else {
        throw new Error('No cells were set');
      }
      
    } catch (error) {
      console.error('❌ Insert table failed:', error);
    }
  };

  // Insert Chart - BULLETPROOF
  const handleInsertChart = () => {
    console.log('🔵 Insert Chart clicked!');
    console.log('📊 Chart feature coming soon - export to Excel for now');
  };

  // Insert Shape (draws shape using cell backgrounds) - BULLETPROOF
  const handleInsertShape = () => {
    if (!store) return;
    setShowShapePicker(true);
  };

  const getActiveStartCell = () => {
    const cellInfo = getActiveCell();
    if (!cellInfo) return null;
    const { sheet, selection } = cellInfo;
    let startRow = 0;
    let startCol = 0;
    try {
      const range = sheet.getActiveRange();
      if (range && typeof range.getRow === "function") {
        startRow = range.getRow();
        startCol = range.getColumn();
      } else if (range && typeof range.getStartRow === "function") {
        startRow = range.getStartRow();
        startCol = range.getStartColumn();
      } else if (selection) {
        const activeCell = selection.getActiveCell();
        if (activeCell) {
          startRow = activeCell.row;
          startCol = activeCell.column;
        }
      }
    } catch {}
    return { ...cellInfo, startRow, startCol };
  };

  type ShapePreset = {
    id: string;
    config: ShapeConfig;
    w: number;
    h: number;
  };

  const shapePresets: ShapePreset[] = useMemo(() => {
    const toDims = (shape: ShapeConfig) => {
      if (shape.figureSubType === "circle") return { w: 9, h: 9 };
      if (shape.figureSubType === "triangle") return { w: 11, h: 9 };
      if (shape.figureSubType === "diamond") return { w: 11, h: 9 };
      if (shape.figureSubType === "pentagon") return { w: 11, h: 9 };
      if (shape.figureSubType === "hexagon") return { w: 11, h: 9 };
      if (shape.figureSubType === "star") return { w: 11, h: 11 };
      if (shape.figureSubType === "rightArrow" || shape.figureSubType === "leftArrow") return { w: 13, h: 7 };
      if (shape.figureSubType === "speechBubble") return { w: 13, h: 9 };
      if (shape.figureSubType === "line") return { w: 13, h: 7 };
      const isRounded = shape.figureSubType === "rect" && (shape.cornerRadius || 0) > 0;
      return { w: 11, h: isRounded ? 7 : 7 };
    };

    return presentationShapeConfigs.map((config) => {
      const dims = toDims(config);
      return {
        id: `${config.figureSubType}-${config.name}`.toLowerCase().replace(/\s+/g, "-"),
        config,
        w: dims.w,
        h: dims.h,
      };
    });
  }, []);

  const buildMask = (preset: ShapePreset) => {
    const w = Math.max(3, Math.round(preset.w));
    const h = Math.max(3, Math.round(preset.h));
    const mask: boolean[][] = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => false),
    );

    const set = (x: number, y: number, v: boolean) => {
      if (y < 0 || y >= h || x < 0 || x >= w) return;
      mask[y][x] = v;
    };

    const fillBy = (fn: (x: number, y: number) => boolean) => {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          set(x, y, fn(x, y));
        }
      }
    };

    const cx = (w - 1) / 2;
    const cy = (h - 1) / 2;

    const kind = preset.config.figureSubType;

    if (kind === "rect" && (preset.config.cornerRadius || 0) === 0) {
      fillBy(() => true);
      return mask;
    }

    if (kind === "rect" && (preset.config.cornerRadius || 0) > 0) {
      const r = Math.max(1, Math.floor(Math.min(w, h) / 3));
      fillBy((x, y) => {
        const left = x;
        const right = w - 1 - x;
        const top = y;
        const bottom = h - 1 - y;
        const inCorner = (left < r && top < r) || (right < r && top < r) || (left < r && bottom < r) || (right < r && bottom < r);
        if (!inCorner) return true;
        const cornerCx = left < r ? r - 1 : w - r;
        const cornerCy = top < r ? r - 1 : h - r;
        const dx = x - cornerCx;
        const dy = y - cornerCy;
        return dx * dx + dy * dy <= r * r;
      });
      return mask;
    }

    if (kind === "circle") {
      const rx = (w - 1) / 2;
      const ry = (h - 1) / 2;
      fillBy((x, y) => {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        return dx * dx + dy * dy <= 1;
      });
      return mask;
    }

    if (kind === "triangle") {
      fillBy((x, y) => {
        const t = y / (h - 1);
        const half = (w - 1) / 2;
        const span = Math.round(t * half);
        const left = Math.round(cx - span);
        const right = Math.round(cx + span);
        return x >= left && x <= right;
      });
      return mask;
    }

    if (kind === "diamond") {
      const rx = (w - 1) / 2;
      const ry = (h - 1) / 2;
      fillBy((x, y) => Math.abs(x - cx) / rx + Math.abs(y - cy) / ry <= 1);
      return mask;
    }

    if (kind === "hexagon") {
      const inset = Math.max(1, Math.floor(w / 6));
      fillBy((x, y) => {
        const t = Math.abs(y - cy) / cy;
        const sideInset = Math.round(t * inset);
        const left = sideInset;
        const right = w - 1 - sideInset;
        return x >= left && x <= right;
      });
      return mask;
    }

    if (kind === "pentagon") {
      fillBy((x, y) => {
        const topZone = y <= Math.floor(h / 3);
        if (topZone) {
          const t = y / Math.floor(h / 3);
          const half = (w - 1) / 2;
          const span = Math.round((1 - t) * half);
          const left = Math.round(cx - (half - span));
          const right = Math.round(cx + (half - span));
          return x >= left && x <= right;
        }
        return true;
      });
      return mask;
    }

    if (kind === "rightArrow" || kind === "leftArrow") {
      const head = Math.max(3, Math.floor(w / 3));
      const shaftH = Math.max(3, Math.floor(h / 3));
      const shaftTop = Math.floor((h - shaftH) / 2);
      const shaftBottom = shaftTop + shaftH - 1;
      fillBy((x, y) => {
        const inShaft =
          y >= shaftTop && y <= shaftBottom && (kind === "rightArrow" ? x <= w - head : x >= head - 1);
        if (inShaft) return true;
        const rel = Math.abs(y - cy);
        const span = Math.round((cy - rel) * (head - 1) / cy);
        if (kind === "rightArrow") {
          const left = w - head;
          const right = w - 1;
          const tipX = right;
          const minX = tipX - span;
          return x >= Math.max(left, minX) && x <= right;
        }
        const left = 0;
        const right = head - 1;
        const tipX = left;
        const maxX = tipX + span;
        return x >= left && x <= Math.min(right, maxX);
      });
      return mask;
    }

    if (kind === "star") {
      fillBy((x, y) => {
        const dx = x - cx;
        const dy = y - cy;
        const r = Math.sqrt(dx * dx + dy * dy) || 1;
        const angle = Math.atan2(dy, dx);
        const spikes = 5;
        const k = Math.abs(Math.cos((spikes * angle) / 2));
        const maxR = (Math.min(w, h) / 2) * (0.55 + 0.45 * k);
        return r <= maxR;
      });
      return mask;
    }

    if (kind === "line") {
      fillBy((x, y) => {
        const t = x / (w - 1);
        const yLine = (1 - t) * (h - 1);
        return Math.abs(y - yLine) <= 0.8;
      });
      return mask;
    }

    if (kind === "speechBubble") {
      const tailW = Math.max(3, Math.floor(w / 4));
      const tailH = Math.max(2, Math.floor(h / 4));
      const bodyH = h - tailH;
      fillBy((x, y) => {
        if (y < bodyH) return true;
        const ty = y - bodyH;
        const left = Math.floor(w / 5);
        const right = left + tailW - 1;
        const span = Math.max(0, tailW - 1 - Math.round((ty / (tailH - 1)) * (tailW - 1)));
        const l = Math.round((left + right) / 2 - span / 2);
        const r = l + span;
        return x >= l && x <= r;
      });
      return mask;
    }

    fillBy(() => true);
    return mask;
  };

  const computeBorder = (mask: boolean[][]) => {
    const h = mask.length;
    const w = mask[0]?.length || 0;
    const border: boolean[][] = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => false),
    );
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!mask[y][x]) continue;
        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];
        const isEdge = neighbors.some(([nx, ny]) => ny < 0 || ny >= h || nx < 0 || nx >= w || !mask[ny][nx]);
        border[y][x] = isEdge;
      }
    }
    return border;
  };

  const insertShapePreset = (preset: ShapePreset) => {
    if (!store) return;
    const cellInfo = getActiveStartCell();
    if (!cellInfo) return;
    const { sheet, startRow, startCol } = cellInfo;

    const strokeColor = "#111827";
    const fillColor = "#DBEAFE";
    const mask = buildMask(preset);
    const border = computeBorder(mask);

    for (let y = 0; y < mask.length; y++) {
      for (let x = 0; x < mask[0].length; x++) {
        if (!mask[y][x]) continue;
        try {
          const cell = sheet.getRange(startRow + y, startCol + x, 1, 1);
          const color = border[y][x] ? strokeColor : fillColor;
          cell.setBackground(color);
          cell.setValue(" ");
        } catch {}
      }
    }

    setShowShapePicker(false);
  };

  // Insert Icon (inserts emoji/symbol) - BULLETPROOF
  const handleInsertIcon = () => {
    console.log('🔵 Insert Icon clicked!');
    
    if (!store) {
      console.error('⚠️ Spreadsheet not ready');
      return;
    }

    setShowIconPicker(true);
  };

  const insertIcon = (icon: string) => {
    console.log('🔵 Insert Icon:', icon);
    
    if (!store) {
      console.error('⚠️ Spreadsheet not ready');
      setShowIconPicker(false);
      return;
    }
    
    try {
      const cellInfo = getActiveCell();
      if (!cellInfo) {
        console.warn('⚠️ Please select a cell first');
        setShowIconPicker(false);
        return;
      }
      
      const { sheet, selection } = cellInfo;
      
      // Try to get active range position
      let row = 0;
      let col = 0;
      
      try {
        const range = sheet.getActiveRange();
        if (range && typeof range.getRow === 'function') {
          row = range.getRow();
          col = range.getColumn();
        } else if (range && typeof range.getStartRow === 'function') {
          row = range.getStartRow();
          col = range.getStartColumn();
        } else if (selection) {
          // Use selection API
          const activeCell = selection.getActiveCell();
          if (activeCell) {
            row = activeCell.row;
            col = activeCell.column;
          }
        }
      } catch (e) {
        console.log('Using fallback position (0,0)');
      }
      
      const cell = sheet.getRange(row, col, 1, 1);
      cell.setValue(icon);
      
      try {
        cell.setFontSize(20);
      } catch (e) {
        console.log('Font size not supported');
      }
      
      console.log('✅ ICON INSERTED:', icon);
      setShowIconPicker(false);
    } catch (error) {
      console.error('❌ Insert icon failed:', error);
      setShowIconPicker(false);
    }
  };

  // Insert Link
  const handleInsertLink = () => {
    setShowLinkDialog(true);
  };

  const submitLink = () => {
    console.log('🔵 Submit Link clicked!');
    
    if (!linkUrl.trim()) {
      console.warn('⚠️ No URL entered');
      return;
    }

    if (!store) {
      console.error('⚠️ Spreadsheet not ready');
      setShowLinkDialog(false);
      return;
    }

    try {
      const cellInfo = getActiveCell();
      if (!cellInfo) {
        console.warn('⚠️ Please select a cell first');
        setShowLinkDialog(false);
        return;
      }

      const { sheet, selection } = cellInfo;
      
      // Try to get active range position
      let row = 0;
      let col = 0;
      
      try {
        const range = sheet.getActiveRange();
        if (range && typeof range.getRow === 'function') {
          row = range.getRow();
          col = range.getColumn();
        } else if (range && typeof range.getStartRow === 'function') {
          row = range.getStartRow();
          col = range.getStartColumn();
        } else if (selection) {
          // Use selection API
          const activeCell = selection.getActiveCell();
          if (activeCell) {
            row = activeCell.row;
            col = activeCell.column;
          }
        }
      } catch (e) {
        console.log('Using fallback position (0,0)');
      }
      
      const cell = sheet.getRange(row, col, 1, 1);
      const displayText = linkText.trim() || linkUrl;
      cell.setValue(displayText);
      
      // Try to set link formatting
      try {
        cell.setFontColor('#3B82F6');
      } catch (e) {
        console.log('Font color not supported');
      }
      
      try {
        cell.setFontLine('underline');
      } catch (e) {
        console.log('Font line not supported');
      }
      
      // Store URL in note/comment if available
      try {
        cell.setNote(`Link: ${linkUrl}`);
      } catch (e) {
        console.log('Note API not available');
      }
      
      console.log('✅ LINK INSERTED:', displayText);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    } catch (error) {
      console.error('❌ Insert link failed:', error);
      setShowLinkDialog(false);
    }
  };

  // Insert Symbol
  const handleInsertSymbol = () => {
    setShowSymbolPicker(true);
  };

  const insertSymbol = (symbol: string) => {
    console.log('🔵 Insert Symbol:', symbol);
    
    if (!store) {
      console.error('⚠️ Spreadsheet not ready');
      setShowSymbolPicker(false);
      return;
    }
    
    try {
      const cellInfo = getActiveCell();
      if (!cellInfo) {
        console.warn('⚠️ Please select a cell first');
        setShowSymbolPicker(false);
        return;
      }
      
      const { sheet, selection } = cellInfo;
      
      // Try to get active range position
      let row = 0;
      let col = 0;
      
      try {
        const range = sheet.getActiveRange();
        if (range && typeof range.getRow === 'function') {
          row = range.getRow();
          col = range.getColumn();
        } else if (range && typeof range.getStartRow === 'function') {
          row = range.getStartRow();
          col = range.getStartColumn();
        } else if (selection) {
          // Use selection API
          const activeCell = selection.getActiveCell();
          if (activeCell) {
            row = activeCell.row;
            col = activeCell.column;
          }
        }
      } catch (e) {
        console.log('Using fallback position (0,0)');
      }
      
      const cell = sheet.getRange(row, col, 1, 1);
      const currentValue = cell.getValue() || '';
      cell.setValue(currentValue + symbol);
      console.log('✅ SYMBOL INSERTED:', symbol);
      setShowSymbolPicker(false);
    } catch (error) {
      console.error('❌ Insert symbol failed:', error);
      setShowSymbolPicker(false);
    }
  };

  // Common symbols
  const symbols = [
    '©', '®', '™', '€', '£', '¥', '¢', '°', '±', '×', '÷', '≠', '≈', '≤', '≥',
    '∞', '∑', '√', '∫', '∂', 'π', 'α', 'β', 'γ', 'δ', 'Ω', '→', '←', '↑', '↓',
    '•', '◦', '▪', '▫', '★', '☆', '♠', '♣', '♥', '♦', '¶', '§', '†', '‡', '‰'
  ];

  if (!store) return null;

  return (
    <>
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Tables */}
      <div className="flex flex-col items-center min-w-[150px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Tables
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Table */}
          <button
            onClick={handleInsertTable}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
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
                d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 7.5H17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 12.5H17.5"
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
              Table
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Rows & Columns */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Rows & Columns
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Insert Row */}
          <button
            onClick={handleInsertRow}
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M4.16797 10H15.8346"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 4.16406V15.8307"
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
              Insert Row
            </span>
          </button>

          {/* Insert Column */}
          <button
            onClick={handleInsertColumn}
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M4.16797 10H15.8346"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 4.16406V15.8307"
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
              Insert Column
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Charts */}
      {/* <div className="flex flex-col items-center min-w-[150px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Charts
        </span>

        <div className="flex flex-row items-center gap-[34px]">    
          <button
            onClick={handleInsertChart}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M2.5 2.5V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 14.1667V7.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.832 14.1641V4.16406"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 14.1641V11.6641"
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
              Chart
            </span>
          </button>
        </div>
      </div> */}

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Illustrations */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Illustrations
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Shapes */}
          <button
            onClick={handleInsertShape}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
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
              Shapes
            </span>
          </button>

          {/* Icons */}
          <button
            onClick={handleInsertIcon}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_10437_229343)">
                <path
                  d="M10.0013 18.3307C14.6037 18.3307 18.3346 14.5998 18.3346 9.9974C18.3346 5.39502 14.6037 1.66406 10.0013 1.66406C5.39893 1.66406 1.66797 5.39502 1.66797 9.9974C1.66797 14.5998 5.39893 18.3307 10.0013 18.3307Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.66797 11.6641C6.66797 11.6641 7.91797 13.3307 10.0013 13.3307C12.0846 13.3307 13.3346 11.6641 13.3346 11.6641"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.5 7.5H7.50833"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.5 7.5H12.5083"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10437_229343">
                  <rect width="20" height="20" fill="white" />
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
              Icons
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Links */}
      <div className="flex flex-col items-center min-w-[150px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Links
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Link */}
          <button
            onClick={handleInsertLink}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M7.5013 14.1693H5.83464C4.72957 14.1693 3.66976 13.7303 2.88836 12.9489C2.10696 12.1675 1.66797 11.1077 1.66797 10.0026C1.66797 8.89754 2.10696 7.83773 2.88836 7.05633C3.66976 6.27492 4.72957 5.83594 5.83464 5.83594H7.5013"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.5 5.83594H14.1667C15.2717 5.83594 16.3315 6.27492 17.1129 7.05633C17.8943 7.83773 18.3333 8.89754 18.3333 10.0026C18.3333 11.1077 17.8943 12.1675 17.1129 12.9489C16.3315 13.7303 15.2717 14.1693 14.1667 14.1693H12.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 10H13.3346"
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
              Link
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Symbols */}
      <div className="flex flex-col items-center min-w-[150px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Symbols
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Symbol */}
          <button
            onClick={handleInsertSymbol}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 3.33594V16.6693"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.33203 5.83594V4.16927C3.33203 3.94826 3.41983 3.7363 3.57611 3.58002C3.73239 3.42374 3.94435 3.33594 4.16536 3.33594H15.832C16.053 3.33594 16.265 3.42374 16.4213 3.58002C16.5776 3.7363 16.6654 3.94826 16.6654 4.16927V5.83594"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 16.6641H12.5"
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
              Symbol
            </span>
          </button>
        </div>
      </div>
    </div>

    {/* Link Dialog Modal */}
    {showLinkDialog && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkDialog(false)}>
        <div className="bg-white rounded-lg p-6 w-96 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Text (optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={submitLink}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Insert
            </button>
            <button
              onClick={() => {
                setShowLinkDialog(false);
                setLinkUrl('');
                setLinkText('');
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Icon Picker Modal */}
    {showIconPicker && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowIconPicker(false)}>
        <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Choose an Icon</h3>
          <div className="grid grid-cols-5 gap-3">
            {['😊', '⭐', '✓', '✗', '❤️', '🔥', '💡', '📌', '⚠️', '✨', '👍', '👎', '✅', '❌', '💯'].map((icon, idx) => (
              <button
                key={idx}
                onClick={() => insertIcon(icon)}
                className="w-full aspect-square flex items-center justify-center text-3xl hover:bg-gray-100 rounded-lg transition border-2 border-transparent hover:border-blue-500"
              >
                {icon}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowIconPicker(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Shape Picker Modal */}
    {showShapePicker && (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowShapePicker(false)}
      >
        <div
          className="bg-white rounded-lg p-6 w-[720px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-80px)] shadow-xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Shapes</h3>
            <button
              type="button"
              onClick={() => setShowShapePicker(false)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {shapePresets.map((preset) => {
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => insertShapePreset(preset)}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition flex flex-col items-center gap-2"
                >
                  <div className="text-black">{preset.config.icon}</div>
                  <div className="text-[11px] text-gray-700 text-center leading-4">
                    {preset.config.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )}

    {/* Symbol Picker Modal */}
    {showSymbolPicker && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSymbolPicker(false)}>
        <div className="bg-white rounded-lg p-6 w-[500px] max-h-[600px] shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Insert Symbol</h3>
          <div className="grid grid-cols-10 gap-2">
            {symbols.map((symbol, index) => (
              <button
                key={index}
                onClick={() => insertSymbol(symbol)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-500 transition text-lg"
                title={symbol}
              >
                {symbol}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSymbolPicker(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    )}
    </>
  );
}
