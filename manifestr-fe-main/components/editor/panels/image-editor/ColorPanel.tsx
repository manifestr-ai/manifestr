import React, { useState, useEffect } from "react";

interface ColorPanelProps {
  store: any;
}

export default function ColorPanel({ store }: ColorPanelProps) {
  const selected = store.selectedElements?.[0];

  const [values, setValues] = useState({
    exposure: 0,
    brightness: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
  });

  // Apply simulated effects
  useEffect(() => {
    if (!selected) return;

    // Simulate brightness via opacity + slight tint
    selected.set({
      opacity: 1 - values.exposure * 0.01,
    });

    // Simulate contrast via scale trick (visual feel)
    selected.set({
      scaleX: 1 + values.contrast * 0.001,
      scaleY: 1 + values.contrast * 0.001,
    });
  }, [values, selected]);

  // if (!selected || selected.type !== "image") {
  //   return (
  //     <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
  //       Select an image to adjust
  //     </div>
  //   );
  // }

  const handleChange = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const resetAll = () => {
    setValues({
      exposure: 0,
      brightness: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
    });

    selected.set({
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
    });
  };

  const Slider = ({ label, keyName, icon }: any) => (
    <div className="flex items-center gap-3 flex-1">
      <span dangerouslySetInnerHTML={{ __html: icon }} />

      <div className="flex flex-col">
        <span className="text-[12px] text-[#6B7280]">{label}</span>

        <div className="flex items-center gap-3 mt-1">
          {/* slider */}
          <input
            type="range"
            min="-100"
            max="100"
            value={values[keyName]}
            onChange={(e) => handleChange(keyName, Number(e.target.value))}
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
            {values[keyName] > 0 ? `+${values[keyName]}` : values[keyName]}
          </span>
        </div>
      </div>
    </div>
  );

  let svgBright = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_10291_379220)">
    <path d="M7.9987 10.6654C9.47146 10.6654 10.6654 9.47146 10.6654 7.9987C10.6654 6.52594 9.47146 5.33203 7.9987 5.33203C6.52594 5.33203 5.33203 6.52594 5.33203 7.9987C5.33203 9.47146 6.52594 10.6654 7.9987 10.6654Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 1.33203V2.66536" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 13.332V14.6654" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.28516 3.28516L4.22516 4.22516" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.7734 11.7734L12.7134 12.7134" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1.33203 8H2.66536" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.332 8H14.6654" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.22516 11.7734L3.28516 12.7134" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.7134 3.28516L11.7734 4.22516" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_10291_379220">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`;
  let svgSaturation = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M7.9987 14.6667C9.23637 14.6667 10.4234 14.175 11.2985 13.2998C12.1737 12.4247 12.6654 11.2377 12.6654 10C12.6654 8.66667 11.9987 7.4 10.6654 6.33333C9.33203 5.26667 8.33203 3.66667 7.9987 2C7.66536 3.66667 6.66536 5.26667 5.33203 6.33333C3.9987 7.4 3.33203 8.66667 3.33203 10C3.33203 11.2377 3.8237 12.4247 4.69887 13.2998C5.57404 14.175 6.76102 14.6667 7.9987 14.6667Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  let svgVibrance = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_10291_379749)">
    <path d="M7.34496 1.87629C7.37353 1.72336 7.45468 1.58524 7.57436 1.48584C7.69404 1.38644 7.84472 1.33203 8.00029 1.33203C8.15587 1.33203 8.30655 1.38644 8.42623 1.48584C8.54591 1.58524 8.62706 1.72336 8.65563 1.87629L9.35629 5.58163C9.40606 5.84506 9.53408 6.08737 9.72365 6.27694C9.91322 6.46651 10.1555 6.59453 10.419 6.64429L14.1243 7.34496C14.2772 7.37353 14.4154 7.45468 14.5147 7.57436C14.6141 7.69404 14.6686 7.84472 14.6686 8.00029C14.6686 8.15587 14.6141 8.30655 14.5147 8.42623C14.4154 8.54591 14.2772 8.62706 14.1243 8.65563L10.419 9.35629C10.1555 9.40606 9.91322 9.53408 9.72365 9.72365C9.53408 9.91322 9.40606 10.1555 9.35629 10.419L8.65563 14.1243C8.62706 14.2772 8.54591 14.4154 8.42623 14.5147C8.30655 14.6141 8.15587 14.6686 8.00029 14.6686C7.84472 14.6686 7.69404 14.6141 7.57436 14.5147C7.45468 14.4154 7.37353 14.2772 7.34496 14.1243L6.64429 10.419C6.59453 10.1555 6.46651 9.91322 6.27694 9.72365C6.08737 9.53408 5.84506 9.40606 5.58163 9.35629L1.87629 8.65563C1.72336 8.62706 1.58524 8.54591 1.48584 8.42623C1.38644 8.30655 1.33203 8.15587 1.33203 8.00029C1.33203 7.84472 1.38644 7.69404 1.48584 7.57436C1.58524 7.45468 1.72336 7.37353 1.87629 7.34496L5.58163 6.64429C5.84506 6.59453 6.08737 6.46651 6.27694 6.27694C6.46651 6.08737 6.59453 5.84506 6.64429 5.58163L7.34496 1.87629Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.332 1.33203V3.9987" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.6667 2.66797H12" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_10291_379749">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`;

  let svgHue = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_10291_379765)">
    <path d="M7.9987 14.6654C6.23059 14.6654 4.5349 13.963 3.28465 12.7127C2.03441 11.4625 1.33203 9.76681 1.33203 7.9987C1.33203 6.23059 2.03441 4.5349 3.28465 3.28465C4.5349 2.03441 6.23059 1.33203 7.9987 1.33203C9.76681 1.33203 11.4625 1.96417 12.7127 3.08939C13.963 4.21461 14.6654 5.74073 14.6654 7.33203C14.6654 8.21609 14.3142 9.06393 13.6891 9.68905C13.0639 10.3142 12.2161 10.6654 11.332 10.6654H9.83203C9.61537 10.6654 9.40298 10.7257 9.21868 10.8396C9.03437 10.9535 8.88543 11.1165 8.78853 11.3103C8.69164 11.5041 8.65062 11.721 8.67008 11.9368C8.68954 12.1526 8.7687 12.3587 8.8987 12.532L9.0987 12.7987C9.2287 12.972 9.30786 13.1781 9.32732 13.3939C9.34677 13.6097 9.30576 13.8267 9.20886 14.0204C9.11197 14.2142 8.96302 14.3772 8.77872 14.4911C8.59441 14.605 8.38203 14.6654 8.16536 14.6654H7.9987Z" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.0013 4.66667C9.1854 4.66667 9.33464 4.51743 9.33464 4.33333C9.33464 4.14924 9.1854 4 9.0013 4C8.81721 4 8.66797 4.14924 8.66797 4.33333C8.66797 4.51743 8.81721 4.66667 9.0013 4.66667Z" fill="#4A5565" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.6654 7.33464C11.8495 7.33464 11.9987 7.1854 11.9987 7.0013C11.9987 6.81721 11.8495 6.66797 11.6654 6.66797C11.4813 6.66797 11.332 6.81721 11.332 7.0013C11.332 7.1854 11.4813 7.33464 11.6654 7.33464Z" fill="#4A5565" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.33333 8.66667C4.51743 8.66667 4.66667 8.51743 4.66667 8.33333C4.66667 8.14924 4.51743 8 4.33333 8C4.14924 8 4 8.14924 4 8.33333C4 8.51743 4.14924 8.66667 4.33333 8.66667Z" fill="#4A5565" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.66536 5.33464C5.84946 5.33464 5.9987 5.1854 5.9987 5.0013C5.9987 4.81721 5.84946 4.66797 5.66536 4.66797C5.48127 4.66797 5.33203 4.81721 5.33203 5.0013C5.33203 5.1854 5.48127 5.33464 5.66536 5.33464Z" fill="#4A5565" stroke="#4A5565" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_10291_379765">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`;

  return (
    <div className="bg-white border-b px-6 py-2 flex flex-col gap-2 h-[102px]">
      {/* 🔴 TOP ROW → Color */}
      <div className="flex items-center">
        {/* Color Section */}
        <div className="flex items-center gap-3 mr-4">
          <span className="text-[13px] text-[#374151] mr-2">Color</span>

          <div className="flex items-center gap-2">
            {[
              "#000000",
              "#E5E7EB",
              "#EF4444",
              "#F97316",
              "#F59E0B",
              "#84CC16",
              "#22C55E",
              "#14B8A6",
              "#06B6D4",
              "#3B82F6",
              "#6366F1",
              "#A855F7",
              "#EC4899",
              "#F43F5E",
              "#6B7280",
            ].map((color, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-md border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}

            <button className="w-8 h-8 rounded-md bg-black flex items-center justify-center border border-gray-300">
              <span className="text-white text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <g filter="url(#filter0_d_10291_379725)">
                    <g clip-path="url(#clip0_10291_379725)">
                      <path
                        d="M12.4154 15.2487C10.8683 15.2487 9.38454 14.6341 8.29058 13.5402C7.19661 12.4462 6.58203 10.9625 6.58203 9.41536C6.58203 7.86827 7.19661 6.38454 8.29058 5.29058C9.38454 4.19661 10.8683 3.58203 12.4154 3.58203C13.9625 3.58203 15.4462 4.13515 16.5402 5.11972C17.6341 6.10429 18.2487 7.43964 18.2487 8.83203C18.2487 9.60558 17.9414 10.3474 17.3944 10.8944C16.8474 11.4414 16.1056 11.7487 15.332 11.7487H14.0195C13.83 11.7487 13.6441 11.8015 13.4828 11.9012C13.3216 12.0008 13.1913 12.1434 13.1065 12.313C13.0217 12.4826 12.9858 12.6724 13.0028 12.8612C13.0198 13.05 13.0891 13.2304 13.2029 13.382L13.3779 13.6154C13.4916 13.767 13.5609 13.9474 13.5779 14.1362C13.5949 14.325 13.559 14.5148 13.4743 14.6844C13.3895 14.854 13.2591 14.9966 13.0979 15.0962C12.9366 15.1959 12.7508 15.2487 12.5612 15.2487H12.4154Z"
                        stroke="white"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.2878 6.4974C13.4488 6.4974 13.5794 6.36681 13.5794 6.20573C13.5794 6.04465 13.4488 5.91406 13.2878 5.91406C13.1267 5.91406 12.9961 6.04465 12.9961 6.20573C12.9961 6.36681 13.1267 6.4974 13.2878 6.4974Z"
                        fill="white"
                        stroke="white"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.6237 8.82943C15.7848 8.82943 15.9154 8.69884 15.9154 8.53776C15.9154 8.37668 15.7848 8.24609 15.6237 8.24609C15.4626 8.24609 15.332 8.37668 15.332 8.53776C15.332 8.69884 15.4626 8.82943 15.6237 8.82943Z"
                        fill="white"
                        stroke="white"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.20573 9.9974C9.36681 9.9974 9.4974 9.86681 9.4974 9.70573C9.4974 9.54465 9.36681 9.41406 9.20573 9.41406C9.04465 9.41406 8.91406 9.54465 8.91406 9.70573C8.91406 9.86681 9.04465 9.9974 9.20573 9.9974Z"
                        fill="white"
                        stroke="white"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.3737 7.07943C10.5348 7.07943 10.6654 6.94884 10.6654 6.78776C10.6654 6.62668 10.5348 6.49609 10.3737 6.49609C10.2126 6.49609 10.082 6.62668 10.082 6.78776C10.082 6.94884 10.2126 7.07943 10.3737 7.07943Z"
                        fill="white"
                        stroke="white"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_10291_379725"
                      x="-0.585938"
                      y="-0.585938"
                      width="26"
                      height="26"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_10291_379725"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_10291_379725"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_10291_379725">
                      <rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(5.41406 2.41406)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-3 px-3 py-1.5 rounded-md border border-gray-300 bg-[#F9FAFB]">
            <div className="w-4 h-4 rounded-sm bg-black border border-gray-300" />
            <input
              type="text"
              value="#000000"
              className="bg-transparent text-[13px] outline-none w-[80px]"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* 🔵 BOTTOM ROW → Sliders + Reset */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center min-w-[300px]">
          <div className="flex flex-row items-center gap-[2px]">
            <Slider
              label="Saturation"
              keyName="saturation"
              icon={svgSaturation}
            />
            <Slider label="Vibrance" keyName="vibrance" icon={svgVibrance} />
            <Slider label="Hue" keyName="hue" icon={svgHue} />
            <Slider
              label="Temperature"
              keyName="temperature"
              icon={svgBright}
            />
            <Slider label="Tint" keyName="tint" icon={svgHue} />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-[40px] bg-gray-200" />

        {/* Reset */}
        <div className="flex flex-col items-center min-w-[150px]">
          <button
            onClick={resetAll}
            className="inline-flex justify-center items-start gap-[8px] rounded-[14px] bg-[#F3F4F6] text-sm"
            style={{ padding: "8.5px 15.453px 7.5px 16px" }}
          >
            {/* SVG */}
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
