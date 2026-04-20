const DEFAULT_ROWS = [
  { label: 'Single Tool', value: 1450, percent: 40 },
  { label: 'Two Tools', value: 1450, percent: 40 },
  { label: 'Three Tools', value: 1450, percent: 45 },
  { label: '4+ Tools', value: 1450, percent: 60 },
]

export default function MultiToolUsage({ data }) {
  const title = data?.title || 'Multi-Tool Usage'
  const percent = data?.percent || '48%'
  const percentLabel = data?.percentLabel || 'Users utilize multiple tools'
  const rows = data?.rows || DEFAULT_ROWS
  const powerUsersLabel = data?.powerUsersLabel || 'Power Users (3+ tools):'
  const powerUsersValue = data?.powerUsersValue || '16%'

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 h-[370px]">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="flex flex-col items-center gap-1">
        <p className="text-[30px] leading-[38px] font-semibold text-[#18181b] font-sans">{percent}</p>
        <p className="text-[14px] leading-5 font-normal text-[#52525b]">{percentLabel}</p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4">
            <span className="w-[90px] shrink-0 text-[14px] leading-5 font-normal text-[#18181b]">{row.label}</span>
            <div className="flex-1 min-w-0 h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#18181b] rounded-full"
                style={{ width: `${Math.min(Math.max(row.percent, 0), 100)}%` }}
              />
            </div>
            <span className="w-[48px] shrink-0 text-right text-[14px] leading-5 font-medium text-[#18181b]">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#e4e4e7] mt-auto">
        <span className="text-[14px] leading-5 font-normal text-[#52525b]">{powerUsersLabel}</span>
        <span className="text-[14px] leading-5 font-semibold text-[#18181b]">{powerUsersValue}</span>
      </div>
    </div>
  )
}
