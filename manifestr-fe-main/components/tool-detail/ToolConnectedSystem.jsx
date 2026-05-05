import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import CldImage from '../ui/CldImage'

const SECTION_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777351553/Tools_DESKTOP_Light_Version_ia9ylz.webp'
const SECTION_IMAGE_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777351549/Tools_MOBILE_Light_Version_ihx1fw.webp'

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
              className="text-[32px] leading-[39px] mt-2 tracking-[-0.64px] text-center mb-[8px]"
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

      {/* ── Desktop layout (md+) — scales for ~770px–1300px viewports ── */}
      <div className="hidden md:block relative">
        <CldImage src={SECTION_IMAGE} alt="" className="w-full h-auto block" />

        <div className="absolute inset-0 z-10 flex items-center justify-start px-6 md:px-8 lg:px-12 xl:px-14 min-[1300px]:px-[72px]">
          <div className="w-full min-w-0 text-left md:max-lg:max-w-[min(280px,36vw)] lg:max-w-[min(440px,44vw)] xl:max-w-[min(468px,42vw)] min-[1300px]:max-w-[488px]">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[28px] leading-[1.1] tracking-[-0.56px] mb-4 lg:text-[44px] lg:leading-[1.14] lg:tracking-[-0.88px] lg:mb-6 xl:text-[48px] xl:tracking-[-0.96px] min-[1300px]:text-[54px] min-[1300px]:leading-[1.15] min-[1300px]:tracking-[-1.08px] min-[1300px]:mb-[24px]"
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
              className="mb-5 lg:mb-8 min-[1300px]:mb-[32px]"
            >
              <p
                className="text-[14px] leading-[22px] text-[#18181b] lg:text-[17px] lg:leading-[27px] min-[1300px]:text-[18px] min-[1300px]:leading-[28px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Designed so work evolves, not resets.
              </p>
              <p
                className="text-[14px] leading-[22px] text-[#18181b] lg:text-[17px] lg:leading-[27px] min-[1300px]:text-[18px] min-[1300px]:leading-[28px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
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
                className="inline-flex items-center gap-[6px] h-[38px] px-5 text-[13px] bg-[#18181b] text-white font-medium rounded-[6px] hover:bg-[#27272a] transition-colors lg:h-[44px] lg:gap-[8px] lg:px-[24px] lg:text-[14px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Enter MANIFESTR{' '}
                <ArrowUpRight className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px]" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
