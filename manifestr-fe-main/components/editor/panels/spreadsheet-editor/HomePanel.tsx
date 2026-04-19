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

interface HomePanelProps {
  store: any;
}

export default function HomePanel({ store }: HomePanelProps) {
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
  const align = selected?.align || "left";
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
    <div className="h-[102px] bg-white border-b flex items-center px-6 gap-4">
      <div className="flex flex-col items-center  min-w-[100px]">
        <span className="text-xs text-gray-500 mb-3">File</span>
        <div className="flex flex-row items-center gap-[34px]">
          <button
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
                  d="M10.0013 1.33594H4.0013C3.64768 1.33594 3.30854 1.47641 3.05849 1.72646C2.80844 1.97651 2.66797 2.31565 2.66797 2.66927V13.3359C2.66797 13.6896 2.80844 14.0287 3.05849 14.2787C3.30854 14.5288 3.64768 14.6693 4.0013 14.6693H12.0013C12.3549 14.6693 12.6941 14.5288 12.9441 14.2787C13.1942 14.0287 13.3346 13.6896 13.3346 13.3359V4.66927L10.0013 1.33594Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M9.33203 1.33594V4.0026C9.33203 4.35623 9.47251 4.69536 9.72256 4.94541C9.9726 5.19546 10.3117 5.33594 10.6654 5.33594H13.332"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M6.66536 6H5.33203"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M10.6654 8.66406H5.33203"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M10.6654 11.3359H5.33203"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Templates
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Font */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="text-xs text-gray-500 mb-3">Font</span>
        <div className="flex flex-row items-center gap-[34px]">
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

      {/* Alignment */}
      <div className="flex gap-4 items-center min-w-[210px]">
        {/* Alignment */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-3">Alignment</span>
          <div className="flex flex-row items-center gap-[34px]">
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
                  className="mt-1"
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
     
    </div>
  );
}
