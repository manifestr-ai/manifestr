import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'
import CldImage from '../ui/CldImage'
import { DEMO_VIDEOS } from '../../data/demoVideos'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775670192/6999ed29b2e67618b5815daf16382aa929f90057_sarl2g.png'
const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

const BROWSE_CATEGORIES = [
  {
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775043515/Kits-1_oftw78.png',
    title: 'Getting Started',
    desc: 'Essential videos for new users',
    meta: '8 videos • 45 min',
    href: '/playbook/demo-videos/category/getting-started',
  },
  {
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775043515/Kits_muwcbz.png',
    title: 'Pro Tips',
    desc: 'Advanced techniques and workflows',
    meta: '12 videos • 1h 20min',
    href: '/playbook/demo-videos/category/pro-tips',
  },
]

function PlayIcon({ size = 61 }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.33} height={size * 0.33} viewBox="0 0 24 24" fill="#232323">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

function matchesQuery(q, ...fields) {
  if (!q) return true
  const s = q.trim().toLowerCase()
  return fields.some((f) => f != null && String(f).toLowerCase().includes(s))
}

export default function DemoVideos() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!router.isReady) return
    const q = router.query.q
    if (Array.isArray(q)) setSearchQuery(q[0] ?? '')
    else if (typeof q === 'string') setSearchQuery(q)
  }, [router.isReady, router.query.q])

  const filteredTutorials = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return DEMO_VIDEOS
    return DEMO_VIDEOS.filter((t) => matchesQuery(q, t.title, t.desc, t.category))
  }, [searchQuery])

  const filteredBrowseCategories = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return BROWSE_CATEGORIES
    return BROWSE_CATEGORIES.filter((c) => matchesQuery(q, c.title, c.desc, c.meta))
  }, [searchQuery])

  function applySearch(e) {
    e?.preventDefault()
    const q = searchQuery.trim()
    const path = q ? `/playbook/demo-videos?q=${encodeURIComponent(q)}` : '/playbook/demo-videos'
    router.push(path)
  }

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="w-full border-b border-t border-[#e5e7eb] bg-white px-6 md:px-[80px]">
        <div className="flex h-[54px] items-center gap-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Link href="/playbook" className="text-[14px] leading-[21px] text-[#52525b] hover:underline">
            Playbook
          </Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[14px] font-medium leading-[21px] text-[#18181b]">Demo Videos</span>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden px-6 md:h-[518px] md:px-[80px]">
        <div className="absolute inset-0">
          <CldImage src={HERO_BG} alt="" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex w-full max-w-[560px] flex-col items-center gap-6 md:gap-8"
        >
          <div className="flex max-w-[544px] flex-col items-center gap-5 text-center md:gap-6">
            <h1 className="text-center text-[36px] leading-[1.1] tracking-[-0.72px] text-white md:text-[72px] md:leading-[90px] md:tracking-[-1.44px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Demo </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Videos</span>
            </h1>
            <p className="text-center text-[16px] leading-[24px] text-white md:text-[18px] md:leading-[28px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Explore quick, step-by-step walkthroughs designed to help you build smarter, faster, and with confidence.
            </p>
          </div>

          <div className="flex w-full max-w-[449px] flex-col items-center gap-5 md:gap-6">
            <form
              onSubmit={applySearch}
              className="flex w-full items-center gap-2 rounded-md border border-[#d5d7da] bg-white px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] md:px-3.5 md:py-2.5"
            >
              <svg className="h-5 w-5 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                name="q"
                type="search"
                autoComplete="off"
                placeholder="Search videos & topics"
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
              className="inline-flex h-11 w-full max-w-[449px] items-center justify-center rounded-[6px] bg-white px-6 text-[14px] font-medium leading-5 text-[#0d0d0d] transition-colors hover:bg-[#f4f4f5] sm:w-auto"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
            </Link>
          </div>
        </motion.div>
      </section>

      <PlaybookTabs />

      {/* ─── Browse by Category ─── */}
      <section className="w-full bg-white px-6 pb-[12px] pt-[28px] md:px-[80px] md:pb-[24px] md:pt-[72px]">
        <div className="flex flex-col gap-5 md:gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[36px] leading-tight text-black md:text-[48px] md:leading-[60px] md:tracking-[-0.96px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Browse by </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Category</span>
          </motion.h2>

          {filteredBrowseCategories.length === 0 && searchQuery.trim() ? (
            <p className="py-4 text-center text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              No categories match your search. Try different keywords.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {filteredBrowseCategories.map((cat, i) => (
              <Link key={cat.title} href={cat.href}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative h-[400px] cursor-pointer overflow-hidden rounded-[12px] md:h-[500px]"
                >
                  <CldImage src={cat.image} alt="" className="absolute inset-0 h-full w-full rounded-[12px] object-cover" />
                  <div
                    className="absolute inset-0 rounded-[12px]"
                    style={{ backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)' }}
                  />
                  <PlayIcon size={84} />
                  <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-6 p-6">
                    <div className="flex flex-col gap-4 text-white">
                      <h3 className="text-[30px] leading-[38px] tracking-[-0.39px]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                        {cat.title}
                      </h3>
                      <p className="text-[16px] leading-[1.6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {cat.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-[#d9d9d9] bg-white px-6 py-[6px] text-[16px] leading-[1.65] tracking-[-0.48px] text-[#6c6c6c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {cat.meta}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── All Tutorials ─── */}
      <section
        id="tutorials"
        className="w-full scroll-mt-[100px] bg-[#f4f4f5] px-6 pb-[40px] pt-[20px] md:px-[80px] md:pb-[80px] md:pt-[24px]"
      >
        <div className="flex flex-col gap-5 md:gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[36px] leading-tight text-black md:text-[48px] md:leading-[60px] md:tracking-[-0.96px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>All </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Tutorials</span>
          </motion.h2>

          {filteredTutorials.length === 0 && searchQuery.trim() ? (
            <p className="py-4 text-center text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              No tutorials match your search. Try different keywords.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-14 lg:grid-cols-3">
            {filteredTutorials.map((tut, i) => (
              <Link key={tut.slug} href={`/playbook/demo-videos/${tut.slug}`} className="group flex flex-col gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col gap-5"
                >
                  <div className="relative h-[280px] overflow-hidden rounded-lg">
                    <CldImage src={tut.image} alt="" className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
                    <PlayIcon size={61} />
                    <span
                      className="absolute right-4 top-4 rounded-full border border-[#d9d9d9] bg-white px-6 py-[6px] text-[16px] font-medium leading-[1.65] tracking-[-0.48px] text-[#341e1e]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {tut.duration}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3
                      className="text-[24px] leading-normal tracking-[-0.72px] text-[#1c1c1c] transition-colors group-hover:text-[#18181b]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                    >
                      {tut.title}
                    </h3>
                    <p className="text-[16px] leading-[1.6] text-[#475569]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {tut.desc}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Need More Help? ─── */}
      <section className="relative h-[380px] w-full overflow-hidden md:h-[414px]">
        <CldImage src={CTA_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8 px-6 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-[36px] leading-tight text-black md:text-[60px] md:leading-[72px] md:tracking-[-1.2px]">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p className="max-w-[603px] text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {"Can't find what you're looking for?"}
                <br />
                Our support team is here to help you succeed with MANIFESTR.
              </p>
            </div>
            <Link
              href="/playbook/submit-ticket"
              className="inline-flex h-[44px] min-h-[44px] items-center justify-center rounded-[6px] bg-[#18181b] px-4 text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a] md:h-[54px] md:min-h-[54px] md:px-6 md:text-[16px]"
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
