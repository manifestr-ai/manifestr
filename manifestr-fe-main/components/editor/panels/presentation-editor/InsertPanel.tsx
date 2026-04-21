import ShapesPanel from "../comman-panel/ShapesPanel";
import { Popover, Position } from "@blueprintjs/core";
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

  const insertTable = (
    rows: number,
    cols: number,
    variant: "plain" | "header" | "striped" = "plain",
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
    const strokeColor = "#C4CAD6";
    const headerFill = "#E7EEF9";
    const stripedFill = "#F8FAFC";

    const background = page.addElement({
      type: "shape",
      shapeType: "rect",
      x: startX,
      y: startY,
      width: tableWidth,
      height: tableHeight,
      stroke: "#8A94A6",
      strokeWidth: 1.5,
      fill: "#FFFFFF",
    });

    createdElements.push(background);

    if (variant === "header") {
      const headerBg = page.addElement({
        type: "shape",
        shapeType: "rect",
        x: startX,
        y: startY,
        width: tableWidth,
        height: cellHeight,
        fill: headerFill,
        strokeWidth: 0,
      });
      createdElements.push(headerBg);
    }

    if (variant === "striped") {
      for (let r = 0; r < rows; r++) {
        if (r % 2 === 1) {
          const rowBg = page.addElement({
            type: "shape",
            shapeType: "rect",
            x: startX,
            y: startY + r * cellHeight,
            width: tableWidth,
            height: cellHeight,
            fill: stripedFill,
            strokeWidth: 0,
          });
          createdElements.push(rowBg);
        }
      }
    }

    for (let r = 1; r < rows; r++) {
      const y = startY + r * cellHeight;
      const line = page.addElement({
        type: "shape",
        shapeType: "rect",
        x: startX,
        y,
        width: tableWidth,
        height: 1.5,
        fill: strokeColor,
        strokeWidth: 0,
      });
      createdElements.push(line);
    }

    for (let c = 1; c < cols; c++) {
      const x = startX + c * cellWidth;
      const line = page.addElement({
        type: "shape",
        shapeType: "rect",
        x,
        y: startY,
        width: 1.5,
        height: tableHeight,
        fill: strokeColor,
        strokeWidth: 0,
      });
      createdElements.push(line);
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isHeader = variant === "header" && r === 0;
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
          fill: "#111827",
        });

        createdElements.push(text);
      }
    }

    store.selectElements(createdElements);
    try {
      if (typeof store.groupElements === "function") {
        store.groupElements.length > 0
          ? store.groupElements(createdElements)
          : store.groupElements();
      }
    } catch {}
  };

  const insertChart = (chartType: PresentationChartType) => {
    const spec = createDefaultChartSpec(chartType);
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
    if (el) {
      store.selectElements([el]);
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
              <div className="w-[260px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-400 mb-2">Insert Table</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => insertTable(2, 2, "plain")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    2x2 Basic
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTable(3, 3, "plain")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    3x3 Basic
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTable(4, 4, "plain")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    4x4 Basic
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTable(3, 4, "header")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    3x4 Header
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTable(5, 3, "striped")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    5x3 Striped
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTable(6, 6, "plain")}
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                  >
                    6x6 Matrix
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
          <Popover
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
          </Popover>
        </div>
      </div>
    </div>
  );
}
