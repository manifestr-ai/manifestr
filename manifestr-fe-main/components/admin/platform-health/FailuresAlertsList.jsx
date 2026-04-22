import { ChevronRight, Info } from 'lucide-react'

const SEVERITY_STYLES = {
  Critical: { bg: '#fef2f2', border: '#fee2e2', text: '#991b1b' },
  High: { bg: '#fff7ed', border: '#ffedd5', text: '#9a3412' },
  Medium: { bg: '#fffbeb', border: '#fef3c7', text: '#92400e' },
  Low: { bg: '#f4f4f5', border: '#e4e4e7', text: '#52525b' },
}

const STATUS_STYLES = {
  Active: { dot: '#dc2626', text: '#991b1b' },
  Investigating: { dot: '#d97706', text: '#92400e' },
  Resolved: { dot: '#16a34a', text: '#166534' },
}

function SeverityBadge({ severity }) {
  const styles = SEVERITY_STYLES[severity] || SEVERITY_STYLES.Low
  return (
    <span
      className="px-2 py-0.5 rounded-full border text-[12px] leading-[18px] font-medium"
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border,
        color: styles.text,
      }}
    >
      {severity}
    </span>
  )
}

function StatusPill({ status }) {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.Resolved
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] leading-[18px] font-medium" style={{ color: styles.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: styles.dot }} />
      {status}
    </span>
  )
}

export default function FailuresAlertsList({ data }) {
  const title = data?.title || 'Failures & Alerts'
  const subtitle = data?.subtitle || ''
  const alerts = data?.alerts || []

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-4 sm:p-[18px] flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
            <Info className="w-4 h-4 text-[#71717a] shrink-0" strokeWidth={1.75} />
          </div>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          className="w-full sm:w-auto h-9 px-3 py-2 rounded-[6px] border border-[#e4e4e7] bg-white text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors shrink-0"
        >
          View all
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-[#f4f4f5] rounded-[6px] px-4 py-8 text-center">
          <p className="text-[14px] leading-5 font-medium text-[#52525b]">No alerts to display.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#f4f4f5] rounded-[6px] px-4 py-3 flex items-start justify-between gap-4"
            >
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-[12px] leading-[18px] font-medium text-[#52525b]">
                    {alert.service}
                  </span>
                  <span className="text-[12px] leading-[18px] font-normal text-[#a1a1aa]">•</span>
                  <span className="text-[12px] leading-[18px] font-normal text-[#71717a]">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-[14px] leading-5 font-medium text-[#18181b] truncate">
                  {alert.title}
                </p>
                {alert.description && (
                  <p className="text-[14px] leading-5 font-normal text-[#52525b]">
                    {alert.description}
                  </p>
                )}
                <div className="pt-0.5">
                  <StatusPill status={alert.status} />
                </div>
              </div>
              <button
                type="button"
                aria-label="View details"
                className="h-8 w-8 rounded-[6px] border border-[#e4e4e7] bg-white flex items-center justify-center hover:bg-white/70 transition-colors shrink-0"
              >
                <ChevronRight className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
