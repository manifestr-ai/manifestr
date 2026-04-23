import { motion } from 'framer-motion'
import { Wand2, PenLine, Upload, Mic, Play } from 'lucide-react'
import CldImage from '../ui/CldImage'

const VIDEO_PLACEHOLDER = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774958663/Placeholder_Image_zu8iye.jpg'

/** Figma 12468:22037+ — L2 14/Regular, HK Grotesk Bold 24, icon 56 with shadow */
const STYLES = [
  { icon: Wand2, title: 'BriefMe', description: 'Answer a few smart questions. Get a complete, ready-to-use document.' },
  { icon: PenLine, title: 'Freestyle', description: 'Start with a blank page. Shape ideas into clear, structured content.' },
  { icon: Upload, title: 'DropZone', description: 'Upload what you already have. Transform it into high-quality work.' },
  { icon: Mic, title: 'TalkToMe', description: 'Speak your thoughts. Turn them into structured, finished output.' },
]

/** Figma 14244:24539 — white circle w/ soft drop (offset + blur) */
const ICON_CIRCLE_SHADOW =
  'shadow-[4px_4px_20px_rgba(0,0,0,0.06),0_2px_6px_rgba(10,13,18,0.06)]'

/** Figma base 290×280; width scaled up, height follows aspect-[290/280] */

export default function ToolWorkingStyles({ tool }) {
  return (
    <>
      <section className="w-full bg-[#f4f4f5] pt-[48px] md:pt-[96px] pb-[32px] md:pb-[40px]">
        <div className="w-full max-w-[min(100%,1680px)] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 min-[1600px]:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-[32px] md:mb-[80px] max-w-[1100px] mx-auto text-[32px] md:text-[50px] lg:text-[60px] leading-[1.15] tracking-[-0.64px] md:tracking-[-1.2px] text-[#18181b]"
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
        <div className="w-full max-w-[min(100%,1680px)] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 min-[1600px]:px-16">
          {/*
            290:280 aspect; xl+ one row of four; full column width = wider body copy in 2 lines
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 2xl:gap-7">
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
                    className="text-center text-[14px] sm:text-[15px] leading-[1.32] sm:leading-[1.4] text-[#52525b] w-full min-w-0 shrink-0 text-balance"
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
