import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const GET_STARTED_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

export default function GetStartedSection() {
  return (
    <section className="relative w-full min-h-[414px] overflow-hidden flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CldImage
          src={GET_STARTED_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover md:inset-auto md:left-0 md:right-auto  "
        />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-16 md:py-[92px] md:min-h-[414px] md:flex md:items-center md:justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center w-full"
        >
          <h2
            className="text-[36px] md:text-[60px] leading-[1.2] md:leading-[72px] font-bold text-black tracking-[-1.2px] mb-4"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Ready to{' '}
            <span
              style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
            >
              Elevate{' '}
            </span>
            Your Work?
          </h2>

          <p
            className="text-[16px] md:text-[18px] leading-[26px] text-black max-w-[552px] mb-8 md:mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Explore the MANIFESTR plans and choose the level of
            <br />
            access that fits how you work.
          </p>

          {/* Figma 12473:22287 — buttons: gap 12px; Variant Outlined + Secondary (shadcn lg) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/pricing"
              className="flex h-[36px] md:h-[54px] shrink-0 py-0 md:py-2 px-8 items-center justify-center gap-2 w-full sm:w-auto bg-white border border-[#e4e4e7] rounded-[6px] text-[18px] leading-[20px] font-medium text-[#18181b] hover:bg-zinc-50 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore Pricing
            </Link>
            <Link
              href="/signup"
              className="flex h-[36px] md:h-[54px] shrink-0 py-0 md:py-2 px-8 items-center justify-center gap-2 w-full sm:w-auto bg-[#18181b] rounded-[6px] text-[18px] leading-[20px] font-medium text-white hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Enter MANIFESTR
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
