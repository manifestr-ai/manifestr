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

/* ── Desktop stat card components ── */

function HoursCard() {
  return (
    <div className="w-[338px] h-[173px] rounded-[12px] bg-black p-[24px] flex flex-col justify-between">
      <CldImage src={CLOCK_ICON} alt="" className="w-[70px] h-[70px]" />
      <div className="flex items-end gap-[16px]">
        <h3
          className="text-[48px] leading-[55px] tracking-[-0.96px] text-white"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
        >
          18+
        </h3>
        <p className="text-[16px] leading-[24px] text-white pb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Hours saved per week
        </p>
      </div>
    </div>
  )
}

function ReductionCard() {
  return (
    <div className="w-[338px] h-[173px] rounded-[12px] bg-[#f4f4f5] p-[24px] flex flex-col justify-between">
      <h3
        className="text-[48px] leading-[55px] tracking-[-0.96px] text-[#18181b]"
        style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
      >
        70%
      </h3>
      <div>
        <p className="text-[16px] leading-[24px] text-[#52525b] mb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Reduction in prep time
        </p>
        <div className="w-full h-[8px] bg-white rounded-[4px]">
          <div className="h-full bg-black rounded-[4px]" style={{ width: '74%' }} />
        </div>
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

function DeliveryCard() {
  return (
    <div className="w-[338px] h-[173px] rounded-[12px] bg-[#f4f4f5] p-[24px] flex flex-col justify-between">
      <CldImage src={ROCKET_ICON} alt="" className="w-[70px] h-[70px]" />
      <div className="flex items-end gap-[16px]">
        <h3
          className="text-[48px] leading-[55px] tracking-[-0.96px] text-[#18181b]"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
        >
          3X
        </h3>
        <p className="text-[16px] leading-[24px] text-[#52525b] pb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Faster project delivery
        </p>
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
      onMouseEnter={() => { if (!isSpread) setIsSpread(true) }}
    >
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[48px] leading-[52px] tracking-[-0.96px] text-center max-w-[366px]"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            How high performing{' '}
          </span>
          <br />
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            teams{' '}
          </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            use MANIFESTR
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[16px] leading-[24px] text-[#52525b] text-center max-w-[285px] mt-6"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          MANIFESTR enables teams to work with greater focus, clarity and
          control, delivering higher-quality output in less time.
        </motion.p>

        {/* Stacked stat cards */}
        <div className="flex flex-col gap-[30px] w-full max-w-[308px] mt-10">
          {/* 3-5x delivery */}
          <div className="w-full h-[158px] rounded-[11px] bg-[#f4f4f5] p-6 flex items-center gap-4">
            <CldImage src={ROCKET_ICON} alt="" className="w-[64px] h-[64px] shrink-0" />
            <div>
              <h3
                className="text-[44px] leading-[50px] tracking-[-0.87px] text-[#18181b]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                3 - 5x
              </h3>
              <p
                className="text-[16px] leading-[22px] text-[#52525b]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Faster project delivery
              </p>
            </div>
          </div>

          {/* 8+ hours */}
          <div className="w-full h-[158px] rounded-[11px] bg-black p-6 flex items-center gap-4">
            <CldImage src={CLOCK_ICON} alt="" className="w-[64px] h-[64px] shrink-0" />
            <div>
              <h3
                className="text-[44px] leading-[50px] tracking-[-0.87px] text-white"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                8+
              </h3>
              <p
                className="text-[16px] leading-[22px] text-white"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Hours saved per week
              </p>
            </div>
          </div>

          {/* Photo */}
          <div className="w-full h-[158px] rounded-[11px] overflow-hidden">
            <CldImage src={STAT_IMAGE} alt="" className="w-full h-full object-cover" />
          </div>

          {/* 70% reduction */}
          <div className="w-full h-[158px] rounded-[11px] bg-[#f4f4f5] p-6 flex flex-col justify-between">
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
            <div className="w-full h-[7px] bg-white rounded-[4px]">
              <div className="h-full bg-black rounded-[4px]" style={{ width: '74%' }} />
            </div>
          </div>
        </div>

        {/* Explore button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <Link
            href="/tools"
            className="inline-flex items-center justify-center h-[54px] w-[237px] bg-[#18181b] text-white text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore MANIFESTR
          </Link>
        </motion.div>
      </div>

      {/* ── DESKTOP ── */}
      <div
        className="hidden md:flex max-w-[1280px] mx-auto flex-col lg:flex-row items-start gap-[48px] lg:gap-[60px]"
      >
        {/* Left — animated stat cards */}
        <div
          className="relative w-full lg:w-auto shrink-0"
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

        {/* Right — text content */}
        <div className="w-full lg:flex-1 flex flex-col gap-[18px] lg:pt-[20px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[40px] md:text-[72px] leading-tight md:leading-[78px] tracking-[-1.44px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              See how{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              teams{' '}
            </span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              like yours use MANIFESTR
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[16px] leading-[24px] text-[#52525b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Discover How Our Tool Has Helped Real Users Achieve More and Simplify Their Workflow
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-[22px]"
          >
            <Link
              href="#"
              className="inline-flex items-center justify-center h-[54px] px-[32px] bg-[#18181b] text-white text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Link to Case Studies
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="hidden md:block max-w-[1280px] mx-auto mt-[40px] text-[16px] leading-[20px] text-[#71717a]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        These gains are powered by{' '}
        <span className="font-semibold text-black">MANIFESTR&apos;s</span> AI across every tool.
      </motion.p>
    </section>
  )
}
