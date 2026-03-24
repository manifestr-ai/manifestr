import { motion } from 'framer-motion'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/b0e13493-d449-47a5-a946-a2579f65e1f8'

export default function AffiliateHero() {
  return (
    <section className="relative w-full h-[300px] md:h-[518px] overflow-hidden bg-black -mt-px">
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center top', transform: 'rotate(180deg) scaleY(-1)' }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white text-[48px] md:text-[72px] leading-tight md:leading-[90px] tracking-[-1.44px]"
        >
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Affiliate{' '}
          </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            Program
          </span>
        </motion.h1>
      </div>
    </section>
  )
}
