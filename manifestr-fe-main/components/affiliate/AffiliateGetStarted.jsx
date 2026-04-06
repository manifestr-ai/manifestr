import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const SAND_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

export default function AffiliateGetStarted() {
  return (
    <section className="relative w-full overflow-hidden min-h-[414px]">
      {/* Sandy texture background */}
      <div className="absolute inset-0">
        <CldImage src={SAND_BG} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-[48px] md:py-[92px] flex flex-col items-center text-center gap-[24px] md:gap-[32px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-[12px] items-center"
        >
          <h2
            className="text-[32px] md:text-[60px] leading-[48px] md:leading-[72px] tracking-[-0.8px] md:tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Ready to </span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Get Started?</span>
          </h2>
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-black max-w-[316px] md:max-w-[552px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Pick the plan that fits your needs and start boosting your productivity today. No risk, just results.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col md:flex-row items-center gap-[12px] w-full md:w-auto md:justify-center"
        >
          <Link
            href="/pricing"
            className="bg-white border border-[#e4e4e7] text-[#18181b] text-[14px] md:text-[18px] leading-[20px] font-medium h-[36px] md:h-[54px] px-[12px] md:px-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#f4f4f5] transition-colors duration-200 w-full md:w-auto"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Explore Pricing
          </Link>
          <Link
            href="/signup"
            className="bg-[#18181b] text-white text-[14px] md:text-[18px] leading-[20px] font-medium h-[36px] md:h-[54px] px-[12px] md:px-[32px] rounded-[6px] flex items-center justify-center hover:bg-[#333] transition-colors duration-200 w-full md:w-auto"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
