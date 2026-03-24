import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const WOMAN_BG = 'https://www.figma.com/api/mcp/asset/be4ee088-95ca-44c2-b5a7-8b81950fc16d'
const M_LOGO = 'https://www.figma.com/api/mcp/asset/beaa3ff6-490a-4638-83c1-8e54927261d9'
const ARROW_DOWN = 'https://www.figma.com/api/mcp/asset/f8573d0c-f1b9-4546-bfa8-91e3a9fbad31'

const COMMISSION_OPTIONS = [
  { label: '30% Commission', value: 0.3 },
  { label: '40% Commission', value: 0.4 },
  { label: '50% Commission', value: 0.5 },
]

export default function EarningPotential() {
  const [referrals, setReferrals] = useState(389)
  const [commIdx, setCommIdx] = useState(0)
  const [showMenu, setShowMenu] = useState(false)

  const rate = COMMISSION_OPTIONS[commIdx].value
  const avgMonthlyRevenue = 39.6
  const monthlyEarnings = useMemo(() => referrals * avgMonthlyRevenue * rate, [referrals, rate])
  const annualEarnings = useMemo(() => monthlyEarnings * 12, [monthlyEarnings])

  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <section className="relative w-full bg-white overflow-hidden" style={{ minHeight: 1112 }}>
      {/* Background image — woman on left, clean white on right */}
      <div className="absolute inset-0 overflow-hidden" style={{ transform: 'scaleX(-1)' }}>
        <img
          src={WOMAN_BG}
          alt=""
          className="absolute max-w-none"
          style={{
            width: '169.07%',
            height: '101.76%',
            left: '-69.07%',
            top: '-1.76%',
          }}
        />
      </div>

      {/* HUSTLE watermark — rotated -90deg, right edge */}
      <div
        className="absolute pointer-events-none select-none hidden md:flex items-center justify-center"
        style={{ right: -60, top: '50%', transform: 'translateY(-50%)', width: 283, height: 1122 }}
        aria-hidden="true"
      >
        <div style={{ transform: 'rotate(-90deg)' }}>
          <p
            className="whitespace-nowrap leading-normal"
            style={{
              fontFamily: "'IvyPresto Headline', serif",
              fontWeight: 600,
              fontStyle: 'italic',
              fontSize: 300,
              color: 'rgba(210,210,210,0.29)',
              width: 1122,
              textAlign: 'left',
            }}
          >
            HUSTLE
          </p>
        </div>
      </div>

      {/* Cards — positioned right */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-[80px]">
        <div
          className="flex flex-col gap-[39px] w-full md:w-[667px] md:ml-auto pt-[80px] md:pt-[152px] pb-[80px] md:pb-[120px]"
        >

          {/* === Top card — Your Earning Potential === */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-white rounded-[12px] shadow-[0px_8px_16px_0px_rgba(22,34,51,0.08)] w-full"
            style={{ height: 'auto', minHeight: 385, padding: 30 }}
          >
            {/* Heading */}
            <h2 className="text-[40px] md:text-[60px] leading-[72px] tracking-[-1.2px] text-black">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                Your Earning
              </span>
              <br />
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
                Potential
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className="text-[18px] leading-[24px] text-[#52525b] mt-[16px] max-w-[592px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              With MANIFESTR&apos;s generous commission structure, your earning potential grows with every referral.
            </p>

            {/* Referrals + commission dropdown row */}
            <div className="flex items-center justify-between mt-[32px] flex-wrap gap-[12px]">
              <p
                className="text-[18px] leading-[18px] text-[#020617]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                Referrals: {referrals}
              </p>

              {/* Custom dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-black text-[#f2f2f2] text-[18px] leading-[18px] px-[16px] py-[10px] rounded-[8px] shadow-sm flex items-center gap-[8px] h-[44px] cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, minWidth: 198 }}
                >
                  {COMMISSION_OPTIONS[commIdx].label}
                  <img src={ARROW_DOWN} alt="" className="w-[12px] h-[12px] opacity-90" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-[rgba(0,0,0,0.38)] rounded-[8px] py-[4px] w-[248px] z-50 shadow-md">
                    {COMMISSION_OPTIONS.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => { setCommIdx(i); setShowMenu(false) }}
                        className={`w-full text-left px-[14px] py-[8px] text-[16px] leading-[24px] text-[#18181b] flex items-center justify-between rounded-[6px] mx-[6px] hover:bg-[#f4f4f5] transition-colors duration-150 ${commIdx === i ? 'bg-[#f4f4f5]' : ''}`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, width: 'calc(100% - 12px)' }}
                      >
                        {opt.label}s
                        {commIdx === i && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.333 8L6.666 11.333 12.666 5.333" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="relative mt-[16px] h-[24px] flex items-center" style={{ maxWidth: 595 }}>
              <div className="absolute left-0 right-0 h-[8px] bg-[#e9e9e9] rounded-[4px]" />
              <div
                className="absolute left-0 h-[8px] bg-[#020617] rounded-[4px]"
                style={{ width: `${(referrals / 1000) * 100}%` }}
              />
              <input
                type="range"
                min={1}
                max={1000}
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute w-[24px] h-[24px] bg-white border-2 border-[#020617] rounded-full shadow-md pointer-events-none"
                style={{ left: `calc(${(referrals / 1000) * 100}% - 12px)` }}
              />
            </div>
          </motion.div>

          {/* === Bottom card — Earnings Calculator === */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative bg-white rounded-[12px] shadow-[0px_8px_16px_0px_rgba(22,34,51,0.08)] w-full"
            style={{ minHeight: 385, padding: '27px 36px 24px' }}
          >
            {/* M. logo + title row */}
            <div className="flex items-center gap-[12px] mb-[24px]">
              <div className="w-[60px] h-[46px] overflow-hidden shrink-0">
                <img src={M_LOGO} alt="M." className="w-full h-full object-contain" />
              </div>
              <p
                className="text-[24px] md:text-[27px] leading-[33px] tracking-[-0.2px] text-black whitespace-nowrap"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
              >
                Earnings Calculator
              </p>
            </div>

            {/* Amount + Annual boxes */}
            <div className="flex gap-[14px]">
              {/* Amount (black) */}
              <div className="bg-black rounded-[12px] flex-1 h-[94px] flex flex-col justify-center px-[20px]">
                <p
                  className="text-[28px] md:text-[32px] leading-[33px] tracking-[-0.24px] text-white"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                >
                  ${fmt(monthlyEarnings)}
                </p>
                <p
                  className="text-[18px] leading-[21px] text-white mt-[6px]"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                >
                  Amount
                </p>
              </div>
              {/* Annual (gray) */}
              <div className="bg-[#f2f2f2] rounded-[12px] flex-1 h-[94px] flex flex-col justify-center px-[20px]">
                <p
                  className="text-[28px] md:text-[32px] leading-[33px] tracking-[-0.24px] text-black"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                >
                  ${fmt(annualEarnings)}
                </p>
                <p
                  className="text-[18px] leading-[24px] text-black mt-[6px]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  Annual
                </p>
              </div>
            </div>

            {/* Stats rows */}
            <div className="flex flex-col gap-[20px] mt-[24px]">
              {[
                ['Monthly Payment:', referrals.toString()],
                ['Monthly BTC Investment:', `$${fmt(monthlyEarnings)}`],
                ['LTV Ratio:', `${(rate * 100).toFixed(1)}%`],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between">
                  <span
                    className="text-[20px] md:text-[24px] leading-[30px] text-black"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[20px] md:text-[24px] leading-[30px] text-black"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
