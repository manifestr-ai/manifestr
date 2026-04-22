import { Download } from 'lucide-react'

export default function PlatformHealthHeader({
  title = 'Platform Health',
  subtitle = 'Monitor API performance, errors, and system alerts in real time.',
}) {
  return (
    <div className="flex flex-col gap-4 overflow-hidden px-4 pb-4 pt-6 lg:gap-6 lg:px-8 lg:pb-6 lg:pt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-[26px] leading-[34px] font-bold text-[#18181b] font-sans lg:text-[30px] lg:leading-[38px]">
            {title}
          </h1>
          <p className="text-[15px] leading-6 font-normal text-[#71717a] lg:text-[16px]">{subtitle}</p>
        </div>
        <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center shrink-0">
          <button
            type="button"
            className="w-full lg:w-auto h-10 px-4 py-2 rounded-[6px] border border-[#e4e4e7] bg-white text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            Create Alert
          </button>
          <button
            type="button"
            className="w-full lg:w-auto h-10 px-4 py-2 rounded-[6px] bg-[#18181b] flex items-center justify-center gap-2 text-[14px] leading-5 font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" strokeWidth={1.75} />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
