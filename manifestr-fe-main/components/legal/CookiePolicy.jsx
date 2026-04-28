import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775045890/Card_2_fitqot.png'
const HERO_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775224463/Card_3_xz4ihd.png'

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-are-cookies', label: 'What Are Cookies?' },
  { id: 'types', label: 'Types of Cookies We Use' },
  { id: 'third-party', label: 'Third-Party Cookies' },
  { id: 'control', label: 'How You Can Control Cookies' },
  { id: 'retention', label: 'Data Retention & Security' },
  { id: 'transfers', label: 'Business Transfers' },
  { id: 'updates', label: 'Updates to This Policy' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'transparency', label: 'Transparency in Action' },
]

const COOKIE_TYPES = [
  {
    title: 'Essential Cookies (Strictly Necessary)',
    items: [
      'These cookies enable core functionality such as logging in, navigating the platform, and accessing secure areas.',
      'Without these, MANIFESTR cannot function properly.',
      'These cookies cannot be disabled.',
    ],
  },
  {
    title: 'Functional Cookies',
    items: [
      'These cookies remember preferences such as language or settings.',
      'They improve usability but are not strictly required.',
    ],
  },
  {
    title: 'Performance & Analytics Cookies',
    items: [
      'These cookies help us understand how MANIFESTR is used, including feature usage and performance.',
      'The data is used to improve the product experience.',
      'Where required, these cookies are only used with your consent.',
    ],
  },
  {
    title: 'Advertising & Marketing Cookies',
    items: [
      'These cookies may be used to deliver relevant content and measure campaign performance.',
      'They are disabled by default and only activated if you choose to opt in.',
    ],
  },
]

function ArrowTopRightIcon() {
  return (
    <svg className="w-[16px] h-[16px] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState('introduction')
  const sectionRefs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) {
        sectionRefs.current[s.id] = el
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const font = { fontFamily: 'Inter, sans-serif' }
  const headingFont = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }

  return (
    <>
      {/* ─── Hero — matches Terms / Privacy ─── */}
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
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Cookie </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Policy</span>
          </h1>
          <p className="text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]" style={font}>
            How MANIFESTR uses cookies and similar technologies on our platform.
          </p>
          <p className="text-[16px] leading-[24px] text-white/95" style={font}>
            Last updated: 19 March 2026
          </p>
        </motion.div>
      </section>

      {/* ─── Content ─── */}
      <section className="w-full bg-white px-6 py-[48px] md:px-[32px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex gap-[64px] items-start">

          {/* Sticky sidebar */}
          <aside className="hidden lg:flex flex-col gap-[32px] min-w-[280px] shrink-0 sticky top-[100px]">
            <div className="flex flex-col gap-[4px]">
              {SECTIONS.map((s) => {
                const isActive = activeSection === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`text-left pl-[20px] py-[10px] border-l-[3px] transition-colors ${
                      isActive
                        ? 'border-[#020617] text-[#020617] font-medium'
                        : 'border-transparent text-[#52525b]'
                    }`}
                  >
                    <span className="text-[16px] leading-[24px]" style={font}>{s.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Quick link card */}
            <div className="border border-[#e4e4e7] rounded-[16px] p-[24px] flex flex-col">
              <a href="#" className="flex items-center justify-between w-full group">
                <span className="text-[14px] leading-[22px] font-medium text-black group-hover:underline" style={font}>
                  Download Cookie Compliance Framework PDF
                </span>
                <ArrowTopRightIcon />
              </a>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col gap-[48px]" style={font}>

            {/* Introduction */}
            <div id="introduction" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                Introduction
              </h2>
              <div className="flex flex-col gap-[16px] text-[16px] leading-[24px] text-[#52525b]">
                <p>MANIFESTR uses cookies and similar technologies to ensure the platform operates securely, performs reliably, and delivers a smooth user experience.</p>
                <p>This Cookies Policy explains what cookies are, how we use them, and the choices you have in managing them.</p>
                <p>We aim to design our practices in line with applicable privacy laws, including GDPR, CPRA, and other regional requirements where relevant.</p>
                <p>We believe in transparency and control. You should always understand what is being used and have the ability to manage your preferences.</p>
              </div>
            </div>

            {/* What Are Cookies? */}
            <div id="what-are-cookies" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                What Are Cookies?
              </h2>
              <div className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[16px]">
                <p>Cookies are small text files stored on your device when you use a website or application.</p>
                <p>They help us recognise your browser, remember your preferences, and ensure the platform functions as expected.</p>
                <p>Some cookies are essential for basic operation. Others help improve performance or personalise your experience.</p>
              </div>
            </div>

            {/* Types of Cookies We Use */}
            <div id="types" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                Types of Cookies We Use
              </h2>
              <p className="text-[16px] leading-[24px] text-[#52525b]">You can choose which categories of cookies you want to allow.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                {COOKIE_TYPES.map((type) => (
                  <div key={type.title} className="border border-[#c6c8d0] md:border-[#e4e4e7] rounded-[12px] p-[14px] md:p-[24px] flex flex-col gap-[12px] md:gap-[16px]">
                    <h3 className="text-[16px] leading-[24px] font-medium text-[#1b1b1f]" style={font}>
                      {type.title}
                    </h3>
                    <div className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[14px] md:gap-0">
                      <ul className="hidden md:flex list-disc pl-[20px] flex-col gap-[8px]">
                        {type.items.map((item, i) => (
                          <li key={i} className="text-[16px] leading-[24px] text-[#52525b]">{item}</li>
                        ))}
                      </ul>
                      <div className="flex md:hidden flex-col">
                        {type.items.map((item, i) => (
                          <p key={i} className="text-[16px] leading-[24px] text-[#52525b] mb-[14px] last:mb-0">{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div id="third-party" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                Third-Party Cookies
              </h2>
              <div className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[16px]">
                <p>Some cookies may be set by trusted third-party providers that support MANIFESTR&apos;s functionality, such as infrastructure or analytics tools.</p>
                <p>These providers are expected to use data only for authorised purposes and handle it responsibly.</p>
              </div>
            </div>

            {/* How You Can Control Cookies */}
            <div id="control" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                How You Can Control Cookies
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[8px]">
                <li><span className="font-medium text-[#1b1b1f]">Cookie Preferences Panel:</span> You can adjust your preferences at any time via Manage Cookies in the footer.</li>
                <li><span className="font-medium text-[#1b1b1f]">Essential Cookies:</span> remain active as they are required for the platform to function.</li>
                <li><span className="font-medium text-[#1b1b1f]">Browser Settings:</span> Most browsers allow blocking or deleting cookies. Disabling may affect certain features.</li>
                <li><span className="font-medium text-[#1b1b1f]">Opt-Out of Marketing:</span> Opt out through the preferences panel or via unsubscribe links in communications.</li>
              </ul>
            </div>

            {/* Data Retention & Security */}
            <div id="retention" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                Data Retention &amp; Security
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[8px]">
                <li>Session cookies are deleted when you close your browser.</li>
                <li>Persistent cookies remain until they expire or are manually deleted.</li>
              </ul>
            </div>

            {/* Business Transfers */}
            <div id="transfers" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                Business Transfers
              </h2>
              <div className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[16px]">
                <p>If MANIFESTR is involved in a merger, acquisition, or sale of assets, cookie-related data may be transferred as part of that transaction.</p>
                <p>Your rights and choices will continue to apply.</p>
              </div>
            </div>

            {/* Updates to This Policy */}
            <div id="updates" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                Updates to This Policy
              </h2>
              <div className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[16px]">
                <p>We may update this Cookies Policy from time to time to reflect legal, technical, or business changes.</p>
                <p>The latest version will always be available on this page, with the updated date shown above.</p>
              </div>
            </div>

            {/* Contact Us */}
            <div id="contact" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={headingFont}>
                Contact Us
              </h2>
              <div className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[16px]">
                <p>If you have questions, concerns, or complaints regarding cookies or your privacy rights, contact us:</p>
                <p>Email: privacy@manifestr.com</p>
                <p>Mailing Address: MANIFESTR — Data Protection Office, Delaware LLC Registered Address.</p>
              </div>
            </div>

            {/* Transparency in Action (hidden in sidebar, visual anchor) */}
            <div id="transparency" className="scroll-mt-[120px]" />

            {/* Mobile download card */}
            <div className="lg:hidden border border-[#e4e4e7] rounded-[16px] p-[24px] flex flex-col">
              <a href="#" className="flex items-center justify-between w-full group">
                <span className="text-[14px] leading-[22px] font-medium text-black group-hover:underline" style={font}>
                  Download Cookie Compliance Framework PDF
                </span>
                <ArrowTopRightIcon />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
