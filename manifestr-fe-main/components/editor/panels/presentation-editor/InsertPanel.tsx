import React from "react";
import ShapesPanel from "../comman-panel/ShapesPanel";
import { Popover, Position } from "@blueprintjs/core";

interface InsertPanelProps {
  store: any;
}

export default function InsertPanel({ store }: InsertPanelProps) {
  if (!store) return null;

  return (
    <div className="h-[90px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0">
      {/* Content */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-1.5">
          Content
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Text Box */}
          <button
            onClick={() =>
              store.activePage?.addElement?.({ type: "text", text: "Text" })
            }
            className="flex flex-col items-center group"
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
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66797 4.66406V3.33073C2.66797 3.15392 2.73821 2.98435 2.86323 2.85932C2.98826 2.7343 3.15782 2.66406 3.33464 2.66406H12.668C12.8448 2.66406 13.0143 2.7343 13.1394 2.85932C13.2644 2.98435 13.3346 3.15392 13.3346 3.33073V4.66406"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 13.3359H10"
                stroke="#364153"
                stroke-width="1.33333"
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
              className="flex flex-col items-center group"
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
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6 9.33594H2.66667C2.29848 9.33594 2 9.63441 2 10.0026V13.3359C2 13.7041 2.29848 14.0026 2.66667 14.0026H6C6.36819 14.0026 6.66667 13.7041 6.66667 13.3359V10.0026C6.66667 9.63441 6.36819 9.33594 6 9.33594Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.6654 14.0026C12.954 14.0026 13.9987 12.9579 13.9987 11.6693C13.9987 10.3806 12.954 9.33594 11.6654 9.33594C10.3767 9.33594 9.33203 10.3806 9.33203 11.6693C9.33203 12.9579 10.3767 14.0026 11.6654 14.0026Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-1.5">
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
       
            className="flex flex-col items-center group"
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
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.0013 7.33073C6.73768 7.33073 7.33464 6.73378 7.33464 5.9974C7.33464 5.26102 6.73768 4.66406 6.0013 4.66406C5.26492 4.66406 4.66797 5.26102 4.66797 5.9974C4.66797 6.73378 5.26492 7.33073 6.0013 7.33073Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 10.0024L11.9427 7.94507C11.6926 7.69511 11.3536 7.55469 11 7.55469C10.6464 7.55469 10.3074 7.69511 10.0573 7.94507L4 14.0024"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="text-[9px] mt-0.5 text-[#4A5565] font-inter not-italic font-normal leading-[11.25px] tracking-[0.167px] group-hover:text-[#18181b] transition-colors">
              Image
            </span>
          </button>
          {/* Table */}
          <button
            onClick={() =>
              store.activePage?.addElement?.({
                type: "svg",
              })
            }
            className="flex flex-col items-center group"
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
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 6H14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 10H14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
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
          {/* Chart */}
          <button
            onClick={() => store.activePage.addElement({
              type: "chart",
              chartType: "bar",
              data: [
                { label: "A", value: 30 },
                { label: "B", value: 50 },
                { label: "C", value: 20 }
              ],
              width: 200,
              height: 120,
              fill: "#3B82F6"
            })}
       
            className="flex flex-col items-center group"
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
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 11.3333V6"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.66797 11.3359V3.33594"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.33203 11.3359V9.33594"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
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
        </div>
      </div>
    </div>
  );
}
