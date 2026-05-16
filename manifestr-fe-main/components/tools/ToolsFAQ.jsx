import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'Will this replace the tools I’m already using?',
    a: 'Yes. MANIFESTR replaces up to 8 tools in one place, so you’re not switching platforms or losing momentum. Everything runs through a single, structured workflow built for execution, saving you time and money.',
  },
  {
    q: 'Can I change or cancel my plan at any time?',
    a: 'Yes. Upgrade or change your plan at any time. If you cancel, you’ll retain access until the end of your current billing cycle.',
  },
  {
    q: 'Can I collaborate with my team or clients?',
    a: 'Yes. Invite your team, start collabs, and share with clients in view-only mode. Work is reviewed and refined in real time, while you stay in control of the output.',
  },
  {
    q: 'How do Wins (AI tokens) work?',
    a: 'Wins power your outputs. Every time you generate or refine work, Wins are used. You can track usage and top up anytime so your workflow never stops.',
  },
  {
    q: 'Can I customise outputs to match my brand or client?',
    a: 'Yes. Everything can be aligned to your brand or client, including colours, fonts, and logos, so your work is ready to present, share, and review with confidence.',
  },
  {
    q: 'Can I try MANIFESTR before committing?',
    a: 'Yes. You’re backed by a 7-day guarantee, so you can explore the platform completely pressure free.',
  },
]

function FAQCard({ faq, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => setOpen((v) => !v)}
      className="bg-white border border-[#e5e7eb] rounded-[12px] p-[24px] text-left w-full shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] cursor-pointer"
    >
      <div className="flex items-center justify-between gap-[16px]">
        <h3
          className="text-[20px] md:text-[24px] leading-[32px] text-black"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          {faq.q}
        </h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          <path d="M10 4V16M4 10H16" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p
              className="text-[16px] leading-[24px] text-[#52525b] pt-[16px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function ToolsFAQ() {
  return (
    <section className="w-full px-6 md:px-[80px] pt-6 pb-[64px] md:pt-[72px] md:pb-[96px]">
      <div className="max-w-[1216px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[36px] md:text-[48px] leading-[60px] tracking-[-0.96px] mb-[32px]"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Popular </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            questions?
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          {FAQS.map((faq, i) => (
            <FAQCard key={faq.q} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
