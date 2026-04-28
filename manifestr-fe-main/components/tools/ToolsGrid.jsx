import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'
import { TOOLS, MOBILE_TOOL_ORDER, MobileToolAccordion } from './toolkitMobileShared'

const HERO_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774944466/37_modern-founder_model-07-shot-02b_2_wj98bv.svg'

export { TOOLS, MOBILE_TOOL_ORDER, MobileToolAccordion }

/* ── Desktop grid card — subtle lift + shadow on hover, no slide-up overlay ── */
function ToolCard({ tool, index }) {
  const router = useRouter()

  if (tool.type === 'logo') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -5, scale: 1.012, transition: { duration: 0.18, ease: 'easeOut' } }}
        className="relative rounded-[12px] border border-[#e4e3e1] flex items-center justify-center aspect-302/369 cursor-pointer overflow-hidden shadow-sm"
        style={{ willChange: 'transform' }}
      >
        <CldImage
          src="https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943941/Wordsmith_1_jfi1kq.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)]" />
        {/* Shift mark slightly right of geometric center to compensate for the dot */}
        <CldImage
          src={tool.image}
          alt="MANIFESTR"
          className="absolute z-10 top-1/2 w-[145px] h-[115px] object-contain"
          style={{ left: '50%', transform: 'translate(calc(-50% + 12px), -50%)' }}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.012, transition: { duration: 0.18, ease: 'easeOut' } }}
      className="relative bg-white rounded-[12px] overflow-hidden aspect-302/369 cursor-pointer shadow-sm"
      style={{ willChange: 'transform' }}
      onClick={() => { if (tool.slug) router.push(`/tools/${tool.slug}`) }}
    >
      <div className="flex flex-col p-[12px] h-full">
        <div className="relative w-full flex-1 rounded-[12px] overflow-hidden">
          <CldImage
            src={tool.image}
            alt=""
            className="w-full h-full object-cover rounded-[12px]"
          />
        </div>

        <div className="flex flex-col items-center mt-[10px]">
          <h3 className="text-center tracking-[-0.6px]">
            {tool.titleParts.map((part, i) => (
              <span
                key={i}
                className="text-black leading-[44px]"
                style={{
                  fontFamily: part.font === 'ivy'
                    ? "'IvyPresto Headline', serif"
                    : "'Hanken Grotesk', sans-serif",
                  fontWeight: part.font === 'ivy' ? 600 : 800,
                  fontStyle: part.font === 'ivy' ? 'italic' : 'normal',
                  fontSize: `${part.size}px`,
                }}
              >
                {part.text}
              </span>
            ))}
          </h3>
          <p
            className="text-[14px] leading-[20px] text-black text-center mt-[6px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {tool.tags.join(' • ')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ToolsGrid() {
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)
  const mobileTools = MOBILE_TOOL_ORDER.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(Boolean)

  return (
    <section className="relative w-full min-w-0 bg-[#e9e9ea]">
      {/* Desktop hero image */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute top-0 bottom-0 overflow-hidden pointer-events-none"
      >
        <CldImage
          src={HERO_IMAGE}
          alt=""
          className="h-[102%] w-auto max-w-none object-cover mt-[-108px] object-top"
          priority
        />
      </div>

      {/* ELEVATE watermark */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 translate-y-[23%] text-[91px] md:text-[200px] lg:text-[300px] opacity-[0.32] pointer-events-none select-none whitespace-nowrap leading-none left-[21px] md:left-auto lg:left-[18%] xl:left-[12%] 2xl:left-[20%]"
        style={{
          fontFamily: "'IvyPresto Headline', serif",
          fontWeight: 600,
          fontStyle: 'italic',
          color: '#a3a3a3',
        }}
      >
        ELEVATE
      </span>

      {/* ── MOBILE ── */}
      <div className="md:hidden relative z-10 px-6 pt-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-[329px] mx-auto"
        >
          <h2 className="text-[32px] leading-[45px] tracking-[-0.65px] capitalize mb-4">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
              Eight intelligent tools. One connected{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              System.
            </span>
          </h2>
          <p
            className="text-[18px] leading-[26px] text-[#52525b] max-w-[321px] mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            High-end, executive-level documentation across strategy, decks,
            documents, data, visuals and delivery, produced through one seamless
            system. MANIFESTR enables professionals to move from idea to
            execution with speed and confidence.
          </p>
        </motion.div>

        <div className="flex flex-col gap-[17px] max-w-[345px] mx-auto">
          {mobileTools.map((tool, index) => (
            <MobileToolAccordion
              key={tool.slug}
              tool={tool}
              isExpanded={mobileActiveIndex === index}
              onTap={() => setMobileActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block relative z-10 max-w-[1040px] mx-auto px-[80px] lg:max-w-[700px] lg:px-0 lg:ml-auto lg:mr-[5%] xl:max-w-[960px] xl:mr-[8%] 2xl:ml-[32%] 2xl:mr-auto pt-[126px] pb-[320px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[42px] max-w-[900px] mx-auto"
        >
          <h2 className="text-[36px] leading-[49px] tracking-[-0.72px] capitalize mb-[16px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
              Eight intelligent tools. One connected{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              System.
            </span>
          </h2>
          <p
            className="text-[18px] leading-[26px] text-[#52525b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            High-end, executive-level documentation across strategy, decks,
            documents, data, visuals and delivery, produced through one seamless
            system. MANIFESTR enables professionals to move from idea to
            execution with speed and confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-x-[26px] gap-y-[36px] pt-2">
          {TOOLS.map((tool, i) => (
            <ToolCard
              key={tool.type === 'logo' ? 'logo' : tool.titleParts.map((p) => p.text).join('')}
              tool={tool}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
