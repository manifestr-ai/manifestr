import { motion } from 'framer-motion'

const IMG_SAND   = 'https://www.figma.com/api/mcp/asset/f190339d-3847-48b1-9cf1-fd284292aa0d'
const IMG_SILK   = 'https://www.figma.com/api/mcp/asset/0f863d4b-a83e-4878-9f6f-3b2588ef4f13'
const IMG_WHITE  = 'https://www.figma.com/api/mcp/asset/65882be8-ecd2-40dd-b42d-3655543a2d65'
const IMG_DARK   = 'https://www.figma.com/api/mcp/asset/0f6e7047-5412-4c89-bb6d-d78b9ffbf1c8'
const IMG_M_LOGO = 'https://www.figma.com/api/mcp/asset/90748245-9a14-475b-8230-58bc61d837cf'

const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } }

export default function ToolWhyManifest() {
  return (
    <section className="w-full bg-white py-[64px] md:py-[96px] relative overflow-hidden">

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
          className="text-[36px] md:text-[60px] leading-tight tracking-[-1.2px] text-center mb-[48px] md:mb-[64px]"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Why </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>choose</span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> MANIFESTR</span>
        </motion.h2>

        {/* 4-col × 3-row grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">

          {/* ── ROW 1 ── */}
          {/* Col 1: empty */}
          <div className="hidden md:block" />

          {/* Col 2-3: "1 system. 0 chaos." text card */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4 }}
            className="md:col-span-2 bg-[#f4f4f5] rounded-[12px] p-[32px] md:p-[40px] flex flex-col justify-center min-h-[226px]"
          >
            <h3
              className="text-[28px] md:text-[32px] leading-[1.2] text-black font-semibold mb-[12px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              1 system. 0 chaos.
            </h3>
            <p
              className="text-[18px] md:text-[20px] leading-[32px] text-[#52525b]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Professional-grade output, every time. Clear structure, refined presentation, delivery-ready results built to impress.
            </p>
          </motion.div>

          {/* Col 4: "1 Connected system" sand image */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}
            className="relative rounded-[12px] overflow-hidden min-h-[226px]"
          >
            <img src={IMG_SAND} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[226px]">
              <h3
                className="text-[80px] md:text-[110px] leading-none tracking-[-2.2px] text-[#09090b]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                1
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[24px] font-semibold text-[#09090b] mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Connected system.
              </p>
            </div>
          </motion.div>

          {/* ── ROW 2 ── */}
          {/* Col 1: 95% silk */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-[12px] overflow-hidden min-h-[256px]"
          >
            <img src={IMG_SILK} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[256px]">
              <h3
                className="text-[72px] md:text-[90px] leading-none tracking-[-1.8px] text-white"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                95%
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[24px] font-semibold text-white mt-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Less tool switching.
              </p>
            </div>
          </motion.div>

          {/* Col 2: M. Logo */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-[12px] flex items-center justify-center min-h-[256px] border border-[#f4f4f5]"
          >
            <img src={IMG_M_LOGO} alt="MANIFESTR" className="w-[100px] md:w-[144px] h-auto object-contain" />
          </motion.div>

          {/* Col 3: A-Z white texture */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}
            className="relative rounded-[12px] overflow-hidden min-h-[256px]"
          >
            <img src={IMG_WHITE} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[256px]">
              <h3
                className="text-[72px] md:text-[90px] leading-none tracking-[-1.8px] text-[#09090b]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                A - Z
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[24px] font-semibold text-[#09090b] mt-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Idea to delivery.<br />End to end.
              </p>
            </div>
          </motion.div>

          {/* Col 4: empty */}
          <div className="hidden md:block" />

          {/* ── ROW 3 ── */}
          {/* Col 1: empty */}
          <div className="hidden md:block" />

          {/* Col 2: 8-10 dark water image */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}
            className="relative rounded-[12px] overflow-hidden min-h-[251px]"
          >
            <img src={IMG_DARK} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-[24px] text-center min-h-[251px]">
              <h3
                className="text-[72px] md:text-[96px] leading-none tracking-[-1.92px] text-white"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                8 - 10
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[24px] font-semibold text-white mt-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tools replaced.
              </p>
            </div>
          </motion.div>

          {/* Col 3-4: "8-10 Tools replaced" text card */}
          <motion.div
            {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}
            className="md:col-span-2 bg-[#f4f4f5] rounded-[12px] p-[32px] md:p-[40px] flex flex-col justify-center min-h-[251px]"
          >
            <h3
              className="text-[28px] md:text-[32px] leading-[1.2] text-black font-semibold mb-[12px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              8 - 10 Tools replaced
            </h3>
            <p
              className="text-[18px] md:text-[20px] leading-[32px] text-[#52525b]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Work that once required multiple subscriptions now runs through one system, under one plan: MANIFESTR.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
