import { motion } from 'framer-motion'
import Link from 'next/link'

const ACHIEVEMENTS_BG = '/assets/landing/achievements-bg.jpg'

const stats = [
  { value: '28%', description: 'Lorem ipsum dolor sit amet consectetur. Eget id aliquam lobortis enim.' },
  { value: '1.5k', description: 'Lorem ipsum dolor sit amet consectetur. Eget id aliquam lobortis enim.' },
  { value: '42x', description: 'Lorem ipsum dolor sit amet consectetur. Eget id aliquam lobortis enim.' },
  { value: '19%', description: 'Lorem ipsum dolor sit amet consectetur. Eget id aliquam lobortis enim.' },
]

export default function AchievementsSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={ACHIEVEMENTS_BG}
          alt=""
          className="w-full h-full object-cover opacity-95"
        />
        <div className="absolute inset-0 bg-[rgba(24,24,27,0.35)]" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-[369px] shrink-0"
          >
            <h2
              className="text-[36px] md:text-[48px] leading-tight md:leading-[60px] font-medium text-white tracking-[-0.96px] mb-4"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Check recent achievements.
            </h2>
            <p
              className="text-[16px] md:text-[18px] leading-[28px] text-white mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              We provide the effective ideas that grow businesses of our circle
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center h-[54px] px-9 bg-white border border-white rounded-md text-[18px] leading-[20px] text-black font-medium hover:bg-white/90 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              See Pricing
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 flex-1">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <span
                  className="text-[48px] md:text-[72px] leading-normal text-white"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  {stat.value}
                </span>
                <p
                  className="text-[16px] md:text-[18px] leading-[28px] text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
