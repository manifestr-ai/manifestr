import { ListOrdered, FileOutput } from 'lucide-react'

const STATUS_STYLES = {
  healthy: { bg: '#f0fdf4', border: '#dcfce7', text: '#166534', dot: '#16a34a', bar: '#16a34a' },
  warning: { bg: '#fffbeb', border: '#fef3c7', text: '#92400e', dot: '#d97706', bar: '#d97706' },
  critical: { bg: '#fef2f2', border: '#fee2e2', text: '#991b1b', dot: '#dc2626', bar: '#dc2626' },
}

function MonitorCard({ icon: Icon, title, value, unit, status, statusLabel, subRows, period }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.healthy

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-4 sm:p-[18px] flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-[6px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] leading-5 font-medium text-[#52525b]">{title}</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] leading-4 font-medium shrink-0"
          style={{ backgroundColor: s.bg, borderColor: s.border, color: s.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[30px] leading-[38px] font-bold text-[#18181b] font-sans">{value}</span>
          {unit && <span className="text-[14px] leading-5 font-medium text-[#71717a]">{unit}</span>}
        </div>
        {period && (
          <p className="text-[12px] leading-[18px] font-normal text-[#a1a1aa]">{period}</p>
        )}
      </div>

      {subRows && subRows.length > 0 && (
        <div className="flex flex-col gap-3 pt-1 border-t border-[#f4f4f5]">
          {subRows.map((row) => {
            const rowStatus = STATUS_STYLES[row.status] || STATUS_STYLES.healthy
            const pct = row.max > 0 ? Math.min((row.value / row.max) * 100, 100) : 0
            return (
              <div key={row.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] leading-[18px] font-medium text-[#52525b]">{row.label}</span>
                  <span className="text-[12px] leading-[18px] font-semibold text-[#18181b]">
                    {row.value}{row.unit || ''}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: rowStatus.bar }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function QueueAndExportsMonitor({ data }) {
  const queue = data?.queue
  const exports = data?.exports

  if (!queue && !exports) return null

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-[18px] lg:flex-nowrap">
      {queue && (
        <MonitorCard
          icon={ListOrdered}
          title={queue.title || 'Queue Delays'}
          value={queue.value}
          unit={queue.unit}
          status={queue.status}
          statusLabel={queue.statusLabel}
          period={queue.period}
          subRows={queue.subRows}
        />
      )}
      {exports && (
        <MonitorCard
          icon={FileOutput}
          title={exports.title || 'Export Processing Time'}
          value={exports.value}
          unit={exports.unit}
          status={exports.status}
          statusLabel={exports.statusLabel}
          period={exports.period}
          subRows={exports.subRows}
        />
      )}
    </div>
  )
}
