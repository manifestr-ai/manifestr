import { useMemo, useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const DEFAULT_FILTERS = {
  Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
  Cohort: ['All cohorts', 'New users', 'Returning', 'Power users'],
  Persona: ['All personas', 'Freelancer', 'Agency', 'Enterprise'],
  Device: ['All devices', 'Desktop', 'Mobile', 'Tablet'],
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-10 px-4 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
      >
        {value || label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-[14px] leading-5 transition-colors ${
                value === opt
                  ? 'bg-[#f4f4f5] text-[#18181b] font-medium'
                  : 'text-[#52525b] hover:bg-[#f4f4f5]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OverviewFilters({
  filters = DEFAULT_FILTERS,
  searchPlaceholder = 'Search files, content, and tags...',
  onFiltersChange,
}) {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({})
  const normalizedFilters = useMemo(
    () => (filters && Object.keys(filters).length ? filters : DEFAULT_FILTERS),
    [filters]
  )

  const updateFilter = (label, value) => {
    const next = { ...selectedFilters, [label]: value }
    setSelectedFilters(next)
    onFiltersChange?.({ search: searchValue, filters: next })
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="w-[400px]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[#e4e4e7] bg-white">
          <Search className="w-5 h-5 shrink-0 text-[#71717a]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => {
              const value = e.target.value
              setSearchValue(value)
              onFiltersChange?.({ search: value, filters: selectedFilters })
            }}
            className="flex-1 min-w-0 bg-transparent outline-none text-[16px] leading-6 font-normal text-[#18181b] placeholder:text-[#71717a]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {Object.entries(normalizedFilters).map(([label, options]) => (
          <FilterDropdown
            key={label}
            label={label}
            options={options}
            value={selectedFilters[label]}
            onChange={(value) => updateFilter(label, value)}
          />
        ))}
      </div>
    </div>
  )
}
