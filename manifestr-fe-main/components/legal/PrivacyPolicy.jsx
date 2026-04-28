import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775045890/Card_2_fitqot.png'
const HERO_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775224463/Card_3_xz4ihd.png'

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'data-collect', label: 'Data We Collect' },
  { id: 'how-use', label: 'How We Use Data' },
  { id: 'sharing', label: 'Sharing & Third Parties' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'rights', label: 'User Rights' },
  { id: 'children', label: "Children's Privacy" },
  { id: 'cookies', label: 'Cookie Preferences' },
  { id: 'contact', label: 'Contact' },
  { id: 'updates', label: 'Updates' },
]

const QUICK_LINKS = [
  { label: 'Download Privacy Pack', href: '#' },
  { label: 'See Trust Center', href: '#' },
  { label: 'Manage Cookies', href: '#' },
]

const ACCORDION_ITEMS = [
  {
    id: 'built-in',
    section: 'data-collect',
    title: 'Privacy is built into everything we do.',
    content: 'At MANIFESTR, we design our platform and processes with privacy at the core. We collect only the data we need to deliver, improve, and personalise our Services. This includes information you provide directly (such as your name, email, and billing details), data generated through your use of the platform (such as usage logs, device information, and interaction patterns), and information from third-party integrations you choose to connect.',
  },
  {
    id: 'built-in-2',
    section: 'data-collect',
    title: 'Privacy is built into everything we do.',
    content: 'We are committed to transparent data practices. Every feature, tool, and process at MANIFESTR is built with data minimisation in mind — we only collect what is necessary and handle it responsibly.',
  },
  {
    id: 'how-use-info',
    section: 'how-use',
    title: 'How we use your information.',
    content: 'We use the data we collect to operate and improve the Services, process transactions, personalise your experience, communicate updates and support information, ensure platform security, and comply with legal obligations. We may also use aggregated, anonymised data for analytics and product development.',
  },
  {
    id: 'sharing-data',
    section: 'sharing',
    title: 'Who we share data with... and why.',
    content: 'We do not sell your personal data. We may share information with trusted service providers who help us operate the platform (such as cloud hosting, payment processors, and analytics providers), when required by law or to protect our legal rights, or in connection with a merger, acquisition, or sale of assets. Any third-party service providers are contractually bound to handle your data securely and only for the purposes we specify.',
  },
  {
    id: 'keep-data',
    section: 'retention',
    title: 'How long we keep your data.',
    content: 'We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymise it.',
  },
  {
    id: 'your-rights',
    section: 'rights',
    title: 'Your privacy rights.',
    content: 'Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal data. You may also have the right to object to or restrict certain processing activities. To exercise any of these rights, please contact us at privacy@manifestr.com. We will respond within the timeframe required by applicable law.',
  },
  {
    id: 'children-eligibility',
    section: 'children',
    title: "Children's privacy and eligibility.",
    content: 'MANIFESTR is not intended for use by individuals under the age of 18 (or the applicable age of majority in your jurisdiction). We do not knowingly collect personal data from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.',
  },
  {
    id: 'cookie-choices',
    section: 'cookies',
    title: 'Your cookie choices.',
    content: 'We use cookies and similar technologies to improve your experience, analyse usage patterns, and support marketing efforts. You can manage your cookie preferences at any time through our cookie settings panel. Essential cookies that are necessary for the platform to function cannot be disabled.',
  },
  {
    id: 'contact-privacy',
    section: 'contact',
    title: 'Contact us about your privacy.',
    content: 'If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: MANIFESTR LLC — Email: privacy@manifestr.com. We are committed to resolving any privacy-related issues promptly and transparently.',
  },
  {
    id: 'policy-updates',
    section: 'updates',
    title: 'Policy updates.',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you via email or through the platform. Continued use of the Services after changes take effect constitutes your acceptance of the updated policy.',
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

function ArrowTopRightIcon() {
  return (
    <svg className="w-[16px] h-[16px] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction')
  const [openIds, setOpenIds] = useState({})
  const sectionRefs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (entry.target.id === 'introduction') {
              setActiveSection('introduction')
              break
            }
            const item = ACCORDION_ITEMS.find((a) => a.id === entry.target.id)
            if (item) setActiveSection(item.section)
            break
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )

    const introEl = document.getElementById('introduction')
    if (introEl) observer.observe(introEl)

    ACCORDION_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) {
        sectionRefs.current[item.id] = el
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  function scrollToSection(sectionId) {
    if (sectionId === 'introduction') {
      document.getElementById('introduction')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const item = ACCORDION_ITEMS.find((a) => a.section === sectionId)
    if (item) {
      const el = document.getElementById(item.id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function toggleAccordion(id) {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* ─── Hero — matches Terms / Cookie ─── */}
      <section className="relative flex h-[218px] w-full flex-col items-center justify-between overflow-hidden p-[48px] md:h-[256px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <CldImage src={HERO_BG_DESKTOP} alt="" className="absolute hidden h-full w-full object-cover md:block" />
          <CldImage src={HERO_BG_MOBILE} alt="" className="absolute h-full w-full object-cover md:hidden" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 55.86%, rgba(0,0,0,0.3) 100%)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex max-w-[342px] flex-col items-center gap-[18px] text-center text-white md:max-w-[551px] md:gap-[11px]"
        >
          <h1 className="text-[36px] leading-[44px] tracking-[-0.72px] text-white md:text-[72px] md:leading-[90px] md:tracking-[-1.44px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Privacy </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Policy</span>
          </h1>
          <p className="text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            How MANIFESTR collects, uses, stores, and protects your personal information.
          </p>
          <p className="text-[16px] leading-[24px] text-white/95" style={{ fontFamily: 'Inter, sans-serif' }}>
            Last updated: 19 March 2026
          </p>
        </motion.div>
      </section>

      {/* ─── Content ─── */}
      <section className="w-full bg-white py-[48px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex gap-[64px] items-start px-6 md:px-[32px]">

          {/* Sticky sidebar */}
          <aside className="hidden lg:flex flex-col gap-[32px] min-w-[280px] shrink-0 sticky top-[100px]">
            {/* Nav links */}
            <div className="flex flex-col gap-[4px]">
              {SECTIONS.map((s) => {
                const isActive = activeSection === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`text-left pl-[20px] py-[10px] border-l-[3px] transition-colors ${
                      isActive
                        ? 'border-[#020617] text-[#020617] font-medium'
                        : 'border-transparent text-[#52525b]'
                    }`}
                  >
                    <span
                      className="text-[16px] leading-[24px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {s.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Quick links card */}
            <div className="border border-[#e4e4e7] rounded-[16px] p-[24px] flex flex-col gap-[19px]">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between w-full group"
                >
                  <span
                    className="text-[14px] leading-[22px] font-medium text-black group-hover:underline"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </span>
                  <ArrowTopRightIcon />
                </a>
              ))}
            </div>
          </aside>

          {/* Introduction + accordions */}
          <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
            <div id="introduction" className="scroll-mt-[120px] flex flex-col gap-[20px]">
              <h2
                className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
              >
                Introduction
              </h2>
              <div className="flex flex-col gap-[16px] text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <p>
                  This Privacy Policy describes how MANIFESTR LLC (&quot;MANIFESTR,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) handles personal information when you use our websites, applications, and services (collectively, the &quot;Services&quot;).
                </p>
                <p>
                  We are committed to protecting your privacy and being transparent about our practices. By using the Services, you acknowledge that you have read and understood this policy. If you do not agree, please discontinue use of the Services.
                </p>
                <p>
                  The sections below explain what data we collect, how we use it, who we may share it with, and the choices you have. For detail on each topic, expand the corresponding section.
                </p>
              </div>
            </div>

            {ACCORDION_ITEMS.map((item) => {
              const isOpen = !!openIds[item.id]

              return (
                <div
                  key={item.id}
                  id={item.id}
                  className="scroll-mt-[120px] border border-[#c6c8d0] rounded-[12px] p-[20px]"
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex items-start gap-[24px] text-left"
                  >
                    <span
                      className="flex-1 text-[20px] leading-[28px] font-medium text-[#1b1b1f] md:text-[22px] md:leading-[32px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.title}
                    </span>
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
                        <p
                          className="pt-[16px] text-[16px] leading-[24px] text-[#52525b]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
