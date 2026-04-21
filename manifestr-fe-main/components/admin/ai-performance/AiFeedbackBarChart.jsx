export default function AiFeedbackBarChart({ data }) {
  const title = data?.title || 'AI Feedback'
  const xLabels = data?.xLabels || ['Positive', 'Neutral', 'Negative']
  const yLabels = data?.yLabels || ['100%', '80%', '60%', '40%', '20%', '0%']
  const max = data?.max || 100
  const values = data?.values || []

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
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 h-[408px] self-stretch">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="w-full flex-1 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="none">
          {yLabels.map((label, i) => {
            const y = padTop + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={label}>
                <line
                  x1={padLeft}
                  x2={width - padRight}
                  y1={y}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#40444e"
                >
                  {label}
                </text>
              </g>
            )
          })}

          {values.map((val, i) => {
            const cx = padLeft + groupW * (i + 0.5)
            const barH = (val / max) * plotH
            const y = padTop + plotH - barH
            return (
              <rect
                key={xLabels[i]}
                x={cx - barW / 2}
                y={y}
                width={barW}
                height={barH}
                fill="#18181b"
                rx="2"
              />
            )
          })}

          {xLabels.map((label, i) => (
            <text
              key={label}
              x={padLeft + groupW * (i + 0.5)}
              y={height - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight="500"
              fill="#40444e"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
