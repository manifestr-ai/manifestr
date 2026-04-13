import React from "react";

interface EditorBottomToolbarProps {
  activeTool: string;
  setActiveTool: (tool: any) => void;
  editorType?: string;
}

const tools = [
  {
    key: "ai",
    label: "AI Prompter",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_10297_388369)">
          <path
            d="M7.34496 1.87239C7.37353 1.71946 7.45468 1.58133 7.57436 1.48193C7.69404 1.38254 7.84472 1.32812 8.00029 1.32812C8.15587 1.32812 8.30655 1.38254 8.42623 1.48193C8.54591 1.58133 8.62706 1.71946 8.65563 1.87239L9.35629 5.57772C9.40606 5.84115 9.53408 6.08347 9.72365 6.27304C9.91322 6.4626 10.1555 6.59062 10.419 6.64039L14.1243 7.34106C14.2772 7.36962 14.4154 7.45077 14.5147 7.57045C14.6141 7.69014 14.6686 7.84081 14.6686 7.99639C14.6686 8.15196 14.6141 8.30264 14.5147 8.42232C14.4154 8.54201 14.2772 8.62316 14.1243 8.65172L10.419 9.35239C10.1555 9.40215 9.91322 9.53017 9.72365 9.71974C9.53408 9.90931 9.40606 10.1516 9.35629 10.4151L8.65563 14.1204C8.62706 14.2733 8.54591 14.4114 8.42623 14.5108C8.30655 14.6102 8.15587 14.6647 8.00029 14.6647C7.84472 14.6647 7.69404 14.6102 7.57436 14.5108C7.45468 14.4114 7.37353 14.2733 7.34496 14.1204L6.64429 10.4151C6.59453 10.1516 6.46651 9.90931 6.27694 9.71974C6.08737 9.53017 5.84506 9.40215 5.58163 9.35239L1.87629 8.65172C1.72336 8.62316 1.58524 8.54201 1.48584 8.42232C1.38644 8.30264 1.33203 8.15196 1.33203 7.99639C1.33203 7.84081 1.38644 7.69014 1.48584 7.57045C1.58524 7.45077 1.72336 7.36962 1.87629 7.34106L5.58163 6.64039C5.84506 6.59062 6.08737 6.4626 6.27694 6.27304C6.46651 6.08347 6.59453 5.84115 6.64429 5.57772L7.34496 1.87239Z"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.332 1.33594V4.0026"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.6667 2.66406H12"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_10297_388369">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    editor_for: ["presentation", "image"],
  },
  {
    key: "format",
    label: "Format",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 2.66406V13.3307"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.66797 4.66406V3.33073C2.66797 3.15392 2.73821 2.98435 2.86323 2.85932C2.98826 2.7343 3.15782 2.66406 3.33464 2.66406H12.668C12.8448 2.66406 13.0143 2.7343 13.1394 2.85932C13.2644 2.98435 13.3346 3.15392 13.3346 3.33073V4.66406"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6 13.3359H10"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["presentation", "image"],
  },
  {
    key: "insert",
    label: "Insert",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.33203 8H12.6654"
          stroke="#101828"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 3.33594V12.6693"
          stroke="#101828"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["presentation", "image"],
  },
  {
    key: "layout",
    label: "Layout",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2 6H14"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6 14V6"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["presentation"],
  },
  {
    key: "arrange",
    label: "Arrange",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_10297_388336)">
          <path
            d="M8 1.33594V14.6693"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 12.6641L8 14.6641L6 12.6641"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.668 6L14.668 8L12.668 10"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1.33203 8H14.6654"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.33203 6L1.33203 8L3.33203 10"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 3.33594L8 1.33594L10 3.33594"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_10297_388336">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    editor_for: ["presentation"],
  },
  {
    key: "style",
    label: "Style",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_10297_388346)">
          <path
            d="M9.74891 11.9342L2.62891 9.99219"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.2516 1.75043C12.383 1.61902 12.539 1.51478 12.7107 1.44366C12.8824 1.37254 13.0664 1.33594 13.2523 1.33594C13.4381 1.33594 13.6221 1.37254 13.7938 1.44366C13.9655 1.51478 14.1215 1.61902 14.2529 1.75043C14.3843 1.88184 14.4886 2.03784 14.5597 2.20954C14.6308 2.38123 14.6674 2.56525 14.6674 2.75109C14.6674 2.93694 14.6308 3.12096 14.5597 3.29265C14.4886 3.46435 14.3843 3.62035 14.2529 3.75176L11.5743 6.43109C11.5118 6.4936 11.4767 6.57837 11.4767 6.66676C11.4767 6.75515 11.5118 6.83992 11.5743 6.90243L12.2036 7.53176C12.5048 7.83306 12.6741 8.24169 12.6741 8.66776C12.6741 9.09383 12.5048 9.50246 12.2036 9.80376L11.5743 10.4331C11.5117 10.4956 11.427 10.5307 11.3386 10.5307C11.2502 10.5307 11.1654 10.4956 11.1029 10.4331L5.57025 4.90109C5.50776 4.83858 5.47266 4.75382 5.47266 4.66543C5.47266 4.57704 5.50776 4.49227 5.57025 4.42976L6.19959 3.80043C6.50089 3.49917 6.90951 3.32993 7.33559 3.32993C7.76166 3.32993 8.17028 3.49917 8.47159 3.80043L9.10092 4.42976C9.16343 4.49225 9.2482 4.52736 9.33659 4.52736C9.42497 4.52736 9.50974 4.49225 9.57225 4.42976L12.2516 1.75043Z"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.0019 5.33594C4.79923 7.1426 3.35523 7.6426 1.61323 7.96794C1.55544 7.97849 1.5014 8.00392 1.45644 8.04172C1.41147 8.07952 1.37713 8.12839 1.35681 8.1835C1.33649 8.23862 1.33088 8.29808 1.34054 8.35603C1.3502 8.41397 1.3748 8.4684 1.4119 8.51394L6.2919 14.4359C6.39102 14.5412 6.52168 14.6114 6.66418 14.6359C6.80667 14.6605 6.95328 14.638 7.0819 14.5719C8.4919 13.6059 10.6686 11.1973 10.6686 10.0026"
            stroke="#D1D5DC"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_10297_388346">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    editor_for: ["presentation"],
  },
  {
    key: "transition",
    label: "Transitions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.33203 8H12.6654"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 3.33594L12.6667 8.0026L8 12.6693"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["presentation"],
  },
  {
    key: "animation",
    label: "Animations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M2.66503 9.32986C2.53888 9.33029 2.41519 9.29492 2.30834 9.22785C2.20148 9.16078 2.11586 9.06477 2.0614 8.95097C2.00694 8.83717 1.9859 8.71025 2.0007 8.58497C2.0155 8.45968 2.06555 8.34117 2.14503 8.24319L8.74503 1.44319C8.79454 1.38605 8.86201 1.34743 8.93636 1.33368C9.0107 1.31993 9.08752 1.33187 9.15419 1.36753C9.22086 1.40319 9.27342 1.46046 9.30326 1.52993C9.33309 1.59941 9.33842 1.67696 9.31837 1.74986L8.03837 5.76319C8.00062 5.86421 7.98795 5.97287 8.00143 6.07987C8.01491 6.18686 8.05414 6.28898 8.11576 6.37748C8.17738 6.46598 8.25955 6.5382 8.35522 6.58797C8.45089 6.63773 8.5572 6.66355 8.66503 6.66319H13.3317C13.4579 6.66276 13.5815 6.69814 13.6884 6.76521C13.7952 6.83228 13.8809 6.92829 13.9353 7.04209C13.9898 7.15589 14.0108 7.2828 13.996 7.40809C13.9812 7.53338 13.9312 7.65189 13.8517 7.74986L7.2517 14.5499C7.20219 14.607 7.13473 14.6456 7.06038 14.6594C6.98603 14.6731 6.90922 14.6612 6.84255 14.6255C6.77588 14.5899 6.72331 14.5326 6.69348 14.4631C6.66364 14.3936 6.65832 14.3161 6.67837 14.2432L7.95837 10.2299C7.99611 10.1288 8.00879 10.0202 7.99531 9.91319C7.98183 9.8062 7.94259 9.70407 7.88097 9.61558C7.81935 9.52708 7.73719 9.45485 7.64152 9.40509C7.54585 9.35532 7.43954 9.32951 7.3317 9.32986H2.66503Z"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["presentation"],
  },
  {
    key: "slideshow",
    label: "Slide Show",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.33203 3.33373C3.33196 3.09912 3.39379 2.86865 3.51129 2.66559C3.62878 2.46252 3.79777 2.29406 4.0012 2.17719C4.20463 2.06033 4.43529 1.99921 4.66989 2.00001C4.90449 2.0008 5.13474 2.06349 5.33736 2.18173L13.3354 6.84706C13.5372 6.96418 13.7048 7.13223 13.8213 7.3344C13.9379 7.53657 13.9993 7.76579 13.9995 7.99915C13.9997 8.23251 13.9387 8.46184 13.8225 8.66422C13.7063 8.86659 13.539 9.03493 13.3374 9.15239L5.33736 13.8191C5.13474 13.9373 4.90449 14 4.66989 14.0008C4.43529 14.0016 4.20463 13.9405 4.0012 13.8236C3.79777 13.7067 3.62878 13.5383 3.51129 13.3352C3.39379 13.1321 3.33196 12.9017 3.33203 12.6671V3.33373Z"
          stroke="#D1D5DC"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["presentation"],
  },

  {
    key: "adjust",
    label: "Adjust",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clipPath="url(#clip0_10291_378997)">
          <path
            d="M7.9987 10.6654C9.47146 10.6654 10.6654 9.47146 10.6654 7.9987C10.6654 6.52594 9.47146 5.33203 7.9987 5.33203C6.52594 5.33203 5.33203 6.52594 5.33203 7.9987C5.33203 9.47146 6.52594 10.6654 7.9987 10.6654Z"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 1.33203V2.66536"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 13.332V14.6654"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.28516 3.28516L4.22516 4.22516"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.7734 11.7734L12.7134 12.7134"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.33203 8H2.66536"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.332 8H14.6654"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.22516 11.7734L3.28516 12.7134"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.7134 3.28516L11.7734 4.22516"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_10291_378997">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    editor_for: ["image"],
  },
  {
    key: "text",
    label: "Text",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 2.66797V13.3346"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.66797 4.66797V3.33464C2.66797 3.15782 2.73821 2.98826 2.86323 2.86323C2.98826 2.73821 3.15782 2.66797 3.33464 2.66797H12.668C12.8448 2.66797 13.0143 2.73821 13.1394 2.86323C13.2644 2.98826 13.3346 3.15782 13.3346 3.33464V4.66797"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 13.332H10"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    editor_for: ["image"],
  },
  {
    key: "color",
    label: "Color",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M7.9987 14.6654C6.23059 14.6654 4.5349 13.963 3.28465 12.7127C2.03441 11.4625 1.33203 9.76681 1.33203 7.9987C1.33203 6.23059 2.03441 4.5349 3.28465 3.28465C4.5349 2.03441 6.23059 1.33203 7.9987 1.33203C9.76681 1.33203 11.4625 1.96417 12.7127 3.08939C13.963 4.21461 14.6654 5.74073 14.6654 7.33203C14.6654 8.21609 14.3142 9.06393 13.6891 9.68905C13.0639 10.3142 12.2161 10.6654 11.332 10.6654H9.83203C9.61537 10.6654 9.40298 10.7257 9.21868 10.8396C9.03437 10.9535 8.88543 11.1165 8.78853 11.3103C8.69164 11.5041 8.65062 11.721 8.67008 11.9368C8.68954 12.1526 8.7687 12.3587 8.8987 12.532L9.0987 12.7987C9.2287 12.972 9.30786 13.1781 9.32732 13.3939C9.34677 13.6097 9.30576 13.8267 9.20886 14.0204C9.11197 14.2142 8.96302 14.3772 8.77872 14.4911C8.59441 14.605 8.38203 14.6654 8.16536 14.6654H7.9987Z"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.0013 4.66667C9.1854 4.66667 9.33464 4.51743 9.33464 4.33333C9.33464 4.14924 9.1854 4 9.0013 4C8.81721 4 8.66797 4.14924 8.66797 4.33333C8.66797 4.51743 8.81721 4.66667 9.0013 4.66667Z"
          fill="#D1D5DC"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6654 7.33464C11.8495 7.33464 11.9987 7.1854 11.9987 7.0013C11.9987 6.81721 11.8495 6.66797 11.6654 6.66797C11.4813 6.66797 11.332 6.81721 11.332 7.0013C11.332 7.1854 11.4813 7.33464 11.6654 7.33464Z"
          fill="#D1D5DC"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.33333 8.66667C4.51743 8.66667 4.66667 8.51743 4.66667 8.33333C4.66667 8.14924 4.51743 8 4.33333 8C4.14924 8 4 8.14924 4 8.33333C4 8.51743 4.14924 8.66667 4.33333 8.66667Z"
          fill="#D1D5DC"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.66536 5.33464C5.84946 5.33464 5.9987 5.1854 5.9987 5.0013C5.9987 4.81721 5.84946 4.66797 5.66536 4.66797C5.48127 4.66797 5.33203 4.81721 5.33203 5.0013C5.33203 5.1854 5.48127 5.33464 5.66536 5.33464Z"
          fill="#D1D5DC"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    editor_for: ["image"],
  },
  {
    key: "effects",
    label: "Effects",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clipPath="url(#clip0_10291_379026)">
          <path
            d="M7.34496 1.87629C7.37353 1.72336 7.45468 1.58524 7.57436 1.48584C7.69404 1.38644 7.84472 1.33203 8.00029 1.33203C8.15587 1.33203 8.30655 1.38644 8.42623 1.48584C8.54591 1.58524 8.62706 1.72336 8.65563 1.87629L9.35629 5.58163C9.40606 5.84506 9.53408 6.08737 9.72365 6.27694C9.91322 6.46651 10.1555 6.59453 10.419 6.64429L14.1243 7.34496C14.2772 7.37353 14.4154 7.45468 14.5147 7.57436C14.6141 7.69404 14.6686 7.84472 14.6686 8.00029C14.6686 8.15587 14.6141 8.30655 14.5147 8.42623C14.4154 8.54591 14.2772 8.62706 14.1243 8.65563L10.419 9.35629C10.1555 9.40606 9.91322 9.53408 9.72365 9.72365C9.53408 9.91322 9.40606 10.1555 9.35629 10.419L8.65563 14.1243C8.62706 14.2772 8.54591 14.4154 8.42623 14.5147C8.30655 14.6141 8.15587 14.6686 8.00029 14.6686C7.84472 14.6686 7.69404 14.6141 7.57436 14.5147C7.45468 14.4154 7.37353 14.2772 7.34496 14.1243L6.64429 10.419C6.59453 10.1555 6.46651 9.91322 6.27694 9.72365C6.08737 9.53408 5.84506 9.40606 5.58163 9.35629L1.87629 8.65563C1.72336 8.62706 1.58524 8.54591 1.48584 8.42623C1.38644 8.30655 1.33203 8.15587 1.33203 8.00029C1.33203 7.84472 1.38644 7.69404 1.48584 7.57436C1.58524 7.45468 1.72336 7.37353 1.87629 7.34496L5.58163 6.64429C5.84506 6.59453 6.08737 6.46651 6.27694 6.27694C6.46651 6.08737 6.59453 5.84506 6.64429 5.58163L7.34496 1.87629Z"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.332 1.33203V3.9987"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.6667 2.66797H12"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
            stroke="#D1D5DC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_10291_379026">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    editor_for: ["image"],
  },
  {
    key: "filter",
    label: "Filters",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M6.66512 13.3333C6.66507 13.4572 6.69953 13.5787 6.76465 13.6841C6.82977 13.7895 6.92297 13.8746 7.03379 13.93L8.36712 14.5967C8.46879 14.6475 8.58175 14.6714 8.69529 14.6663C8.80882 14.6612 8.91916 14.6271 9.01581 14.5673C9.11247 14.5075 9.19224 14.424 9.24754 14.3247C9.30284 14.2254 9.33184 14.1137 9.33179 14V9.33333C9.33194 9.00292 9.45477 8.68433 9.67646 8.43933L14.4918 3.11333C14.5781 3.01771 14.6349 2.89912 14.6552 2.77192C14.6755 2.64472 14.6586 2.51435 14.6064 2.39658C14.5542 2.27881 14.469 2.17868 14.3611 2.1083C14.2532 2.03792 14.1273 2.0003 13.9985 2H1.99846C1.86953 2.00005 1.74338 2.03748 1.63529 2.10776C1.5272 2.17804 1.44181 2.27815 1.38946 2.39598C1.33711 2.5138 1.32005 2.64427 1.34034 2.77159C1.36063 2.89892 1.41741 3.01762 1.50379 3.11333L6.32046 8.43933C6.54215 8.68433 6.66497 9.00292 6.66512 9.33333V13.3333Z"
          stroke="#D1D5DC"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    editor_for: ["image"],
  },
  {
    key: "ai",
    label: "AI Prompter",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_10297_388369)">
          <path
            d="M7.34496 1.87239C7.37353 1.71946 7.45468 1.58133 7.57436 1.48193C7.69404 1.38254 7.84472 1.32812 8.00029 1.32812C8.15587 1.32812 8.30655 1.38254 8.42623 1.48193C8.54591 1.58133 8.62706 1.71946 8.65563 1.87239L9.35629 5.57772C9.40606 5.84115 9.53408 6.08347 9.72365 6.27304C9.91322 6.4626 10.1555 6.59062 10.419 6.64039L14.1243 7.34106C14.2772 7.36962 14.4154 7.45077 14.5147 7.57045C14.6141 7.69014 14.6686 7.84081 14.6686 7.99639C14.6686 8.15196 14.6141 8.30264 14.5147 8.42232C14.4154 8.54201 14.2772 8.62316 14.1243 8.65172L10.419 9.35239C10.1555 9.40215 9.91322 9.53017 9.72365 9.71974C9.53408 9.90931 9.40606 10.1516 9.35629 10.4151L8.65563 14.1204C8.62706 14.2733 8.54591 14.4114 8.42623 14.5108C8.30655 14.6102 8.15587 14.6647 8.00029 14.6647C7.84472 14.6647 7.69404 14.6102 7.57436 14.5108C7.45468 14.4114 7.37353 14.2733 7.34496 14.1204L6.64429 10.4151C6.59453 10.1516 6.46651 9.90931 6.27694 9.71974C6.08737 9.53017 5.84506 9.40215 5.58163 9.35239L1.87629 8.65172C1.72336 8.62316 1.58524 8.54201 1.48584 8.42232C1.38644 8.30264 1.33203 8.15196 1.33203 7.99639C1.33203 7.84081 1.38644 7.69014 1.48584 7.57045C1.58524 7.45077 1.72336 7.36962 1.87629 7.34106L5.58163 6.64039C5.84506 6.59062 6.08737 6.4626 6.27694 6.27304C6.46651 6.08347 6.59453 5.84115 6.64429 5.57772L7.34496 1.87239Z"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.332 1.33594V4.0026"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.6667 2.66406H12"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_10297_388369">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    editor_for: ["chart"],
  },
  {
    key: "home",
    label: "Home",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M2 6L8 1.33333L14 6V13.3333C14 13.687 13.8595 14.0261 13.6095 14.2761C13.3594 14.5262 13.0203 14.6667 12.6667 14.6667H3.33333C2.97971 14.6667 2.64057 14.5262 2.39052 14.2761C2.14048 14.0261 2 13.687 2 13.3333V6Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 14.6667V8H10V14.6667"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    editor_for: ["chart"],
  },
  {
    key: "insert",
    label: "Insert",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.33203 8H12.6654"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 3.33594V12.6693"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["chart"],
  },
  {
    key: "format",
    label: "Format",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 2.66406V13.3307"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.66797 4.66406V3.33073C2.66797 3.15392 2.73821 2.98435 2.86323 2.85932C2.98826 2.7343 3.15782 2.66406 3.33464 2.66406H12.668C12.8448 2.66406 13.0143 2.7343 13.1394 2.85932C13.2644 2.98435 13.3346 3.15392 13.3346 3.33073V4.66406"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6 13.3359H10"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["chart"],
  },
  {
    key: "charts",
    label: "Charts",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M2 2V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H14"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 11.3333V6"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.66797 11.3359V3.33594"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.33203 11.3359V9.33594"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    editor_for: ["chart"],
  },
  {
    key: "data",
    label: "Data",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 6H14"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 10H14"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 2V14"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 2V14"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    editor_for: ["chart"],
  },
  {
    key: "page-layout",
    label: "Page Layout",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2 6H14"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6 14V6"
          stroke="currentColor"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    editor_for: ["chart"],
  },
  {
    key: "style",
    label: "Style",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M7.9987 14.6654C6.23059 14.6654 4.5349 13.963 3.28465 12.7127C2.03441 11.4625 1.33203 9.76681 1.33203 7.9987C1.33203 6.23059 2.03441 4.5349 3.28465 3.28465C4.5349 2.03441 6.23059 1.33203 7.9987 1.33203C9.76681 1.33203 11.4625 1.96417 12.7127 3.08939C13.963 4.21461 14.6654 5.74073 14.6654 7.33203C14.6654 8.21609 14.3142 9.06393 13.6891 9.68905C13.0639 10.3142 12.2161 10.6654 11.332 10.6654H9.83203C9.61537 10.6654 9.40298 10.7257 9.21868 10.8396C9.03437 10.9535 8.88543 11.1165 8.78853 11.3103C8.69164 11.5041 8.65062 11.721 8.67008 11.9368C8.68954 12.1526 8.7687 12.3587 8.8987 12.532L9.0987 12.7987C9.2287 12.972 9.30786 13.1781 9.32732 13.3939C9.34677 13.6097 9.30576 13.8267 9.20886 14.0204C9.11197 14.2142 8.96302 14.3772 8.77872 14.4911C8.59441 14.605 8.38203 14.6654 8.16536 14.6654H7.9987Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.0013 4.66667C9.1854 4.66667 9.33464 4.51743 9.33464 4.33333C9.33464 4.14924 9.1854 4 9.0013 4C8.81721 4 8.66797 4.14924 8.66797 4.33333C8.66797 4.51743 8.81721 4.66667 9.0013 4.66667Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6654 7.33464C11.8495 7.33464 11.9987 7.1854 11.9987 7.0013C11.9987 6.81721 11.8495 6.66797 11.6654 6.66797C11.4813 6.66797 11.332 6.81721 11.332 7.0013C11.332 7.1854 11.4813 7.33464 11.6654 7.33464Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.33333 8.66667C4.51743 8.66667 4.66667 8.51743 4.66667 8.33333C4.66667 8.14924 4.51743 8 4.33333 8C4.14924 8 4 8.14924 4 8.33333C4 8.51743 4.14924 8.66667 4.33333 8.66667Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.66536 5.33464C5.84946 5.33464 5.9987 5.1854 5.9987 5.0013C5.9987 4.81721 5.84946 4.66797 5.66536 4.66797C5.48127 4.66797 5.33203 4.81721 5.33203 5.0013C5.33203 5.1854 5.48127 5.33464 5.66536 5.33464Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    editor_for: ["chart"],
  },
];

export default function EditorBottomToolbar({
  activeTool,
  setActiveTool,
  editorType,
}: EditorBottomToolbarProps) {
  return (
    <div className="h-[60px] bg-[#2F2F2F] text-white flex items-center px-6 gap-5 text-[13px]">
      {tools
        .filter(
          (tool) =>
            Array.isArray(tool.editor_for) &&
            tool.editor_for.includes(editorType),
        )
        .map((tool) => {
          const isActive = activeTool === tool.key;

          return (
            <button
              key={tool.key}
              onClick={() => setActiveTool(tool.key)}
              className={`
                px-3 py-1.5 rounded-md transition
                flex items-center gap-2
                ${
                  isActive
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
                }
              `}
            >
              <span className="w-4 h-4 flex items-center">{tool.icon}</span>
              {tool.label}
            </button>
          );
        })}
    </div>
  );
}
