import { motion } from 'framer-motion'

const BG_IMG = 'https://www.figma.com/api/mcp/asset/f6026080-9b74-4c76-9a37-28157d52327e'

export default function AffiliateBanner() {
  return (
    <section className="w-full px-6 md:px-[80px] py-[60px] md:py-[80px] bg-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[240px] md:h-[310px] rounded-[12px] overflow-hidden"
      >
        {/* Background image */}
        <img
          src={BG_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center gap-[24px] px-[32px] md:px-[60px]">
          <h2
            className="text-[32px] md:text-[54px] leading-tight md:leading-[72px] tracking-[-1.08px] text-white max-w-[608px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              Apply to join our{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              Exclusive
            </span>
            <br />
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              Affiliate Program
            </span>
          </h2>

          <button
            className="self-start bg-[#18181b] text-white text-[16px] md:text-[18px] leading-[20px] font-medium px-[24px] py-[14px] rounded-[6px] hover:bg-[#333] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Apply for Access
          </button>
        </div>
      </motion.div>
    </section>
  )
}
