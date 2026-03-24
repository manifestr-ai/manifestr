import { motion } from 'framer-motion'
import Link from 'next/link'

const SAND_BG = 'https://www.figma.com/api/mcp/asset/b5d3de96-bfd5-4eab-899d-e86ba7c1c4e1'

export default function AffiliateGetStarted() {
  return (
    <section className="relative w-full overflow-hidden min-h-[414px]">
      {/* Sandy texture background */}
      <div className="absolute inset-0">
        <img src={SAND_BG} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-[80px] md:py-[92px] flex flex-col items-center text-center gap-[32px]">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[40px] md:text-[60px] leading-[72px] tracking-[-1.2px] text-black"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Ready to </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Get Started?</span>
        </motion.h2>

        <p
          className="text-[18px] leading-[26px] text-black max-w-[552px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Pick the plan that fits your needs and start boosting your productivity today. No risk, just results.
        </p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-[12px] flex-wrap justify-center"
        >
          <Link
            href="/pricing"
            className="bg-white text-[#18181b] text-[18px] leading-[20px] font-medium h-[54px] px-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#f4f4f5] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Explore Pricing
          </Link>
          <Link
            href="/signup"
            className="bg-[#18181b] text-white text-[18px] leading-[20px] font-medium h-[54px] px-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#333] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
