import { motion } from 'framer-motion'

export default function ToolFeatures({ tool }) {
  const { prefix, name, howItWorks } = tool

  if (!howItWorks || howItWorks.length === 0) return null

  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <section className="w-full bg-white py-[64px] md:py-[100px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-black mb-[48px] md:mb-[72px]"
          style={{
            fontSize: 'clamp(32px, 3.54vw, 51px)',
            lineHeight: '1.2',
            letterSpacing: '-1.02px',
          }}
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
            How {prefix} {displayName} moves your work{' '}
          </span>
          <em style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>
            forward
          </em>
        </motion.h2>

        <div className="flex flex-col gap-[24px] md:gap-[36px]">
          {howItWorks.map((item, i) => {
            const imageLeft = i % 2 === 0
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`flex flex-col ${imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-[24px] md:gap-[64px]`}
              >
                <div className="shrink-0 w-full md:w-[502px] h-[260px] md:h-[387px] rounded-[12px] bg-[#E3E3E3] flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                    <rect x="4" y="10" width="56" height="44" rx="4" stroke="#71717A" strokeWidth="2" />
                    <circle cx="20" cy="24" r="5" stroke="#71717A" strokeWidth="2" />
                    <path d="M4 42L18 28L27 38L38 26L60 48" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="flex-1 flex gap-[16px] md:gap-[20px] items-start">
                  <span
                    className="shrink-0 text-black"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '30px', lineHeight: '38px' }}
                  >
                    {item.number}
                  </span>
                  <div className="flex flex-col gap-[12px]">
                    <h3
                      className="text-black"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: '30px', lineHeight: '38px' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[#52525B]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, fontSize: '18px', lineHeight: '26px', maxWidth: '529px' }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
