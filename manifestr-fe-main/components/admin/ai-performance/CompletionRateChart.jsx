import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const DEFAULT_DATA = {
  title: 'Prompt Completion Rate',
  filterOptions: ['Last 7d', 'Last 30d', 'Last 90d'],
  selectedFilter: 'Last 30d',
  bars: [
    { label: 'Completed', value: 78, color: '#18181b' },
    { label: 'Partial', value: 14, color: '#8696b0' },
    { label: 'Abandoned', value: 8, color: '#e4e4e7' },
  ],
  total: 12480,
}

function FilterButton({ selected, setSelected, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div className="relative z-20" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
      >
        {selected}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.75} />
      </button>
      {open && options.length > 0 && (
        <div className="absolute right-0 top-full mt-1 z-30 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setSelected(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-[14px] leading-5 ${
                selected === opt ? 'bg-[#f4f4f5] text-[#18181b] font-medium' : 'text-[#52525b] hover:bg-[#f4f4f5]'
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

export default function CompletionRateChart({ data }) {
  const cfg = { ...DEFAULT_DATA, ...(data || {}) }
  const [selected, setSelected] = useState(cfg.selectedFilter || cfg.filterOptions[0])

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[18px] leading-7 font-medium text-[#18181b]">{cfg.title}</p>
          {cfg.total && (
            <p className="text-[13px] leading-5 font-normal text-[#71717a]">
              {cfg.total.toLocaleString()} total prompts
            </p>
          )}
        </div>
        <FilterButton selected={selected} setSelected={setSelected} options={cfg.filterOptions} />
      </div>

      <div className="flex flex-col gap-4">
        {cfg.bars.map((bar) => (
          <div key={bar.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] leading-5 font-medium text-[#52525b]">{bar.label}</span>
              <span className="text-[13px] leading-5 font-semibold text-[#18181b]">{bar.value}%</span>
            </div>
            <div className="h-2 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${bar.value}%`, backgroundColor: bar.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-[#f4f4f5]">
        {cfg.bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bar.color }} />
            <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
