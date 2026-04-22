import { Info } from 'lucide-react'

export default function LifecycleStagesChart({ data }) {
  const title = data?.title || 'Lifecycle Stages'
  const subtitle = data?.subtitle || ''
  const stages = data?.stages || []
  const total = data?.total || stages.reduce((sum, s) => sum + (s.value || 0), 0) || 1

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 lg:p-[18px] lg:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7 wrap-break-word">
              {title}
            </p>
            <Info className="w-4 h-4 text-[#71717a] shrink-0" strokeWidth={1.75} />
          </div>
          {subtitle && (
            <p className="text-[14px] leading-5 font-normal text-[#71717a]">{subtitle}</p>
          )}
        </div>
        <p className="text-[14px] leading-5 font-medium text-[#18181b] shrink-0">
          {total.toLocaleString()} users
        </p>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full border border-[#e4e4e7]">
        {stages.map((s) => (
          <div
            key={s.key || s.label}
            style={{
              width: `${s.share}%`,
              backgroundColor: s.color,
            }}
            title={`${s.label}: ${s.share}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 min-w-0 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
        {stages.map((s) => (
          <div
            key={s.key || s.label}
            className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-[8px] p-3 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[12px] leading-[18px] font-medium text-[#52525b] uppercase tracking-wide truncate">
                {s.label}
              </span>
            </div>
            <p className="text-[20px] leading-7 font-semibold text-[#18181b] font-sans whitespace-nowrap">
              {s.value?.toLocaleString?.() ?? s.value}
            </p>
            <p className="text-[12px] leading-[18px] font-normal text-[#71717a]">{s.share}% of total</p>
          </div>
        ))}
      </div>
    </div>
  )
}
