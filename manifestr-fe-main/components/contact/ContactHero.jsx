import { motion } from 'framer-motion'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/9ccbc675-8696-49e5-97ed-1d06bfa9bed0'

export default function ContactHero() {
  return (
    <section className="relative w-full h-[400px] md:h-[518px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.17)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-[48px] md:text-[72px] leading-[1.1] md:leading-[90px] tracking-[-1.44px] text-white">
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Connect</span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> With Us</span>
        </h1>
      </motion.div>
    </section>
  )
}
