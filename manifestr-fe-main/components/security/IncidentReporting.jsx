import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563448/ImageWithFallback-4_i0n053.png'

const ACCORDION_ITEMS = [
  {
    id: 'response-protocol',
    title: 'Incident Response Protocol',
    description: 'Formal IR plan, tested quarterly. Customers notified within 24 hours of verified impact.',
  },
  {
    id: 'vulnerability-disclosure',
    title: 'Vulnerability Disclosure',
    description: 'We welcome responsible disclosure. Submit issues via secure form.',
  },
  {
    id: 'bug-bounty',
    title: 'Bug Bounty Program',
    description: 'Recognized vulnerabilities may qualify for rewards.',
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

export default function IncidentReporting() {
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
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px] py-12 md:py-[96px]">
          <nav className="flex items-center gap-[4px] mb-[32px]">
            <Link href="/" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Home</Link>
            <ChevronRight />
            <Link href="/security" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Security</Link>
            <ChevronRight />
            <span className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px]" style={font}>Incident Reporting</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-[64px] items-start">
            <div className="flex flex-col gap-[16px] w-full lg:w-[592px] shrink-0">
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="text-black tracking-[-0.72px] md:tracking-[-1.44px] text-[36px] leading-[44px] md:text-[72px] md:leading-[90px]"
                style={headingFont}
              >
                Transparency in action.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col gap-[16px] pb-[16px] text-[#52525b] text-[16px] leading-[24px] md:gap-[18px] md:text-[18px] md:leading-[28px]" style={font}
              >
                <p>
                  At MANIFESTR, we understand that security incidents can occur in any digital environment. What
                  matters most is how quickly, transparently, and responsibly they are addressed.
                </p>
                <p>Our philosophy is simple: acknowledge, act, and inform.</p>
                <ul className="list-disc pl-[24px] flex flex-col gap-0">
                  <li>Acknowledge potential issues immediately.</li>
                  <li>Act with structured containment and remediation procedures.</li>
                  <li>Inform customers promptly, so they can make risk-based decisions.</li>
                </ul>
                <p>
                  This commitment ensures that MANIFESTR meets regulatory obligations, industry expectations, and
                  the trust of our customers and investors.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block flex-1 min-w-0"
            >
              <div className="w-full rounded-[12px] overflow-hidden" style={{ aspectRatio: '624 / 634' }}>
                <CldImage src={HERO_IMAGE} alt="Incident reporting" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Mobile hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:hidden mt-8 w-full flex justify-center"
          >
            <div className="w-full max-w-[342px] h-[319px] rounded-[12px] overflow-hidden">
              <CldImage src={HERO_IMAGE} alt="Incident reporting" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Accordion ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-12 md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[48px] items-center">
          <div className="flex flex-col gap-[16px] w-full">
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
                    className="w-full flex items-start gap-[24px] text-left cursor-pointer"
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                      <span className="text-black text-[18px] leading-[28px] font-medium" style={font}>{item.title}</span>
                      <span className="text-[#52525b] text-[14px] leading-[20px]" style={font}>{item.description}</span>
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
                            MANIFESTR&apos;s {item.title.toLowerCase()} is designed to meet the highest industry
                            standards. Our team follows structured processes aligned with NIST, ISO, SOC 2, and
                            CVSS frameworks to ensure swift, transparent, and effective response to any security
                            concern.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <motion.div {...fadeUp}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
              style={font}
            >
              Report a Security Issue
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Legal Disclaimer ─── */}
      <section className="w-full bg-[#e4e3e1] px-6 md:px-[80px] py-12 md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[12px] items-center text-center">
          <motion.h2
            {...fadeUp}
            className="text-black tracking-[-0.6px] md:tracking-[-0.96px] text-[30px] leading-[38px] md:text-[48px] md:leading-[60px]"
            style={headingFont}
          >
            Legal Disclaimer
          </motion.h2>
          <motion.p
            {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#52525b] text-[16px] leading-[24px] max-w-[1119px]" style={font}
          >
            This page is provided for informational purposes only and does not constitute legal advice.
            MANIFESTR&apos;s incident response, disclosure, and bug bounty programs are operated in accordance
            with recognized industry standards (NIST, ISO, SOC 2, CVSS). Customers remain responsible for their
            own compliance obligations under applicable data protection and breach notification laws, including
            GDPR, CPRA, HIPAA, or other sector-specific regulations. For specific legal advice regarding your
            obligations, consult a qualified attorney.
          </motion.p>
        </div>
      </section>
    </>
  )
}
