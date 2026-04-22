import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const Y_LABELS = ['60K', '40K', '20K', '10K', '5K', '0']
const MRR_DATA = [12, 14, 13, 15, 16, 18, 17, 19, 20, 22, 21, 24]
const ARR_DATA = [8, 9, 8, 10, 11, 12, 11, 13, 14, 15, 14, 16]
const MRR_DOLLAR = ['$120K', '$140K', '$130K', '$150K', '$160K', '$180K', '$170K', '$190K', '$200K', '$220K', '$210K', '$240K']
const ARR_DOLLAR = ['$0.96M', '$1.08M', '$0.96M', '$1.2M', '$1.32M', '$1.44M', '$1.32M', '$1.56M', '$1.68M', '$1.8M', '$1.68M', '$1.92M']

function toPath(data, max, width, height) {
  const step = width / (data.length - 1)
  return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step},${height - (v / max) * height}`).join(' ')
}

export default function MrrArrTrend({ data }) {
  const W = 600
  const H = 160
  const months = data?.months || MONTHS
  const yLabels = data?.yLabels || Y_LABELS
  const mrrData = data?.mrrData || MRR_DATA
  const arrData = data?.arrData || ARR_DATA
  const mrrDollar = data?.mrrDollar || MRR_DOLLAR
  const arrDollar = data?.arrDollar || ARR_DOLLAR
  const maxValue = data?.max || 60
  const title = data?.title || 'MRR / ARR Trend'
  const change = data?.change || '+8%'
  const period = data?.period || 'MoM'
  const filterOptions = data?.filterOptions || ['Both', 'MRR', 'ARR']
  const defaultFilter = data?.selectedFilter || filterOptions[0]

  const [hoverIdx, setHoverIdx] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedView, setSelectedView] = useState(defaultFilter)
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
            {selectedView}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[120px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-sm py-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedView(opt)
                    setIsDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-[14px] leading-5 ${
                    selectedView === opt ? 'bg-[#f4f4f5] text-[#18181b] font-medium' : 'text-[#52525b] hover:bg-[#f4f4f5]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary / Tooltip */}
      <div className="flex items-center gap-4">
        <span className="text-[20px] leading-[30px] font-semibold text-[#18181b]">
          {hoverIdx !== null ? mrrDollar[hoverIdx] : mrrDollar[mrrDollar.length - 1]}
        </span>
        <span className="inline-flex items-center px-1.5 text-[12px] leading-[18px] font-medium rounded-full border border-black bg-[#f8fafc] text-[#09090b]">
          {change}
        </span>
        <span className="text-[14px] leading-5 text-[#52525b]">{period}</span>
        {hoverIdx !== null && (
          <span className="text-[14px] leading-5 text-[#71717a]">
            {months[hoverIdx]} &middot; ARR {arrDollar[hoverIdx]}
          </span>
        )}
      </div>

      {/* Chart area */}
      <div className="relative">
        <div className="flex">
          <div className="flex flex-col justify-between h-[160px] pr-2 shrink-0">
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">
                {l}
              </span>
            ))}
          </div>

          <div className="flex-1 min-w-0 relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="w-full h-[160px] cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIdx(null)}
            >
              {/* Grid lines */}
              {yLabels.map((_, i) => (
                <line
                  key={i}
                  x1={0} y1={(i / (yLabels.length - 1)) * H}
                  x2={W} y2={(i / (yLabels.length - 1)) * H}
                  stroke="#e4e4e7" strokeWidth={1}
                />
              ))}

              {/* Area fill for series 1 */}
              <path
                d={`${toPath(mrrData, maxValue, W, H)} L${W},${H} L0,${H} Z`}
                fill="#18181b" fillOpacity={0.04}
              />

              {/* Lines */}
              <path d={toPath(mrrData, maxValue, W, H)} fill="none" stroke="#18181b" strokeWidth={2} />
              <path d={toPath(arrData, maxValue, W, H)} fill="none" stroke="#a1a1aa" strokeWidth={2} />

              {/* Hover crosshair + dots */}
              {hoverIdx !== null && (
                <>
                  <line
                    x1={hoverIdx * step} y1={0}
                    x2={hoverIdx * step} y2={H}
                    stroke="#71717a" strokeWidth={1} strokeDasharray="4 4"
                  />
                  <circle
                    cx={hoverIdx * step}
                    cy={H - (mrrData[hoverIdx] / maxValue) * H}
                    r={4} fill="#18181b" stroke="white" strokeWidth={2}
                  />
                  <circle
                    cx={hoverIdx * step}
                    cy={H - (arrData[hoverIdx] / maxValue) * H}
                    r={4} fill="#a1a1aa" stroke="white" strokeWidth={2}
                  />
                </>
              )}
            </svg>

            {/* Floating tooltip card */}
            {hoverIdx !== null && (
              <div
                className="absolute top-0 z-10 pointer-events-none"
                style={{ left: `${(hoverIdx / (months.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
              >
                <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg px-3 py-2 flex items-center gap-4 shadow-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#18181b]" />
                    <span className="text-[12px] font-medium text-[#18181b]">MRR {mrrDollar[hoverIdx]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a1a1aa]" />
                    <span className="text-[12px] font-medium text-[#52525b]">ARR {arrDollar[hoverIdx]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* X-axis — every 2nd label hidden on mobile */}
        <div className="flex justify-between pl-10 mt-1">
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
