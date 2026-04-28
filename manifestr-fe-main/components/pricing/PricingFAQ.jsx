import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const TABS = ['Wins', 'Plans', 'Security', 'Support', 'Integrations']

const FAQ_DATA = {
  Wins: [
    { q: 'What happens if I run out of Wins?', a: 'If you exhaust your monthly Wins, you can purchase additional Wins as add-ons or upgrade to a higher-tier plan. Your existing work and data remain fully accessible.' },
    { q: 'What are Wins and how do they work?', a: 'Wins are action credits that power your MANIFESTR toolkit. Each time you generate content, run an AI analysis, or complete a key workflow action, it uses a Win. Different plans include different monthly Win allocations.' },
    { q: 'Do Wins roll over?', a: 'Unused Wins do not roll over to the next billing cycle. Each month your Win count resets to your plan allocation. We recommend choosing a plan that matches your average monthly usage.' },
    { q: 'Can I earn free Wins?', a: 'Yes! You can earn bonus Wins through our referral program, by completing onboarding milestones, and during special promotional events. Follow us on social media for announcements.' },
    { q: 'What is Win Mode?', a: 'Win Mode is our focused productivity state where MANIFESTR optimizes your workspace for maximum output. It streamlines your interface and prioritizes the tools most relevant to your current task.' },
  ],
  Plans: [
    { q: 'Can I switch plans at any time?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
    { q: 'Is there a free trial?', a: 'We offer a 14-day free trial on all plans so you can experience the full MANIFESTR toolkit before committing.' },
  ],
  Security: [
    { q: 'How is my data protected?', a: 'We use enterprise-grade encryption (AES-256) for all data at rest and in transit. Our infrastructure is SOC 2 Type II certified.' },
    { q: 'Where is my data stored?', a: 'All data is stored in secure, geographically distributed data centers with 99.99% uptime guarantee.' },
  ],
  Support: [
    { q: 'How can I contact support?', a: 'You can reach our support team via email, live chat, or through the in-app support widget. Pro and Business plans include priority support with faster response times.' },
  ],
  Integrations: [
    { q: 'What integrations are available?', a: 'MANIFESTR integrates with major platforms including Slack, Google Workspace, Microsoft 365, Notion, and more. Business plans include API access for custom integrations.' },
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

export default function PricingFAQ() {
  const [activeTab, setActiveTab] = useState('Wins')
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = FAQ_DATA[activeTab] || []

  return (
    <section className="w-full bg-white py-[48px] md:py-[100px]">
      <div className="max-w-[835px] mx-auto px-6 flex flex-col gap-[32px] md:gap-[40px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-[36px] md:text-[54px] leading-[44px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.08px] text-black text-center">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Frequently Asked </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Questions</span>
          </h2>
          <p
            className="text-center text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-[#52525b] mt-[12px] md:mt-[16px] max-w-[338px] md:max-w-[603px] mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Everything you need to know about MANIFESTR plans and features.
            {' '}Can&apos;t find what you&apos;re looking for?
            {' '}Contact our support team.
          </p>
        </motion.div>

        <div className="w-full min-w-0">
          <div
            className="bg-white border border-black rounded-[12px] shadow-[0px_4px_4px_0px_#e4e4e7] grid w-full grid-cols-5 items-stretch gap-[2px] p-[4px]"
            role="tablist"
            aria-label="FAQ categories"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => { setActiveTab(tab); setOpenIndex(0) }}
                className={`min-h-[34px] md:min-h-[42px] py-[4px] px-[4px] md:px-[10px] rounded-[6px] font-medium transition-colors text-center whitespace-nowrap leading-none md:leading-[24px] text-[clamp(10px,2.25vw,16px)] md:text-[16px] ${
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

        {/* Accordion — Figma: open = gray card + ↗ in white pill; closed = white card + ↘, no pill */}
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
                className="cursor-pointer rounded-[16px] border border-[#e2e8f0] bg-[#f4f4f4] px-5 py-5 md:px-8 md:py-6 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
              >
                <div className="flex w-full flex-col items-center gap-4 text-center">
                  <p
                    className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-[#1e293b]"
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
                        className="w-full overflow-hidden"
                      >
                        <p
                          className="text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] text-[#475569]"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex shrink-0 justify-center" aria-hidden>
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
          <span
            className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-medium text-black"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Need more detail?
          </span>
          <Link
            href="/playbook"
            className="h-[44px] min-h-[44px] sm:h-[54px] sm:min-h-[54px] w-full max-w-[360px] sm:w-auto sm:max-w-none px-8 md:px-10 rounded-[6px] bg-[#18181b] text-white text-[14px] md:text-[18px] md:leading-[20px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#27272a] transition-colors box-border"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore the Manifestr Playbook
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
