import { Activity } from 'lucide-react'

const STATUS_STYLES = {
  healthy: { bg: '#f0fdf4', border: '#dcfce7', text: '#166534', dot: '#16a34a' },
  warning: { bg: '#fffbeb', border: '#fef3c7', text: '#92400e', dot: '#d97706' },
  critical: { bg: '#fef2f2', border: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
}

function PercentileBar({ label, value, maxValue, color }) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 text-[11px] leading-4 font-semibold text-[#71717a] shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-14 text-right text-[13px] leading-5 font-semibold text-[#18181b] shrink-0">
        {value}ms
      </span>
    </div>
  )
}

export default function APIPercentilesCard({ data }) {
  const title = data?.title || 'API Response Time'
  const status = data?.status || 'healthy'
  const statusLabel = data?.statusLabel || 'Healthy'
  const p50 = data?.p50 ?? 94
  const p95 = data?.p95 ?? 312
  const p99 = data?.p99 ?? 680
  const period = data?.period || 'Last 24h'

  const styles = STATUS_STYLES[status] || STATUS_STYLES.healthy
  const maxVal = Math.max(p50, p95, p99)

  const bars = [
    { label: 'p50', value: p50, color: '#18181b' },
    { label: 'p95', value: p95, color: '#8696b0' },
    { label: 'p99', value: p99, color: '#cbd5e1' },
  ]

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-[6px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] leading-5 font-medium text-[#52525b]">{title}</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] leading-4 font-medium shrink-0"
          style={{ backgroundColor: styles.bg, borderColor: styles.border, color: styles.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: styles.dot }} />
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {bars.map((bar) => (
          <PercentileBar key={bar.label} {...bar} maxValue={maxVal} />
        ))}
      </div>

      <p className="text-[12px] leading-[18px] font-normal text-[#a1a1aa]">{period}</p>
    </div>
  )
}
