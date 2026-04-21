import { AlertTriangle } from 'lucide-react'

const STATUS_STYLES = {
  new: 'border-[#fed7aa] bg-[#fff7ed] text-[#9a3412]',
  inProgress: 'border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]',
  resolved: 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]',
}

function statusKey(raw) {
  if (!raw) return 'new'
  const normalized = String(raw).toLowerCase().replace(/\s+/g, '')
  if (normalized === 'inprogress') return 'inProgress'
  if (normalized === 'resolved') return 'resolved'
  return 'new'
}

function AlertCard({ alert }) {
  const key = statusKey(alert?.status)
  const statusClass = STATUS_STYLES[key] || STATUS_STYLES.new

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-3 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <AlertTriangle
          className="w-4 h-4 text-[#71717a] mt-0.5 shrink-0"
          strokeWidth={1.75}
        />
        <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
          <p className="text-[14px] leading-5 font-semibold text-[#18181b] truncate">
            {alert?.title}
          </p>
          <span
            className={`px-2 py-0.5 rounded-full border text-[11px] leading-[16px] font-medium whitespace-nowrap ${statusClass}`}
          >
            {alert?.status}
          </span>
        </div>
      </div>

      <p className="text-[13px] leading-5 text-[#52525b]">{alert?.description}</p>

      <div className="flex items-center justify-between pt-1 border-t border-[#f4f4f5]">
        <p className="text-[12px] leading-[18px] text-[#52525b]">
          Score:{' '}
          <span className="font-semibold text-[#18181b]">{alert?.score}</span>
        </p>
        <p className="text-[12px] leading-[18px] text-[#71717a]">{alert?.time}</p>
      </div>
    </div>
  )
}

export default function AiFrustrationAlerts({ data }) {
  const title = data?.title || 'AI Frustration Alerts'
  const alerts = data?.alerts || []

  return (
    <div className="w-full lg:w-[320px] shrink-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  )
}
