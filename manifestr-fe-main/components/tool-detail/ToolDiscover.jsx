import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CldImage from '../ui/CldImage'
import TOOL_DETAILS from '../../data/toolDetails'

const PER_PAGE_DESKTOP = 3

/** Display order for “Discover the full toolkit”. */
const DISCOVER_SLUG_ORDER = [
  'deck',
  'wordsmith',
  'huddle',
  'strategist',
  'analyzer',
  'briefcase',
  'cost-ctrl',
  'design-studio',
]

/** Marketing copy and tags for each tool card (source of truth for this section). */
const DISCOVER_COPY = {
  deck: {
    line1: 'Create high-impact presentations built to win the room.',
    line2: 'From pitches to proposals, every slide is structured, on-brand, and ready to present.',
    tags: [
      'Pitch decks',
      'Proposals',
      'Sales presentations',
      'Strategy presentations',
      'Client presentations',
      'Executive decks',
    ],
  },
  wordsmith: {
    line1: 'Craft sharp, on-brand messaging that connects instantly.',
    line2: 'From headlines to full campaigns, every word is built to land.',
    tags: [
      'Headlines',
      'Marketing copy',
      'Campaign messaging',
      'Video scripts',
      'Long-form content',
      'Social content',
    ],
  },
  huddle: {
    line1: 'Run meetings with clarity, structure, and follow-through.',
    line2: 'From agendas to summaries, everything is captured and ready to share.',
    tags: ['Meeting agendas', 'Pre-reads', 'Meeting notes', 'Summaries', 'Action items', 'Follow-ups'],
  },
  strategist: {
    line1: 'Turn thinking into clear, structured strategy.',
    line2: 'From insights to execution plans, everything is built to guide decisions.',
    tags: [
      'Strategic plans',
      'Market analysis',
      'Campaign strategy',
      'Go-to-market plans',
      'Positioning frameworks',
      'Insights reports',
    ],
  },
  analyzer: {
    line1: 'Transform data into insights that drive action.',
    line2: 'From reports to forecasts, everything is clear, structured, and decision-ready.',
    tags: [
      'Data reports',
      'Dashboards',
      'Visualised data',
      'Performance insights',
      'Trend analysis',
      'Forecast reports',
    ],
  },
  briefcase: {
    line1: 'Build professional documents that hold up under review.',
    line2: 'From briefs to plans, everything is structured, aligned, and ready to deliver.',
    tags: [
      'Project briefs',
      'Scope documents',
      'Run sheets',
      'Project plans',
      'Client documents',
      'Internal documents',
    ],
  },
  'cost-ctrl': {
    line1: 'Take control of budgets, margins, and financial clarity.',
    line2: 'From cost breakdowns to forecasts, everything is built to support decisions.',
    tags: ['Budgets', 'Cost breakdowns', 'Forecasts', 'Financial reports', 'Margin analysis', 'Pricing models'],
  },
  'design-studio': {
    line1: 'Create polished visuals that elevate every output.',
    line2: 'From brand assets to campaign documentation, everything is built to stand out.',
    tags: [
      'Brand visuals',
      'Campaign assets',
      'Social creatives',
      'Presentation visuals',
      'Moodboards',
      'Image concepts',
    ],
  },
}

const DISCOVER_ITEMS = DISCOVER_SLUG_ORDER.map((slug) => {
  const rt = TOOL_DETAILS[slug]
  const discover = DISCOVER_COPY[slug]
  if (!rt || !discover) return null
  return { ...rt, discover }
}).filter(Boolean)

function Badge({ children }) {
  return (
    <span
      className="inline-flex items-center px-[12px] py-[6px] rounded-[16px] border border-[#e4e4e7] text-[12px] leading-[18px] font-medium text-[#71717a]"
      style={{ background: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}
    >
      {children}
    </span>
  )
}

function TitleSpans({ prefix, name }) {
  return (
    <>
      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
        {prefix === 'THE' ? 'The ' : `${prefix} `}
      </span>
      <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
        {name}
      </span>
    </>
  )
}

function DiscoverToolCard({ rt, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/tools/${rt.slug}`} className="block">
        <motion.div
          whileHover={{ y: -6 }}
          className="rounded-[12px] overflow-hidden min-h-[420px] md:min-h-[550px] flex flex-col cursor-pointer hover:shadow-lg transition-shadow bg-white border border-[#e4e3e1] h-full"
        >
          <div className="h-[200px] md:h-[266px] relative overflow-hidden m-[14px] md:m-[18px] mb-0 rounded-[12px]">
            <CldImage src={rt.heroImage} alt={`${rt.prefix} ${rt.name}`} className="w-full h-full object-cover object-top rounded-[12px]" />
          </div>
          <div className="flex-1 p-[14px] md:p-[18px] pt-[16px] md:pt-[24px] flex flex-col gap-[12px] md:gap-[16px]">
            <div>
              <h3 className="text-[28px] md:text-[36px] leading-[34px] md:leading-[44px] tracking-[-0.56px] md:tracking-[-0.72px] mb-[6px] md:mb-[8px]">
                <TitleSpans prefix={rt.prefix} name={rt.name} />
              </h3>
              <div
                className="flex flex-col gap-[6px] md:gap-[8px] text-[14px] md:text-[16px] leading-[21px] md:leading-[24px] text-[#52525b]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <p>{rt.discover.line1}</p>
                <p>{rt.discover.line2}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-[8px] md:gap-[10px] mt-auto">
              {rt.discover.tags.map((b) => (
                <Badge key={b}>{b}</Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function useIsMobileLg() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => { setIsMobile(mq.matches) }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return isMobile
}

export default function ToolDiscover() {
  const isMobile = useIsMobileLg()
  /** First visible tool index. Mobile: 0..n-1. Desktop: aligned to 0,3,6… via goNext/goPrev. */
  const [start, setStart] = useState(0)
  const n = DISCOVER_ITEMS.length
  if (!n) return null

  // Snap to block start on breakpoint change so desktop columns stay aligned
  useEffect(() => {
    setStart((s) => Math.floor(s / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP)
  }, [isMobile])

  const maxIndex = n - 1
  const maxDesktopBlockStart = Math.floor(maxIndex / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP

  const visible = isMobile
    ? (DISCOVER_ITEMS[start] != null ? [DISCOVER_ITEMS[start]] : [])
    : DISCOVER_ITEMS.slice(
        Math.floor(start / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP,
        Math.floor(start / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP + PER_PAGE_DESKTOP
      )

  const totalPageDots = isMobile ? n : Math.ceil(n / PER_PAGE_DESKTOP)
  const activeDot = isMobile ? start : Math.floor(start / PER_PAGE_DESKTOP)

  const canPrev = isMobile ? start > 0 : Math.floor(start / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP > 0
  const canNext = isMobile
    ? start < maxIndex
    : Math.floor(start / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP < maxDesktopBlockStart

  const goPrev = () => {
    if (isMobile) {
      setStart((s) => Math.max(0, s - 1))
    } else {
      setStart((s) => {
        const block = Math.floor(s / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP
        return Math.max(0, block - PER_PAGE_DESKTOP)
      })
    }
  }

  const goNext = () => {
    if (isMobile) {
      setStart((s) => Math.min(maxIndex, s + 1))
    } else {
      setStart((s) => {
        const block = Math.floor(s / PER_PAGE_DESKTOP) * PER_PAGE_DESKTOP
        return Math.min(maxDesktopBlockStart, block + PER_PAGE_DESKTOP)
      })
    }
  }

  const goToDot = (i) => {
    if (isMobile) {
      setStart(i)
    } else {
      setStart(i * PER_PAGE_DESKTOP)
    }
  }

  return (
    <section className="w-full bg-white py-[48px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[32px] md:text-[54px] leading-tight tracking-[-0.64px] md:tracking-[-1.08px] text-center mb-[32px] md:mb-[48px]"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Discover The Full </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Toolkit</span>
        </motion.h2>

        <div className="relative w-full max-w-[480px] md:max-w-none mx-auto md:mx-0">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 w-full">
            {visible.map((rt, i) => (
              <DiscoverToolCard key={rt.slug} rt={rt} index={i} />
            ))}
          </div>

          {totalPageDots > 1 && (
            <div className="flex items-center justify-center gap-4 mt-[28px] md:mt-[36px]">
              <button
                type="button"
                aria-label="Previous tools"
                disabled={!canPrev}
                onClick={goPrev}
                className="w-[40px] h-[40px] rounded-full border border-[#e4e4e7] bg-white flex items-center justify-center shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#fafafa] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#18181b]" />
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Toolkit pages">
                {Array.from({ length: totalPageDots }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeDot}
                    aria-label={`Page ${i + 1} of ${totalPageDots}`}
                    onClick={() => goToDot(i)}
                    className={`h-2 rounded-full transition-all ${i === activeDot ? 'w-6 bg-[#18181b]' : 'w-2 bg-[#d4d4d8] hover:bg-[#a1a1aa]'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next tools"
                disabled={!canNext}
                onClick={goNext}
                className="w-[40px] h-[40px] rounded-full border border-[#e4e4e7] bg-white flex items-center justify-center shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#fafafa] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#18181b]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
