import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563447/ImageWithFallback_jal7be.png'

const ACCORDION_ITEMS = [
  {
    id: 'encryption',
    title: 'Encryption Everywhere',
    description: 'TLS 1.3 in transit, AES-256 at rest, keys rotated regularly.',
  },
  {
    id: 'access',
    title: 'Access Controls',
    description: 'RBAC, MFA enforced, granular permissions by role.',
  },
  {
    id: 'backups',
    title: 'Backups & Recovery',
    description: 'Encrypted, geo-redundant storage with quarterly recovery testing.',
  },
  {
    id: 'zero-trust',
    title: 'Zero-Trust Model',
    description: 'Every access request verified. Trust never assumed.',
  },
]

const COMPLIANCE_CARDS_ROW1 = [
  {
    title: 'Data Processing Agreements (DPA)',
    description: 'Available to customers to document roles and responsibilities for personal data handling.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563446/Container_dtwfuf.png',
  },
  {
    title: 'Vendor & Subprocessor Due Diligence',
    description: 'All subprocessors undergo security reviews to ensure alignment with our data protection commitments.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563446/Container-1_vyu6pu.png',
  },
]

const COMPLIANCE_CARDS_ROW2 = [
  {
    title: 'HIPAA (where applicable)',
    description: 'For healthcare clients, HIPAA-aligned safeguards are available under Business Associate Agreements (BAA).',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563447/ImageWithFallback-1_hjkuct.png',
  },
  {
    title: 'SOC 2 Type II',
    description: 'Annual independent audit confirms effectiveness of our security, availability, and confidentiality controls.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563447/ImageWithFallback-2_p3iyh5.png',
  },
  {
    title: 'GDPR (EU) & CPRA (California)',
    description: 'User rights to access, portability, and deletion are fully supported.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563447/ImageWithFallback-3_zil1iq.png',
  },
]

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-[20px] h-[20px] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
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

function ComplianceScrollArrow({ dir, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 touch-manipulation items-center justify-center rounded-full border border-[#e4e4e7] bg-white text-[#52525b] shadow-sm transition-colors hover:border-[#d4d4d8] hover:text-[#18181b]"
    >
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        {dir === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  )
}

export default function DataProtection() {
  const complianceScrollRef = useRef(null)
  const [openIds, setOpenIds] = useState({})
  const font = { fontFamily: 'Inter, sans-serif' }
  const headingFont = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }

  function toggle(id) {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const scrollCompliance = (dir) => {
    complianceScrollRef.current?.scrollBy({ left: dir * 342, behavior: 'smooth' })
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="w-full bg-white overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px] py-[36px] md:py-[64px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-[4px] mb-3 md:mb-6 justify-center lg:justify-start">
            <Link href="/" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>
              Home
            </Link>
            <ChevronRight />
            <Link href="/security" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>
              Security
            </Link>
            <ChevronRight />
            <span className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px]" style={font}>
              Data Protection
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
            {/* Left — text */}
            <div className="flex flex-col gap-[16px] w-full lg:w-[592px] shrink-0">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-black text-[36px] leading-[1.1] tracking-[-0.72px] text-center md:text-[72px] md:leading-[1.12] md:tracking-[-1.44px] lg:text-left"
                style={headingFont}
              >
                <span className="block">Your data,</span>
                <span className="block -mt-0.5 md:-mt-1">secured at every layer.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col gap-[16px] md:gap-[18px] pb-[16px] text-[#52525b] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-center lg:text-left"
                style={font}
              >
                <p>
                  At MANIFESTR, we treat the protection of customer data as a foundational obligation, not a feature.
                  Our safeguards exceed industry minimums, aligning with internationally recognized standards such as
                  SOC 2 Type II, GDPR, and CPRA.
                </p>
                <p>
                  From the moment data enters our systems, it is encrypted, access is tightly controlled, and safeguards
                  are continuously tested. This layered approach — often referred to as defense-in-depth — ensures that
                  if one security measure is challenged, additional protections stand ready.
                </p>
                <p>
                  Our customers and investors can be confident that MANIFESTR&apos;s data protection framework is both
                  resilient and compliant, designed to withstand evolving threats while respecting legal obligations.
                </p>
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
                <CldImage src={HERO_IMAGE} alt="Data protection" className="w-full h-full object-cover rounded-[12px]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Accordion Section ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] pb-9 md:pb-16">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4 md:gap-5">
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
                          MANIFESTR implements {item.title.toLowerCase()} as part of our comprehensive security
                          posture. Our approach ensures that every layer of your data is protected with
                          industry-leading practices and continuous validation.
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

      {/* ─── Compliance & Legal Alignment ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[36px] md:py-[56px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-5 md:gap-10 items-center">
          {/* Heading */}
          <motion.div {...fadeUp} className="flex flex-col gap-[12px] items-center text-center w-full">
            <h2
              className="text-black text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px]"
              style={headingFont}
            >
              Compliance &amp; Legal Alignment
            </h2>
            <p className="text-[#52525b] text-[16px] leading-[24px] max-w-[900px]" style={font}>
              Our Data Protection framework is designed not only for resilience, but also for legal compliance and
              investor assurance.
            </p>
          </motion.div>

          {/* Cards — horizontal scroll on mobile, grid on desktop */}
          <div className="w-full">
            {/* Desktop grid */}
            <div className="hidden md:flex flex-col gap-[24px] w-full">
              <div className="grid grid-cols-2 gap-[24px]">
                {COMPLIANCE_CARDS_ROW1.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="bg-white border border-[#e4e4e7] rounded-[12px] overflow-hidden flex flex-col group"
                  >
                    <div className="relative w-full h-[260px] overflow-hidden">
                      <CldImage
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                    <div className="p-[24px] flex flex-col gap-[8px]">
                      <h3 className="text-black text-[24px] leading-[32px]" style={headingFont}>{card.title}</h3>
                      <p className="text-[#18181b] text-[16px] leading-[24px]" style={font}>{card.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-[24px]">
                {COMPLIANCE_CARDS_ROW2.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="bg-white border border-[#e4e4e7] rounded-[12px] overflow-hidden flex flex-col group"
                  >
                    <div className="relative w-full h-[213px] overflow-hidden">
                      <CldImage
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-[24px] flex flex-col gap-[8px]">
                      <h3 className="text-black text-[24px] leading-[32px]" style={headingFont}>{card.title}</h3>
                      <p className="text-[#18181b] text-[16px] leading-[24px]" style={font}>{card.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile horizontal scroll */}
            <div className="relative md:hidden">
              <div
                ref={complianceScrollRef}
                className="-mx-6 w-full overflow-x-auto px-6 pb-14 scrollbar-hide"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="flex gap-[27px] w-max">
                  {[...COMPLIANCE_CARDS_ROW1, ...COMPLIANCE_CARDS_ROW2].map((card, i) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, delay: i * 0.08 }}
                      className="bg-white border border-[#e4e4e7] rounded-[12px] overflow-hidden flex flex-col group w-[315px] shrink-0"
                    >
                      <div className="relative w-full h-[207px] overflow-hidden">
                        <CldImage
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
                      </div>
                      <div className="px-[21px] py-[20px] flex flex-col gap-[12px]">
                        <h3 className="text-black text-[24px] leading-[32px]" style={headingFont}>{card.title}</h3>
                        <p className="text-[#52525b] text-[16px] leading-[24px]" style={font}>{card.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-0 right-6 z-10 flex items-center gap-2">
                <span className="pointer-events-auto">
                  <ComplianceScrollArrow
                    dir="left"
                    label="Scroll compliance cards left"
                    onClick={() => scrollCompliance(-1)}
                  />
                </span>
                <span className="pointer-events-auto">
                  <ComplianceScrollArrow
                    dir="right"
                    label="Scroll compliance cards right"
                    onClick={() => scrollCompliance(1)}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <motion.div {...fadeUp}>
            <Link
              href="/security"
              className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
              style={font}
            >
              See Our Compliance Standards
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
