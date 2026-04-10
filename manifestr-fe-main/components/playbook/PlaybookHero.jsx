import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775039194/Card_1_c3uust.png'
const HERO_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775223649/Default_t3rbad.png'

export default function PlaybookHero() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-between overflow-hidden
                 h-[436px] p-12
                 md:max-lg:h-[min(100%,500px)] md:max-lg:min-h-[420px] md:max-lg:p-8
                 lg:h-[518px] lg:p-12"
    >
      <div className="absolute inset-0">
        <CldImage src={HERO_BG_DESKTOP} alt="" className="hidden md:block w-full h-full object-cover" priority />
        <img src={HERO_BG_MOBILE} alt="" className="md:hidden w-full h-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 bg-black/17" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex w-full max-w-[720px] flex-col items-center gap-8 md:max-lg:gap-6 lg:max-w-none lg:gap-8"
      >
        {/* Breadcrumbs — tablet + desktop */}
        <nav className="hidden items-center gap-1 md:flex md:max-lg:gap-1 lg:gap-1">
          <Link
            href="/"
            className="font-semibold text-white hover:underline md:max-lg:px-1.5 md:max-lg:py-0.5 md:max-lg:text-[13px] md:max-lg:leading-5 lg:px-2 lg:py-1 lg:text-[14px] lg:leading-5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Home
          </Link>
          <svg className="h-3.5 w-3.5 shrink-0 text-white/70 md:max-lg:h-3.5 md:max-lg:w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="font-semibold text-white md:max-lg:px-1.5 md:max-lg:py-0.5 md:max-lg:text-[13px] md:max-lg:leading-5 lg:px-2 lg:py-1 lg:text-[14px] lg:leading-5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Playbook
          </span>
        </nav>

        {/* Heading + Subtitle */}
        <div className="mt-10 flex w-full flex-col items-center gap-6 md:max-lg:mt-8 md:max-lg:gap-5 lg:mt-12 lg:gap-6">
          <div className="flex w-full flex-col items-center gap-6 md:max-lg:gap-4 lg:gap-5">
            <h1
              className="text-center text-[36px] leading-[100%] tracking-[-0.72px] text-white
                         md:max-lg:text-[48px] md:max-lg:leading-[1.08] md:max-lg:tracking-[-0.96px]
                         lg:text-[72px] lg:leading-[90px] lg:tracking-[-1.44px]"
            >
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Welcome to<br className="md:hidden" />{' '}The </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Playbook</span>
            </h1>
            <p
              className="text-center text-white md:max-lg:text-[16px] md:max-lg:leading-6 lg:text-[18px] lg:leading-7"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {"Your support hub for"}
              <br className="md:hidden" />
              {" how-to's, walkthroughs, and tips"}
            </p>
          </div>

          {/* Search input */}
          <div
            className="flex w-full items-center gap-2 rounded-md border border-[#d5d7da] bg-white px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
                       md:max-lg:max-w-[min(100%,400px)] md:max-lg:py-2
                       lg:w-[449px] lg:max-w-none lg:gap-2 lg:px-3.5 lg:py-2.5"
          >
            <svg className="h-5 w-5 shrink-0 text-[#71717a] md:max-lg:h-[18px] md:max-lg:w-[18px] lg:h-5 lg:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent text-[16px] leading-6 text-[#18181b] outline-none placeholder:text-[#71717a] md:max-lg:text-[15px] md:max-lg:leading-snug lg:text-[16px] lg:leading-6"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>

        {/* CTA Button — desktop only */}
        <Link
          href="/contact"
          className="hidden items-center justify-center gap-2 rounded-md bg-[#18181b] font-medium text-white transition-colors hover:bg-[#27272a] md:inline-flex
                     md:max-lg:h-10 md:max-lg:px-4 md:max-lg:text-[13px] md:max-lg:leading-5
                     lg:h-11 lg:px-4 lg:text-sm lg:leading-5"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Submit a Support Ticket
          <svg className="h-4 w-4 md:max-lg:h-3.5 md:max-lg:w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}
