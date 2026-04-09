import { useState } from 'react'
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
    <div className={`flex flex-col gap-10 items-start w-full ${className}`}>
      <div className="flex flex-col gap-[18px] items-start w-full text-left">
        <h2 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] leading-[1.08] md:leading-[78px] tracking-[-1.44px] text-black w-full">
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

export default function ToolsStats() {
  const [isSpread, setIsSpread] = useState(false)

  return (
    <section
      className="w-full bg-white px-6 md:px-[80px] py-[64px] md:py-[96px]"
      onMouseEnter={() => {
        if (!isSpread) setIsSpread(true)
      }}
    >
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col items-stretch max-w-[440px] mx-auto text-left">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <IntroColumn />
        </motion.div>

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

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 text-[16px] leading-[20px] text-[#71717a]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          These gains are powered by{' '}
          <span className="font-semibold text-black">MANIFESTR&apos;s</span> AI across every tool.
        </motion.p>
      </div>

      {/* ── DESKTOP — stat cards left, intro column right ── */}
      <div className="hidden md:flex max-w-[1280px] mx-auto flex-col lg:flex-row items-start gap-[48px] lg:gap-[59px]">
        <div className="flex flex-col items-stretch shrink-0 w-full lg:w-[700px] mx-auto lg:mx-0">
          <div
            className="relative shrink-0 mx-auto lg:mx-0"
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

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-[34px] text-left text-[16px] leading-[20px] text-[#71717a] w-full max-w-[700px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            These gains are powered by{' '}
            <span className="font-semibold text-black">MANIFESTR&apos;s</span> AI across every tool.
          </motion.p>
        </div>

        <div className="w-full max-w-[521px] shrink-0 text-left lg:mt-0 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <IntroColumn />
          </motion.div>
        </div>
      </div>
    </section>
  )
}


