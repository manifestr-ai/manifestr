import { Info } from 'lucide-react'

const DEFAULT_ROWS = [
  { account: 'Acme', users: '10,000 users', value: '61%' },
  { account: 'Zenith', users: '10,000 users', value: '35.0%' },
  { account: 'BrightTech', users: '10,000 users', value: '25.0%' },
  { account: 'Orion Global', users: '10,000 users', value: '79.8%' },
  { account: 'Horizon Inc', users: '10,000 users', value: '79.8%' },
]

export default function RevenueConcentrationCard({ data }) {
  const title = data?.title || 'Revenue Concentration % (KPI)'
  const subtitle = data?.subtitle || '61% of total revenue comes from top 3 accounts'
  const rows = data?.rows || DEFAULT_ROWS

  return (
    <div className="w-full lg:flex-1 min-w-0 bg-[#f4f4f4] border border-[#e9eaea] rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] p-4 lg:p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-[18px] leading-7 font-semibold text-[#18181b]">{title}</p>
        <Info className="w-4 h-4 text-[#71717a] shrink-0" strokeWidth={1.75} />
      </div>

      <p className="text-[14px] leading-5 font-medium text-[#18181b]">{subtitle}</p>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.account}
            className="bg-white border border-[#e4e4e7] rounded-[8px] p-4 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.account}</p>
              <p className="text-[14px] leading-5 font-normal text-[#71717a] truncate">{row.users}</p>
            </div>
            <p className="text-[14px] leading-5 font-normal text-[#18181b] shrink-0">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
