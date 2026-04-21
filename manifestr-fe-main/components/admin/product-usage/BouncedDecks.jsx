import { BarChart3 } from 'lucide-react'

export default function BouncedDecks({ data }) {
  const title = data?.title || 'Bounced Decks'
  const value = data?.value || '18%'
  const valueLabel = data?.valueLabel || 'bounce rate'
  const change = data?.change || '+8%'
  const period = data?.period || 'vs last 30d'
  const description = data?.description || 'Total started vs completed decks.'
  const breakdown = data?.breakdown || '(450 started, 370 exported)'

  return (
    <div className="w-[355.33px] shrink-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-[6px] bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0">
          <BarChart3 className="w-4 h-4 text-[#18181b]" strokeWidth={1.75} />
        </div>
        <p className="text-[18px] leading-7 font-medium text-[#18181b] whitespace-nowrap">{title}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <p className="text-[30px] leading-[38px] font-semibold text-[#18181b] font-sans whitespace-nowrap">
            {value}
          </p>
          <p className="text-[14px] leading-5 font-normal text-[#52525b] whitespace-nowrap pb-1">
            {valueLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-1.5 text-[12px] leading-[18px] font-medium rounded-full border bg-[#f8fafc] border-black text-[#09090b]">
            {change}
          </span>
          <span className="text-[14px] leading-5 font-normal text-[#52525b]">{period}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-1">
        <p className="text-[14px] leading-5 font-normal text-[#52525b]">{description}</p>
        <p className="text-[12px] leading-[18px] font-medium text-[#09090b]">{breakdown}</p>
      </div>
    </div>
  )
}
