import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const BG_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027959/Rectangle_34624854_ga3xmx.png'
const MARBLE_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775028317/Frame_2147230153_tgaqvl.png'

export default function AffiliateBanner() {
  return (
    <section className="w-full bg-white">
      {/* Mobile banner */}
      <div className="md:hidden flex justify-center py-[8px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative w-[333px] h-[120px] overflow-hidden rounded-[8px]"
        >
          <CldImage
            src={MARBLE_IMG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center gap-[8px] px-[14px] py-[16px]">
            <h2
              className="text-[19px] leading-[25px] tracking-[-0.38px] text-white max-w-[214px]"
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
              className="self-start bg-[#18181b] text-white text-[10px] leading-[12px] font-medium px-[8px] py-[3px] rounded-[2px] hover:bg-[#333] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Apply for Access
            </button>
          </div>
        </motion.div>
      </div>

      {/* Desktop banner */}
      <div className="hidden md:block px-[80px] py-[80px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[310px] rounded-[12px] overflow-hidden"
        >
          <CldImage
            src={BG_IMG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col justify-center gap-[24px] px-[60px]">
            <h2
              className="text-[54px] leading-[72px] tracking-[-1.08px] text-white max-w-[608px]"
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
              className="self-start bg-[#18181b] text-white text-[18px] leading-[20px] font-medium px-[24px] py-[14px] rounded-[6px] hover:bg-[#333] transition-colors duration-200"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Apply for Access
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
