import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const STAT_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774954224/Rectangle_16_fe3wut.jpg'
const CLOCK_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774954202/Vector_ggimsq.svg'
const ROCKET_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774954202/Group_luvmcc.svg'

const CARD_W = 338
const CARD_H = 173
const GAP = 24

/** Progress fill from Figma 12079:36583 (right-[25.34%] on fill) */
const PREP_PROGRESS_PCT = 74.66

const CARDS = [
  {
    id: 'hours',
    stacked: { x: 20, y: -10, rotate: 11.24 },
    spread: { x: 0, y: 0, rotate: 0 },
    zStacked: 3,
  },
  {
    id: 'reduction',
    stacked: { x: 40, y: -30, rotate: -12.84 },
    spread: { x: CARD_W + GAP, y: 0, rotate: 0 },
    zStacked: 1,
  },
  {
    id: 'photo',
    stacked: { x: -10, y: 10, rotate: -30 },
    spread: { x: 0, y: CARD_H + GAP, rotate: 0 },
    zStacked: 2,
  },
  {
    id: 'delivery',
    stacked: { x: 60, y: -20, rotate: 29.09 },
    spread: { x: CARD_W + GAP, y: CARD_H + GAP, rotate: 0 },
    zStacked: 4,
  },
]

/* ── Figma 12079:36595 — hours + clock, dark card ── */
function HoursCard() {
  return (
    <div className="w-[338px] h-[173px] rounded-[12px] bg-black px-6 flex flex-row items-center gap-[22px]">
      <CldImage src={CLOCK_ICON} alt="" className="w-[70px] h-[70px] shrink-0" />
      <div className="flex flex-col items-start min-w-0">
        <h3
          className="text-[48px] leading-[55px] tracking-[-0.96px] text-white whitespace-nowrap"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
        >
          8+
        </h3>
        <p
          className="text-[16px] leading-[24px] text-white mt-0 max-w-[181px]"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          Hours saved per week
        </p>
      </div>
    </div>
  )
}

/* ── Figma 12079:36577 — 70% + prep time + bar ── */
function ReductionCard() {
  return (
    <div className="w-[338px] h-[173px] rounded-[12px] bg-[#f4f4f5] px-6 py-5 flex flex-col justify-between">
      <div>
        <h3
          className="text-[48px] leading-[55px] tracking-[-0.96px] text-[#18181b]"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
        >
          70%
        </h3>
        <p
          className="text-[16px] leading-[24px] text-[#52525b] mt-1 max-w-[320px]"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          Reduction in preparation time
        </p>
      </div>
      <div className="w-full max-w-[320px] h-2 rounded-[8px] relative bg-white mt-2">
        <div
          className="absolute left-0 top-0 h-2 rounded-[4px] bg-black"
          style={{ width: `${PREP_PROGRESS_PCT}%` }}
        />
      </div>
    </div>
  )
}

function PhotoCard() {
  return (
    <div className="w-[338px] h-[173px] rounded-[12px] overflow-hidden">
      <CldImage src={STAT_IMAGE} alt="" className="w-full h-full object-cover" />
    </div>
  )
}

/* ── Figma 12079:36601 — rocket + 3–5x ── */
function DeliveryCard() {
  return (
    <div className="w-[338px] h-[173px] rounded-[12px] bg-[#f4f4f5] px-6 flex flex-row items-center gap-[22px]">
      <CldImage src={ROCKET_ICON} alt="" className="w-[70px] h-[70px] shrink-0" />
      <div className="flex flex-col items-start min-w-0">
        <h3
          className="text-[48px] leading-[55px] tracking-[-0.96px] text-[#18181b] whitespace-nowrap"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
        >
          3 - 5x
        </h3>
        <p
          className="text-[16px] leading-[24px] text-[#52525b] mt-0 max-w-[181px]"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          Faster project delivery
        </p>
      </div>
    </div>
  )
}

/* ── Figma 12079:36587 — headline + body + CTA placement ── */
function IntroColumn({ className = '' }) {
  return (
    <div className={`flex flex-col gap-10 md:max-lg:gap-9 lg:max-xl:gap-9 xl:gap-10 items-start w-full min-w-0 ${className}`}>
      <div className="flex flex-col gap-[18px] items-start w-full text-left">
        <h2 className="text-[36px] sm:text-[48px] md:max-lg:text-[56px] lg:max-xl:text-[64px] xl:text-[72px] leading-[1.08] md:max-lg:leading-[1.12] lg:max-xl:leading-[1.1] xl:leading-[78px] tracking-[-1.44px] text-black w-full min-w-0 break-words [overflow-wrap:anywhere]">
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>How </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            high performing{' '}
          </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            teams{' '}
          </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>use </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>MANIFESTR</span>
        </h2>
        <p
          className="text-[16px] leading-[24px] text-[#52525b] w-full max-w-none"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          MANIFESTR enables teams to work with greater focus, clarity and control, delivering
          higher-quality output in less time.
        </p>
      </div>
      <div className="flex justify-start w-full">
        <Link
          href="/tools"
          className="flex h-[36px] md:h-[54px] shrink-0 py-0 md:py-2 px-8 items-center justify-center gap-2 bg-[#18181b] rounded-[6px] text-[18px] leading-[20px] font-medium text-white hover:bg-[#27272a] transition-colors w-auto"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Explore MANIFESTR
        </Link>
      </div>
    </div>
  )
}

const CARD_COMPONENTS = {
  hours: HoursCard,
  reduction: ReductionCard,
  photo: PhotoCard,
  delivery: DeliveryCard,
}

/**
 * Scroll-triggered reveal. Uses a callback ref + IntersectionObserver so the
 * observer always attaches once the DOM node exists (Framer useInView + object
 * ref can miss the first mount because ref.current stays null in the effect).
 */
function StatsReveal({
  children,
  className,
  style,
  delay = 0,
  y = 16,
  as: Component = motion.div,
}) {
  const [node, setNode] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
            return
          }
        }
      },
      {
        root: null,
        rootMargin: '80px 0px 200px 0px',
        threshold: [0, 0.05, 0.1],
      }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [node])

  return (
    <Component
      ref={setNode}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.5, delay }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  )
}

export default function ToolsStats() {
  const [isSpread, setIsSpread] = useState(false)
  const sectionRef = useRef(null)

  // Spread cards when the section scrolls into view (tablet / touch — no mouse hover)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
            setIsSpread(true)
            io.disconnect()
            return
          }
        }
      },
      { threshold: [0, 0.08, 0.15], rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-x-hidden bg-white px-6 md:px-8 lg:px-[80px] py-[64px] md:max-lg:py-[80px] lg:py-[96px]"
      onPointerEnter={() => setIsSpread(true)}
    >
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col items-stretch max-w-[440px] mx-auto text-left">
        <StatsReveal>
          <IntroColumn />
        </StatsReveal>

        <div className="flex flex-col gap-[30px] w-full mt-10">
          <div className="w-full min-h-[158px] rounded-[11px] bg-[#f4f4f5] p-6 flex items-center gap-4">
            <CldImage src={ROCKET_ICON} alt="" className="w-[64px] h-[64px] shrink-0" />
            <div>
              <h3
                className="text-[44px] leading-[50px] tracking-[-0.87px] text-[#18181b]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                3 - 5x
              </h3>
              <p className="text-[16px] leading-[22px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Faster project delivery
              </p>
            </div>
          </div>

          <div className="w-full min-h-[158px] rounded-[11px] bg-black p-6 flex items-center gap-4">
            <CldImage src={CLOCK_ICON} alt="" className="w-[64px] h-[64px] shrink-0" />
            <div>
              <h3
                className="text-[44px] leading-[50px] tracking-[-0.87px] text-white"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                8+
              </h3>
              <p className="text-[16px] leading-[22px] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                Hours saved per week
              </p>
            </div>
          </div>

          <div className="w-full h-[158px] rounded-[11px] overflow-hidden">
            <CldImage src={STAT_IMAGE} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="w-full min-h-[158px] rounded-[11px] bg-[#f4f4f5] p-6 flex flex-col justify-between">
            <div>
              <h3
                className="text-[44px] leading-[50px] tracking-[-0.87px] text-[#18181b]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                70%
              </h3>
              <p
                className="text-[16px] leading-[22px] text-[#52525b] mt-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Reduction in preparation time
              </p>
            </div>
            <div className="w-full h-[7px] bg-white rounded-[8px] relative mt-3">
              <div
                className="absolute left-0 top-0 h-full rounded-[4px] bg-black"
                style={{ width: `${PREP_PROGRESS_PCT}%` }}
              />
            </div>
          </div>
        </div>

        <StatsReveal
          as={motion.p}
          y={12}
          delay={0.15}
          className="mt-8 text-[16px] leading-[20px] text-[#71717a]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          These gains are powered by{' '}
          <span className="font-semibold text-black">MANIFESTR&apos;s</span> AI across every tool.
        </StatsReveal>
      </div>

      {/* ── TABLET + DESKTOP — stat cards left, intro column right (md+) ── */}
      <div className="hidden md:flex w-full min-w-0 max-w-[1280px] mx-auto flex-col xl:flex-row items-start gap-10 md:max-lg:gap-12 lg:max-xl:gap-12 xl:gap-[59px]">
        <div className="flex min-w-0 flex-col items-stretch w-full xl:w-[700px] xl:max-w-[700px] xl:shrink-0 mx-auto xl:mx-0">
          <div className="w-full max-w-full flex justify-center xl:justify-start overflow-x-hidden px-0 md:max-lg:px-1">
            <div
              className="relative shrink-0 mx-auto xl:mx-0 origin-top md:max-lg:scale-[0.82] lg:max-xl:scale-100 xl:scale-100"
              style={{ width: CARD_W * 2 + GAP, height: CARD_H * 2 + GAP }}
            >
            {CARDS.map((card) => {
              const CardContent = CARD_COMPONENTS[card.id]
              const pos = isSpread ? card.spread : card.stacked
              return (
                <motion.div
                  key={card.id}
                  className="absolute origin-center"
                  initial={false}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    rotate: pos.rotate,
                    zIndex: isSpread ? 1 : card.zStacked,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 16,
                    mass: 1.2,
                  }}
                  style={{ width: CARD_W, height: CARD_H }}
                >
                  <CardContent />
                </motion.div>
              )
            })}
            </div>
          </div>

          <StatsReveal
            as={motion.p}
            y={12}
            delay={0.2}
            className="mt-8 md:max-lg:mt-9 lg:max-xl:mt-9 xl:mt-[34px] text-left text-[16px] leading-[20px] text-[#71717a] w-full max-w-[700px] md:max-lg:max-w-[min(100%,36rem)] md:max-lg:mx-auto lg:max-xl:mx-auto xl:mx-0"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            These gains are powered by{' '}
            <span className="font-semibold text-black">MANIFESTR&apos;s</span> AI across every tool.
          </StatsReveal>
        </div>

        <div className="w-full min-w-0 max-w-[521px] xl:flex-1 xl:min-w-0 text-left mt-10 md:max-lg:mt-11 lg:max-xl:mt-11 xl:mt-0">
          <StatsReveal>
            <IntroColumn />
          </StatsReveal>
        </div>
      </div>
    </section>
  )
}


