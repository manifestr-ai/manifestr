import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const DEFAULT_ROWS = [
  { rank: 1, flow: 'Title → Content', value: '1,240', percent: '38.1% of users' },
  { rank: 2, flow: 'Content → Chart', value: '960', percent: '38.1% of users' },
  { rank: 3, flow: 'Chart → Export', value: '810', percent: '34.5% of users' },
  { rank: 4, flow: 'Content → Quote', value: '810', percent: '34.5% of users' },
]

function FlowTable({ rows }) {
  return (
    <div className="flex-1 min-w-0 border border-[#e4e4e7] rounded-[6px] overflow-hidden">
      {rows.map((row, idx) => (
        <div
          key={`${row.rank}-${idx}`}
          className={`flex items-center h-[72px] ${idx !== rows.length - 1 ? 'border-b border-[#e4e4e7]' : ''}`}
        >
          <div className="w-[50px] shrink-0 px-4 flex items-center">
            <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.rank}</span>
          </div>
          <div className="flex-1 min-w-0 px-4 flex items-center">
            <span className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{row.flow}</span>
          </div>
          <div className="w-[143px] shrink-0 px-4 flex flex-col items-end">
            <span className="text-[14px] leading-5 font-medium text-[#18181b]">{row.value}</span>
            <span className="text-[14px] leading-5 font-normal text-[#71717a]">{row.percent}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RewritesVsAcceptsFlows({ data }) {
  const title = data?.title || 'Rewrites vs Accepts'
  const rows = data?.rows || DEFAULT_ROWS
  const filterOptions = data?.filterOptions || ['Both', 'Accepted', 'Edited']
  const defaultFilter = data?.selectedFilter || filterOptions[0]

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

  const leftRows = rows.filter((_, i) => i % 2 === 0)
  const rightRows = rows.filter((_, i) => i % 2 === 1)

  return (
    <div className="w-full min-w-0 bg-[#f4f4f4] border border-[#e4e4e7] rounded-[12px] p-[14px] flex flex-col gap-4 h-full lg:p-[18px] lg:gap-6">
      <div className="flex flex-col gap-2 min-w-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-[16px] leading-6 font-medium text-[#18181b] lg:text-[18px] lg:leading-7">{title}</p>
        <div className="relative shrink-0 self-start sm:self-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 px-3 py-2 rounded-[8px] border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b]"
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

      <div className="flex flex-col gap-4 items-stretch lg:flex-row lg:gap-4">
        <FlowTable rows={leftRows} />
        <FlowTable rows={rightRows} />
      </div>
    </div>
  )
}
