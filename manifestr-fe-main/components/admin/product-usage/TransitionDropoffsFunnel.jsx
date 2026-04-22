import { useState, useRef, useCallback } from 'react'

const DEFAULT_STAGES = [
  'Full Journey',
  'Performance Review',
  'Visual Enhancement',
  'Content Creation',
  'Template Deck',
  'Initial Research',
]
const DEFAULT_X = [0, 1, 2, 3, 4, 5]
const DEFAULT_DATA = [0.3, 1.0, 1.8, 2.8, 3.7, 4.6, 5.2]

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

export default function TransitionDropoffsFunnel({ data }) {
  const title = data?.title || 'Transition Drop-offs (Funnel)'
  const stages = data?.stages || DEFAULT_STAGES
  const xLabels = data?.xLabels || DEFAULT_X
  const series = data?.data || DEFAULT_DATA
  const minValue = data?.min ?? 0
  const maxValue = data?.max ?? 6

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
      const idx = Math.round(pct * (series.length - 1))
      setHoverIdx(Math.max(0, Math.min(idx, series.length - 1)))
    },
    [series.length],
  )

  const step = W / (series.length - 1)

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 min-h-[300px] h-[340px] lg:p-[18px] lg:gap-6 lg:h-[370px]">
      <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>

      <div className="relative flex-1 min-h-0">
        <div className="flex h-full min-w-0">
          <div className="flex flex-col justify-between pr-1 shrink-0 pb-[26px] w-[72px] sm:w-[96px] lg:w-[120px] lg:pr-2">
            {stages.map((stage) => (
              <span
                key={stage}
                className="text-[10px] leading-3 font-medium text-[#40444e] tracking-[0.06px] whitespace-pre-line sm:text-[12px] sm:leading-[14px]"
              >
                {stage}
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
                {stages.map((_, i) => (
                  <line
                    key={i}
                    x1={0}
                    y1={(i / (stages.length - 1)) * H}
                    x2={W}
                    y2={(i / (stages.length - 1)) * H}
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
            </div>

            <div
              className="mt-2 grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${xLabels.length}, minmax(0, 1fr))` }}
            >
              {xLabels.map((l, i) => (
                <span
                  key={`${l}-${i}`}
                  className={`text-center text-[10px] leading-3 font-medium tracking-[0.06px] sm:text-[12px] sm:leading-[18px] truncate ${
                    hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'
                  }`}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
