import { motion } from 'framer-motion'
import Link from 'next/link'

const CTA_BG = 'https://www.figma.com/api/mcp/asset/169d7f7f-9776-4e31-98ab-a09090da6e2c'

export default function ToolsCTA() {
  return (
    <section className="relative w-full h-[350px] md:h-[414px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={CTA_BG} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-[24px] px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[40px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-1.2px] text-black"
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
          className="text-[16px] md:text-[18px] leading-[26px] text-black max-w-[626px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Choose the plan that aligns with how you work and unlock a more focused, structured way to deliver at a higher standard.
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
            className="inline-flex items-center justify-center h-[54px] px-[32px] bg-white text-[#18181b] text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-gray-100 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            View Plans
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-[54px] px-[32px] bg-[#18181b] text-white text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Enter MANIFESTR
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
