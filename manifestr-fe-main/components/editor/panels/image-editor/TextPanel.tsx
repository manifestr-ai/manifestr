import React from "react";

// For demonstration, these can be static.
// In real usage, swap with your store's fonts list.
const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Oswald",
];
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

interface TextPanelProps {
  store: any;
}

export default function TextPanel({ store }: TextPanelProps) {
  const selected = store.selectedElements?.[0];
  const isText = selected?.type === "text";

  // Make sure all needed properties are available, or use fallbacks
  const fontFamily = selected?.fontFamily || "Inter";
  const fontSize = selected?.fontSize || 18;
  const fontWeight = selected?.fontWeight || "normal";
  const fontStyle = selected?.fontStyle || "normal";
  const textDecoration = selected?.textDecoration || "none";
  const textDecorLine =
    typeof textDecoration === "string" ? textDecoration : "none";
  const align = selected?.align || "";
  const fill = selected?.fill || "#000000";

  // if (!isText) {
  //   return (
  //     <div className="h-[102px] flex items-center justify-center text-gray-400 text-sm">
  //       Select a text element to format
  //     </div>
  //   );
  // }

  // Helper to disable button if not functional
  const disable = (available = true) => !available;

  return (
    <div className="h-[102px] bg-white border-b flex items-center px-6 gap-4 overflow-x-auto">
      {/* Font */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="text-xs text-gray-500 mb-3">Font</span>
        <div className="flex gap-2 gap-[34px]">
          {/* Text */}
          <button
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${fontWeight === "bold" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] font-bold text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 3V15"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 5.25V3.75C3 3.55109 3.07902 3.36032 3.21967 3.21967C3.36032 3.07902 3.55109 3 3.75 3H14.25C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75V5.25"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.75 15H11.25"
                  stroke="#364153"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Text
            </span>
          </button>

          {/* Bold */}
          <button
            onClick={() =>
              selected.set({
                fontWeight: fontWeight === "bold" ? "normal" : "bold",
              })
            }
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${fontWeight === "bold" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] font-bold text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 7.9974H10C10.7072 7.9974 11.3855 8.27835 11.8856 8.77844C12.3857 9.27854 12.6667 9.95682 12.6667 10.6641C12.6667 11.3713 12.3857 12.0496 11.8856 12.5497C11.3855 13.0498 10.7072 13.3307 10 13.3307H4.66667C4.48986 13.3307 4.32029 13.2605 4.19526 13.1355C4.07024 13.0104 4 12.8409 4 12.6641V3.33073C4 3.15392 4.07024 2.98435 4.19526 2.85932C4.32029 2.7343 4.48986 2.66406 4.66667 2.66406H9.33333C10.0406 2.66406 10.7189 2.94501 11.219 3.44511C11.719 3.94521 12 4.62349 12 5.33073C12 6.03797 11.719 6.71625 11.219 7.21635C10.7189 7.71644 10.0406 7.9974 9.33333 7.9974"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Bold
            </span>
          </button>

          {/* Italic */}
          <button
            onClick={() =>
              selected.set({
                fontStyle: fontStyle === "italic" ? "normal" : "italic",
              })
            }
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition
      ${fontStyle === "italic" ? "bg-[#E9EBF0]" : "bg-transparent"}
      hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] italic text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M12.668 2.66406H6.66797"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.33203 13.3359H3.33203"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 2.66406L6 13.3307"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 ">
              Italic
            </span>
          </button>

          {/* Underline */}
          <button
            onClick={() =>
              selected.set({
                textDecoration:
                  textDecorLine === "underline" ? "none" : "underline",
              })
            }
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${textDecorLine === "underline" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0]`}
          >
            <span className="text-[18px] underline text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 2.66406V6.66406C4 7.72493 4.42143 8.74234 5.17157 9.49249C5.92172 10.2426 6.93913 10.6641 8 10.6641C9.06087 10.6641 10.0783 10.2426 10.8284 9.49249C11.5786 8.74234 12 7.72493 12 6.66406V2.66406"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.66797 13.3359H13.3346"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 ">
              Underline
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Text Tool */}
      <div className="flex gap-4 items-center">
        {/* Text Tool */}
        <div className="flex flex-col items-center">
          <div className="flex gap-2 mt-4">
            <div
              className="flex justify-center items-center gap-[12px]"
              style={{
                width: "268px",
                padding: "12px 18px",
                borderRadius: "14px",
                border: "2px solid #D1D5DC",
                background: "#FFF",
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)",
              }}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-6 h-6 text-[#6B7280]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 2.66797V13.3346"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.66406 4.66797V3.33464C2.66406 3.15782 2.7343 2.98826 2.85932 2.86323C2.98435 2.73821 3.15392 2.66797 3.33073 2.66797H12.6641C12.8409 2.66797 13.0104 2.73821 13.1355 2.86323C13.2605 2.98826 13.3307 3.15782 13.3307 3.33464V4.66797"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 13.332H10"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              {/* Fields */}
              <div className="flex items-center gap-4">
                {/* Font */}
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#6B7280] mb-[2px]">
                    Font
                  </span>
                  <input
                    type="text"
                    value="Inter"
                    className="w-[100px] h-[28px] px-2 text-[13px] text-[#111827] border border-[#D1D5DB] rounded-[6px] bg-white outline-none"
                  />
                </div>

                {/* Size */}
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#6B7280] mb-[2px]">
                    Size
                  </span>
                  <input
                    type="text"
                    value="16"
                    className="w-[60px] h-[28px] px-2 text-[13px] text-[#111827] border border-[#D1D5DB] rounded-[6px] bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Style */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="text-xs text-gray-500 mb-3">Style</span>
        <div className="flex gap-2 gap-[34px]">
          {/* Font */}
          <button
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${fontWeight === "bold" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] font-bold text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 3.33203V16.6654"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33594 5.83203V4.16536C3.33594 3.94435 3.42374 3.73239 3.58002 3.57611C3.7363 3.41983 3.94826 3.33203 4.16927 3.33203H15.8359C16.057 3.33203 16.2689 3.41983 16.4252 3.57611C16.5815 3.73239 16.6693 3.94435 16.6693 4.16536V5.83203"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.5 16.668H12.5"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Font
            </span>
          </button>

          {/* Effect */}
          <button
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${fontWeight === "bold" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] font-bold text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M9.18022 2.34439C9.21593 2.15323 9.31737 1.98057 9.46697 1.85632C9.61658 1.73208 9.80492 1.66406 9.99939 1.66406C10.1939 1.66406 10.3822 1.73208 10.5318 1.85632C10.6814 1.98057 10.7829 2.15323 10.8186 2.34439L11.6944 6.97606C11.7566 7.30535 11.9166 7.60824 12.1536 7.8452C12.3905 8.08216 12.6934 8.24219 13.0227 8.30439L17.6544 9.18022C17.8456 9.21593 18.0182 9.31737 18.1425 9.46697C18.2667 9.61658 18.3347 9.80492 18.3347 9.99939C18.3347 10.1939 18.2667 10.3822 18.1425 10.5318C18.0182 10.6814 17.8456 10.7829 17.6544 10.8186L13.0227 11.6944C12.6934 11.7566 12.3905 11.9166 12.1536 12.1536C11.9166 12.3905 11.7566 12.6934 11.6944 13.0227L10.8186 17.6544C10.7829 17.8456 10.6814 18.0182 10.5318 18.1425C10.3822 18.2667 10.1939 18.3347 9.99939 18.3347C9.80492 18.3347 9.61658 18.2667 9.46697 18.1425C9.31737 18.0182 9.21593 17.8456 9.18022 17.6544L8.30439 13.0227C8.24219 12.6934 8.08216 12.3905 7.8452 12.1536C7.60824 11.9166 7.30535 11.7566 6.97606 11.6944L2.34439 10.8186C2.15323 10.7829 1.98057 10.6814 1.85632 10.5318C1.73208 10.3822 1.66406 10.1939 1.66406 9.99939C1.66406 9.80492 1.73208 9.61658 1.85632 9.46697C1.98057 9.31737 2.15323 9.21593 2.34439 9.18022L6.97606 8.30439C7.30535 8.24219 7.60824 8.08216 7.8452 7.8452C8.08216 7.60824 8.24219 7.30535 8.30439 6.97606L9.18022 2.34439Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.6641 1.66797V5.0013"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.3333 3.33203H15"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33073 18.3333C4.2512 18.3333 4.9974 17.5871 4.9974 16.6667C4.9974 15.7462 4.2512 15 3.33073 15C2.41025 15 1.66406 15.7462 1.66406 16.6667C1.66406 17.5871 2.41025 18.3333 3.33073 18.3333Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Effect
            </span>
          </button>

          {/* Path */}
          <button
            className={`flex flex-col items-center justify-center w-[44px]  rounded-md transition ${fontStyle === "italic" ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0] py-2`}
          >
            <span className="text-[18px] italic text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M18.0297 3.03366L16.9631 1.96699C16.8693 1.87225 16.7577 1.79705 16.6347 1.74572C16.5117 1.6944 16.3797 1.66797 16.2464 1.66797C16.1131 1.66797 15.9812 1.6944 15.8581 1.74572C15.7351 1.79705 15.6235 1.87225 15.5297 1.96699L1.96308 15.5337C1.86835 15.6274 1.79314 15.739 1.74182 15.8621C1.69049 15.9851 1.66406 16.117 1.66406 16.2503C1.66406 16.3836 1.69049 16.5156 1.74182 16.6386C1.79314 16.7616 1.86835 16.8732 1.96308 16.967L3.02975 18.0337C3.12293 18.1294 3.23436 18.2055 3.35745 18.2575C3.48054 18.3095 3.6128 18.3362 3.74642 18.3362C3.88003 18.3362 4.01229 18.3095 4.13538 18.2575C4.25847 18.2055 4.3699 18.1294 4.46308 18.0337L18.0297 4.46699C18.1255 4.37381 18.2016 4.26238 18.2536 4.13929C18.3056 4.01619 18.3323 3.88394 18.3323 3.75032C18.3323 3.61671 18.3056 3.48445 18.2536 3.36136C18.2016 3.23827 18.1255 3.12684 18.0297 3.03366Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.6641 5.83203L14.1641 8.33203"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.16406 5V8.33333"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.8359 11.668V15.0013"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.33594 1.66797V3.33464"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.83333 6.66797H2.5"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.4974 13.332H14.1641"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.16667 2.5H7.5"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 ">
              Path
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Alignment */}
      <div className="flex gap-4 items-center min-w-[280px]">
        {/* Alignment */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-3">Alignment</span>
          <div className="flex gap-2 gap-[34px]">
            {/* Alignment buttons */}
            {[
              {
                value: "left",
                label: "Left",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 3.33594H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10 8H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.3333 12.6641H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
              {
                value: "center",
                label: "Center",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 3.33594H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.3346 8H4.66797"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.6654 12.6641H3.33203"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
              {
                value: "right",
                label: "Right",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 3.33594H2"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 8H6"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.0013 12.6641H4.66797"
                      stroke="#364153"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
              {
                value: "justify",
                label: "Justify",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M2.25 3.75H15.75"
                      stroke="#364153"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.25 9H15.75"
                      stroke="#364153"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.25 14.25H15.75"
                      stroke="#364153"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ),
              },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => selected.set({ align: option.value })}
                className={`flex flex-col items-center justify-center w-[44px] rounded-md transition ${align === option.value ? "bg-[#E9EBF0]" : "bg-transparent"} hover:bg-[#E9EBF0] py-2`}
                aria-label={`Align ${option.label}`}
                type="button"
              >
                <span className="text-[18px] text-[#2B2F38] leading-none">
                  {option.icon}
                </span>
                <span
                  style={{
                    color: "#4A5565",
                    fontFamily: "Inter",
                    fontSize: "9px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "11.25px",
                    letterSpacing: "0.167px",
                  }}
                  className="mt-1 "
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Slides */}
      <div className="flex flex-col items-center">
        <div className="flex gap-2">
          <div className="flex items-center gap-3 flex-1">
            <span
              style={{
                color: "#4A5565",
                fontFamily: "Inter",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "16px",
              }}
              className="mt-5"
            >
              Spacing
            </span>

            <div className="flex flex-col w-full">
              <span
                style={{
                  color: "#101828",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "-0.15px",
                }}
              >
                Letter
              </span>

              <div className="flex items-center gap-3 mt-1">
                {/* slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  className="outline-none appearance-none"
                  style={{
                    width: "133px",
                    height: "16px",
                    borderRadius: "16777200px",
                    border: "1px solid #D1D5DC",
                    color: "#fff",
                  }}
                />

                {/* value */}
                <span className="text-[12px] text-[#6B7280] w-[40px]">
                  100%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1">
            <span
              style={{
                color: "#4A5565",
                fontFamily: "Inter",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "16px",
              }}
              className="mt-5"
            >
              Height
            </span>

            <div className="flex flex-col w-full">
              <span
                style={{
                  color: "#101828",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "-0.15px",
                }}
              >
                line
              </span>

              <div className="flex items-center gap-3 mt-1">
                {/* slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  className="outline-none appearance-none"
                  style={{
                    width: "133px",
                    height: "16px",
                    borderRadius: "16777200px",
                    border: "1px solid #D1D5DC",
                    color: "#fff",
                  }}
                />

                {/* value */}
                <span className="text-[12px] text-[#6B7280] w-[40px]">
                  100%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
