import { useState } from 'react'

const CX = 97
const CY = 97
const R = 97
const INNER_R = 56
const R_HOVER = 101

function polar(angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) }
}

function donutSlicePath(startAngle, endAngle, outerR = R) {
  const outerStart = polar(startAngle, outerR)
  const outerEnd = polar(endAngle, outerR)
  const innerEnd = polar(endAngle, INNER_R)
  const innerStart = polar(startAngle, INNER_R)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

export default function ChurnBreakdownChart({ data }) {
  const title = data?.title || 'Churn Breakdown'
  const subtitle = data?.subtitle || ''
  const segments = data?.segments || []
  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || 1
  const [hoveredIdx, setHoveredIdx] = useState(null)

  let cursor = 0
  const slices = segments.map((s) => {
    const angle = (s.value / total) * 360
    const start = cursor
    const end = cursor + angle
    cursor = end
    return { ...s, start, end }
  })

  const hovered = hoveredIdx !== null ? slices[hoveredIdx] : null

  return (
    <div className="w-full min-w-0 max-w-full bg-white border border-[#e4e4e7] rounded-xl p-[14px] lg:p-[18px] flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-row items-center gap-4 min-w-0 lg:gap-6">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {segments.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center justify-between gap-3 rounded-[6px] px-2 py-1 transition-colors cursor-default"
              style={{
                backgroundColor: hoveredIdx === i ? `${s.color}18` : 'transparent',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-transform"
                  style={{
                    backgroundColor: s.color,
                    transform: hoveredIdx === i ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
                <span
                  className="text-[14px] leading-5 font-normal truncate transition-colors"
                  style={{ color: hoveredIdx === i ? '#18181b' : '#52525b', fontWeight: hoveredIdx === i ? 500 : 400 }}
                >
                  {s.label}
                </span>
              </div>
              <span className="text-[14px] leading-5 font-semibold text-[#18181b] shrink-0">
                {s.value}%
              </span>
            </div>
          ))}
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 194 194"
            className="w-[148px] h-[148px] sm:w-[178px] sm:h-[178px] lg:w-[194px] lg:h-[194px]"
            style={{ cursor: 'pointer', overflow: 'visible' }}
          >
            {slices.map((s, i) => {
              const isHovered = hoveredIdx === i
              return (
                <path
                  key={s.label}
                  d={donutSlicePath(s.start, s.end, isHovered ? R_HOVER : R)}
                  fill={s.color}
                  opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
                  style={{ transition: 'opacity 0.15s, d 0.15s' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              )
            })}

            {/* Center text — updates on hover */}
            <text
              x={CX} y={CY - 8}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="12" fontWeight="500" fill="#71717a"
            >
              {hovered ? hovered.label : 'Total'}
            </text>
            <text
              x={CX} y={CY + 12}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="22" fontWeight="700" fill="#18181b"
              fontFamily="HK Grotesk, sans-serif"
            >
              {hovered ? `${hovered.value}%` : `${total}%`}
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
