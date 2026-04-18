import { ChevronRight } from 'lucide-react'

function DriftAlertCard({ alert }) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-3 flex flex-col gap-4">
      <div className="flex flex-col gap-1 pb-2 border-b border-[#e4e4e7]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12px] leading-[18px] font-semibold text-[#18181b]">{alert.model}</p>
          <span className="px-2 py-0.5 rounded-full border border-[#e4e4e7] bg-[#f4f4f5]/80 text-[12px] leading-[18px] font-medium text-[#71717a]">
            {alert.severity}
          </span>
        </div>
        <p className="text-[10px] leading-[18px] font-normal text-[#52525b]">{alert.timestamp}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[12px] leading-[18px] font-medium text-[#18181b]">{alert.metricLabel}</p>
        <p className="text-[16px] leading-6 font-semibold text-[#18181b]">{alert.metricValue}</p>
        <p className="text-[12px] leading-[18px] font-normal text-[#52525b]">{alert.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[14px] leading-5 font-medium text-[#18181b]">Affected Tools:</p>
        <div className="flex items-center gap-2 flex-wrap">
          {alert.affectedTools.map((tool) => (
            <span
              key={tool}
              className="px-2 py-[3px] rounded-[6px] border border-[#e4e4e7] bg-white text-[12px] leading-[18px] font-medium text-[#464649] text-center"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[12px] leading-[18px] font-normal text-[#52525b]">{alert.samples}</p>

      <button
        type="button"
        className="h-9 px-3 py-2 rounded-[6px] bg-[#18181b] flex items-center justify-center gap-2 text-[14px] leading-5 font-medium text-white hover:opacity-90 transition-opacity"
      >
        View Samples
        <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}

export default function DriftAlertsGrid({ data }) {
  const title = data?.title || 'Drift Alerts'
  const alerts = data?.alerts || []

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-4">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <DriftAlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  )
}
