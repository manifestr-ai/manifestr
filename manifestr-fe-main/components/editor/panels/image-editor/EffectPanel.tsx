import React from "react";

interface EffectPanelProps {
  store: any;
}

export default function EffectPanel({ store }: EffectPanelProps) {
  const selected = store.selectedElements;
  const page = store.activePage;

  // if (!selected || selected.length === 0) {
  //   return (
  //     <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
  //       Select an element to arrange
  //     </div>
  //   );
  // }
  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0">
      <div className="flex flex-col items-center min-w-[210px]">
        <div className="h-[102px] bg-white border-b flex items-center px-6 gap-10">
          {/* None */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15 6L5 16"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 6L15 16"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 group-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              None
            </span>
          </button>

          {/* Fade */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clip-path="url(#clip0_10291_379782)">
                <path
                  d="M7.9987 10.6654C9.47146 10.6654 10.6654 9.47146 10.6654 7.9987C10.6654 6.52594 9.47146 5.33203 7.9987 5.33203C6.52594 5.33203 5.33203 6.52594 5.33203 7.9987C5.33203 9.47146 6.52594 10.6654 7.9987 10.6654Z"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 1.33203V2.66536"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 13.332V14.6654"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.28516 3.28516L4.22516 4.22516"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.7734 11.7734L12.7134 12.7134"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1.33203 8H2.66536"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.332 8H14.6654"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.22516 11.7734L3.28516 12.7134"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.7134 3.28516L11.7734 4.22516"
                  stroke="#4A5565"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10291_379782">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 group-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              Fade
            </span>
          </button>

          {/* Dissolve */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="22"
              viewBox="0 0 17 22"
              fill="none"
            >
              <path
                d="M8.16797 20.668C10.1571 20.668 12.0647 19.8917 13.4713 18.5098C14.8778 17.128 15.668 15.2538 15.668 13.2995C15.668 11.1943 14.5965 9.19428 12.4537 7.51007C10.3108 5.82586 8.70368 3.29955 8.16797 0.667969C7.63225 3.29955 6.02511 5.82586 3.88225 7.51007C1.7394 9.19428 0.667969 11.1943 0.667969 13.2995C0.667969 15.2538 1.45814 17.128 2.86467 18.5098C4.27119 19.8917 6.17884 20.668 8.16797 20.668Z"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 Dissolve-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              Group
            </span>
          </button>

          {/* Wipe */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17.5 5.16406H2.5"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.5 11H2.5"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1667 16.8359H2.5"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 group-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              Wipe
            </span>
          </button>

          {/* Wipe */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17.5 4.66406H2.5"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5 10.5H7.5"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5026 16.3359H5.83594"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 group-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              Wipe
            </span>
          </button>

          {/* Slide */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M14.9786 4.07345C15.2315 3.92171 15.5202 3.83979 15.8151 3.83607C16.11 3.83235 16.4006 3.90696 16.6573 4.05227C16.9139 4.19759 17.1274 4.40841 17.276 4.66322C17.4245 4.91802 17.5028 5.20768 17.5028 5.50262V15.5026C17.5028 15.7976 17.4245 16.0872 17.276 16.342C17.1274 16.5968 16.9139 16.8077 16.6573 16.953C16.4006 17.0983 16.11 17.1729 15.8151 17.1692C15.5202 17.1655 15.2315 17.0835 14.9786 16.9318L6.64777 11.9335C6.40046 11.7857 6.19568 11.5764 6.0534 11.3259C5.91111 11.0754 5.83619 10.7922 5.83594 10.5042C5.83569 10.2161 5.91011 9.93284 6.05196 9.68209C6.1938 9.43134 6.39822 9.22165 6.64527 9.07345L14.9786 4.07345Z"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 17.1693V3.83594"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 group-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              Slide
            </span>
          </button>

          {/* Zoom */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.5 3H17.5V8"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.4974 3L11.6641 8.83333"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 17.9974L8.33333 12.1641"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 18H2.5V13"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 group-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              Zoom
            </span>
          </button>

          {/* Zoom */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            type="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M16.7188 8H11.7188V3"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5521 2.17187L11.7188 8.00521"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.21484 13.0065L3.38151 18.8398"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.21875 13H9.21875V18"
                stroke="#21242C"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              className="text-[9px] font-inter font-normal not-italic leading-[11.25px] tracking-[0.167px] text-[#9CA3AF] mt-0.5 group-hover:text-[#18181b] transition-colors mt-2"
              style={{ fontFamily: "Inter" }}
            >
              Zoom
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
