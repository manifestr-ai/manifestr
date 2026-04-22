import { Download } from 'lucide-react'

export default function ProductUsageHeader({
  title = 'Product Usage & Engagement',
  subtitle = 'Understand how customers use the product.',
}) {
  return (
    <div className="flex flex-col gap-6 px-8 pt-8 pb-16 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[30px] leading-[38px] font-bold text-[#18181b]">{title}</h1>
          <p className="text-[16px] leading-6 font-normal text-[#71717a]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-10 px-4 py-2 rounded-[6px] border border-[#e4e4e7] bg-white text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Share
          </button>
          <button
            type="button"
            className="h-10 px-4 py-2 rounded-[6px] bg-[#18181b] flex items-center gap-2 text-[14px] leading-5 font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" strokeWidth={1.75} />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
