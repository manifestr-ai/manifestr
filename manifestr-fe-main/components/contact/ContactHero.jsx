import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775028777/businesswoman-having-mobile-call-conversation-smartphone-talking-with-client-standing-white_1_xs0nvm.png'

export default function ContactHero() {
  return (
    <section className="relative w-full h-[251px] md:h-[518px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <CldImage src={HERO_BG} alt="" className="w-full h-full object-cover object-top" priority />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.24)] md:bg-[rgba(0,0,0,0.17)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-[36px] md:text-[72px] leading-[44px] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] text-white">
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Connect</span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> With Us</span>
        </h1>
      </motion.div>
    </section>
  )
}
