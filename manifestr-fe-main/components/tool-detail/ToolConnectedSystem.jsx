import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import CldImage from '../ui/CldImage'

const SECTION_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774956290/Group_1577709283_kifbjh.jpg'
const SECTION_IMAGE_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774956258/Frame_2147230209_uakfxc.jpg'

export default function ToolConnectedSystem() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* ── Mobile layout ── */}
      <div className="md:hidden relative">
        <CldImage src={SECTION_IMAGE_MOBILE} alt="MANIFESTR connected tools" className="w-full h-auto block" />

        <div className="absolute inset-0 z-10 flex flex-col">
          <div className="px-6 pt-[16px]">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[32px] leading-[39px] tracking-[-0.64px] text-center mb-[8px]"
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
              className="text-center"
            >
              <p className="text-[16px] leading-[28px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Designed so work evolves, not resets.
              </p>
              <p className="text-[16px] leading-[28px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Every output becomes the next input.
              </p>
            </motion.div>
          </div>

          <div className="mt-auto flex justify-center pb-[68px]">
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
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden md:block relative">
        <CldImage src={SECTION_IMAGE} alt="" className="w-full h-auto block" />

        <div className="absolute inset-0 z-10 px-[72px] flex items-center justify-start">
          <div className="max-w-[488px] text-left">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[54px] leading-[1.15] tracking-[-1.08px] mb-[24px]"
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
              <p className="text-[18px] leading-[28px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Designed so work evolves, not resets.
              </p>
              <p className="text-[18px] leading-[28px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
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
      </div>
    </section>
  )
}
