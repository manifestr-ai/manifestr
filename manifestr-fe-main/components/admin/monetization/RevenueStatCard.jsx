import { ArrowDownUp, BarChart3, CircleDollarSign, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'

export default function RevenueStatCard({ data }) {
  const title = data?.title || 'Total Revenue'
  const value = data?.value || '$0'
  const change = data?.change || ''
  const period = data?.period || 'vs last month'
  const key = title.toLowerCase()

  const Icon = key.includes('total revenue')
    ? CircleDollarSign
    : key === 'mrr'
      ? DollarSign
      : key === 'arr'
        ? BarChart3
        : key.includes('free')
          ? ArrowDownUp
          : key.includes('upgrade')
            ? TrendingUp
            : key.includes('downgrade')
              ? TrendingDown
              : CircleDollarSign

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl border border-[#e4e4e7] bg-white p-4 sm:gap-6 sm:p-[18px]">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#e4e4e7] bg-[#f4f4f5]">
          <Icon className="h-4 w-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <p className="min-w-0 flex-1 text-[16px] font-medium leading-6 text-[#18181b] sm:text-[18px] sm:leading-7">
          {title}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <p className="wrap-break-word font-sans text-[26px] font-bold leading-[34px] text-[#18181b] sm:text-[30px] sm:leading-[38px]">
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
