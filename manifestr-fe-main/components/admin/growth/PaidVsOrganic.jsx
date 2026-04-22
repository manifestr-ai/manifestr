// Paid = dark (#1e293b), Organic = gray-blue (#94a3b8)
// Paid starts at 12-o'clock going clockwise, Organic fills the rest
const LEGEND = [
  { label: 'Organic', color: '#18181b' },
  { label: 'Paid', color: '#94a3b8' },
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

function labelXY(midAngle, offset = 38) {
  const rad = ((midAngle - 90) * Math.PI) / 180
  return {
    x: CX + offset * Math.cos(rad),
    y: CY + offset * Math.sin(rad),
  }
}

export default function PaidVsOrganic({ data }) {
  const title = data?.title || 'Paid vs Organic'
  const organic = data?.organic ?? 62
  const paid = data?.paid ?? 38
  const legend = data?.legend || LEGEND
  const total = organic + paid

  // Paid starts at 0° (12-o'clock), Organic fills the rest
  const paidAngle = (paid / total) * 360
  const organicAngle = (organic / total) * 360

  const paidStart = 0
  const paidEnd = paidAngle
  const organicStart = paidEnd
  const organicEnd = 360

  const paidMid = paidStart + paidAngle / 2
  const organicMid = organicStart + organicAngle / 2

  const paidLabel = labelXY(paidMid, 52)
  const organicLabel = labelXY(organicMid, 42)

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 231 231" width="231" height="231">
          <path d={slicePath(paidStart, paidEnd)} fill="#1e293b" />
          <path d={slicePath(organicStart, organicEnd)} fill="#94a3b8" />

          <text
            x={paidLabel.x}
            y={paidLabel.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="16"
            fontWeight="600"
            fontFamily="HK Grotesk, sans-serif"
          >
            ${paid}K
          </text>

          <text
            x={organicLabel.x}
            y={organicLabel.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="16"
            fontWeight="600"
            fontFamily="HK Grotesk, sans-serif"
          >
            ${organic}K
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
