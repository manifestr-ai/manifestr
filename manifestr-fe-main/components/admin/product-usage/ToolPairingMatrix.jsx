import { Star, TrendingUp } from 'lucide-react'

const DEFAULT_ROWS = [
  { rank: 1, combination: 'Briefcase + The Deck', usage: '1,240', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 2, combination: 'Design Studio + Wordsmith', usage: '3,100', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 3, combination: 'The Deck + Analyzer', usage: '1,870', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 4, combination: 'Wordsmith + The Huddle', usage: '2,900', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 5, combination: 'The Deck + Analyzer', usage: '2,300', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 6, combination: 'Wordsmith + The Huddle', usage: '3,500', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 7, combination: 'Briefcase + Strategist', usage: '2,650', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 8, combination: 'Analyzer + The Huddle', usage: '3,300', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 9, combination: 'Strategist + The Deck', usage: '4,200', effectiveness: '92%', satisfaction: '4.8' },
  { rank: 10, combination: 'Cost CTRL + Analyzer', usage: '1,240', effectiveness: '92%', satisfaction: '4.8' },
]

const COLUMNS = [
  { key: 'rank', label: '', width: 'w-[60px]', align: 'left' },
  { key: 'combination', label: 'Tool Combination', flex: true, align: 'left' },
  { key: 'usage', label: 'Usage Count', width: 'w-[140px]', align: 'left' },
  { key: 'effectiveness', label: 'Effectiveness', width: 'w-[140px]', align: 'left' },
  { key: 'satisfaction', label: 'Satisfaction', width: 'w-[120px]', align: 'left' },
  { key: 'trend', label: 'Trend', width: 'w-[80px]', align: 'left' },
]

export default function ToolPairingMatrix({ data }) {
  const title = data?.title || 'Tool Pairing Effectiveness Matrix'
  const rows = data?.rows || DEFAULT_ROWS

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 w-full min-w-0 lg:p-[18px] lg:gap-6">
      <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>

      <div className="w-full overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
        <div className="min-w-[720px]">
          <div className="flex items-center h-[48px] border-b border-[#e4e4e7]">
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className={`px-4 flex items-center ${col.flex ? 'flex-1 min-w-0' : `${col.width} shrink-0`}`}
              >
                <span className="text-[14px] leading-5 font-medium text-[#71717a]">{col.label}</span>
              </div>
            ))}
          </div>

          {rows.map((row, idx) => (
            <div
              key={`${row.rank}-${idx}`}
              className={`flex items-center h-[56px] ${idx !== rows.length - 1 ? 'border-b border-[#e4e4e7]' : ''}`}
            >
              <div className="w-[60px] shrink-0 px-4 flex items-center">
                <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.rank}</span>
              </div>
              <div className="flex-1 min-w-0 px-4 flex items-center">
                <span className="text-[14px] leading-5 font-normal text-[#18181b] truncate">{row.combination}</span>
              </div>
              <div className="w-[140px] shrink-0 px-4 flex flex-col">
                <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.usage}</span>
                <span className="text-[12px] leading-[18px] font-normal text-[#71717a]">sessions</span>
              </div>
              <div className="w-[140px] shrink-0 px-4 flex items-center">
                <span className="inline-flex items-center justify-center px-2 h-[22px] rounded-full border border-[#e4e4e7] bg-[#f8fafc] text-[12px] leading-[18px] font-medium text-[#18181b]">
                  {row.effectiveness}
                </span>
              </div>
              <div className="w-[120px] shrink-0 px-4 flex items-center gap-1">
                <Star className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
                <span className="text-[14px] leading-5 font-normal text-[#18181b]">{row.satisfaction}</span>
              </div>
              <div className="w-[80px] shrink-0 px-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
