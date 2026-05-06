import { useState } from 'react'

const X_LABELS = ['Paid Search', 'Social', 'Email', 'Events']
const VALUES = [108, 76, 132, 132]
const Y_LABELS = ['$500', '$400', '$300', '$200', '$100', '$0']

export default function ChannelBarChart({ data }) {
  const title = data?.title || 'CAC by Channel'
  const xLabels = data?.xLabels || X_LABELS
  const values = data?.values || VALUES
  const maxValue = Math.max(data?.max ?? 0, 1)
  const yLabels = data?.yLabels || Y_LABELS
  const footer = data?.footer || 'Customer Acquisition Cost ($)'
  const valueFormat = data?.valueFormat || 'currency'
  const BAR_H = 160
  const [hoverIdx, setHoverIdx] = useState(null)

  const formatHover = (v) =>
    valueFormat === 'percent' ? `${v}%` : `$${v}`

  return (
    <div className="w-full flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] lg:p-[18px] flex flex-col gap-4 lg:gap-6">
      <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>

      <div className="relative">
        <div className="flex">
          <div className="flex flex-col justify-between shrink-0 pr-2" style={{ height: BAR_H }}>
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">{l}</span>
            ))}
          </div>

          <div className="flex-1 min-w-0 flex items-end justify-around relative" style={{ height: BAR_H }}>
            {values.map((v, i) => (
              <div key={i} className="flex flex-col items-center relative" style={{ height: '100%', justifyContent: 'flex-end' }}
                onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                <div
                  className={`w-6 rounded-t-sm transition-colors ${hoverIdx === i ? 'bg-[#09090b]' : 'bg-[#18181b]'}`}
                  style={{ height: `${(v / maxValue) * 100}%` }}
                />

                {hoverIdx === i && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                    <div className="bg-[#18181b] text-white text-[12px] font-medium leading-[18px] px-2 py-1 rounded-[6px] whitespace-nowrap shadow-lg">
                      {formatHover(v)}
                    </div>
                    <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#18181b]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-around pl-8 sm:pl-10 mt-1 gap-0.5">
          {xLabels.map((l, i) => (
            <span
              key={l}
              className={`flex-1 min-w-0 text-center text-[10px] sm:text-[12px] leading-tight sm:leading-[18px] font-medium tracking-[0.06px] truncate px-0.5 ${
                hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'
              }`}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[12px] leading-[18px] font-normal text-[#71717a]">{footer}</p>
    </div>
  )
}
