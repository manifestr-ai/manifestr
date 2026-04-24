import { useMemo, useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const DEFAULT_FILTERS = {
  Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
  Cohort: ['All cohorts', 'New users', 'Returning', 'Power users'],
  Persona: ['All personas', 'Freelancer', 'Agency', 'Enterprise'],
  Device: ['All devices', 'Desktop', 'Mobile', 'Tablet'],
}

function FilterDropdown({ label, options, value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const displayLabel = value || label

  // Close dropdown if becoming disabled while open
  useEffect(() => {
    if (disabled && open) setOpen(false)
  }, [disabled, open])

  return (
    <div
      className={`relative min-w-0 w-full lg:w-auto ${open ? 'z-[200]' : 'z-40'}`}
      ref={ref}
    >
      <button
        type="button"
        onClick={() => { if (!disabled) setOpen(!open) }}
        disabled={disabled}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-[#e4e4e7] bg-white px-4 py-2 text-left text-[14px] font-medium leading-5 text-[#18181b] transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f4f4f5]'
        } lg:inline-flex lg:w-auto`}
      >
        <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#18181b] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>

      {open && !disabled && (
        <div
          className="absolute left-0 right-0 top-full z-[300] mt-1 max-h-[min(280px,50vh)] overflow-y-auto rounded-[6px] border border-[#e4e4e7] bg-white py-1 shadow-lg lg:left-auto lg:right-0 lg:min-w-[180px] lg:w-max lg:max-w-[min(320px,90vw)]"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-[14px] leading-5 transition-colors whitespace-nowrap ${
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

  const filterEntries = Object.entries(normalizedFilters)

  return (
    <div className="relative flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      {/* Search — matches Feature Adoption / AiPerformanceFilters: 400px, h-10, rounded-[6px] */}
      <div className="w-full shrink-0 lg:w-[400px] lg:max-w-[400px]">
        <div className="flex h-10 items-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white px-3">
          <Search className="h-5 w-5 shrink-0 text-[#71717a]" strokeWidth={1.75} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => {
              const v = e.target.value
              setSearchValue(v)
              onFiltersChange?.({ search: v, filters: selectedFilters })
            }}
            className="min-w-0 flex-1 bg-transparent text-[16px] font-normal leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
          />
        </div>
      </div>

      {/* Dropdowns — mobile: 2×2 grid; desktop: row, auto width (Feature Adoption / AiPerformanceFilters) */}
      <div className="grid w-full min-w-0 grid-cols-2 gap-2 lg:flex lg:w-auto lg:flex-nowrap lg:items-center lg:gap-2">
        {filterEntries.map(([label, options]) => (
          <FilterDropdown
            key={label}
            label={label}
            options={options}
            value={selectedFilters[label]}
            onChange={(value) => updateFilter(label, value)}
            disabled={
              label.toLowerCase() === "cohort" ||
              label.toLowerCase() === "persona" ||
              label.toLowerCase() === "device"
            }
          />
        ))}
      </div>

    </div>
  )
}
