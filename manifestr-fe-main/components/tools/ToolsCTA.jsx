import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

export default function ToolsCTA() {
  return (
    <section className="relative w-full h-[380px] md:h-[414px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <CldImage src={CTA_BG} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-[24px] px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[40px] md:text-[60px] leading-[45px] md:leading-[72px] tracking-[-0.8px] md:tracking-[-1.2px] text-black"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            The Next Era of Work{' '}
          </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Starts Here
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[16px] leading-[24px] text-black max-w-[316px] md:max-w-[626px] md:text-[18px] md:leading-[26px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="md:hidden">
            Pick the plan that fits your needs and start boosting your
            productivity today.<br />No risk, just results.
          </span>
          <span className="hidden md:inline">
            Choose the plan that aligns with how you work and unlock a more
            focused, structured way to deliver at a higher standard.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col w-full max-w-[316px] md:max-w-none md:w-auto md:flex-row gap-[12px]"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center h-[54px] min-h-[54px] px-[12px] md:px-[32px] bg-white border border-[#e4e4e7] text-[#18181b] text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-gray-100 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="md:hidden">Explore Pricing</span>
            <span className="hidden md:inline">View Plans</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-[54px] min-h-[54px] px-[12px] md:px-[32px] bg-[#18181b] text-white text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="md:hidden">Get Started Now</span>
            <span className="hidden md:inline">Enter MANIFESTR</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
