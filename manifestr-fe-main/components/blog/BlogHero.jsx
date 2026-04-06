import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const INITIAL_FILTERS = ['Filter', 'Filter', 'Filter', 'Filter', 'Filter']

const SUIT_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029368/men-suit-analyzing-results-chart_4_mgr4hr.png'
const PLACEHOLDER_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029367/beautiful-beach-sunrise-blue-sky_1_gzozft.png'
const BRANDING_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029366/Placeholder_Image_1_ydy8yg.png'
const DESK_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029366/branding-strategy-marketing-business-graphic-design_1_f1jg2a.png'
const BEACH_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029365/high-angle-desk-arrangement-with-cup_1_vpih60.png'

function BlogCard({ img, title, slug, tag, tagStyle = 'white', delay = 0, className = '' }) {
  const isGrayTag = tagStyle === 'gray'
  return (
    <Link href={`/blog/${slug}`} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        className="relative rounded-[12px] overflow-hidden group cursor-pointer h-full"
      >
        <CldImage src={img} alt="" className="w-full h-full object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-t from-black/66 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-[16px] md:p-[24px] flex flex-col gap-[10px]">
          <span
            className={`text-[12px] leading-[18px] font-medium px-[12px] py-[6px] rounded-[16px] self-start ${
              isGrayTag
                ? 'border border-[#9ca3af] text-[#6b7280]'
                : 'bg-white text-[#212122]'
            }`}
            style={{
              fontFamily: 'Inter, sans-serif',
              ...(isGrayTag
                ? { background: 'linear-gradient(90deg, #e5e7eb 0%, #e5e7eb 100%), linear-gradient(90deg, #f4f4f5 0%, #f4f4f5 100%)' }
                : {}),
            }}
          >
            {tag}
          </span>
          <div className="flex items-center justify-between gap-[8px]">
            <p
              className={`text-white flex-1 font-semibold ${
                isGrayTag ? 'text-[20px] leading-[30px]' : 'text-[16px] leading-[24px] font-medium'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {title}
            </p>
            <svg
              className="w-[24px] h-[24px] text-white shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function BlogHero() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState([...INITIAL_FILTERS])

  const removeFilter = (idx) => setFilters((prev) => prev.filter((_, i) => i !== idx))

  const THUMBNAIL_POSTS = [
    { img: PLACEHOLDER_IMG, title: 'Mi tincidunt elit, id quisque ....', date: '26 January 2025' },
    { img: BRANDING_IMG, title: 'Mi tincidunt elit, id quisque ....', date: '26 January 2025' },
    { img: BEACH_IMG, title: 'Mi tincidunt elit, id quisque ....', date: '26 January 2025' },
    { img: DESK_IMG, title: 'Mi tincidunt elit, id quisque ....', date: '26 January 2025' },
  ]

  return (
    <section
      className="w-full py-[48px] md:py-[96px]"
      style={{
        background: 'linear-gradient(90deg, #e4e4e7 29%, rgba(243,244,246,0) 100%)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px] flex flex-col items-center gap-[25px] md:gap-[32px]">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-[36px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px] text-black"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The latest </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>writings</span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> from our team</span>
        </motion.h1>

        {/* Search + Filters button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-[12px] w-full"
        >
          <div className="flex items-center gap-[12px] w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <svg className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full md:w-[341px] h-[44px] pl-[42px] pr-[16px] rounded-[6px] border border-[#d5d7da] bg-white text-[16px] leading-[24px] text-[#18181b] placeholder-[#71717a] outline-none focus:border-[#18181b] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button
              className="h-[44px] w-[103px] shrink-0 rounded-[6px] bg-[#e4e4e7] text-[14px] leading-[20px] font-medium text-[#020617] hover:bg-[#d4d4d8] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Filters
            </button>
          </div>

          {/* Removable filter pills — desktop only */}
          {filters.length > 0 && (
            <div className="hidden md:flex items-center gap-[12px] flex-wrap justify-center">
              {filters.map((f, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-[4px] pl-[16px] pr-[6px] py-[8px] rounded-[16px] border border-[#e4e4e7] text-[12px] leading-[18px] font-medium text-[#71717a] cursor-default"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) 100%), linear-gradient(90deg, #f4f4f5 0%, #f4f4f5 100%)',
                  }}
                >
                  {f}
                  <button
                    onClick={() => removeFilter(idx)}
                    className="w-[16px] h-[16px] flex items-center justify-center rounded hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1 1l6 6M7 1l-6 6" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile bento grid */}
      <div className="md:hidden max-w-[1280px] mx-auto px-6 mt-[16px] flex flex-col gap-[16px]">
        <BlogCard
          img={SUIT_IMG}
          title="Best Practices for Integrating AI into Your Existing Business Workflows"
          slug="integrating-ai-business-workflows"
          tag="New"
          className="w-full h-[506px]"
        />
        {[0, 2].map((startIdx) => (
          <div key={startIdx} className="flex gap-[16px]">
            {THUMBNAIL_POSTS.slice(startIdx, startIdx + 2).map((post, i) => (
              <Link key={i} href={`/blog/${post.title}`} className="w-[calc(50%-8px)]">
                <div className="flex flex-col">
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
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop bento grid */}
      <div className="hidden md:flex max-w-[1280px] mx-auto px-[80px] mt-[64px] flex-col gap-[24px]">
        <div className="flex flex-row gap-[24px]" style={{ height: 'auto' }}>
          <BlogCard
            img={SUIT_IMG}
            title="Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam."
            slug="mi-tincidunt-elit"
            tag="Tag"
            tagStyle="gray"
            className="flex-809 h-[446px]"
          />
          <BlogCard
            img={PLACEHOLDER_IMG}
            title="Best Practices for Integrating AI into Your Existing Business Workflows"
            slug="integrating-ai-business-workflows"
            tag="New"
            delay={0.1}
            className="flex-447 h-[446px]"
          />
        </div>
        <div className="flex flex-row gap-[24px] h-[338px]">
          <div className="flex flex-row gap-[20px] flex-809">
            <BlogCard
              img={BRANDING_IMG}
              title="Best Practices for Integrating AI into Your Existing Business Workflows"
              slug="branding-strategy-ai"
              tag="New"
              delay={0.1}
              className="flex-1 h-full"
            />
            <BlogCard
              img={DESK_IMG}
              title="Best Practices for Integrating AI into Your Existing Business Workflows"
              slug="desk-productivity-ai"
              tag="New"
              delay={0.2}
              className="flex-1 h-full"
            />
          </div>
          <BlogCard
            img={BEACH_IMG}
            title="Best Practices for Integrating AI into Your Existing Business Workflows"
            slug="team-collaboration-ai"
            tag="New"
            delay={0.3}
            className="flex-447 h-full"
          />
        </div>
      </div>
    </section>
  )
}
