import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  { q: 'What Toolkit  are included in MANIFESTR?' },
  { q: 'Can I use my own branding in MANIFESTR?' },
  { q: 'How do Wins (tokens) work?' },
  { q: 'How do I invite my team or clients?' },
  { q: 'What file types can I export?' },
  { q: 'How do I contact support?' },
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
              More details coming soon.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function ToolsFAQ() {
  return (
    <section className="w-full  px-6 md:px-[80px] py-[64px] md:py-[96px]">
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
