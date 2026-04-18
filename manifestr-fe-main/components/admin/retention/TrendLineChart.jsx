import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

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
        <div className="absolute right-0 top-full mt-1 z-30 min-w-[160px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-lg py-1">
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

export default function TrendLineChart({ data }) {
  const title = data?.title || 'Trend'
  const months = data?.months || []
  const yLabels = data?.yLabels || []
  const max = data?.max ?? 100
  const min = data?.min ?? 0
  const series = data?.series || []
  const filterOptions = data?.filterOptions || ['Both', ...series.map((s) => s.label)]
  const initial = data?.selectedFilter || filterOptions[0] || 'Both'
  const [selected, setSelected] = useState(initial)

  const width = data?.chartWidth ?? 760
  const height = data?.chartHeight ?? 240
  const padLeft = 52
  const padRight = 16
  const padTop = 12
  const padBottom = 28
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const xStep = months.length > 1 ? plotW / (months.length - 1) : plotW
  const range = Math.max(1, max - min)

  const visible = series.filter((s) => selected === 'Both' || selected === s.label)

  const toPoint = (val, idx) => {
    const x = padLeft + xStep * idx
    const y = padTop + plotH - ((val - min) / range) * plotH
    return [x, y]
  }

  const pathFor = (s) =>
    s.data
      .map((v, i) => {
        const [x, y] = toPoint(v, i)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        <FilterButton selected={selected} setSelected={setSelected} options={filterOptions} />
      </div>

      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          {yLabels.map((label, i) => {
            const y = padTop + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={`${label}-${i}`}>
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

          {visible.map((s) => (
            <path
              key={s.label}
              d={pathFor(s)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {visible.map((s) =>
            s.data.map((v, i) => {
              const [cx, cy] = toPoint(v, i)
              return (
                <circle
                  key={`${s.label}-${i}`}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#ffffff"
                  stroke={s.color}
                  strokeWidth="2"
                />
              )
            })
          )}
        </svg>
      </div>

      {selected === 'Both' && series.length > 1 && (
        <div className="flex items-center gap-4 flex-wrap">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
