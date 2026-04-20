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
          className="absolute text-right
                     md:max-lg:top-[126px] md:max-lg:right-6 md:max-lg:text-[min(22vw,160px)] md:max-lg:leading-[0.82] md:max-lg:tracking-[-3px]
                     lg:top-[126px] lg:max-xl:right-32 lg:text-[320px] lg:leading-[260px] lg:tracking-[-7.64px]
                     xl:right-[400px]"
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
      <div
        className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-0 items-stretch
                       md:max-lg:items-center md:max-lg:min-h-[720px]
                       lg:items-stretch lg:max-xl:min-h-[800px] xl:min-h-[957px]"
      >

        {/* ── Left content ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-[50%] flex flex-col justify-start
                     px-6 pt-[48px] pb-[48px] gap-[24px]
                     md:max-lg:px-8 md:max-lg:pt-28 md:max-lg:pb-12 md:max-lg:gap-5
                     lg:px-0 lg:pr-[40px] lg:gap-0
                     lg:max-xl:pl-24 lg:max-xl:pt-40 lg:max-xl:pb-14
                     xl:pl-[123px] xl:pt-[247px] xl:pb-[80px]"
        >
          {/* Label */}
          <p
            className="text-[16px] leading-[24px] tracking-[0.32px] uppercase text-[rgba(0,0,0,0.3)]
                       md:max-lg:text-[20px] md:max-lg:leading-[28px] md:max-lg:tracking-[0.4px] md:max-lg:mb-10
                       lg:text-[24px] lg:leading-[24px] lg:tracking-[0.48px] lg:mb-[56px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            THE NEW ERA OF WORK
          </p>

          {/* Heading */}
          <h3
            className="text-[28px] leading-[36px] tracking-[-0.56px] text-black max-w-[317px]
                       md:max-lg:text-[32px] md:max-lg:leading-[40px] md:max-lg:tracking-[-0.64px] md:max-lg:mb-5 md:max-lg:max-w-[min(420px,42vw)]
                       lg:text-[36px] lg:leading-[49px] lg:tracking-[-0.72px] lg:mb-[24px] lg:max-w-[554px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            With MANIFESTR, you don&rsquo;t just keep up. You set the standard.
          </h3>

          {/* Body paragraph 1 */}
          <p
            className="text-[16px] leading-[24px] text-[#52525c] max-w-[339px]
                       md:max-lg:text-[17px] md:max-lg:leading-[25px] md:max-lg:max-w-[min(440px,42vw)]
                       lg:text-[18px] lg:leading-[26px] lg:max-w-[506px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            MANIFESTR saves your time. It protects your spark. It puts you back where you belong: thinking big, leading strong, delivering at the top.
          </p>

          {/* Body paragraph 2 */}
          <p
            className="text-[16px] leading-[24px] text-[#52525c]
                       md:max-lg:text-[17px] md:max-lg:leading-[25px] md:max-lg:mb-10
                       lg:text-[18px] lg:leading-[26px] lg:mb-[56px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            This is the new era of work.
          </p>

          {/* Signature area — desktop: side by side; mobile: stacked with overlapping fashion image */}
          <div className="hidden md:flex items-end gap-[12px] md:max-lg:mb-10 lg:mb-[56px]">
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
            <div className="absolute left-0 top-[29.5px] flex flex-col gap-[8px]">
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
            <div className="absolute left-[60px] -top-[64px] w-[330px] h-[330px]">
              <CldImage
                src={FASHION_IMG}
                alt="Professional woman"
                className="w-full h-full object-contain object-right-top"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-[12px] w-full md:max-lg:gap-3 md:max-lg:w-auto lg:gap-[15px] lg:w-auto">
            <Link
              href="/tools"
              className="w-full z-10 h-[48px] px-[24px] flex items-center justify-center rounded-[8px] bg-white text-[#18181b] text-[16px] font-medium
                         hover:bg-gray-50 transition-colors
                         md:max-lg:w-auto md:max-lg:h-[50px] md:max-lg:px-6 md:max-lg:rounded-md md:max-lg:border md:max-lg:border-[#e4e4e7] md:max-lg:text-[17px]
                         lg:w-auto lg:h-[54px] lg:px-[32px] lg:rounded-md lg:border lg:border-[#e4e4e7] lg:text-[18px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Explore Our Toolkit
            </Link>
            <Link
              href="/signup"
              className="w-full h-[48px] px-[24px] flex items-center justify-center rounded-[8px] bg-[#18181b] text-white text-[16px] font-medium
                         hover:opacity-90 transition-opacity
                         md:max-lg:w-auto md:max-lg:h-[50px] md:max-lg:px-6 md:max-lg:rounded-md md:max-lg:text-[17px]
                         lg:w-auto lg:h-[54px] lg:px-[32px] lg:rounded-md lg:text-[18px]"
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
          className="hidden md:block w-full md:w-[50%] relative min-h-[420px] md:max-lg:min-h-[460px] md:max-lg:mt-115
                       lg:max-xl:min-h-[min(380px,42vh)] lg:max-xl:mt-3
                       lg:min-h-0 lg:mt-[26px] xl:min-h-0"
        >
          <CldImage
            src={FASHION_IMG}
            alt="Professional woman in dramatic black outfit"
            className="absolute inset-0 h-full w-full object-cover lg:max-xl:object-left object-top
                       md:max-lg:left-10 md:max-lg:object-[right_top]
                       lg:max-xl:left-16 lg:max-xl:object-[right_top]
                       xl:left-[40px] xl:object-center xl:object-top"
          />
        </motion.div>

      </div>
    </section>
  )
}
