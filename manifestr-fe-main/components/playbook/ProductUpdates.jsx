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
      <section className="relative w-full h-[415px] md:h-[518px] flex items-center justify-center px-6 md:px-[80px] py-[48px] md:py-[96px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <CldImage
            src={HERO_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center md:object-top"
          />
          <div className="absolute inset-0 bg-black/20 md:bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-[25px] md:gap-[32px] w-full max-w-[342px] md:max-w-[510px]"
        >
          <div className="flex flex-col items-center gap-[20px] text-center">
            <h1 className="text-[36px] md:text-[72px] leading-[normal] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] text-white">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Product </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Updates</span>
            </h1>
            <p
              className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-white"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                textShadow: '0px 3px 19.8px black',
              }}
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
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`h-[39px] px-[16px] rounded-[20px] text-[14px] leading-[21px] font-medium flex items-center gap-[8px] transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#18181b] text-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]'
                        : 'bg-white border border-[#e5e7eb] text-[#3f3f46] hover:bg-[#f4f4f5]'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
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
                  className="bg-white border border-[#e2e8f0] rounded-[16px] px-[12px] md:px-[24px] py-[24px] flex flex-col gap-[12px] items-start w-full"
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
        <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: 358 }}>
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
      <section className="hidden md:block w-full relative h-[414px] overflow-hidden">
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
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Stay in the </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>know</span>
              </h2>
              <p
                className="text-[16px] leading-[24px] text-[#52525b] max-w-[603px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                No spam. No filler.<br />
                Updates, events, and releases only when they matter.
              </p>
            </div>
            <div className="flex gap-[12px] items-center w-full max-w-[500px]">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-[50px] border-2 border-[#18181b] rounded-[8px] px-[16px] text-[16px] font-semibold text-black placeholder:text-black outline-none bg-transparent"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                className="h-[50px] px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors shrink-0"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Stay informed
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
