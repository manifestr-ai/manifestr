import { useState } from 'react'

function BreakdownPanel({ data }) {
  const title = data?.title || 'Churn Breakdown'
  const rows = data?.rows || []
  const maxValue = rows.reduce((m, r) => Math.max(m, r.value), 1)
  const [hoveredLabel, setHoveredLabel] = useState(null)

  return (
    <div className="w-full flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] lg:p-[18px] flex flex-col gap-4 lg:gap-5">
      <p className="text-[15px] leading-6 font-semibold text-[#18181b] lg:text-[16px]">{title}</p>

      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const barPct = (row.value / maxValue) * 100
          const isHovered = hoveredLabel === row.label

          return (
            <div
              key={row.label}
              className="flex flex-col gap-1.5 rounded-[6px] px-2 py-1.5 -mx-2 cursor-default transition-colors"
              style={{ backgroundColor: isHovered ? 'rgba(24,24,27,0.04)' : 'transparent' }}
              onMouseEnter={() => setHoveredLabel(row.label)}
              onMouseLeave={() => setHoveredLabel(null)}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] leading-5 font-medium transition-colors"
                  style={{ color: isHovered ? '#18181b' : '#52525b' }}
                >
                  {row.label}
                </span>
                <span
                  className="text-[13px] leading-5 font-bold transition-colors"
                  style={{ color: isHovered ? '#18181b' : '#71717a' }}
                >
                  {row.value}%
                </span>
              </div>
              <div className="h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${barPct}%`,
                    backgroundColor: '#18181b',
                    opacity: isHovered ? 1 : 0.3 + (row.value / maxValue) * 0.5,
                    transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                    transformOrigin: 'center',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ChurnAnalysisBreakdown({ data }) {
  const title = data?.title || 'Churn Analysis'
  const byPlan = data?.byPlan
  const bySegment = data?.bySegment
  const bySource = data?.bySource

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <p className="text-[16px] leading-6 font-semibold text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
        <div className="w-full min-w-0 lg:flex-1">
          <BreakdownPanel data={byPlan} />
        </div>
        <div className="w-full min-w-0 lg:flex-1">
          <BreakdownPanel data={bySegment} />
        </div>
        <div className="w-full min-w-0 lg:flex-1">
          <BreakdownPanel data={bySource} />
        </div>
      </div>
    </div>
  )
}
