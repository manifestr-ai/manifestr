import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777458839/Knowledge_Articles_Banner_1441x802_x2_q2q9o5.webp'
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
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!router.isReady) return
    const q = router.query.q
    if (Array.isArray(q)) setSearchQuery(q[0] ?? '')
    else if (typeof q === 'string') setSearchQuery(q)
  }, [router.isReady, router.query.q])

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.filter(
      (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    )
  }, [searchQuery])

  function applySearch(e) {
    e?.preventDefault()
    const q = searchQuery.trim()
    const path = q ? `/playbook/knowledge-base?q=${encodeURIComponent(q)}` : '/playbook/knowledge-base'
    router.push(path)
  }

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
      <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden px-6 md:h-[518px] md:px-[80px]">
        <div className="absolute inset-0">
          <CldImage src={HERO_BG} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex w-full max-w-[560px] flex-col items-center gap-6 px-0 md:max-w-[738px] md:gap-8"
        >
          <div className="flex flex-col items-center gap-5 md:gap-6">
            <h1 className="text-center text-[36px] leading-[1.1] tracking-[-0.72px] text-white md:text-[72px] md:leading-[90px] md:tracking-[-1.44px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Knowledge Base </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Articles</span>
            </h1>
            <p
              className="text-center text-[16px] leading-[24px] text-white md:text-[18px] md:leading-[28px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              In-depth guides and resources to help you master MANIFESTR.
            </p>
          </div>

          <div className="flex w-full max-w-[449px] flex-col items-center gap-[20px] md:gap-[24px]">
            <form
              onSubmit={applySearch}
              className="flex w-full items-center gap-2 rounded-md border border-[#d5d7da] bg-white px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] md:gap-2 md:px-3.5 md:py-2.5"
            >
              <svg className="h-5 w-5 shrink-0 text-[#71717a] md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                name="q"
                autoComplete="off"
                placeholder="Search articles & topics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[#18181b] outline-none placeholder:text-[#71717a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                type="submit"
                className="shrink-0 rounded bg-[#18181b] px-2.5 py-1.5 text-[13px] font-medium text-white hover:bg-[#27272a] md:px-3"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Search
              </button>
            </form>

            <Link
              href="/signup"
              className="inline-flex h-[44px] w-full max-w-[449px] items-center justify-center rounded-[6px] bg-white px-[24px] text-[14px] leading-[20px] font-medium text-[#0d0d0d] transition-colors hover:bg-[#f4f4f5] sm:w-auto"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Tabs ─── */}
      <PlaybookTabs />

      {/* ─── Browse by Category ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] pt-[32px] pb-[40px] md:py-[96px]">
        <div className="flex flex-col gap-[24px] md:gap-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[36px] md:text-[48px] leading-tight md:leading-[60px] tracking-[-0.96px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Browse by </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Category</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {filteredCategories.length === 0 && (
              <p
                className="col-span-full text-center text-[16px] leading-[24px] text-[#52525b] py-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                No categories match your search. Try different keywords or browse all topics below.
              </p>
            )}
            {filteredCategories.map((cat, i) => {
              const href = CATEGORY_ROUTES[cat.title] || '#'
              return (
                <Link key={cat.title} href={href}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-[#f4f4f4] border border-[#e2e8f0] rounded-[16px] p-[24px] flex flex-col gap-[40px] items-start shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:shadow-md transition-shadow cursor-pointer h-full"
                  >
                    <div className="bg-white flex items-center justify-center rounded-[12px] w-[48px] h-[48px] border border-[#e5e7eb]">
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
