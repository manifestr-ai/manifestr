import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CldImage from '../ui/ToolkitCldImage'
import TOOL_DETAILS from '../../data/toolDetails'

const PER_PAGE_DESKTOP = 3

/** Tags shown per discover card (Figma). */
const TAGS_PER_CARD = 3

/**
 * Card shell — Figma 12468:22357 (default + hover), aligned with toolkit `ToolsGrid` motion.
 * Image area — fixed 266px frame; `object-top` + `object-cover` crops from the bottom.
 * `imageBaseScale` zooms the asset at rest (no hover scale); clip stays the same height.
 */
const CARD = {
  radius: '12px',
  border: '#e4e3e1',
  padding: '12px',
  imageGap: '10px',
  chipRadius: '6px',
  /** Hero image frame height (px). */
  imageHeightPx: 266,
  /** Default in-frame zoom (scale); hover does not change scale. */
  imageBaseScale: 1.4,
}

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
      className="inline-flex items-center border border-[#e4e4e7] bg-[#fafafa] px-2.5 py-1 text-[12px] font-medium leading-[18px] text-[#71717a] transition-[color,background-color,border-color] duration-200 ease-out group-hover:border-white/25 group-hover:bg-transparent group-hover:text-white group-focus-within:border-white/25 group-focus-within:bg-transparent group-focus-within:text-white"
      style={{ fontFamily: 'Inter, sans-serif', borderRadius: CARD.chipRadius }}
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
      className="h-full"
    >
      <Link
        href={`/tools/${rt.slug}`}
        className="group block h-full rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
      >
        <div
          className="flex h-full min-h-[420px] cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[#e4e3e1] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out will-change-transform motion-reduce:transition-colors motion-reduce:md:group-hover:translate-y-0 motion-reduce:md:group-hover:scale-100 motion-reduce:md:group-focus-within:translate-y-0 motion-reduce:md:group-focus-within:scale-100 md:group-hover:-translate-y-[5px] md:group-hover:scale-[1.012] group-hover:border-[#18181b] group-hover:bg-[#18181b] group-hover:shadow-[0_12px_32px_-8px_rgba(24,24,27,0.28)] group-focus-within:border-[#18181b] group-focus-within:bg-[#18181b] group-focus-within:shadow-[0_12px_32px_-8px_rgba(24,24,27,0.28)] md:group-focus-within:-translate-y-[5px] md:group-focus-within:scale-[1.012] md:min-h-[550px]"
          style={{ padding: CARD.padding, borderRadius: CARD.radius }}
        >
          <div
            className="relative w-full shrink-0 overflow-hidden rounded-[12px] ring-0 transition-[box-shadow] duration-200 ease-out group-hover:ring-1 group-hover:ring-white/10 group-focus-within:ring-1 group-focus-within:ring-white/10"
            style={{ height: CARD.imageHeightPx }}
          >
            <CldImage
              src={rt.heroImage}
              alt={`${rt.prefix} ${rt.name}`}
              className="size-full min-h-full origin-top rounded-[12px] object-cover object-top transition-[filter] duration-200 ease-out motion-reduce:scale-100 scale-[var(--discover-img-base-scale)] group-hover:brightness-[0.92] group-focus-within:brightness-[0.92]"
              style={{ '--discover-img-base-scale': CARD.imageBaseScale }}
            />
          </div>
          <div
            className="flex min-h-0 flex-1 flex-col"
            style={{ paddingTop: CARD.imageGap }}
          >
            <div className="flex shrink-0 flex-col gap-3 md:gap-4">
              <div>
                <h3 className="mb-1.5 text-left text-[28px] leading-[34px] tracking-[-0.56px] text-[#18181b] transition-colors duration-200 group-hover:text-white md:mb-2 md:text-[36px] md:leading-[44px] md:tracking-[-0.72px] group-focus-within:text-white">
                  <TitleSpans prefix={rt.prefix} name={rt.name} />
                </h3>
                <div
                  className="flex flex-col gap-1.5 text-left text-[14px] leading-[21px] text-[#52525b] transition-colors duration-200 group-hover:text-zinc-200 md:gap-2 md:text-[16px] md:leading-6 group-focus-within:text-zinc-200"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <p>{rt.discover.line1}</p>
                  <p>{rt.discover.line2}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-2.5">
                {rt.discover.tags.slice(0, TAGS_PER_CARD).map((b) => (
                  <Badge key={b}>{b}</Badge>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1" aria-hidden />
          </div>
        </div>
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
