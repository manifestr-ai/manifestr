import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const ROW_1 = [
  'https://picsum.photos/seed/cal1/320/240',
  'https://picsum.photos/seed/cal2/280/240',
  'https://picsum.photos/seed/cal3/320/240',
  'https://picsum.photos/seed/cal4/280/240',
  'https://picsum.photos/seed/cal5/320/240',
  'https://picsum.photos/seed/cal6/280/240',
]
const ROW_2 = [
  'https://picsum.photos/seed/cal7/280/240',
  'https://picsum.photos/seed/cal8/320/240',
  'https://picsum.photos/seed/cal9/280/240',
  'https://picsum.photos/seed/cal10/320/240',
  'https://picsum.photos/seed/cal11/280/240',
  'https://picsum.photos/seed/cal12/320/240',
]
const ROW_3 = [
  'https://picsum.photos/seed/cal13/320/240',
  'https://picsum.photos/seed/cal14/280/240',
  'https://picsum.photos/seed/cal15/320/240',
  'https://picsum.photos/seed/cal16/280/240',
  'https://picsum.photos/seed/cal17/320/240',
  'https://picsum.photos/seed/cal18/280/240',
]

function MarqueeRow({ images, direction = 'left', duration = 35 }) {
  const doubled = [...images, ...images]
  return (
    <div className="">
      <div
        className="flex gap-[16px] w-max"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((src, i) => (
          <div key={i} className="shrink-0 w-[240px] h-[180px] rounded-[12px] overflow-hidden">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(100%)' }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ToolOutput({ tool }) {
  const { prefix, name, calibreDescription, outputDescription } = tool
  const displayName = name.charAt(0).toUpperCase() + name.slice(1)
  const description = calibreDescription || outputDescription

  return (
    <section className="w-full bg-[#f4f4f5] relative overflow-hidden" style={{ minHeight: '600px' }}>
      <div
        className="absolute pointer-events-none  lg:flex flex-col gap-[16px]"
        style={{
          right: '-620px',
          top: '-200px',
          width: '1300px',
          transform: 'rotate(-45deg)',
          transformOrigin: 'center center',
        }}
      >
        <MarqueeRow images={ROW_1} direction="left" duration={30} />
        <MarqueeRow images={ROW_2} direction="right" duration={35} />
        <MarqueeRow images={ROW_3} direction="left" duration={32} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[80px] py-[64px] md:py-[106px]">
        <div className="max-w-[500px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-[24px]"
            style={{ fontSize: 'clamp(32px, 4.17vw, 60px)', lineHeight: '62px', letterSpacing: '-1.2px' }}
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The </span>
            <em style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Calibre</em>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              {' '}of Output {prefix} {displayName} delivers
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[16px] md:text-[18px] leading-[28px] text-[#52525b] mb-[24px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-[12px]"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-[8px] h-[44px] px-[24px] bg-[#18181b] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore the Output <ArrowUpRight className="w-[16px] h-[16px]" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center h-[44px] px-[24px] bg-white border border-[#e4e4e7] text-[#18181b] text-[14px] font-medium rounded-[6px] hover:bg-white/80 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
