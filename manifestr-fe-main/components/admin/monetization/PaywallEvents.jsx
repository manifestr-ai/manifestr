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
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
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
            className={`flex items-center justify-between gap-4 py-3 ${idx === 0 ? 'pt-0' : ''}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: ev.color }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] leading-5 font-medium text-[#18181b] truncate">
                  {ev.label}
                </span>
                <span className="text-[12px] leading-[18px] font-normal text-[#71717a] truncate">
                  {ev.description}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {ev.rate && (
                <span className="text-[13px] leading-5 font-normal text-[#71717a] tabular-nums">
                  {ev.rate}
                </span>
              )}
              <span className="text-[15px] leading-5 font-bold text-[#18181b] tabular-nums w-[52px] text-right">
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
