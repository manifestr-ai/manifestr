const DEFAULT_ROWS = [
  { label: 'Free Users', sublabel: '10,000 users', percent: 100, display: '100%' },
  { label: 'Trial Started', sublabel: '10,000 users', percent: 35, display: '35.0%' },
  { label: 'Paid Conversion', sublabel: '10,000 users', percent: 25, display: '25.0%' },
  { label: 'Retained (30d)', sublabel: '10,000 users', percent: 79.8, display: '79.8%' },
]

export default function FunnelCard({ data }) {
  const title = data?.title || 'Free → Paid → Retained Funnel'
  const subheading = data?.subheading || 'Main Conversion Flow'
  const rows = data?.rows || DEFAULT_ROWS

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col gap-5 rounded-xl border border-[#e4e4e7] bg-white p-4 sm:gap-6 sm:p-[18px]">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[16px] font-semibold leading-6 text-[#18181b] sm:text-[18px] sm:leading-7">{title}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[14px] font-medium leading-5 text-[#18181b]">{subheading}</p>

        <div className="flex max-w-full flex-col gap-2 overflow-x-hidden">
          {rows.map((row, idx) => {
            const pct = Math.max(0, Math.min(100, row.percent ?? 0))
            return (
              <div
                key={`${row.label}-${idx}`}
                className="flex h-[52px] max-w-full items-center justify-between rounded-[6px] border border-[#e4e4e7] bg-white px-3 sm:px-4"
                style={{ width: `${pct}%`, minWidth: 'min(260px, 100%)' }}
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
