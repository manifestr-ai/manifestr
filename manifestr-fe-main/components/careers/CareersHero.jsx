import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025724/creative-inspirational-resource_1_xvzeqt.jpg'
const MOBILE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025724/creative-inspirational-resource_1_xvzeqt.jpg'

export default function CareersHero() {
  return (
    <section className="relative w-full h-[251px] md:h-[518px] overflow-hidden bg-white">
      {/* Mobile background */}
      <div className="md:hidden absolute inset-0">
        <CldImage
          src={MOBILE_BG}
          alt=""
          className="w-full h-full object-cover"
          priority
          style={{ objectPosition: 'center top' }}
        />
      </div>

      {/* Desktop background */}
      <div className="hidden md:block absolute inset-0">
        <CldImage
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          priority
          style={{ objectPosition: 'center top' }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white text-[48px] md:text-[72px] leading-[59px] md:leading-[90px] tracking-[-0.96px] md:tracking-[-1.44px] max-w-[333px] md:max-w-none"
        >
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Careers{' '}
          </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            at MANIFESTR
          </span>
        </motion.h1>
      </div>
    </section>
  )
}
