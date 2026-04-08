import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gem, AlertCircle, Settings, ChevronDown, GemIcon } from 'lucide-react'

export default function WinsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [autoTopUp, setAutoTopUp] = useState(false)
  const [industry, setIndustry] = useState('')
  const [monthlyMaxSpend, setMonthlyMaxSpend] = useState('')
  const [notifications, setNotifications] = useState({
    lowBalance: false,
    autoTopUp: false,
    monthlySummary: false,
  })
  const [isIndustryOpen, setIsIndustryOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const dropdownRef = useRef(null)
  const currencyRef = useRef(null)
  const currentBalance = 272 // This could come from props or context

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  ]

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsIndustryOpen(false)
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const isLowBalance = currentBalance < 300

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-transparent flex items-center gap-2 px-1 py-1 rounded-md transition-colors cursor-pointer"
      >
          <GemIcon className="w-4 h-4 text-[#52525B]" />
        <span className="text-[14px] font-medium leading-[20px] text-[#18181b]">{currentBalance}</span>
      </motion.button>

      {/* Wins Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-[calc(100%+12px)] w-[400px] bg-[#F9FAFB] rounded-xl shadow-lg border border-[#e4e4e7] z-50 overflow-hidden"
            >
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                  Your Wins Balance
                </h2>
              </div>

              {/* Current Balance Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="px-6 pt-6 pb-4"
              >
                <div className="bg-white border border-[#e4e4e7] rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[48px] font-castoro-titling font-normal leading-[56px] text-[#18181b] mb-1">
                        {currentBalance}
                      </div>
                      <p className="text-[14px] leading-[20px] text-[#71717a]">
                        Current Balance
                      </p>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center">
                      <Gem className="w-16 h-16 text-[#e4e4e7]" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Warning Banner */}
              <AnimatePresence>
                {isLowBalance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                  <div className="bg-[#18181b] rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <p className="text-[14px] leading-[20px] text-white">
                      You're running low on Wins! Top up now to keep creating.
                    </p>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Explanation */}
              <div className="px-6 pb-6">
                <p className="text-[14px] leading-[20px] text-[#52525b]">
                  Wins power your entire MANIFESTR experience - from generating content to exporting your creations.
                </p>
              </div>

              {/* Top Up Wins Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="px-6 pb-6"
              >
                <h3 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-4">
                  Top Up Wins
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Quick Win Pack", wins: 25, price: "$4.99" },
                    { name: "Big Win Pack", wins: 50, price: "$4.99" },
                    { name: "Major Win Pack", wins: 100, price: "$8.99" },
                  ].map((pack, index) => (
                    <motion.div
                      key={pack.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    >
                      <WinPack
                        name={pack.name}
                        wins={pack.wins}
                        price={pack.price}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Zero Balance Information */}
              <div className="px-6 pb-6">
                <p className="text-[14px] leading-[20px] text-[#52525b]">
                  When your balance reaches 0, you'll need to purchase more Wins to continue using MANIFESTR features.
                </p>
              </div>

              {/* Manage Your Wins Section */}
              <div className="px-6 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-[#18181b]" />
                  <h3 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    Manage Your Wins
                  </h3>
                </div>
                <div className={`p-4 bg-white rounded-xl border border-[#e4e4e7] ${!autoTopUp ? 'pb-4' : ''}`}>
                  <div className={`flex items-center justify-between ${autoTopUp ? 'mb-4' : ''}`}>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-medium leading-[20px] text-[#18181b] mb-1">
                        Auto Top-up
                      </h4>
                      <p className="text-[12px] leading-[16px] text-[#71717a]">
                        Enable auto top-up when balance &lt; 10 Wins
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoTopUp(!autoTopUp)}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ml-4 ${
                        autoTopUp ? 'bg-[#18181b]' : 'bg-[#d4d4d8]'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          autoTopUp ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Additional fields when auto top-up is enabled */}
                  <AnimatePresence>
                    {autoTopUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 border-t border-[#e4e4e7] space-y-3"
                      >
                      {/* Industry Selection */}
                      <div>
                        <label className="block text-[12px] font-medium leading-[16px] text-[#18181b] mb-1.5">
                          Industry Selection
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#e4e4e7] rounded-lg text-left hover:border-[#18181b] transition-colors cursor-pointer"
                          >
                            <span className={`text-[12px] leading-[16px] ${industry ? 'text-[#18181b]' : 'text-[#71717a]'}`}>
                              {industry || 'Select your industry'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${isIndustryOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isIndustryOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-[#e4e4e7] rounded-lg shadow-lg overflow-hidden">
                              {['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Other'].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => {
                                    setIndustry(item)
                                    setIsIndustryOpen(false)
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-[#f4f4f5] transition-colors cursor-pointer text-[12px] leading-[16px] text-[#18181b]"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Monthly Max Spend */}
                      <div>
                        <label className="block text-[12px] font-medium leading-[16px] text-[#18181b] mb-1.5">
                          Monthly Max Spend
                        </label>
                        <div className="flex items-center">
                          <div className="relative" ref={currencyRef}>
                            <button
                              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                              className="flex items-center gap-1 px-2.5 py-2 bg-white border border-[#e4e4e7] rounded-l-lg hover:border-[#18181b] transition-colors cursor-pointer"
                            >
                              <span className="text-[12px] leading-[16px] text-[#18181b] font-medium">
                                {currencies.find(c => c.code === selectedCurrency)?.symbol || '$'}
                              </span>
                              <ChevronDown className={`w-3 h-3 text-[#71717a] transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isCurrencyOpen && (
                              <div className="absolute z-20 bottom-full left-0 mb-1 w-[180px] bg-white border border-[#e4e4e7] rounded-lg shadow-lg overflow-hidden">
                                {currencies.map((currency) => (
                                  <button
                                    key={currency.code}
                                    onClick={() => {
                                      setSelectedCurrency(currency.code)
                                      setIsCurrencyOpen(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-[#f4f4f5] transition-colors cursor-pointer text-[12px] leading-[16px] ${
                                      selectedCurrency === currency.code ? 'bg-[#f4f4f5] font-medium text-[#18181b]' : 'text-[#18181b]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{currency.symbol}</span>
                                      <span>{currency.code}</span>
                                      <span className="text-[#71717a] ml-auto">{currency.name}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Enter the amount"
                            value={monthlyMaxSpend}
                            onChange={(e) => setMonthlyMaxSpend(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-[#e4e4e7] rounded-r-lg focus:outline-none focus:border-[#18181b] transition-colors text-[12px] leading-[16px] text-[#18181b] placeholder:text-[#71717a]"
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] leading-[14px] text-[#71717a]">
                          Set a safe cap to avoid overspending
                        </p>
                      </div>

                      {/* Notifications */}
                      <div>
                        <label className="block text-[12px] font-medium leading-[16px] text-[#18181b] mb-2">
                          Notifications
                        </label>
                        <div className="space-y-2">
                          <CheckboxOption
                            label="Notify me when balance < 5 Wins"
                            checked={notifications.lowBalance}
                            onChange={(checked) => setNotifications({ ...notifications, lowBalance: checked })}
                          />
                          <CheckboxOption
                            label="Notify me when auto top-up occurs"
                            checked={notifications.autoTopUp}
                            onChange={(checked) => setNotifications({ ...notifications, autoTopUp: checked })}
                          />
                          <CheckboxOption
                            label="Monthly usage summary"
                            checked={notifications.monthlySummary}
                            onChange={(checked) => setNotifications({ ...notifications, monthlySummary: checked })}
                          />
                        </div>
                      </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 pb-6 border-t border-[#e4e4e7] pt-6 flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-white border border-[#e4e4e7] text-[#18181b] font-medium text-[14px] leading-[20px] py-3 px-4 rounded-lg hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle save settings
                    setIsOpen(false)
                  }}
                  className="flex-1 bg-[#18181b] text-white font-medium text-[14px] leading-[20px] py-3 px-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Checkbox Option Component
function CheckboxOption({ label, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-[#e4e4e7] rounded-lg hover:border-[#18181b] transition-colors cursor-pointer text-left"
    >
      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-[#18181b] border-[#18181b]' : 'bg-white border-[#e4e4e7]'
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-[12px] leading-[16px] text-[#18181b]">{label}</span>
    </button>
  )
}

// Win Pack Component
function WinPack({ name, wins, price }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-[#e4e4e7] rounded-xl p-4 flex items-center justify-between hover:border-[#18181b] transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <Gem className="w-10 h-10 text-[#e4e4e7]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[14px] font-medium leading-[20px] text-[#18181b] mb-0.5">
            {name}
          </p>
          <p className="text-[12px] leading-[16px] text-[#71717a]">
            {wins} wins
          </p>
        </div>
      </div>
      <div className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
        {price}
      </div>
    </motion.div>
  )
}

