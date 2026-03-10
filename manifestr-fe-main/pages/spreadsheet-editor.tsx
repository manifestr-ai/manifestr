import React, { useRef, useState } from 'react';
import Head from 'next/head';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import TopHeader from '../components/spreadsheet/TopHeader';
// import FormulaBar from '../components/spreadsheet/FormulaBar';
import UniverSheet from '../components/spreadsheet/UniverSheet';
import RightSidebar from '../components/spreadsheet/RightSidebar';
import BottomToolbar from '../components/spreadsheet/BottomToolbar';
import { FloatingSheetTab, FloatingFAB } from '../components/spreadsheet/FloatingElements';

import spreadsheetData from '../assets/dummy/spreadsheet-data.json';
import useGenerationLoader from '../hooks/useGenerationLoader';
import GenerationLoaderUI from '../components/shared/GenerationLoaderUI';

export default function SpreadsheetEditor() {
    const univerRef = useRef(null);
    const [univerAPI, setUniverAPI] = useState(null);
    const { loading, error, status, content } = useGenerationLoader();

    const data = content || spreadsheetData;

    const handleDownload = async () => {
        if (!univerAPI) {
            alert("Spreadsheet is not ready yet.");
            return;
        }

        try {
            const workbook = univerAPI.getActiveWorkbook();
            if (!workbook) {
                alert("No active workbook found.");
                return;
            }

            // Get snapshot data
            // Try different methods as API might vary
            let snapshot = workbook.save ? workbook.save() : (workbook.getSnapshot ? workbook.getSnapshot() : null);
            
            if (!snapshot) {
                console.warn("Could not retrieve snapshot directly, trying to use internal data");
                // Fallback: if we can't get snapshot, maybe we can access data directly
                snapshot = workbook._snapshot || workbook.snapshot;
            }

            if (!snapshot) {
                alert("Failed to retrieve spreadsheet data.");
                return;
            }

            // Create ExcelJS workbook
            const excelWorkbook = new ExcelJS.Workbook();
            excelWorkbook.creator = 'Manifestr AI';
            excelWorkbook.lastModifiedBy = 'Manifestr AI';
            excelWorkbook.created = new Date();
            excelWorkbook.modified = new Date();

            const sheets = snapshot.sheets || {};
            const sheetOrder = snapshot.sheetOrder || Object.keys(sheets);
            const globalStyles = snapshot.styles || {};

            sheetOrder.forEach(sheetId => {
                const sheet = sheets[sheetId];
                if (!sheet) return;

                const sheetName = sheet.name || "Sheet";
                const worksheet = excelWorkbook.addWorksheet(sheetName);
                
                const cellData = sheet.cellData || {};

                // Find dimensions
                let maxRow = 0;
                let maxCol = 0;

                // cellData is usually an object with row keys
                Object.keys(cellData).forEach(rKey => {
                    const r = parseInt(rKey);
                    if (r > maxRow) maxRow = r;
                    
                    const rowData = cellData[rKey];
                    Object.keys(rowData).forEach(cKey => {
                        const c = parseInt(cKey);
                        if (c > maxCol) maxCol = c;
                    });
                });

                // Populate cells
                for (let r = 0; r <= maxRow; r++) {
                    for (let c = 0; c <= maxCol; c++) {
                        const cell = cellData[r]?.[c];
                        if (!cell) continue;

                        // ExcelJS is 1-based
                        const excelCell = worksheet.getCell(r + 1, c + 1);

                        // 1. Value
                        if (cell.v !== undefined && cell.v !== null) {
                            // Check if numeric
                            const num = parseFloat(cell.v);
                            excelCell.value = !isNaN(num) && typeof cell.v !== 'string' ? num : cell.v;
                        } else if (cell.p) {
                            // Rich text paragraph
                            excelCell.value = cell.p.body?.dataStream || "";
                        }

                        // 2. Styles
                        // 's' can be a style ID (string) or an inline style object
                        let styleObj = null;
                        if (typeof cell.s === 'string') {
                            styleObj = globalStyles[cell.s];
                        } else if (typeof cell.s === 'object') {
                            styleObj = cell.s;
                        }

                        if (styleObj) {
                            // Font
                            if (styleObj.ff || styleObj.fs || styleObj.bl || styleObj.it || styleObj.cl) {
                                excelCell.font = {
                                    name: styleObj.ff || 'Calibri',
                                    size: styleObj.fs || 11,
                                    bold: !!styleObj.bl,
                                    italic: !!styleObj.it,
                                    color: styleObj.cl?.rgb ? { argb: 'FF' + styleObj.cl.rgb.replace('#', '') } : undefined
                                };
                            }

                            // Background / Fill
                            if (styleObj.bg && styleObj.bg.rgb) {
                                excelCell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'FF' + styleObj.bg.rgb.replace('#', '') }
                                };
                            }

                            // Alignment
                            // Univer: ht (1: left, 2: center, 3: right), vt (1: top, 2: middle, 3: bottom)
                            if (styleObj.ht || styleObj.vt) {
                                const align: Partial<ExcelJS.Alignment> = {};
                                if (styleObj.ht === 1) align.horizontal = 'left';
                                if (styleObj.ht === 2) align.horizontal = 'center';
                                if (styleObj.ht === 3) align.horizontal = 'right';
                                
                                if (styleObj.vt === 1) align.vertical = 'top';
                                if (styleObj.vt === 2) align.vertical = 'middle';
                                if (styleObj.vt === 3) align.vertical = 'bottom';

                                if (styleObj.tr) align.textRotation = styleObj.tr; 
                                if (styleObj.tb) align.wrapText = styleObj.tb === 1; // 1 = wrap

                                excelCell.alignment = align;
                            }

                            // Borders
                            if (styleObj.bd) {
                                const borders: Partial<ExcelJS.Borders> = {};
                                // Univer bd format: { t: { s: 1, cl: { rgb: ... } }, ... } (top, bottom, left, right)
                                // s: style (0: none, 1: thin, etc.)
                                const mapBorder = (bdSide) => {
                                    if (!bdSide) return undefined;
                                    return {
                                        style: 'thin', // Simplify to thin for now unless we map style codes
                                        color: bdSide.cl?.rgb ? { argb: 'FF' + bdSide.cl.rgb.replace('#', '') } : undefined
                                    };
                                };

                                if (styleObj.bd.t) borders.top = mapBorder(styleObj.bd.t);
                                if (styleObj.bd.b) borders.bottom = mapBorder(styleObj.bd.b);
                                if (styleObj.bd.l) borders.left = mapBorder(styleObj.bd.l);
                                if (styleObj.bd.r) borders.right = mapBorder(styleObj.bd.r);
                                
                                excelCell.border = borders;
                            }
                        }
                    }
                }
            });

            // Write and save
            const buffer = await excelWorkbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${snapshot.name || "Manifestr-Spreadsheet"}.xlsx`);

        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export to Excel. Check console for details.");
        }
    };

    return (
        <GenerationLoaderUI loading={loading} status={status} error={error}>
            <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
                <Head>
                    <title>Spreadsheet Editor | Manifestr</title>
                </Head>

                {/* Top Section */}
                <div className="flex-none z-30">
                    <TopHeader onDownload={handleDownload} />
                    {/* Using Univer's native formula bar instead */}
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex relative overflow-hidden bg-gray-100 p-8">
                    {/* Grid Container (Card) */}
                    <div className="flex-grow bg-white rounded-lg shadow-sm overflow-hidden relative z-10">
                        <UniverSheet ref={univerRef} onAPIReady={setUniverAPI} data={data} />
                    </div>

                    {/* Right Sidebar (Floating over grid on the right) */}
                    <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
                        <div className="pointer-events-auto">
                            <RightSidebar />
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <FloatingSheetTab />
                    <FloatingFAB />
                </div>

                {/* Bottom Section */}
                <div className="flex-none z-30">
                    <BottomToolbar />
                </div>
            </div>
        </GenerationLoaderUI>
    );
}
