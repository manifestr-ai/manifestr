import { motion } from 'framer-motion'
import Link from 'next/link'

const GET_STARTED_BG = '/assets/landing/get-started-bg.jpg'

export default function GetStartedSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={GET_STARTED_BG}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <h2
            className="text-[36px] md:text-[60px] leading-[1.2] md:leading-[72px] font-bold text-black tracking-[-1.2px] mb-4"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Ready to{' '}
            <span
              className="italic font-semibold"
              style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
            >
              Get Started?
            </span>
          </h2>

          <p
            className="text-[16px] md:text-[18px] leading-[26px] text-black max-w-[552px] mb-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pick the plan that fits your needs and start boosting your
            productivity today. No risk, just results.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center h-[54px] px-8 bg-transparent border border-[#18181b] rounded-md text-[18px] leading-[20px] text-[#18181b] font-medium hover:bg-black/5 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore Pricing
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-[54px] px-8 bg-[#18181b] rounded-md text-[18px] leading-[20px] text-white font-medium hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get Started Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
