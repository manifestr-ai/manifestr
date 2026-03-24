import { motion } from 'framer-motion'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/0b39df82-51cf-4bbe-b768-4f2c722de7f6'

export default function AboutHero() {
  return (
    <section className="relative w-full h-[360px] md:h-[518px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/[0.17]" />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white text-[42px] md:text-[72px] leading-[1.1] md:leading-[80px] tracking-[-1.44px] max-w-[627px]"
          style={{ textShadow: '0px 4px 20.9px rgba(0,0,0,0.25)' }}
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            Born From Burnout. Built for{' '}
          </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Brilliance
          </span>
        </motion.h1>
      </div>
    </section>
  )
}
