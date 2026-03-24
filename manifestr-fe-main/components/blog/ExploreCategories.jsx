import { useRef } from 'react'
import { motion } from 'framer-motion'

const AVATARS = [
  'https://www.figma.com/api/mcp/asset/7aa03216-7732-46e8-a00f-fab06295ac2b',
  'https://www.figma.com/api/mcp/asset/a070910e-d8d0-4846-b83c-28ce37c331f7',
  'https://www.figma.com/api/mcp/asset/bc2cda2d-c5c1-496c-ae7f-2bb13537bbbd',
  'https://www.figma.com/api/mcp/asset/40049a67-5ac7-43c5-b491-d854bb083aaa',
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
    <section className="w-full bg-[#f9fafb] py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[36px] md:text-[48px] leading-[60px] tracking-[-0.96px] text-black mb-[36px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          Explore from Categories
        </motion.h2>

        {/* Category pills */}
        <div
          ref={scrollRef}
          className="flex gap-[40px] overflow-x-auto scrollbar-hide pb-[4px]"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="flex items-center gap-[10px] bg-white rounded-full pt-[18px] pb-[24px] px-[18px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] shrink-0 hover:shadow-md transition-shadow cursor-pointer"
            >
              <img
                src={AVATARS[i]}
                alt=""
                className="w-[64px] h-[64px] rounded-full object-cover shrink-0"
              />
              <span
                className="text-[24px] leading-[32px] text-black whitespace-nowrap"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontStyle: 'italic' }}
              >
                {cat}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-end gap-[10px] mt-[24px]">
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
