import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

/** Same asset + layout as pricing affiliate banner (PricingContent) */
const AFFILIATE_BG =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027959/Rectangle_34624854_ga3xmx.png'

export default function AffiliateBanner() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-0 py-0 md:px-[80px] md:py-10">
        {/* Mobile — match pricing page banner (image framing + typography) */}
        <div className="w-full py-[32px] md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-[180px] w-full overflow-hidden sm:h-[220px]"
          >
            <CldImage
              src={AFFILIATE_BG}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              sizes="100vw"
              fallbackWidth={1200}
            />
            <div className="relative z-10 flex h-full flex-col justify-center px-[20px] sm:px-[32px]">
              <h2 className="max-w-[608px] text-[22px] leading-[28px] tracking-[-0.48px] text-white sm:text-[32px] sm:leading-[40px] sm:tracking-[-0.64px]">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  Apply to join our{' '}
                </span>
                <span
                  style={{
                    fontFamily: "'IvyPresto Headline', serif",
                    fontWeight: 600,
                    fontStyle: 'italic',
                  }}
                >
                  Exclusive
                </span>
                <br />
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  Affiliate Program
                </span>
              </h2>
              <Link
                href="/affiliates"
                className="mt-[12px] inline-flex h-[36px] items-center justify-center self-start rounded-[6px] bg-[#18181b] px-[16px] text-[13px] font-medium leading-[20px] text-white transition-colors hover:bg-[#27272a] sm:mt-[16px] sm:h-[44px] sm:px-[24px] sm:text-[14px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Apply for Access
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[310px] w-full overflow-hidden rounded-[12px]"
          >
            <CldImage
              src={AFFILIATE_BG}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
              sizes="(min-width: 768px) 1280px"
              fallbackWidth={1440}
            />
            <div className="absolute inset-0 flex flex-col justify-center gap-[24px] px-[60px]">
              <h2 className="max-w-[608px] text-[54px] leading-[72px] tracking-[-1.08px] text-white">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  Apply to join our{' '}
                </span>
                <span
                  style={{
                    fontFamily: "'IvyPresto Headline', serif",
                    fontWeight: 600,
                    fontStyle: 'italic',
                  }}
                >
                  Exclusive
                </span>
                <br />
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  Affiliate Program
                </span>
              </h2>
              <Link
                href="/affiliates"
                className="inline-flex h-[54px] items-center justify-center self-start rounded-[6px] bg-[#18181b] px-[24px] text-[18px] font-medium leading-[20px] text-white transition-colors hover:bg-[#27272a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Apply for Access
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
