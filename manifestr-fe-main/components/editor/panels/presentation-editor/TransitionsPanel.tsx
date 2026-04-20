import React from "react";

interface TransitionsPanelProps {
  store: any;
}

export default function TransitionsPanel({ store }: TransitionsPanelProps) {
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
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Transition Effects */}
      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Transition Effects
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Select Effect */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                d="M3.33203 8H12.6654"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 3.33594L12.6667 8.0026L8 12.6693"
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
              Select Effect
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Direction
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Direction */}
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
              <g clip-path="url(#clip0_10297_389641)">
                <path
                  d="M12 5.33594L14.6667 8.0026L12 10.6693"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1.33203 8H14.6654"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.9987 5.33594L1.33203 8.0026L3.9987 10.6693"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10297_389641">
                  <rect width="16" height="16" fill="white" />
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
              Direction
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Timing
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Duration */}
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
              <g clip-path="url(#clip0_10297_389652)">
                <path
                  d="M8 4V8L10.6667 9.33333"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.9987 14.6693C11.6806 14.6693 14.6654 11.6845 14.6654 8.0026C14.6654 4.32071 11.6806 1.33594 7.9987 1.33594C4.3168 1.33594 1.33203 4.32071 1.33203 8.0026C1.33203 11.6845 4.3168 14.6693 7.9987 14.6693Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10297_389652">
                  <rect width="16" height="16" fill="white" />
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
              Duration
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[250px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Apply
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Apply to All */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                d="M4.66797 2V14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 5H4.66667"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 8H14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 11H4.66667"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.332 2V14"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.332 5H13.9987"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.332 11H13.9987"
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
              Apply to All
            </span>
          </button>

          {/* Preview */}
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
                d="M9.33333 2.73438L8 4.00104"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.39818 5.33021L1.46484 4.79688"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.00104 8L2.73438 9.33333"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.80078 1.46875L5.33411 3.40208"
                stroke="#364153"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.02639 6.46173C6.00054 6.40083 5.99348 6.3336 6.0061 6.26865C6.01872 6.20371 6.05046 6.14402 6.09724 6.09724C6.14402 6.05046 6.20371 6.01872 6.26865 6.0061C6.3336 5.99348 6.40083 6.00054 6.46173 6.02639L13.7951 9.02639C13.8603 9.05317 13.9154 9.09996 13.9524 9.16004C13.9894 9.22011 14.0064 9.29037 14.0009 9.3607C13.9954 9.43103 13.9677 9.49781 13.9219 9.55143C13.876 9.60504 13.8144 9.64273 13.7457 9.65906L10.8464 10.3531C10.7267 10.3817 10.6173 10.4428 10.5302 10.5298C10.4431 10.6167 10.3818 10.7261 10.3531 10.8457L9.65973 13.7457C9.64357 13.8146 9.60593 13.8765 9.55224 13.9226C9.49856 13.9686 9.43161 13.9964 9.36109 14.0019C9.29058 14.0074 9.22014 13.9903 9.15997 13.9531C9.0998 13.9159 9.05302 13.8606 9.02639 13.7951L6.02639 6.46173Z"
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
              Preview
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
