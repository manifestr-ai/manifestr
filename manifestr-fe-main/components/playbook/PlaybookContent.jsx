import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const CTA_BG = 'https://www.figma.com/api/mcp/asset/07e13d1a-a561-442e-b069-cc3542d5d412'

const CATEGORIES = [
  {
    icon: 'https://www.figma.com/api/mcp/asset/efd8937f-eb51-4bc3-9ab0-7817b7a3b56a',
    title: 'Knowledge Base',
    desc: 'In-depth guides and tutorials with step-by-step instructions.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/2f812ae8-9e9c-4d4a-947b-4129d987ceb6',
    title: 'Demo Videos',
    desc: 'Watch video tutorials and product walkthroughs.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/3a274eb6-5f0f-4a7b-9c10-935081a07b79',
    title: 'Glossary',
    desc: 'Understand key terms and concepts behind MANIFESTR.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/860ab764-d8a7-402e-9ccd-2b96d1577870',
    title: 'Product Updates',
    desc: 'Stay updated with the latest features and improvements.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/7cfacc89-b7ff-4cf2-8eff-2d6d06d78526',
    title: 'FAQs',
    desc: 'Find quick answers to commonly asked questions.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/6eef9ff5-8d0d-4cf2-b76f-e310bf248201',
    title: 'Submit a Ticket',
    desc: 'Get personalized help from our support team.',
  },
]

const ARTICLES = [
  {
    category: 'Getting Started',
    title: 'Getting Started with MANIFESTR',
    desc: 'Everything you need to know to set up your first project and start collaborating.',
    readTime: '5min read',
  },
  {
    category: 'Collaboration',
    title: 'Advanced Collaboration Features',
    desc: 'Learn how to maximize productivity with powerful collaboration Toolkit.',
    readTime: '7 min read',
  },
  {
    category: 'Design',
    title: 'Design System Best Practices',
    desc: 'Create consistent and scalable design systems that grow with your product.',
    readTime: '6 min read',
  },
  {
    category: 'Integration',
    title: 'API Integration Guide',
    desc: 'Connect MANIFESTR with your existing Toolkit and workflows.',
    readTime: '8 min read',
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

const ARROW_ICON = 'https://www.figma.com/api/mcp/asset/64b2abec-a1a6-47ea-bd93-ebbd098ca0fd'

function ArrowUpRight() {
  return (
    <svg className="w-[32px] h-[32px] text-[#18181b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )
}

function PopularQuestions() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section className="w-full px-6 md:px-[112px] py-[96px]">
      <div className="flex flex-col gap-[32px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[36px] md:text-[48px] leading-tight md:leading-[60px] tracking-[-0.96px] text-black"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Popular </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>questions?</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          {QUESTIONS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="bg-white border border-[#e5e7eb] rounded-[12px] p-[24px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:shadow-md transition-shadow overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-left gap-[16px]"
                >
                  <span
                    className="text-[20px] md:text-[24px] leading-[32px] text-black"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {item.q}
                  </span>
                  <svg
                    className={`w-[20px] h-[20px] text-[#18181b] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                        className="text-[16px] leading-[24px] text-[#52525b] mt-[16px] pt-[16px] border-t border-[#e5e7eb]"
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
  return (
    <>
      {/* Browse by Category */}
      <section className="w-full bg-[#e9e9ea] px-6 md:px-[112px] py-[96px]">
        <div className="flex flex-col gap-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[48px] leading-tight md:leading-[60px] tracking-[-0.96px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Browse by </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Category</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {CATEGORIES.map((cat, i) => {
              const href = cat.title === 'Knowledge Base' ? '/playbook/knowledge-base'
                : cat.title === 'Submit a Ticket' ? '/contact'
                : '#'
              return (
                <Link key={cat.title} href={href} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white border border-[#e5e7eb] rounded-[12px] p-[24px] flex flex-col gap-[40px] items-start shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:shadow-md transition-shadow text-left h-full"
                  >
                    <img src={cat.icon} alt="" className="w-[40px] h-[40px]" />
                    <div className="flex flex-col gap-[12px] w-full">
                      <div className="flex items-center justify-between w-full">
                        <h3
                          className="text-[24px] leading-[32px] text-black"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                        >
                          {cat.title}
                        </h3>
                        <img src={ARROW_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
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
      <section className="w-full px-6 md:px-[112px] py-[96px]">
        <div className="flex flex-col gap-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[48px] leading-tight md:leading-[60px] tracking-[-0.96px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Popular </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Articles</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
            {ARTICLES.map((article, i) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[#f4f4f4] border-b border-[#e2e8f0] rounded-[16px] overflow-hidden p-[32px] flex items-center gap-[16px] group hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex-1 flex flex-col gap-[32px]">
                  <div className="flex flex-col gap-[16px]">
                    <span
                      className="self-start bg-white border border-[#d9d9d9] rounded-full px-[16px] py-[6px] text-[14px] leading-[1.65] font-semibold text-[#6c6c6c] tracking-[-0.42px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {article.category}
                    </span>
                    <div className="flex flex-col gap-[8px]">
                      <h3
                        className="text-[20px] leading-[28px] font-bold text-[#1e293b] tracking-[-0.2px]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {article.title}
                      </h3>
                      <p
                        className="text-[16px] leading-[1.6] text-[#475569]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {article.desc}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[14px] leading-[20px] font-medium text-[#1e293b] tracking-[-0.084px]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {article.readTime}
                  </span>
                </div>
                <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center shrink-0">
                  <ArrowUpRight />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions (FAQ Accordion) */}
      <PopularQuestions />

      {/* Need More Help CTA */}
      <section className="w-full relative h-[380px] md:h-[414px] overflow-hidden">
        <img src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-[30px] px-6 text-center">
            <div className="flex flex-col items-center gap-[16px]">
              <h2 className="text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-1.2px] text-black">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p className="text-[16px] leading-[24px] text-[#52525b] max-w-[603px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {"Can't find what you're looking for? Our support team is here to help you succeed with MANIFESTR."}
              </p>
            </div>
            <Link
              href="/contact"
              className="h-[44px] px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors"
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
