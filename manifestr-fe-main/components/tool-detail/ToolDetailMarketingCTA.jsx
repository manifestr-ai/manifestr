import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/ToolkitCldImage'

/**
 * Tool marketing CTA — Figma MANIFESTR-Marketing-Site **12468:22416**
 * Centered headline + subcopy + dual CTAs on full-bleed sand (`/tools/[slug]` after Discover).
 */

const CTA_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'
const CTA_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775223352/Rectangle_8_1_jmywwu.png'

const SUBCOPY =
  'Pick the plan that fits your needs and start boosting your productivity today. No risk, just results.'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

function Heading() {
  return (
    <h2 className="mx-auto max-w-[920px] text-balance text-center text-black text-[32px] leading-[1.12] tracking-[-0.64px] md:text-[44px] md:leading-[1.1] md:tracking-[-0.88px] lg:text-[52px] lg:tracking-[-1.04px] xl:text-[60px] xl:leading-[1.08] xl:tracking-[-1.2px]">
      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Ready to </span>
      <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Get Started?</span>
    </h2>
  )
}

export default function ToolDetailMarketingCTA() {
  return (
    <section
      id="tool-marketing-cta"
      className="relative w-full overflow-hidden bg-white"
      aria-label="Ready to get started"
    >
      {/* Desktop + tablet — centered stack */}
      <div className="relative hidden min-h-[400px] w-full md:block md:min-h-[440px] lg:min-h-[480px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <CldImage
            src={CTA_BG_DESKTOP}
            alt=""
            className="h-full w-full object-cover object-center"
            priority
            sizes="100vw"
            fallbackWidth={2048}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[400px] w-full max-w-[1280px] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[440px] md:px-[80px] md:py-20 lg:min-h-[480px] lg:py-24">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55 }}
            className="flex w-full max-w-[720px] flex-col items-center"
          >
            <Heading />

            <p
              className="mt-5 max-w-[560px] text-pretty text-[15px] leading-[24px] text-[#18181b] md:mt-6 md:text-[16px] md:leading-[26px] lg:mt-8 lg:max-w-[600px] lg:text-[18px] lg:leading-[28px]"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            >
              {SUBCOPY}
            </p>

            <div className="mt-8 flex w-full max-w-[420px] flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4 md:mt-10">
              <Link
                href="/pricing"
                className="inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-[8px] border border-[#e4e4e7] bg-white px-6 text-[15px] font-medium leading-5 text-[#18181b] shadow-sm transition-colors hover:bg-[#fafafa] sm:h-12 sm:w-auto sm:min-w-[180px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Explore Pricing
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-[8px] bg-[#18181b] px-6 text-[15px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a] sm:h-12 sm:w-auto sm:min-w-[180px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative min-h-[420px] w-full overflow-hidden py-14 md:hidden">
        <div className="absolute inset-0" aria-hidden>
          <CldImage
            src={CTA_BG_MOBILE}
            alt=""
            className="h-full min-h-[480px] w-full object-cover object-center"
            priority
            sizes="100vw"
            fallbackWidth={828}
          />
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.55 }}
          className="relative z-10 mx-auto flex w-full max-w-[400px] flex-col items-center px-6 text-center"
        >
          <h2 className="text-balance text-[28px] leading-[1.15] tracking-[-0.56px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Ready to </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Get Started?</span>
          </h2>

          <p
            className="mt-5 text-[14px] leading-[22px] text-[#18181b]"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            {SUBCOPY}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            <Link
              href="/pricing"
              className="inline-flex h-12 w-full items-center justify-center rounded-[8px] border border-[#e4e4e7] bg-white px-6 text-[15px] font-medium text-[#18181b] shadow-sm transition-colors hover:bg-[#fafafa]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore Pricing
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-[#18181b] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#27272a]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Get Started Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
