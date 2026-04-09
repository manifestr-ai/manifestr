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
      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row px-6 md:px-[210px] py-[22px] md:py-[87px] gap-[40px] md:gap-0">

        {/* Left — heading + M icon */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-[438px] shrink-0 flex flex-col items-center md:items-start"
        >
          <h2 className="text-[40px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.8px] md:tracking-[-1.2px] text-black mb-[8px] md:mb-[50px] text-center md:text-left max-w-[266px] md:max-w-none">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Why </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Work </span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>at MANIFESTR?</span>
          </h2>
          <CldImage
            src={M_ICON}
            alt="Manifestr icon"
            className="w-[56px] md:w-[347px] h-[56px] md:h-auto object-contain"
          />
        </motion.div>

        {/* Right — body text, stats, buttons */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="w-full md:max-w-[605px] flex flex-col justify-center"
        >
          <div
            className="text-[14px] md:text-[18px] leading-[28px] text-[#52525b] mb-[40px]"
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
          <div className="flex gap-[16px] md:gap-[48px] mb-[32px]">
            {STATS.map((s) => (
              <div key={s.label}>
                <p
                  className="text-[32px] md:text-[40px] leading-[27px] tracking-[0.64px] md:tracking-[0.8px] text-black"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[14px] md:text-[16px] leading-[27px] tracking-[0.84px] md:tracking-[0.96px] text-[#a4a4a4] uppercase mt-[4px]"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons — primary: Figma 12181:22858 (shadcn button + arrow) */}
          <div className="flex flex-wrap items-center gap-[12px]">
            <Link
              href="#roles"
              className="inline-flex items-center justify-center gap-2 h-[54px] w-[290px] max-w-full md:w-auto shrink-0 px-6 py-2 rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium whitespace-nowrap hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore Open Roles
              <ArrowUpRight className="size-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
            </Link>
            <Link
              href="#culture"
              className="hidden md:inline-flex items-center justify-center h-[54px] px-6 py-2 rounded-[6px] bg-white border border-[#e4e4e7] text-[#18181b] text-[14px] leading-[20px] font-medium hover:bg-[#fafafa] transition-colors"
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
          className="absolute top-1/2 -translate-y-1/2 mt-[130px] flex flex-col justify-center"
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
