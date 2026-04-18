const DEFAULT_ROWS = [
  { rank: 1, name: 'Professional', value: '1,240', percent: '38.1% of users' },
  { rank: 3, name: 'Business', value: '810', percent: '34.5% of users' },
  { rank: 5, name: 'Educational', value: '1140', percent: '40.2% of users' },
  { rank: 5, name: 'Playful', value: '1140', percent: '40.2% of users' },
]

export default function AiStyleSettingsUsage({ data }) {
  const title = data?.title || 'AI Style Settings Usage'
  const rows = data?.rows || DEFAULT_ROWS

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 h-full">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="border border-[#e4e4e7] rounded-[6px] overflow-hidden">
        {rows.map((row, idx) => (
          <div
            key={`${row.rank}-${row.name}-${idx}`}
            className={`flex items-center h-[72px] ${idx !== rows.length - 1 ? 'border-b border-[#e4e4e7]' : ''}`}
          >
            <div className="w-[50px] shrink-0 px-4 flex items-center">
              <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.rank}</span>
            </div>
            <div className="flex-1 min-w-0 px-4 flex items-center">
              <span className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.name}</span>
            </div>
            <div className="w-[159px] shrink-0 px-4 flex flex-col items-end">
              <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.value}</span>
              <span className="text-[14px] leading-5 font-normal text-[#71717a]">{row.percent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
