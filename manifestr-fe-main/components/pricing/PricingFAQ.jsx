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

export default function PricingFAQ() {
  const [activeTab, setActiveTab] = useState('Wins')
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = FAQ_DATA[activeTab] || []

  return (
    <section className="w-full bg-white py-[48px] md:py-[64px] px-6">
      <div className="max-w-[835px] mx-auto flex flex-col items-center gap-[32px] md:gap-[64px]">
        {/* Heading */}
        <div className="flex flex-col items-center md:items-start gap-[14px] max-w-[707px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[60px] leading-[44px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px] text-black text-center md:text-left"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Frequently Asked </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Questions</span>
          </motion.h2>
          <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#52525b] text-center md:text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
            {"Everything you need to know about MANIFESTR plans and features. Can't find what you're looking for? Contact our support team."}
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full md:w-auto overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          <div className="bg-white border border-black rounded-[12px] shadow-[0px_4px_4px_0px_#e4e4e7] flex items-center gap-[4px] p-[8px] w-max md:w-auto mx-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setOpenIndex(0) }}
                className={`h-[36px] md:h-[44px] px-[16px] md:px-[32px] rounded-[6px] text-[13px] md:text-[16px] leading-[24px] font-medium transition-colors whitespace-nowrap ${
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

        {/* Accordion */}
        <div className="w-full flex flex-col gap-[12px] md:gap-[16px]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={`${activeTab}-${i}`}
                className="border border-[#c6c8d0] rounded-[14px] md:rounded-[12px] p-[16px] md:p-[20px] shadow-[0px_1px_2.8px_0px_#888891] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-[16px] md:gap-[24px]"
                >
                  <span className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] font-medium text-black text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {faq.q}
                  </span>
                  <svg
                    className={`w-[24px] h-[24px] shrink-0 text-[#18181b] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="text-[14px] md:text-[16px] leading-[21px] md:leading-[24px] text-[#52525b] mt-[12px] md:mt-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row items-center gap-[12px] md:gap-[16px]">
          <span className="text-[14px] leading-[20px] font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
            Need more detail?
          </span>
          <Link
            href="/playbook"
            className="h-[36px] md:h-[44px] px-[24px] md:px-[40px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center gap-[8px] justify-center hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore the Manifestr Playbook
            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
