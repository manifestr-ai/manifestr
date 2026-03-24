import { motion } from 'framer-motion'
import Link from 'next/link'

const FASHION_IMG = 'https://www.figma.com/api/mcp/asset/48b890f7-a6dd-4391-9597-a67340e14229'
const FOUNDER_NAME = 'https://www.figma.com/api/mcp/asset/7c886b96-9da1-4a17-94ad-e24b0ea39eb8'
const SIGNATURE = 'https://www.figma.com/api/mcp/asset/24d48918-3764-4436-98ea-9c2da66bf9f4'

export default function TheNewEra() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* Split background — white top 126px, stone below */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-[80px] md:h-[126px] bg-white" />
        <div className="flex-1 bg-[#deddda] h-[calc(100%-126px)]" />
      </div>

      {/* "THE nEW ERA" watermark */}
      {/* ─── POSITION CONTROLS ────────────────────────────────────────
           top      → move DOWN  (e.g. top-[200px])
           bottom   → move UP    (e.g. bottom-[100px]) — remove top if using this
           right    → move LEFT  (e.g. right-[0px] = flush right, right-[200px] = further left)
           left     → move RIGHT (e.g. left-[200px]) — remove right if using this
           text-[Xpx] → font size (bigger = more space needed)
           leading-[Xpx] → gap between lines (bigger = more vertical spread)
      ──────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <p
          className="absolute
                     top-[126px]
                    
                     right-[400px]
                     text-[140px] md:text-[320px]
                     leading-[130px] md:leading-[260px]
                     tracking-[-7.64px] text-right"
          style={{
            fontFamily: "'IvyPresto Headline', serif",
            fontWeight: 600,
            fontStyle: 'italic',
            background: 'linear-gradient(to left, rgba(255,255,255,0.64) 0%, rgba(247,246,245,0.64) 8.248%, rgba(227,226,223,0.74) 77.465%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          THE<br />nEW<br />ERA
        </p>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row
                       min-h-[640px] md:min-h-[957px]">

        {/* ── Left content ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-[50%] px-6 md:px-0 md:pl-[123px] md:pr-[40px]
                     pt-[100px] md:pt-[247px] pb-[60px] md:pb-[80px]
                     flex flex-col justify-start"
        >
          {/* Label */}
          <p
            className="text-[20px] md:text-[24px] leading-[24px] tracking-[0.48px]
                       uppercase text-[rgba(24,24,27,0.32)] mb-[32px] md:mb-[56px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            THE NEW ERA OF WORK
          </p>

          {/* Heading */}
          <h3
            className="text-[28px] md:text-[36px] leading-[1.36] md:leading-[49px]
                       tracking-[-0.72px] text-black mb-[24px] max-w-[554px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            With MANIFESTR, You Don&rsquo;t Just Keep Up. You Set The Standard.
          </h3>

          {/* Body */}
          <div
            className="text-[15px] md:text-[18px] leading-[26px] text-[#52525b]
                       space-y-[16px] mb-[40px] md:mb-[56px] max-w-[506px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            <p>
              MANIFESTR saves your time. It protects your spark. It puts you back where you belong: thinking big, leading strong, delivering at the top.
            </p>
            <p>This is the new era of work.</p>
          </div>

          {/* Signature area */}
          <div className="flex items-end gap-[12px] mb-[44px] md:mb-[56px]">
            <img
              src={FOUNDER_NAME}
              alt="Leah O'Brien — Founder"
              className="h-[48px] md:h-[53px] w-auto object-contain"
            />
            <img
              src={SIGNATURE}
              alt="Leah signature"
              className="h-[90px] md:h-[112px] w-auto object-contain"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-[15px]">
            <Link
              href="/tools"
              className="h-[54px] px-[32px] flex items-center justify-center rounded-md
                         border border-[#e4e4e7] bg-white text-[#18181b] text-[18px] font-medium
                         hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Explore Our Toolkit
            </Link>
            <Link
              href="/signup"
              className="h-[54px] px-[32px] flex items-center justify-center rounded-md
                         bg-[#18181b] text-white text-[18px] font-medium
                         hover:opacity-90 transition-opacity"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Get Started Now
            </Link>
          </div>
        </motion.div>

        {/* ── Right: fashion woman — starts above the stone bg, overlaps both zones ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="w-full md:w-[50%] relative min-h-[420px] md:min-h-0
                     md:mt-[26px]"
        >
          <img
            src={FASHION_IMG}
            alt="Professional woman in dramatic black outfit"
            className="w-full h-full object-cover object-top absolute inset-0"
          />
        </motion.div>

      </div>
    </section>
  )
}
