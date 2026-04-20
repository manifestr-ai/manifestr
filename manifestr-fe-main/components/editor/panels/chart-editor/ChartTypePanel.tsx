import React from "react";

interface ChartTypePanelProps {
  store: any;
}

const ChartIcon = ({ type }: { type: string }) => {
  const iconProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (type) {
    case 'bar':
      return (
        <svg {...iconProps}>
          <rect x="3" y="10" width="3" height="7" fill="currentColor" rx="0.5" />
          <rect x="8" y="6" width="3" height="11" fill="currentColor" rx="0.5" />
          <rect x="13" y="8" width="3" height="9" fill="currentColor" rx="0.5" />
        </svg>
      );
    case 'horizontalBar':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="10" height="3" fill="currentColor" rx="0.5" />
          <rect x="3" y="8" width="14" height="3" fill="currentColor" rx="0.5" />
          <rect x="3" y="13" width="7" height="3" fill="currentColor" rx="0.5" />
        </svg>
      );
    case 'line':
      return (
        <svg {...iconProps}>
          <path d="M2 15 L6 10 L10 12 L14 7 L18 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="2" cy="15" r="1.5" fill="currentColor" />
          <circle cx="6" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="12" r="1.5" fill="currentColor" />
          <circle cx="14" cy="7" r="1.5" fill="currentColor" />
          <circle cx="18" cy="9" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'area':
      return (
        <svg {...iconProps}>
          <path d="M2 15 L6 10 L10 12 L14 7 L18 9 L18 18 L2 18 Z" fill="currentColor" opacity="0.3" />
          <path d="M2 15 L6 10 L10 12 L14 7 L18 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'pie':
      return (
        <svg {...iconProps}>
          <circle cx="10" cy="10" r="7" fill="currentColor" opacity="0.3" />
          <path d="M10 3 A7 7 0 0 1 17 10 L10 10 Z" fill="currentColor" />
          <path d="M10 10 L17 10 A7 7 0 0 1 10 17 Z" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'doughnut':
      return (
        <svg {...iconProps}>
          <circle cx="10" cy="10" r="7" fill="currentColor" opacity="0.3" />
          <circle cx="10" cy="10" r="4" fill="white" />
          <path d="M10 3 A7 7 0 0 1 17 10 L13 10 A4 4 0 0 0 10 6 Z" fill="currentColor" />
          <path d="M10 10 L17 10 A7 7 0 0 1 10 17 L10 13 A4 4 0 0 0 13 10 Z" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'radar':
      return (
        <svg {...iconProps}>
          <polygon points="10,3 17,8 14,16 6,16 3,8" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
          <polygon points="10,6 14,9 12,14 8,14 6,9" fill="currentColor" opacity="0.4" />
          <line x1="10" y1="3" x2="10" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="10" y1="3" x2="17" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="10" y1="3" x2="14" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="10" y1="3" x2="6" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <line x1="10" y1="3" x2="3" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
      );
    case 'polarArea':
      return (
        <svg {...iconProps}>
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M10 2 L10 10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M10 10 L18 10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M10 10 L14 17" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M10 10 L6 17" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M10 2 A8 8 0 0 1 18 10 L10 10 Z" fill="currentColor" opacity="0.5" />
          <path d="M10 10 L18 10 A8 8 0 0 1 14 17 Z" fill="currentColor" opacity="0.3" />
          <path d="M10 10 L14 17 A8 8 0 0 1 6 17 Z" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'scatter':
      return (
        <svg {...iconProps}>
          <circle cx="4" cy="14" r="2" fill="currentColor" />
          <circle cx="7" cy="9" r="2" fill="currentColor" />
          <circle cx="10" cy="11" r="2" fill="currentColor" />
          <circle cx="13" cy="6" r="2" fill="currentColor" />
          <circle cx="16" cy="8" r="2" fill="currentColor" />
        </svg>
      );
    case 'bubble':
      return (
        <svg {...iconProps}>
          <circle cx="5" cy="13" r="3" fill="currentColor" opacity="0.4" />
          <circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.5" />
          <circle cx="15" cy="7" r="2.5" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'histogram':
      return (
        <svg {...iconProps}>
          <rect x="2" y="12" width="2.5" height="5" fill="currentColor" />
          <rect x="5" y="8" width="2.5" height="9" fill="currentColor" />
          <rect x="8" y="5" width="2.5" height="12" fill="currentColor" />
          <rect x="11" y="9" width="2.5" height="8" fill="currentColor" />
          <rect x="14" y="13" width="2.5" height="4" fill="currentColor" />
        </svg>
      );
    case 'boxplot':
      return (
        <svg {...iconProps}>
          <line x1="5" y1="10" x2="9" y2="10" stroke="currentColor" strokeWidth="2" />
          <rect x="9" y="7" width="4" height="6" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
          <line x1="9" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="2" />
          <line x1="13" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" />
          <line x1="5" y1="8" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="17" y1="8" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'waterfall':
      return (
        <svg {...iconProps}>
          <rect x="2" y="10" width="3" height="7" fill="#10b981" />
          <rect x="6" y="7" width="3" height="3" fill="#10b981" />
          <rect x="10" y="12" width="3" height="5" fill="#ef4444" />
          <rect x="14" y="8" width="3" height="4" fill="#10b981" />
          <line x1="2" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
          <line x1="5" y1="7" x2="6" y2="7" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
        </svg>
      );
    case 'funnel':
      return (
        <svg {...iconProps}>
          <path d="M4 4 L16 4 L14 9 L6 9 Z" fill="currentColor" />
          <path d="M6 9 L14 9 L12.5 13 L7.5 13 Z" fill="currentColor" opacity="0.7" />
          <path d="M7.5 13 L12.5 13 L11 17 L9 17 Z" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case 'gauge':
      return (
        <svg {...iconProps}>
          <path d="M3 13 A7 7 0 0 1 17 13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
          <path d="M3 13 A7 7 0 0 1 14 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="13" x2="13" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="13" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'gantt':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="8" height="2.5" fill="currentColor" rx="0.5" />
          <rect x="7" y="7" width="10" height="2.5" fill="currentColor" opacity="0.7" rx="0.5" />
          <rect x="4" y="11" width="6" height="2.5" fill="currentColor" opacity="0.5" rx="0.5" />
          <rect x="9" y="15" width="7" height="2.5" fill="currentColor" opacity="0.6" rx="0.5" />
        </svg>
      );
    default:
      return null;
  }
};

export default function ChartTypePanel({ store }: ChartTypePanelProps) {
  if (!store) return null;

  const chartTypes = [
    { value: 'bar', label: 'Bar' },
    { value: 'horizontalBar', label: 'Horizontal' },
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'pie', label: 'Pie' },
    { value: 'doughnut', label: 'Doughnut' },
    { value: 'radar', label: 'Radar' },
    { value: 'polarArea', label: 'Polar' },
    { value: 'scatter', label: 'Scatter' },
    { value: 'bubble', label: 'Bubble' },
    { value: 'histogram', label: 'Histogram' },
    { value: 'boxplot', label: 'Box Plot' },
    { value: 'waterfall', label: 'Waterfall' },
    { value: 'funnel', label: 'Funnel' },
    { value: 'gauge', label: 'Gauge' },
    { value: 'gantt', label: 'Gantt' },
  ];

  return (
    <div className="h-[90px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start overflow-x-auto px-4">
      {/* Chart Types */}
      <div className="flex flex-col items-center min-w-full">
        <span className="w-full text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-1.5">
          Chart Types
        </span>

        <div className="flex flex-row items-center gap-[20px] justify-start w-full overflow-x-auto pb-2">
          {chartTypes.map((chart) => (
            <button
              key={chart.value}
              onClick={() => store.setChartType(chart.value)}
              className={`flex flex-col items-center group transition-all flex-shrink-0 ${
                store.chartType === chart.value ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              tabIndex={0}
              type="button"
            >
              <div className={`w-[36px] h-[36px] rounded-lg flex items-center justify-center ${
                store.chartType === chart.value 
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-600' 
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-600'
              }`}>
                <ChartIcon type={chart.value} />
              </div>
              <span
                className={`
                  text-[9px]
                  font-inter
                  font-normal
                  not-italic
                  leading-[11.25px]
                  tracking-[0.167px]
                  mt-1
                  transition-colors
                  whitespace-nowrap
                  ${store.chartType === chart.value ? 'text-[#18181b] font-semibold' : 'text-[#4A5565]'}
                  group-hover:text-[#18181b]
                `}
              >
                {chart.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
