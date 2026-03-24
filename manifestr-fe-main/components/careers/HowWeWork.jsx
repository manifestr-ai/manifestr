import { motion } from 'framer-motion'

const CUTOUT_IMG = 'https://www.figma.com/api/mcp/asset/dc5e5f2c-5d69-4b7b-a04a-e930d5a4a6ee'

const ICONS = {
  shield: 'https://www.figma.com/api/mcp/asset/ab8b9d02-8411-4928-9766-794eff578ac2',
  idea: [
    { src: 'https://www.figma.com/api/mcp/asset/30ecaea3-7267-44b7-9205-2721374444ca', inset: '13.93% 71.93% 71.93% 13.93%' },
    { src: 'https://www.figma.com/api/mcp/asset/14340278-9211-4875-ada7-4a13e5852d98', inset: '47.07% 82.23% 47.07% 0' },
    { src: 'https://www.figma.com/api/mcp/asset/14340278-9211-4875-ada7-4a13e5852d98', inset: '47.07% 0 47.07% 82.23%' },
    { src: 'https://www.figma.com/api/mcp/asset/85cad4bf-55e4-4409-b792-f8aad02480d7', inset: '13.93% 13.93% 71.93% 71.93%' },
    { src: 'https://www.figma.com/api/mcp/asset/4f2eab5d-4a27-4ff0-8754-31f70d8d0d61', inset: '0 47.07% 82.23% 47.07%' },
    { src: 'https://www.figma.com/api/mcp/asset/05ff05ec-4857-4aa9-ad57-45b1819e6900', inset: '23.64% 23.63% 17.58% 23.65%' },
    { src: 'https://www.figma.com/api/mcp/asset/0c8c5653-9c0c-45ec-be1c-eeb45386422b', inset: '88.28% 38.28% 0 38.28%' },
  ],
  target: [
    { src: 'https://www.figma.com/api/mcp/asset/621709ee-1177-428c-a1e1-439e833956ee', inset: '0' },
    { src: 'https://www.figma.com/api/mcp/asset/330043ea-e016-4495-b725-bc8bee70edac', inset: '0 47.07% 47.07% 0' },
    { src: 'https://www.figma.com/api/mcp/asset/395a1564-d199-4dc9-b836-c5eb99f9910c', inset: '23.63%' },
  ],
  medal: 'https://www.figma.com/api/mcp/asset/77a86a5e-5738-4125-866f-75a6b27bf9ed',
}

function FigmaIcon({ icon }) {
  if (typeof icon === 'string') {
    return (
      <div className="relative w-[60px] h-[60px] overflow-hidden">
        <img src={icon} alt="" className="absolute inset-0 w-full h-full object-contain" />
      </div>
    )
  }
  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden">
      {icon.map((layer, i) => (
        <div key={i} className="absolute" style={{ inset: layer.inset }}>
          <img src={layer.src} alt="" className="absolute inset-0 w-full h-full" />
        </div>
      ))}
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
                 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
                 flex flex-col gap-[24px] w-full md:w-[308px] h-auto md:h-[310px]"
    >
      <FigmaIcon icon={value.icon} />
      <div>
        <h3
          className="text-[22px] md:text-[24px] leading-[32px] text-black mb-[8px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          {value.title}
        </h3>
        <p
          className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b]"
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
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[72px] pt-[80px] md:pt-[79px] pb-0">

        {/* Section heading */}
        <div className="text-center mb-[20px]">
          <h2 className="text-[40px] md:text-[60px] leading-[1.2] md:leading-[72px] tracking-[-1.2px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>How We </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Work,</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> What We Believe</span>
          </h2>
        </div>
        <p
          className="text-center text-[14px] md:text-[16px] leading-[24px] text-[#52525b] max-w-[518px] mx-auto mb-[60px] md:mb-[80px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Empowering ambitious minds with AI tools to thrive, without sacrificing their spark or well-being.
        </p>

        {/* Cards + Cutout layout */}
        <div className="relative w-full min-h-[600px] md:min-h-[780px]">

          {/* "WORK WORK WORK" watermark — centered behind cutout */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <div
              className="text-[120px] md:text-[210px] mt-[-200px] leading-none md:leading-[166px] text-white text-center"
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

          {/* Cutout woman — centered
              ─── SIZE CONTROL ───
              Change md:w-[748px] to make it smaller/bigger.
              e.g. md:w-[600px] = smaller, md:w-[900px] = bigger
          */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-380px] w-[340px] md:w-[748px] z-2">
            <img
              src={CUTOUT_IMG}
              alt="Professional woman with phone"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Mobile — stacked cards */}
          <div className="relative z-3 flex flex-col md:hidden gap-[24px]">
            {VALUES.map((v, i) => (
              <ValueCard key={v.title} value={v} index={i} />
            ))}
          </div>

          {/* Desktop — cards at corners */}
          <div className="hidden md:block relative z-3 h-[660px]">
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
