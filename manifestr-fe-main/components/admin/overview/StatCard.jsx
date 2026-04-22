import { BarChart3 } from 'lucide-react'

export default function StatCard({ title, value, change, period = 'vs last 30d', neutralBadge = false }) {
  const isNegative = !neutralBadge && change?.startsWith('-')

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-[6px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0">
          <BarChart3 className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <p className="text-[18px] leading-7 font-medium text-[#18181b] whitespace-nowrap">{title}</p>
      </div>

      {/* Value + Change */}
      <div className="flex flex-col gap-4">
        <p className="text-[30px] leading-[38px] font-semibold text-[#18181b] font-sans whitespace-nowrap">
          {value}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center px-1.5 text-[12px] leading-[18px] font-medium rounded-full border ${
              isNegative
                ? 'bg-[#fef2f2] border-[#ef4444] text-[#ef4444]'
                : 'bg-[#f8fafc] border-black text-[#09090b]'
            }`}
          >
            {change}
          </span>
          <span className="text-[14px] leading-5 font-normal text-[#52525b]">{period}</span>
        </div>
      </div>
    </div>
  )
}
