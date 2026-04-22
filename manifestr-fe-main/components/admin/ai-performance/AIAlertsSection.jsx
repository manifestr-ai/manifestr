import { TrendingUp, Gauge } from 'lucide-react'

const SEVERITY_STYLES = {
  critical: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]',
  high: 'bg-[#fff7ed] border-[#fb923c] text-[#9a3412]',
  warning: 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]',
  info: 'bg-[#f0f9ff] border-[#7dd3fc] text-[#075985]',
}

function AlertItem({ alert }) {
  const severityClass = SEVERITY_STYLES[alert.severity?.toLowerCase()] || SEVERITY_STYLES.info

  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-[#f4f4f5] last:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-[13px] leading-5 font-semibold text-[#18181b]">{alert.title}</p>
          {alert.model && (
            <p className="text-[11px] leading-4 text-[#71717a] font-medium">{alert.model}</p>
          )}
        </div>
        <span
          className={`px-1.5 py-0.5 rounded-full border text-[11px] leading-4 font-medium whitespace-nowrap ${severityClass}`}
        >
          {alert.severity}
        </span>
      </div>
      <p className="text-[12px] leading-[18px] text-[#71717a]">{alert.description}</p>
      <div className="flex items-center gap-3 flex-wrap">
        {alert.metric && (
          <span className="text-[12px] leading-[18px] font-semibold text-[#18181b]">{alert.metric}</span>
        )}
        <span className="text-[11px] leading-4 text-[#a1a1aa]">{alert.time}</span>
      </div>
    </div>
  )
}

function AlertPanel({ icon: Icon, iconColor, headerBg, headerBorder, headerText, badgeBg, title, alerts }) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl overflow-hidden flex flex-col">
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${headerBorder} ${headerBg}`}>
        <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} strokeWidth={1.75} />
        <p className={`text-[14px] leading-5 font-semibold ${headerText}`}>{title}</p>
        <span className={`ml-auto px-1.5 py-0.5 rounded-full border text-[11px] leading-4 font-medium ${badgeBg}`}>
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

export default function AIAlertsSection({ data }) {
  const title = data?.title || 'Alerts'
  const failureAlerts = data?.failureSpikes || []
  const latencyAlerts = data?.latencyIssues || []

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
      <div className="flex flex-col lg:flex-row gap-[18px]">
        <AlertPanel
          icon={TrendingUp}
          iconColor="text-[#71717a]"
          headerBg="bg-[#f4f4f5]"
          headerBorder="border-[#e4e4e7]"
          headerText="text-[#18181b]"
          badgeBg="bg-white border-[#e4e4e7] text-[#52525b]"
          title="Failure Spikes"
          alerts={failureAlerts}
        />
        <AlertPanel
          icon={Gauge}
          iconColor="text-[#71717a]"
          headerBg="bg-[#f4f4f5]"
          headerBorder="border-[#e4e4e7]"
          headerText="text-[#18181b]"
          badgeBg="bg-white border-[#e4e4e7] text-[#52525b]"
          title="Latency Issues"
          alerts={latencyAlerts}
        />
      </div>
    </div>
  )
}
