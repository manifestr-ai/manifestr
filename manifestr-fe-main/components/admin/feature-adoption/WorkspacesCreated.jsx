import { Info } from 'lucide-react'

const DEFAULT_ROWS = [
  { name: 'Zenith', users: '10,000 users', percent: 35.0 },
  { name: 'BrightTech', users: '10,000 users', percent: 25.0 },
  { name: 'Orion Global', users: '10,000 users', percent: 79.8 },
  { name: 'Horizon Inc', users: '10,000 users', percent: 79.8 },
]

export default function WorkspacesCreated({ data }) {
  const title = data?.title || 'Workspaces Created'
  const total = data?.total || '128 total workspaces'
  const rows = data?.rows || DEFAULT_ROWS

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[14px] flex flex-col gap-4 lg:p-[18px] lg:gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
          <Info className="w-4 h-4 text-[#71717a]" strokeWidth={1.75} />
        </div>
        <p className="text-[14px] leading-5 font-normal text-[#71717a]">{total}</p>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => {
          const pct = Math.max(0, Math.min(100, row.percent))
          return (
            <div
              key={`${row.name}-${row.users}`}
              className="relative h-[52px] rounded-[6px] border border-[#e4e4e7] overflow-hidden bg-white"
            >
              <div
                className="absolute inset-y-0 left-0 bg-[#e4e4e7]"
                style={{ width: `${pct}%` }}
              />
              <div className="relative h-full flex items-center justify-between px-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.name}</span>
                  <span className="text-[12px] leading-[18px] font-normal text-[#71717a] truncate">{row.users}</span>
                </div>
                <span className="text-[14px] leading-5 font-semibold text-[#18181b]">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
