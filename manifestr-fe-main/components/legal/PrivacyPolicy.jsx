import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775045890/Card_2_fitqot.png'
const HERO_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775224463/Card_3_xz4ihd.png'

const SECTIONS = [
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
  const [activeSection, setActiveSection] = useState('data-collect')
  const [openIds, setOpenIds] = useState({})
  const sectionRefs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const item = ACCORDION_ITEMS.find((a) => a.id === entry.target.id)
            if (item) setActiveSection(item.section)
            break
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )

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
      {/* ─── Hero ─── */}
      <section className="relative w-full h-[256px] flex flex-col items-center justify-center p-[48px] overflow-hidden">
        <CldImage src={HERO_BG_DESKTOP} alt="" className="hidden md:block absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <img src={HERO_BG_MOBILE} alt="" className="md:hidden absolute inset-0 w-full h-full object-cover pointer-events-none" loading="eager" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <h1 className="text-[36px] md:text-[72px] leading-[44px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.44px] text-white">
            <span className="md:hidden">
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Privacy</span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>{' '}Policy</span>
            </span>
            <span className="hidden md:inline">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Privacy </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Policy</span>
            </span>
          </h1>
        </motion.div>
      </section>

      {/* ─── Content ─── */}
      <section className="w-full bg-white py-[96px]">
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
                        : 'border-transparent text-[#71717a]'
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
                    className="text-[12px] leading-[18px] font-medium text-black group-hover:underline"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </span>
                  <ArrowTopRightIcon />
                </a>
              ))}
            </div>
          </aside>

          {/* Accordion content */}
          <div className="flex-1 min-w-0 flex flex-col gap-[16px]">
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
                      className="flex-1 text-[18px] leading-[28px] font-medium text-black"
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
                          className="pt-[16px] text-[16px] leading-[24px] text-[#71717a]"
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
