import { useState, useRef, useCallback } from 'react'

const DEFAULT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DEFAULT_Y = ['3.0', '2.5', '2.0', '1.5', '1.0', '0.5']
const DEFAULT_DATA = [1.2, 1.35, 1.5, 1.65, 1.8, 2.0, 2.15, 2.35, 2.5, 2.7, 2.9, 3.1]

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

export default function DecksPerUserChart({ data }) {
  const title = data?.title || 'Decks per User'
  const months = data?.months || DEFAULT_MONTHS
  const yLabels = data?.yLabels || DEFAULT_Y
  const series = data?.data || DEFAULT_DATA
  const minValue = data?.min ?? 0.5
  const maxValue = data?.max ?? 3.0

  const W = 640
  const H = 260

  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

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
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 min-h-[300px] h-[340px] lg:p-[18px] lg:gap-6 lg:h-[370px]">
      <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>

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
                      {months[hoverIdx]}: {series[hoverIdx] !== undefined && series[hoverIdx] !== null ? series[hoverIdx].toFixed(1) : "--"}
                 
                    </span>
                  </div>
                </div>
              )}
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
