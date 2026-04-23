import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CldImage from '../ui/CldImage'

const ROW_1 = [
  'https://picsum.photos/seed/cal1/320/240',
  'https://picsum.photos/seed/cal2/280/240',
  'https://picsum.photos/seed/cal3/320/240',
  'https://picsum.photos/seed/cal4/280/240',
  'https://picsum.photos/seed/cal5/320/240',
  'https://picsum.photos/seed/cal6/280/240',
]
const ROW_2 = [
  'https://picsum.photos/seed/cal7/280/240',
  'https://picsum.photos/seed/cal8/320/240',
  'https://picsum.photos/seed/cal9/280/240',
  'https://picsum.photos/seed/cal10/320/240',
  'https://picsum.photos/seed/cal11/280/240',
  'https://picsum.photos/seed/cal12/320/240',
]
const ROW_3 = [
  'https://picsum.photos/seed/cal13/320/240',
  'https://picsum.photos/seed/cal14/280/240',
  'https://picsum.photos/seed/cal15/320/240',
  'https://picsum.photos/seed/cal16/280/240',
  'https://picsum.photos/seed/cal17/320/240',
  'https://picsum.photos/seed/cal18/280/240',
]

const SLIDER_IMAGES = [...ROW_1, ...ROW_2, ...ROW_3]

/**
 * Matches the static “The Strategist / delivers” heading in this block — do not read from tool data
 * (avoids short outputDescription or per-tool copy showing under a Strategist-only title).
 */
const OUTPUT_SECTION_BODY_TEXT =
  'Forget generic strategy outputs. Strategy, held to a higher standard. The Strategist creates structured, decision-ready documents designed for real execution. Every insight is refined, defensible, and built to perform under scrutiny. Curious? See it in action.'

function MarqueeRow({ images, direction = 'left', duration = 35 }) {
  const doubled = [...images, ...images]
  return (
    <div className="">
      <div
        className="flex gap-[16px] w-max"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((src, i) => (
          <div key={i} className="shrink-0 w-[240px] h-[180px] rounded-[12px] overflow-hidden">
            <CldImage
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(100%)' }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileSlider() {
  const scrollRef = useRef(null)
  const [idx, setIdx] = useState(0)

  const scroll = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return
    const cardW = el.firstElementChild?.offsetWidth || 280
    const gap = 12
    const next = dir === 'left' ? Math.max(0, idx - 1) : Math.min(SLIDER_IMAGES.length - 1, idx + 1)
    el.scrollTo({ left: next * (cardW + gap), behavior: 'smooth' })
    setIdx(next)
  }, [idx])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardW = el.firstElementChild?.offsetWidth || 280
    const gap = 12
    setIdx(Math.round(el.scrollLeft / (cardW + gap)))
  }, [])

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {SLIDER_IMAGES.map((src, i) => (
          <div key={i} className="shrink-0 w-[80%] aspect-4/3 rounded-[12px] overflow-hidden snap-center">
            <CldImage
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(100%)' }}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-[32px] h-[32px] rounded-full bg-white/80 flex items-center justify-center shadow-sm"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4 text-[#18181b]" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-[32px] h-[32px] rounded-full bg-white/80 flex items-center justify-center shadow-sm"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4 text-[#18181b]" />
      </button>
    </div>
  )
}

export default function ToolOutput() {
  return (
    <section className="w-full bg-[#f4f4f5] relative overflow-hidden" style={{ minHeight: '400px' }}>
      <div
        className="absolute pointer-events-none hidden md:flex flex-col gap-[16px]"
        style={{
          right: '-620px',
          top: '-200px',
          width: '1300px',
          transform: 'rotate(-38deg)',
          transformOrigin: 'center center',
        }}
      >
        <MarqueeRow images={ROW_1} direction="left" duration={30} />
        <MarqueeRow images={ROW_2} direction="right" duration={35} />
        <MarqueeRow images={ROW_3} direction="left" duration={32} />
      </div>

      <div className="relative z-10 w-full max-w-[min(100%,1440px)] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 min-[1600px]:px-16 py-[48px] md:py-[106px]">
        <div className="w-full max-w-full md:max-w-[min(100%,960px)] text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[32px] md:text-[60px] leading-tight tracking-[-0.64px] md:tracking-[-1.2px] text-[#18181b] mb-[24px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            <span className="block">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The </span>
              <em
                className="not-italic"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                Calibre
              </em>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> of Output</span>
            </span>
            <span className="block">The Strategist</span>
            <span className="block">delivers</span>
          </motion.h2>

          {/*
            Figma 12468:22114 — B1 18/Regular, Inter, #52525b; copy fixed to match Strategist heading
          */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[18px] leading-[28px] text-[#52525b] font-normal tracking-[0] mb-[24px] w-full max-w-[min(100%,500px)] mx-auto md:mx-0"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {OUTPUT_SECTION_BODY_TEXT}
          </motion.p>

          {/* Mobile slider */}
          <div className="md:hidden mb-[24px]">
            <MobileSlider />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-[12px] sm:flex-row sm:flex-wrap"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-[54px] md:h-[44px] px-[24px] bg-white border border-[#e4e4e7] text-[#18181b] text-[18px] md:text-[14px] leading-[20px] font-medium rounded-[6px] hover:bg-white/80 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
