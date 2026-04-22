import { useState } from 'react'

const DEFAULT_LEGEND = [
  { label: 'Success', color: '#8696b0' },
  { label: 'Failed', color: '#18181b' },
]

const CX = 97
const CY = 97
const R = 97
const R_HOVER = 102

function polarToXY(angleDeg, radius = R) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function slicePath(startAngle, endAngle, outerR = R) {
  const s = polarToXY(startAngle, outerR)
  const e = polarToXY(endAngle, outerR)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${large} 1 ${e.x} ${e.y} Z`
}

function labelXY(midAngle, offset) {
  const rad = ((midAngle - 90) * Math.PI) / 180
  return {
    x: CX + offset * Math.cos(rad),
    y: CY + offset * Math.sin(rad),
  }
}

export default function PromptSuccessChart({ data }) {
  const title = data?.title || 'Prompt Success'
  const success = data?.success ?? 62
  const failed = data?.failed ?? 38
  const legend = data?.legend || DEFAULT_LEGEND
  const total = success + failed || 1
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const successAngle = (success / total) * 360
  const failedAngle = (failed / total) * 360

  const slices = [
    { label: legend[0]?.label || 'Success', value: success, color: legend[0]?.color || '#8696b0', start: 0, end: successAngle },
    { label: legend[1]?.label || 'Failed', value: failed, color: legend[1]?.color || '#18181b', start: successAngle, end: 360 },
  ]

  const hoveredSlice = hoveredIdx !== null ? slices[hoveredIdx] : null

  return (
    <div className="w-full lg:shrink-0 lg:w-[355.33px] bg-white border border-[#e4e4e7] rounded-xl p-4 sm:p-[18px] flex flex-col gap-4 items-center">
      <p className="text-[18px] leading-7 font-medium text-[#18181b] w-full">{title}</p>

      <svg viewBox="0 0 194 194" width="194" height="194" style={{ overflow: 'visible', cursor: 'pointer' }}>
        {slices.map((s, i) => {
          const isHovered = hoveredIdx === i
          const mid = s.start + (s.end - s.start) / 2
          const lbl = labelXY(mid, 55)
          return (
            <g key={s.label}>
              <path
                d={slicePath(s.start, s.end, isHovered ? R_HOVER : R)}
                fill={s.color}
                opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
                style={{ transition: 'opacity 0.15s' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              <text
                x={lbl.x}
                y={lbl.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={isHovered ? '26' : '24'}
                fontWeight="600"
                fontFamily="HK Grotesk, sans-serif"
                style={{ pointerEvents: 'none', transition: 'font-size 0.1s' }}
              >
                {s.value}%
              </text>
            </g>
          )
        })}

        {/* Center tooltip on hover */}
        {hoveredSlice && (
          <>
            <circle cx={CX} cy={CY} r="40" fill="white" />
            <text
              x={CX} y={CY - 7}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="11" fontWeight="500" fill="#71717a"
              style={{ pointerEvents: 'none' }}
            >
              {hoveredSlice.label}
            </text>
            <text
              x={CX} y={CY + 9}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="17" fontWeight="700" fill="#18181b"
              fontFamily="HK Grotesk, sans-serif"
              style={{ pointerEvents: 'none' }}
            >
              {hoveredSlice.value}%
            </text>
          </>
        )}
      </svg>

      <div className="flex items-center justify-center gap-4 w-full">
        {legend.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-2 py-1 rounded-[6px] cursor-default transition-colors"
            style={{ backgroundColor: hoveredIdx === i ? `${item.color}18` : 'transparent' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span
              className="w-2 h-2 rounded-full transition-transform"
              style={{
                backgroundColor: item.color,
                transform: hoveredIdx === i ? 'scale(1.4)' : 'scale(1)',
              }}
            />
            <span
              className="text-[12px] leading-[18px] transition-colors"
              style={{ color: hoveredIdx === i ? '#18181b' : '#52525b', fontWeight: hoveredIdx === i ? 600 : 400 }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
