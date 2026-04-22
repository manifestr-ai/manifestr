import { AlertTriangle, TrendingDown, UserMinus } from 'lucide-react'

const CATEGORY_CONFIG = {
  system: {
    label: 'System Issues',
    Icon: AlertTriangle,
    headerBg: 'bg-[#f4f4f5]',
    headerBorder: 'border-[#e4e4e7]',
    headerText: 'text-[#18181b]',
    iconColor: 'text-[#71717a]',
    badgeBg: 'bg-white border-[#e4e4e7] text-[#52525b]',
  },
  revenue: {
    label: 'Revenue Drops',
    Icon: TrendingDown,
    headerBg: 'bg-[#f4f4f5]',
    headerBorder: 'border-[#e4e4e7]',
    headerText: 'text-[#18181b]',
    iconColor: 'text-[#71717a]',
    badgeBg: 'bg-white border-[#e4e4e7] text-[#52525b]',
  },
  churn: {
    label: 'Churn Spikes',
    Icon: UserMinus,
    headerBg: 'bg-[#f8fafc]',
    headerBorder: 'border-[#cbd5e1]',
    headerText: 'text-[#334155]',
    iconColor: 'text-[#64748b]',
    badgeBg: 'bg-[#f1f5f9] border-[#94a3b8] text-[#475569]',
  },
}

const SEVERITY_STYLES = {
  critical: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]',
  warning: 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]',
  info: 'bg-[#f0f9ff] border-[#7dd3fc] text-[#075985]',
}

function AlertItem({ alert }) {
  const severityClass = SEVERITY_STYLES[alert?.severity] || SEVERITY_STYLES.info

  return (
    <div className="flex flex-col gap-1 py-3 border-b border-[#f4f4f5] last:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] leading-5 font-semibold text-[#18181b]">{alert?.title}</p>
        <span
          className={`px-1.5 py-0.5 rounded-full border text-[11px] leading-4 font-medium whitespace-nowrap ${severityClass}`}
        >
          {alert?.severity}
        </span>
      </div>
      <p className="text-[12px] leading-[18px] text-[#71717a]">{alert?.description}</p>
      <p className="text-[11px] leading-4 text-[#a1a1aa]">{alert?.time}</p>
    </div>
  )
}

function AlertColumn({ category, alerts }) {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.system
  const CategoryIcon = cfg.Icon

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl overflow-hidden flex flex-col">
      <div
        className={`flex items-center gap-2 px-4 py-3 border-b ${cfg.headerBorder} ${cfg.headerBg}`}
      >
        <CategoryIcon className={`w-4 h-4 shrink-0 ${cfg.iconColor}`} strokeWidth={1.75} />
        <p className={`text-[14px] leading-5 font-semibold ${cfg.headerText}`}>{cfg.label}</p>
        <span className="ml-auto text-[12px] leading-[18px] font-medium text-[#71717a]">
          {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="px-4 flex flex-col">
        {alerts.length === 0 ? (
          <p className="text-[13px] leading-5 text-[#a1a1aa] py-4 text-center">No active alerts</p>
        ) : (
          alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
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
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">
        {data?.title || 'Alerts'}
      </p>
      <div className="flex flex-col md:flex-row gap-[18px]">
        <AlertColumn category="system" alerts={systemAlerts} />
        <AlertColumn category="revenue" alerts={revenueAlerts} />
        <AlertColumn category="churn" alerts={churnAlerts} />
      </div>
    </div>
  )
}
