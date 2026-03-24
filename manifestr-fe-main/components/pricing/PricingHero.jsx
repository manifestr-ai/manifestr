import { motion } from 'framer-motion'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/d28c6fe3-dead-4733-a3b3-3948aa9d4371'

export default function PricingHero() {
  return (
    <section className="relative w-full h-[400px] md:h-[518px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[rgba(35,35,35,0.28)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center max-w-[592px] px-6"
        style={{ textShadow: '0px 4px 30px rgba(0,0,0,0.25)' }}
      >
        <h1 className="text-[42px] md:text-[72px] leading-none md:leading-[66px] tracking-[-1.44px] text-white font-semibold">
          <span style={{ fontFamily: "Inter, sans-serif" }}>Plans that </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic' }}>Power</span>
          <span style={{ fontFamily: "Inter, sans-serif" }}> your potential</span>
        </h1>
      </motion.div>
    </section>
  )
}
