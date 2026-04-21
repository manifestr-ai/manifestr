import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

function FilterBtn({ selected, setSelected, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div className="relative z-20" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
      >
        {selected}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 min-w-[160px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setSelected(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-[14px] leading-5 ${
                selected === opt ? 'bg-[#f4f4f5] text-[#18181b] font-medium' : 'text-[#52525b] hover:bg-[#f4f4f5]'
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

export default function RevenueTrendChart({ data }) {
  if (!data) return null

  const title = data.title || 'Revenue Trend'
  const subtitle = data.subtitle || ''
  const months = data.months || []
  const yLabels = data.yLabels || []
  const max = data.max ?? 60
  const min = data.min ?? 0
  const series = data.series || []
  const filterOptions = data.filterOptions || ['Both', ...series.map((s) => s.label)]
  const [selected, setSelected] = useState(data.selectedFilter || 'Both')

  const W = 920
  const H = 260
  const padL = 52
  const padR = 20
  const padT = 14
  const padB = 28
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const xStep = months.length > 1 ? plotW / (months.length - 1) : plotW
  const range = Math.max(1, max - min)

  const visible = series.filter(
    (s) => selected === 'Both' || selected === s.label
  )

  const pt = (val, idx) => {
    const x = padL + xStep * idx
    const y = padT + plotH - ((val - min) / range) * plotH
    return [x, y]
  }

  const pathFor = (s) =>
    s.data
      .map((v, i) => {
        const [x, y] = pt(v, i)
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')

  const areaFor = (s) => {
    const pts = s.data.map((v, i) => pt(v, i))
    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
    const last = pts[pts.length - 1]
    const first = pts[0]
    return `${line} L ${last[0].toFixed(1)} ${(padT + plotH).toFixed(1)} L ${first[0].toFixed(1)} ${(padT + plotH).toFixed(1)} Z`
  }

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
        <FilterBtn selected={selected} setSelected={setSelected} options={filterOptions} />
      </div>

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          <defs>
            {visible.map((s) => (
              <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.12" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {yLabels.map((label, i) => {
            const y = padT + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={`${label}-${i}`}>
                <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e4e4e7" strokeDasharray="4 4" strokeWidth="1" />
                <text x={padL - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#71717a">
                  {label}
                </text>
              </g>
            )
          })}

          {months.map((m, i) => (
            <text
              key={`${m}-${i}`}
              x={padL + xStep * i}
              y={H - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight="500"
              fill="#71717a"
            >
              {m}
            </text>
          ))}

          {visible.map((s) => (
            <path key={`area-${s.key}`} d={areaFor(s)} fill={`url(#grad-${s.key})`} />
          ))}

          {visible.map((s) => (
            <path
              key={`line-${s.key}`}
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
              const [cx, cy] = pt(v, i)
              return (
                <circle key={`dot-${s.key}-${i}`} cx={cx} cy={cy} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2" />
              )
            })
          )}
        </svg>
      </div>

      {series.length > 1 && (
        <div className="flex items-center gap-5 flex-wrap pt-1 border-t border-[#e4e4e7]">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
