import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const CUSTOMERS = [
  { account: 'Acme Corp',     plan: 'Enterprise', mrr: '$42,500', growth: '+18%' },
  { account: 'BrightLabs',    plan: 'Pro',        mrr: '$17,200', growth: '+6%'  },
  { account: 'Nova Health',   plan: 'Enterprise', mrr: '$35,000', growth: '+12%' },
  { account: 'Horizon Media', plan: 'Starter',    mrr: '$14,600', growth: '–3%'  },
  { account: 'Orion Tech',    plan: 'Starter',    mrr: '$28,900', growth: '+22%' },
]

export default function TopCustomersTable({ data }) {
  const title = data?.title || 'Top 10 Customers by Revenue'
  const customers = data?.customers || CUSTOMERS
  const filterOptions = data?.filterOptions || ['last 7d', 'last 30d', 'last 90d', 'all time']
  const defaultFilter = data?.selectedFilter || filterOptions[1] || filterOptions[0]
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState(defaultFilter)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isDropdownOpen])

  return (
    <div className="flex-[2] min-w-0 bg-white border border-[#e4e4e7] rounded-xl p-[18px] flex flex-col gap-6">

      {/* Card header */}
      <div className="flex items-center justify-between">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">
          {title}
        </p>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            {selectedRange}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[6px] shadow-sm py-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedRange(opt)
                    setIsDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-[14px] leading-5 ${
                    selectedRange === opt ? 'bg-[#f4f4f5] text-[#18181b] font-medium' : 'text-[#52525b] hover:bg-[#f4f4f5]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table — column-based layout matching Figma */}
      <div className="w-full overflow-x-auto">
        <div className="flex w-full">

          {/* Account column */}
          <div className="flex-1 min-w-[85px] flex flex-col overflow-hidden">
            <div className="h-12 flex items-center px-4 border-b border-[#e4e4e7]">
              <span className="text-[14px] leading-5 font-medium text-[#71717a]">Account</span>
            </div>
            {customers.map((c) => (
              <div key={c.account} className="h-[52px] flex items-center px-4 border-b border-[#e4e4e7]">
                <span className="text-[14px] leading-5 font-medium text-[#18181b] truncate">{c.account}</span>
              </div>
            ))}
          </div>

          {/* Plan column */}
          <div className="flex-1 min-w-[85px] flex flex-col overflow-hidden">
            <div className="h-12 flex items-center px-4 border-b border-[#e4e4e7]">
              <span className="text-[14px] leading-5 font-medium text-[#71717a]">Plan</span>
            </div>
            {customers.map((c) => (
              <div key={c.account} className="h-[52px] flex items-center px-4 border-b border-[#e4e4e7]">
                <span className="text-[14px] leading-5 font-normal text-[#18181b] truncate">{c.plan}</span>
              </div>
            ))}
          </div>

          {/* MRR column */}
          <div className="flex-1 min-w-[85px] flex flex-col overflow-hidden">
            <div className="h-12 flex items-center px-4 border-b border-[#e4e4e7]">
              <span className="text-[14px] leading-5 font-medium text-[#71717a]">MRR</span>
            </div>
            {customers.map((c) => (
              <div key={c.account} className="h-[52px] flex items-center px-4 border-b border-[#e4e4e7]">
                <span className="text-[14px] leading-5 font-normal text-[#18181b] truncate">{c.mrr}</span>
              </div>
            ))}
          </div>

          {/* 90d Growth % column */}
          <div className="flex-1 min-w-[85px] flex flex-col overflow-hidden">
            <div className="h-12 flex items-center px-4 border-b border-[#e4e4e7]">
              <span className="text-[14px] leading-5 font-medium text-[#71717a]">90d Growth %</span>
            </div>
            {customers.map((c) => (
              <div key={c.account} className="h-[52px] flex items-center px-4 border-b border-[#e4e4e7]">
                <span className="inline-flex items-center px-3 py-1.5 rounded-2xl border border-[#e4e4e7] bg-[#f4f4f5]/80 text-[12px] leading-[18px] font-medium text-[#71717a]">
                  {c.growth}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
