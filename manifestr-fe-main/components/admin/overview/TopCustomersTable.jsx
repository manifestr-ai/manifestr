import { useState, useRef, useEffect } from 'react'

const FIGMA_ICON_CHEVRON_DOWN = 'https://www.figma.com/api/mcp/asset/361e5595-ca2f-4a2b-b14e-00f49d7d2ae9'

const CUSTOMERS = [
  { account: 'Acme Corp', plan: 'Enterprise', mrr: '$42,500', growth: '+18%' },
  { account: 'BrightLabs', plan: 'Pro', mrr: '$17,200', growth: '+6%' },
  { account: 'Nova Health', plan: 'Enterprise', mrr: '$35,000', growth: '+12%' },
  { account: 'Horizon Media', plan: 'Starter', mrr: '$14,600', growth: '-3%' },
  { account: 'Orion Tech', plan: 'Starter', mrr: '$28,900', growth: '+22%' },
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
    <div className="w-full lg:flex-2 min-w-0 bg-[#f4f4f4] border border-[#e9eaea] rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] p-4 lg:p-5 flex flex-col gap-5">

      {/* Card header */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[18px] leading-7 font-medium text-[#18181b]">
          {title}
        </p>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-9 px-3 py-2 rounded-[8px] border border-[#e4e4e7] bg-white flex items-center gap-2 text-[14px] leading-5 font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            {selectedRange}
            <img
              src={FIGMA_ICON_CHEVRON_DOWN}
              alt=""
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] bg-white border border-[#e4e4e7] rounded-[8px] shadow-sm py-1">
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

      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[1.3fr_1.3fr_1.3fr_1.3fr] h-12 items-center border-b border-[#e4e4e7] px-4">
            <span className="text-[16px] leading-[22px] font-medium text-[#71717a]">Account</span>
            <span className="text-[16px] leading-[22px] font-medium text-[#71717a]">Plan</span>
            <span className="text-[16px] leading-[22px] font-medium text-[#71717a]">MRR</span>
            <span className="text-[16px] leading-[22px] font-medium text-[#71717a]">90d Growth %</span>
          </div>

          {customers.map((c) => (
            <div key={c.account} className="grid grid-cols-[1.3fr_1.3fr_1.3fr_1.3fr] h-[52px] items-center border-b border-[#e4e4e7] px-4">
              <span className="text-[16px] leading-6 font-medium text-[#18181b] truncate">{c.account}</span>
              <span className="text-[16px] leading-6 font-medium text-[#18181b] truncate">{c.plan}</span>
              <span className="text-[16px] leading-6 font-medium text-[#18181b] truncate">{c.mrr}</span>
              <span
                className={`inline-flex w-fit items-center px-3 py-1 rounded-2xl border text-[12px] leading-[18px] font-medium ${
                  c.growth.startsWith('-')
                    ? 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]'
                    : 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]'
                }`}
              >
                {c.growth}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
