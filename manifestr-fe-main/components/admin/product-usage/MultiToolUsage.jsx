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
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 min-h-[300px] h-[340px] lg:p-[18px] lg:gap-6 lg:h-[370px]">
      <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>

      <div className="flex flex-col items-center gap-1">
        <p className="text-[26px] leading-[34px] font-semibold text-[#18181b] font-sans sm:text-[30px] sm:leading-[38px]">
          {percent}
        </p>
        <p className="text-[14px] leading-5 font-normal text-[#52525b]">{percentLabel}</p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="w-[72px] shrink-0 text-[12px] leading-4 font-normal text-[#18181b] sm:w-[90px] sm:text-[14px] sm:leading-5">
              {row.label}
            </span>
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
