import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const DEFAULT_DATA = {
  title: 'MRR / ARR Trend',
  filterOptions: ['Both', 'Series 1', 'Series 2'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  yLabels: ['10ms', '8ms', '6ms', '4ms', '2ms', '0ms'],
  max: 10,
  series: [],
}

function FilterButton({ selected, setSelected, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  return (
    <div className="relative z-20" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
      >
        {selected}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>
      {open && options.length > 0 && (
        <div className="absolute right-0 top-full mt-1 z-30 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSelected(opt)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-[14px] leading-5 ${
                selected === opt
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
  )
}

export default function LatencyTrendChart({ data }) {
  const cfg = { ...DEFAULT_DATA, ...(data || {}) }
  const [selected, setSelected] = useState(cfg.selectedFilter || cfg.filterOptions[0])

  const width = 760
  const height = 228
  const padLeft = 44
  const padRight = 16
  const padTop = 12
  const padBottom = 28
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const months = cfg.months
  const max = cfg.max || 10
  const yLabels = cfg.yLabels

  const xStep = months.length > 1 ? plotW / (months.length - 1) : plotW

  const visible = cfg.series.filter((s) => selected === 'Both' || selected === s.label)

  const toPoint = (val, idx) => {
    const x = padLeft + xStep * idx
    const y = padTop + plotH - (val / max) * plotH
    return [x, y]
  }

  const pathFor = (series) =>
    series.data
      .map((v, i) => {
        const [x, y] = toPoint(v, i)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{cfg.title}</p>
        <FilterButton selected={selected} setSelected={setSelected} options={cfg.filterOptions} />
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="none" style={{ height }}>
          {yLabels.map((label, i) => {
            const y = padTop + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={label}>
                <line
                  x1={padLeft}
                  x2={width - padRight}
                  y1={y}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#40444e"
                >
                  {label}
                </text>
              </g>
            )
          })}

          {months.map((m, i) => (
            <text
              key={`${m}-${i}`}
              x={padLeft + xStep * i}
              y={height - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight="500"
              fill="#40444e"
            >
              {m}
            </text>
          ))}

          {visible.map((series) => (
            <path
              key={series.label}
              d={pathFor(series)}
              fill="none"
              stroke={series.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
