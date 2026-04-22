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
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const onChange = (event) => setIsSmallScreen(event.matches)
    setIsSmallScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const pointsLimit = isSmallScreen ? 6 : months.length
  const visibleMonths = months.slice(-pointsLimit)
  const visibleSeries = series.map((s) => ({
    ...s,
    data: (s.data || []).slice(-pointsLimit),
  }))

  const W = isSmallScreen ? 720 : 920
  const H = isSmallScreen ? 320 : 280
  const padL = isSmallScreen ? 72 : 60
  const padR = 20
  const padT = isSmallScreen ? 18 : 16
  const padB = isSmallScreen ? 44 : 34
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const xStep = visibleMonths.length > 1 ? plotW / (visibleMonths.length - 1) : plotW
  const range = Math.max(1, max - min)
  const axisFontSize = isSmallScreen ? 15 : 13

  const visible = visibleSeries.filter(
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

  const toNearestIndex = (clientX) => {
    if (!svgRef.current || visibleMonths.length === 0) return null
    const rect = svgRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const normalizedX = (x / rect.width) * W
    const clamped = Math.max(padL, Math.min(normalizedX, W - padR))
    const idx = Math.round((clamped - padL) / Math.max(1, xStep))
    return Math.max(0, Math.min(idx, visibleMonths.length - 1))
  }

  const handleMouseMove = (event) => {
    const idx = toNearestIndex(event.clientX)
    setHoverIdx(idx)
  }

  const hoverX = hoverIdx !== null ? padL + xStep * hoverIdx : null

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-[#e4e4e7] bg-white p-4 sm:gap-5 sm:p-[18px]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-[16px] font-medium leading-6 text-[#18181b] sm:text-[18px] sm:leading-7">{title}</p>
          {subtitle && (
            <p className="text-[14px] font-normal leading-5 text-[#71717a]">{subtitle}</p>
          )}
        </div>
        <div className="shrink-0 sm:self-start">
          <FilterBtn selected={selected} setSelected={setSelected} options={filterOptions} />
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio={isSmallScreen ? 'xMinYMin meet' : 'xMidYMid meet'}
          role="img"
          aria-label={title}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
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
                <text x={padL - 12} y={y} textAnchor="end" dominantBaseline="middle" fontSize={axisFontSize} fontWeight="600" fill="#71717a">
                  {label}
                </text>
              </g>
            )
          })}

          {visibleMonths.map((m, i) => (
            <text
              key={`${m}-${i}`}
              x={padL + xStep * i}
              y={H - 10}
              textAnchor="middle"
              fontSize={axisFontSize}
              fontWeight="600"
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
              strokeWidth={hoverIdx !== null ? '2.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {hoverX !== null && (
            <line
              x1={hoverX}
              y1={padT}
              x2={hoverX}
              y2={padT + plotH}
              stroke="#71717a"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}

          {visible.map((s) =>
            s.data.map((v, i) => {
              const [cx, cy] = pt(v, i)
              const isHovered = hoverIdx === i
              return (
                <circle
                  key={`dot-${s.key}-${i}`}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? (isSmallScreen ? 5.5 : 4.5) : (isSmallScreen ? 4.5 : 3.5)}
                  fill="#fff"
                  stroke={s.color}
                  strokeWidth={isHovered ? 3 : (isSmallScreen ? 2.5 : 2)}
                  opacity={hoverIdx !== null && !isHovered ? 0.4 : 1}
                />
              )
            })
          )}
        </svg>

        {hoverIdx !== null && (
          <div
            className="pointer-events-none absolute top-2 z-20"
            style={{
              left: `${((padL + xStep * hoverIdx) / W) * 100}%`,
              transform: hoverIdx > visibleMonths.length * 0.65 ? 'translateX(-100%) translateX(-8px)' : 'translateX(8px)',
            }}
          >
            <div className="rounded-lg bg-[#18181b] px-3 py-2 shadow-lg">
              <p className="text-[11px] font-semibold leading-4 text-[#a1a1aa]">{visibleMonths[hoverIdx]}</p>
              {visible.map((s) => (
                <div key={`tip-${s.key}`} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[12px] font-medium leading-5 text-white">
                    {s.label}: <span className="font-semibold">{s.data[hoverIdx]}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibleSeries.length > 1 && (
        <div className="flex items-center gap-5 flex-wrap pt-1 border-t border-[#e4e4e7]">
          {visibleSeries.map((s) => (
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
