import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

export default function ToolFeatures({ tool }) {
  const { prefix, name, howItWorks, featureHeading, featureImages } = tool

  if (!howItWorks || howItWorks.length === 0) return null

  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <section className="w-full bg-white py-[48px] md:py-[100px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-black text-[32px] md:text-[51px] leading-[1.2] tracking-[-0.64px] md:tracking-[-1.02px] mb-[32px] md:mb-[72px]"
        >
          {featureHeading ? (
            featureHeading.map((part, i) =>
              part.style === 'italic'
                ? <em key={i} style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>{part.text}</em>
                : <span key={i} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>{part.text}</span>
            )
          ) : (
            <>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                How {prefix}{' '}
              </span>
              <em style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>
                {displayName}
              </em>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                {' '}moves your work forward
              </span>
            </>
          )}
        </motion.h2>

        <div className="flex flex-col gap-[24px] md:gap-[36px]">
          {howItWorks.map((item, i) => {
            const imageLeft = i % 2 === 0
            const imageUrl = featureImages?.[i]
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`flex flex-col ${imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-[24px] md:gap-[64px]`}
              >
                <div className={`order-2 md:order-0 shrink-0 w-[299px] md:w-[502px] h-[231px] md:h-[387px] rounded-[12px] overflow-hidden ${imageUrl ? '' : 'bg-[#E3E3E3] flex items-center justify-center'}`}>
                  {imageUrl ? (
                    <CldImage src={imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                      <rect x="4" y="10" width="56" height="44" rx="4" stroke="#71717A" strokeWidth="2" />
                      <circle cx="20" cy="24" r="5" stroke="#71717A" strokeWidth="2" />
                      <path d="M4 42L18 28L27 38L38 26L60 48" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <div className="order-1 md:order-0 flex-1 flex flex-col gap-[12px] items-center md:items-start text-center md:text-left">
                  <span
                    className="shrink-0 text-black text-[48px] md:text-[30px] leading-[38px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {item.number}
                  </span>
                  <h3
                    className="text-black text-[30px] leading-[38px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[#52525B] text-[16px] md:text-[18px] leading-[24px] md:leading-[26px]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, maxWidth: '529px' }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
