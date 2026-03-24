import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const SECTION_IMAGE = 'https://www.figma.com/api/mcp/asset/93c7c4e1-0ac0-4a62-8e9b-2f2bafc1e063'

export default function ToolConnectedSystem() {
  return (
    <section className="relative w-full overflow-hidden">
      <img src={SECTION_IMAGE} alt="" className="w-full h-auto block" />

      <div className="absolute inset-0 z-10 px-6 md:px-[72px] flex items-center">
        <div className="max-w-[488px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[32px] md:text-[54px] leading-[1.15] tracking-[-1.08px] mb-[24px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Your </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Connected</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}> Execution System</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-[32px]"
          >
            <p className="text-[16px] md:text-[18px] leading-[28px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Designed so work evolves, not resets.
            </p>
            <p className="text-[16px] md:text-[18px] leading-[28px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Every output becomes the next input.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-[8px] h-[44px] px-[24px] bg-[#18181b] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR <ArrowUpRight className="w-[16px] h-[16px]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
