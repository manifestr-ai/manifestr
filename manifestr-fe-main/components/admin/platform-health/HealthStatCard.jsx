import { Activity, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const STATUS_STYLES = {
  healthy: {
    dot: '#16a34a',
    badgeBg: '#f0fdf4',
    badgeBorder: '#dcfce7',
    badgeText: '#166534',
    Icon: CheckCircle2,
  },
  warning: {
    dot: '#d97706',
    badgeBg: '#fffbeb',
    badgeBorder: '#fef3c7',
    badgeText: '#92400e',
    Icon: AlertTriangle,
  },
  critical: {
    dot: '#dc2626',
    badgeBg: '#fef2f2',
    badgeBorder: '#fee2e2',
    badgeText: '#991b1b',
    Icon: AlertTriangle,
  },
}

export default function HealthStatCard({ data }) {
  const title = data?.title || 'Metric'
  const value = data?.value || '—'
  const change = data?.change || ''
  const period = data?.period || 'vs last 24h'
  const status = data?.status || 'healthy'
  const statusLabel = data?.statusLabel || 'Healthy'

  const styles = STATUS_STYLES[status] || STATUS_STYLES.healthy
  const StatusIcon = styles.Icon

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-[6px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <p className="flex-1 text-[18px] leading-7 font-medium text-[#18181b] whitespace-nowrap">
          {title}
        </p>
        <Info className="w-4 h-4 text-[#71717a] shrink-0" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[30px] leading-[38px] font-bold text-[#18181b] font-sans whitespace-nowrap">
            {value}
          </p>
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[12px] leading-[18px] font-medium"
            style={{
              backgroundColor: styles.badgeBg,
              borderColor: styles.badgeBorder,
              color: styles.badgeText,
            }}
          >
            <StatusIcon className="w-3 h-3" strokeWidth={2} />
            {statusLabel}
          </span>
        </div>
        <p className="text-[14px] leading-5 font-normal text-[#52525b]">
          {change && <span className="font-medium text-[#18181b]">{change}</span>}
          {change && ' '}
          {period}
        </p>
      </div>
    </div>
  )
}
