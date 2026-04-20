import React from "react";

interface FormatPanelProps {
  store: any;
}

export default function FormatPanel({ store }: FormatPanelProps) {
  if (!store) return null;

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Conditional Formatting */}
      <div className="flex flex-col items-center min-w-[150px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Conditional Formatting
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Rules */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.0013 18.3307C7.79116 18.3307 5.67155 17.4528 4.10875 15.89C2.54594 14.3271 1.66797 12.2075 1.66797 9.9974C1.66797 7.78726 2.54594 5.66764 4.10875 4.10484C5.67155 2.54204 7.79116 1.66406 10.0013 1.66406C12.2114 1.66406 14.3311 2.45424 15.8939 3.86076C17.4567 5.26728 18.3346 7.17494 18.3346 9.16406C18.3346 10.2691 17.8956 11.3289 17.1142 12.1103C16.3328 12.8917 15.273 13.3307 14.168 13.3307H12.293C12.0221 13.3307 11.7567 13.4061 11.5263 13.5485C11.2959 13.6909 11.1097 13.8946 10.9886 14.1369C10.8675 14.3791 10.8162 14.6503 10.8405 14.92C10.8649 15.1898 10.9638 15.4474 11.1263 15.6641L11.3763 15.9974C11.5388 16.2141 11.6378 16.4717 11.6621 16.7414C11.6864 17.0112 11.6351 17.2823 11.514 17.5246C11.3929 17.7668 11.2067 17.9705 10.9763 18.1129C10.7459 18.2553 10.4805 18.3307 10.2096 18.3307H10.0013Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.2487 5.83333C11.4788 5.83333 11.6654 5.64679 11.6654 5.41667C11.6654 5.18655 11.4788 5 11.2487 5C11.0186 5 10.832 5.18655 10.832 5.41667C10.832 5.64679 11.0186 5.83333 11.2487 5.83333Z"
                fill="#364153"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.5846 9.16927C14.8148 9.16927 15.0013 8.98272 15.0013 8.7526C15.0013 8.52249 14.8148 8.33594 14.5846 8.33594C14.3545 8.33594 14.168 8.52249 14.168 8.7526C14.168 8.98272 14.3545 9.16927 14.5846 9.16927Z"
                fill="#364153"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.41667 10.8333C5.64679 10.8333 5.83333 10.6468 5.83333 10.4167C5.83333 10.1865 5.64679 10 5.41667 10C5.18655 10 5 10.1865 5 10.4167C5 10.6468 5.18655 10.8333 5.41667 10.8333Z"
                fill="#364153"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.08464 6.66927C7.31475 6.66927 7.5013 6.48272 7.5013 6.2526C7.5013 6.02249 7.31475 5.83594 7.08464 5.83594C6.85452 5.83594 6.66797 6.02249 6.66797 6.2526C6.66797 6.48272 6.85452 6.66927 7.08464 6.66927Z"
                fill="#364153"
                stroke="#364153"
                stroke-width="1.66667"
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
              Rules
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Cell Styles */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Cell Styles
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Borders */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 7.5H17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 12.5H17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 2.5V17.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.5 2.5V17.5"
                stroke="#364153"
                stroke-width="1.66667"
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
              Borders
            </span>
          </button>

          {/* Fills */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.0013 18.3333C11.5484 18.3333 13.0321 17.7188 14.1261 16.6248C15.2201 15.5308 15.8346 14.0471 15.8346 12.5C15.8346 10.8333 15.0013 9.25 13.3346 7.91667C11.668 6.58333 10.418 4.58333 10.0013 2.5C9.58464 4.58333 8.33464 6.58333 6.66797 7.91667C5.0013 9.25 4.16797 10.8333 4.16797 12.5C4.16797 14.0471 4.78255 15.5308 5.87651 16.6248C6.97047 17.7188 8.45421 18.3333 10.0013 18.3333Z"
                stroke="#364153"
                stroke-width="1.66667"
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
              Fills
            </span>
          </button>

          {/* Format */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 3.33594V16.6693"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.33203 5.83594V4.16927C3.33203 3.94826 3.41983 3.7363 3.57611 3.58002C3.73239 3.42374 3.94435 3.33594 4.16536 3.33594H15.832C16.053 3.33594 16.265 3.42374 16.4213 3.58002C16.5776 3.7363 16.6654 3.94826 16.6654 4.16927V5.83594"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 16.6641H12.5"
                stroke="#364153"
                stroke-width="1.66667"
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
              Format
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Freeze Rows/Cols */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Freeze Rows/Cols
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Freeze Row */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8333 9.16406H4.16667C3.24619 9.16406 2.5 9.91025 2.5 10.8307V16.6641C2.5 17.5845 3.24619 18.3307 4.16667 18.3307H15.8333C16.7538 18.3307 17.5 17.5845 17.5 16.6641V10.8307C17.5 9.91025 16.7538 9.16406 15.8333 9.16406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83203 9.16406V5.83073C5.83203 4.72566 6.27102 3.66585 7.05242 2.88445C7.83382 2.10305 8.89363 1.66406 9.9987 1.66406C11.1038 1.66406 12.1636 2.10305 12.945 2.88445C13.7264 3.66585 14.1654 4.72566 14.1654 5.83073V9.16406"
                stroke="#364153"
                stroke-width="1.66667"
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
              Freeze Rows
            </span>
          </button>

          {/* Freeze Col */}
          <button
            className="flex flex-col items-center justify-center w-[65px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8333 9.16406H4.16667C3.24619 9.16406 2.5 9.91025 2.5 10.8307V16.6641C2.5 17.5845 3.24619 18.3307 4.16667 18.3307H15.8333C16.7538 18.3307 17.5 17.5845 17.5 16.6641V10.8307C17.5 9.91025 16.7538 9.16406 15.8333 9.16406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83203 9.16406V5.83073C5.83203 4.72566 6.27102 3.66585 7.05242 2.88445C7.83382 2.10305 8.89363 1.66406 9.9987 1.66406C11.1038 1.66406 12.1636 2.10305 12.945 2.88445C13.7264 3.66585 14.1654 4.72566 14.1654 5.83073V9.16406"
                stroke="#364153"
                stroke-width="1.66667"
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
              Freeze Cols
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Merge / Split Cells */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Merge / Split Cells
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Merge */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M11.668 2.5C11.889 2.5 12.1009 2.5878 12.2572 2.74408C12.4135 2.90036 12.5013 3.11232 12.5013 3.33333V7.5C12.5013 7.72101 12.4135 7.93298 12.2572 8.08926C12.1009 8.24554 11.889 8.33333 11.668 8.33333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.832 2.5C16.053 2.5 16.265 2.5878 16.4213 2.74408C16.5776 2.90036 16.6654 3.11232 16.6654 3.33333V7.5C16.6654 7.72101 16.5776 7.93298 16.4213 8.08926C16.265 8.24554 16.053 8.33333 15.832 8.33333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83203 12.5L8.33203 15"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83333 17.4974L8.33333 14.9974H4.16667C3.72464 14.9974 3.30072 14.8218 2.98816 14.5092C2.67559 14.1967 2.5 13.7728 2.5 13.3307V11.6641"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.668 11.6641H12.5013C12.0411 11.6641 11.668 12.0372 11.668 12.4974V16.6641C11.668 17.1243 12.0411 17.4974 12.5013 17.4974H16.668C17.1282 17.4974 17.5013 17.1243 17.5013 16.6641V12.4974C17.5013 12.0372 17.1282 11.6641 16.668 11.6641Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V7.5C2.5 7.96024 2.8731 8.33333 3.33333 8.33333H7.5C7.96024 8.33333 8.33333 7.96024 8.33333 7.5V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z"
                stroke="#364153"
                stroke-width="1.66667"
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
              Merge
            </span>
          </button>

          {/* Splite */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M13.332 2.5H17.4987V6.66667"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66667 2.5H2.5V6.66667"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 18.3333V11.4167C10.0048 10.9728 9.92082 10.5325 9.75311 10.1215C9.5854 9.71049 9.33728 9.33714 9.02333 9.02333L2.5 2.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.5 7.5L17.5 2.5"
                stroke="#364153"
                stroke-width="1.66667"
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
              Splite
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Text Tools */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Text Tools
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Wrap */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M13.332 13.3359L10.832 15.8359L13.332 18.3359"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 10H14.5833C15.3569 10 16.0987 10.3073 16.6457 10.8543C17.1927 11.4013 17.5 12.1431 17.5 12.9167C17.5 13.6902 17.1927 14.4321 16.6457 14.9791C16.0987 15.526 15.3569 15.8333 14.5833 15.8333H10.8333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 15.8359H7.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 4.16406H17.5"
                stroke="#364153"
                stroke-width="1.66667"
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
              Wrap
            </span>
          </button>

          {/* Align */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17.5 4.16406H2.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1654 10H5.83203"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.8346 15.8359H4.16797"
                stroke="#364153"
                stroke-width="1.66667"
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
              Align
            </span>
          </button>

          {/* Rotate */}
          <button
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17.5 10C17.5 11.4834 17.0601 12.9334 16.236 14.1668C15.4119 15.4001 14.2406 16.3614 12.8701 16.9291C11.4997 17.4968 9.99168 17.6453 8.53683 17.3559C7.08197 17.0665 5.7456 16.3522 4.6967 15.3033C3.64781 14.2544 2.9335 12.918 2.64411 11.4632C2.35472 10.0083 2.50325 8.50032 3.07091 7.12987C3.63856 5.75943 4.59986 4.58809 5.83323 3.76398C7.0666 2.93987 8.51664 2.5 10 2.5C12.1 2.5 14.1083 3.33333 15.6167 4.78333L17.5 6.66667"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.4987 2.5V6.66667H13.332"
                stroke="#364153"
                stroke-width="1.66667"
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
              Rotate
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
