const DEFAULT_ROWS = [
  { rank: 1, journey: 'Briefcase → The Deck', value: '1,240', percent: '38.1% of users' },
  { rank: 2, journey: 'Briefcase → Strategist', value: '960', percent: '38.1% of users' },
  { rank: 3, journey: 'The Deck → Analyzer', value: '810', percent: '34.5% of users' },
  { rank: 4, journey: 'The Deck → Design Studio', value: '810', percent: '34.5% of users' },
  { rank: 5, journey: 'Strategist → The Deck', value: '1140', percent: '40.2% of users' },
  { rank: 6, journey: 'Strategist → Cost CTRL', value: '1140', percent: '40.2% of users' },
]

function JourneyTable({ rows }) {
  return (
    <div className="flex-1 min-w-0 border border-[#e4e4e7] rounded-[6px] overflow-hidden">
      {rows.map((row, idx) => (
        <div
          key={`${row.rank}-${idx}`}
          className={`flex items-center h-[72px] ${idx !== rows.length - 1 ? 'border-b border-[#e4e4e7]' : ''}`}
        >
          <div className="w-[50px] shrink-0 px-4 flex items-center">
            <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.rank}</span>
          </div>
          <div className="flex-1 min-w-0 px-4 flex items-center">
            <span className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.journey}</span>
          </div>
          <div className="w-[143px] shrink-0 px-4 flex flex-col items-end">
            <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.value}</span>
            <span className="text-[14px] leading-5 font-normal text-[#71717a]">{row.percent}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MostCommonJourneys({ data }) {
  const title = data?.title || 'Most Common User Journeys'
  const rows = data?.rows || DEFAULT_ROWS

  const leftRows = rows.filter((_, i) => i % 2 === 0)
  const rightRows = rows.filter((_, i) => i % 2 === 1)

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 w-full min-w-0 lg:p-[18px] lg:gap-6">
      <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>

      <div className="flex flex-col gap-4 items-stretch lg:flex-row lg:gap-4">
        <JourneyTable rows={leftRows} />
        <JourneyTable rows={rightRows} />
      </div>
    </div>
  )
}
