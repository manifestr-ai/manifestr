import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SERIES = [3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.75, 3.8, 3.82, 3.85, 3.8, 3.8]

function toPath(data, max, width, height) {
  const step = width / (data.length - 1)
  return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step},${height - (v / max) * height}`).join(' ')
}

export default function DauMauTrend({ data }) {
  const W = 600
  const H = 120
  const months = data?.months || MONTHS
  const series = data?.series || SERIES
  const maxValue = data?.max || 5
  const title = data?.title || 'DAU / MAU Trend'
  const change = data?.change || '-0.6%'
  const period = data?.period || 'vs last 30d'
  const filterOptions = data?.filterOptions || ['last 7d', 'last 30d', 'last 90d', 'all time']
  const defaultFilter = data?.selectedFilter || filterOptions[1] || filterOptions[0]

  const [hoverIdx, setHoverIdx] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState(defaultFilter)
  const svgRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isDropdownOpen])

  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    const idx = Math.round(pct * (months.length - 1))
    setHoverIdx(Math.max(0, Math.min(idx, months.length - 1)))
  }, [months.length])

  const step = W / (months.length - 1)

  return (
    <div className="w-full lg:flex-2 min-w-0 bg-[#f4f4f4] border border-[#e9eaea] rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] p-4 lg:p-[18px] flex flex-col gap-4 lg:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b]"
          >
            {selectedRange}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-sm py-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedRange(opt)
                    setIsDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-[14px] leading-5 ${
                    selectedRange === opt ? 'bg-[#f4f4f5] text-[#18181b] font-medium' : 'text-[#52525b] hover:bg-[#f4f4f5]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3">
        <span className="text-[20px] leading-[30px] font-semibold text-[#18181b]">
          {hoverIdx !== null ? `${series[hoverIdx]}%` : `${series[series.length - 1]}%`}
        </span>
        <span className="inline-flex items-center px-1.5 text-[12px] leading-[18px] font-medium rounded-full border border-[#ef4444] bg-[#fef2f2] text-[#ef4444]">
          {change}
        </span>
        <span className="text-[14px] leading-5 text-[#52525b]">{period}</span>
        {hoverIdx !== null && (
          <span className="text-[14px] leading-5 text-[#71717a]">{months[hoverIdx]}</span>
        )}
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full h-[120px] cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="dauFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18181b" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={`${toPath(series, maxValue, W, H)} L${W},${H} L0,${H} Z`}
            fill="url(#dauFill)"
          />

          {/* Line */}
          <path d={toPath(series, maxValue, W, H)} fill="none" stroke="#18181b" strokeWidth={2} />

          {/* Hover crosshair + dot */}
          {hoverIdx !== null && (
            <>
              <line
                x1={hoverIdx * step} y1={0}
                x2={hoverIdx * step} y2={H}
                stroke="#71717a" strokeWidth={1} strokeDasharray="4 4"
              />
              <circle
                cx={hoverIdx * step}
                cy={H - (series[hoverIdx] / maxValue) * H}
                r={4} fill="#18181b" stroke="white" strokeWidth={2}
              />
            </>
          )}
        </svg>

        {/* Floating tooltip */}
        {hoverIdx !== null && (
          <div
            className="absolute top-0 z-10 pointer-events-none"
            style={{ left: `${(hoverIdx / (months.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <div className="bg-[#18181b] text-white text-[12px] font-medium leading-[18px] px-2 py-1 rounded-[6px] whitespace-nowrap shadow-lg">
              {months[hoverIdx]}: {series[hoverIdx]}%
            </div>
            <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#18181b]" />
          </div>
        )}

        {/* X-axis — show every label on desktop, every 2nd on mobile */}
        <div className="flex justify-between mt-1">
          {months.map((m, i) => (
            <span
              key={m}
              className={`text-[11px] lg:text-[12px] leading-[18px] font-medium tracking-[0.06px] ${
                hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'
              } ${i % 2 !== 0 ? 'hidden sm:inline' : ''}`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
