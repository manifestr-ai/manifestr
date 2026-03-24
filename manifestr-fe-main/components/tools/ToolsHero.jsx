import { motion } from 'framer-motion'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/cba58d55-01b9-4a11-9ebb-b00fa06f28c1'

export default function ToolsHero() {
  return (
    <section className="relative w-full h-[400px] md:h-[532px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.17)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center"
      >
        <h1
          className="text-[48px] md:text-[72px] leading-[1.1] md:leading-[90px] tracking-[-0.72px] text-white"
          style={{ textShadow: '0px 4px 51.4px rgba(0,0,0,0.46), 2px 4px 57.8px #5c514a' }}
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Toolkit</span>
        </h1>
      </motion.div>
    </section>
  )
}
