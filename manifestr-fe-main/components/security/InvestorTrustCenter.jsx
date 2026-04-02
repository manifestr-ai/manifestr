import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_IMAGE = 'https://www.figma.com/api/mcp/asset/c2ef4c91-4cbc-4393-b4b2-ed5de0a04a38'

const ACCORDION_ITEMS = [
  { id: 'soc2', title: 'SOC 2 Type II Summary Report' },
  { id: 'pen-testing', title: 'Penetration Testing Summaries' },
  { id: 'dpa', title: 'Data Processing Agreement (DPA)' },
  { id: 'vendor', title: 'Vendor & Subprocessor List' },
  { id: 'whitepapers', title: 'Security Whitepapers' },
  { id: 'access', title: 'Access Protocol' },
]

const CTA_CARDS = [
  {
    text: 'Includes executive summaries of SOC 2, DPA template, and security whitepapers.',
    button: 'Read Monitoring Report',
    href: '#',
  },
  {
    text: 'Secure request form for full reports under NDA.',
    button: 'Request Investor Access',
    href: '#',
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

export default function InvestorTrustCenter() {
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
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px] py-[96px]">
          <nav className="flex items-center gap-[4px] mb-[32px]">
            <Link href="/" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Home</Link>
            <ChevronRight />
            <Link href="/security" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Security</Link>
            <ChevronRight />
            <span className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px]" style={font}>Investor Trust Center</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-[64px] items-start">
            <div className="flex flex-col gap-[16px] w-full lg:w-[592px] shrink-0">
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="text-black tracking-[-1.44px]"
                style={{ ...headingFont, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: '1.25' }}
              >
                Proof, not promises
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col gap-[18px] pb-[16px] text-[#52525b] text-[18px] leading-[28px]" style={font}
              >
                <p>
                  At MANIFESTR, we recognize that investors and enterprise partners require more than assurances.
                  They need verifiable evidence that our platform meets independent audit standards, regulatory
                  requirements, and enterprise-grade security practices.
                </p>
                <p>
                  The Investor Trust Center centralizes access to key compliance artifacts, legal frameworks, and
                  technical documentation that demonstrate how MANIFESTR safeguards data and upholds regulatory
                  obligations worldwide.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block flex-1 min-w-0"
            >
              <div className="w-full rounded-[12px] overflow-hidden" style={{ aspectRatio: '624 / 514' }}>
                <CldImage src={HERO_IMAGE} alt="Investor Trust Center" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Accordion ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[16px]">
          {ACCORDION_ITEMS.map((item) => {
            const isOpen = !!openIds[item.id]
            return (
              <motion.div
                key={item.id}
                {...fadeUp}
                className="border border-[#c6c8d0] rounded-[12px] p-[20px]"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center gap-[24px] text-left cursor-pointer"
                >
                  <span className="flex-1 text-black text-[18px] leading-[28px] font-medium" style={font}>
                    {item.title}
                  </span>
                  <span className="text-[#475569]">
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
                          Access MANIFESTR&apos;s {item.title.toLowerCase()} documentation. All materials are
                          provided under NDA and subject to our standard access protocol. Contact your account
                          representative or submit a request through the Investor Access form below.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ─── Right-Rail Sticky / CTA Cards ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[48px] items-center">
          <motion.h2
            {...fadeUp}
            className="text-black text-center tracking-[-1.2px]"
            style={{ ...headingFont, fontSize: 'clamp(36px, 4.17vw, 60px)', lineHeight: '1.2' }}
          >
            Right-Rail Sticky
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-[48px] w-full max-w-[941px] mx-auto">
            {CTA_CARDS.map((card) => (
              <motion.div
                key={card.button}
                {...fadeUp}
                className="flex-1 bg-[#f9fafb] rounded-[12px] p-[32px] flex flex-col gap-[20px] items-center justify-center"
              >
                <p className="text-[#52525b] text-[16px] leading-[24px] text-center max-w-[354px]" style={font}>
                  {card.text}
                </p>
                <Link
                  href={card.href}
                  className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                  style={font}
                >
                  {card.button}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Legal Disclaimer ─── */}
      <section className="w-full bg-[#deddda] px-6 md:px-[80px] py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[12px] items-center text-center">
          <motion.h2
            {...fadeUp}
            className="text-black tracking-[-0.96px]"
            style={{ ...headingFont, fontSize: 'clamp(32px, 3.33vw, 48px)', lineHeight: '1.25' }}
          >
            Legal Disclaimer
          </motion.h2>
          <motion.p
            {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#52525b] text-[16px] leading-[24px] max-w-[1120px]" style={font}
          >
            This page is provided for informational purposes only and does not constitute legal advice.
            MANIFESTR&apos;s monitoring, penetration testing, training, and patch management programs are designed
            in accordance with recognized best practices (NIST, ISO, SOC 2, OWASP, CVE). Customers remain
            responsible for maintaining endpoint security, account management, and compliance with data protection
            laws applicable to their business (including GDPR, CPRA, HIPAA, or other sector-specific regulations).
            For specific legal guidance, consult a qualified attorney.
          </motion.p>
        </div>
      </section>
    </>
  )
}
