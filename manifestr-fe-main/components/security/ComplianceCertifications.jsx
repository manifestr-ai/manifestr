import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_IMAGE = 'https://www.figma.com/api/mcp/asset/34930df2-f9f5-44c0-8de4-e5864300e41e'

const ACCORDION_ITEMS = [
  {
    id: 'soc2',
    title: 'SOC 2 Type II',
    description: 'Independent audits validate internal controls and data security practices.',
  },
  {
    id: 'gdpr-cpra',
    title: 'GDPR & CPRA',
    description: 'Full alignment with EU and California privacy laws: access, portability, deletion rights.',
  },
  {
    id: 'hipaa',
    title: 'HIPAA',
    description: 'Healthcare customers supported with HIPAA-grade protections.',
  },
  {
    id: 'iso27001',
    title: 'ISO/IEC 27001 (Roadmap)',
    description: 'Upcoming certification to strengthen ISMS controls.',
  },
]

const PACK_CARDS = [
  {
    title: 'SOC 2 Type II Summary Report',
    image: 'https://www.figma.com/api/mcp/asset/701541ee-d773-415d-9276-266a49cd7e76',
  },
  {
    title: 'GDPR & CPRA compliance documentation.',
    image: 'https://www.figma.com/api/mcp/asset/7e2fdf1f-e2da-42ee-9164-e96708a5ee74',
  },
  {
    title: 'HIPAA safeguard details (if applicable).',
    image: 'https://www.figma.com/api/mcp/asset/74149ca1-2e1e-424e-8ba5-3c66d5222236',
  },
  {
    title: 'ISO 27001 roadmap and expected certification timeline.',
    image: 'https://www.figma.com/api/mcp/asset/22851646-764b-4c10-a48e-2367ff7784b1',
  },
]

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-[20px] h-[20px] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="w-[16px] h-[16px] shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export default function ComplianceCertifications() {
  const [openIds, setOpenIds] = useState({})
  const font = { fontFamily: 'Inter, sans-serif' }
  const headingFont = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }

  function toggle(id) {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="w-full bg-white overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px] py-[48px] md:py-[96px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-[4px] mb-[32px]">
            <Link href="/" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>
              Home
            </Link>
            <ChevronRight />
            <Link href="/security" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>
              Security
            </Link>
            <ChevronRight />
            <span className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px]" style={font}>
              Compliance &amp; Certifications
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[64px] items-center lg:items-start">
            {/* Left — text */}
            <div className="flex flex-col gap-[40px] w-full lg:w-[592px] shrink-0 items-center lg:items-start">
              <div className="flex flex-col gap-[20px]">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-black text-[36px] md:text-[72px] leading-[44px] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] text-center lg:text-left"
                  style={headingFont}
                >
                  Aligned with global standards.
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="flex flex-col gap-[16px] md:gap-[18px] text-[#52525b] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-center lg:text-left"
                  style={font}
                >
                  <p>
                    At MANIFESTR, compliance is more than a checkbox — it&apos;s the foundation of trust.
                    We align with internationally recognized frameworks and regional laws to ensure our platform is
                    not only secure, but auditable, transparent, and legally defensible.
                  </p>
                  <p>
                    Independent audits, regulatory compliance, and future certifications demonstrate our ongoing
                    commitment to safeguarding customer data, meeting legal obligations, and exceeding investor
                    expectations.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                <Link
                  href="#soc2-section"
                  className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                  style={font}
                >
                  See Our Compliance Standards
                </Link>
              </motion.div>
            </div>

            {/* Right — image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:flex-1 lg:min-w-0"
            >
              <div className="w-full max-w-[342px] md:max-w-none mx-auto rounded-[12px] overflow-hidden h-[319px] lg:h-auto" style={{ aspectRatio: undefined }}>
                <CldImage src={HERO_IMAGE} alt="Compliance and certifications" className="w-full h-full object-cover rounded-[12px]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SOC 2 Type II — Accordion ─── */}
      <section id="soc2-section" className="w-full bg-white px-6 md:px-[80px] py-[48px] md:py-[96px] scroll-mt-[80px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[32px] md:gap-[48px]">
          <motion.h2
            {...fadeUp}
            className="text-black text-center text-[30px] md:text-[60px] leading-[38px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px]"
            style={headingFont}
          >
            SOC 2 Type II
          </motion.h2>

          <div className="flex flex-col gap-[16px] md:gap-[24px]">
            {ACCORDION_ITEMS.map((item) => {
              const isOpen = !!openIds[item.id]
              return (
                <motion.div
                  key={item.id}
                  {...fadeUp}
                  className="border border-[#c6c8d0] rounded-[12px] px-[16px] py-[20px] md:p-[20px]"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-start gap-[24px] text-left cursor-pointer"
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                      <span className="text-black text-[18px] leading-[28px] font-medium" style={font}>
                        {item.title}
                      </span>
                      <span className="text-[#52525b] text-[16px] leading-[24px]" style={font}>
                        {item.description}
                      </span>
                    </div>
                    <span className="mt-[4px] text-[#475569]">
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-[16px] border-t border-[#e4e4e7] mt-[16px]">
                          <p className="text-[#52525b] text-[16px] leading-[24px]" style={font}>
                            MANIFESTR maintains {item.title} compliance as part of our commitment to
                            security and transparency. Our practices are independently validated and
                            continuously monitored to meet the highest standards.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Investor Security Pack ─── */}
      <section className="w-full bg-white py-[48px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[24px] md:gap-[48px] items-center px-6 md:px-[80px]">
          <motion.h2
            {...fadeUp}
            className="text-black text-center text-[36px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px] w-full"
            style={headingFont}
          >
            Our Investor Security Pack includes
          </motion.h2>

          <div className="flex flex-col gap-[32px] md:gap-[40px] w-full">
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-[24px]">
              {PACK_CARDS.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="bg-white border border-[#e4e4e7] rounded-[12px] overflow-hidden flex flex-col group"
                >
                  <div className="relative w-full h-[254px] overflow-hidden bg-[#f4f4f5]">
                    <CldImage
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
                  </div>
                  <div className="px-[20px] py-[24px]">
                    <h3 className="text-black text-[24px] leading-[32px]" style={headingFont}>
                      {card.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile horizontal scroll */}
            <div className="md:hidden overflow-x-auto -mx-6 px-6 scrollbar-hide">
              <div className="flex gap-[27px] w-max">
                {PACK_CARDS.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="bg-white border border-[#e4e4e7] rounded-[12px] overflow-hidden flex flex-col w-[315px] shrink-0"
                  >
                    <div className="relative w-full h-[207px] overflow-hidden bg-[#f4f4f5]">
                      <CldImage
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                    <div className="px-[21px] py-[20px]">
                      <h3 className="text-black text-[24px] leading-[32px]" style={headingFont}>
                        {card.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Access Protocol */}
            <motion.div {...fadeUp} className="flex flex-col gap-[8px]">
              <h3 className="text-[#18181b] text-[24px] leading-[32px]" style={headingFont}>
                Access Protocol
              </h3>
              <p className="text-[#52525b] text-[16px] leading-[24px]" style={font}>
                Certain compliance reports may require a non-disclosure agreement (NDA) or investor credentials to
                access, ensuring sensitive audit details remain protected.
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div {...fadeUp}>
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
              style={font}
            >
              <span className="md:hidden">See Our Compliance Standards</span>
              <span className="hidden md:inline">Download Compliance Pack</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Legal Disclaimer ─── */}
      <section className="w-full bg-[#e4e3e1] md:bg-[#deddda] px-6 md:px-[80px] py-[48px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[12px] items-center text-center">
          <motion.h2
            {...fadeUp}
            className="text-black text-[30px] md:text-[60px] leading-[38px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px]"
            style={headingFont}
          >
            Legal Disclaimer
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#52525b] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] max-w-[1120px]"
            style={font}
          >
            This page is provided for informational purposes only and does not constitute legal advice. While
            MANIFESTR maintains compliance with applicable frameworks and regulations, customers are responsible
            for ensuring their own compliance with laws and contractual obligations relevant to their use of the
            MANIFESTR platform. For specific legal guidance, please consult a qualified attorney.
          </motion.p>
        </div>
      </section>
    </>
  )
}
