import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const SAND_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

const SUBCOPY =
  'Pick the plan that fits your needs and start boosting your productivity today. No risk, just results.'

export default function AffiliateGetStarted() {
  return (
    <section className="relative min-h-[414px] w-full overflow-hidden" aria-label="Get started">
      <div className="absolute inset-0" aria-hidden>
        <CldImage src={SAND_BG} alt="" className="h-full w-full object-cover object-center" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-6 py-12 text-center md:gap-8 md:py-[92px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex w-full max-w-[720px] flex-col items-center"
        >
          {/* Same headline treatment as ToolDetailMarketingCTA — Hanken 700 + Ivy italic */}
          <h2 className="mx-auto max-w-[920px] text-balance text-center text-[32px] leading-[1.12] tracking-[-0.64px] text-black md:text-[44px] md:leading-[1.1] md:tracking-[-0.88px] lg:text-[52px] lg:tracking-[-1.04px] xl:text-[60px] xl:leading-[1.08] xl:tracking-[-1.2px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Ready to </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Get Started?</span>
          </h2>

          <p
            className="mt-5 max-w-[560px] text-pretty text-[15px] leading-[24px] text-[#18181b] md:mt-6 md:text-[16px] md:leading-[26px] lg:mt-8 lg:max-w-[600px] lg:text-[18px] lg:leading-[28px]"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            {SUBCOPY}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex w-full max-w-[420px] flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4"
        >
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
        </motion.div>
      </div>
    </section>
  )
}
