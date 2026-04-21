import { useState } from 'react'
import { Bell, ChevronRight, Filter } from 'lucide-react'

const SEVERITY_LEVELS = ['All', 'Critical', 'High', 'Medium', 'Low']

const SEVERITY_STYLES = {
  critical: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', dot: '#dc2626' },
  high: { bg: '#fff7ed', border: '#fb923c', text: '#9a3412', dot: '#ea580c' },
  medium: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', dot: '#d97706' },
  low: { bg: '#f4f4f5', border: '#e4e4e7', text: '#52525b', dot: '#a1a1aa' },
}

const STATUS_STYLES = {
  active: { dot: '#dc2626', text: '#991b1b', label: 'Active' },
  investigating: { dot: '#d97706', text: '#92400e', label: 'Investigating' },
  resolved: { dot: '#16a34a', text: '#166534', label: 'Resolved' },
  acknowledged: { dot: '#8696b0', text: '#52525b', label: 'Acknowledged' },
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]" />
    </span>
  )
}

function AlertCard({ alert }) {
  const sev = SEVERITY_STYLES[alert.severity?.toLowerCase()] || SEVERITY_STYLES.low
  const sta = STATUS_STYLES[alert.status?.toLowerCase()] || STATUS_STYLES.acknowledged

  return (
    <div className="bg-[#fafafa] border border-[#f0f0f0] rounded-[8px] px-4 py-3 flex items-start gap-3">
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-1.5 py-0.5 rounded-full border text-[11px] leading-4 font-medium"
            style={{ backgroundColor: sev.bg, borderColor: sev.border, color: sev.text }}
          >
            {alert.severity}
          </span>
          {alert.service && (
            <span className="px-1.5 py-0.5 bg-[#f4f4f5] rounded text-[11px] leading-4 font-medium text-[#52525b]">
              {alert.service}
            </span>
          )}
          <span className="text-[11px] leading-4 text-[#a1a1aa] ml-auto">{alert.timestamp}</span>
        </div>

        <p className="text-[13px] leading-5 font-semibold text-[#18181b]">{alert.title}</p>

        {alert.description && (
          <p className="text-[12px] leading-[18px] text-[#71717a]">{alert.description}</p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 text-[12px] leading-[18px] font-medium"
            style={{ color: sta.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sta.dot }} />
            {sta.label}
          </span>
          {alert.metric && (
            <span className="text-[12px] leading-[18px] font-semibold text-[#18181b]">{alert.metric}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label="View details"
        className="h-8 w-8 rounded-[6px] border border-[#e4e4e7] bg-white flex items-center justify-center hover:bg-[#f4f4f5] transition-colors shrink-0"
      >
        <ChevronRight className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
      </button>
    </div>
  )
}

export default function RealtimeSystemAlerts({ data }) {
  const [activeSeverity, setActiveSeverity] = useState('All')

  const title = data?.title || 'Real-Time System Alerts'
  const alerts = data?.alerts || []
  const liveCount = alerts.filter((a) => a.status?.toLowerCase() === 'active').length

  const filtered =
    activeSeverity === 'All'
      ? alerts
      : alerts.filter((a) => a.severity?.toLowerCase() === activeSeverity.toLowerCase())

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#18181b]" strokeWidth={1.75} />
          <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
          {liveCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fef2f2] border border-[#fecaca] text-[11px] leading-4 font-semibold text-[#991b1b]">
              <LiveDot />
              {liveCount} live
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#71717a] shrink-0" strokeWidth={1.75} />
          {SEVERITY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setActiveSeverity(level)}
              className={`h-7 px-2.5 rounded-full border text-[12px] leading-[18px] font-medium transition-colors ${
                activeSeverity === level
                  ? 'bg-[#18181b] border-[#18181b] text-white'
                  : 'bg-white border-[#e4e4e7] text-[#52525b] hover:bg-[#f4f4f5]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#f4f4f5] rounded-[6px] py-8 text-center">
          <p className="text-[14px] leading-5 font-medium text-[#52525b]">
            {activeSeverity === 'All' ? 'No active alerts' : `No ${activeSeverity} alerts`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  )
}
