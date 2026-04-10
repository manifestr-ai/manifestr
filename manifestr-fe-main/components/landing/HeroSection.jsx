import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dqyzkphsd/image/upload/v1774936250/Hero_3_y6vjqw.png'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden mt-10 h-[620px] md:h-[560px] lg:h-[640px] xl:h-[720px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <CldImage
          src={HERO_BG}
          alt=""
          className="absolute w-full h-full object-cover object-top"
          priority
        />
      </div>

      {/* ── Mobile text — centred stack over the image ── */}
      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center pt-[60px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white font-bold uppercase text-[48px] leading-[60px] tracking-[-0.96px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          ELEVATE
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="text-white italic text-[62px] leading-[75px] tracking-[-1.23px]"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
        >
          your
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-white font-bold uppercase text-[69px] leading-[50px] tracking-[5.48px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          GAME
        </motion.p>
      </div>

      {/* ── Desktop text — positioned around the image ── */}
      <div className="hidden md:block absolute inset-0 mx-auto max-w-[1440px] left-0 right-0">
        <div className="absolute flex items-center lg:gap-80  " style={{ left: '8.47%', top: '28%' }}>
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-black font-bold uppercase"
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: 'clamp(60px, 7.56vw, 109px)',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
            }}
          >
            ELEVATE
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-black italic whitespace-nowrap"
            style={{
              fontFamily: "'IvyPresto Headline', serif",
              fontWeight: 600,
              fontSize: 'clamp(50px, 7.17vw, 103px)',
              lineHeight: '1.22',
              letterSpacing: '-0.02em',
            }}
          >
            your
          </motion.span>
        </div>

        <motion.span
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute text-black font-bold uppercase"
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: 'clamp(50px, 7.17vw, 103px)',
            lineHeight: '1.25',
            letterSpacing: '-0.02em',
            right: '13.5%',
            top: '41%',
          }}
        >
          GAME
        </motion.span>
      </div>
    </section>
  )
}