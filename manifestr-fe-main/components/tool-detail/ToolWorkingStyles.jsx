import { motion } from 'framer-motion'
import { Wand2, PenLine, Upload, Mic, Play } from 'lucide-react'
import { useRef, useState } from 'react'
import CldImage from '../ui/CldImage'

const VIDEO_PLACEHOLDER = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774958663/Placeholder_Image_zu8iye.jpg'

/** Figma 14273:24567 — card order matches horizontal scroll (Freestyle first) */
const STYLES = [
  { icon: PenLine, title: 'Freestyle',  description: 'An open canvas for ideas, refined into professional work.' },
  { icon: Upload,  title: 'DropZone',   description: 'Upload existing content and transform it into polished results.' },
  { icon: Wand2,   title: 'BriefMe',    description: 'Guided questions that turn intent into structured output.' },
  { icon: Mic,     title: 'TalkToMe',   description: 'Speak your thoughts and generate structured, professional documents.' },
]

/** Figma 14244:24539 — white circle w/ soft drop (offset + blur) */
const ICON_CIRCLE_SHADOW =
  'shadow-[4px_4px_20px_rgba(0,0,0,0.06),0_2px_6px_rgba(10,13,18,0.06)]'

/** Mobile: 290px card + 32px gap = 322px per scroll step */
const MOBILE_SCROLL_STEP = 322

export default function ToolWorkingStyles() {
  const [activeCard, setActiveCard] = useState(0)
  const scrollRef = useRef(null)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / MOBILE_SCROLL_STEP)
    setActiveCard(Math.max(0, Math.min(idx, STYLES.length - 1)))
  }

  return (
    <>
      <section className="w-full bg-[#f4f4f5] pt-[48px] md:pt-[96px] pb-[32px] md:pb-[40px]">

        {/* ── MOBILE heading — Figma 14273:24568 (321×96, B1 32 + L2 72 line) ── */}
        <div className="md:hidden flex justify-center px-[35px] mb-[24px]">
          <h2 className="flex w-full max-w-[321px] flex-col justify-center text-center text-[0px] leading-0 tracking-[-0.64px] text-black">
            <span className="inline text-[32px] leading-[72px] max-[360px]:text-[clamp(15px,4.4vw+0.4rem,32px)] max-[360px]:leading-tight whitespace-nowrap">
              <em style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>Choose</em>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> How You Create</span>
            </span>
          </h2>
        </div>

        {/* ── DESKTOP heading ── */}
        <div className="hidden md:block w-full max-w-[min(100%,1680px)] mx-auto px-8 lg:px-10 xl:px-12 min-[1600px]:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-[80px] max-w-[1100px] mx-auto text-[50px] lg:text-[60px] leading-[1.15] tracking-[-1.2px] text-[#18181b]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Choose how you </span>
            <em
              className="not-italic"
              style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}
            >
              create
            </em>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> based on your working style</span>
          </motion.h2>
        </div>

        {/* ── MOBILE: horizontal scroll snap — Figma 14273:24569 ── */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="no-scrollbar flex overflow-x-auto overflow-y-hidden [scroll-snap-type:x_mandatory] scroll-pl-[37px] gap-[32px] pl-[37px] pr-[37px] pb-[4px]"
          >
            {STYLES.map((ws) => {
              const Icon = ws.icon
              return (
                <div
                  key={ws.title}
                  className="flex-none w-[290px] h-[280px] snap-start p-[32px] flex flex-col items-center justify-center gap-6 bg-white border border-[#e5e7eb] rounded-[12px]"
                >
                  <div
                    className={`relative shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-white ${ICON_CIRCLE_SHADOW}`}
                    aria-hidden
                  >
                    <Icon className="w-6 h-6 text-[#18181b]" strokeWidth={2} />
                  </div>
                  <h3
                    className="text-center text-[24px] leading-[32px] text-[#18181b] w-full"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {ws.title}
                  </h3>
                  <p
                    className="text-center text-[14px] leading-[20px] text-[#52525b] w-full"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {ws.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Pagination dots — Figma 14273:24594 */}
          <div className="flex items-center justify-center gap-[8px] mt-[20px]">
            {STYLES.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 w-[9px] h-[9px] ${
                  i === activeCard ? 'bg-[#18181b]' : 'bg-[#d4d4d8]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── DESKTOP: 4-column grid ── */}
        <div className="hidden md:block w-full max-w-[min(100%,1680px)] mx-auto px-8 lg:px-10 xl:px-12 min-[1600px]:px-16">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 2xl:gap-7">
            {STYLES.map((ws, i) => {
              const Icon = ws.icon
              return (
                <motion.div
                  key={ws.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="w-full min-w-0 p-[32px] flex flex-col items-center justify-center gap-8 bg-white border border-[#e5e7eb] rounded-[12px] box-border aspect-290/280"
                >
                  <div
                    className={`relative shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-white ${ICON_CIRCLE_SHADOW}`}
                    aria-hidden
                  >
                    <Icon className="w-6 h-6 text-[#18181b] relative z-1" strokeWidth={2} />
                  </div>
                  <h3
                    className="text-center text-[24px] leading-[32px] text-[#18181b] w-full shrink-0"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {ws.title}
                  </h3>
                  <p
                    className="text-center text-[14px] leading-[20px] text-[#52525b] w-full min-w-0 shrink-0 text-balance"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {ws.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Video / Demo section (unchanged) ── */}
      <div
        className="w-full py-[32px] md:py-[40px]"
        style={{ background: 'linear-gradient(to bottom, #f4f4f5 50%, #ffffff 50%)' }}
      >
        <div className="w-full max-w-[min(100%,1680px)] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 min-[1600px]:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full h-[300px] md:h-[540px] rounded-[12px] overflow-hidden flex items-center justify-center cursor-pointer group"
          >
            <CldImage src={VIDEO_PLACEHOLDER} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/25" />
            <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition-colors">
              <Play className="w-[28px] h-[28px] text-[#18181b] ml-[3px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
