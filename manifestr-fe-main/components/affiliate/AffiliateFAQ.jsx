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

function ArrowUpRight({ className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 17L17 7M17 7H10M17 7V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowDownRight({ className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 7L17 17M17 17H10M17 17V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function AffiliateFAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="w-full bg-white py-[48px] md:py-[100px]">
      <div className="max-w-[835px] mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[32px] md:mb-[40px]"
        >
          <h2 className="text-[36px] md:text-[54px] leading-[44px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.08px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Frequently Asked</span>
            <br className="md:hidden" />
            <span className="hidden md:inline" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Questions</span>
          </h2>
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-[#52525b] mt-[12px] md:mt-[16px] max-w-[338px] md:max-w-[603px] mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Everything you need to know about MANIFESTR plans and features.
            {' '}Can&apos;t find what you&apos;re looking for?
            {' '}Contact our support team.
          </p>
        </motion.div>

        {/* Accordion — Figma: open = gray card + ↗ in white pill; closed = white card + ↘, no pill */}
        <div className="flex flex-col gap-4 md:gap-4">
          {FAQ_DATA.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                role="button"
                tabIndex={0}
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setOpenIdx(isOpen ? -1 : i)
                  }
                }}
                className={`cursor-pointer rounded-[12px] border border-solid transition-colors duration-200 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2
                  ${isOpen
                    ? 'bg-[#f3f4f6] border-[#e4e4e7] px-5 py-4'
                    : 'bg-white border-[#c6c8d0] p-5'}`}
              >
                <div className={`flex gap-6 items-start w-full ${isOpen ? '' : 'items-center'}`}>
                  <div
                    className={`flex-1 min-w-0 flex flex-col ${isOpen ? 'gap-3' : 'gap-0'}`}
                  >
                    <p
                      className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-black"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      {item.q}
                    </p>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p
                            className="text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] text-black pt-0"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                          >
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div
                    className={`shrink-0 flex items-center justify-center ${isOpen ? 'pt-0.5' : ''}`}
                    aria-hidden
                  >
                    {isOpen ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1">
                        <ArrowUpRight className="text-black" />
                      </div>
                    ) : (
                      <div className="flex size-6 items-center justify-center">
                        <ArrowDownRight className="text-black" />
                      </div>
                    )}
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
