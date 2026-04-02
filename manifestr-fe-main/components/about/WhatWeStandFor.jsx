import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const TEXTURE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041142/Rectangle_34624846_j5h0bo.png'
const M_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041250/Manifestr_Icon_Reverse_1_hxeiju.png'

const VALUES = [
  { title: 'Protect your brilliance', desc: 'Our best work comes when ambition and wellbeing go hand in hand.', dark: false },
  { title: null, icon: true, dark: true },
  { title: 'Ideas to Impact', desc: "Ideas don't change the world, execution does.", dark: false },
  { title: 'Win Together', desc: 'Collaboration turns good work into great work.', dark: false },
  { title: 'Raise the Standard, with Impact', desc: "Great work doesn't just deliver, it shapes the future.", dark: false },
  { title: 'Build What Matters', desc: 'We build with purpose, solving real problems that matter.', dark: false },
]

function ValueCard({ value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`rounded-[16px] md:rounded-[20px] h-[140px] md:h-auto md:min-h-[240px]
        flex flex-col md:items-center md:justify-center md:text-center
        ${value.dark ? 'bg-[#18181b]' : 'bg-white'}
        ${value.icon ? 'items-center justify-center' : 'items-start justify-center pl-[24px] md:pl-0 py-[24px] md:py-0 md:p-[40px]'}`}
    >
      {value.icon ? (
        <CldImage src={M_ICON} alt="Manifestr" className="w-[120px] md:w-[120px] h-[53px] md:h-[96px] object-contain" />
      ) : (
        <>
          <h3
            className={`text-[24px] md:text-[36px] leading-[32px] md:leading-[36px] mb-[12px] md:mb-[16px] ${
              value.dark ? 'text-white' : 'text-black'
            }`}
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
          >
            {value.title}
          </h3>
          <p
            className={`text-[16px] md:text-[18px] leading-[24px] md:leading-[30px] max-w-[280px] ${
              value.dark ? 'text-white/70' : 'text-[#52525c]'
            }`}
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            {value.desc}
          </p>
        </>
      )}
    </motion.div>
  )
}

export default function WhatWeStandFor() {
  return (
    <section className="relative w-full overflow-hidden py-[48px] md:py-[98px]">
      {/* Background */}
      <div className="absolute inset-0 bg-[#deddda]" />
      <div className="absolute inset-0 opacity-90 overflow-hidden">
        <CldImage src={TEXTURE_BG} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[80px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[30px] md:text-[54px] leading-[normal] md:leading-[54px] tracking-[-0.6px] md:tracking-[-1.08px] text-black mb-[24px] md:mb-[80px]"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            {' What We '}
          </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Stand
          </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            {' For'}
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] md:gap-[42px]">
          {/* Top row */}
          {VALUES.slice(0, 3).map((v, i) => (
            <ValueCard key={i} value={v} index={i} />
          ))}
          {/* Bottom row — offset down slightly on desktop */}
          {VALUES.slice(3).map((v, i) => (
            <ValueCard key={i + 3} value={v} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
