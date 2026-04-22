import { useState, useRef, useCallback, useEffect } from 'react'
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

export default function LatencyTrendChart({ data }) {
  const cfg = { ...DEFAULT_DATA, ...(data || {}) }
  const [selected, setSelected] = useState(cfg.selectedFilter || cfg.filterOptions[0])
  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

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

  const toPoint = useCallback((val, idx) => {
    const x = padLeft + xStep * idx
    const y = padTop + plotH - (val / max) * plotH
    return [x, y]
  }, [xStep, plotH, max])

  const pathFor = (series) =>
    series.data.map((v, i) => {
      const [x, y] = toPoint(v, i)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

  const areaFor = (series) => {
    const pts = series.data.map((v, i) => toPoint(v, i))
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
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{cfg.title}</p>
        <FilterButton selected={selected} setSelected={setSelected} options={cfg.filterOptions} />
      </div>

      {/* Live readout */}
      <div className="h-5">
        {hoverIdx !== null && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[13px] font-semibold text-[#71717a]">{months[hoverIdx]}</span>
            {visible.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-[13px] font-medium text-[#18181b]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                {s.label}: <span className="font-bold">{s.data[hoverIdx]}ms</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          preserveAspectRatio="none"
          style={{ height, cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Grid + y-axis */}
          {yLabels.map((label, i) => {
            const y = padTop + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={label}>
                <line
                  x1={padLeft} x2={width - padRight} y1={y} y2={y}
                  stroke="#e4e4e7" strokeDasharray="4 4" strokeWidth="1"
                />
                <text
                  x={padLeft - 8} y={y}
                  textAnchor="end" dominantBaseline="middle"
                  fontSize="12" fontWeight="500" fill="#40444e"
                >
                  {label}
                </text>
              </g>
            )
          })}

          {/* X-axis */}
          {months.map((m, i) => (
            <text
              key={`${m}-${i}`}
              x={padLeft + xStep * i}
              y={height - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight={hoverIdx === i ? '700' : '500'}
              fill={hoverIdx === i ? '#18181b' : '#40444e'}
            >
              {m}
            </text>
          ))}

          {/* Area fills */}
          {visible.map((series, si) => (
            <path
              key={`area-${series.label}`}
              d={areaFor(series)}
              fill={series.color}
              fillOpacity={si === 0 ? 0.06 : 0.03}
            />
          ))}

          {/* Lines */}
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

          {/* Static dots */}
          {visible.map((series) =>
            series.data.map((v, i) => {
              const [cx, cy] = toPoint(v, i)
              return (
                <circle
                  key={`dot-${series.label}-${i}`}
                  cx={cx} cy={cy} r="3"
                  fill="white" stroke={series.color} strokeWidth="1.5"
                  opacity={hoverIdx !== null && hoverIdx !== i ? 0.2 : 0.7}
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

          {/* Hover dots */}
          {hoverIdx !== null && visible.map((series) => {
            const [cx, cy] = toPoint(series.data[hoverIdx], hoverIdx)
            return (
              <circle
                key={`hover-${series.label}`}
                cx={cx} cy={cy} r="5"
                fill={series.color} stroke="white" strokeWidth="2"
              />
            )
          })}
        </svg>

        {/* Floating tooltip */}
        {hoverIdx !== null && months.length > 1 && visible.length > 0 && (
          <div
            className="absolute top-1 z-10 pointer-events-none"
            style={{
              left: `${((padLeft + xStep * hoverIdx) / width) * 100}%`,
              transform: hoverIdx > months.length * 0.6 ? 'translateX(-100%) translateX(-8px)' : 'translateX(8px)',
            }}
          >
            <div className="bg-[#18181b] rounded-lg px-3 py-2 flex flex-col gap-1 shadow-lg">
              <span className="text-[11px] font-semibold text-[#a1a1aa]">{months[hoverIdx]}</span>
              {visible.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-[12px] font-medium text-white whitespace-nowrap">
                    {s.label}: <span className="font-bold">{s.data[hoverIdx]}ms</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {selected === 'Both' && cfg.series.length > 1 && (
        <div className="flex items-center gap-4 flex-wrap">
          {cfg.series.map((s) => (
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
