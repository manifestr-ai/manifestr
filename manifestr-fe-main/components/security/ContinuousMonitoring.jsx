import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_IMAGE = 'https://www.figma.com/api/mcp/asset/8bac4c34-ead0-47cc-8770-4bcf35a4cfa0'

const ACCORDION_ITEMS = [
  {
    id: '247-monitoring',
    title: '24/7 Monitoring',
    description: 'AI-driven anomaly detection across infrastructure and accounts.',
  },
  {
    id: 'penetration-testing',
    title: 'Regular Penetration Testing',
    description: 'Independent third-party validation of defenses.',
  },
  {
    id: 'employee-training',
    title: 'Employee Training',
    description: 'Mandatory security training and vetting of all personnel.',
  },
  {
    id: 'patch-management',
    title: 'Patch Management',
    description: 'Critical updates applied swiftly, reducing exposure.',
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

export default function ContinuousMonitoring() {
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
          <nav className="flex flex-wrap items-center gap-[4px] mb-[16px] md:mb-[32px]">
            <Link href="/" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Home</Link>
            <ChevronRight />
            <Link href="/security" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Security</Link>
            <ChevronRight />
            <span className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px]" style={font}>Continuous Monitoring &amp; Updates</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[64px] items-start">
            <div className="flex flex-col gap-[16px] w-full lg:w-[592px] shrink-0">
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="text-black text-[36px] md:text-[72px] leading-[44px] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px]"
                style={headingFont}
              >
                Always on.<br />Always evolving.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col gap-[16px] md:gap-[18px] pb-[16px] text-[#52525b] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px]" style={font}
              >
                <p>
                  Security is a living system. Threats evolve daily — which is why MANIFESTR employs a program of
                  continuous monitoring, independent validation, workforce safeguards, and rapid patch management.
                </p>
                <p>This approach ensures that the MANIFESTR platform remains:</p>
                <ul className="list-disc pl-[24px] md:pl-[27px] flex flex-col gap-[2px]">
                  <li>Resilient against emerging threats.</li>
                  <li>Legally compliant with global data protection frameworks.</li>
                  <li>Trustworthy for customers, partners, and investors.</li>
                </ul>
                <p>
                  Our philosophy is simple: detect early, respond fast, and prevent recurrence.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:flex-1 lg:min-w-0"
            >
              <div className="w-full rounded-[12px] overflow-hidden h-[319px] lg:h-auto" style={{ aspectRatio: undefined }}>
                <CldImage src={HERO_IMAGE} alt="Continuous monitoring" className="w-full h-full object-cover rounded-[12px]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Accordion ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[48px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[32px] md:gap-[48px] items-center">
          <div className="flex flex-col gap-[16px] w-full">
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
                            MANIFESTR&apos;s {item.title.toLowerCase()} practices are designed to meet the highest
                            industry standards. Our team follows structured processes aligned with NIST, ISO, SOC 2,
                            OWASP, and CVE frameworks to ensure continuous, proactive security across the platform.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <motion.p {...fadeUp} className="text-[#52525b] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] font-medium" style={font}>
            Last updated: 26 January 2025
          </motion.p>

          <motion.div {...fadeUp}>
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
              style={font}
            >
              Read Monitoring Report
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Legal Disclaimer ─── */}
      <section className="w-full bg-[#deddda] px-6 md:px-[80px] py-[48px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[12px] items-center text-center">
          <motion.h2
            {...fadeUp}
            className="text-black text-[30px] md:text-[48px] leading-[38px] md:leading-[60px] tracking-[-0.72px] md:tracking-[-0.96px]"
            style={headingFont}
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
