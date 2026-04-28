import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'
import SubmitTicketModal from './SubmitTicketModal'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775044715/Frame_2_m5ahej.png'
const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'
const HELP_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

const TAG_STYLES = {
  New: { bg: '#f0fdf4', color: '#008236' },
  Improved: { bg: '#eff6ff', color: '#1447e6' },
  Fixed: { bg: '#faf5ff', color: '#8200db' },
  'Coming Soon': { bg: '#fff7ed', color: '#ca3500' },
}

const FILTER_TABS = [
  { id: 'all', label: 'All Updates' },
  { id: 'New', label: 'New' },
  { id: 'Improved', label: 'Improved' },
  { id: 'Fixed', label: 'Fixed' },
  { id: 'Coming Soon', label: 'Coming Soon' },
]

function FilterIconNew({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <g clipPath="url(#pu-updates-icon-new)">
        <path
          d="M7.34496 1.87629C7.37353 1.72336 7.45468 1.58524 7.57436 1.48584C7.69404 1.38644 7.84472 1.33203 8.00029 1.33203C8.15587 1.33203 8.30655 1.38644 8.42623 1.48584C8.54591 1.58524 8.62706 1.72336 8.65563 1.87629L9.35629 5.58163C9.40606 5.84506 9.53408 6.08737 9.72365 6.27694C9.91322 6.46651 10.1555 6.59453 10.419 6.64429L14.1243 7.34496C14.2772 7.37353 14.4154 7.45468 14.5147 7.57436C14.6141 7.69404 14.6686 7.84472 14.6686 8.00029C14.6686 8.15587 14.6141 8.30655 14.5147 8.42623C14.4154 8.54591 14.2772 8.62706 14.1243 8.65563L10.419 9.35629C10.1555 9.40606 9.91322 9.53408 9.72365 9.72365C9.53408 9.91322 9.40606 10.1555 9.35629 10.419L8.65563 14.1243C8.62706 14.2772 8.54591 14.4154 8.42623 14.5147C8.30655 14.6141 8.15587 14.6686 8.00029 14.6686C7.84472 14.6686 7.69404 14.6141 7.57436 14.5147C7.45468 14.4154 7.37353 14.2772 7.34496 14.1243L6.64429 10.419C6.59453 10.1555 6.46651 9.91322 6.27694 9.72365C6.08737 9.53408 5.84506 9.40606 5.58163 9.35629L1.87629 8.65563C1.72336 8.62706 1.58524 8.54591 1.48584 8.42623C1.38644 8.30655 1.33203 8.15587 1.33203 8.00029C1.33203 7.84472 1.38644 7.69404 1.48584 7.57436C1.58524 7.45468 1.72336 7.37353 1.87629 7.34496L5.58163 6.64429C5.84506 6.59453 6.08737 6.46651 6.27694 6.27694C6.46651 6.08737 6.59453 5.84506 6.64429 5.58163L7.34496 1.87629Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M13.332 1.33203V3.9987" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.6667 2.66797H12" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="pu-updates-icon-new">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function FilterIconImproved({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <g clipPath="url(#pu-updates-icon-improved)">
        <path
          d="M9.79901 4.20116C9.67686 4.32578 9.60844 4.49332 9.60844 4.66783C9.60844 4.84233 9.67686 5.00987 9.79901 5.13449L10.8657 6.20116C10.9903 6.32331 11.1578 6.39173 11.3323 6.39173C11.5068 6.39173 11.6744 6.32331 11.799 6.20116L13.8697 4.13116C14.083 3.91649 14.445 3.98449 14.525 4.27649C14.7264 5.00907 14.715 5.78387 14.4922 6.51022C14.2693 7.23657 13.8442 7.88443 13.2666 8.37798C12.689 8.87154 11.9827 9.19038 11.2305 9.2972C10.4783 9.40402 9.7112 9.2944 9.01901 8.98116L3.74568 14.2545C3.48046 14.5196 3.12078 14.6685 2.74577 14.6685C2.37076 14.6684 2.01114 14.5194 1.74601 14.2542C1.48088 13.9889 1.33197 13.6293 1.33203 13.2543C1.33209 12.8792 1.48113 12.5196 1.74634 12.2545L7.01968 6.98116C6.70644 6.28897 6.59681 5.52188 6.70363 4.76966C6.81045 4.01744 7.12929 3.31119 7.62285 2.73357C8.11641 2.15595 8.76426 1.73083 9.49061 1.50798C10.217 1.28512 10.9918 1.27374 11.7243 1.47516C12.0163 1.55516 12.0843 1.91649 11.8703 2.13116L9.79901 4.20116Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="pu-updates-icon-improved">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function FilterIconFixed({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <g clipPath="url(#pu-updates-icon-fixed)">
        <path d="M8 13.332V7.33203" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9.33333 4.66797C10.0406 4.66797 10.7189 4.94892 11.219 5.44902C11.719 5.94911 12 6.62739 12 7.33464V9.33464C12 10.3955 11.5786 11.4129 10.8284 12.1631C10.0783 12.9132 9.06087 13.3346 8 13.3346C6.93913 13.3346 5.92172 12.9132 5.17157 12.1631C4.42143 11.4129 4 10.3955 4 9.33464V7.33464C4 6.62739 4.28095 5.94911 4.78105 5.44902C5.28115 4.94892 5.95942 4.66797 6.66667 4.66797H9.33333Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.41406 2.58536L10.6674 1.33203" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M14.0009 13.9987C14.0017 13.3129 13.7382 12.6531 13.2652 12.1565C12.7922 11.6599 12.146 11.3646 11.4609 11.332"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9995 3.33203C13.9987 3.9868 13.7571 4.6184 13.3206 5.10649C12.8842 5.59458 12.2834 5.90504 11.6328 5.9787"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14.6667 8.66797H12" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M2 13.9987C1.99923 13.3129 2.26273 12.6531 2.73575 12.1565C3.20877 11.6599 3.85494 11.3646 4.54 11.332"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 3.33203C2.00075 3.9868 2.24238 4.6184 2.67883 5.10649C3.11528 5.59458 3.71605 5.90504 4.36667 5.9787"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M3.9987 8.66797H1.33203" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.33203 1.33203L6.58536 2.58536" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M6 4.75333V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2C8.53043 2 9.03914 2.21071 9.41421 2.58579C9.78929 2.96086 10 3.46957 10 4V4.75333"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="pu-updates-icon-fixed">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function FilterIconComingSoon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <g clipPath="url(#pu-updates-icon-soon)">
        <path d="M8 4V8L10.6667 9.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M7.9987 14.6654C11.6806 14.6654 14.6654 11.6806 14.6654 7.9987C14.6654 4.3168 11.6806 1.33203 7.9987 1.33203C4.3168 1.33203 1.33203 4.3168 1.33203 7.9987C1.33203 11.6806 4.3168 14.6654 7.9987 14.6654Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="pu-updates-icon-soon">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

const FILTER_TAB_ICONS = {
  New: FilterIconNew,
  Improved: FilterIconImproved,
  Fixed: FilterIconFixed,
  'Coming Soon': FilterIconComingSoon,
}

const UPDATES = [
  {
    tag: 'New',
    date: 'January 18, 2025',
    title: 'AI-Powered Design Suggestions',
    desc: 'Introducing intelligent design recommendations powered by advanced AI. Get contextual suggestions for layouts, color schemes, and component usage as you work.',
  },
  {
    tag: 'New',
    date: 'January 15, 2025',
    title: 'Enhanced Collaboration Features',
    desc: "Real-time collaboration is now faster and more reliable. We've improved cursor tracking, reduced latency, and added better conflict resolution.",
  },
  {
    tag: 'New',
    date: 'January 12, 2025',
    title: 'Dark Mode Performance',
    desc: 'Resolved issues with dark mode rendering on certain displays. The interface now maintains consistent colors across all screen types.',
  },
  {
    tag: 'Coming Soon',
    date: 'Coming in February 2025',
    title: 'Advanced Animation Toolkit',
    desc: 'Create complex animations with our new timeline editor. Features include keyframe control, easing curves, and motion path editing.',
  },
]

function ArrowUpRight() {
  return (
    <svg className="w-[24px] h-[24px] text-[#33324c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )
}

export default function ProductUpdates() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [email, setEmail] = useState('')
  const [ticketModalOpen, setTicketModalOpen] = useState(false)

  const filtered = activeFilter === 'all'
    ? UPDATES
    : UPDATES.filter((u) => u.tag === activeFilter)

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="w-full bg-white border-t border-b border-[#e5e7eb] px-6 md:px-[80px]">
        <div className="flex items-center gap-[8px] h-[54px]">
          <Link
            href="/playbook"
            className="text-[14px] leading-[21px] text-[#52525b] hover:underline"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Playbook
          </Link>
          <svg className="w-[16px] h-[16px] text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="text-[14px] leading-[21px] font-medium text-[#18181b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Product Updates
          </span>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden px-6 md:h-[518px] md:px-[80px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <CldImage
            src={HERO_BG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center md:object-top"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex w-full max-w-[560px] flex-col items-center gap-6 md:gap-8"
        >
          <div className="flex flex-col items-center gap-5 text-center md:gap-6">
            <h1 className="text-center text-[36px] leading-[1.1] tracking-[-0.72px] text-white md:text-[72px] md:leading-[90px] md:tracking-[-1.44px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Product </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Updates</span>
            </h1>
            <p
              className="text-center text-[16px] leading-[24px] text-white md:text-[18px] md:leading-[28px]"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            >
              {"See what's new, improved, and coming soon in MANIFESTR."}
            </p>
          </div>

          <Link
            href="/signup"
            className="h-[44px] px-[24px] rounded-[6px] bg-white text-[#0d0d0d] text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Enter MANIFESTR
          </Link>
        </motion.div>
      </section>

      {/* ─── Tabs ─── */}
      <PlaybookTabs />

      {/* ─── Updates Section ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[32px] md:py-[96px]">
        <div className="flex flex-col gap-[32px]">

          {/* Filter pills — scrollable on mobile, wrapping on desktop */}
          <div className="overflow-x-auto md:overflow-x-visible -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex items-center gap-[8px] md:flex-wrap w-max md:w-auto">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.id
                const Icon = FILTER_TAB_ICONS[tab.id]
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`h-[39px] px-4 rounded-[20px] text-[14px] leading-[21px] font-medium flex items-center gap-[6px] transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#18181b] text-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]'
                        : 'bg-white border border-[#e5e7eb] text-[#3f3f46] hover:bg-[#f4f4f5]'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {Icon ? <Icon className="shrink-0 size-4" /> : null}
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Update cards */}
          <div className="flex flex-col gap-[24px]">
            {filtered.map((update, i) => {
              const badge = TAG_STYLES[update.tag] || TAG_STYLES['New']
              return (
                <motion.div
                  key={update.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="w-full flex flex-col items-start gap-[12px] rounded-[16px] border-b border-[#e2e8f0] bg-[#f4f4f4] px-[12px] py-[24px] md:px-[24px]"
                >
                  {/* Tag + date */}
                  <div className="flex items-center gap-[12px] flex-wrap">
                    <span
                      className="px-[12px] py-[6px] rounded-[12px] text-[12px] leading-[18px] font-medium"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {update.tag}
                    </span>
                    <span className="w-[6px] h-[6px] rounded-full bg-[#cbd5e1] shrink-0" />
                    <span
                      className="text-[15px] md:text-[16px] leading-[22px] font-semibold text-[#475569] tracking-[-0.105px] md:tracking-[-0.112px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {update.date}
                    </span>
                  </div>

                  {/* Title + description */}
                  <div className="flex flex-col gap-[12px] w-full">
                    <h3
                      className="text-[24px] leading-[32px] tracking-[-0.288px] text-[#1e293b]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                    >
                      {update.title}
                    </h3>
                    <p
                      className="text-[16px] leading-[1.6] text-[#475569]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {update.desc}
                    </p>
                  </div>

                  {/* Read More */}
                  <button className="flex items-center gap-[12px] mt-[4px] hover:opacity-70 transition-opacity">
                    <span
                      className="text-[18px] leading-[24px] font-bold text-[#33324c] tracking-[-0.144px]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Read More
                    </span>
                    <ArrowUpRight />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Need More Help? (mobile) ─── */}
      <section className="md:hidden w-full pt-[48px]">
        <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden">
          <CldImage src={HELP_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center gap-[24px] px-6 text-center"
          >
            <div className="flex flex-col items-center gap-[12px]">
              <h2
                className="text-[32px] leading-[48px] tracking-[-0.8px] text-black"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
              >
                Need More Help?
              </h2>
              <p
                className="text-[16px] leading-[24px] text-black max-w-[316px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {"Can't find what you're looking for? Our support team is here to help you succeed with MANIFESTR."}
              </p>
            </div>
            <button
              onClick={() => setTicketModalOpen(true)}
              className="h-[36px] px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Submit a Support Ticket
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── Stay in the Know (desktop) ─── */}
      <section className="relative hidden h-[414px] w-full overflow-hidden md:block">
        <CldImage src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-[30px] px-6 text-center"
          >
            <div className="flex flex-col items-center gap-[16px]">
              <h2 className="text-[60px] leading-[72px] tracking-[-1.2px] text-black">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>STAY IN THE </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>KNOW</span>
              </h2>
              <p
                className="text-[16px] leading-[24px] text-[#52525b] max-w-[603px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                No spam. No filler. Updates,
                <br />
                events, and releases only when they matter.
              </p>
            </div>
            <div className="flex gap-[12px] items-center w-full max-w-[500px]">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-[50px] rounded-[8px] border-1 border-[#8f8f8f] bg-white px-[16px] text-[16px] font-medium text-[#18181b] placeholder:text-[#71717a] outline-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                type="button"
                className="inline-flex h-[50px] shrink-0 items-center justify-center rounded-[6px] bg-[#18181b] px-[16px] text-[14px] font-medium leading-[20px] tracking-wide text-white transition-colors hover:bg-[#27272a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                STAY INFORMED
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Submit Ticket Modal ─── */}
      <SubmitTicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />
    </>
  )
}
