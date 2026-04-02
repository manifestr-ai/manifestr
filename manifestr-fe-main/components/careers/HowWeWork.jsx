import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const CUTOUT_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026433/21_Cutout_1_1_owaxmo.png'

const ICONS = {
  shield: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025697/Vector_jaay6l.svg',
  idea: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025695/idea_7_1_iogczx.svg',
  target: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025696/target_7_1_ltrsvr.svg',
  medal: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025698/Group_z5ouzd.svg',
}

function IconBox({ icon }) {
  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden">
      <CldImage src={icon} alt="" className="absolute inset-0 w-full h-full object-contain" />
    </div>
  )
}

const VALUES = [
  { title: 'Protect Your Brilliance', desc: 'Your best work comes when ambition and wellbeing go hand in hand. We remove the grind so you can think bigger, lead stronger, and deliver at the top.', icon: ICONS.shield },
  { title: 'Idea to Impact', desc: 'We believe execution turns vision into reality. Our tools and our culture move ideas forward into results that matter.', icon: ICONS.idea },
  { title: 'Build What Matters', desc: 'We do not build hype. We build with purpose, solving real problems and shaping tools that truly matter.', icon: ICONS.target },
  { title: 'Win Together', desc: 'The best work happens when collaboration flows freely. We celebrate wins, learn from challenges, and grow side by side.', icon: ICONS.medal },
]

function ValueCard({ value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white border border-[#e4e4e7] rounded-[12px] p-[24px]
                 shadow-[0px_8px_22.6px_0px_rgba(43,43,43,0.07)]
                 flex flex-col gap-[24px] w-[295px] shrink-0 md:w-[308px] md:shrink md:h-[310px]"
    >
      <IconBox icon={value.icon} />
      <div className="flex flex-col gap-[8px]">
        <h3
          className="text-[24px] leading-[32px] text-black"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          {value.title}
        </h3>
        <p
          className="text-[16px] leading-[24px] text-[#52525b]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          {value.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function HowWeWork() {
  return (
    <section className="relative w-full bg-[#deddda] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[72px] pt-[48px] md:pt-[79px] pb-0">

        {/* Section heading */}
        <div className="text-center mb-[20px] md:mb-[20px]">
          <h2 className="text-[30px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.6px] md:tracking-[-1.2px] text-black max-w-[266px] md:max-w-none mx-auto">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>How We </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Work</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>, What We Believe</span>
          </h2>
        </div>
        <p
          className="text-center text-[14px] md:text-[16px] leading-[24px] text-[#52525b] max-w-[518px] mx-auto mb-[35px] md:mb-[80px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Empowering ambitious minds with AI Toolkit to thrive without sacrificing their spark or well-being.
        </p>

        {/* Mobile — horizontally scrolling cards */}
        <div className="md:hidden flex gap-[24px] overflow-x-auto pb-[24px] -mx-6 px-6 scrollbar-hide">
          {VALUES.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i} />
          ))}
        </div>

        {/* Mobile — WORK watermark + cutout */}
        <div className="md:hidden relative w-full" style={{ height: 392 }}>
          <div
            className="absolute left-[32px] top-0 w-[280px] h-[240px] pointer-events-none select-none"
            aria-hidden="true"
            style={{
              fontFamily: "'IvyPresto Headline', serif",
              fontWeight: 600,
              fontStyle: 'italic',
              fontSize: 95,
              lineHeight: '63px',
              color: 'white',
              opacity: 0.74,
            }}
          >
            <p className="mb-[16px]">WORK</p>
            <p className="mb-[16px]">WORK</p>
            <p>WORK</p>
          </div>
          <div className="absolute left-0 top-[52px] w-[343px] h-[340px] overflow-hidden">
            <CldImage
              src={CUTOUT_IMG}
              alt="Professional woman with phone"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Desktop — Cards + Cutout layout */}
        <div className="hidden md:block relative w-full min-h-[780px]">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <div
              className="text-[210px] mt-[-200px] leading-[166px] text-white text-center"
              style={{
                fontFamily: "'IvyPresto Headline', serif",
                fontWeight: 600,
                fontStyle: 'italic',
                opacity: 0.74,
              }}
            >
              <p className="mb-[16px]">WORK</p>
              <p className="mb-[16px]">WORK</p>
              <p>WORK</p>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-380px] w-[748px] z-2">
            <CldImage
              src={CUTOUT_IMG}
              alt="Professional woman with phone"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="relative z-3 h-[660px]">
            <div className="absolute top-0 left-0">
              <ValueCard value={VALUES[0]} index={0} />
            </div>
            <div className="absolute top-0 right-0">
              <ValueCard value={VALUES[1]} index={1} />
            </div>
            <div className="absolute bottom-0 left-0">
              <ValueCard value={VALUES[2]} index={2} />
            </div>
            <div className="absolute bottom-0 right-0">
              <ValueCard value={VALUES[3]} index={3} />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
