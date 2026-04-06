import { motion } from 'framer-motion'
import Link from 'next/link'

export default function WhoWeAre() {
  return (
    <section className="w-full bg-white py-[48px] md:py-[88px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px] flex flex-col items-center">

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[18px] md:text-[24px] tracking-[-0.36px] md:tracking-[-0.48px] text-black uppercase mb-[12px] md:mb-[32px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          WHO WE ARE
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-[30px] md:text-[36px] leading-[normal] md:leading-[49px] tracking-[-0.6px] md:tracking-[-0.72px] text-black max-w-[901px] mb-[12px] md:mb-[24px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          Shaped by experience and pressure.{' '}
          Designed To Raise The Standard Of{' '}
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Professional{' '}
          </span>
          work.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b] max-w-[797px] mb-[24px] md:mb-[48px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          MANIFESTR was created from firsthand experience of modern, high-stakes work. The constant demand to deliver, the mental load of scattered tools, and the quiet erosion of focus over time. We exist to simplify execution, restore clarity, and help ambitious professionals operate at their best without compromising wellbeing. This is work, refined.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-[12px] md:gap-[15px] w-full md:w-auto md:justify-center"
        >
          <Link
            href="/about"
            className="h-[48px] md:h-[54px] px-[24px] flex items-center justify-center rounded-[8px] md:rounded-md bg-[#18181b] text-white text-[16px] md:text-[18px] font-medium hover:opacity-90 transition-opacity"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Discover MANIFESTR
          </Link>
          <Link
            href="/tools"
            className="h-[48px] md:h-[54px] px-[24px] flex items-center justify-center rounded-[8px] md:rounded-md border border-[#e4e4e7] bg-white text-[#18181b] text-[16px] md:text-[18px] font-medium hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Explore Our Toolkit
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
