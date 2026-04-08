import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775632076/Default_f8wbn1.png'

export default function PricingHero() {
  return (
    <section className="relative w-full h-[251px] md:h-[518px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <CldImage src={HERO_BG} alt="" className="w-full h-full object-cover object-top" priority />
        <div className="absolute inset-0 bg-black/50 md:bg-[rgba(35,35,35,0.28)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center max-w-[333px] md:max-w-[592px] px-6"
        style={{ textShadow: '0px 4px 30px rgba(0,0,0,0.25)' }}
      >
        <h1 className="text-[48px] md:text-[72px] leading-[56px] md:leading-[66px] tracking-[-0.96px] md:tracking-[-1.44px] text-white font-semibold">
          <span style={{ fontFamily: "Inter, sans-serif" }}>Plans that </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic' }}>Power</span>
          <span style={{ fontFamily: "Inter, sans-serif" }}> your potential</span>
        </h1>
      </motion.div>
    </section>
  )
}
