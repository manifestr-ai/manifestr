import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777458838/Glossary_Banner_1441x595_x2_xvrnsh.webp'
const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

const GLOSSARY = {
  A: [
    { term: 'API', def: 'Application Programming Interface \u2013 A set of protocols and tools for building software applications, allowing different programs to communicate with each other.' },
    { term: 'Asset Library', def: 'A centralized repository where all your design assets, components, and resources are stored and organized for easy access.' },
  ],
  B: [
    { term: 'Branching', def: 'The process of creating a separate line of development to work on features or fixes without affecting the main project.' },
  ],
  C: [
    { term: 'Component', def: 'A reusable building block of a design system that can be used across multiple projects and screens.' },
    { term: 'Collaboration Hub', def: 'A centralized space where team members can work together, share feedback, and track project progress in real-time.' },
  ],
  D: [
    { term: 'Design System', def: 'A collection of reusable components, patterns, and guidelines that ensure consistency across all product experiences.' },
  ],
  F: [
    { term: 'Frame', def: 'A container that holds design elements and defines the boundaries of a screen or component in your project.' },
  ],
  I: [
    { term: 'Integration', def: 'The connection between MANIFESTR and other tools or services to streamline your workflow.' },
  ],
  L: [
    { term: 'Layer', def: 'Individual elements stacked on the canvas that can be organized, grouped, and manipulated independently.' },
  ],
  M: [
    { term: 'Merge', def: 'Combining changes from different branches into a single unified version of your project.' },
  ],
  P: [
    { term: 'Prototype', def: 'An interactive mockup that demonstrates how your design will function, including transitions and user flows.' },
  ],
  S: [
    { term: 'Style Guide', def: 'Documentation that defines the visual and interaction standards for your brand or product.' },
  ],
  V: [
    { term: 'Vault', def: 'A secure storage space for your important design assets and project files.' },
    { term: 'Version Control', def: 'A system that tracks changes to your project over time, allowing you to revert to previous versions if needed.' },
  ],
  W: [
    { term: 'Workspace', def: 'Your main working environment in MANIFESTR where you create, edit, and manage projects.' },
  ],
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const ACTIVE_LETTERS = Object.keys(GLOSSARY)

function buildFilteredGlossary(query) {
  const q = query.trim().toLowerCase()
  if (!q) return GLOSSARY
  return Object.fromEntries(
    Object.entries(GLOSSARY)
      .map(([letter, terms]) => [
        letter,
        terms.filter(
          (t) =>
            t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)
        ),
      ])
      .filter(([, terms]) => terms.length > 0)
  )
}

export default function Glossary() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState('A')
  const contentRef = useRef(null)

  useEffect(() => {
    if (!router.isReady) return
    const raw = router.query.q
    if (raw === undefined) {
      setSearchQuery('')
      return
    }
    if (Array.isArray(raw)) setSearchQuery(raw[0] ?? '')
    else if (typeof raw === 'string') setSearchQuery(raw)
  }, [router.isReady, router.query.q])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const id = window.location.hash?.slice(1)
    if (!id) return undefined

    if (id === 'glossary-alphabet') {
      const t = window.setTimeout(() => {
        document.getElementById('glossary-alphabet')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
      return () => window.clearTimeout(t)
    }

    if (id.startsWith('glossary-')) {
      const letter = id.replace('glossary-', '')
      if (!ACTIVE_LETTERS.includes(letter)) return undefined
      setActiveLetter(letter)
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => window.clearTimeout(t)
    }

    return undefined
  }, [])

  const filteredGlossary = useMemo(
    () => buildFilteredGlossary(searchQuery),
    [searchQuery]
  )

  function applySearch(e) {
    e?.preventDefault()
    const q = searchQuery.trim()
    const path = q ? `/playbook/glossary?q=${encodeURIComponent(q)}` : '/playbook/glossary'
    router.push(path, undefined, { shallow: true })
  }

  const handleLetterClick = (letter) => {
    if (!ACTIVE_LETTERS.includes(letter)) return
    setActiveLetter(letter)
    const el = document.getElementById(`glossary-${letter}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
            Glossary of Terms
          </span>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="relative w-full h-[518px] flex items-center justify-center px-[80px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <CldImage src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-[32px] w-full max-w-[545px]"
        >
          {/* Heading + subtitle */}
          <div className="flex flex-col items-center gap-[20px] text-center">
            <h1
              className="text-[42px] md:text-[72px] leading-[1.1] md:leading-[90px] tracking-[-1.44px] text-white whitespace-nowrap"
            >
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Glossary of </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Terms</span>
            </h1>
            <p
              className="text-[18px] leading-[28px] text-white"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            >
              MANIFESTR key terms and concepts, clearly defined.
            </p>
          </div>

          {/* Search */}
          <form
            onSubmit={applySearch}
            className="flex w-full max-w-[449px] items-center gap-2 rounded-md border border-[#d5d7da] bg-white px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] md:px-3.5"
          >
            <svg className="h-5 w-5 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Search terms & definitions"
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

          <div className="flex flex-col items-center gap-[16px] w-full">
            <a
              href="#glossary-alphabet"
              className="text-[14px] leading-[20px] text-white/90 underline underline-offset-4 hover:text-white transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            >
              Browse by letter
            </a>
            <Link
              href="/signup"
              className="h-[44px] px-[24px] rounded-[6px] bg-white text-[#0d0d0d] text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Tabs ─── */}
      <PlaybookTabs />

      {/* ─── Alphabet Bar ─── */}
      <div
        id="glossary-alphabet"
        className="w-full bg-white border-t border-b border-[#e5e7eb] px-6 md:px-[112px] py-[20px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] sticky top-[76px] z-20 scroll-mt-[76px]"
      >
        <div className="flex gap-[8px] flex-wrap">
          {ALPHABET.map((letter) => {
            const hasTerms = ACTIVE_LETTERS.includes(letter)
            const isActive = activeLetter === letter
            return (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`w-[33px] h-[33px] rounded-[6px] flex items-center justify-center text-[14px] leading-[21px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#18181b] text-white'
                    : hasTerms
                    ? 'text-[#3f3f46] hover:bg-[#f4f4f5]'
                    : 'text-[#d4d4d8] cursor-default'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
                disabled={!hasTerms}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Glossary Content ─── */}
      <section ref={contentRef} className="w-full bg-white px-6 md:px-[112px] pt-[32px] pb-[96px]">
        {searchQuery.trim() && Object.keys(filteredGlossary).length === 0 ? (
          <p
            className="max-w-[640px] py-8 text-[16px] leading-[24px] text-[#52525b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            No terms match &ldquo;{searchQuery.trim()}&rdquo;. Try different keywords or browse by letter.
          </p>
        ) : null}
        <div className="flex flex-col gap-[48px]">
          {Object.entries(filteredGlossary).map(([letter, terms]) => (
            <div
              key={letter}
              id={`glossary-${letter}`}
              className="flex flex-col gap-[24px] scroll-mt-[148px] md:scroll-mt-[148px]"
            >
              <div className="border-b border-[#cbd5e1] pb-[14px]">
                <h2
                  className="text-[36px] leading-[44px] tracking-[-0.72px] text-[#0b091e]"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400 }}
                >
                  {letter}
                </h2>
              </div>

              <div className="flex flex-col gap-[32px]">
                {terms.map((item) => (
                  <div key={item.term} className="border-l-2 border-[#e5e7eb] pl-[24px]">
                    <h3
                      className="text-[24px] leading-[32px] text-[#1d293d] mb-[8px]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400 }}
                    >
                      {item.term}
                    </h3>
                    <p
                      className="text-[16px] leading-[26px] text-[#52525b] max-w-[800px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.def}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
