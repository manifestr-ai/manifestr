import { Search } from 'lucide-react'
import MonetizationFilterButton from '../monetization/MonetizationFilterButton'

export default function AiPerformanceFilters({
  searchPlaceholder = 'Search files, content, and tags...',
  options = {},
}) {
  const filterNames = ['Timeframe', 'Cohort', 'Persona', 'Device']

  return (
    <div className="relative z-30 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 w-[400px] max-w-full h-10">
        <Search className="w-5 h-5 text-[#71717a]" strokeWidth={1.75} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="flex-1 bg-transparent outline-none text-[16px] leading-6 font-normal text-[#18181b] placeholder:text-[#71717a]"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {filterNames.map((name) => (
          <MonetizationFilterButton key={name} label={name} options={options[name] || []} />
        ))}
      </div>
    </div>
  )
}
