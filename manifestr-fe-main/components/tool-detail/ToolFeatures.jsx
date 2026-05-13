import { motion } from 'framer-motion'
import CldImage from '../ui/ToolkitCldImage'

export default function ToolFeatures({ tool }) {
  const { prefix, name, howItWorks, featureHeading, featureImages } = tool

  if (!howItWorks || howItWorks.length === 0) return null

  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <section className="w-full bg-white py-[48px] lg:py-[100px]">
      <div className="w-full max-w-[1440px] mx-auto px-[41px] md:px-8 lg:px-10 xl:px-12 min-[1600px]:px-16">

        {/* Section heading — mobile: wraps to 2 lines; desktop: single line */}
        <div className="mb-[32px] lg:mb-[72px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-black text-[32px] lg:text-[51px] leading-[1.2] tracking-[-0.64px] lg:tracking-[-1.02px] w-full lg:w-max lg:whitespace-nowrap max-w-full mx-auto"
          >
            {featureHeading ? (
              featureHeading.map((part, i) =>
                part.style === 'italic'
                  ? <em key={i} style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>{part.text}</em>
                  : <span key={i} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>{part.text}</span>
              )
            ) : (
              <>
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>How {prefix} </span>
                <em style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>{displayName}</em>
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> moves your work forward</span>
              </>
            )}
          </motion.h2>
        </div>

        {/* Feature rows — Figma 14272:24539 mobile / 12468:22075‑22082 desktop */}
        <div className="flex flex-col gap-[28px] lg:gap-[36px]">
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
                className={`flex flex-col ${imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center justify-center gap-[16px] lg:gap-[64px]`}
              >
                {/* Text block — mobile: order-1; desktop: grid so body lines up with title after number */}
                <div className="order-1 lg:order-0 flex flex-1 min-w-0 flex-col items-center lg:items-stretch w-full text-center lg:text-left gap-[12px] lg:gap-0">

                  {/* Number — mobile only */}
                  <p
                    className="lg:hidden text-[48px] leading-[38px] text-black text-center"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {item.number}
                  </p>

                  {/* Desktop: title row (number + title), then body aligned with title start */}
                  <div className="hidden lg:flex lg:flex-col w-full min-w-0 gap-3">
                    <div className="flex flex-row gap-x-3 items-baseline min-w-0">
                      <span
                        className="shrink-0 text-black text-[30px] leading-[38px]"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                      >
                        {item.number}
                      </span>
                      <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
                        <h3
                          className="w-max min-w-0 text-black text-[30px] leading-[38px] text-left whitespace-nowrap"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-3 min-w-0">
                      <span
                        aria-hidden
                        className="invisible shrink-0 select-none text-[30px] leading-[38px] pointer-events-none"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                      >
                        {item.number}
                      </span>
                      <p
                        className="min-w-0 max-w-[529px] text-[#52525b] text-[18px] leading-[26px] tracking-normal"
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <h3
                    className="lg:hidden text-black text-[30px] leading-[38px] text-center w-full"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="lg:hidden text-[#52525b] text-[18px] leading-[26px] tracking-normal w-full max-w-[520px] mx-auto"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Image — mobile: order-2 (below text), desktop: natural DOM order */}
                <div
                  className={`order-2 lg:order-0 shrink-0 w-full max-w-[299px] lg:max-w-none mx-auto lg:mx-0 h-[231px] lg:h-[414px] lg:w-[540px] rounded-[12px] overflow-hidden ${imageUrl ? '' : 'bg-[#E3E3E3] flex items-center justify-center'}`}
                >
                  {imageUrl ? (
                    <CldImage src={imageUrl} alt="" className="w-full h-full object-cover pointer-events-none rounded-[12px]" />
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                      <rect x="4" y="10" width="56" height="44" rx="4" stroke="#71717A" strokeWidth="2" />
                      <circle cx="20" cy="24" r="5" stroke="#71717A" strokeWidth="2" />
                      <path d="M4 42L18 28L27 38L38 26L60 48" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
