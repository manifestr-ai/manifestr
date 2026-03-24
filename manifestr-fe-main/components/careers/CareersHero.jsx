import { motion } from 'framer-motion'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/44b89b89-a55e-4b7b-8c73-fc57b226c327'

export default function CareersHero() {
  return (
    <section className="relative w-full h-[300px] md:h-[518px] overflow-hidden bg-white ">
      {/* Background image — shifted left slightly to match Figma */}
      <div className="absolute inset-0 -mt-[100px]">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        />
      </div>

      {/* Centred headline */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white text-[48px] md:text-[72px] leading-tight md:leading-[90px] tracking-[-1.44px]"
        >
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Careers at
          </span>
          {' '}
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            MANIFESTR
          </span>
        </motion.h1>
      </div>
    </section>
  )
}
