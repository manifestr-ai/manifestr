import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const DEFAULT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DEFAULT_Y = ['35m', '30m', '25m', '20m', '15m', '10m']
const DEFAULT_DATA = [30, 30, 29, 28, 27, 27, 28, 27, 26, 25, 24, 24]

function toPath(arr, min, max, w, h) {
  const step = w / (arr.length - 1)
  const range = max - min
  return arr
    .map((v, i) => {
      const y = h - ((v - min) / range) * h
      return `${i === 0 ? 'M' : 'L'}${i * step},${y}`
    })
    .join(' ')
}

export default function CompletionTime({ data }) {
  const title = data?.title || 'Completion Time'
  const months = data?.months || DEFAULT_MONTHS
  const yLabels = data?.yLabels || DEFAULT_Y
  const series = data?.data || DEFAULT_DATA
  const minValue = data?.min ?? 10
  const maxValue = data?.max ?? 35
  const timeframeOptions = data?.timeframeOptions || ['last 1 year', 'last 6 months', 'last 30d']
  const defaultTimeframe = data?.selectedTimeframe || timeframeOptions[0]

  const W = 1200
  const H = 220

  const [hoverIdx, setHoverIdx] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe)
  const svgRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false)
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isDropdownOpen])

  const handleMouseMove = useCallback(
    (e) => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = x / rect.width
      const idx = Math.round(pct * (months.length - 1))
      setHoverIdx(Math.max(0, Math.min(idx, months.length - 1)))
    },
    [months.length],
  )

  const step = W / (months.length - 1)

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 w-full h-[320px]">
      <div className="flex items-center justify-between">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        <div className="relative" ref={dropdownRef}>
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
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-sm py-1">
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

      <div className="relative flex-1 min-h-0">
        <div className="flex h-full">
          <div className="flex flex-col justify-between pr-2 shrink-0 pb-[26px]" style={{ width: 40 }}>
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">
                {l}
              </span>
            ))}
          </div>

          <div className="flex-1 min-w-0 relative flex flex-col">
            <div className="flex-1 relative">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="w-full h-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIdx(null)}
              >
                {yLabels.map((_, i) => (
                  <line
                    key={i}
                    x1={0}
                    y1={(i / (yLabels.length - 1)) * H}
                    x2={W}
                    y2={(i / (yLabels.length - 1)) * H}
                    stroke="#e4e4e7"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                ))}

                <path d={toPath(series, minValue, maxValue, W, H)} fill="none" stroke="#18181b" strokeWidth={2} />

                {hoverIdx !== null && (
                  <>
                    <line
                      x1={hoverIdx * step}
                      y1={0}
                      x2={hoverIdx * step}
                      y2={H}
                      stroke="#71717a"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <circle
                      cx={hoverIdx * step}
                      cy={H - ((series[hoverIdx] - minValue) / (maxValue - minValue)) * H}
                      r={4}
                      fill="#18181b"
                      stroke="white"
                      strokeWidth={2}
                    />
                  </>
                )}
              </svg>

              {hoverIdx !== null && (
                <div
                  className="absolute top-0 z-10 pointer-events-none"
                  style={{ left: `${(hoverIdx / (months.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-[#18181b]" />
                    <span className="text-[12px] font-medium text-[#18181b]">
                      {months[hoverIdx]}: {series[hoverIdx]}m
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-2">
              {months.map((m, i) => (
                <span
                  key={m}
                  className={`text-[12px] leading-[18px] font-normal tracking-[0.06px] ${
                    hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#475467]'
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
