import { useState, useRef, useCallback } from 'react'

const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DEFAULT_Y = ['10', '8', '6', '4', '2', '0']
const DEFAULT_DATA = [1, 2, 3, 4, 5, 6, 8.5]

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

export default function CommentsPerDocument({ data }) {
  const title = data?.title || 'Comments per Document'
  const days = data?.days || DEFAULT_DAYS
  const yLabels = data?.yLabels || DEFAULT_Y
  const series = data?.data || DEFAULT_DATA
  const minValue = data?.min ?? 0
  const maxValue = data?.max ?? 10

  const W = 1200
  const H = 240

  const [hoverIdx, setHoverIdx] = useState(null)
  const svgRef = useRef(null)

  const handleMouseMove = useCallback(
    (e) => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = x / rect.width
      const idx = Math.round(pct * (days.length - 1))
      setHoverIdx(Math.max(0, Math.min(idx, days.length - 1)))
    },
    [days.length],
  )

  const step = W / (days.length - 1)

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 w-full h-[340px]">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

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
                  style={{ left: `${(hoverIdx / (days.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="bg-[#f8fafc] border border-[#e4e4e7] rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-[#18181b]" />
                    <span className="text-[12px] font-medium text-[#18181b]">
                      {days[hoverIdx]}: {series[hoverIdx]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-2">
              {days.map((d, i) => (
                <span
                  key={d}
                  className={`text-[12px] leading-[18px] font-normal tracking-[0.06px] ${
                    hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#475467]'
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
