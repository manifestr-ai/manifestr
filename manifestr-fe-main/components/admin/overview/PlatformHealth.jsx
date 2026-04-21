const METRICS = [
  { label: 'Uptime:', value: '99.98%' },
  { label: 'Latency (p95):', value: '220ms' },
  { label: 'Error rate:', value: '0.4%' },
  { label: 'CSAT:', value: '4.2 / 5' },
]

export default function PlatformHealth({ data }) {
  const score = data?.score ?? 87
  const title = data?.title || 'Platform Health'
  const status = data?.status || 'Good'
  const metrics = data?.metrics || METRICS
  const circumference = 2 * Math.PI * 60
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>

      {/* Donut */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-[140px] h-[140px]">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            <circle cx="70" cy="70" r="60" fill="none" stroke="#e4e4e7" strokeWidth="10" />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#18181b"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] leading-9 font-semibold text-[#18181b]">87%</span>
            <span className="text-[14px] leading-5 text-[#71717a]">{status}</span>
          </div>
        </div>
      </div>

      {/* Metrics table */}
      <div className="flex flex-col gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <span className="text-[14px] leading-5 text-[#71717a]">{m.label}</span>
            <span className="text-[14px] leading-5 font-semibold text-[#18181b]">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
