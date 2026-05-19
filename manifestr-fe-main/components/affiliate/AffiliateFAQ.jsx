import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const TABS = ['Commissions', 'Eligibility']

const FAQ_DATA = {
  Commissions: [
    {
      q: 'How do I get paid?',
      a: 'Commissions are paid monthly via your chosen payout method once your balance reaches the minimum threshold.',
    },
    {
      q: 'Where can I track my referrals and earnings?',
      a: 'You can track everything in real time through your personalized affiliate dashboard, including clicks, conversions, and payouts.',
    },
  ],
  Eligibility: [
    {
      q: 'Is there a cost to join?',
      a: 'No — the MANIFESTR Affiliate Program is completely free to join. There are no hidden fees or upfront costs.',
    },
    {
      q: 'Do I need to be a MANIFESTR customer to join?',
      a: 'No, you don\'t need to be a customer. However, familiarity with the product can help you promote it more effectively.',
    },
  ],
}

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
  const [activeTab, setActiveTab] = useState('Commissions')
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = FAQ_DATA[activeTab] || []

  return (
    <section className="w-full bg-white py-[48px] md:py-[100px]">
      <div className="mx-auto flex max-w-[835px] flex-col gap-[32px] px-6 md:gap-[40px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-center text-[36px] leading-[44px] tracking-[-0.72px] text-black md:text-[54px] md:leading-[72px] md:tracking-[-1.08px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Frequently Asked </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Questions</span>
          </h2>
          <p
            className="mx-auto mt-[12px] max-w-[338px] text-center text-[16px] leading-[24px] text-[#52525b] md:mt-[16px] md:max-w-[603px] md:text-[18px] md:leading-[28px]"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            Everything you need to know about the MANIFESTR Affiliate Program.
            {' '}Can&apos;t find what you&apos;re looking for?
            {' '}Contact our support team.
          </p>
        </motion.div>

        <div className="w-full min-w-0">
          <div
            className="grid w-full grid-cols-2 items-stretch gap-[2px] rounded-[12px] border border-black bg-white p-[4px] shadow-[0px_4px_4px_0px_#e4e4e7]"
            role="tablist"
            aria-label="FAQ categories"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => {
                  setActiveTab(tab)
                  setOpenIndex(0)
                }}
                className={`min-h-[34px] whitespace-nowrap rounded-[6px] px-[4px] py-[4px] text-center text-[clamp(11px,3.5vw,16px)] font-medium leading-none transition-colors md:min-h-[42px] md:px-[10px] md:text-[16px] md:leading-[24px] ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'text-[#717680] hover:text-[#18181b]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion — same as PricingFAQ: open = gray card + ↗ pill; closed = ↘ */}
        <div className="flex flex-col gap-4 md:gap-4">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={`${activeTab}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                role="button"
                tabIndex={0}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setOpenIndex(isOpen ? -1 : i)
                  }
                }}
                className="cursor-pointer rounded-[16px] border border-[#e2e8f0] bg-[#f4f4f4] px-5 py-5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 md:px-8 md:py-6"
              >
                <div className="flex w-full flex-row items-start justify-between gap-4 text-left">
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[16px] leading-[24px] text-[#1e293b] md:text-[18px] md:leading-[28px]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
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
                          className="w-full overflow-hidden"
                        >
                          <p
                            className="pt-4 text-[14px] leading-[22px] text-[#475569] md:text-[16px] md:leading-[24px]"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                          >
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex shrink-0 pt-0.5" aria-hidden>
                    {isOpen ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-[#e2e8f0]">
                        <ArrowUpRight className="text-[#18181b]" />
                      </div>
                    ) : (
                      <div className="flex size-8 items-center justify-center text-[#475569]">
                        <ArrowDownRight className="text-current" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
          <span
            className="text-[14px] font-medium leading-[20px] text-black sm:text-[16px] sm:leading-[24px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Need more detail?
          </span>
          <Link
            href="/playbook"
            className="box-border inline-flex h-[44px] min-h-[44px] w-full max-w-[360px] items-center justify-center gap-2 rounded-[6px] bg-[#18181b] px-8 text-[14px] font-medium text-white transition-colors hover:bg-[#27272a] sm:h-[54px] sm:min-h-[54px] sm:w-auto sm:max-w-none md:px-10 md:text-[18px] md:leading-[20px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore the MANIFESTR Playbook
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
