import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039194/Card_1_c3uust.png'
const HERO_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775223649/Default_t3rbad.png'

export default function PlaybookHero() {
  return (
    <section className="relative w-full h-[436px] md:h-[518px] flex flex-col items-center justify-between p-[48px] md:p-[48px] overflow-hidden">
      <div className="absolute inset-0">
        <CldImage src={HERO_BG_DESKTOP} alt="" className="hidden md:block w-full h-full object-cover" priority />
        <img src={HERO_BG_MOBILE} alt="" className="md:hidden w-full h-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 bg-black/17" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center gap-[32px] w-full"
      >
        {/* Breadcrumbs — desktop only */}
        <nav className="hidden md:flex items-center gap-[4px]">
          <Link href="/" className="text-[14px] leading-[20px] font-semibold text-white px-[8px] py-[4px] hover:underline" style={{ fontFamily: 'Inter, sans-serif' }}>
            Home
          </Link>
          <svg className="w-[16px] h-[16px] text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[14px] leading-[20px] font-semibold text-white px-[8px] py-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Playbook
          </span>
        </nav>

        {/* Heading + Subtitle */}
        <div className="flex flex-col items-center mt-12 gap-[25px] md:gap-[24px] w-full">
          <div className="flex flex-col items-center gap-[25px] md:gap-[20px]">
            <h1 className="text-[36px] md:text-[72px] leading-[100%] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] text-white text-center">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Welcome to<br className="md:hidden" />{' '}The </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Playbook</span>
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-white text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              {"Your support hub for"}
              <br className="md:hidden" />
              {" how-to's, walkthroughs, and tips"}
            </p>
          </div>

          {/* Search input */}
          <div className="bg-white border border-[#d5d7da] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex items-center gap-[8px] px-[14px] py-[10px] w-full md:w-[449px]">
            <svg className="w-[20px] h-[20px] text-[#71717a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] outline-none bg-transparent"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>

        {/* CTA Button — desktop only */}
        <Link
          href="/contact"
          className="hidden md:inline-flex h-[44px] px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium items-center gap-[8px] justify-center hover:bg-[#27272a] transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Submit a Support Ticket
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}
