import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const SUIT_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029368/men-suit-analyzing-results-chart_4_mgr4hr.png'
const PLACEHOLDER_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029367/beautiful-beach-sunrise-blue-sky_1_gzozft.png'
const BRANDING_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029366/Placeholder_Image_1_ydy8yg.png'
const DESK_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029366/branding-strategy-marketing-business-graphic-design_1_f1jg2a.png'
const BEACH_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029365/high-angle-desk-arrangement-with-cup_1_vpih60.png'

const BLOG_POSTS = [
  {
    img: SUIT_IMG,
    title: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam.',
    slug: 'mi-tincidunt-elit',
    tag: 'Tag',
    tagStyle: 'gray',
    category: 'AI & Automation',
  },
  {
    img: PLACEHOLDER_IMG,
    title: 'Best Practices for Integrating AI into Your Existing Business Workflows',
    slug: 'integrating-ai-business-workflows',
    tag: 'New',
    tagStyle: 'white',
    category: 'Tools & Workflows',
  },
  {
    img: BRANDING_IMG,
    title: 'Best Practices for Integrating AI into Your Existing Business Workflows',
    slug: 'branding-strategy-ai',
    tag: 'New',
    tagStyle: 'white',
    category: 'Business Growth',
  },
  {
    img: DESK_IMG,
    title: 'Best Practices for Integrating AI into Your Existing Business Workflows',
    slug: 'desk-productivity-ai',
    tag: 'New',
    tagStyle: 'white',
    category: 'Productivity',
  },
  {
    img: BEACH_IMG,
    title: 'Best Practices for Integrating AI into Your Existing Business Workflows',
    slug: 'team-collaboration-ai',
    tag: 'New',
    tagStyle: 'white',
    category: 'Future of Work',
  },
]

function postMatchesQuery(post, q) {
  if (!q) return true
  const hay = `${post.title} ${post.tag} ${post.slug} ${post.category}`.toLowerCase()
  return hay.includes(q)
}

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

export default function BlogHero({ activeCategory, onClearCategory }) {
  const [search, setSearch] = useState('')

  const q = useMemo(() => search.trim().toLowerCase(), [search])
  const isFiltering = q.length > 0 || !!activeCategory

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      const matchesSearch = postMatchesQuery(p, q)
      const matchesCategory = !activeCategory || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [q, activeCategory])

  const p0 = BLOG_POSTS[0]
  const p1 = BLOG_POSTS[1]
  const p2 = BLOG_POSTS[2]
  const p3 = BLOG_POSTS[3]
  const p4 = BLOG_POSTS[4]

  return (
    <section
      className="w-full py-[48px] md:py-[96px]"
      style={{
        background: 'linear-gradient(90deg, #e4e4e7 29%, rgba(243,244,246,0) 100%)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px] flex flex-col items-center gap-[25px] md:gap-[32px]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-[36px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px] text-black"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Latest </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>insights</span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> from MANIFESTR</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-[12px] w-full"
        >
          {/* Search row */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-[12px] w-full md:w-auto"
          >
            <div className="relative flex-1 md:flex-none">
              <svg className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles"
                autoComplete="off"
                className="w-full md:w-[341px] h-[44px] pl-[42px] pr-[16px] rounded-[6px] border border-[#d5d7da] bg-white text-[16px] leading-[24px] text-[#18181b] placeholder-[#71717a] outline-none focus:border-[#18181b] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
                aria-label="Search blog articles"
              />
            </div>
            <button
              type="submit"
              className="h-[44px] shrink-0 rounded-[6px] bg-[#18181b] px-5 text-[14px] leading-[20px] font-medium text-white hover:bg-[#27272a] transition-colors min-w-[103px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Tech search
            </button>
          </form>

          {/* Active category tag */}
          <AnimatePresence>
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-[8px]"
              >
                <span
                  className="text-[13px] leading-[20px] text-[#71717a]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Filtered by:
                </span>
                <span
                  className="inline-flex items-center gap-[6px] pl-[12px] pr-[8px] py-[6px] rounded-full bg-[#18181b] text-white text-[13px] leading-[18px] font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {activeCategory}
                  <button
                    type="button"
                    onClick={onClearCategory}
                    className="w-[16px] h-[16px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                    aria-label={`Remove ${activeCategory} filter`}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1 1l6 6M7 1l-6 6" />
                    </svg>
                  </button>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Filtered / search results view */}
      {isFiltering && (
        <div className="max-w-[1280px] mx-auto px-6 md:px-[80px] mt-[32px] md:mt-[48px]">
          {filtered.length === 0 ? (
            <p
              className="text-center text-[16px] text-[#52525b] py-8"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              No articles match your search. Try a different term or category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[24px]">
              {filtered.map((post, i) => (
                <BlogCard
                  key={post.slug}
                  img={post.img}
                  title={post.title}
                  slug={post.slug}
                  tag={post.tag}
                  tagStyle={post.tagStyle}
                  delay={i * 0.05}
                  className="w-full h-[min(400px,55vw)] sm:h-[320px]"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Default bento grid — shown only when no search/category filter */}
      {!isFiltering && (
        <>
          {/* Mobile bento */}
          <div className="md:hidden max-w-[1280px] mx-auto px-6 mt-[16px] flex flex-col gap-[16px]">
            <BlogCard
              img={p1.img}
              title={p1.title}
              slug={p1.slug}
              tag={p1.tag}
              tagStyle={p1.tagStyle}
              className="w-full h-[506px]"
            />
            <div className="flex gap-[16px]">
              <Link href={`/blog/${p2.slug}`} className="w-[calc(50%-8px)]">
                <div className="flex flex-col">
                  <div className="w-full h-[155px] rounded-[6px] overflow-hidden bg-white">
                    <CldImage src={p2.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[8px] mt-[12px]">
                    <p className="text-[16px] leading-[24px] text-[#18181b] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{p2.title}</p>
                    <p className="text-[14px] leading-[20px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>26 January 2025</p>
                  </div>
                </div>
              </Link>
              <Link href={`/blog/${p3.slug}`} className="w-[calc(50%-8px)]">
                <div className="flex flex-col">
                  <div className="w-full h-[155px] rounded-[6px] overflow-hidden bg-white">
                    <CldImage src={p3.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[8px] mt-[12px]">
                    <p className="text-[16px] leading-[24px] text-[#18181b] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{p3.title}</p>
                    <p className="text-[14px] leading-[20px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>26 January 2025</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex gap-[16px]">
              <Link href={`/blog/${p4.slug}`} className="w-[calc(50%-8px)]">
                <div className="flex flex-col">
                  <div className="w-full h-[155px] rounded-[6px] overflow-hidden bg-white">
                    <CldImage src={p4.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[8px] mt-[12px]">
                    <p className="text-[16px] leading-[24px] text-[#18181b] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{p4.title}</p>
                    <p className="text-[14px] leading-[20px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>26 January 2025</p>
                  </div>
                </div>
              </Link>
              <Link href={`/blog/${p0.slug}`} className="w-[calc(50%-8px)]">
                <div className="flex flex-col">
                  <div className="w-full h-[155px] rounded-[6px] overflow-hidden bg-white">
                    <CldImage src={p0.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[8px] mt-[12px]">
                    <p className="text-[16px] leading-[24px] text-[#18181b] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{p0.title}</p>
                    <p className="text-[14px] leading-[20px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>26 January 2025</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop bento */}
          <div className="hidden md:flex max-w-[1280px] mx-auto px-[80px] mt-[64px] flex-col gap-[24px]">
            <div className="flex flex-row gap-[24px]">
              <BlogCard
                img={p0.img}
                title={p0.title}
                slug={p0.slug}
                tag={p0.tag}
                tagStyle={p0.tagStyle}
                className="flex-809 h-[446px]"
              />
              <BlogCard
                img={p1.img}
                title={p1.title}
                slug={p1.slug}
                tag={p1.tag}
                tagStyle={p1.tagStyle}
                delay={0.1}
                className="flex-447 h-[446px]"
              />
            </div>
            <div className="flex flex-row gap-[24px] h-[338px]">
              <div className="flex flex-row gap-[20px] flex-809">
                <BlogCard
                  img={p2.img}
                  title={p2.title}
                  slug={p2.slug}
                  tag={p2.tag}
                  delay={0.1}
                  className="flex-1 h-full"
                />
                <BlogCard
                  img={p3.img}
                  title={p3.title}
                  slug={p3.slug}
                  tag={p3.tag}
                  delay={0.2}
                  className="flex-1 h-full"
                />
              </div>
              <BlogCard
                img={p4.img}
                title={p4.title}
                slug={p4.slug}
                tag={p4.tag}
                delay={0.3}
                className="flex-447 h-full"
              />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
