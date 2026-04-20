import React from "react";

interface SlideShowPanelProps {
  store: any;
}

export default function SlideShowPanel({ store }: SlideShowPanelProps) {
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
      {/* Present */}
      <div className="flex flex-col items-center min-w-[250px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Present
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* From Start */}
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
                d="M3.33203 3.33373C3.33196 3.09912 3.39379 2.86865 3.51129 2.66559C3.62878 2.46252 3.79777 2.29406 4.0012 2.17719C4.20463 2.06033 4.43529 1.99921 4.66989 2.00001C4.90449 2.0008 5.13474 2.06349 5.33736 2.18173L13.3354 6.84706C13.5372 6.96418 13.7048 7.13223 13.8213 7.3344C13.9379 7.53657 13.9993 7.76579 13.9995 7.99915C13.9997 8.23251 13.9387 8.46184 13.8225 8.66422C13.7063 8.86659 13.539 9.03493 13.3374 9.15239L5.33736 13.8191C5.13474 13.9373 4.90449 14 4.66989 14.0008C4.43529 14.0016 4.20463 13.9405 4.0012 13.8236C3.79777 13.7067 3.62878 13.5383 3.51129 13.3352C3.39379 13.1321 3.33196 12.9017 3.33203 12.6671V3.33373Z"
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
              From Start
            </span>
          </button>

          {/* Presenter View */}
          <button
            className="flex flex-col items-center justify-center w-[85px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
              <g clip-path="url(#clip0_10298_390709)">
                <path
                  d="M13.332 2H2.66536C1.92898 2 1.33203 2.59695 1.33203 3.33333V10C1.33203 10.7364 1.92898 11.3333 2.66536 11.3333H13.332C14.0684 11.3333 14.6654 10.7364 14.6654 10V3.33333C14.6654 2.59695 14.0684 2 13.332 2Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.33203 14H10.6654"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 11.3359V14.0026"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10298_390709">
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
              Presenter View
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Setup */}
      <div className="flex flex-col items-center min-w-[180px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Setup
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Slide Show Settings */}
          <button
            className="flex flex-col items-center justify-center w-[100px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
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
              <g clip-path="url(#clip0_10298_390720)">
                <path
                  d="M6.44558 2.75613C6.48232 2.36969 6.66181 2.01083 6.94898 1.74965C7.23616 1.48848 7.6104 1.34375 7.99858 1.34375C8.38677 1.34375 8.761 1.48848 9.04818 1.74965C9.33536 2.01083 9.51485 2.36969 9.55158 2.75613C9.57366 3.00577 9.65556 3.24641 9.79034 3.45769C9.92512 3.66897 10.1088 3.84467 10.3259 3.96992C10.543 4.09516 10.787 4.16627 11.0374 4.17721C11.2878 4.18816 11.5371 4.13862 11.7643 4.0328C12.117 3.87265 12.5167 3.84948 12.8856 3.96779C13.2545 4.0861 13.5661 4.33743 13.7599 4.67287C13.9537 5.0083 14.0158 5.40385 13.934 5.78251C13.8522 6.16118 13.6325 6.49588 13.3176 6.72147C13.1125 6.86536 12.9451 7.05654 12.8295 7.27882C12.714 7.50109 12.6536 7.74794 12.6536 7.99847C12.6536 8.24899 12.714 8.49584 12.8295 8.71812C12.9451 8.94039 13.1125 9.13157 13.3176 9.27547C13.6325 9.50105 13.8522 9.83575 13.934 10.2144C14.0158 10.5931 13.9537 10.9886 13.7599 11.3241C13.5661 11.6595 13.2545 11.9108 12.8856 12.0291C12.5167 12.1475 12.117 12.1243 11.7643 11.9641C11.5371 11.8583 11.2878 11.8088 11.0374 11.8197C10.787 11.8307 10.543 11.9018 10.3259 12.027C10.1088 12.1523 9.92512 12.328 9.79034 12.5392C9.65556 12.7505 9.57366 12.9912 9.55158 13.2408C9.51485 13.6272 9.33536 13.9861 9.04818 14.2473C8.761 14.5085 8.38677 14.6532 7.99858 14.6532C7.6104 14.6532 7.23616 14.5085 6.94898 14.2473C6.66181 13.9861 6.48232 13.6272 6.44558 13.2408C6.42355 12.9911 6.34165 12.7503 6.20683 12.539C6.07201 12.3276 5.88823 12.1519 5.67107 12.0266C5.45391 11.9014 5.20976 11.8303 4.9593 11.8194C4.70884 11.8085 4.45945 11.8582 4.23225 11.9641C3.87951 12.1243 3.4798 12.1475 3.11092 12.0291C2.74203 11.9108 2.43036 11.6595 2.23657 11.3241C2.04278 10.9886 1.98073 10.5931 2.06249 10.2144C2.14425 9.83575 2.36398 9.50105 2.67892 9.27547C2.884 9.13157 3.0514 8.94039 3.16698 8.71812C3.28255 8.49584 3.34289 8.24899 3.34289 7.99847C3.34289 7.74794 3.28255 7.50109 3.16698 7.27882C3.0514 7.05654 2.884 6.86536 2.67892 6.72147C2.36443 6.49576 2.14508 6.1612 2.06352 5.78279C1.98195 5.40438 2.04399 5.00916 2.23757 4.67394C2.43116 4.33872 2.74246 4.08745 3.11098 3.96896C3.4795 3.85047 3.87891 3.87322 4.23158 4.0328C4.45876 4.13862 4.70808 4.18816 4.95845 4.17721C5.20882 4.16627 5.45287 4.09516 5.66994 3.96992C5.88701 3.84467 6.07071 3.66897 6.20549 3.45769C6.34028 3.24641 6.42217 3.00577 6.44425 2.75613"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10298_390720">
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
              Slide Show Settings
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
