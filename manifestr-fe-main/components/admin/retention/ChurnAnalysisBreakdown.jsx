function BreakdownPanel({ data }) {
  const title = data?.title || 'Churn Breakdown'
  const rows = data?.rows || []
  const maxValue = rows.reduce((m, r) => Math.max(m, r.value), 1)

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-5">
      <p className="text-[16px] leading-6 font-semibold text-[#18181b]">{title}</p>

      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const barPct = (row.value / maxValue) * 100
          return (
            <div key={row.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] leading-5 font-medium text-[#18181b]">
                  {row.label}
                </span>
                <span className="text-[13px] leading-5 font-semibold text-[#18181b]">
                  {row.value}%
                </span>
              </div>
              <div className="h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barPct}%`,
                    backgroundColor: '#18181b',
                    opacity: 0.3 + (row.value / maxValue) * 0.7,
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
    <div className="flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-semibold text-[#18181b]">{title}</p>
      <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
        <BreakdownPanel data={byPlan} />
        <BreakdownPanel data={bySegment} />
        <BreakdownPanel data={bySource} />
      </div>
    </div>
  )
}
