import { useRef } from 'react'
import { motion } from 'framer-motion'

const SMILING_IMG = 'https://www.figma.com/api/mcp/asset/b25b9917-5a06-4c46-b4c7-04b56794d87d'
const PSYCHOLOGIST_IMG = 'https://www.figma.com/api/mcp/asset/9afe0166-ff03-43a5-bf40-5a7c6d14e411'
const LANDSCAPE_IMG = 'https://www.figma.com/api/mcp/asset/4167483a-283b-4ef9-b81b-5564950dac33'

const ARTICLES = [
  { img: SMILING_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: PSYCHOLOGIST_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: PSYCHOLOGIST_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: LANDSCAPE_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
]

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12L6 8l4-4" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4l4 4-4 4" />
    </svg>
  )
}

export default function TrendingArticles() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 424, behavior: 'smooth' })
  }

  return (
    <section className="w-full bg-[#f9fafb] py-[80px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[36px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[48px] leading-[60px] tracking-[-0.96px] text-black"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            Trending Articles
          </motion.h2>

          <button
            className="hidden md:flex items-center gap-[8px] h-[44px] px-[16px] rounded-[12px] border border-[#e4e4e7] bg-white text-[14px] leading-[20px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            All Trending Articles
            <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>

        {/* Cards row */}
        <div
          ref={scrollRef}
          className="flex gap-[24px] overflow-x-auto scrollbar-hide pb-[4px]"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {ARTICLES.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative rounded-[12px] overflow-hidden shrink-0 w-[300px] md:w-[400px] h-[400px] md:h-[500px] cursor-pointer group"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img src={article.img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/66 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-[16px] md:p-[32px] flex flex-col gap-[8px]">
                <span className="bg-white text-[#212122] text-[12px] leading-[18px] font-medium px-[12px] py-[6px] rounded-[16px] self-start" style={{ fontFamily: "Inter, sans-serif" }}>
                  New
                </span>
                <div className="flex items-center justify-between">
                  <p className="text-white text-[14px] md:text-[16px] leading-[24px] font-medium flex-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {article.title}
                  </p>
                  <svg className="w-[24px] h-[24px] text-white shrink-0 ml-[8px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-end gap-[10px] mt-[24px]">
          <button
            onClick={() => scroll(-1)}
            className="w-[44px] h-[44px] rounded-[6px] bg-[#b4b4b4] border border-[#e4e4e7] flex items-center justify-center text-white hover:bg-[#9a9a9a] transition-colors"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-[44px] h-[44px] rounded-[6px] bg-[#18181b] border border-[#e4e4e7] flex items-center justify-center text-white hover:bg-[#27272a] transition-colors"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}
