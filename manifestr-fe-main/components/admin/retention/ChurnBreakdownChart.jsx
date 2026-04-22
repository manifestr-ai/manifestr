const CX = 97
const CY = 97
const R = 97
const INNER_R = 56

function polar(angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function donutSlicePath(startAngle, endAngle) {
  const outerStart = polar(startAngle, R)
  const outerEnd = polar(endAngle, R)
  const innerEnd = polar(endAngle, INNER_R)
  const innerStart = polar(startAngle, INNER_R)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${R} ${R} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y}`,
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

  let cursor = 0
  const slices = segments.map((s) => {
    const angle = (s.value / total) * 360
    const start = cursor
    const end = cursor + angle
    cursor = end
    return { ...s, start, end }
  })

  return (
    <div className="shrink-0 w-[355.33px] bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center justify-center">
        <svg viewBox="0 0 194 194" width="194" height="194">
          {slices.map((s) => (
            <path key={s.label} d={donutSlicePath(s.start, s.end)} fill={s.color} />
          ))}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="500"
            fill="#71717a"
          >
            Total
          </text>
          <text
            x={CX}
            y={CY + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fontWeight="600"
            fill="#18181b"
            fontFamily="HK Grotesk, sans-serif"
          >
            {total}%
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[14px] leading-5 font-normal text-[#52525b] truncate">
                {s.label}
              </span>
            </div>
            <span className="text-[14px] leading-5 font-medium text-[#18181b] shrink-0">
              {s.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
