import { motion } from 'framer-motion'
import Link from 'next/link'

const CTA_BG = 'https://www.figma.com/api/mcp/asset/02290400-c2ab-4ac5-bc66-3bea7ba44b13'

export default function ToolCTA() {
  return (
    <section className="relative w-full min-h-[350px] md:min-h-[414px] flex items-center justify-center overflow-hidden py-[48px]">
      <img src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />

      <div className="relative z-10 flex flex-col items-center gap-[24px] px-6 text-center max-w-[700px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-1.2px] text-black"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Ready to </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Get Started?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[16px] md:text-[18px] leading-[26px] text-black/80 max-w-[552px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Pick the plan that fits your needs and start boosting your productivity today. No risk, just results.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-[12px]"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center h-[54px] px-[32px] bg-white text-[#18181b] text-[16px] md:text-[18px] leading-[20px] font-medium rounded-[6px] border border-[#e4e4e7] hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore Pricing
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-[54px] px-[32px] bg-[#18181b] text-white text-[16px] md:text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
