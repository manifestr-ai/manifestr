import { useState } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const Y_LABELS = ['60K', '40K', '20K', '10K', '5K', '0']
const DATA = [8, 12, 18, 22, 28, 35, 42, 48, 38, 30, 25, 20]
const DATA_DOLLAR = ['$8K', '$12K', '$18K', '$22K', '$28K', '$35K', '$42K', '$48K', '$38K', '$30K', '$25K', '$20K']

export default function ClosedWonChart({ data }) {
  const months = data?.months || MONTHS
  const yLabels = data?.yLabels || Y_LABELS
  const values = data?.values || DATA
  const valueLabels = data?.valueLabels || DATA_DOLLAR
  const maxValue = data?.max || 60
  const title = data?.title || 'Closed-Won This Month'
  const BAR_H = 160
  const [hoverIdx, setHoverIdx] = useState(null)

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="relative">
        <div className="flex">
          {/* Y-axis */}
          <div className="flex flex-col justify-between shrink-0 pr-2" style={{ height: BAR_H }}>
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">
                {l}
              </span>
            ))}
          </div>

          {/* Bars */}
          <div className="flex-1 min-w-0 flex items-end justify-between gap-1 relative" style={{ height: BAR_H }}>
            {values.map((v, i) => (
              <div
                key={i}
                className="flex-1 min-w-0 relative group"
                style={{ height: '100%' }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                {/* Bar */}
                <div
                  className={`absolute bottom-0 left-[10%] right-[10%] rounded-t-sm transition-colors ${
                    hoverIdx === i ? 'bg-[#09090b]' : 'bg-[#18181b]'
                  }`}
                  style={{ height: `${(v / maxValue) * 100}%` }}
                />

                {/* Tooltip */}
                {hoverIdx === i && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                    <div className="bg-[#18181b] text-white text-[12px] font-medium leading-[18px] px-2 py-1 rounded-[6px] whitespace-nowrap shadow-lg">
                      {months[i]}: {valueLabels[i]}
                    </div>
                    <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#18181b]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* X-axis */}
        <div className="flex justify-between pl-10 mt-1">
          {months.map((m, i) => (
            <span
              key={m}
              className={`text-[12px] leading-[18px] font-medium tracking-[0.06px] ${
                hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
