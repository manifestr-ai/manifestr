const DEFAULT_LEGEND = [
  { label: 'Success', color: '#8696b0' },
  { label: 'Failed', color: '#18181b' },
]

const CX = 97
const CY = 97
const R = 97

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

export default function PromptSuccessChart({ data }) {
  const title = data?.title || 'Prompt Success'
  const success = data?.success ?? 62
  const failed = data?.failed ?? 38
  const legend = data?.legend || DEFAULT_LEGEND
  const total = success + failed || 1

  const successAngle = (success / total) * 360
  const failedAngle = (failed / total) * 360

  const successStart = 0
  const successEnd = successAngle
  const failedStart = successEnd
  const failedEnd = 360

  const successMid = successStart + successAngle / 2
  const failedMid = failedStart + failedAngle / 2

  const successLabel = labelXY(successMid, 55)
  const failedLabel = labelXY(failedMid, 55)

  return (
    <div className="shrink-0 w-[355.33px] bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 items-center">
      <p className="text-[18px] leading-7 font-medium text-[#18181b] w-full">{title}</p>

      <svg viewBox="0 0 194 194" width="194" height="194">
        <path d={slicePath(successStart, successEnd)} fill={legend[0]?.color || '#8696b0'} />
        <path d={slicePath(failedStart, failedEnd)} fill={legend[1]?.color || '#18181b'} />

        <text
          x={successLabel.x}
          y={successLabel.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="24"
          fontWeight="600"
          fontFamily="HK Grotesk, sans-serif"
        >
          {success}%
        </text>
        <text
          x={failedLabel.x}
          y={failedLabel.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="24"
          fontWeight="600"
          fontFamily="HK Grotesk, sans-serif"
        >
          {failed}%
        </text>
      </svg>

      <div className="flex items-center justify-center gap-4 w-full">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
