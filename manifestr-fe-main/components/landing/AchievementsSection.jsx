import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const MOBILE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943058/Check_recent_achievements._1_llhioj.jpg'
const DESKTOP_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943058/Check_recent_achievements._1_llhioj.jpg'

const STATS = [
  {
    label: 'Premium',
    desc: 'Built to a standard expected in high-stakes, professional environments.',
  },
  {
    label: 'CEO level',
    desc: 'Clear, confident outputs designed to support decision-making at the top.',
  },
  {
    label: 'Polished',
    desc: 'Built for how serious work is created, reviewed and delivered.',
  },
  {
    label: 'Elevated',
    desc: 'Refined structure and presentation that lifts the quality of every outcome.',
  },
]

export default function BuiltBySection() {
  return (
    <>
      {/* ─── Mobile (< lg): Original Figma design ─── */}
      <section className="block lg:hidden w-full relative overflow-hidden">
        {/* Full-bleed background image + dark overlay */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={MOBILE_BG}
              alt=""
              className="absolute h-full w-full object-cover object-top opacity-95"
            />
          </div>
          <div className="absolute inset-0 bg-[rgba(24,24,27,0.35)]" />
        </div>

        <div className="relative z-10 flex flex-col gap-7 items-center px-6 py-12">
          {/* Content block */}
          <div className="flex flex-col gap-[10px] w-full">
            {/* Heading + sub-copy */}
            <div className="flex flex-col gap-[10px] w-full">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-white text-[32px] leading-[40px] tracking-[-0.64px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
              >
                The Quality{'\u00A0'}MANIFESTR Delivers
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white text-[16px] leading-[24px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                MANIFESTR is designed to produce professional-grade documents, not shortcuts or templates.
              </motion.p>
            </div>

            {/* 2 × 2 stats grid */}
            <div className="flex flex-col gap-6 w-full mt-[10px]">
              {[STATS.slice(0, 2), STATS.slice(2, 4)].map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-8 w-full">
                  {row.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (rowIdx * 2 + i) * 0.08 }}
                      className="flex flex-1 flex-col gap-4 text-white"
                    >
                      <span
                        className="text-[36px] leading-none"
                        style={{
                          fontFamily: "'IvyPresto Headline', serif",
                          fontStyle: 'italic',
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </span>
                      <p
                        className="text-[14px] leading-[22px]"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                      >
                        {stat.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/signup"
              className="flex items-center justify-center bg-white border border-white rounded-[6px] h-[54px] w-[204px] text-black text-[18px] leading-[20px] font-medium hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Enter MANIFESTR
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Desktop (lg+): Layout with left sidebar + right grid ─── */}
      <section className="hidden lg:block relative w-full overflow-hidden">
        <div className="absolute inset-0 ">
          <CldImage
            src={DESKTOP_BG}
            alt=""
            className="w-full h-full object-cover object-top opacity-95"
          />
          <div className="absolute inset-0 bg-[rgba(24,24,27,0.35)]" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-[80px] py-[96px]">
          <div className="flex gap-[64px] items-start">
            
            {/* Left — heading + description + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-[369px] shrink-0 flex flex-col gap-[36px]"
            >
              <div className="flex flex-col gap-[16px]">
                <h2
                  className="text-[48px] leading-[60px] font-medium text-white tracking-[-0.96px]"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  The Quality{' '}
                  <br />
                  MANIFESTR{' '}
                  <br />
                  Delivers
                </h2>
                <p
                  className="text-[18px] leading-[28px] text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  MANIFESTR is designed to produce professional-grade documents, not shortcuts or templates.
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-[54px] w-[200px] bg-white border border-white rounded-[6px] text-[18px] leading-[20px] text-black font-medium hover:bg-white/90 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Enter MANIFESTR
              </Link>
            </motion.div>

            {/* Right — 2×2 quality grid */}
            <div className="flex-1 grid grid-cols-2 gap-x-[32px] gap-y-[24px]">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col gap-[16px]"
                >
                  <h3
                    className="text-[48px] leading-normal text-white"
                    style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                  >
                    {stat.label}
                  </h3>
                  <p
                    className="text-[18px] leading-[28px] text-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  )
}