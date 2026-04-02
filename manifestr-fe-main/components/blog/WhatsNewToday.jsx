import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const MAIN_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029653/Toolss_xuvbcl.png'
const ARTBOARD_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029632/Artboard_1_4x-100_1_zci1hz.png'
const DESK_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029634/7076118_1_by6jt4.png'
const FISTBUMP_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029633/colleagues-giving-fist-bump_1_ntfsqc.png'
const FINGER_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029653/Toolss_xuvbcl.png'
const PEOPLE_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029633/colleagues-giving-fist-bump_1_ntfsqc.png'

const SMALL_CARDS = [
  { img: ARTBOARD_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: DESK_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: FISTBUMP_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
]

const MOBILE_THUMBNAILS = [
  { img: FINGER_IMG, title: 'Mi tincidunt elit....', date: '26 January 2025' },
  { img: PEOPLE_IMG, title: 'Mi tincidunt elit....', date: '26 January 2025' },
  { img: ARTBOARD_IMG, title: 'Mi tincidunt elit....', date: '26 January 2025' },
  { img: FISTBUMP_IMG, title: 'Mi tincidunt elit....', date: '26 January 2025' },
]

export default function WhatsNewToday() {
  return (
    <section className="w-full bg-[#f9fafb] py-[48px] md:py-[96px] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        {/* Header */}
        <div className="flex flex-col items-center md:flex-row md:items-end justify-between gap-[12px] md:gap-[16px] mb-[16px] md:mb-[36px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[30px] md:text-[48px] leading-[38px] md:leading-[60px] tracking-[-0.96px] text-black text-center md:text-left"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            {"What's New "}
            <span className="text-black">Today</span>
          </motion.h2>
          <p className="text-[16px] leading-[24px] text-center md:text-right max-w-[445px] text-[#52525b]" style={{ fontFamily: "Inter, sans-serif" }}>
            Discover How Our Tool Has Helped Real Users Achieve More and Simplify Their Workflow
          </p>
        </div>

        {/* Mobile — 2x2 thumbnail grid */}
        <div className="md:hidden flex flex-col gap-[16px]">
          {[0, 2].map((startIdx) => (
            <div key={startIdx} className="flex gap-[16px]">
              {MOBILE_THUMBNAILS.slice(startIdx, startIdx + 2).map((post, i) => (
                <div key={i} className="w-[calc(50%-8px)] flex flex-col">
                  <div className="w-full h-[155px] rounded-[6px] overflow-hidden bg-white">
                    <CldImage src={post.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[8px] mt-[12px]">
                    <p
                      className="text-[16px] leading-[24px] text-[#18181b] font-semibold"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {post.title}
                    </p>
                    <p
                      className="text-[14px] leading-[20px] text-[#18181b]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                    >
                      {post.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="flex justify-center mt-[16px]">
            <button
              className="flex items-center gap-[8px] h-[44px] px-[16px] rounded-[12px] border border-[#e4e4e7] bg-white text-[14px] leading-[20px] font-medium text-[#18181b]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              View All Recent
              <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop — large card + 3 smaller cards */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[12px] overflow-hidden h-[446px] mb-[24px] cursor-pointer group"
          >
            <CldImage src={MAIN_IMG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/66 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-[56px] py-[32px] flex flex-col gap-[8px]">
              <span className="bg-white text-[#212122] text-[12px] leading-[18px] font-medium px-[12px] py-[6px] rounded-[16px] self-start" style={{ fontFamily: "Inter, sans-serif" }}>
                New
              </span>
              <div className="flex items-center justify-between">
                <p className="text-white text-[16px] leading-[24px] font-medium flex-1 max-w-[1000px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  Best Practices for Integrating AI into Your Existing Business Workflows
                </p>
                <svg className="w-[24px] h-[24px] text-white shrink-0 ml-[8px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-3 gap-[20px]">
            {SMALL_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative rounded-[12px] overflow-hidden h-[338px] cursor-pointer group"
              >
                <CldImage src={card.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/66 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-[32px] flex flex-col gap-[8px]">
                  <span className="bg-white text-[#212122] text-[12px] leading-[18px] font-medium px-[12px] py-[6px] rounded-[16px] self-start" style={{ fontFamily: "Inter, sans-serif" }}>
                    New
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="text-white text-[16px] leading-[24px] font-medium flex-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {card.title}
                    </p>
                    <svg className="w-[24px] h-[24px] text-white shrink-0 ml-[8px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
