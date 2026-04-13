import React, { useRef, useState } from "react";
import Head from "next/head";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import TopHeader from "../components/spreadsheet/TopHeader";
// import FormulaBar from '../components/spreadsheet/FormulaBar';
import UniverSheet from "../components/spreadsheet/UniverSheet";
import RightSidebar from "../components/spreadsheet/RightSidebar";
import BottomToolbar from "../components/spreadsheet/BottomToolbar";
import {
  FloatingSheetTab,
  FloatingFAB,
} from "../components/spreadsheet/FloatingElements";
import dynamic from "next/dynamic";

import spreadsheetData from "../assets/dummy/spreadsheet-data.json";
import useGenerationLoader from "../hooks/useGenerationLoader";
import GenerationLoaderUI from "../components/shared/GenerationLoaderUI";
import EditorBottomToolbar from "../components/editor/EditorBottomToolbar";

const CollaborativeUniverSheet = dynamic(
  () => import("../components/spreadsheet/CollaborativeUniverSheet"),
  { ssr: false },
);

export default function SpreadsheetEditor() {
  const univerRef = useRef(null);
  const [univerAPI, setUniverAPI] = useState(null);
  const { loading, error, status, content, id } = useGenerationLoader();

  const data = content || spreadsheetData;

  // Ensure generationId is string
  const actualGenerationId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined;

  const useCollaboration = !!actualGenerationId; // Enable collaboration if we have a generation ID

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
      let snapshot = workbook.save
        ? workbook.save()
        : workbook.getSnapshot
          ? workbook.getSnapshot()
          : null;

      if (!snapshot) {
        console.warn(
          "Could not retrieve snapshot directly, trying to use internal data",
        );
        // Fallback: if we can't get snapshot, maybe we can access data directly
        snapshot = workbook._snapshot || workbook.snapshot;
      }

      if (!snapshot) {
        alert("Failed to retrieve spreadsheet data.");
        return;
      }

      // Create ExcelJS workbook
      const excelWorkbook = new ExcelJS.Workbook();
      excelWorkbook.creator = "Manifestr AI";
      excelWorkbook.lastModifiedBy = "Manifestr AI";
      excelWorkbook.created = new Date();
      excelWorkbook.modified = new Date();

      const sheets = snapshot.sheets || {};
      const sheetOrder = snapshot.sheetOrder || Object.keys(sheets);
      const globalStyles = snapshot.styles || {};

      sheetOrder.forEach((sheetId) => {
        const sheet = sheets[sheetId];
        if (!sheet) return;

        const sheetName = sheet.name || "Sheet";
        const worksheet = excelWorkbook.addWorksheet(sheetName);

        const cellData = sheet.cellData || {};

        // Find dimensions
        let maxRow = 0;
        let maxCol = 0;

        // cellData is usually an object with row keys
        Object.keys(cellData).forEach((rKey) => {
          const r = parseInt(rKey);
          if (r > maxRow) maxRow = r;

          const rowData = cellData[rKey];
          Object.keys(rowData).forEach((cKey) => {
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
              excelCell.value =
                !isNaN(num) && typeof cell.v !== "string" ? num : cell.v;
            } else if (cell.p) {
              // Rich text paragraph
              excelCell.value = cell.p.body?.dataStream || "";
            }

            // 2. Styles
            // 's' can be a style ID (string) or an inline style object
            let styleObj = null;
            if (typeof cell.s === "string") {
              styleObj = globalStyles[cell.s];
            } else if (typeof cell.s === "object") {
              styleObj = cell.s;
            }

            if (styleObj) {
              // Font
              if (
                styleObj.ff ||
                styleObj.fs ||
                styleObj.bl ||
                styleObj.it ||
                styleObj.cl
              ) {
                excelCell.font = {
                  name: styleObj.ff || "Calibri",
                  size: styleObj.fs || 11,
                  bold: !!styleObj.bl,
                  italic: !!styleObj.it,
                  color: styleObj.cl?.rgb
                    ? { argb: "FF" + styleObj.cl.rgb.replace("#", "") }
                    : undefined,
                };
              }

              // Background / Fill
              if (styleObj.bg && styleObj.bg.rgb) {
                excelCell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FF" + styleObj.bg.rgb.replace("#", "") },
                };
              }

              // Alignment
              // Univer: ht (1: left, 2: center, 3: right), vt (1: top, 2: middle, 3: bottom)
              if (styleObj.ht || styleObj.vt) {
                const align: Partial<ExcelJS.Alignment> = {};
                if (styleObj.ht === 1) align.horizontal = "left";
                if (styleObj.ht === 2) align.horizontal = "center";
                if (styleObj.ht === 3) align.horizontal = "right";

                if (styleObj.vt === 1) align.vertical = "top";
                if (styleObj.vt === 2) align.vertical = "middle";
                if (styleObj.vt === 3) align.vertical = "bottom";

                if (styleObj.tr) align.textRotation = styleObj.tr;
                if (styleObj.tb) align.wrapText = styleObj.tb === 1; // 1 = wrap

                excelCell.alignment = align;
              }

              // Borders
              if (styleObj.bd) {
                const borders: Partial<ExcelJS.Borders> = {};
                // Univer bd format: { t: { s: 1, cl: { rgb: ... } }, ... } (top, bottom, left, right)
                // s: style (0: none, 1: thin, etc.)
                const mapBorder = (
                  bdSide: any,
                ): Partial<ExcelJS.Border> | undefined => {
                  if (!bdSide) return undefined;
                  return {
                    style: "thin" as any,
                    color: bdSide.cl?.rgb
                      ? { argb: "FF" + bdSide.cl.rgb.replace("#", "") }
                      : undefined,
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
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${snapshot.name || "Manifestr-Spreadsheet"}.xlsx`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export to Excel. Check console for details.");
    }
  };

  const [activeTool, setActiveTool] = useState<
    "ai" | "format" | "insert" | "formulas" | "layout" | "data" | "style"
  >("insert");

  return (
    <GenerationLoaderUI loading={loading} status={status} error={error}>
      <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
        <Head>
          <title>Spreadsheet Editor | Manifestr</title>
        </Head>

        {/* Top Section */}
        <div className="flex-none z-30">
          <TopHeader
            editorType="spreadsheet"
            documentId={actualGenerationId}
            documentTitle={content?.title || "Untitled spreadsheet"}
            enableCollaboration={useCollaboration}
          />
          {/* Using Univer's native formula bar instead */}
        </div>

        {/* ACTION BAR */}
        <div className="h-[60px] flex items-center gap-3 px-6 border-b border-gray-200 bg-white">
          <button
            className={`
            px-4 py-2 flex items-center gap-2 transition 
            font-medium rounded-[10px] 
            bg-gray-100 text-[#0A0A0A]
            hover:bg-gray-200 hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-blue-400
            active:bg-gray-300
          `}
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "20px",
              letterSpacing: "-0.15px",
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M10.0013 1.33594H4.0013C3.64768 1.33594 3.30854 1.47641 3.05849 1.72646C2.80844 1.97651 2.66797 2.31565 2.66797 2.66927V13.3359C2.66797 13.6896 2.80844 14.0287 3.05849 14.2787C3.30854 14.5288 3.64768 14.6693 4.0013 14.6693H12.0013C12.3549 14.6693 12.6941 14.5288 12.9441 14.2787C13.1942 14.0287 13.3346 13.6896 13.3346 13.3359V4.66927L10.0013 1.33594Z"
                stroke="black"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.33203 1.33594V4.0026C9.33203 4.35623 9.47251 4.69536 9.72256 4.94541C9.9726 5.19546 10.3117 5.33594 10.6654 5.33594H13.332"
                stroke="black"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66536 6H5.33203"
                stroke="black"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6654 8.66406H5.33203"
                stroke="black"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6654 11.3359H5.33203"
                stroke="black"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Insert From the Vault
          </button>

          <div
            style={{
              width: "1px",
              height: "24px",
              flexShrink: 0,
              background: "#D1D5DC",
              marginLeft: "8px",
              marginRight: "8px",
            }}
          />

          <button
            className="px-4 py-2 flex items-center gap-2 rounded-[10px] bg-[#F3F4F6] text-[#0A0A0A] font-medium transition hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-gray-300"
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "20px",
              letterSpacing: "-0.15px",
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clipPath="url(#clip0_10389_80842)">
                <path
                  d="M7.34106 1.87239C7.36962 1.71946 7.45077 1.58133 7.57045 1.48193C7.69014 1.38254 7.84081 1.32812 7.99639 1.32812C8.15196 1.32812 8.30264 1.38254 8.42232 1.48193C8.54201 1.58133 8.62316 1.71946 8.65172 1.87239L9.35239 5.57772C9.40215 5.84115 9.53017 6.08347 9.71974 6.27304C9.90931 6.4626 10.1516 6.59062 10.4151 6.64039L14.1204 7.34106C14.2733 7.36962 14.4114 7.45077 14.5108 7.57045C14.6102 7.69014 14.6647 7.84081 14.6647 7.99639C14.6647 8.15196 14.6102 8.30264 14.5108 8.42232C14.4114 8.54201 14.2733 8.62316 14.1204 8.65172L10.4151 9.35239C10.1516 9.40215 9.90931 9.53017 9.71974 9.71974C9.53017 9.90931 9.40215 10.1516 9.35239 10.4151L8.65172 14.1204C8.62316 14.2733 8.54201 14.4114 8.42232 14.5108C8.30264 14.6102 8.15196 14.6647 7.99639 14.6647C7.84081 14.6647 7.69014 14.6102 7.57045 14.5108C7.45077 14.4114 7.36962 14.2733 7.34106 14.1204L6.64039 10.4151C6.59062 10.1516 6.4626 9.90931 6.27304 9.71974C6.08347 9.53017 5.84115 9.40215 5.57772 9.35239L1.87239 8.65172C1.71946 8.62316 1.58133 8.54201 1.48193 8.42232C1.38254 8.30264 1.32812 8.15196 1.32812 7.99639C1.32812 7.84081 1.38254 7.69014 1.48193 7.57045C1.58133 7.45077 1.71946 7.36962 1.87239 7.34106L5.57772 6.64039C5.84115 6.59062 6.08347 6.4626 6.27304 6.27304C6.4626 6.08347 6.59062 5.84115 6.64039 5.57772L7.34106 1.87239Z"
                  stroke="#0A0A0A"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3359 1.33594V4.0026"
                  stroke="#0A0A0A"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.6667 2.66406H12"
                  stroke="#0A0A0A"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66927 14.6667C3.40565 14.6667 4.0026 14.0697 4.0026 13.3333C4.0026 12.597 3.40565 12 2.66927 12C1.93289 12 1.33594 12.597 1.33594 13.3333C1.33594 14.0697 1.93289 14.6667 2.66927 14.6667Z"
                  stroke="#0A0A0A"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10389_80842">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Insert Theme
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex relative overflow-hidden bg-gray-100 ">
          {/* Grid Container (Card) */}
          <div className="flex-grow bg-white rounded-lg shadow-sm overflow-hidden relative z-10">
            {useCollaboration && actualGenerationId ? (
              <CollaborativeUniverSheet
                ref={univerRef}
                onAPIReady={setUniverAPI}
                data={data}
                generationId={actualGenerationId}
              />
            ) : (
              <UniverSheet
                ref={univerRef}
                onAPIReady={setUniverAPI}
                data={data}
              />
            )}

            {/* Download Button - Positioned like Presentation Editor */}
            {/* <div className="absolute top-4 right-20 z-10">
              <button
                onClick={handleDownload}
                className="bg-gray-900 text-white border-none hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download XLSX
              </button>
            </div> */}
          </div>

          {/* Right Sidebar (Floating over grid on the right) */}
          {/* <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
                        <div className="pointer-events-auto">
                            <RightSidebar />
                        </div>
                    </div> */}

          {/* Floating Elements */}
          <FloatingSheetTab />
          <FloatingFAB />
        </div>

        {/* BOTTOM TOOLBAR */}
        {/* <ToolPanel activeTool={activeTool} store={store} /> */}

        <EditorBottomToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          editorType="spreadsheet"
        />
      </div>
    </GenerationLoaderUI>
  );
}
