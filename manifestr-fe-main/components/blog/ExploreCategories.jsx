import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const AVATARS = [
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029646/Ellipse_ratqc1.png',
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029645/Ellipse-3_yxnua2.png',
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029643/Ellipse-2_inrlf1.png',
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029642/Ellipse-1_temqyi.png',
]

export const BLOG_CATEGORIES = [
  'AI & Automation',
  'Business Growth',
  'Productivity',
  'Tools & Workflows',
  'Future of Work',
]

export default function ExploreCategories({ activeCategory, onCategoryChange }) {
  return (
    <section className="w-full bg-[#f9fafb] pt-[16px] pb-[48px] md:pt-[24px] md:pb-[80px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
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

        {/* Category pills — single row, scrollable; .no-scrollbar hides the bar (global.css) */}
        <div
          className="no-scrollbar flex flex-nowrap gap-[16px] md:gap-[24px] overflow-x-auto overflow-y-hidden overscroll-x-contain -mx-6 px-6 md:mx-0 md:px-0 pb-[4px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BLOG_CATEGORIES.map((cat, i) => {
            const isActive = activeCategory === cat
            return (
              <motion.button
                key={cat}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                onClick={() => onCategoryChange(cat)}
                className={`flex items-center gap-[5px] md:gap-[10px] rounded-full py-[10px] md:py-[18px] px-[10px] md:px-[18px] transition-all duration-200 cursor-pointer shrink-0
                  ${isActive
                    ? 'bg-[#18181b] shadow-md ring-2 ring-[#18181b]'
                    : 'bg-white shadow-[0px_0.5px_1px_0px_rgba(10,13,18,0.05)] md:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:shadow-md'
                  }`}
              >
                <CldImage
                  src={AVATARS[i % AVATARS.length]}
                  alt=""
                  className="w-[34px] h-[34px] md:w-[56px] md:h-[56px] rounded-full object-cover shrink-0"
                />
                <span
                  className={`text-[14px] md:text-[20px] leading-[17px] md:leading-[28px] whitespace-nowrap transition-colors duration-200 ${isActive ? 'text-white' : 'text-black'}`}
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontStyle: 'italic' }}
                >
                  {cat}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
