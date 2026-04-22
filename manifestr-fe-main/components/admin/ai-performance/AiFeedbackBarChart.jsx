import { useState } from 'react'

export default function AiFeedbackBarChart({ data }) {
  const title = data?.title || 'AI Feedback'
  const xLabels = data?.xLabels || ['Positive', 'Neutral', 'Negative']
  const yLabels = data?.yLabels || ['100%', '80%', '60%', '40%', '20%', '0%']
  const max = data?.max || 100
  const values = data?.values || []
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const width = 560
  const height = 283
  const padLeft = 44
  const padRight = 24
  const padTop = 12
  const padBottom = 28
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const barCount = xLabels.length
  const groupW = plotW / barCount
  const barW = 36

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-4 sm:p-[18px] flex flex-col gap-4 h-auto sm:h-[408px] self-stretch">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        {hoveredIdx !== null && (
          <span className="text-[13px] font-semibold text-[#18181b]">
            {xLabels[hoveredIdx]}: <span className="font-bold">{values[hoveredIdx]}%</span>
          </span>
        )}
      </div>

      <div className="w-full flex-1 overflow-hidden relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ cursor: 'default' }}
        >
          {/* Grid */}
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

          {/* Bars */}
          {values.map((val, i) => {
            const cx = padLeft + groupW * (i + 0.5)
            const barH = (val / max) * plotH
            const y = padTop + plotH - barH
            const isHovered = hoveredIdx === i
            return (
              <g key={xLabels[i]}>
                {/* Hover background */}
                <rect
                  x={cx - groupW / 2}
                  y={padTop}
                  width={groupW}
                  height={plotH}
                  fill={isHovered ? 'rgba(24,24,27,0.04)' : 'transparent'}
                />
                {/* Bar */}
                <rect
                  x={cx - barW / 2}
                  y={y}
                  width={barW}
                  height={barH}
                  fill={isHovered ? '#18181b' : '#3f3f46'}
                  rx="3"
                  style={{ transition: 'fill 0.15s' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {/* Value label on hover */}
                {isHovered && (
                  <text
                    x={cx}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#18181b"
                  >
                    {val}%
                  </text>
                )}
              </g>
            )
          })}

          {/* X-axis labels */}
          {xLabels.map((label, i) => (
            <text
              key={label}
              x={padLeft + groupW * (i + 0.5)}
              y={height - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight={hoveredIdx === i ? '700' : '500'}
              fill={hoveredIdx === i ? '#18181b' : '#40444e'}
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
