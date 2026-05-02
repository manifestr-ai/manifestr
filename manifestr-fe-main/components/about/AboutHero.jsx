import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777351402/About_Banner_1441x692_x2_j4gbdu.webp'

export default function AboutHero() {
  return (
    <section className="relative w-full h-[251px] md:h-[518px] overflow-hidden">
      <div className="absolute inset-0">
        <CldImage
          src={HERO_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/[0.28] md:bg-black/17" />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white text-[36px] md:text-[72px] leading-[44px] md:leading-[80px] tracking-[-0.72px] md:tracking-[-1.44px] max-w-[310px] md:max-w-[627px]"
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
