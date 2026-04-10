import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import CldImage from '../ui/CldImage'

const M_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025721/Manifestr_Icon_Mono_2_eqxqtq.svg'

const STATS = [
  { value: '25+', label: 'COUNTRIES' },
  { value: 'Global', label: 'LOCATIONS' },
  { value: 'Flexible', label: 'CONDITIONS' },
]

export default function WhyChoose() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div
        className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col min-w-0 px-6 py-[22px] gap-[40px]
                       md:flex-row md:max-lg:items-start md:max-lg:px-6 md:max-lg:py-12 md:max-lg:gap-8
                       lg:max-xl:px-10 lg:max-xl:py-16 lg:max-xl:gap-8
                       xl:px-[210px] xl:py-[87px] xl:gap-0"
      >

        {/* Left — heading + M icon */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full shrink-0 flex flex-col items-center min-w-0
                     md:max-lg:basis-[44%] md:max-lg:max-w-[44%] md:max-lg:shrink-0 md:max-lg:items-start
                     lg:max-xl:basis-[40%] lg:max-xl:max-w-[min(380px,40%)] lg:max-xl:min-w-0
                     xl:w-[438px] xl:max-w-none xl:basis-auto xl:shrink-0 xl:items-start"
        >
          <h2
            className="text-[40px] leading-[normal] tracking-[-0.8px] text-black mb-[8px] text-center max-w-[266px] w-full min-w-0
                       md:max-lg:text-[40px] md:max-lg:leading-[1.15] md:max-lg:tracking-[-0.8px] md:max-lg:mb-8 md:max-lg:text-left md:max-lg:max-w-none md:max-lg:break-words
                       lg:max-xl:text-[52px] lg:max-xl:leading-[1.12] lg:max-xl:tracking-[-1.04px] lg:max-xl:mb-10
                       xl:text-[60px] xl:leading-[72px] xl:tracking-[-1.2px] xl:mb-[50px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Why </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Work </span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>at MANIFESTR?</span>
          </h2>
          <CldImage
            src={M_ICON}
            alt="Manifestr icon"
            className="w-[56px] h-[56px] object-contain max-w-full
                       md:max-lg:w-[min(220px,38vw)] md:max-lg:h-auto
                       lg:max-xl:w-[min(280px,32vw)] lg:max-xl:h-auto
                       xl:w-[347px] xl:h-auto"
          />
        </motion.div>

        {/* Right — body text, stats, buttons */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="w-full flex flex-col justify-center min-w-0
                     md:max-lg:flex-1 md:max-lg:min-w-0
                     lg:max-xl:flex-1 lg:max-xl:min-w-0 lg:max-xl:max-w-none
                     xl:max-w-[605px] xl:flex-none"
        >
          <div
            className="text-[14px] leading-[28px] text-[#52525b] mb-[40px] md:max-lg:text-[15px] md:max-lg:leading-[24px] md:max-lg:mb-8
                       lg:max-xl:text-[17px] lg:max-xl:leading-[27px] lg:max-xl:mb-10
                       xl:text-[18px] xl:leading-[28px] xl:mb-[40px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            <p className="mb-[18px]">
              Forget business as usual. This is the new era of work. We are not here to play by old rules. Every company has values. Ours are different. They don&rsquo;t sit on posters, they shape everything we build. Curious? Take a look.
            </p>
            <p>
              We&rsquo;re building a team of thinkers, makers, and challengers who thrive on possibility. People who question the status quo, move fast, and care deeply about doing work that actually matters. If that sounds like you, you won&rsquo;t just fit in &ndash; you&rsquo;ll help define what comes next.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-[16px] mb-[32px] md:max-lg:gap-x-4 md:max-lg:gap-y-3 md:max-lg:justify-between lg:max-xl:gap-6 xl:flex-nowrap xl:gap-[48px]">
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0 md:max-lg:flex-1 md:max-lg:basis-[30%] lg:max-xl:flex-none">
                <p
                  className="text-[32px] leading-[27px] tracking-[0.64px] text-black
                             md:max-lg:text-[28px] md:max-lg:leading-[26px] md:max-lg:tracking-[0.56px]
                             lg:max-xl:text-[36px] lg:max-xl:tracking-[0.72px]
                             xl:text-[40px] xl:tracking-[0.8px]"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[14px] leading-[27px] tracking-[0.84px] text-[#a4a4a4] uppercase mt-[4px]
                             md:max-lg:text-[12px] md:max-lg:leading-[18px] md:max-lg:tracking-[0.72px]
                             lg:max-xl:text-[15px] lg:max-xl:tracking-[0.88px]
                             xl:text-[16px] xl:tracking-[0.96px]"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons — primary: Figma 12181:22858 (shadcn button + arrow) */}
          <div className="flex flex-wrap items-center gap-[12px] md:max-lg:gap-3 lg:max-xl:gap-3 xl:gap-[12px]">
            <Link
              href="#roles"
              className="inline-flex items-center justify-center gap-2 max-w-full shrink-0 px-6 py-2 rounded-[6px] bg-[#18181b] text-white font-medium whitespace-nowrap hover:bg-[#27272a] transition-colors
                         w-[290px] h-[54px] text-[14px] leading-[20px]
                         md:max-lg:h-[48px] md:max-lg:w-auto md:max-lg:px-5 md:max-lg:text-[13px]
                         lg:max-xl:h-[50px] lg:max-xl:w-auto lg:max-xl:px-5 lg:max-xl:text-[13px]
                         xl:h-[54px] xl:w-auto xl:px-6 xl:text-[14px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore Open Roles
              <ArrowUpRight className="size-4 shrink-0 text-white md:max-lg:size-3.5 xl:size-4" strokeWidth={2} aria-hidden />
            </Link>
            <Link
              href="#culture"
              className="hidden md:inline-flex items-center justify-center rounded-[6px] bg-white border border-[#e4e4e7] text-[#18181b] font-medium hover:bg-[#fafafa] transition-colors
                         h-[54px] px-6 text-[14px] leading-[20px]
                         md:max-lg:h-[48px] md:max-lg:px-5 md:max-lg:text-[13px]
                         lg:max-xl:h-[50px] lg:max-xl:px-5 lg:max-xl:text-[13px]
                         xl:h-[54px] xl:px-6 xl:text-[14px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Discover Our Culture
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Mobile watermark */}
      <div
        className="absolute pointer-events-none select-none md:hidden"
        aria-hidden="true"
        style={{
          right: '-15px',
          bottom: '113px',
          width: 327,
          height: 217,
          textAlign: 'right',
          fontFamily: "'IvyPresto Headline', serif",
          fontSize: 75,
          fontStyle: 'italic',
          fontWeight: 600,
          lineHeight: '80px',
          letterSpacing: '-1.5px',
          textTransform: 'capitalize',
          opacity: 0.35,
          background: 'linear-gradient(-65.22deg, #E4E3E1 6.91%, #FFF 91.67%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
      >
        START YOUR<br />nEW ERA
      </div>

      {/* Desktop watermark */}
      <div
        className="absolute inset-0 pointer-events-none select-none hidden md:block"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 mt-[130px] flex flex-col justify-center origin-right pointer-events-none
                     md:max-lg:scale-[0.36] md:max-lg:translate-x-2
                     lg:max-xl:scale-[0.55] lg:max-xl:translate-x-0
                     xl:scale-100"
          style={{
            right: '-31px',
            width: 978,
            height: 478,
            textAlign: 'right',
            fontFamily: "'IvyPresto Headline', serif",
            fontSize: 200,
            fontStyle: 'italic',
            fontWeight: 600,
            lineHeight: '143px',
            letterSpacing: '-4px',
            textTransform: 'capitalize',
            opacity: 0.35,
            background: 'linear-gradient(287deg, #E4E3E1 -6.91%, #FFF 91.67%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          START YOUR<br />nEW ERA
        </div>
      </div>
    </section>
  )
}
