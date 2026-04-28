import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import CldImage from '../ui/CldImage'

/** Desktop — sandy background (same tile used across CTA sections) */
const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'
/** Mobile */
const CTA_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775223352/Rectangle_8_1_jmywwu.png'

const DESKTOP_BODY_P1 =
  'MANIFESTR brings together the tools professionals need to create, communicate, and deliver at a higher standard. One system. Every format. Every context.'

const DESKTOP_BODY_P2 =
  'Stop switching between tools and start producing work that reflects your expertise. Built for the way you actually work — MANIFESTR turns strategy into output, fast.'

const MOBILE_BODY =
  'One system for every format. MANIFESTR removes the friction between thinking and delivering, so you can focus on what actually matters.'

export default function ToolCTA2() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* ── Desktop — Figma 12483:22388 layout (1440×414 sandy strip) ── */}
      <div className="relative hidden min-h-[414px] w-full md:block">
        {/* Full-bleed sand background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <CldImage
            src={CTA_BG}
            alt=""
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>

        {/* Content frame: max 1440 */}
        <div className="relative z-10 mx-auto flex min-h-[414px] w-full max-w-[1440px] flex-col items-center gap-10 px-8 py-14 lg:flex-row lg:items-center lg:gap-8 lg:px-10 xl:gap-12 xl:px-12 2xl:gap-[71px] 2xl:pl-[66px] 2xl:pr-[79px]">

          {/* Left column — heading, body, button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex w-full flex-col lg:flex-1"
          >
            <h2 className="whitespace-nowrap text-black text-[32px] leading-[1.1] tracking-[-0.02em] lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.8px] xl:text-[52px] xl:leading-[64px] xl:tracking-[-1.04px] 2xl:text-[60px] 2xl:leading-[72px] 2xl:tracking-[-1.2px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The Next Era of Work </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Starts Here</span>
            </h2>

            <div
              className="mt-[13px] flex w-full min-w-0 max-w-[758px] flex-col gap-4 text-[14px] leading-[22px] text-[#52525b] lg:text-[16px] lg:leading-[24px]"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            >
              <p>{DESKTOP_BODY_P1}</p>
              <p>{DESKTOP_BODY_P2}</p>
            </div>

            <Link
              href="/signup"
              className="mt-[26px] inline-flex h-[44px] w-[200px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] bg-[#18181b] px-6 py-2 text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
              <ArrowUpRight className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
            </Link>
          </motion.div>

          {/* Right black card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex h-[238px] w-full max-w-[454px] shrink-0 items-center justify-center rounded-[12px] bg-[#18181b] p-6 lg:h-[240px] lg:w-[320px] xl:h-[260px] xl:w-[380px] 2xl:h-[278px] 2xl:w-[454px]"
          >
            <p
              className="text-center text-white text-[26px] font-bold leading-[1.2] tracking-[-0.02em] lg:text-[24px] lg:leading-[1.2] lg:tracking-[-0.48px] xl:text-[30px] xl:tracking-[-0.6px] 2xl:text-[40px] 2xl:leading-[normal] 2xl:tracking-[-0.8px]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
            >
              One platform.
              <br />
              Infinite output.
              <br />
              Zero compromise.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="relative min-h-[560px] w-full overflow-hidden py-20 md:hidden">
        <div className="absolute inset-0" aria-hidden>
          <CldImage
            src={CTA_BG_MOBILE}
            alt=""
            className="h-full min-h-[600px] w-full object-cover"
            priority
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative z-10 mx-auto flex w-full max-w-[340px] flex-col items-center gap-[31px] px-4"
        >
          <h2 className="w-full max-w-full text-center text-black">
            <span className="inline-block max-w-full text-[clamp(14px,4vw+10px,30px)] leading-tight tracking-[-0.6px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The Next Era of Work </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Starts Here</span>
            </span>
          </h2>

          <p
            className="w-full max-w-[340px] text-center text-[14px] leading-[24px] text-black"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            {MOBILE_BODY}
          </p>

          <div className="flex h-[134px] w-full max-w-[284px] items-center justify-center rounded-[13px] bg-black px-3">
            <p
              className="text-center text-[27px] leading-[normal] tracking-[-0.54px] text-white"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
            >
              One platform.
              <br />
              Infinite output.
              <br />
              Zero compromise.
            </p>
          </div>

          <Link
            href="/signup"
            className="inline-flex h-11 w-[200px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#18181b] px-6 py-2 text-[14px] font-medium leading-5 text-white transition-colors duration-200 hover:bg-[#27272a]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Enter MANIFESTR
            <ArrowUpRight className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
