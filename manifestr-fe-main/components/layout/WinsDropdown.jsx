import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, AlertCircle, Settings, ChevronDown, GemIcon } from "lucide-react";

export default function WinsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [industry, setIndustry] = useState("");
  const [monthlyMaxSpend, setMonthlyMaxSpend] = useState("");
  const [notifications, setNotifications] = useState({
    lowBalance: false,
    autoTopUp: false,
    monthlySummary: false,
  });
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const dropdownRef = useRef(null);
  const currencyRef = useRef(null);
  const currentBalance = 272; // This could come from props or context

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  ];

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsIndustryOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isLowBalance = currentBalance < 300;

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
              className="absolute right-0 top-[calc(100%+12px)] w-[400px] bg-[#ffffff] rounded-xl shadow-lg border border-[#e4e4e7] z-50 overflow-hidden"
            >
              <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-[#e4e4e7]">
                  <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="18"
                        viewBox="0 0 19 18"
                        fill="none"
                      >
                        <path
                          d="M17.5017 5.83594L14.1683 0.835938H4.16832L0.834991 5.83594M17.5017 5.83594L9.16832 16.6693M17.5017 5.83594H0.834991M9.16832 16.6693L0.834991 5.83594M9.16832 16.6693L5.83499 5.83594L8.33499 0.835938M9.16832 16.6693L12.5017 5.83594L10.0017 0.835938"
                          stroke="#18181B"
                          strokeWidth="1.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Your Wins Balance</span>
                    </span>
              
                  </h2>
                </div>

                {/* Current Balance Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="px-6 pt-6 pb-4"
                >
                  <div className="bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="mb-1"
                          style={{
                            color: "var(--base-foreground, #18181B)",
                            fontFamily: '"HK Grotesk", sans-serif',
                            fontSize: "48px",
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: "60px",
                            letterSpacing: "-0.96px",
                          }}
                        >
                          {currentBalance}
                        </div>
                   
                        <p
                          className="overflow-hidden text-ellipsis text-[12px] leading-[18px] font-normal font-inter"
                          style={{
                            color: "var(--base-foreground, #18181B)",
                            fontFamily: "Inter",
                            fontSize: "12px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "18px",
                          }}
                        >
                          Current Balance
                        </p>
                   
                      </div>
                      <div className="w-16 h-16 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="56"
                          height="56"
                          viewBox="0 0 56 56"
                          fill="none"
                          className="w-16 h-16"
                        >
                          <g opacity="0.6">
                            <path
                              d="M51.3333 21L42 7H14L4.66666 21M51.3333 21L28 51.3333M51.3333 21H4.66666M28 51.3333L4.66666 21M28 51.3333L18.6667 21L25.6667 7M28 51.3333L37.3333 21L30.3333 7"
                              stroke="#71717A"
                              strokeWidth="4.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Warning Banner */}
                <AnimatePresence>
                  {isLowBalance && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <div
                        className="flex items-start gap-3 p-4 border text-[#a16207] bg-[#FEFCE8] shadow-xs"
                        style={{
                          borderRadius: "var(--border-radius-default, 6px)",
                          borderColor: "var(--base-border, #E4E4E7)",
                          background: "var(--colors-yellow-50, #FEFCE8)",
                          boxShadow: "0 1px 2px 0 rgba(10, 13, 18, 0.05)",
                        }}
                      >
                        <AlertCircle className="w-5 h-5 text-[#CA8A04] shrink-0 mt-0.5" />
                        <p
                          className="text-[14px] leading-[20px] font-normal font-['Inter'] text-muted-foreground"
                          style={{
                            color: "var(--base-muted-foreground, #71717A)",
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "20px"
                          }}
                        >
                          You're running low on Wins! Top up now to keep creating.
                        </p>
                   
                      </div>
                 
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Explanation */}
                <div className="px-6 pb-6">
                  <p
                    className="text-[14px] leading-[20px] font-normal font-inter"
                    style={{
                      color: "var(--base-muted-foreground, #71717A)",
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px"
                    }}
                  >
                    Wins power your entire MANIFESTR experience - from
                    generating content to exporting your creations.
                  </p>
                </div>
           
           

                {/* Top Up Wins Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="px-6 pb-6 border-b border-t border-[#e4e4e7]"
                >
                  <h3
                    className="font-inter text-[12px] font-semibold leading-[18px] text-muted-foreground mb-4 mt-4"
                    style={{
                      color: "var(--base-muted-foreground, #71717A)",
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "18px",
                    }}
                  >
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
                <div className="px-6 pb-6 mt-4">
                  <p
                    style={{
                      color: "var(--base-muted-foreground, #71717A)",
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                    }}
                  >
                    When your balance reaches 0, you'll need to purchase more
                    Wins to continue using MANIFESTR features.
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
                  <div
                    className={`p-4 bg-white rounded-xl border border-[#e4e4e7] ${!autoTopUp ? "pb-4" : ""}`}
                  >
                    <div
                      className={`flex items-center justify-between ${autoTopUp ? "mb-4" : ""}`}
                    >
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
                          autoTopUp ? "bg-[#18181b]" : "bg-[#d4d4d8]"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            autoTopUp ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Additional fields when auto top-up is enabled */}
                    <AnimatePresence>
                      {autoTopUp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
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
                                onClick={() =>
                                  setIsIndustryOpen(!isIndustryOpen)
                                }
                                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#e4e4e7] rounded-lg text-left hover:border-[#18181b] transition-colors cursor-pointer"
                              >
                                <span
                                  className={`text-[12px] leading-[16px] ${industry ? "text-[#18181b]" : "text-[#71717a]"}`}
                                >
                                  {industry || "Select your industry"}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-[#71717a] transition-transform ${isIndustryOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                              {isIndustryOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-[#e4e4e7] rounded-lg shadow-lg overflow-hidden">
                                  {[
                                    "Technology",
                                    "Healthcare",
                                    "Finance",
                                    "Education",
                                    "Retail",
                                    "Other",
                                  ].map((item) => (
                                    <button
                                      key={item}
                                      onClick={() => {
                                        setIndustry(item);
                                        setIsIndustryOpen(false);
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
                                  onClick={() =>
                                    setIsCurrencyOpen(!isCurrencyOpen)
                                  }
                                  className="flex items-center gap-1 px-2.5 py-2 bg-white border border-[#e4e4e7] rounded-l-lg hover:border-[#18181b] transition-colors cursor-pointer"
                                >
                                  <span className="text-[12px] leading-[16px] text-[#18181b] font-medium">
                                    {currencies.find(
                                      (c) => c.code === selectedCurrency,
                                    )?.symbol || "$"}
                                  </span>
                                  <ChevronDown
                                    className={`w-3 h-3 text-[#71717a] transition-transform ${isCurrencyOpen ? "rotate-180" : ""}`}
                                  />
                                </button>
                                {isCurrencyOpen && (
                                  <div className="absolute z-20 bottom-full left-0 mb-1 w-[180px] bg-white border border-[#e4e4e7] rounded-lg shadow-lg overflow-hidden">
                                    {currencies.map((currency) => (
                                      <button
                                        key={currency.code}
                                        onClick={() => {
                                          setSelectedCurrency(currency.code);
                                          setIsCurrencyOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 hover:bg-[#f4f4f5] transition-colors cursor-pointer text-[12px] leading-[16px] ${
                                          selectedCurrency === currency.code
                                            ? "bg-[#f4f4f5] font-medium text-[#18181b]"
                                            : "text-[#18181b]"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {currency.symbol}
                                          </span>
                                          <span>{currency.code}</span>
                                          <span className="text-[#71717a] ml-auto">
                                            {currency.name}
                                          </span>
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
                                onChange={(e) =>
                                  setMonthlyMaxSpend(e.target.value)
                                }
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
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    lowBalance: checked,
                                  })
                                }
                              />
                              <CheckboxOption
                                label="Notify me when auto top-up occurs"
                                checked={notifications.autoTopUp}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    autoTopUp: checked,
                                  })
                                }
                              />
                              <CheckboxOption
                                label="Monthly usage summary"
                                checked={notifications.monthlySummary}
                                onChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    monthlySummary: checked,
                                  })
                                }
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
                      setIsOpen(false);
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
  );
}

// Checkbox Option Component
function CheckboxOption({ label, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-[#e4e4e7] rounded-lg hover:border-[#18181b] transition-colors cursor-pointer text-left"
    >
      <div
        className={`w-4 h-4 border-2 rounded flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? "bg-[#18181b] border-[#18181b]"
            : "bg-white border-[#e4e4e7]"
        }`}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className="text-[12px] leading-[16px] text-[#18181b]">{label}</span>
    </button>
  );
}

// Win Pack Component
function WinPack({ name, wins, price }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-[#e4e4e7] rounded-xl p-3 flex items-center justify-between hover:border-[#18181b] transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex justify-center items-center w-7 h-7 p-1.5 rounded-[var(--border-radius-default,6px)] border border-[#E4E4E7] bg-white"
          style={{
            borderRadius: "var(--border-radius-default, 6px)",
            borderColor: "var(--base-border, #E4E4E7)",
            background: "var(--base-background, #FFF)"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="w-6 h-6"
          >
            <g clipPath="url(#clip0_13597_18065)">
              <path
                d="M2 7.0013C1.90538 7.00162 1.81261 6.97509 1.73247 6.92479C1.65233 6.87449 1.58811 6.80248 1.54727 6.71713C1.50643 6.63178 1.49064 6.5366 1.50175 6.44263C1.51285 6.34867 1.55039 6.25978 1.61 6.1863L6.56 1.0863C6.59713 1.04344 6.64773 1.01448 6.70349 1.00417C6.75925 0.993857 6.81686 1.00281 6.86686 1.02955C6.91686 1.0563 6.95629 1.09925 6.97866 1.15136C7.00104 1.20346 7.00503 1.26163 6.99 1.3163L6.03 4.3263C6.00169 4.40206 5.99218 4.48356 6.00229 4.56381C6.0124 4.64405 6.04183 4.72064 6.08804 4.78702C6.13426 4.85339 6.19588 4.90756 6.26763 4.94488C6.33938 4.98221 6.41912 5.00157 6.5 5.0013H10C10.0946 5.00098 10.1874 5.02751 10.2675 5.07781C10.3477 5.12812 10.4119 5.20012 10.4527 5.28547C10.4936 5.37082 10.5093 5.46601 10.4982 5.55997C10.4871 5.65394 10.4496 5.74282 10.39 5.8163L5.44 10.9163C5.40287 10.9592 5.35227 10.9881 5.29651 10.9984C5.24074 11.0087 5.18313 10.9998 5.13313 10.9731C5.08313 10.9463 5.0437 10.9034 5.02133 10.8512C4.99895 10.7991 4.99496 10.741 5.01 10.6863L5.97 7.6763C5.9983 7.60054 6.00781 7.51904 5.9977 7.4388C5.98759 7.35856 5.95817 7.28196 5.91195 7.21559C5.86574 7.14922 5.80411 7.09504 5.73236 7.05772C5.66061 7.0204 5.58087 7.00104 5.5 7.0013H2Z"
                stroke="#52525B"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_13597_18065">
                <rect width="12" height="12" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
  
        <div>
          <p
            className="text-[12px] font-semibold leading-[18px] font-inter mb-0.5"
            style={{
              color: "var(--base-card-foreground, #09090B)",
              fontFamily: "Inter",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "18px"
            }}
          >
            {name}
          </p>
     
          <p
            className="truncate"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'var(--base-muted-foreground, #71717A)',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '20px',
            }}
          >
            {wins} wins
          </p>
     
        </div>
      </div>
      <div
        style={{
          overflow: 'hidden',
          color: 'var(--base-foreground, #18181B)',
          textAlign: 'right',
          textOverflow: 'ellipsis',
          fontFamily: 'Inter',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '20px',
        }}
      >
        {price}
      </div>
 
    </motion.div>
  );
}
