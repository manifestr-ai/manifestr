import { Info } from 'lucide-react'

export default function RegenerationsList({ data }) {
  const title = data?.title || 'Regenerations'
  const subtitle = data?.subtitle || ''
  const rows = data?.rows || []

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 h-[408px]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
          <Info className="w-4 h-4 text-[#71717a]" strokeWidth={1.75} />
        </div>
        {subtitle && (
          <p className="text-[14px] leading-5 font-medium text-[#18181b]">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="bg-[#f4f4f5] rounded-[6px] h-[52px] px-4 flex items-center justify-between gap-4"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.label}</p>
              <p className="text-[14px] leading-5 font-normal text-[#71717a] truncate">
                {row.caption}
              </p>
            </div>
            <p className="text-[14px] leading-5 font-normal text-[#18181b] shrink-0">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
