import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const DEFAULT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DEFAULT_Y = ['250', '200', '150', '100', '50', '0']
const DEFAULT_DATA = [60, 80, 50, 70, 40, 90, 60, 110, 70, 180, 90, 60]
const DEFAULT_TREND = [55, 75, 65, 65, 60, 85, 75, 100, 90, 160, 110, 100]

export default function MembersAdded({ data }) {
  const title = data?.title || 'Members Added'
  const months = data?.months || DEFAULT_MONTHS
  const yLabels = data?.yLabels || DEFAULT_Y
  const bars = data?.bars || DEFAULT_DATA
  const trend = data?.trend || DEFAULT_TREND
  const maxValue = data?.max || 250
  const timeframeOptions = data?.timeframeOptions || ['Monthly', 'Weekly', 'Yearly']
  const defaultTimeframe = data?.selectedTimeframe || timeframeOptions[0]

  const [hoverIdx, setHoverIdx] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false)
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isDropdownOpen])

  const BAR_H = 220
  const trendPoints = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * 100
      const y = 100 - (v / maxValue) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 min-h-[300px] h-[320px] lg:p-[18px] lg:gap-6 lg:h-[340px]">
      <div className="flex flex-col gap-2 min-w-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        <div className="relative shrink-0 self-start sm:self-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b]"
          >
            {selectedTimeframe}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.75}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-sm py-1">
              {timeframeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedTimeframe(opt)
                    setIsDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-[14px] leading-5 ${
                    selectedTimeframe === opt
                      ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                      : 'text-[#52525b] hover:bg-[#f4f4f5]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-col justify-between shrink-0 pr-2 pb-[26px]" style={{ width: 40 }}>
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">
                {l}
              </span>
            ))}
          </div>

          <div className="flex-1 min-w-0 flex flex-col relative">
            <div className="flex-1 flex items-end justify-between gap-1 relative" style={{ height: BAR_H }}>
              {bars.map((v, i) => {
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
                      className="w-[10px] rounded-t-sm transition-colors sm:w-[16px]"
                      style={{
                        height: `${(v / maxValue) * 100}%`,
                        backgroundColor: isHover ? '#09090b' : '#18181b',
                      }}
                    />
                    {isHover && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                        <div className="bg-[#18181b] text-white text-[12px] font-medium leading-[18px] px-2 py-1 rounded-[6px] whitespace-nowrap shadow-lg flex flex-col gap-0.5">
                          <span className="font-semibold">{months[i]}</span>
                          <span>Members: {v}</span>
                          <span>Trend: {trend[i]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <polyline
                  points={trendPoints}
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="0.4"
                  strokeDasharray="1 1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div
              className="mt-2 grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
            >
              {months.map((m, i) => (
                <span
                  key={m}
                  className={`text-center text-[10px] leading-3 font-medium tracking-[0.06px] sm:text-[12px] sm:leading-[18px] truncate ${
                    hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
