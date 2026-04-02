import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042697/Frame_rbbkjw.png'
const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'


const CATEGORIES = [
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042546/Vector_som3d2.svg',
    title: 'Getting Started',
    desc: 'Learn the basics of MANIFESTR',
    articles: 12,
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042547/Icon_lekrzl.svg',
    title: 'Collaboration',
    desc: 'Team workflows and features',
    articles: 15,
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042548/Icon-1_bt0ram.svg',
    title: 'Design',
    desc: 'Design system and styling',
    articles: 18,
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042547/Vector-1_qcgk8c.svg',
    title: 'Integration',
    desc: 'Connect with other Toolkit',
    articles: 10,
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042548/Icon-2_ur5jgr.svg',
    title: 'Security',
    desc: 'Privacy and security features',
    articles: 8,
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042546/Icon-3_qa5lhg.svg',
    title: 'Billing & Plans',
    desc: 'Subscription management',
    articles: 7,
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042547/Vector-2_xyy9z0.svg',
    title: 'Troubleshooting',
    desc: 'Common issues and fixes',
    articles: 14,
  },
  {
    icon: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775042547/Icon-4_jq7cvg.svg',
    title: 'Mobile App',
    desc: 'Using MANIFESTR on mobile',
    articles: 9,
  },
]

const CATEGORY_ROUTES = {
  'Getting Started': '/playbook/getting-started',
  'Collaboration': '/playbook/knowledge-base',
  'Design': '/playbook/knowledge-base',
  'Integration': '/playbook/knowledge-base',
  'Security': '/playbook/knowledge-base',
  'Billing & Plans': '/playbook/knowledge-base',
  'Troubleshooting': '/playbook/knowledge-base',
  'Mobile App': '/playbook/knowledge-base',
}

function ArrowUpRight({ className = 'w-[20px] h-[20px]' }) {
  return (
    <svg className={`${className} text-[#18181b] shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )
}

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')

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
            Knowledge Base
          </span>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative w-full h-[518px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <CldImage src={HERO_BG} alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-[rgba(13,13,13,0.18)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-[50px] w-full max-w-[738px] px-6"
        >
          <div className="flex flex-col items-center gap-[20px]">
            <h1 className="text-[42px] md:text-[72px] leading-[1.1] md:leading-[90px] tracking-[-1.44px] text-white text-center">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Knowledge Base </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Articles</span>
            </h1>
            <p
              className="text-[18px] leading-[28px] text-white text-center"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              In-depth guides and resources to help you master MANIFESTR.
            </p>
          </div>

          <div className="bg-white border border-[#d5d7da] rounded-[7px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex items-center gap-[8px] px-[14px] py-[10px] w-full max-w-[449px]">
            <svg className="w-[20px] h-[20px] text-[#71717a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search article"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none bg-transparent"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ─── Tabs ─── */}
      <PlaybookTabs />

      {/* ─── Browse by Category ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[96px]">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {CATEGORIES.map((cat, i) => {
              const href = CATEGORY_ROUTES[cat.title] || '#'
              return (
                <Link key={cat.title} href={href}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white border border-[#e5e7eb] rounded-[16px] p-[24px] flex flex-col gap-[40px] items-start shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:shadow-md transition-shadow cursor-pointer h-full"
                  >
                    <div className="bg-[#eee] flex items-center justify-center rounded-[12px] w-[48px] h-[48px]">
                      <CldImage src={cat.icon} alt="" className="w-[24px] h-[24px]" />
                    </div>

                    <div className="flex flex-col gap-[8px] w-full">
                      <div className="flex items-center justify-between w-full">
                        <h3
                          className="text-[24px] leading-[32px] text-black"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                        >
                          {cat.title}
                        </h3>
                        <ArrowUpRight />
                      </div>
                      <p
                        className="text-[16px] leading-[24px] text-[#52525b]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {cat.desc}
                      </p>
                    </div>

                    <p
                      className="text-[14px] leading-[20px] font-medium text-[#1e293b] tracking-[-0.084px]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {cat.articles} articles
                    </p>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Need More Help? ─── */}
      <section className="w-full relative h-[380px] md:h-[414px] overflow-hidden">
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
              <h2 className="text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-1.2px] text-black">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p
                className="text-[16px] leading-[24px] text-[#52525b] max-w-[603px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
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
          </motion.div>
        </div>
      </section>
    </>
  )
}
