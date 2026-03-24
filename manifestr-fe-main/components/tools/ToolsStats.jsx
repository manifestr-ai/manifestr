import { motion } from 'framer-motion'
import Link from 'next/link'

const STAT_IMAGE = 'https://www.figma.com/api/mcp/asset/71364439-9868-47b7-b8f2-641a35117e2e'
const CLOCK_ICON = 'https://www.figma.com/api/mcp/asset/3ace5a10-3d9e-4985-acb9-f16356ee07fa'
const ROCKET_ICON = 'https://www.figma.com/api/mcp/asset/c619cb91-ebd8-4b9b-a8cc-e493660520d8'

export default function ToolsStats() {
  return (
    <section className="w-full bg-white px-6 md:px-[80px] py-[64px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-start gap-[48px] lg:gap-[60px]">
        {/* Left - 2x2 stat card grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 gap-[24px]">
          {/* 8+ hours saved */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-[338px] h-[173px] rounded-[12px] bg-black p-[24px] flex flex-col justify-between"
          >
            <img src={CLOCK_ICON} alt="" className="w-[70px] h-[70px]" />
            <div className="flex items-end gap-[16px]">
              <h3
                className="text-[36px] md:text-[48px] leading-[55px] tracking-[-0.96px] text-white"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                8+
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[24px] text-white pb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Hours saved per week
              </p>
            </div>
          </motion.div>

          {/* 70% reduction */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full md:w-[338px] h-[173px] rounded-[12px] bg-[#f4f4f5] p-[24px] flex flex-col justify-between"
          >
            <h3
              className="text-[36px] md:text-[48px] leading-[55px] tracking-[-0.96px] text-[#18181b]"
              style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
            >
              70%
            </h3>
            <div>
              <p className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b] mb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Reduction in preparation time
              </p>
              <div className="w-full h-[8px] bg-white rounded-[4px]">
                <div className="h-full bg-black rounded-[4px]" style={{ width: '74%' }} />
              </div>
            </div>
          </motion.div>

          {/* Photo card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-[338px] h-[173px] rounded-[12px] overflow-hidden"
          >
            <img src={STAT_IMAGE} alt="" className="w-full h-full object-cover" />
          </motion.div>

          {/* 3-5x faster */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full md:w-[338px] h-[173px] rounded-[12px] bg-[#f4f4f5] p-[24px] flex flex-col justify-between"
          >
            <img src={ROCKET_ICON} alt="" className="w-[70px] h-[70px]" />
            <div className="flex items-end gap-[16px]">
              <h3
                className="text-[36px] md:text-[48px] leading-[55px] tracking-[-0.96px] text-[#18181b]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                3 - 5x
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b] pb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Faster project delivery
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right - Text content */}
        <div className="w-full lg:flex-1 flex flex-col gap-[18px] lg:pt-[20px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[40px] md:text-[72px] leading-tight md:leading-[78px] tracking-[-1.44px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              How high performing{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              teams{' '}
            </span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              use MANIFESTR
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[16px] leading-[24px] text-[#52525b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            MANIFESTR enables teams to work with greater focus, clarity and control, delivering higher-quality output in less time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-[22px]"
          >
            <Link
              href="#"
              className="inline-flex items-center justify-center h-[54px] px-[32px] bg-[#18181b] text-white text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore MANIFESTR
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-[1280px] mx-auto mt-[40px] text-[16px] leading-[20px] text-[#71717a]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        These results are driven by{' '}
        <span className="font-bold text-[#71717a]">MANIFESTR&apos;s</span> intelligence, embedded across every tool.
      </motion.p>
    </section>
  )
}
