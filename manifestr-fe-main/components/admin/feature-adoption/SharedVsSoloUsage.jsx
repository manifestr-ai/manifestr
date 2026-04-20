const DEFAULT_SLICES = [
  { label: 'Shared', value: 62, color: '#94a3b8', textColor: 'white' },
  { label: 'Solo', value: 38, color: '#18181b', textColor: 'white' },
]

const CX = 115.5
const CY = 115.5
const R = 100

function polarToXY(angleDeg, radius = R) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function slicePath(startAngle, endAngle) {
  const s = polarToXY(startAngle)
  const e = polarToXY(endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y} Z`
}

function labelXY(midAngle, offset) {
  const rad = ((midAngle - 90) * Math.PI) / 180
  return {
    x: CX + offset * Math.cos(rad),
    y: CY + offset * Math.sin(rad),
  }
}

export default function SharedVsSoloUsage({ data, widthClass = 'w-[300px]' }) {
  const title = data?.title || 'Shared vs Solo Usage'
  const slices = data?.slices || DEFAULT_SLICES
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1

  let cursor = 0
  const renderedSlices = slices.map((s) => {
    const angle = (s.value / total) * 360
    const start = cursor
    const end = cursor + angle
    cursor = end
    const mid = (start + end) / 2
    const label = labelXY(mid, 55)
    return { ...s, start, end, label, angle }
  })

  return (
    <div className={`${widthClass} shrink-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 items-center`}>
      <p className="text-[18px] leading-7 font-medium text-[#18181b] w-full">{title}</p>

      <svg viewBox="0 0 231 231" width="231" height="231">
        {renderedSlices.map((s) => (
          <path key={s.label} d={slicePath(s.start, s.end)} fill={s.color} />
        ))}
        {renderedSlices.map((s) => (
          <text
            key={`label-${s.label}`}
            x={s.label.x}
            y={s.label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={s.textColor || 'white'}
            fontSize="20"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            {s.value}%
          </text>
        ))}
      </svg>

      <div className="flex items-center justify-center gap-4 w-full">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[12px] leading-[18px] font-normal text-[#52525b] whitespace-nowrap">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
