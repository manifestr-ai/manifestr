import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

const CATEGORIES = [
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039012/Icon_ekljj3.svg',
    title: 'Knowledge Base',
    desc: 'In-depth guides and tutorials with step-by-step instructions.',
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039011/Icon-1_bkl06y.svg',
    title: 'Demo Videos',
    desc: 'Watch video tutorials and product walkthroughs.',
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039011/Icon-2_tohkp0.svg',
    title: 'Glossary',
    desc: 'Understand key terms and concepts behind MANIFESTR.',
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039012/Icon-3_orpp8j.svg',
    title: 'Product Updates',
    desc: 'Stay updated with the latest features and improvements.',
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039012/Icon-4_nljmwg.svg',
    title: 'FAQs',
    desc: 'Find quick answers to commonly asked questions.',
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039012/Icon-5_rwqfag.svg',
    title: 'Submit a Ticket',
    desc: 'Get personalized help from our support team.',
  },
]

const CATEGORY_ROUTES = {
  'Knowledge Base': '/playbook/knowledge-base',
  'Demo Videos': '/playbook/demo-videos',
  'Glossary': '/playbook/glossary',
  'Product Updates': '/playbook/product-updates',
  'FAQs': '/playbook/faqs',
  'Submit a Ticket': '/playbook/submit-ticket',
}

const ARTICLES = [
  {
    category: 'Getting Started',
    title: 'Getting Started with MANIFESTR',
    desc: 'Everything you need to know to set up your first project and start collaborating.',
    readTime: '5min read',
    href: '/playbook/getting-started',
  },
  {
    category: 'Collaboration',
    title: 'Advanced Collaboration Features',
    desc: 'Learn how to maximize productivity with powerful collaboration Toolkit.',
    readTime: '7 min read',
    href: '/playbook/knowledge-base?q=collaboration',
  },
  {
    category: 'Design',
    title: 'Design System Best Practices',
    desc: 'Create consistent and scalable design systems that grow with your product.',
    readTime: '6 min read',
    href: '/playbook/knowledge-base?q=design',
  },
  {
    category: 'Integration',
    title: 'API Integration Guide',
    desc: 'Connect MANIFESTR with your existing Toolkit and workflows.',
    readTime: '8 min read',
    href: '/playbook/knowledge-base?q=integration',
  },
]

const QUESTIONS = [
  {
    q: 'What Toolkit are included in MANIFESTR?',
    a: 'MANIFESTR includes The Deck (Slides), The Briefcase (Docs), Design Studio (Images/Assets), Analyzer (Data Viz), Cost CTRL (Budgets), The Strategist (Insights), Wordsmith (Copywriting), and The Huddle (Meetings).',
  },
  {
    q: 'Can I use my own branding in MANIFESTR?',
    a: 'Yes! With Pro and Elite plans, you can upload your brand style guide, custom templates, fonts, and color palettes. All your outputs will be automatically styled to match your brand identity.',
  },
  {
    q: 'How do Wins (tokens) work?',
    a: 'Wins are action credits that power your MANIFESTR toolkit. Each time you generate content, run an AI analysis, or complete a key workflow action, it uses a Win. Different plans include different monthly allocations.',
  },
  {
    q: 'How do I invite my team or clients?',
    a: 'Navigate to your workspace settings and click "Invite Members." You can invite teammates via email and assign roles like Admin, Editor, or Viewer. Client access can be managed through shared links with custom permissions.',
  },
  {
    q: 'What file types can I export?',
    a: 'MANIFESTR supports exports in PDF, PPTX, DOCX, PNG, SVG, CSV, and XLSX formats. Pro and Elite plans unlock additional export options including branded templates and scheduled automated exports.',
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach our support team via the in-app chat widget, by emailing support@manifestr.com, or by submitting a support ticket through the Playbook. Pro and Elite plans include priority support with faster response times.',
  },
]

const ARROW_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775040840/Icon_nwtl3f.svg'

function ArrowUpRight() {
  return (
    <svg className="w-[32px] h-[32px] text-[#18181b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )
}

function CategoryArrow({ dir, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e4e4e7] bg-white text-[#18181b] shadow-sm transition-colors hover:bg-[#f4f4f5]"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        {dir === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  )
}

function PopularQuestions() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section className="w-full px-6 md:px-[112px] pt-[16px] md:pt-[32px] pb-[32px] md:pb-[96px]">
      <div className="flex flex-col gap-[16px] md:gap-[32px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[36px] md:text-left md:text-[48px] leading-[44px] md:leading-[60px] tracking-[-0.72px] md:tracking-[-0.96px] text-black"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Popular </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>questions?</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[32px]">
          {QUESTIONS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] md:p-[24px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:shadow-md transition-shadow overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-left gap-[16px]"
                >
                  <span
                    className="text-[16px] md:text-[24px] leading-[24px] md:leading-[32px] text-black"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {item.q}
                  </span>
                  <svg
                    className={`w-[20px] h-[20px] text-[#18181b] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p
                        className="text-[14px] md:text-[16px] leading-[21px] md:leading-[24px] text-[#52525b] mt-[12px] md:mt-[16px] pt-[12px] md:pt-[16px] border-t border-[#e5e7eb]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function PlaybookContent() {
  const categoryScrollRef = useRef(null)
  const scrollCategories = (dir) => {
    categoryScrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <>
      {/* Browse by Category */}
      <section className="w-full bg-[#e9e9ea] px-6 md:px-[112px] py-[32px] md:py-[96px]">
        <div className="flex flex-col gap-[16px] md:gap-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[36px] md:text-left md:text-[48px] leading-[44px] md:leading-[60px] tracking-[-0.72px] md:tracking-[-0.96px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Browse by </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Category</span>
          </motion.h2>

          {/* Mobile: horizontal scroll + arrows (bottom-right, no overlays) */}
          <div className="relative md:hidden">
            <div
              ref={categoryScrollRef}
              className="flex gap-[24px] overflow-x-auto scrollbar-hide -mx-6 px-6 pb-14"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
            {CATEGORIES.map((cat, i) => {
              const href = CATEGORY_ROUTES[cat.title] || '#'
              return (
                <Link key={cat.title} href={href} className="block shrink-0 w-[280px]">
                  <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[24px] flex flex-col gap-[40px] items-start shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] text-left h-full">
                    <CldImage src={cat.icon} alt="" className="w-[40px] h-[40px]" />
                    <div className="flex flex-col gap-[12px] w-full">
                      <div className="flex items-center justify-between w-full">
                        <h3
                          className="text-[20px] leading-[28px] text-black"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                        >
                          {cat.title}
                        </h3>
                        <CldImage src={ARROW_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
                      </div>
                      <p className="text-[14px] leading-[20px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
            </div>
            <div className="pointer-events-none absolute bottom-0 right-6 z-10 flex items-center gap-2">
              <span className="pointer-events-auto">
                <CategoryArrow dir="left" label="Scroll categories left" onClick={() => scrollCategories(-1)} />
              </span>
              <span className="pointer-events-auto">
                <CategoryArrow dir="right" label="Scroll categories right" onClick={() => scrollCategories(1)} />
              </span>
            </div>
          </div>

          {/* Desktop: 3-col grid */}
          <div className="hidden md:grid grid-cols-3 gap-[24px]">
            {CATEGORIES.map((cat, i) => {
              const href = CATEGORY_ROUTES[cat.title] || '#'
              return (
                <Link key={cat.title} href={href} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white border border-[#e5e7eb] rounded-[12px] p-[24px] flex flex-col gap-[40px] items-start shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:shadow-md transition-shadow text-left h-full"
                  >
                    <CldImage src={cat.icon} alt="" className="w-[40px] h-[40px]" />
                    <div className="flex flex-col gap-[12px] w-full">
                      <div className="flex items-center justify-between w-full">
                        <h3
                          className="text-[24px] leading-[32px] text-black"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                        >
                          {cat.title}
                        </h3>
                        <CldImage src={ARROW_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
                      </div>
                      <p className="text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {cat.desc}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="w-full px-6 md:px-[112px] pt-[28px] md:pt-[96px] pb-[16px] md:pb-[32px]">
        <div className="flex flex-col gap-[16px] md:gap-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[36px] md:text-left md:text-[48px] leading-[44px] md:leading-[60px] tracking-[-0.72px] md:tracking-[-0.96px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Popular </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Articles</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[32px]">
            {ARTICLES.map((article, i) => (
              <Link key={article.title} href={article.href} className="block">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[#f4f4f4] border-b border-[#e2e8f0] rounded-[16px] overflow-hidden p-[20px] md:p-[32px] flex items-center gap-[16px] group hover:shadow-md transition-shadow cursor-pointer h-full"
              >
                <div className="flex-1 flex flex-col gap-[20px] md:gap-[32px]">
                  <div className="flex flex-col gap-[12px] md:gap-[16px]">
                    <span
                      className="self-start bg-white border border-[#d9d9d9] rounded-full px-[12px] md:px-[16px] py-[4px] md:py-[6px] text-[12px] md:text-[14px] leading-[1.65] font-semibold text-[#6c6c6c] tracking-[-0.42px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {article.category}
                    </span>
                    <div className="flex flex-col gap-[6px] md:gap-[8px]">
                      <h3
                        className="text-[18px] md:text-[20px] leading-[24px] md:leading-[28px] font-bold text-[#1e293b] tracking-[-0.2px]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {article.title}
                      </h3>
                      <p
                        className="text-[14px] md:text-[16px] leading-[1.6] text-[#475569]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {article.desc}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[12px] md:text-[14px] leading-[18px] md:leading-[20px] font-medium text-[#1e293b] tracking-[-0.084px]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {article.readTime}
                  </span>
                </div>
                <div className="w-[48px] md:w-[64px] h-[48px] md:h-[64px] rounded-full flex items-center justify-center shrink-0" aria-hidden>
                  <ArrowUpRight />
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions (FAQ Accordion) */}
      <PopularQuestions />

      {/* Need More Help CTA — darker section scrim + legible dark body copy */}
      <section className="relative h-[380px] w-full overflow-hidden md:h-[414px]">
        <CldImage src={CTA_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative z-10 flex w-full max-w-[640px] flex-col items-center gap-4 rounded-[16px] px-6 py-7 text-center md:max-w-[720px] md:gap-6 md:px-10 md:py-9">
            <div className="flex flex-col items-center gap-4 md:gap-[16px]">
              <h2 className="text-[36px] leading-tight text-black md:text-[60px] md:leading-[72px] md:tracking-[-1.2px]">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p
                className="max-w-[603px] text-[16px] leading-[24px] text-[#52525b]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {"Can't find what you're looking for?"}
                <br className="md:hidden" />{' '}
                Our support team is here to help you succeed with MANIFESTR.
              </p>
            </div>
            <Link
              href="/playbook/submit-ticket"
              className="inline-flex h-[44px] items-center justify-center rounded-[6px] bg-[#18181b] px-[16px] text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#27272a]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Submit a Support Ticket
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
