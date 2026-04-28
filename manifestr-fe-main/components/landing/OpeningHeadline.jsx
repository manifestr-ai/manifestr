import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const IMG_LEFT = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046085/Placeholder_Image_i9heus.png'
const IMG_RIGHT = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046086/Placeholder_Image-1_ldgb49.png'
const IMG_LOGOMARK = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046046/Vector_1_tmgxe4.svg'
const IMG_CIRCLE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046160/Group_jbs8sb.svg'

function ManifestrCircle() {
  return (
    <div className="relative shrink-0 w-[110px] h-[110px] md:w-[150px] md:h-[150px]">
      {/* Outer ring — the full Figma image, continuously rotating */}
      <CldImage
        src={IMG_CIRCLE}
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{ animation: 'spinRing 12s linear infinite' }}
      />

      {/* Static centre — black circle + arrow, sits on top and doesn't rotate */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[52px] h-[52px] md:w-[87px] md:h-[87px] bg-[#18181b] rounded-full flex items-center justify-center">
          <svg
            className="w-[28px] h-[28px] md:w-[44px] md:h-[44px]"
            viewBox="0 0 40 40"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap=""
            strokeLinejoin=""
          >
            <path d="M10 30L30 10" />
            <path d="M13 10h17v17" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function OpeningHeadline() {
  return (
    <section className="relative w-full bg-[#f9fafb] overflow-hidden py-16 md:py-20">
      <style>{`@keyframes spinRing { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px]">

        {/* ── Headline ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid w-full max-w-[1100px] mx-auto grid-cols-1 justify-items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-x-8 lg:gap-x-10 mb-3 md:mb-4"
        >
          <h2
            className="w-full min-w-0 max-w-[900px] text-[30px] sm:text-[44px] md:text-[60px] leading-[34px] sm:leading-[46px] md:leading-[54px] text-black tracking-[-0.6px] md:tracking-[-1.2px] text-center md:col-start-1 md:row-start-1 px-1"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            Professional documentation for
            <br />
            real-world{' '}
            <span
              style={{
                fontFamily: "'IvyPresto Headline', serif",
                fontWeight: 600,
                fontStyle: 'italic',
              }}
            >
              execution.
            </span>
          </h2>

          {/* M. logomark — second grid column on md+ so text and mark never share the same box */}
          <div className="shrink-0 w-[56px] h-[56px] md:w-[96px] md:h-[96px] md:col-start-2 md:row-start-1 md:pt-2">
            <CldImage src={IMG_LOGOMARK} alt="M." className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* ── Body text (on mobile: appears before images) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:hidden text-[18px] text-[#52525b] text-center flex flex-col gap-[18px] mb-6"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
        >
          <p className="leading-[28px]">
            Presentations, documents, spreadsheets, charts, visuals and copy are produced
            inside a single, refined execution system.
          </p>
          <p className="leading-[28px]">
            By removing hours of manual creation, rewrites, editing and tool switching,
            MANIFESTR turns ideas into polished work, ready to deliver.
          </p>
        </motion.div>

        {/* ── Mobile layout: image + circle row, then second image, then sub-headline ─── */}
        <div className="md:hidden mt-12 flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <div className="relative w-[65%] h-[226px] rounded-[6px] overflow-hidden shrink-0">
              <CldImage src={IMG_LEFT} alt="Professional at work" className="absolute inset-0 w-full h-full object-cover object-top" />
            </div>
            <ManifestrCircle />
          </div>
          <div className="relative w-full h-[229px] rounded-[6px] overflow-hidden">
            <CldImage src={IMG_RIGHT} alt="Professional at desk" className="absolute inset-0 w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* ── Sub-headline ─── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:block text-center text-[18px] md:text-[28px] leading-[36px] text-[#18181b] font-medium mt-0 mb-0 md:mb-16"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          You were hired for your expertise, not to format documents.
        </motion.p>

        {/* ── Desktop two-column body (hidden on mobile) ─── */}
        <div className="hidden md:flex flex-row gap-10 items-stretch mt-16">

          {/* Left – tall portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-[39%] shrink-0"
          >
            <div className="relative w-full h-[510px] rounded-[12px] overflow-hidden">
              <CldImage
                src={IMG_LEFT}
                alt="Professional at work"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Right – text + circle + image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col justify-between gap-8 flex-1"
          >
            <div
              className="text-[20px] text-[#52525b] flex flex-col gap-[18px]"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              <p className="leading-[28px]">
                Presentations, documents, spreadsheets, charts, visuals and copy are produced
                inside a single, refined execution system.
              </p>
              <p className="leading-[28px]">
                By removing hours of manual creation, rewrites, editing and tool switching,
                MANIFESTR turns ideas into polished work, ready to deliver.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <ManifestrCircle />

              <div className="relative flex-1 h-[300px] rounded-[12px] overflow-hidden">
                <CldImage
                  src={IMG_RIGHT}
                  alt="Professional at desk"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
