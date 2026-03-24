import { motion } from 'framer-motion'

const HERO_BG = '/assets/landing/hero-bg.jpg'

export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] md:h-[709px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 65%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-[80px] h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center h-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center md:justify-start"
          >
            <h1
              className="text-[48px] md:text-[72px] leading-tight md:leading-[90px] font-bold text-black tracking-[-1.44px]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              ELEVATE
            </h1>
          </motion.div>

          <div className="hidden md:block" />

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <div className="flex flex-col items-center md:items-end">
              <span
                className="text-[48px] md:text-[72px] leading-[60px] md:leading-[88px] italic font-semibold text-black"
                style={{ fontFamily: "'IvyPresto Headline', serif" }}
              >
                Your
              </span>
              <span
                className="text-[48px] md:text-[72px] leading-[60px] md:leading-[90px] font-bold text-black tracking-[-1.44px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                GAME
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
