import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const SCREENSHOT_1 = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041143/Frame_2147229006_vgvz4y.png'
const SCREENSHOT_2 = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041143/Frame_2147229632_c2dhnl.png'

export default function ByProfessionals() {
  return (
    <section className="w-full bg-white overflow-hidden py-[48px] md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-left md:text-center text-[18px] md:text-[24px] leading-[normal] md:leading-[24px] tracking-[-0.36px] md:tracking-[0.48px] uppercase text-black mb-[24px] md:mb-[20px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          BY PROFESSIONAL. FOR PROFESSIONALS.
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-[24px] md:text-[36px] leading-[32px] md:leading-[49px] tracking-[-0.48px] md:tracking-[-0.72px] text-black max-w-[964px] mx-auto mb-[24px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Designed for the pace, the polish, the pressure, and the quality that set great work apart.
        </motion.h2>

        {/* Body text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525c] max-w-[755px] mx-auto mb-[24px] md:mb-[48px] space-y-[16px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          <p>
            No more juggling ten tools or drowning in messy files. No more losing days to formatting and version control.
          </p>
          <p>
            MANIFESTR streamlines everything you need to deliver at the highest level: decks, briefs, proposals, reports, strategies, timelines, analysis, charts, copy, and creative assets. Every output is sleek, professional, and executive-ready in a fraction of the time.
          </p>
        </motion.div>

        {/* Two screenshots */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-[16px] md:gap-[52px] mb-[48px] md:mb-[64px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[10px] md:rounded-[6px] overflow-hidden h-[263px] md:h-auto"
          >
            <CldImage
              src={SCREENSHOT_1}
              alt="MANIFESTR platform screenshot"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[10px] md:rounded-[6px] overflow-hidden h-[263px] md:h-auto"
          >
            <CldImage
              src={SCREENSHOT_2}
              alt="MANIFESTR platform screenshot"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* CTA Buttons — hidden on mobile (not shown in Figma mobile), shown on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex flex-wrap gap-[15px] justify-center"
        >
          <Link
            href="/pricing"
            className="h-[54px] px-[32px] flex items-center justify-center rounded-md border border-black bg-white text-[#18181b] text-[18px] font-medium hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Explore Pricing
          </Link>
          <Link
            href="/signup"
            className="h-[54px] px-[32px] flex items-center justify-center rounded-md bg-[#18181b] text-white text-[18px] font-medium hover:opacity-90 transition-opacity"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Get Started Now
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
