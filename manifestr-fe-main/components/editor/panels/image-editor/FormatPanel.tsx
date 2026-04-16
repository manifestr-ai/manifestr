import React, { useRef } from "react";

interface FormatPanelProps {
  store: any;
}

export default function FormatPanel({ store }: FormatPanelProps) {
  const selected = store.selectedElements;
  const page = store.activePage;

  return (
    <div className="h-[102px] bg-white border-b border-[#E5E7EB] flex items-center px-6">
      {/* Left Label */}
      <div className="mr-6">
        <span className="text-[13px] text-[#6B7280] font-medium">
          Transform
        </span>
      </div>

      {/* Toolbar Buttons */}
      <div className="flex items-center gap-6">
        {/* Move */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <g clip-path="url(#clip0_13697_57764)">
              <path
                d="M9 1.5V16.5"
                stroke="#4B5563"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.25 14.25L9 16.5L6.75 14.25"
                stroke="#4B5563"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.25 6.75L16.5 9L14.25 11.25"
                stroke="#4B5563"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.5 9H16.5"
                stroke="#4B5563"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.75 6.75L1.5 9L3.75 11.25"
                stroke="#4B5563"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.75 3.75L9 1.5L11.25 3.75"
                stroke="#4B5563"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_13697_57764">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Move</span>
        </button>

        {/* Crop */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <g clip-path="url(#clip0_13697_57774)">
              <path
                d="M4.5 1.5V12C4.5 12.3978 4.65804 12.7794 4.93934 13.0607C5.22064 13.342 5.60218 13.5 6 13.5H16.5"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.5 16.5V6C13.5 5.60218 13.342 5.22064 13.0607 4.93934C12.7794 4.65804 12.3978 4.5 12 4.5H1.5"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_13697_57774">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Crop</span>
        </button>

        {/* Rotate */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M15.75 9C15.75 10.335 15.3541 11.6401 14.6124 12.7501C13.8707 13.8601 12.8165 14.7253 11.5831 15.2362C10.3497 15.7471 8.99252 15.8808 7.68314 15.6203C6.37377 15.3599 5.17104 14.717 4.22703 13.773C3.28303 12.829 2.64015 11.6262 2.3797 10.3169C2.11925 9.00749 2.25292 7.65029 2.76382 6.41689C3.27471 5.18349 4.13987 4.12928 5.2499 3.38758C6.35994 2.64588 7.66498 2.25 9 2.25C10.89 2.25 12.6975 3 14.055 4.305L15.75 6"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.75 2.25V6H12"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Rotate</span>
        </button>

        {/* Flip H */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M6 2.25H3.75C3.35218 2.25 2.97064 2.40804 2.68934 2.68934C2.40804 2.97064 2.25 3.35218 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H6"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 2.25H14.25C14.6478 2.25 15.0294 2.40804 15.3107 2.68934C15.592 2.97064 15.75 3.35218 15.75 3.75V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H12"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 15V16.5"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 10.5V12"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 6V7.5"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 1.5V3"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Flip H</span>
        </button>

        {/* Flip V */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <g clip-path="url(#clip0_13697_57796)">
              <path
                d="M15.75 6V3.75C15.75 3.35218 15.592 2.97064 15.3107 2.68934C15.0294 2.40804 14.6478 2.25 14.25 2.25H3.75C3.35218 2.25 2.97064 2.40804 2.68934 2.68934C2.40804 2.97064 2.25 3.35218 2.25 3.75V6"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.75 12V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V12"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 9H1.5"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 9H6"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 9H10.5"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.5 9H15"
                stroke="#364153"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_13697_57796">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Flip V</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-gray-200 mx-2" />

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 w-[216px] h-[57px] px-3 py-0 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB]">
          {/* Resize Icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M10 2H14V6"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.9987 2L9.33203 6.66667"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 13.9987L6.66667 9.33203"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 14H2V10"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          {/* Width */}
          <div className="flex flex-col">
            <span className="text-[12px] text-[#6B7280] mb-1">Width</span>
            <input
              type="text"
              value="800"
              className="flex flex-1 items-center w-16 px-2 py-0.5 rounded border border-[#D1D5DC] bg-white text-[14px] text-[#111827] outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Lock */}
          <div className="flex items-center justify-center mt-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 10V7C7 5.3 8.3 4 10 4H14C15.7 4 17 5.3 17 7V10M6 10H18V20H6V10Z"
                stroke="#6B7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Height */}
          <div className="flex flex-col">
            <span className="text-[12px] text-[#6B7280] mb-1">Height</span>
            <input
              type="text"
              value="600"
              className="flex items-center w-16 px-2 py-0 rounded border border-[#D1D5DC] bg-white text-[14px] text-[#111827] outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-0 h-9 rounded-[4px]"
              style={{
                flex: "1 0 0",
                borderRadius: "4px",
                width: "64px",
                padding: "2px 8px",
                border: "1px solid #D1D5DC",
                display: "flex",
                alignItems: "center",
              }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-gray-200 mx-2" />

      {/* Tools */}
      <div className="mr-6">
        <span className="text-[13px] text-[#6B7280] font-medium">Tools</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Select */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M3.0267 3.51495C2.9971 3.44664 2.98872 3.371 3.00265 3.29787C3.01659 3.22473 3.05219 3.15747 3.10483 3.10483C3.15747 3.05219 3.22473 3.01659 3.29787 3.00265C3.371 2.98872 3.44664 2.9971 3.51495 3.0267L15.5149 7.9017C15.5879 7.93142 15.6497 7.98338 15.6914 8.05019C15.7332 8.11699 15.7529 8.19526 15.7476 8.27387C15.7424 8.35249 15.7125 8.42746 15.6623 8.48815C15.612 8.54883 15.544 8.59215 15.4677 8.61195L10.8747 9.79695C10.6152 9.86366 10.3783 9.99867 10.1886 10.1879C9.99896 10.3772 9.86345 10.6138 9.7962 10.8732L8.61195 15.4677C8.59215 15.544 8.54883 15.612 8.48815 15.6623C8.42746 15.7125 8.35249 15.7424 8.27387 15.7476C8.19526 15.7529 8.11699 15.7332 8.05019 15.6914C7.98338 15.6497 7.93142 15.5879 7.9017 15.5149L3.0267 3.51495Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Select</span>
        </button>

        {/* Brush */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M10.967 13.423L2.95703 11.2383"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.7825 1.9663C13.9304 1.81847 14.1059 1.7012 14.299 1.62119C14.4922 1.54118 14.6992 1.5 14.9083 1.5C15.1174 1.5 15.3244 1.54118 15.5175 1.62119C15.7107 1.7012 15.8862 1.81847 16.034 1.9663C16.1819 2.11414 16.2992 2.28964 16.3792 2.4828C16.4592 2.67596 16.5003 2.88298 16.5003 3.09205C16.5003 3.30112 16.4592 3.50815 16.3792 3.7013C16.2992 3.89446 16.1819 4.06997 16.034 4.2178L13.0205 7.23205C12.9502 7.30237 12.9107 7.39774 12.9107 7.49718C12.9107 7.59661 12.9502 7.69198 13.0205 7.7623L13.7285 8.4703C14.0675 8.80927 14.2579 9.26897 14.2579 9.7483C14.2579 10.2276 14.0675 10.6873 13.7285 11.0263L13.0205 11.7343C12.9502 11.8046 12.8549 11.8441 12.7554 11.8441C12.656 11.8441 12.5606 11.8046 12.4903 11.7343L6.26605 5.5108C6.19574 5.44048 6.15625 5.34511 6.15625 5.24568C6.15625 5.14624 6.19574 5.05087 6.26605 4.98055L6.97405 4.27255C7.31301 3.93364 7.77271 3.74324 8.25205 3.74324C8.73138 3.74324 9.19108 3.93364 9.53005 4.27255L10.238 4.98055C10.3084 5.05085 10.4037 5.09035 10.5032 5.09035C10.6026 5.09035 10.698 5.05085 10.7683 4.98055L13.7825 1.9663Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.74921 6C5.39621 8.0325 3.77171 8.595 1.81196 8.961C1.74695 8.97287 1.68615 9.00148 1.63556 9.044C1.58498 9.08653 1.54635 9.14151 1.52348 9.20351C1.50062 9.26552 1.49431 9.33241 1.50518 9.3976C1.51604 9.46279 1.54371 9.52402 1.58546 9.57525L7.07546 16.2375C7.18697 16.3559 7.33396 16.4349 7.49427 16.4625C7.65458 16.4901 7.81951 16.4648 7.96421 16.3905C9.55046 15.3037 11.9992 12.594 11.9992 11.25"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Brush</span>
        </button>

        {/* Pen */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M11.7821 15.9716C11.6414 16.1122 11.4507 16.1912 11.2518 16.1912C11.053 16.1912 10.8622 16.1122 10.7216 15.9716L9.53209 14.7821C9.39149 14.6414 9.3125 14.4507 9.3125 14.2518C9.3125 14.053 9.39149 13.8622 9.53209 13.7216L13.7216 9.53209C13.8622 9.39149 14.053 9.3125 14.2518 9.3125C14.4507 9.3125 14.6414 9.39149 14.7821 9.53209L15.9716 10.7216C16.1122 10.8622 16.1912 11.053 16.1912 11.2518C16.1912 11.4507 16.1122 11.6414 15.9716 11.7821L11.7821 15.9716Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.5 9.75L12.4688 4.5945C12.4407 4.45424 12.3731 4.32492 12.274 4.2218C12.1749 4.11868 12.0483 4.04606 11.9093 4.0125L2.42625 1.521C2.30133 1.4908 2.17073 1.49321 2.047 1.528C1.92327 1.56278 1.81055 1.62879 1.71967 1.71967C1.62879 1.81055 1.56278 1.92327 1.528 2.047C1.49321 2.17073 1.4908 2.30133 1.521 2.42625L4.0125 11.9093C4.04606 12.0483 4.11868 12.1749 4.2218 12.274C4.32492 12.3731 4.45424 12.4407 4.5945 12.4688L9.75 13.5"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M1.72656 1.72656L7.19106 7.19106"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.25 9.75C9.07843 9.75 9.75 9.07843 9.75 8.25C9.75 7.42157 9.07843 6.75 8.25 6.75C7.42157 6.75 6.75 7.42157 6.75 8.25C6.75 9.07843 7.42157 9.75 8.25 9.75Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Pen</span>
        </button>

        {/* Clone */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M10.5 9.75V6.375C10.5 5.25 11.25 5.25 11.25 3.75C11.25 3.15326 11.0129 2.58097 10.591 2.15901C10.169 1.73705 9.59674 1.5 9 1.5C8.40326 1.5 7.83097 1.73705 7.40901 2.15901C6.98705 2.58097 6.75 3.15326 6.75 3.75C6.75 5.25 7.5 5.25 7.5 6.375V9.75"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 11.625C15 11.1277 14.8025 10.6508 14.4508 10.2992C14.0992 9.94754 13.6223 9.75 13.125 9.75H4.875C4.37772 9.75 3.90081 9.94754 3.54917 10.2992C3.19754 10.6508 3 11.1277 3 11.625V12.75C3 12.9489 3.07902 13.1397 3.21967 13.2803C3.36032 13.421 3.55109 13.5 3.75 13.5H14.25C14.4489 13.5 14.6397 13.421 14.7803 13.2803C14.921 13.1397 15 12.9489 15 12.75V11.625Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.75 16.5H14.25"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Clone</span>
        </button>

        {/* Gradient */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M15.75 5.99846C15.7497 5.73542 15.6803 5.47707 15.5487 5.24933C15.417 5.0216 15.2278 4.83248 15 4.70096L9.75 1.70096C9.52197 1.56931 9.2633 1.5 9 1.5C8.7367 1.5 8.47803 1.56931 8.25 1.70096L3 4.70096C2.7722 4.83248 2.58299 5.0216 2.45135 5.24933C2.31971 5.47707 2.25027 5.73542 2.25 5.99846V11.9985C2.25027 12.2615 2.31971 12.5199 2.45135 12.7476C2.58299 12.9753 2.7722 13.1644 3 13.296L8.25 16.296C8.47803 16.4276 8.7367 16.4969 9 16.4969C9.2633 16.4969 9.52197 16.4276 9.75 16.296L15 13.296C15.2278 13.1644 15.417 12.9753 15.5487 12.7476C15.6803 12.5199 15.7497 12.2615 15.75 11.9985V5.99846Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2.47656 5.25L9.00156 9L15.5266 5.25"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 16.5V9"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Gradient</span>
        </button>

        {/* Blur/Sharp */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M7.49973 15C7.49966 15.1394 7.53844 15.276 7.6117 15.3946C7.68496 15.5131 7.78981 15.609 7.91448 15.6713L9.41448 16.4213C9.52885 16.4784 9.65594 16.5054 9.78366 16.4996C9.91139 16.4938 10.0355 16.4555 10.1443 16.3882C10.253 16.3209 10.3427 16.227 10.4049 16.1153C10.4672 16.0036 10.4998 15.8779 10.4997 15.75V10.5C10.4999 10.1283 10.6381 9.76988 10.8875 9.49425L16.3047 3.5025C16.4018 3.39492 16.4657 3.26151 16.4886 3.11841C16.5114 2.97531 16.4924 2.82865 16.4337 2.69616C16.3749 2.56366 16.2791 2.45102 16.1577 2.37184C16.0364 2.29266 15.8946 2.25034 15.7497 2.25H2.24973C2.10468 2.25005 1.96277 2.29216 1.84117 2.37123C1.71957 2.45029 1.6235 2.56292 1.56461 2.69547C1.50571 2.82802 1.48652 2.97481 1.50935 3.11804C1.53218 3.26128 1.59605 3.39482 1.69323 3.5025L7.11198 9.49425C7.36138 9.76988 7.49956 10.1283 7.49973 10.5V15Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Blur/Sharp</span>
        </button>

        {/* Erase */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M15.7497 15.7501H5.99968C5.8019 15.7505 5.60599 15.7118 5.42321 15.6363C5.24044 15.5607 5.07441 15.4498 4.93468 15.3098L1.93918 12.3106C1.65797 12.0293 1.5 11.6478 1.5 11.2501C1.5 10.8523 1.65797 10.4708 1.93918 10.1896L9.43918 2.68955C9.57848 2.5502 9.74386 2.43966 9.92589 2.36424C10.1079 2.28882 10.303 2.25 10.5001 2.25C10.6971 2.25 10.8922 2.28882 11.0742 2.36424C11.2562 2.43966 11.4216 2.5502 11.5609 2.68955L16.0602 7.18956C16.3414 7.47085 16.4994 7.85231 16.4994 8.25005C16.4994 8.6478 16.3414 9.02926 16.0602 9.31055L9.62518 15.7501"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.8125 8.31641L10.4335 14.9374"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Erase</span>
        </button>

        {/* Remove BG */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M4.5 6.75C5.74264 6.75 6.75 5.74264 6.75 4.5C6.75 3.25736 5.74264 2.25 4.5 2.25C3.25736 2.25 2.25 3.25736 2.25 4.5C2.25 5.74264 3.25736 6.75 4.5 6.75Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.09375 6.08984L9.00375 8.99984"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.0038 3L6.09375 11.91"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.5 15.75C5.74264 15.75 6.75 14.7426 6.75 13.5C6.75 12.2574 5.74264 11.25 4.5 11.25C3.25736 11.25 2.25 12.2574 2.25 13.5C2.25 14.7426 3.25736 15.75 4.5 15.75Z"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.1016 11.1016L15.0016 15.0016"
              stroke="#364153"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Remove BG</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-gray-200 mx-2" />

      <div className="flex items-center gap-6">
        {/* Align */}
        <button className="flex flex-col items-center justify-center w-[56px] h-[64px] rounded-md hover:bg-[#F3F4F6] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M17.5 4.16797H2.5"
              stroke="#364153"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.1693 10H5.83594"
              stroke="#364153"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.8307 15.832H4.16406"
              stroke="#364153"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-[11px] mt-2 text-[#6B7280]">Align</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-gray-200 mx-2" />

      {/* Style */}
      <div className="mr-6">
        <span className="text-[13px] text-[#6B7280] font-medium">Style</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex justify-center items-center gap-6 w-[666px] px-[17px] py-[13px] rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]">
          {/* Border */}
          <div className="flex items-center gap-3">
            {/* icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M14.6693 4H1.33594"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6693 12H1.33594"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 1.33203V14.6654"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 1.33203V14.6654"
                stroke="#4A5565"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div className="flex flex-col">
              <span className="text-[12px] text-[#6B7280]">Border</span>
              <input
                type="text"
                value="0"
                className="w-[70px] flex flex-1 items-center px-[8px] pr-[48px] py-[3px] rounded-[4px] border border-[#D1D5DC] bg-white text-[13px] text-[#111827] outline-none"
                style={{ display: "flex" }}
              />
            </div>
          </div>

          {/* Corners */}
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="7"
                stroke="#6B7280"
                strokeWidth="1.5"
              />
            </svg>

            <div className="flex flex-col">
              <span className="text-[12px] text-[#6B7280]">Corners</span>
              <input
                type="text"
                value="0"
                className="w-[70px] flex flex-1 items-center px-[8px] pr-[48px] py-[3px] rounded-[4px] border border-[#D1D5DC] bg-white text-[13px] text-[#111827] outline-none"
              />
            </div>
          </div>

          {/* Shadow */}
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="5"
                y="5"
                width="14"
                height="14"
                stroke="#6B7280"
                strokeWidth="1.5"
              />
            </svg>

            <div className="flex flex-col">
              <span className="text-[12px] text-[#6B7280]">Shadow</span>
              <input
                type="text"
                value="0"
                className="w-[70px] flex flex-1 items-center px-[8px] pr-[48px] py-[3px] rounded-[4px] border border-[#D1D5DC] bg-white text-[13px] text-[#111827] outline-none"
              />
            </div>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-3 flex-1">
            {/* eye icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 22 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2 12Z"
                stroke="#6B7280"
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="#6B7280"
                strokeWidth="1.5"
              />
            </svg>

            <div className="flex flex-col w-full">
              <span className="text-[12px] text-[#6B7280]">Opacity</span>

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
