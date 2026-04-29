import ShapesPanel from "../comman-panel/ShapesPanel";
import { Popover, Position } from "@blueprintjs/core";
import { useMemo, useState } from "react";
import {
  buildChartSvg,
  createDefaultChartSpec,
  makeSvgDataUrl,
  serializeChartSpecToName,
  type PresentationChartType,
} from "./chartSvg";

interface InsertPanelProps {
  store: any;
}

export default function InsertPanel({ store }: InsertPanelProps) {
  if (!store) return null;

  const MAX_TABLE_PICKER_COLS = 10;
  const MAX_TABLE_PICKER_ROWS = 8;

  const tableDesigns = useMemo(
    () =>
      [
        { id: "plain", label: "Plain", variant: "plain" as const },
        { id: "header", label: "Header", variant: "header" as const },
        { id: "striped", label: "Banded", variant: "striped" as const },
        { id: "boxed", label: "Boxed", variant: "boxed" as const },
        { id: "dark-header", label: "Dark header", variant: "dark-header" as const },
        { id: "minimal", label: "Minimal", variant: "minimal" as const },
      ] as const,
    [],
  );

  const [tablePicker, setTablePicker] = useState<{
    hoverRows: number;
    hoverCols: number;
    selectedVariant: (typeof tableDesigns)[number]["variant"];
  }>({
    hoverRows: 3,
    hoverCols: 3,
    selectedVariant: "header",
  });

  const insertTable = (
    rows: number,
    cols: number,
    variant:
      | "plain"
      | "header"
      | "striped"
      | "boxed"
      | "dark-header"
      | "minimal" = "plain",
  ) => {
    const page = store.activePage;
    if (!page) return;

    const maxTableWidth = Math.min(store.width * 0.75, 640);
    const maxTableHeight = Math.min(store.height * 0.6, 380);
    const cellWidth = Math.max(70, Math.floor(maxTableWidth / cols));
    const cellHeight = Math.max(36, Math.floor(maxTableHeight / rows));
    const tableWidth = cols * cellWidth;
    const tableHeight = rows * cellHeight;
    const startX = Math.round((store.width - tableWidth) / 2);
    const startY = Math.round((store.height - tableHeight) / 2);

    const createdElements: any[] = [];
    const stylesByVariant = {
      plain: {
        strokeColor: "#C4CAD6",
        outerStrokeColor: "#8A94A6",
        outerStrokeWidth: 1.5,
        innerStrokeWidth: 1.5,
        headerFill: "#E7EEF9",
        headerText: "#111827",
        stripedFill: "#F8FAFC",
        cellText: "#111827",
      },
      header: {
        strokeColor: "#C4CAD6",
        outerStrokeColor: "#8A94A6",
        outerStrokeWidth: 1.5,
        innerStrokeWidth: 1.5,
        headerFill: "#E7EEF9",
        headerText: "#111827",
        stripedFill: "#F8FAFC",
        cellText: "#111827",
      },
      striped: {
        strokeColor: "#C4CAD6",
        outerStrokeColor: "#8A94A6",
        outerStrokeWidth: 1.5,
        innerStrokeWidth: 1.5,
        headerFill: "#E7EEF9",
        headerText: "#111827",
        stripedFill: "#F3F6FB",
        cellText: "#111827",
      },
      boxed: {
        strokeColor: "#B9C2D3",
        outerStrokeColor: "#475569",
        outerStrokeWidth: 2.5,
        innerStrokeWidth: 1.5,
        headerFill: "#F1F5F9",
        headerText: "#0F172A",
        stripedFill: "#F8FAFC",
        cellText: "#0F172A",
      },
      "dark-header": {
        strokeColor: "#D1D5DB",
        outerStrokeColor: "#111827",
        outerStrokeWidth: 1.5,
        innerStrokeWidth: 1.5,
        headerFill: "#111827",
        headerText: "#FFFFFF",
        stripedFill: "#F8FAFC",
        cellText: "#111827",
      },
      minimal: {
        strokeColor: "#E5E7EB",
        outerStrokeColor: "#CBD5E1",
        outerStrokeWidth: 1,
        innerStrokeWidth: 1,
        headerFill: "#FFFFFF",
        headerText: "#111827",
        stripedFill: "#FFFFFF",
        cellText: "#111827",
      },
    } as const;

    const style = stylesByVariant[variant] ?? stylesByVariant.plain;

    // Outer border/background
    const tableFrame = page.addElement({
      type: "figure",
      subType: "rect",
      x: startX,
      y: startY,
      width: tableWidth,
      height: tableHeight,
      fill: "#FFFFFF",
      stroke: style.outerStrokeColor,
      strokeWidth: Math.max(1, Math.round(style.outerStrokeWidth)),
      selectable: true,
      draggable: true,
      resizable: true,
      removable: true,
      visible: true,
      opacity: 1,
    });
    createdElements.push(tableFrame);

    // Draw real cell rectangles so borders are always visible
    const cellIds: string[] = [];
    const textIds: string[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isHeader =
          (variant === "header" || variant === "dark-header") && r === 0;
        const isStripedRow = variant === "striped" && r % 2 === 1;
        const fill = isHeader
          ? style.headerFill
          : isStripedRow
            ? style.stripedFill
            : "#FFFFFF";

        const cell = page.addElement({
          type: "figure",
          subType: "rect",
          x: startX + c * cellWidth,
          y: startY + r * cellHeight,
          width: cellWidth,
          height: cellHeight,
          fill,
          stroke: style.strokeColor,
          strokeWidth: Math.max(1, Math.round(style.innerStrokeWidth)),
          selectable: true,
          draggable: true,
          resizable: true,
          contentEditable: false,
          styleEditable: true,
          removable: true,
          visible: true,
          opacity: 1,
        });
        createdElements.push(cell);
        if (cell?.id) cellIds.push(cell.id);
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isHeader =
          (variant === "header" || variant === "dark-header") && r === 0;
        const x = startX + c * cellWidth;
        const y = startY + r * cellHeight;

        const text = page.addElement({
          type: "text",
          text: isHeader ? `Header ${c + 1}` : `R${r + 1}C${c + 1}`,
          x: x + 8,
          y: y + Math.max(8, Math.floor(cellHeight / 3) - 4),
          width: cellWidth - 16,
          fontSize: isHeader ? 13 : 12,
          fontFamily: "Inter",
          fontWeight: isHeader ? "600" : "400",
          fill: isHeader ? style.headerText : style.cellText,
          selectable: true,
          draggable: true,
          resizable: true,
          contentEditable: false,
          styleEditable: true,
          removable: true,
          visible: true,
          opacity: 1,
        });

        createdElements.push(text);
        if (text?.id) textIds.push(text.id);
      }
    }

    // Ensure z-order: texts on top.
    // NOTE: Don't send the frame to absolute bottom because slides can have a
    // non-removable background element at the bottom; pushing below it hides fills/borders.
    try {
      if (textIds.length && typeof page.moveElementsTop === "function") {
        page.moveElementsTop(textIds);
      }
    } catch {}

    // Make the whole table behave like one object:
    // group all elements into a single group so Delete removes everything.
    const createdIds = createdElements.map((el) => el?.id).filter(Boolean);
    try {
      if (createdIds.length && typeof store.groupElements === "function") {
        store.groupElements.length >= 1
          ? store.groupElements(createdIds, { removable: true })
          : store.groupElements();
      } else if (createdIds.length && typeof store.selectElements === "function") {
        store.selectElements(createdIds);
      }
    } catch {}
  };

  const renderTableDesignThumb = (
    variant:
      | "plain"
      | "header"
      | "striped"
      | "boxed"
      | "dark-header"
      | "minimal",
    isActive: boolean,
  ) => {
    const border =
      variant === "boxed"
        ? "2px solid #475569"
        : variant === "minimal"
          ? "1px solid #CBD5E1"
          : "1px solid #8A94A6";

    const headerBg =
      variant === "dark-header"
        ? "#111827"
        : variant === "header" || variant === "boxed"
          ? "#E7EEF9"
          : "#FFFFFF";

    const bandBg = variant === "striped" ? "#F3F6FB" : "#FFFFFF";
    const line = variant === "minimal" ? "#E5E7EB" : "#C4CAD6";

    return (
      <div
        className={`w-[68px] h-[46px] rounded overflow-hidden bg-white ${
          isActive ? "ring-2 ring-blue-500" : "ring-1 ring-[#E5E7EB]"
        }`}
        style={{ border }}
      >
        <div className="h-[14px]" style={{ background: headerBg }} />
        <div className="h-px" style={{ background: line }} />
        <div className="h-[15px]" style={{ background: bandBg }} />
        <div className="h-px" style={{ background: line }} />
        <div className="h-[16px]" style={{ background: "#FFFFFF" }} />
      </div>
    );
  };

  const insertChart = (chartType: PresentationChartType) => {
    const spec = createDefaultChartSpec(chartType);
    // Create editable charts as real Polotno elements for supported types.
    // Pie/donut are kept as SVG images (Polotno figures don't support arcs).
    if (chartType === "pie" || chartType === "donut") {
      const svg = buildChartSvg(spec);
      const width = Math.round(Math.min(760, Math.max(520, store.width * 0.44)));
      const height = Math.round(width * 0.62);
      const el = store.activePage?.addElement?.({
        type: "image",
        name: serializeChartSpecToName(spec),
        src: makeSvgDataUrl(svg),
        x: Math.round((store.width - width) / 2),
        y: Math.round((store.height - height) / 2),
        width,
        height,
      });
      if (el) store.selectElements([el]);
      return;
    }

  };

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Content */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Content
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Text Box */}
          <button
            onClick={() =>
              store.activePage?.addElement?.({ type: "text", text: "Text" })
            }
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
              <path
                d="M8 2.66406V13.3307"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.66797 4.66406V3.33073C2.66797 3.15392 2.73821 2.98435 2.86323 2.85932C2.98826 2.7343 3.15782 2.66406 3.33464 2.66406H12.668C12.8448 2.66406 13.0143 2.7343 13.1394 2.85932C13.2644 2.98435 13.3346 3.15392 13.3346 3.33073V4.66406"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 13.3359H10"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
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
              Text Box
            </span>
          </button>

          {/* SHAPES */}

          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <ShapesPanel store={store} />
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                <path
                  d="M5.53507 6.66458C5.44913 6.66927 5.36356 6.65011 5.28784 6.6092C5.21211 6.56829 5.14917 6.50724 5.10598 6.4328C5.06279 6.35835 5.04103 6.27341 5.0431 6.18737C5.04518 6.10132 5.07101 6.01753 5.11773 5.94525L7.60173 1.99792C7.64077 1.92763 7.6973 1.86862 7.76584 1.8266C7.83439 1.78459 7.91263 1.761 7.99297 1.75811C8.07332 1.75523 8.15305 1.77315 8.22443 1.81014C8.29582 1.84714 8.35643 1.90194 8.4004 1.96925L10.8684 5.93125C10.917 6.00111 10.9457 6.08295 10.9511 6.1679C10.9566 6.25286 10.9387 6.33769 10.8995 6.41322C10.8602 6.48875 10.801 6.55209 10.7283 6.5964C10.6556 6.64071 10.5722 6.66429 10.4871 6.66458H5.53507Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9.33594H2.66667C2.29848 9.33594 2 9.63441 2 10.0026V13.3359C2 13.7041 2.29848 14.0026 2.66667 14.0026H6C6.36819 14.0026 6.66667 13.7041 6.66667 13.3359V10.0026C6.66667 9.63441 6.36819 9.33594 6 9.33594Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.6654 14.0026C12.954 14.0026 13.9987 12.9579 13.9987 11.6693C13.9987 10.3806 12.954 9.33594 11.6654 9.33594C10.3767 9.33594 9.33203 10.3806 9.33203 11.6693C9.33203 12.9579 10.3767 14.0026 11.6654 14.0026Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span
                className="
        text-[9px]
        font-normal
        leading-[11.25px]
        tracking-[0.167px]
        font-inter
        mt-0.5
        text-[#4A5565]
        group-hover:text-[#18181b]
        transition-colors
      "
              >
                Shapes
              </span>
            </button>
          </Popover>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Media */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Media
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Image */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                      const src = event.target?.result as string;
                      store.activePage?.addElement?.({
                        type: "image",
                        src,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }
            }}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
              <path
                d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.0013 7.33073C6.73768 7.33073 7.33464 6.73378 7.33464 5.9974C7.33464 5.26102 6.73768 4.66406 6.0013 4.66406C5.26492 4.66406 4.66797 5.26102 4.66797 5.9974C4.66797 6.73378 5.26492 7.33073 6.0013 7.33073Z"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 10.0024L11.9427 7.94507C11.6926 7.69511 11.3536 7.55469 11 7.55469C10.6464 7.55469 10.3074 7.69511 10.0573 7.94507L4 14.0024"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[9px] mt-0.5 text-[#4A5565] font-inter not-italic font-normal leading-[11.25px] tracking-[0.167px] group-hover:text-[#18181b] transition-colors">
              Image
            </span>
          </button>
          {/* Table */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[360px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-400 mb-2">Insert Table</div>

                {/* Grid picker (PowerPoint-like) */}
                <div className="flex items-start gap-4">
                  <div>
                    <div className="text-[11px] text-gray-500 mb-2">
                      {tablePicker.hoverRows} x {tablePicker.hoverCols} Table
                    </div>
                    <div
                      className="grid gap-[2px] p-2 rounded border border-[#E5E7EB] bg-white"
                      style={{
                        gridTemplateColumns: `repeat(${MAX_TABLE_PICKER_COLS}, 14px)`,
                      }}
                      onMouseLeave={() =>
                        setTablePicker((s) => ({
                          ...s,
                          hoverRows: Math.max(1, s.hoverRows),
                          hoverCols: Math.max(1, s.hoverCols),
                        }))
                      }
                    >
                      {Array.from({
                        length: MAX_TABLE_PICKER_ROWS * MAX_TABLE_PICKER_COLS,
                      }).map((_, idx) => {
                        const r = Math.floor(idx / MAX_TABLE_PICKER_COLS) + 1;
                        const c = (idx % MAX_TABLE_PICKER_COLS) + 1;
                        const active = r <= tablePicker.hoverRows && c <= tablePicker.hoverCols;
                        return (
                          <button
                            key={`${r}-${c}`}
                            type="button"
                            className={`w-[14px] h-[14px] border ${
                              active
                                ? "bg-[#FDE68A] border-[#F59E0B]"
                                : "bg-white border-[#E5E7EB] hover:bg-[#F8FAFC]"
                            }`}
                            onMouseEnter={() =>
                              setTablePicker((s) => ({
                                ...s,
                                hoverRows: r,
                                hoverCols: c,
                              }))
                            }
                            onClick={() =>
                              insertTable(r, c, tablePicker.selectedVariant)
                            }
                            aria-label={`Insert ${r} by ${c} table`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Design chooser */}
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-500 mb-2">
                      Table styles
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {tableDesigns.map((d) => {
                        const isActive = d.variant === tablePicker.selectedVariant;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            className="p-1 rounded hover:bg-[#F8FAFC] text-left"
                            onClick={() =>
                              setTablePicker((s) => ({
                                ...s,
                                selectedVariant: d.variant,
                              }))
                            }
                          >
                            {renderTableDesignThumb(d.variant, isActive)}
                            <div className="mt-1 text-[10px] text-gray-600">
                              {d.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400">
                      Pick a size on the grid to insert.
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                <path
                  d="M8 2V14"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 6H14"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 10H14"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="
                  text-[9px]
                  font-normal
                  leading-[11.25px]
                  tracking-[0.167px]
                  font-inter
                  not-italic
                  mt-0.5
                  text-[#4A5565]
                  group-hover:text-[#18181b]
                  transition-colors
                "
                style={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontWeight: 400,
                }}
              >
                Table
              </span>
            </button>
          </Popover>
          {/* Chart */}
          {/* <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[280px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-400 mb-2">Insert Chart</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => insertChart("column")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Column
                  </button>
                  <button
                    type="button"
                    onClick={() => insertChart("stacked-column")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Stacked Column
                  </button>
                  <button
                    type="button"
                    onClick={() => insertChart("bar")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Bar
                  </button>
                  <button
                    type="button"
                    onClick={() => insertChart("line")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Line
                  </button>
                  <button
                    type="button"
                    onClick={() => insertChart("area")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Area
                  </button>
                  <button
                    type="button"
                    onClick={() => insertChart("scatter")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Scatter
                  </button>
                  <button
                    type="button"
                    onClick={() => insertChart("pie")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Pie
                  </button>
                  <button
                    type="button"
                    onClick={() => insertChart("donut")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    Donut
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                <path
                  d="M2 2V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H14"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11.3333V6"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.66797 11.3359V3.33594"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33203 11.3359V9.33594"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="
                  text-[9px]
                  text-[#4A5565]
                  font-inter
                  not-italic
                  font-normal
                  leading-[11.25px]
                  tracking-[0.167px]
                  mt-0.5
                "
              >
                Chart
              </span>
            </button>
          </Popover> */}
        </div>
      </div>
    </div>
  );
}
