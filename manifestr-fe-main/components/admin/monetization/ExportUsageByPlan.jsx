export default function ExportUsageByPlan({ data }) {
  if (!data) return null

  const title = data.title || 'Export Usage by Plan'
  const subtitle = data.subtitle || ''
  const plans = data.plans || []
  const legend = data.legend || []
  const max = data.max ?? 2000
  const yLabels = data.yLabels || []

  const W = 560
  const H = 240
  const padL = 48
  const padR = 16
  const padT = 12
  const padB = 30
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const nPlans = Math.max(1, plans.length)
  const nTypes = Math.max(1, legend.length)
  const groupW = plotW / nPlans
  const groupMargin = 10
  const gap = 3
  const available = groupW - 2 * groupMargin
  let barW = (available - (nTypes - 1) * gap) / nTypes
  barW = Math.max(6, Math.min(22, barW))

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
          </div>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          {yLabels.map((label, i) => {
            const y = padT + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={`${label}-${i}`}>
                <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e4e4e7" strokeDasharray="4 4" strokeWidth="1" />
                <text x={padL - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fontWeight="500" fill="#71717a">
                  {label}
                </text>
              </g>
            )
          })}

          {plans.map((plan, planIdx) => {
            const clusterW = nTypes * barW + (nTypes - 1) * gap
            const groupStart = padL + planIdx * groupW + (groupW - clusterW) / 2

            return (
              <g key={plan.label}>
                {legend.map((type, typeIdx) => {
                  const val = plan.values?.[typeIdx] ?? 0
                  const barH = (val / max) * plotH
                  const x = groupStart + typeIdx * (barW + gap)
                  const y = padT + plotH - barH
                  return (
                    <rect key={`${plan.label}-${type.key}`} x={x} y={y} width={barW} height={barH} fill={type.color} rx="2">
                      <title>{`${plan.label} · ${type.label}: ${val.toLocaleString()}`}</title>
                    </rect>
                  )
                })}
                <text
                  x={padL + groupW * (planIdx + 0.5)}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#52525b"
                >
                  {plan.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex items-center gap-5 flex-wrap pt-1 border-t border-[#e4e4e7]">
        {legend.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
