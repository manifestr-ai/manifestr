import { motion } from 'framer-motion'
import { Wand2, PenLine, Upload, Mic, Play } from 'lucide-react'
import CldImage from '../ui/CldImage'

const VIDEO_PLACEHOLDER = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774958663/Placeholder_Image_zu8iye.jpg'

const STYLES = [
  { icon: Wand2,   title: 'Brief Me',     description: 'Guided questions that turn intent into structured output.' },
  { icon: PenLine, title: 'Freestyle Me', description: 'An open canvas for ideas, refined into professional work.' },
  { icon: Upload,  title: 'Dropzone',     description: 'Upload existing content and transform it into polished results.' },
  { icon: Mic,     title: 'Talk To Me',   description: 'Speak your thoughts and generate structured, professional documents.' },
]

export default function ToolWorkingStyles({ tool }) {
  return (
    <>
      <section className="w-full bg-[#f4f4f5] pt-[48px] md:pt-[96px] pb-[32px] md:pb-[40px]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[32px] md:text-[60px] leading-tight tracking-[-0.64px] md:tracking-[-1.2px] text-center mb-[32px] md:mb-[80px] max-w-[760px] mx-auto"
          >
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Choose</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> How You Create</span>
          </motion.h2>
        </div>
        <div className="max-w-[1300px] mx-auto px-6 md:px-[24px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {STYLES.map((ws, i) => {
              const Icon = ws.icon
              return (
                <motion.div
                  key={ws.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] md:p-[32px] flex flex-col items-center text-center aspect-square justify-center"
                >
                  <div className="w-[40px] h-[40px] md:w-[56px] md:h-[56px] rounded-full bg-[#f4f4f5] flex items-center justify-center mb-[12px] md:mb-[20px] shadow-sm">
                    <Icon className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#18181b]" />
                  </div>
                  <h3
                    className="text-[18px] md:text-[24px] leading-[24px] md:leading-[32px] text-[#18181b] mb-[8px] md:mb-[12px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {ws.title}
                  </h3>
                  <p className="text-[12px] md:text-[14px] leading-[18px] md:leading-[20px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
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
        <div className="max-w-[1280px] mx-auto px-6 md:px-[24px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full h-[300px] md:h-[540px] rounded-[12px] overflow-hidden flex items-center justify-center cursor-pointer group"
          >
            <CldImage src={VIDEO_PLACEHOLDER} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition-colors">
              <Play className="w-[28px] h-[28px] text-[#18181b] ml-[3px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
