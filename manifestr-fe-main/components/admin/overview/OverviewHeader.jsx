import { Download } from 'lucide-react'

export default function OverviewHeader({
  title = 'Executive Overview',
  subtitle = 'Company-wide performance metrics',
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4 overflow-hidden lg:px-8 lg:pt-8 lg:pb-6 lg:gap-6">
      {/* Mobile: stacked column — Desktop: title left / buttons right */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Title block */}
        <div className="flex flex-col gap-1.5 lg:gap-2">
          <h1 className="text-[26px] leading-[34px] font-bold text-[#18181b] lg:text-[30px] lg:leading-[38px]">
            {title}
          </h1>
          <p className="text-[15px] leading-6 font-normal text-[#71717a] lg:text-[16px]">
            {subtitle}
          </p>
        </div>

        {/* Actions
            Mobile: full-width stacked column (Export on top, Share below)
            Desktop: inline row, auto-width */}
        <div className="flex flex-col gap-2 w-full lg:flex-row lg:w-auto lg:items-center">
          <button
            type="button"
            className="w-full lg:w-auto h-10 px-4 py-2 rounded-[6px] bg-[#18181b] flex items-center justify-center gap-2 text-[14px] leading-5 font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" strokeWidth={1.75} />
            Export
          </button>
          <button
            type="button"
            className="w-full lg:w-auto h-10 px-4 py-2 rounded-[6px] border border-[#e4e4e7] bg-white text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
