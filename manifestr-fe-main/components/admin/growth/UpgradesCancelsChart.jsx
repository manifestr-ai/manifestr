import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const Y_LABELS = ['500', '400', '300', '200', '100', '0']
const UPGRADES = [40, 75, 47, 70, 10, 47, 40, 70, 47, 40, 70, 47]
const CANCELS = [55, 55, 18, 55, 32, 18, 55, 55, 18, 55, 55, 18]
const LEGEND = [
  { label: 'Upgrades', color: '#18181b' },
  { label: 'Cancels', color: '#a1a1aa' },
]

export default function UpgradesCancelsChart({ data }) {
  const title = data?.title || 'Upgrades vs Cancels'
  const months = data?.months || MONTHS
  const yLabels = data?.yLabels || Y_LABELS
  const upgrades = data?.upgrades || UPGRADES
  const cancels = data?.cancels || CANCELS
  const maxValue = data?.max || 500
  const legend = data?.legend || LEGEND
  const filterOptions = data?.filterOptions || ['last 7d', 'last 30d', 'last 90d']
  const defaultFilter = data?.selectedFilter || filterOptions[1] || filterOptions[0]

  const BAR_H = 190
  const [hoverIdx, setHoverIdx] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState(defaultFilter)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false)
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isDropdownOpen])

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b]"
          >
            {selectedRange}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-sm py-1">
              {filterOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => { setSelectedRange(opt); setIsDropdownOpen(false) }}
                  className={`block w-full text-left px-3 py-2 text-[14px] leading-5 ${selectedRange === opt ? 'bg-[#f4f4f5] text-[#18181b] font-medium' : 'text-[#52525b] hover:bg-[#f4f4f5]'}`}
                >{opt}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="flex">
          <div className="flex flex-col justify-between shrink-0 pr-2" style={{ height: BAR_H }}>
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">{l}</span>
            ))}
          </div>

          <div className="flex-1 min-w-0 flex items-end justify-between gap-1 relative" style={{ height: BAR_H }}>
            {months.map((_, i) => (
              <div key={i} className="flex-1 min-w-0 relative flex items-end justify-center gap-[2px]" style={{ height: '100%' }}
                onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                <div
                  className={`w-[12px] rounded-t-sm transition-colors ${hoverIdx === i ? 'bg-[#09090b]' : 'bg-[#a1a1aa]'}`}
                  style={{ height: `${(cancels[i] / maxValue) * 100}%` }}
                />
                <div
                  className={`w-[12px] rounded-t-sm transition-colors ${hoverIdx === i ? 'bg-[#09090b]' : 'bg-[#18181b]'}`}
                  style={{ height: `${(upgrades[i] / maxValue) * 100}%` }}
                />

                {hoverIdx === i && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                    <div className="bg-[#18181b] text-white text-[12px] font-medium leading-[18px] px-2 py-1 rounded-[6px] whitespace-nowrap shadow-lg">
                      {months[i]}: ↑{upgrades[i]} ↓{cancels[i]}
                    </div>
                    <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#18181b]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pl-10 mt-1">
          {months.map((m, i) => (
            <span key={m} className={`text-[12px] leading-[18px] font-medium tracking-[0.06px] ${hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'}`}>{m}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[12px] leading-[15px] font-medium text-[#52525b]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
