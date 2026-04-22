import { Search } from 'lucide-react'
import MonetizationFilterButton from '../monetization/MonetizationFilterButton'

export default function AiPerformanceFilters({
  searchPlaceholder = 'Search files, content, and tags...',
  options = {},
}) {
  const filterNames = ['Timeframe', 'Cohort', 'Persona', 'Device']

  return (
    <div className="relative z-30 flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      <div className="w-full shrink-0 lg:w-[400px] lg:max-w-[400px]">
        <div className="flex h-10 items-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white px-3">
          <Search className="h-5 w-5 shrink-0 text-[#71717a]" strokeWidth={1.75} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[16px] font-normal leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
          />
        </div>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-2 lg:flex lg:w-auto lg:flex-nowrap lg:items-center lg:gap-2">
        {filterNames.map((name) => (
          <div key={name} className="min-w-0 w-full lg:w-auto">
            <MonetizationFilterButton
              label={name}
              options={options[name] || []}
              stretch
            />
          </div>
        ))}
      </div>
    </div>
  )
}
