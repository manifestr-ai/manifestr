import { useState } from 'react'

const DEFAULT_Y = ['100%', '80%', '60%', '40%', '20%', '0%']
const DEFAULT_DATA = [52, 58, 48, 55, 62, 50, 55, 60, 58, 50, 58, 62, 55, 58, 62]

export default function SlideDropoff({ data }) {
  const title = data?.title || 'Slide Drop-off'
  const yLabels = data?.yLabels || DEFAULT_Y
  const series = data?.data || DEFAULT_DATA
  const maxValue = data?.max || 100
  const [hoverIdx, setHoverIdx] = useState(null)

  const BAR_H = 220

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 h-[320px]">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-col justify-between shrink-0 pr-2 pb-[26px]" style={{ width: 40 }}>
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">
                {l}
              </span>
            ))}
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1 flex items-end justify-between gap-1 relative" style={{ height: BAR_H }}>
              {series.map((v, i) => {
                const isHover = hoverIdx === i
                return (
                  <div
                    key={i}
                    className="flex-1 min-w-0 flex items-end justify-center relative"
                    style={{ height: '100%' }}
                    onMouseEnter={() => setHoverIdx(i)}
                    onMouseLeave={() => setHoverIdx(null)}
                  >
                    <div
                      className="w-[10px] rounded-t-sm transition-colors"
                      style={{
                        height: `${(v / maxValue) * 100}%`,
                        backgroundColor: isHover ? '#020617' : '#18181b',
                      }}
                    />
                    {isHover && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                        <div className="bg-[#18181b] text-white text-[12px] font-medium leading-[18px] px-2 py-1 rounded-[6px] whitespace-nowrap shadow-lg">
                          Slide {i + 1}: {v}%
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between mt-2">
              {series.map((_, i) => (
                <span
                  key={i}
                  className={`text-[12px] leading-[18px] font-medium tracking-[0.06px] text-center flex-1 ${
                    hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
