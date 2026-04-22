import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
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
              onClick={() => { setSelected(opt); setOpen(false) }}
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
  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

  const width = data?.chartWidth ?? 760
  const height = data?.chartHeight ?? 240
  const padLeft = 60
  const padRight = 16
  const padTop = 14
  const padBottom = 26
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const xStep = months.length > 1 ? plotW / (months.length - 1) : plotW
  const range = Math.max(1, max - min)

  const visible = useMemo(() => {
    const showAll = selected === 'Both' || selected === 'All'
    const v = showAll ? series : series.filter((s) => s.label === selected)
    return v.length ? v : series
  }, [selected, series])

  const toPoint = useCallback((val, idx) => {
    const x = padLeft + xStep * idx
    const y = padTop + plotH - ((val - min) / range) * plotH
    return [x, y]
  }, [xStep, plotH, padLeft, padTop, min, range])

  const pathFor = (s) =>
    s.data.map((v, i) => {
      const [x, y] = toPoint(v, i)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

  const areaFor = (s) => {
    const pts = s.data.map((v, i) => toPoint(v, i))
    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
    const base = `L ${pts[pts.length - 1][0]} ${padTop + plotH} L ${pts[0][0]} ${padTop + plotH} Z`
    return line + ' ' + base
  }

  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current || months.length < 2) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = (x - (padLeft / width) * rect.width) / ((plotW / width) * rect.width)
    const idx = Math.round(pct * (months.length - 1))
    setHoverIdx(Math.max(0, Math.min(idx, months.length - 1)))
  }, [months.length, padLeft, plotW, width])

  const crosshairX = hoverIdx !== null ? padLeft + xStep * hoverIdx : null

  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5 rounded-xl border border-[#e4e4e7] bg-white p-[14px] lg:gap-2 lg:p-[18px]">
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] sm:text-[18px] sm:leading-7 min-w-0 pr-2">{title}</p>
        <div className="shrink-0 self-start sm:self-auto">
          <FilterButton selected={selected} setSelected={setSelected} options={filterOptions} />
        </div>
      </div>

      {/* Legend / hover readout — fixed band so paired cards align; compact height */}
      <div className="flex h-10 min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-0.5 overflow-x-auto sm:h-11 sm:min-h-11">
        {hoverIdx !== null && (
          <>
            <span className="text-[14px] font-semibold leading-5 text-[#71717a]">{months[hoverIdx]}</span>
            {visible.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-[14px] font-medium leading-5 text-[#18181b]">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}: <span className="font-bold">{s.data[hoverIdx]}{data?.unit || '%'}</span>
              </span>
            ))}
          </>
        )}
        {hoverIdx === null && visible.length > 1 && (
          <>
            {visible.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[14px] font-medium leading-5 text-[#52525b]">{s.label}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Plot height follows width via viewBox aspect — no extra slack under the graph */}
      <div
        className="relative w-full shrink-0"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="block h-full w-full cursor-crosshair"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Grid lines */}
          {yLabels.map((label, i) => {
            const y = padTop + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={`${label}-${i}`}>
                <line
                  x1={padLeft} x2={width - padRight} y1={y} y2={y}
                  stroke="#e4e4e7" strokeDasharray="4 4" strokeWidth="1"
                />
                <text
                  x={padLeft - 10} y={y}
                  textAnchor="end" dominantBaseline="middle"
                  fontSize="14" fontWeight="600" fill="#40444e"
                >
                  {label}
                </text>
              </g>
            )
          })}

          {/* X-axis labels */}
          {months.map((m, i) => (
            <text
              key={`${m}-${i}`}
              x={padLeft + xStep * i}
              y={height - 4}
              textAnchor="middle"
              fontSize="14"
              fontWeight={hoverIdx === i ? '700' : '600'}
              fill={hoverIdx === i ? '#18181b' : '#40444e'}
            >
              {m}
            </text>
          ))}000

          {/* Area fills */}
          {visible.map((s, si) => (
            <path
              key={`area-${s.label}`}
              d={areaFor(s)}
              fill={s.color}
              fillOpacity={si === 0 ? 0.06 : 0.03}
            />
          ))}

          {/* Lines */}
          {visible.map((s) => (
            <path
              key={s.label}
              d={pathFor(s)}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Static dots */}
          {visible.map((s) =>
            s.data.map((v, i) => {
              const [cx, cy] = toPoint(v, i)
              return (
                <circle
                  key={`dot-${s.label}-${i}`}
                  cx={cx} cy={cy} r="4"
                  fill="#ffffff" stroke={s.color} strokeWidth="2"
                  opacity={hoverIdx !== null && hoverIdx !== i ? 0.25 : 1}
                />
              )
            })
          )}

          {/* Hover crosshair */}
          {crosshairX !== null && (
            <line
              x1={crosshairX} y1={padTop}
              x2={crosshairX} y2={padTop + plotH}
              stroke="#71717a" strokeWidth="1" strokeDasharray="4 4"
            />
          )}

          {/* Hover highlight dots */}
          {hoverIdx !== null && visible.map((s) => {
            const [cx, cy] = toPoint(s.data[hoverIdx], hoverIdx)
            return (
              <circle
                key={`hover-${s.label}`}
                cx={cx} cy={cy} r="5"
                fill={s.color} stroke="white" strokeWidth="2.5"
              />
            )
          })}
        </svg>

        {/* Floating tooltip */}
        {hoverIdx !== null && months.length > 1 && (
          <div
            className="absolute top-1 z-10 pointer-events-none"
            style={{
              left: `${((padLeft + xStep * hoverIdx) / width) * 100}%`,
              transform: hoverIdx > months.length * 0.6 ? 'translateX(-100%) translateX(-8px)' : 'translateX(8px)',
            }}
          >
            <div className="flex flex-col gap-1.5 rounded-lg bg-[#18181b] px-3 py-2.5 shadow-lg">
              <span className="text-[13px] font-semibold text-[#a1a1aa]">{months[hoverIdx]}</span>
              {visible.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="whitespace-nowrap text-[14px] font-medium text-white">
                    {s.label}: <span className="font-bold">{s.data[hoverIdx]}{data?.unit || '%'}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
