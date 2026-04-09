import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775022950/Rectangle_34624783_snr3g9.jpg'

export default function AffiliateHero() {
  return (
    <section className="relative w-full h-[251px] md:h-[518px] overflow-hidden bg-black -mt-px">
      <div className="absolute inset-0">
        <CldImage
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center top', transform: '' }}
          priority
        />
        <div className="absolute inset-0 " />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white text-[48px] md:text-[72px] leading-[56px] md:leading-[90px] tracking-[-0.96px] md:tracking-[-1.44px]"
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
