import { AlertTriangle, TrendingDown, UserMinus } from 'lucide-react'

const CATEGORY_CONFIG = {
  system: {
    label: 'System Issues',
    Icon: AlertTriangle,
  },
  revenue: {
    label: 'Revenue Drops',
    Icon: TrendingDown,
  },
  churn: {
    label: 'Churn Spikes',
    Icon: UserMinus,
  },
}

const SEVERITY_STYLES = {
  critical: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]',
  warning: 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]',
  info: 'bg-[#f0f9ff] border-[#7dd3fc] text-[#075985]',
}

function AlertItem({ alert, isLast }) {
  const severityClass = SEVERITY_STYLES[alert?.severity] || SEVERITY_STYLES.info

  return (
    <div
      className={`flex flex-col gap-1.5 ${!isLast ? 'border-b border-[#f4f4f5] pb-4' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-[13px] leading-5 font-semibold text-[#18181b]">
          {alert?.title}
        </p>
        <span
          className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap ${severityClass}`}
        >
          {alert?.severity}
        </span>
      </div>
      <p className="text-[12px] leading-[18px] text-[#71717a]">{alert?.description}</p>
      <p className="pt-0.5 text-[11px] leading-4 text-[#a1a1aa]">{alert?.time}</p>
    </div>
  )
}

function AlertColumn({ category, alerts }) {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.system
  const CategoryIcon = cfg.Icon
  const n = alerts?.length ?? 0

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-[#e9eaea] bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2 border-b border-[#e4e4e7] bg-white px-4 py-3">
        <CategoryIcon className="h-4 w-4 shrink-0 text-[#71717a]" strokeWidth={1.75} />
        <p className="min-w-0 text-[14px] font-semibold leading-5 text-[#18181b]">
          {cfg.label}
        </p>
        <span className="ml-auto shrink-0 text-[12px] font-medium leading-[18px] text-[#71717a]">
          {n} alert{n !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-col px-4 py-4">
        {n === 0 ? (
          <p className="py-2 text-center text-[13px] leading-5 text-[#a1a1aa]">No active alerts</p>
        ) : (
          alerts.map((alert, i) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              isLast={i === alerts.length - 1}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function AlertsFeed({ data }) {
  const systemAlerts = data?.system || []
  const revenueAlerts = data?.revenue || []
  const churnAlerts = data?.churn || []

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[18px] font-medium leading-7 text-[#18181b]">
        {data?.title || 'Alerts'}
      </p>
      <div className="flex flex-col gap-[18px] md:flex-row">
        <AlertColumn category="system" alerts={systemAlerts} />
        <AlertColumn category="revenue" alerts={revenueAlerts} />
        <AlertColumn category="churn" alerts={churnAlerts} />
      </div>
    </div>
  )
}
