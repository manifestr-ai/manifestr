import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const FASHION_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041143/52_modern-founder_flared-pants-dramatic-pose-01b_3_e1gwx2.png'
const FOUNDER_NAME = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041647/Name_1_sw09qh.png'
const SIGNATURE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041142/Signature_2_bq9bvv.png'

export default function TheNewEra() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* Split background — white top on desktop, all stone on mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden md:block h-[126px] bg-white" />
        <div className="bg-[#deddda] h-full md:h-[calc(100%-126px)]" />
      </div>

      {/* "THE nEW ERA" watermark — desktop only */}
      <div
        className="absolute inset-0 pointer-events-none select-none hidden md:block"
        aria-hidden="true"
      >
        <p
          className="absolute top-[126px] right-[400px]
                     text-[320px] leading-[260px] tracking-[-7.64px] text-right"
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
                       min-h-0 md:min-h-[957px]">

        {/* ── Left content ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-[50%] px-6 md:px-0 md:pl-[123px] md:pr-[40px]
                     pt-[48px] md:pt-[247px] pb-[48px] md:pb-[80px]
                     flex flex-col justify-start gap-[24px] md:gap-0"
        >
          {/* Label */}
          <p
            className="text-[16px] md:text-[24px] leading-[24px] tracking-[0.32px] md:tracking-[0.48px]
                       uppercase text-[rgba(0,0,0,0.3)] md:mb-[56px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            THE NEW ERA OF WORK
          </p>

          {/* Heading */}
          <h3
            className="text-[28px] md:text-[36px] leading-[36px] md:leading-[49px]
                       tracking-[-0.56px] md:tracking-[-0.72px] text-black md:mb-[24px] max-w-[317px] md:max-w-[554px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            With MANIFESTR, you don&rsquo;t just keep up. You set the standard.
          </h3>

          {/* Body paragraph 1 */}
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525c] max-w-[339px] md:max-w-[506px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            MANIFESTR saves your time. It protects your spark. It puts you back where you belong: thinking big, leading strong, delivering at the top.
          </p>

          {/* Body paragraph 2 */}
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525c] md:mb-[56px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            This is the new era of work.
          </p>

          {/* Signature area — desktop: side by side; mobile: stacked with overlapping fashion image */}
          <div className="hidden md:flex items-end gap-[12px] md:mb-[56px]">
            <CldImage
              src={FOUNDER_NAME}
              alt="Leah O'Brien — Founder"
              className="h-[53px] w-auto object-contain"
            />
            <CldImage
              src={SIGNATURE}
              alt="Leah signature"
              className="h-[112px] w-auto object-contain"
            />
          </div>
          <div className="md:hidden relative h-[195px] w-full">
            <div className="absolute left-0 top-[30px] flex flex-col gap-[8px]">
              <CldImage
                src={FOUNDER_NAME}
                alt="Leah O'Brien — Founder"
                className="h-[48px] w-[96px] object-contain"
              />
              <CldImage
                src={SIGNATURE}
                alt="Leah signature"
                className="h-[80px] w-[128px] object-contain"
              />
            </div>
            <div className="absolute left-[117px] -top-[57px] w-[278px] h-[276px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <CldImage
                  src={FASHION_IMG}
                  alt="Professional woman"
                  className="absolute left-0 w-full max-w-none"
                  style={{ height: '158.83%', top: '-0.91%' }}
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-[12px] md:gap-[15px]">
            <Link
              href="/tools"
              className="h-[48px] md:h-[54px] px-[24px] md:px-[32px] flex items-center justify-center rounded-[8px] md:rounded-md
                         bg-white md:border md:border-[#e4e4e7] text-[#18181b] text-[16px] md:text-[18px] font-medium
                         hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Explore Our Toolkit
            </Link>
            <Link
              href="/signup"
              className="h-[48px] md:h-[54px] px-[24px] md:px-[32px] flex items-center justify-center rounded-[8px] md:rounded-md
                         bg-[#18181b] text-white text-[16px] md:text-[18px] font-medium
                         hover:opacity-90 transition-opacity"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Get Started Now
            </Link>
          </div>
        </motion.div>

        {/* ── Right: fashion woman — desktop only (hidden on mobile as per Figma) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="hidden md:block w-full md:w-[50%] relative min-h-[420px] md:min-h-0 md:mt-[26px]"
        >
          <CldImage
            src={FASHION_IMG}
            alt="Professional woman in dramatic black outfit"
            className="w-full h-full object-cover object-top absolute inset-0"
          />
        </motion.div>

      </div>
    </section>
  )
}
