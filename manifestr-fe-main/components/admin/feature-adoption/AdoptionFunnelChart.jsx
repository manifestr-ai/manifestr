import { Info } from 'lucide-react'

export default function AdoptionFunnelChart({ data }) {
  const title = data?.title || 'Feature Usage Funnel'
  const subheading = data?.subheading || 'Discovered → First Use → Repeat → Habitual'
  const rows = data?.rows || []

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 h-full lg:p-[18px] lg:gap-6">
      <div className="flex items-center gap-2 min-w-0">
        <p className="flex-1 min-w-0 text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7 wrap-break-word">
          {title}
        </p>
        <Info className="w-4 h-4 text-[#71717a] shrink-0" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-3 min-w-0">
        <p className="text-[14px] leading-5 font-medium text-[#18181b]">{subheading}</p>

        <div className="flex flex-col gap-2 w-full min-w-0">
          {rows.map((row, idx) => {
            const pct = Math.max(0, Math.min(100, row.percent ?? 0))
            return (
              <div
                key={`${row.label}-${idx}`}
                className="bg-white border border-[#e4e4e7] rounded-[6px] h-[52px] flex items-center justify-between px-3 min-w-0 max-w-full sm:px-4"
                style={{ width: `${pct}%` }}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] leading-5 font-medium text-[#18181b] truncate">
                    {row.label}
                  </span>
                  <span className="text-[14px] leading-5 font-normal text-[#71717a] truncate">
                    {row.sublabel}
                  </span>
                </div>
                <span className="text-[14px] leading-5 font-normal text-[#18181b] shrink-0 ml-4">
                  {row.display ?? `${row.percent}%`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
