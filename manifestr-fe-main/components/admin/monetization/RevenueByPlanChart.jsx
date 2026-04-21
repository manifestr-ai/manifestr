export default function RevenueByPlanChart({ data }) {
  if (!data) return null

  const title = data.title || 'Revenue by Plan'
  const subtitle = data.subtitle || ''
  const rows = data.rows || []
  const total = data.total || 1

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
          </div>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => {
          const pct = Math.round((row.revenue / total) * 100)
          return (
            <div key={row.plan} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.plan}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] leading-5 font-normal text-[#71717a]">{pct}%</span>
                  <span className="text-[14px] leading-5 font-semibold text-[#18181b] tabular-nums w-[56px] text-right">
                    {row.formatted}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: row.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-2 border-t border-[#f4f4f5] flex items-center justify-between">
        <span className="text-[13px] leading-5 font-normal text-[#71717a]">Total MRR</span>
        <span className="text-[16px] leading-6 font-bold text-[#18181b]">
          ${(total / 1000).toFixed(1)}K
        </span>
      </div>
    </div>
  )
}
