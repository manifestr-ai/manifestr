import React from "react";

interface FormulasPanelProps {
  store: any;
}

export default function FormulasPanel({ store }: FormulasPanelProps) {
  if (!store) return null;

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 overflow-x-auto">
      {/* Math & Trig */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Math & Trig
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* SUM */}
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
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              SUM
            </span>
          </button>

          {/* AVERAGE */}
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
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              AVERAGE
            </span>
          </button>

          {/* ROUND */}
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
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              ROUND
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Logical */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Logical
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* IF */}
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
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              IF
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Lookup */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Lookup
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* VLOOKUP */}
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
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              VLOOKUP
            </span>
          </button>

          {/* INDEX */}
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
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              INDEX
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Text */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Text
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* CONCAT */}
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
                d="M15.0026 1.66406H5.0026C4.08213 1.66406 3.33594 2.41025 3.33594 3.33073V16.6641C3.33594 17.5845 4.08213 18.3307 5.0026 18.3307H15.0026C15.9231 18.3307 16.6693 17.5845 16.6693 16.6641V3.33073C16.6693 2.41025 15.9231 1.66406 15.0026 1.66406Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 5H13.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 11.6641V14.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 8.33594H13.3443"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 8.33594H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 8.33594H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11.6641H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 11.6641H6.6724"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15H10.0083"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66406 15H6.6724"
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
              CONCAT
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Number Formats */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Number Formats
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Currency */}
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
                d="M10 1.66406V18.3307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1667 4.16406H7.91667C7.14312 4.16406 6.40125 4.47135 5.85427 5.01833C5.30729 5.56532 5 6.30718 5 7.08073C5 7.85428 5.30729 8.59614 5.85427 9.14312C6.40125 9.69011 7.14312 9.9974 7.91667 9.9974H12.0833C12.8569 9.9974 13.5987 10.3047 14.1457 10.8517C14.6927 11.3986 15 12.1405 15 12.9141C15 13.6876 14.6927 14.4295 14.1457 14.9765C13.5987 15.5234 12.8569 15.8307 12.0833 15.8307H5"
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
              Currency
            </span>
          </button>

          {/* Percentage */}
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
                d="M15.8307 4.16406L4.16406 15.8307"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.41927 7.5026C6.56986 7.5026 7.5026 6.56986 7.5026 5.41927C7.5026 4.26868 6.56986 3.33594 5.41927 3.33594C4.26868 3.33594 3.33594 4.26868 3.33594 5.41927C3.33594 6.56986 4.26868 7.5026 5.41927 7.5026Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.5833 16.6667C15.7339 16.6667 16.6667 15.7339 16.6667 14.5833C16.6667 13.4327 15.7339 12.5 14.5833 12.5C13.4327 12.5 12.5 13.4327 12.5 14.5833C12.5 15.7339 13.4327 16.6667 14.5833 16.6667Z"
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
              Percentage
            </span>
          </button>

          {/* Dates */}
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
                d="M6.66406 1.66406V4.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3359 1.66406V4.9974"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.8333 3.33594H4.16667C3.24619 3.33594 2.5 4.08213 2.5 5.0026V16.6693C2.5 17.5897 3.24619 18.3359 4.16667 18.3359H15.8333C16.7538 18.3359 17.5 17.5897 17.5 16.6693V5.0026C17.5 4.08213 16.7538 3.33594 15.8333 3.33594Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 8.33594H17.5"
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
              Dates
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Advanced */}
      <div className="flex flex-col items-center min-w-[300px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Advanced
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Durations */}
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
                d="M10 5V10L13.3333 11.6667"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.9974 18.3307C14.5998 18.3307 18.3307 14.5998 18.3307 9.9974C18.3307 5.39502 14.5998 1.66406 9.9974 1.66406C5.39502 1.66406 1.66406 5.39502 1.66406 9.9974C1.66406 14.5998 5.39502 18.3307 9.9974 18.3307Z"
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
              Durations
            </span>
          </button>

          {/* Custom */}
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
                d="M11.6641 14.1641H4.16406"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.8359 5.83594H8.33594"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1641 16.6641C15.5448 16.6641 16.6641 15.5448 16.6641 14.1641C16.6641 12.7834 15.5448 11.6641 14.1641 11.6641C12.7834 11.6641 11.6641 12.7834 11.6641 14.1641C11.6641 15.5448 12.7834 16.6641 14.1641 16.6641Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83594 8.33594C7.21665 8.33594 8.33594 7.21665 8.33594 5.83594C8.33594 4.45523 7.21665 3.33594 5.83594 3.33594C4.45523 3.33594 3.33594 4.45523 3.33594 5.83594C3.33594 7.21665 4.45523 8.33594 5.83594 8.33594Z"
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
              Custom
            </span>
          </button>

          {/* Excel-Compatible */}
          <button
            className="flex flex-col items-center justify-center w-[80px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
                d="M3.33594 18.3307H15.0026C15.4446 18.3307 15.8686 18.1551 16.1811 17.8426C16.4937 17.53 16.6693 17.1061 16.6693 16.6641V5.83073L12.5026 1.66406H5.0026C4.56058 1.66406 4.13665 1.83966 3.82409 2.15222C3.51153 2.46478 3.33594 2.8887 3.33594 3.33073V6.66406"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.6641 1.66406V4.9974C11.6641 5.43942 11.8397 5.86335 12.1522 6.17591C12.4648 6.48847 12.8887 6.66406 13.3307 6.66406H16.6641"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 12.5026L4.16667 14.1693L7.5 10.8359"
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
              Excel-Compatible
            </span>
          </button>

       
        </div>
      </div>
    </div>
  );
}
