import { CheckCircle, GitBranch, RefreshCw, Timer } from 'lucide-react'

const CARD_ICONS = {
  acceptance: CheckCircle,
  editAccept: GitBranch,
  regenerations: RefreshCw,
  latency: Timer,
}

function MetricCard({ icon, title, value, change, period = 'vs last 30d', highlight = false }) {
  const Icon = CARD_ICONS[icon] || CheckCircle
  const isNegative = change?.startsWith('-')

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-[6px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <p className="text-[14px] leading-5 font-medium text-[#52525b]">{title}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className={`text-[30px] leading-[38px] font-semibold text-[#18181b] font-sans ${highlight ? 'text-[#18181b]' : ''}`}>
          {value}
        </p>
        {change && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center px-1.5 text-[12px] leading-[18px] font-medium rounded-full border ${
                isNegative
                  ? 'bg-[#fef2f2] border-[#ef4444] text-[#ef4444]'
                  : 'bg-[#f8fafc] border-black text-[#09090b]'
              }`}
            >
              {change}
            </span>
            <span className="text-[14px] leading-5 font-normal text-[#52525b]">{period}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OutputMetricsCards({ data }) {
  const cards = data?.cards || []

  if (!cards.length) return null

  return (
    <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-[18px] lg:items-stretch lg:flex-nowrap">
      {cards.map((card) => (
        <MetricCard key={card.id} {...card} />
      ))}
    </div>
  )
}
