import { Info } from 'lucide-react'

export default function PlanBreakdownChart({ data }) {
  const title = data?.title || 'Breakdown by Plan'
  const subtitle = data?.subtitle || ''
  const stageSeries = data?.stageSeries || []
  const plans = data?.plans || []
  const yLabels = data?.yLabels || ['100%', '80%', '60%', '40%', '20%', '0%']
  const max = data?.max ?? 100

  const width = data?.chartWidth ?? 920
  const height = data?.chartHeight ?? 300
  const padLeft = 48
  const padRight = 24
  const padTop = 16
  const padBottom = 40
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const nPlans = Math.max(1, plans.length)
  const nStages = Math.max(1, stageSeries.length)
  const groupW = plotW / nPlans
  const gap = 4
  const totalGaps = (nStages - 1) * gap
  const groupMargin = 12
  const available = Math.max(0, groupW - 2 * groupMargin)
  let barW = (available - totalGaps) / nStages
  barW = Math.max(8, Math.min(28, barW))
  const clusterW = nStages * barW + totalGaps

  return (
    <div className="flex-1 min-w-0 w-full bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
            <Info className="w-4 h-4 text-[#71717a] shrink-0" strokeWidth={1.75} />
          </div>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          {yLabels.map((label, i) => {
            const y = padTop + (plotH / (yLabels.length - 1)) * i
            return (
              <g key={`${label}-${i}`}>
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

          {plans.map((plan, planIdx) => {
            const clusterW = nStages * barW + totalGaps
            const groupStart = padLeft + planIdx * groupW + (groupW - clusterW) / 2

            return (
              <g key={plan.label}>
                {stageSeries.map((stage, stageIdx) => {
                  const val = plan.values?.[stageIdx] ?? 0
                  const barH = (val / max) * plotH
                  const x = groupStart + stageIdx * (barW + gap)
                  const y = padTop + plotH - barH
                  return (
                    <rect
                      key={`${plan.label}-${stage.key}`}
                      x={x}
                      y={y}
                      width={barW}
                      height={barH}
                      fill={stage.color}
                      rx="2"
                    >
                      <title>{`${plan.label} · ${stage.label}: ${val}%`}</title>
                    </rect>
                  )
                })}
                <text
                  x={padLeft + groupW * (planIdx + 0.5)}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#40444e"
                >
                  {plan.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex items-center gap-6 flex-wrap pt-1 border-t border-[#e4e4e7]">
        {stageSeries.map((stage) => (
          <div key={stage.key} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
