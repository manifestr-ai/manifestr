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
      {/* Image Media */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-1.5">
          Image Media
        </span>

        <div className="flex flex-row items-center gap-4">
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
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Image Tools */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="text-[#6A7282] text-[12px] mb-1.5">Image Tools</span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Duplicate */}
          <button
            onClick={() => {
              const selected = store.selectedElements;
              if (!selected?.length) return;

              selected.forEach((el: any) => {
                store.activePage.addElement({
                  ...el.toJSON(),
                  x: el.x + 20,
                  y: el.y + 20,
                });
              });
            }}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.668 6.66797H8.33464C7.41416 6.66797 6.66797 7.41416 6.66797 8.33464V16.668C6.66797 17.5884 7.41416 18.3346 8.33464 18.3346H16.668C17.5884 18.3346 18.3346 17.5884 18.3346 16.668V8.33464C18.3346 7.41416 17.5884 6.66797 16.668 6.66797Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33464 13.3346C2.41797 13.3346 1.66797 12.5846 1.66797 11.668V3.33464C1.66797 2.41797 2.41797 1.66797 3.33464 1.66797H11.668C12.5846 1.66797 13.3346 2.41797 13.3346 3.33464"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
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
              Duplicate
            </span>
          </button>

          {/* Filter */}
          {/* <button
            onClick={() => {
              const el = store.selectedElements?.[0];
              if (!el) return;

              el.set({
                opacity: 0.8,
                fill: "#999999",
              });
            }}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M8.33433 16.6667C8.33426 16.8215 8.37734 16.9733 8.45874 17.1051C8.54014 17.2368 8.65664 17.3433 8.79517 17.4125L10.4618 18.2458C10.5889 18.3093 10.7301 18.3393 10.872 18.3329C11.014 18.3264 11.1519 18.2838 11.2727 18.2091C11.3935 18.1344 11.4932 18.03 11.5624 17.9059C11.6315 17.7818 11.6677 17.6421 11.6677 17.5V11.6667C11.6679 11.2537 11.8214 10.8554 12.0985 10.5492L18.1177 3.89167C18.2256 3.77213 18.2965 3.6239 18.3219 3.4649C18.3473 3.3059 18.3262 3.14294 18.2609 2.99573C18.1957 2.84851 18.0892 2.72335 17.9543 2.63538C17.8195 2.5474 17.662 2.50038 17.501 2.5H2.501C2.33984 2.50006 2.18215 2.54685 2.04704 2.6347C1.91193 2.72255 1.80519 2.84769 1.73976 2.99497C1.67432 3.14225 1.65299 3.30534 1.67836 3.46449C1.70372 3.62364 1.77469 3.77203 1.88267 3.89167L7.9035 10.5492C8.18062 10.8554 8.33415 11.2537 8.33433 11.6667V16.6667Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
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
          </button> */}
        </div>
      </div>

      {/* Divider */}
      {/* <div className=" w-px h-[50px] bg-[#E3E4EA]" /> */}

      {/* Text Tools */}
      {/* <div className="flex flex-col items-center min-w-[210px]">
        <span className="text-[#6A7282] text-[12px] mb-1.5">Text Tools</span>

        <div className="flex flex-row items-center gap-[34px]">
          <button
            className="
            flex flex-col items-center group
          "
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10 3.33203V16.6654"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33203 5.83203V4.16536C3.33203 3.94435 3.41983 3.73239 3.57611 3.57611C3.73239 3.41983 3.94435 3.33203 4.16536 3.33203H15.832C16.053 3.33203 16.265 3.41983 16.4213 3.57611C16.5776 3.73239 16.6654 3.94435 16.6654 4.16536V5.83203"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 16.668H12.5"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
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
              Font
            </span>
          </button>

          <button
            className="
            flex flex-col items-center group
          "
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9.18022 2.34439C9.21593 2.15323 9.31737 1.98057 9.46697 1.85632C9.61658 1.73208 9.80492 1.66406 9.99939 1.66406C10.1939 1.66406 10.3822 1.73208 10.5318 1.85632C10.6814 1.98057 10.7829 2.15323 10.8186 2.34439L11.6944 6.97606C11.7566 7.30535 11.9166 7.60824 12.1536 7.8452C12.3905 8.08216 12.6934 8.24219 13.0227 8.30439L17.6544 9.18022C17.8456 9.21593 18.0182 9.31737 18.1425 9.46697C18.2667 9.61658 18.3347 9.80492 18.3347 9.99939C18.3347 10.1939 18.2667 10.3822 18.1425 10.5318C18.0182 10.6814 17.8456 10.7829 17.6544 10.8186L13.0227 11.6944C12.6934 11.7566 12.3905 11.9166 12.1536 12.1536C11.9166 12.3905 11.7566 12.6934 11.6944 13.0227L10.8186 17.6544C10.7829 17.8456 10.6814 18.0182 10.5318 18.1425C10.3822 18.2667 10.1939 18.3347 9.99939 18.3347C9.80492 18.3347 9.61658 18.2667 9.46697 18.1425C9.31737 18.0182 9.21593 17.8456 9.18022 17.6544L8.30439 13.0227C8.24219 12.6934 8.08216 12.3905 7.8452 12.1536C7.60824 11.9166 7.30535 11.7566 6.97606 11.6944L2.34439 10.8186C2.15323 10.7829 1.98057 10.6814 1.85632 10.5318C1.73208 10.3822 1.66406 10.1939 1.66406 9.99939C1.66406 9.80492 1.73208 9.61658 1.85632 9.46697C1.98057 9.31737 2.15323 9.21593 2.34439 9.18022L6.97606 8.30439C7.30535 8.24219 7.60824 8.08216 7.8452 7.8452C8.08216 7.60824 8.24219 7.30535 8.30439 6.97606L9.18022 2.34439Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.668 1.66797V5.0013"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3333 3.33203H15"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33464 18.3333C4.25511 18.3333 5.0013 17.5871 5.0013 16.6667C5.0013 15.7462 4.25511 15 3.33464 15C2.41416 15 1.66797 15.7462 1.66797 16.6667C1.66797 17.5871 2.41416 18.3333 3.33464 18.3333Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
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
              Effects
            </span>
          </button>

          <button
            className="
            flex flex-col items-center group
          "
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13.0877 17.7427C12.9315 17.899 12.7195 17.9867 12.4986 17.9867C12.2776 17.9867 12.0657 17.899 11.9094 17.7427L10.5877 16.4211C10.4315 16.2648 10.3438 16.0529 10.3438 15.8319C10.3438 15.6109 10.4315 15.399 10.5877 15.2427L15.2427 10.5877C15.399 10.4315 15.6109 10.3438 15.8319 10.3438C16.0529 10.3438 16.2648 10.4315 16.4211 10.5877L17.7427 11.9094C17.899 12.0657 17.9867 12.2776 17.9867 12.4986C17.9867 12.7195 17.899 12.9315 17.7427 13.0877L13.0877 17.7427Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.0013 10.8346L13.8555 5.10631C13.8243 4.95046 13.7492 4.80677 13.6391 4.69219C13.5289 4.57761 13.3883 4.49692 13.2338 4.45964L2.69714 1.69131C2.55833 1.65775 2.41322 1.66042 2.27575 1.69907C2.13827 1.73773 2.01303 1.81106 1.91205 1.91205C1.81106 2.01303 1.73773 2.13827 1.69907 2.27575C1.66042 2.41322 1.65775 2.55833 1.69131 2.69714L4.45964 13.2338C4.49692 13.3883 4.57761 13.5289 4.69219 13.6391C4.80677 13.7492 4.95046 13.8243 5.10631 13.8555L10.8346 15.0013"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.91797 1.91797L7.98964 7.98964"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.16667 10.8333C10.0871 10.8333 10.8333 10.0871 10.8333 9.16667C10.8333 8.24619 10.0871 7.5 9.16667 7.5C8.24619 7.5 7.5 8.24619 7.5 9.16667C7.5 10.0871 8.24619 10.8333 9.16667 10.8333Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
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
              On Path
            </span>
          </button>
        </div>
      </div> */}

      {/* Divider */}
      {/* <div className=" w-px h-[50px] bg-[#E3E4EA]" /> */}

      {/* Layers */}
      {/* <div className="flex flex-col items-center min-w-[210px]">
        <span className="text-[#6A7282] text-[12px] mb-1.5">Layers</span>

        <div className="flex flex-row items-center gap-[34px]">
          <button
            onClick={() => alert("Open Layers Panel")}
            className="flex flex-col items-center"
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10.6901 1.81827C10.473 1.71922 10.2371 1.66797 9.99842 1.66797C9.75977 1.66797 9.52389 1.71922 9.30676 1.81827L2.16509 5.06827C2.01721 5.13347 1.89149 5.24027 1.80323 5.37565C1.71496 5.51103 1.66797 5.66915 1.66797 5.83077C1.66797 5.99238 1.71496 6.1505 1.80323 6.28589C1.89149 6.42127 2.01721 6.52806 2.16509 6.59327L9.31509 9.8516C9.53223 9.95064 9.7681 10.0019 10.0068 10.0019C10.2454 10.0019 10.4813 9.95064 10.6984 9.8516L17.8484 6.6016C17.9963 6.5364 18.122 6.4296 18.2103 6.29422C18.2986 6.15884 18.3455 6.00071 18.3455 5.8391C18.3455 5.67749 18.2986 5.51936 18.2103 5.38398C18.122 5.2486 17.9963 5.1418 17.8484 5.0766L10.6901 1.81827Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1.66797 10C1.66758 10.1594 1.7129 10.3155 1.79857 10.45C1.88424 10.5844 2.00665 10.6914 2.1513 10.7583L9.31797 14.0167C9.53397 14.1145 9.76836 14.1651 10.0055 14.1651C10.2426 14.1651 10.477 14.1145 10.693 14.0167L17.843 10.7667C17.9905 10.7004 18.1155 10.5926 18.2028 10.4564C18.2901 10.3203 18.3359 10.1617 18.3346 10"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1.66797 14.168C1.66758 14.3274 1.7129 14.4835 1.79857 14.6179C1.88424 14.7523 2.00665 14.8594 2.1513 14.9263L9.31797 18.1846C9.53397 18.2824 9.76836 18.333 10.0055 18.333C10.2426 18.333 10.477 18.2824 10.693 18.1846L17.843 14.9346C17.9905 14.8683 18.1155 14.7605 18.2028 14.6244C18.2901 14.4883 18.3359 14.3297 18.3346 14.168"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[9px] text-[#4A5565] mt-0.5">Layers</span>
          </button>

          <button className="flex flex-col items-center">
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.668 16.6667C17.11 16.6667 17.5339 16.4911 17.8465 16.1785C18.159 15.866 18.3346 15.442 18.3346 15V6.66667C18.3346 6.22464 18.159 5.80072 17.8465 5.48816C17.5339 5.17559 17.11 5 16.668 5H10.0846C9.8059 5.00273 9.53092 4.93551 9.28489 4.80448C9.03885 4.67346 8.8296 4.48281 8.6763 4.25L8.0013 3.25C7.84954 3.01956 7.64295 2.8304 7.40005 2.6995C7.15715 2.56859 6.88556 2.50005 6.60964 2.5H3.33464C2.89261 2.5 2.46868 2.67559 2.15612 2.98816C1.84356 3.30072 1.66797 3.72464 1.66797 4.16667V15C1.66797 15.442 1.84356 15.866 2.15612 16.1785C2.46868 16.4911 2.89261 16.6667 3.33464 16.6667H16.668Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[9px] text-[#4A5565] mt-0.5">Group</span>
          </button>
        </div>
      </div> */}
    </div>
  );
}
