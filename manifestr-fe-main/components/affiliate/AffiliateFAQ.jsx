import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQ_DATA = [
  {
    q: 'How do I get paid?',
    a: 'Commissions are paid monthly via your chosen payout method once your balance reaches the minimum threshold.',
  },
  {
    q: 'Is there a cost to join?',
    a: 'No — the MANIFESTR Affiliate Program is completely free to join. There are no hidden fees or upfront costs.',
  },
  {
    q: 'Do I need to be a MANIFESTR customer to join?',
    a: 'No, you don\'t need to be a customer. However, familiarity with the product can help you promote it more effectively.',
  },
  {
    q: 'Where can I track my referrals and earnings?',
    a: 'You can track everything in real time through your personalized affiliate dashboard, including clicks, conversions, and payouts.',
  },
]

export default function AffiliateFAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="w-full bg-white py-[80px] md:py-[100px]">
      <div className="max-w-[835px] mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[40px]"
        >
          <h2 className="text-[40px] md:text-[54px] leading-[72px] tracking-[-1.08px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Frequently Asked </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Questions</span>
          </h2>
          <p
            className="text-[18px] leading-[28px] text-[#52525b] mt-[16px] max-w-[603px] mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Everything you need to know about MANIFESTR plans and features. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="flex flex-col gap-[16px]">
          {FAQ_DATA.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`rounded-[12px] px-[20px] py-[16px] cursor-pointer transition-colors duration-200
                  ${isOpen ? 'bg-[#f3f4f6] border border-[#e4e4e7]' : 'border border-[#c6c8d0]'}`}
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
              >
                <div className="flex items-start justify-between gap-[24px]">
                  <div className="flex flex-col gap-[12px] flex-1">
                    <p
                      className="text-[18px] leading-[28px] text-black"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      {item.q}
                    </p>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-[16px] leading-[24px] text-black overflow-hidden"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        >
                          {item.a}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className={`shrink-0 w-[24px] h-[24px] flex items-center justify-center transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10L8 6L12 10" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
