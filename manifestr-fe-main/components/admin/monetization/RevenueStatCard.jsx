import { Circle, Info } from 'lucide-react'

export default function RevenueStatCard({ data }) {
  const title = data?.title || 'Total Revenue'
  const value = data?.value || '$0'
  const change = data?.change || ''
  const period = data?.period || 'vs last month'

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-[6px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0">
          <Circle className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <p className="flex-1 text-[18px] leading-7 font-medium text-[#18181b] whitespace-nowrap">
          {title}
        </p>
        <Info className="w-4 h-4 text-[#71717a] shrink-0" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-[30px] leading-[38px] font-bold text-[#18181b] font-sans whitespace-nowrap">
          {value}
        </p>
        <p className="text-[14px] leading-5 font-normal text-[#52525b]">
          {change && <span className="font-medium text-[#18181b]">{change}</span>}
          {change && ' '}
          {period}
        </p>
      </div>
    </div>
  )
}
