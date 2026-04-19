import React from "react";

interface StylePanelProps {
  store: any;
}

export default function StylePanel({ store }: StylePanelProps) {
  if (!store) return null;

  return (
    <div className="h-[102px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0">
      {/* Insert Style */}
      <div className="flex flex-col items-center min-w-[120px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Insert Style
        </span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Insert Style */}
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
              <g clip-path="url(#clip0_10437_288210)">
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
              </g>
              <defs>
                <clipPath id="clip0_10437_288210">
                  <rect width="20" height="20" fill="white" />
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
              Insert Style
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />
      {/* Themes */}
      <div className="flex flex-col items-center min-w-[100px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-3">
          Themes
        </span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Select Theme */}
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
              <g clip-path="url(#clip0_10437_288223)">
                <path
                  d="M9.18022 2.34439C9.21593 2.15323 9.31737 1.98057 9.46697 1.85632C9.61658 1.73208 9.80492 1.66406 9.99939 1.66406C10.1939 1.66406 10.3822 1.73208 10.5318 1.85632C10.6814 1.98057 10.7829 2.15323 10.8186 2.34439L11.6944 6.97606C11.7566 7.30535 11.9166 7.60824 12.1536 7.8452C12.3905 8.08216 12.6934 8.24219 13.0227 8.30439L17.6544 9.18022C17.8456 9.21593 18.0182 9.31737 18.1425 9.46697C18.2667 9.61658 18.3347 9.80492 18.3347 9.99939C18.3347 10.1939 18.2667 10.3822 18.1425 10.5318C18.0182 10.6814 17.8456 10.7829 17.6544 10.8186L13.0227 11.6944C12.6934 11.7566 12.3905 11.9166 12.1536 12.1536C11.9166 12.3905 11.7566 12.6934 11.6944 13.0227L10.8186 17.6544C10.7829 17.8456 10.6814 18.0182 10.5318 18.1425C10.3822 18.2667 10.1939 18.3347 9.99939 18.3347C9.80492 18.3347 9.61658 18.2667 9.46697 18.1425C9.31737 18.0182 9.21593 17.8456 9.18022 17.6544L8.30439 13.0227C8.24219 12.6934 8.08216 12.3905 7.8452 12.1536C7.60824 11.9166 7.30535 11.7566 6.97606 11.6944L2.34439 10.8186C2.15323 10.7829 1.98057 10.6814 1.85632 10.5318C1.73208 10.3822 1.66406 10.1939 1.66406 9.99939C1.66406 9.80492 1.73208 9.61658 1.85632 9.46697C1.98057 9.31737 2.15323 9.21593 2.34439 9.18022L6.97606 8.30439C7.30535 8.24219 7.60824 8.08216 7.8452 7.8452C8.08216 7.60824 8.24219 7.30535 8.30439 6.97606L9.18022 2.34439Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.668 1.66406V4.9974"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.3333 3.33594H15"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.33464 18.3333C4.25511 18.3333 5.0013 17.5871 5.0013 16.6667C5.0013 15.7462 4.25511 15 3.33464 15C2.41416 15 1.66797 15.7462 1.66797 16.6667C1.66797 17.5871 2.41416 18.3333 3.33464 18.3333Z"
                  stroke="#364153"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_10437_288223">
                  <rect width="20" height="20" fill="white" />
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
              Select Theme
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
