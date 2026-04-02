import { useRef } from 'react'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const AVATARS = [
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029646/Ellipse_ratqc1.png',
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029645/Ellipse-3_yxnua2.png',
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029643/Ellipse-2_inrlf1.png',
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029642/Ellipse-1_temqyi.png',
]

const CATEGORIES = [
  'AI Strategy & Insights',
  'AI Strategy & Insights',
  'AI Strategy & Insights',
  'AI & Business',
]

export default function ExploreCategories() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section className="w-full bg-[#f9fafb] py-[48px] md:py-[80px] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[30px] md:text-[48px] leading-[38px] md:leading-[60px] tracking-[-0.96px] text-black text-center md:text-left mb-[16px] md:mb-[36px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Explore Categories
        </motion.h2>

        {/* Category pills */}
        <div
          ref={scrollRef}
          className="flex gap-[21px] md:gap-[40px] overflow-x-auto scrollbar-hide pb-[4px] -mx-6 px-6 md:mx-0 md:px-0"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="flex items-center gap-[5px] md:gap-[10px] bg-white rounded-full py-[10px] md:pt-[18px] md:pb-[24px] px-[10px] md:px-[18px] shadow-[0px_0.5px_1px_0px_rgba(10,13,18,0.05)] md:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] shrink-0 hover:shadow-md transition-shadow cursor-pointer"
            >
              <CldImage
                src={AVATARS[i % AVATARS.length]}
                alt=""
                className="w-[34px] h-[34px] md:w-[64px] md:h-[64px] rounded-full object-cover shrink-0"
              />
              <span
                className="text-[14px] md:text-[24px] leading-[17px] md:leading-[32px] text-black whitespace-nowrap"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontStyle: 'italic' }}
              >
                {cat}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center md:justify-end gap-[10px] mt-[16px] md:mt-[24px]">
          <button
            onClick={() => scroll(-1)}
            className="w-[44px] h-[44px] rounded-[6px] bg-[#b4b4b4] border border-[#e4e4e7] flex items-center justify-center text-white hover:bg-[#9a9a9a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12L6 8l4-4" />
            </svg>
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-[44px] h-[44px] rounded-[6px] bg-[#18181b] border border-[#e4e4e7] flex items-center justify-center text-white hover:bg-[#27272a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
