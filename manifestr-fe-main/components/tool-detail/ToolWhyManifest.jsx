import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const IMG_SAND   = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774957277/Rectangle_34624791_eotkfo.jpg'
const IMG_SILK   = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774957276/Rectangle_34624800_juas9i.jpg'
const IMG_WHITE  = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774957276/Rectangle_34624801_wsodkn.jpg'
const IMG_DARK   = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774957276/Rectangle_34624803_jmaxsu.jpg'
const IMG_M_LOGO = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774957296/image_1_xljyis.svg'

const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } }

export default function ToolWhyManifest() {
  return (
    <section className="w-full bg-white py-[48px] md:py-[96px] relative overflow-hidden">

      {/* BOSS watermark */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{
          left: '-100px',
          top: '38%',
          transform: 'rotate(-90deg)',
          transformOrigin: 'center center',
        }}
      >
        <span
          className="text-[150px] leading-none tracking-[-3px] whitespace-nowrap block"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic', color: '#ededed' }}
        >
          BOSS
        </span>
      </div>

      {/* VIBES watermark */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{
          left: '-24px',
          top: '26%',
          transform: 'rotate(-90deg)',
          transformOrigin: 'center center',
        }}
      >
        <span
          className="text-[150px] leading-none tracking-[-3px] whitespace-nowrap block"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: '#ededed' }}
        >
          VIBES
        </span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px] relative z-10">
        {/* Heading */}
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-[32px] md:text-[60px] leading-[34px] md:leading-tight tracking-[-0.64px] md:tracking-[-1.2px] text-center mb-[32px] md:mb-[64px]"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Why </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>choose</span>
          <br className="md:hidden" />
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> MANIFESTR</span>
        </motion.h2>

        {/* Desktop: 4-col × 3-row grid */}
        <div className="hidden md:grid grid-cols-4 gap-[16px]">

          {/* ── ROW 1 ── */}
          <div />

          <motion.div
            {...fadeUp} transition={{ duration: 0.4 }}
            className="col-span-2 bg-[#f4f4f5] rounded-[12px] p-[40px] flex flex-col justify-center min-h-[226px]"
          >
            <h3
              className="text-[32px] leading-[1.2] text-black font-semibold mb-[12px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              1 system. 0 chaos.
            </h3>
            <p
              className="text-[20px] leading-[32px] text-[#52525b]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Professional-grade output, every time. Clear structure, refined presentation, delivery-ready results built to impress.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}
            className="relative rounded-[12px] overflow-hidden min-h-[226px]"
          >
            <CldImage src={IMG_SAND} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[226px]">
              <h3 className="text-[110px] leading-none tracking-[-2.2px] text-[#09090b]" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>1</h3>
              <p className="text-[18px] leading-[24px] font-semibold text-[#09090b] mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Connected system.</p>
            </div>
          </motion.div>

          {/* ── ROW 2 ── */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-[12px] overflow-hidden min-h-[256px]"
          >
            <CldImage src={IMG_SILK} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[256px]">
              <h3 className="text-[90px] leading-none tracking-[-1.8px] text-white" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>95%</h3>
              <p className="text-[18px] leading-[24px] font-semibold text-white mt-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>Less tool switching.</p>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-[12px] flex items-center justify-center min-h-[256px] border border-[#f4f4f5]"
          >
            <CldImage src={IMG_M_LOGO} alt="MANIFESTR" className="w-[144px] h-auto object-contain" />
          </motion.div>

          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}
            className="relative rounded-[12px] overflow-hidden min-h-[256px]"
          >
            <CldImage src={IMG_WHITE} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[256px]">
              <h3 className="text-[90px] leading-none tracking-[-1.8px] text-[#09090b]" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>A - Z</h3>
              <p className="text-[18px] leading-[24px] font-semibold text-[#09090b] mt-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>Idea to delivery.<br />End to end.</p>
            </div>
          </motion.div>

          <div />

          {/* ── ROW 3 ── */}
          <div />

          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}
            className="relative rounded-[12px] overflow-hidden min-h-[251px]"
          >
            <CldImage src={IMG_DARK} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[251px]">
              <h3 className="text-[96px] leading-none tracking-[-1.92px] text-white" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>8 - 10</h3>
              <p className="text-[18px] leading-[24px] font-semibold text-white mt-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>Tools replaced.</p>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}
            className="col-span-2 bg-[#f4f4f5] rounded-[12px] p-[40px] flex flex-col justify-center min-h-[251px]"
          >
            <h3 className="text-[32px] leading-[1.2] text-black font-semibold mb-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>8 - 10 Tools replaced</h3>
            <p className="text-[20px] leading-[32px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Work that once required multiple subscriptions now runs through one system, under one plan: MANIFESTR.
            </p>
          </motion.div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col gap-[16px] md:hidden">
          <motion.div
            {...fadeUp} transition={{ duration: 0.4 }}
            className="bg-[#f4f4f5] rounded-[12px] px-[24px] py-[24px] text-center"
          >
            <h3 className="text-[24px] leading-[29px] text-black font-semibold mb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              One system. Zero chaos.
            </h3>
            <p className="text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Professional-grade output, every time. Clear structure, refined presentation, delivery-ready results built to impress.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-[16px]">
            <motion.div
              {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}
              className="relative rounded-[6px] overflow-hidden h-[149px]"
            >
              <CldImage src={IMG_SILK} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-[16px] text-center">
                <h3 className="text-[48px] leading-none tracking-[-0.96px] text-white" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>95%</h3>
                <p className="text-[16px] leading-[22px] font-semibold text-white mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Less tool switching.</p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}
              className="relative rounded-[6px] overflow-hidden h-[149px]"
            >
              <CldImage src={IMG_WHITE} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-[16px] text-center">
                <h3 className="text-[54px] leading-none tracking-[-1.07px] text-[#09090b]" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>A - Z</h3>
                <p className="text-[16px] leading-[22px] font-semibold text-[#09090b] mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Idea to delivery.<br />End to end.</p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}
              className="relative rounded-[7px] overflow-hidden h-[145px]"
            >
              <CldImage src={IMG_SAND} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-[16px] text-center">
                <h3 className="text-[66px] leading-none tracking-[-1.33px] text-[#09090b]" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>1</h3>
                <p className="text-[16px] leading-[22px] font-semibold text-[#09090b] mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Connected system.</p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}
              className="relative rounded-[6px] overflow-hidden h-[145px]"
            >
              <CldImage src={IMG_DARK} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-[16px] text-center">
                <h3 className="text-[51px] leading-none tracking-[-1.02px] text-white" style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>8 - 10</h3>
                <p className="text-[16px] leading-[22px] font-semibold text-white mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>Tools<br />replaced.</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-[#f4f4f5] rounded-[12px] px-[24px] py-[24px] text-center"
          >
            <h3 className="text-[24px] leading-[29px] text-black font-semibold mb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              8 - 10 Tools replaced.
            </h3>
            <p className="text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Work that once required multiple subscriptions now runs through one system, under one plan: MANIFESTR.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
