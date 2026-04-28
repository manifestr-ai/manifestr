import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CldImage from '../../components/ui/CldImage'
import { getBlogPost, getRelatedPosts, BLOG_POSTS_BY_SLUG } from '../../data/blogPostDetails'

const DEFAULT_SLUG = Object.keys(BLOG_POSTS_BY_SLUG)[0]

const AUTHOR_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038465/Ellipse_hhxkbs.png'

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 shrink-0">
      <g clipPath="url(#clip0_blog_li)">
        <path
          d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_blog_li">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function ShareButton({ children, href, label, ...rest }) {
  const className =
    'w-10 h-10 rounded-full flex items-center justify-center text-[#71717A] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors duration-200 [&_svg]:size-6 [&_svg]:shrink-0'
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label || 'Share'}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={className} aria-label={label || 'Share'} {...rest}>
      {children}
    </button>
  )
}

/** Matches `TrendingArticles` card layout; wrapped in a link to the post slug. */
function RecommendedCard({ card, delay = 0 }) {
  return (
    <Link
      href={`/blog/${card.slug}`}
      className="relative shrink-0 w-[240px] md:w-[400px] block overflow-hidden rounded-[6px] md:rounded-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        className="relative h-[300px] md:h-[500px] w-full cursor-pointer group"
      >
        <CldImage src={card.img} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/66" />
        <div className="absolute bottom-0 left-0 right-0 p-[16px] md:p-[32px] flex flex-col gap-[8px]">
          <span
            className="bg-white text-[#212122] text-[10px] md:text-[12px] leading-[18px] font-medium px-[12px] py-[6px] h-[18px] md:h-auto flex items-center rounded-[16px] self-start"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            New
          </span>
          <div className="flex items-center justify-between">
            <p
              className="text-white text-[12px] md:text-[16px] leading-[24px] font-medium flex-1 w-[197px] md:w-auto"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {card.title}
            </p>
            <svg
              className="w-[24px] h-[24px] text-white shrink-0 ml-[8px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query

  const post = (slug ? getBlogPost(slug) : null) || getBlogPost(DEFAULT_SLUG)
  const related = getRelatedPosts(slug || DEFAULT_SLUG)

  const [activeToc, setActiveToc] = useState(0)
  const [pageUrl, setPageUrl] = useState('')
  const scrollContainerRef = useRef(null)

  const scrollRelated = (dir) => {
    if (!scrollContainerRef.current) return
    scrollContainerRef.current.scrollBy({ left: dir * 424, behavior: 'smooth' })
  }

  useEffect(() => {
    setPageUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [])

  const scrollToSection = useCallback((id, index) => {
    const el = document.getElementById(id)
    if (!el) return
    setActiveToc(index)
    const y = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!post?.sections?.length) return
    const sections = post.sections
    const elements = sections.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (elements.length === 0) return

    let frame
    const obs = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length === 0) return
        intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const id = intersecting[0].target.id
        const idx = sections.findIndex((s) => s.id === id)
        if (idx < 0) return
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => setActiveToc(idx))
      },
      { root: null, rootMargin: '-100px 0px -52% 0px', threshold: [0, 0.05, 0.15, 0.35] },
    )
    elements.forEach((el) => obs.observe(el))
    return () => {
      cancelAnimationFrame(frame)
      obs.disconnect()
    }
  }, [post])

  const linkedinShare =
    pageUrl && `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`

  return (
    <>
      <Head>
        <title>{post.title} — MANIFESTR Blog</title>
        <meta name="description" content={post.subtitle.slice(0, 160)} />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">

          <section className="w-full py-[48px] md:py-[96px]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[32px]">
              <div className="flex flex-col gap-[16px] md:gap-[64px] md:flex-row items-center">
                <div className="flex flex-col gap-[24px] md:gap-[32px] flex-1 items-center md:items-start">
                  <nav className="flex flex-wrap items-center gap-[4px]" style={{ fontFamily: "Inter, sans-serif" }} aria-label="Breadcrumb">
                    <Link href="/blog" className="text-[16px] md:text-[14px] leading-[24px] md:leading-[20px] md:font-semibold text-[#18181b] md:px-[8px] md:py-[4px] hover:underline">
                      Blog
                    </Link>
                    <svg className="w-[24px] md:w-[16px] h-[24px] md:h-[16px] text-[#71717a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-[16px] md:text-[14px] leading-[24px] md:leading-[20px] md:font-semibold text-[#18181b] md:px-[8px] md:py-[4px]">
                      {post.category}
                    </span>
                    <svg className="w-[24px] md:w-[16px] h-[24px] md:h-[16px] text-[#71717a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-[16px] md:text-[14px] leading-[24px] md:leading-[20px] md:font-semibold text-[#18181b] md:px-[8px] md:py-[4px] max-w-[200px] md:max-w-none truncate md:whitespace-normal">
                      Article
                    </span>
                  </nav>

                  <div className="flex flex-col gap-[25px] md:gap-[16px] max-w-[592px] w-full items-center md:items-start">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-[36px] md:text-[48px] leading-[normal] md:leading-[1.2] tracking-[-0.72px] md:tracking-normal text-black text-center md:text-left"
                    >
                      {post.titleDisplay.map((part, ti) =>
                        part.italic ? (
                          <span
                            key={`t-${ti}`}
                            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                          >
                            {part.text}
                          </span>
                        ) : (
                          <span key={`t-${ti}`} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                            {part.text}
                          </span>
                        ),
                      )}
                    </motion.h1>

                    <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-[#71717a] md:pb-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      {post.subtitle}
                    </p>

                    <div className="flex items-center gap-[16px]">
                      <CldImage src={AUTHOR_IMG} alt="" className="w-[56px] h-[56px] rounded-full object-cover" />
                      <div className="flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
                        <span className="text-[16px] leading-[24px] font-medium text-[#18181b]">{post.author}</span>
                        <span className="text-[16px] leading-[24px] text-[#71717a]">
                          {post.date} · {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-full md:w-[624px] h-[319px] md:h-[416px] rounded-[6px] md:rounded-[12px] overflow-hidden shrink-0"
                >
                  <CldImage src={post.heroImg} alt="" className="w-full h-full object-cover" priority />
                </motion.div>
              </div>
            </div>
          </section>

          <section className="w-full py-[48px] md:py-0 md:pb-[96px]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[32px]">
              <div className="flex flex-col md:flex-row gap-[32px] md:gap-[64px] items-start">
                <aside className="hidden md:flex w-[280px] shrink-0 md:sticky md:top-[96px]">
                  <div className="flex flex-col gap-[32px] w-full">
                    <div className="flex flex-col gap-[19px]">
                      <h3 className="text-[20px] leading-[30px] font-semibold text-[#020617]" style={{ fontFamily: "Inter, sans-serif" }}>
                        In this article
                      </h3>
                      <nav className="flex flex-col gap-[2px]" aria-label="Table of contents">
                        {post.sections.map((item, i) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => scrollToSection(item.id, i)}
                            className={`text-left pl-[20px] py-[10px] rounded-l-[4px] text-[16px] leading-[24px] border-l-[3px] transition-all duration-300 ease-out motion-reduce:transition-none ${
                              activeToc === i
                                ? 'border-[#020617] text-[#020617] font-medium bg-[#f4f4f5]/90'
                                : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:bg-[#fafafa]'
                            }`}
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {item.heading}
                          </button>
                        ))}
                      </nav>
                    </div>

                    <div className="h-px bg-[#e4e4e7]" />

                    <div className="flex flex-col gap-[16px]">
                      <h3 className="text-[20px] leading-[30px] font-semibold text-[#020617]" style={{ fontFamily: "Inter, sans-serif" }}>
                        Subscribe to our newsletter
                      </h3>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                        className="h-[44px] px-[14px] rounded-[12px] border border-[#d5d7da] bg-white text-[14px] leading-[20px] text-[#18181b] placeholder-[#71717a] outline-none focus:border-[#18181b] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors w-full"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                      <button
                        type="button"
                        className="h-[44px] w-full rounded-[12px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Subscribe
                      </button>
                    </div>

                    <div className="h-px bg-[#e4e4e7]" />

                    <div className="flex flex-col gap-[32px]">
                      <h3 className="text-[18px] leading-[28px] font-medium text-[#18181b]" style={{ fontFamily: "Inter, sans-serif" }}>
                        Share this blog
                      </h3>
                      <div className="flex items-center gap-[8px] flex-wrap">
                        <ShareButton
                          label="Copy link"
                          onClick={() => pageUrl && navigator.clipboard?.writeText(pageUrl)}
                        >
                          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        </ShareButton>
                        <ShareButton
                          href={pageUrl ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}` : undefined}
                          label="Share on X"
                        >
                          <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </ShareButton>
                        <ShareButton
                          href={pageUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` : undefined}
                          label="Share on Facebook"
                        >
                          <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </ShareButton>
                        <ShareButton href={linkedinShare || undefined} label="Share on LinkedIn">
                          <LinkedInIcon />
                        </ShareButton>
                      </div>
                    </div>
                  </div>
                </aside>

                <article className="flex-1 min-w-0 flex flex-col gap-[32px] md:gap-[36px]">
                  {post.sections.map((section, idx) => (
                    <div key={section.id}>
                      {idx === 2 && (
                        <div className="w-full h-[341px] md:h-[480px] rounded-[12px] overflow-hidden mb-[32px] md:mb-[36px]">
                          <CldImage src={post.contentImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div id={section.id} className="scroll-mt-[100px] flex flex-col gap-[16px] md:gap-[24px]">
                        <h2
                          className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] text-[#1b1b1f]"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                        >
                          {section.heading}
                        </h2>
                        <div className="text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                          {section.paragraphs.map((p, pi) => (
                            <p key={`${section.id}-p${pi}`}>{p}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </article>
              </div>
            </div>
          </section>

          <section className="w-full bg-[#f9fafb] py-[48px] md:py-[96px] overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
              <div className="mb-[32px] md:mb-[36px]">
                <h2
                  className="text-[30px] md:text-[48px] leading-[38px] md:leading-[60px] tracking-[-0.96px] text-black"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                >
                  Recommended for You
                </h2>
              </div>

              <div
                ref={scrollContainerRef}
                className="no-scrollbar flex gap-[16px] md:gap-[24px] overflow-x-auto pb-[4px] -mx-6 px-6 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {related.map((card, i) => (
                  <RecommendedCard key={card.slug} card={card} delay={i * 0.1} />
                ))}
              </div>

              <div className="flex items-center justify-center md:justify-end gap-[10px] mt-[24px]">
                <button
                  type="button"
                  onClick={() => scrollRelated(-1)}
                  className="w-[44px] h-[44px] rounded-[6px] bg-[#b4b4b4] border border-[#e4e4e7] flex items-center justify-center text-white hover:bg-[#9a9a9a] transition-colors"
                  aria-label="Scroll recommended left"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12L6 8l4-4" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollRelated(1)}
                  className="w-[44px] h-[44px] rounded-[6px] bg-[#18181b] border border-[#e4e4e7] flex items-center justify-center text-white hover:bg-[#27272a] transition-colors"
                  aria-label="Scroll recommended right"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

