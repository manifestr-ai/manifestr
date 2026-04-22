import { TrendingUp, TrendingDown } from 'lucide-react'

function TrendBadge({ trend }) {
  if (!trend) return null
  const isUp = trend.startsWith('+')
  return (
    <div
      className={`flex items-center gap-1 text-[12px] leading-[18px] font-semibold px-2 py-0.5 rounded-full ${
        isUp ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'
      }`}
    >
      {isUp ? (
        <TrendingUp className="w-3 h-3" strokeWidth={2} />
      ) : (
        <TrendingDown className="w-3 h-3" strokeWidth={2} />
      )}
      {trend}
    </div>
  )
}

export default function PaywallEvents({ data }) {
  if (!data) return null

  const title = data.title || 'Paywall Interaction Events'
  const subtitle = data.subtitle || ''
  const events = data.events || []

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl border border-[#e4e4e7] bg-white p-4 sm:gap-6 sm:p-[18px]">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
          </div>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[#f4f4f5]">
        {events.map((ev, idx) => (
          <div
            key={ev.id}
            className={`flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
              idx === 0 ? 'pt-0' : ''
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: ev.color }}
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-medium leading-5 text-[#18181b]">{ev.label}</span>
                <span className="truncate text-[12px] font-normal leading-[18px] text-[#71717a]">{ev.description}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
              {ev.rate && (
                <span className="tabular-nums text-[13px] font-normal leading-5 text-[#71717a]">{ev.rate}</span>
              )}
              <span className="w-[52px] text-right text-[15px] font-bold leading-5 tabular-nums text-[#18181b]">
                {ev.count}
              </span>
              <TrendBadge trend={ev.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
