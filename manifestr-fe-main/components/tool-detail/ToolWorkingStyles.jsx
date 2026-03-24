import { motion } from 'framer-motion'
import { Wand2, PenLine, Upload, Mic, Play } from 'lucide-react'

const VIDEO_PLACEHOLDER = 'https://www.figma.com/api/mcp/asset/8b593644-ca5c-4b3c-8881-590a84df90be'

const STYLES = [
  { icon: Wand2,   title: 'Brief Me',     description: 'Guided questions that turn intent into structured output.' },
  { icon: PenLine, title: 'Freestyle Me', description: 'An open canvas for ideas, refined into professional work.' },
  { icon: Upload,  title: 'Dropzone',     description: 'Upload existing content and transform it into polished results.' },
  { icon: Mic,     title: 'Talk To Me',   description: 'Speak your thoughts and generate structured, professional documents.' },
]

export default function ToolWorkingStyles({ tool }) {
  return (
    <>
      <section className="w-full bg-[#f4f4f5] pt-[64px] md:pt-[96px] pb-[32px] md:pb-[40px]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[32px] md:text-[60px] leading-tight tracking-[-1.2px] text-center mb-[48px] md:mb-[80px] max-w-[760px] mx-auto"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Choose how you </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>create</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>{' '}based on your working style</span>
          </motion.h2>
        </div>
        <div className="max-w-[1300px] mx-auto px-6 md:px-[24px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[16px]">
            {STYLES.map((ws, i) => {
              const Icon = ws.icon
              return (
                <motion.div
                  key={ws.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-white border border-[#e5e7eb] rounded-[12px] p-[32px] flex flex-col items-center text-center aspect-square justify-center"
                >
                  <div className="w-[56px] h-[56px] rounded-full bg-[#f4f4f5] flex items-center justify-center mb-[20px] shadow-sm">
                    <Icon className="w-[24px] h-[24px] text-[#18181b]" />
                  </div>
                  <h3
                    className="text-[22px] md:text-[24px] leading-[32px] text-[#18181b] mb-[12px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {ws.title}
                  </h3>
                  <p className="text-[14px] leading-[20px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
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
            <img src={VIDEO_PLACEHOLDER} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
