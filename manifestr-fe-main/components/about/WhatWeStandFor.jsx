import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const TEXTURE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041142/Rectangle_34624846_j5h0bo.png'
const M_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041250/Manifestr_Icon_Reverse_1_hxeiju.png'

const VALUES = [
  { title: 'Protect your brilliance', desc: 'Our best work comes when ambition and wellbeing go hand in hand.' },
  { icon: true, dark: true },
  { title: 'Ideas to Impact', desc: "Ideas don't change the world, execution does.", smallTitle: true },
  { title: 'Win Together', desc: 'Collaboration turns good work into great work.' },
  {
    title: 'Raise the Standard, with Impact',
    desc: "Great work doesn't just deliver, it shapes the future.",
    tallMobile: true,
  },
  { titleLines: ['Build What', 'Matters'], desc: 'We build with purpose, solving real problems that matter.', tallMobile: true },
]

function ValueCard({ value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`rounded-[16px] md:rounded-[20px] flex flex-col items-center justify-center text-center
        ${
          value.dark
            ? 'h-[140px] md:h-[247px]'
            : value.tallMobile
              ? 'h-[176px] md:h-[247px]'
              : 'h-[140px] md:h-[247px]'
        }
        ${value.dark ? 'bg-[#18181b]' : 'bg-white'}
        ${value.icon ? '' : 'px-[24px] py-[24px] md:px-[30px] md:py-[40px]'}`}
    >
      {value.icon ? (
        <div className="translate-x-[14px] md:translate-x-[18px]">
          <CldImage src={M_ICON} alt="Manifestr" className="w-[120px] md:w-[156px] h-[53px] md:h-[124px] object-contain" />
        </div>
      ) : (
        <>
          <h3
            className={`${value.smallTitle ? 'text-[24px] md:text-[32px]' : 'text-[24px] md:text-[36px]'} leading-[32px] md:leading-[36px] mb-[12px] md:mb-[16px] text-black`}
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
          >
            {value.titleLines ? (
              <>
                <span className="block">{value.titleLines[0]}</span>
                <span className="block">{value.titleLines[1]}</span>
              </>
            ) : (
              value.title
            )}
          </h3>
          <p
            className="text-[16px] md:text-[18px] leading-[26px] max-w-[310px] text-[#52525b]"
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
      {/* Background — on mobile the image is 2× container so the texture pattern appears half-size;
           parent clips the excess. Desktop uses normal cover fill. */}
      <div className="absolute inset-0 overflow-hidden bg-[#deddda]">
        <CldImage
          src={TEXTURE_BG}
          alt=""
          className="absolute object-cover object-center
            w-[100%] h-[100%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            md:w-full md:h-full md:inset-0 md:top-0 md:left-0 md:translate-x-0 md:translate-y-0"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-[118px]">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] md:gap-x-[42px] md:gap-y-[33px]">
          {VALUES.map((v, i) => (
            <ValueCard key={i} value={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
