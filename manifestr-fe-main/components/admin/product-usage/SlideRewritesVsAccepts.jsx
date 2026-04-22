import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const DEFAULT_Y = ['100%', '80%', '60%', '40%', '20%', '0%']
const DEFAULT_CATEGORIES = [
  { label: 'Title', accepted: 35, edited: 25 },
  { label: 'Content', accepted: 78, edited: 15 },
  { label: 'Content', accepted: 62, edited: 25 },
  { label: 'Quote', edited: 50, accepted: 48 },
]
const DEFAULT_LEGEND = [
  { label: 'Accepted As-Is', color: '#18181b' },
  { label: 'Further Edited', color: '#cbd5e1' },
]

export default function SlideRewritesVsAccepts({ data }) {
  const title = data?.title || 'Rewrites vs Accepts'
  const yLabels = data?.yLabels || DEFAULT_Y
  const categories = data?.categories || DEFAULT_CATEGORIES
  const maxValue = data?.max || 100
  const legend = data?.legend || DEFAULT_LEGEND
  const filterOptions = data?.filterOptions || ['Both', 'Accepted', 'Edited']
  const defaultFilter = data?.selectedFilter || filterOptions[0]

  const BAR_H = 223
  const [hoverIdx, setHoverIdx] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false)
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isDropdownOpen])

  const showAccepted = selectedFilter === 'Both' || selectedFilter === 'Accepted'
  const showEdited = selectedFilter === 'Both' || selectedFilter === 'Edited'

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6 h-[320px]">
      <div className="flex items-center justify-between">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">{title}</p>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b]"
          >
            {selectedFilter}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.75}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-sm py-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(opt)
                    setIsDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-[14px] leading-5 ${
                    selectedFilter === opt
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
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-col justify-between shrink-0 pr-2 pb-[26px]" style={{ width: 40 }}>
            {yLabels.map((l) => (
              <span key={l} className="text-[12px] leading-[18px] font-medium text-[#40444e] tracking-[0.06px]">
                {l}
              </span>
            ))}
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1 flex items-end justify-between gap-6 relative px-6" style={{ height: BAR_H }}>
              {categories.map((c, i) => {
                const isHover = hoverIdx === i
                const acceptedH = (c.accepted / maxValue) * 100
                const editedH = (c.edited / maxValue) * 100
                const totalH = (showAccepted ? acceptedH : 0) + (showEdited ? editedH : 0)
                return (
                  <div
                    key={`${c.label}-${i}`}
                    className="flex-1 min-w-0 relative flex items-end justify-center"
                    style={{ height: '100%' }}
                    onMouseEnter={() => setHoverIdx(i)}
                    onMouseLeave={() => setHoverIdx(null)}
                  >
                    <div
                      className="w-[24px] flex flex-col justify-end overflow-hidden rounded-t-sm"
                      style={{ height: `${Math.min(totalH, 100)}%` }}
                    >
                      {showEdited && (
                        <div
                          className="w-full transition-colors"
                          style={{
                            height: `${(editedH / (showAccepted ? acceptedH + editedH : editedH)) * 100}%`,
                            backgroundColor: isHover ? '#94a3b8' : '#cbd5e1',
                          }}
                        />
                      )}
                      {showAccepted && (
                        <div
                          className="w-full transition-colors"
                          style={{
                            height: `${(acceptedH / (showEdited ? acceptedH + editedH : acceptedH)) * 100}%`,
                            backgroundColor: isHover ? '#09090b' : '#18181b',
                          }}
                        />
                      )}
                    </div>

                    {isHover && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                        <div className="bg-[#18181b] text-white text-[12px] font-medium leading-[18px] px-2 py-1 rounded-[6px] whitespace-nowrap shadow-lg flex flex-col gap-0.5">
                          <span className="font-semibold">{c.label}</span>
                          {showAccepted && <span>Accepted: {c.accepted}%</span>}
                          {showEdited && <span>Edited: {c.edited}%</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between mt-2 px-6">
              {categories.map((c, i) => (
                <span
                  key={`${c.label}-${i}`}
                  className={`text-[12px] leading-[18px] font-medium tracking-[0.06px] text-center flex-1 ${
                    hoverIdx === i ? 'text-[#18181b] font-semibold' : 'text-[#40444e]'
                  }`}
                >
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[12px] leading-[18px] font-normal text-[#52525b]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
