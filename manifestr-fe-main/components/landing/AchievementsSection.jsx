import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const ACHIEVEMENTS_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943058/Check_recent_achievements._1_llhioj.jpg'

const QUALITIES = [
  {
    title: 'Premium',
    description: 'Built to a standard expected in high-stakes, professional environments.',
  },
  {
    title: 'CEO level',
    description: 'Clear, confident outputs designed to support decision-making at the top.',
  },
  {
    title: 'Polished',
    description: 'Built for how serious work is created, reviewed and delivered.',
  },
  {
    title: 'Elevated',
    description: 'Refined structure and presentation that lifts the quality of every outcome.',
  },
]

export default function AchievementsSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <CldImage
          src={ACHIEVEMENTS_BG}
          alt=""
          className="w-full h-full object-cover opacity-95"
        />
        <div className="absolute inset-0 bg-[rgba(24,24,27,0.35)]" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-12 md:py-[96px]">
        <div className="flex flex-col md:flex-row gap-10 md:gap-[64px] items-start">

          {/* Left — heading + description + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-[369px] shrink-0 flex flex-col gap-[36px]"
          >
            <div className="flex flex-col gap-[16px]">
              <h2
                className="text-[32px] md:text-[48px] leading-tight md:leading-[60px] font-medium text-white tracking-[-0.96px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                The Quality{' '}
                <br className="hidden md:block" />
                MANIFESTR{' '}
                <br className="hidden md:block" />
                Delivers
              </h2>
              <p
                className="text-[16px] md:text-[18px] leading-[28px] text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                MANIFESTR is designed to produce professional-grade documents, not shortcuts or templates.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex items-center justify-center h-[54px] w-[200px] bg-white border border-white rounded-[6px] text-[18px] leading-[20px] text-black font-medium hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Enter MANIFESTR
            </Link>
          </motion.div>

          {/* Right — 2×2 quality grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-[32px] gap-y-[24px]">
            {QUALITIES.map((q, i) => (
              <motion.div
                key={q.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-[16px]"
              >
                <h3
                  className="text-[36px] md:text-[48px] leading-normal text-white"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  {q.title}
                </h3>
                <p
                  className="text-[16px] md:text-[18px] leading-[28px] text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {q.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
