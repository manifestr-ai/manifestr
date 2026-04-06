import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

export default function ToolCTA() {
  return (
    <section className="relative w-full min-h-[300px] md:min-h-[414px] flex items-center justify-center overflow-hidden py-[48px]">
      <CldImage src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />

      <div className="relative z-10 flex flex-col items-center gap-[24px] px-6 text-center w-full max-w-[700px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-[12px] items-center"
        >
          <h2 className="text-[32px] md:text-[60px] leading-[48px] md:leading-[72px] tracking-[-0.8px] md:tracking-[-1.2px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Ready to </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Get Started?</span>
          </h2>
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-black/80 max-w-[316px] md:max-w-[552px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Pick the plan that fits your needs and start boosting your productivity today. No risk, just results.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-[12px] w-full sm:w-auto"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center h-[36px] md:h-[54px] px-[12px] md:px-[32px] bg-white text-[#18181b] text-[14px] md:text-[18px] leading-[20px] font-medium rounded-[6px] border border-[#e4e4e7] hover:bg-gray-50 transition-colors w-full sm:w-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore Pricing
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-[36px] md:h-[54px] px-[12px] md:px-[32px] bg-[#18181b] text-white text-[14px] md:text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors w-full sm:w-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
