import React from "react";

interface DataPanelProps {
  store: any;
}

export default function DataPanel({ store }: DataPanelProps) {
  if (!store) return null;

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0">
      {/* Sort & Filter */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Sort & Filter
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Sort */}
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
                d="M17.4987 13.3359L14.1654 16.6693L10.832 13.3359"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.168 16.6693V3.33594"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.5 6.66927L5.83333 3.33594L9.16667 6.66927"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83203 3.33594V16.6693"
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
              Sort
            </span>
          </button>

          {/* Filter */}
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
                d="M8.33433 16.6667C8.33426 16.8215 8.37734 16.9733 8.45874 17.1051C8.54014 17.2368 8.65664 17.3433 8.79517 17.4125L10.4618 18.2458C10.5889 18.3093 10.7301 18.3393 10.872 18.3329C11.014 18.3264 11.1519 18.2838 11.2727 18.2091C11.3935 18.1344 11.4932 18.03 11.5624 17.9059C11.6315 17.7818 11.6677 17.6421 11.6677 17.5V11.6667C11.6679 11.2537 11.8214 10.8554 12.0985 10.5492L18.1177 3.89167C18.2256 3.77213 18.2965 3.6239 18.3219 3.4649C18.3473 3.3059 18.3262 3.14294 18.2609 2.99573C18.1957 2.84851 18.0892 2.72335 17.9543 2.63538C17.8195 2.5474 17.662 2.50038 17.501 2.5H2.501C2.33984 2.50006 2.18215 2.54685 2.04704 2.6347C1.91193 2.72255 1.80519 2.84769 1.73976 2.99497C1.67432 3.14225 1.65299 3.30534 1.67836 3.46449C1.70372 3.62364 1.77469 3.77203 1.88267 3.89167L7.9035 10.5492C8.18062 10.8554 8.33415 11.2537 8.33433 11.6667V16.6667Z"
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
              Filter
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Data Tools */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Data Tools
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Text to Columns */}
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
                d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
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
              Text to Columns
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Outline */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Outline
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Group */}
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
                d="M2.5 5.83333V4.16667C2.5 3.25 3.25 2.5 4.16667 2.5H5.83333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.168 2.5H15.8346C16.7513 2.5 17.5013 3.25 17.5013 4.16667V5.83333"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5013 14.1641V15.8307C17.5013 16.7474 16.7513 17.4974 15.8346 17.4974H14.168"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83333 17.4974H4.16667C3.25 17.4974 2.5 16.7474 2.5 15.8307V14.1641"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.832 5.83594H6.66536C6.20513 5.83594 5.83203 6.20903 5.83203 6.66927V9.16927C5.83203 9.62951 6.20513 10.0026 6.66536 10.0026H10.832C11.2923 10.0026 11.6654 9.62951 11.6654 9.16927V6.66927C11.6654 6.20903 11.2923 5.83594 10.832 5.83594Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.332 10H9.16536C8.70513 10 8.33203 10.3731 8.33203 10.8333V13.3333C8.33203 13.7936 8.70513 14.1667 9.16536 14.1667H13.332C13.7923 14.1667 14.1654 13.7936 14.1654 13.3333V10.8333C14.1654 10.3731 13.7923 10 13.332 10Z"
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
              Group
            </span>
          </button>

          {/* Ungroup */}
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
                d="M10.0013 3.33594H5.0013C4.54106 3.33594 4.16797 3.70903 4.16797 4.16927V7.5026C4.16797 7.96284 4.54106 8.33594 5.0013 8.33594H10.0013C10.4615 8.33594 10.8346 7.96284 10.8346 7.5026V4.16927C10.8346 3.70903 10.4615 3.33594 10.0013 3.33594Z"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.0013 11.6641H10.0013C9.54106 11.6641 9.16797 12.0372 9.16797 12.4974V15.8307C9.16797 16.291 9.54106 16.6641 10.0013 16.6641H15.0013C15.4615 16.6641 15.8346 16.291 15.8346 15.8307V12.4974C15.8346 12.0372 15.4615 11.6641 15.0013 11.6641Z"
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
              Ungroup
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Get External Data */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Get External Data
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Import */}
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
                d="M10 2.5V12.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1654 6.66667L9.9987 2.5L5.83203 6.66667"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
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
              Import
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Export */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Export
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Export */}
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
                d="M10 12.5V2.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
                stroke="#364153"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.83203 8.33594L9.9987 12.5026L14.1654 8.33594"
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
              Export
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
