// Returning = dark, New = light grey — slice order matches legend (Returning first clockwise from 12 o'clock).
const DEFAULT_LEGEND = [
  { label: 'Returning', color: '#18181b' },
  { label: 'New', color: '#94a3b8' },
]

const CX = 115.5
const CY = 115.5
const R = 108

function polarToXY(angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  }
}

function slicePath(startAngle, endAngle) {
  const s = polarToXY(startAngle)
  const e = polarToXY(endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y} Z`
}

function labelXY(midAngle, offset = 42) {
  const rad = ((midAngle - 90) * Math.PI) / 180
  return {
    x: CX + offset * Math.cos(rad),
    y: CY + offset * Math.sin(rad),
  }
}

export default function PaidVsOrganic({ data }) {
  const title = data?.title || 'By User Type'
  const returningPct = Math.round(data?.returningPct ?? data?.organic ?? 0)
  const newPct = Math.round(data?.newPct ?? data?.paid ?? 0)
  const legend = data?.legend || DEFAULT_LEGEND
  const total = returningPct + newPct || 1

  const returningAngle = (returningPct / total) * 360
  const retStart = 0
  const retEnd = returningAngle
  const newStart = retEnd
  const newEnd = 360

  const retMid = retStart + returningAngle / 2
  const newMid = newStart + (360 - returningAngle) / 2

  const retLabel = labelXY(retMid, 52)
  const newLabel = labelXY(newMid, 48)

  return (
    <div className="w-full flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] lg:p-[18px] flex flex-col gap-4 lg:gap-6">
      <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>

      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 231 231" width="231" height="231">
          <path d={slicePath(retStart, retEnd)} fill="#18181b" />
          <path d={slicePath(newStart, newEnd)} fill="#94a3b8" />

          <text
            x={retLabel.x}
            y={retLabel.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="15"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            {returningPct}%
          </text>

          <text
            x={newLabel.x}
            y={newLabel.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#18181b"
            fontSize="15"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            {newPct}%
          </text>
        </svg>

        <div className="flex items-center gap-4">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
