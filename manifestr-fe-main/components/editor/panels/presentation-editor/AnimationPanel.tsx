import React from "react";

interface AnimationPanelProps {
  store: any;
}

export default function AnimationPanel({ store }: AnimationPanelProps) {
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
      {/* Animation Effects */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Animation Effects
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Add Effect */}
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
              <g clip-path="url(#clip0_10297_389949)">
                <path
                  d="M2.66503 9.32986C2.53888 9.33029 2.41519 9.29492 2.30834 9.22785C2.20148 9.16078 2.11586 9.06477 2.0614 8.95097C2.00694 8.83717 1.9859 8.71025 2.0007 8.58497C2.0155 8.45968 2.06555 8.34117 2.14503 8.24319L8.74503 1.44319C8.79454 1.38605 8.86201 1.34743 8.93636 1.33368C9.0107 1.31993 9.08752 1.33187 9.15419 1.36753C9.22086 1.40319 9.27342 1.46046 9.30326 1.52993C9.33309 1.59941 9.33842 1.67696 9.31837 1.74986L8.03837 5.76319C8.00062 5.86421 7.98795 5.97287 8.00143 6.07987C8.01491 6.18686 8.05414 6.28898 8.11576 6.37748C8.17738 6.46598 8.25955 6.5382 8.35522 6.58797C8.45089 6.63773 8.5572 6.66355 8.66503 6.66319H13.3317C13.4579 6.66276 13.5815 6.69814 13.6884 6.76521C13.7952 6.83228 13.8809 6.92829 13.9353 7.04209C13.9898 7.15589 14.0108 7.2828 13.996 7.40809C13.9812 7.53338 13.9312 7.65189 13.8517 7.74986L7.2517 14.5499C7.20219 14.607 7.13473 14.6456 7.06038 14.6594C6.98603 14.6731 6.90922 14.6612 6.84255 14.6255C6.77588 14.5899 6.72331 14.5326 6.69348 14.4631C6.66364 14.3936 6.65832 14.3161 6.67837 14.2432L7.95837 10.2299C7.99611 10.1288 8.00879 10.0202 7.99531 9.91319C7.98183 9.8062 7.94259 9.70407 7.88097 9.61558C7.81935 9.52708 7.73719 9.45485 7.64152 9.40509C7.54585 9.35532 7.43954 9.32951 7.3317 9.32986H2.66503Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10297_389949">
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
              Add Effect
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Effect Options
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
              <g clip-path="url(#clip0_10297_389966)">
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
                <clipPath id="clip0_10297_389966">
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

      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Timing
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Start */}
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
              Start
            </span>
          </button>

          {/* Delay */}
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
              <g clip-path="url(#clip0_10297_389986)">
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
                <clipPath id="clip0_10297_389986">
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
              Delay
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      <div className="flex flex-col items-center min-w-[280px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Advanced
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Animation Pane */}
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
              <g clip-path="url(#clip0_10297_389997)">
                <path
                  d="M14.4285 2.42849L13.5752 1.57515C13.5001 1.49936 13.4108 1.4392 13.3124 1.39814C13.214 1.35708 13.1085 1.33594 13.0018 1.33594C12.8952 1.33594 12.7896 1.35708 12.6912 1.39814C12.5928 1.4392 12.5035 1.49936 12.4285 1.57515L1.57515 12.4285C1.49936 12.5035 1.4392 12.5928 1.39814 12.6912C1.35708 12.7896 1.33594 12.8952 1.33594 13.0018C1.33594 13.1085 1.35708 13.214 1.39814 13.3124C1.4392 13.4108 1.49936 13.5001 1.57515 13.5752L2.42849 14.4285C2.50303 14.5051 2.59218 14.566 2.69065 14.6076C2.78912 14.6491 2.89493 14.6706 3.00182 14.6706C3.10871 14.6706 3.21452 14.6491 3.31299 14.6076C3.41146 14.566 3.50061 14.5051 3.57515 14.4285L14.4285 3.57515C14.5051 3.50061 14.566 3.41146 14.6076 3.31299C14.6491 3.21452 14.6706 3.10871 14.6706 3.00182C14.6706 2.89493 14.6491 2.78912 14.6076 2.69065C14.566 2.59218 14.5051 2.50303 14.4285 2.42849Z"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.33203 4.66406L11.332 6.66406"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33203 4V6.66667"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.668 9.33594V12.0026"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.66797 1.33594V2.66927"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.66667 5.33594H2"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.9987 10.6641H11.332"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.33333 2H6"
                  stroke="#364153"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10297_389997">
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
              Animation Pane
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

          {/* Play All */}
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
              Play All
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
