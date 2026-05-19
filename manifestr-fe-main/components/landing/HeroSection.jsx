import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777458799/Homepage_Banner_1441x804_x2_dnhupo.webp'

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
          sizes="100vw"
          fallbackWidth={2048}
        />
      </div>

      {/* ── Mobile text — Figma 12622:22980; tight stack (no oversized line-box gaps) ── */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center pt-[60px]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center text-white"
        >
          <span
            className="font-bold uppercase text-[48px] leading-none tracking-[-0.96px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            ELEVATE
          </span>
          <span
            className="-mt-1 italic text-[62px] leading-none tracking-[-1.23px]"
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
          >
            your
          </span>
          <span
            className="-mt-0.5 font-bold uppercase text-[69px] leading-none tracking-[5.48px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            GAME
          </span>
        </motion.h1>
      </div>

      {/* ── Desktop text — positioned around the image ── */}
      <div className="hidden md:block absolute inset-0 mx-auto max-w-[1440px] left-0 right-0">
        <div
          className="absolute flex items-center md:max-lg:gap-50 lg:gap-92"
          style={{ left: '8.47%', top: '18%' }}
        >
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
            right: '12%',
            top: '32%',
          }}
        >
          GAME
        </motion.span>
      </div>
    </section>
  )
}