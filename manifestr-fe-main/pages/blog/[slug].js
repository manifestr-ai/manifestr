import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const HERO_IMG = 'https://www.figma.com/api/mcp/asset/89126500-079e-440a-89f8-1614e34f97bb'
const CONTENT_IMG = 'https://www.figma.com/api/mcp/asset/c7f2988f-9b61-43ba-8a2f-1554cd581b39'
const AUTHOR_IMG = 'https://www.figma.com/api/mcp/asset/a85e3497-8a46-4b98-bfb9-ec823a216ba0'
const SMILING_IMG = 'https://www.figma.com/api/mcp/asset/b25b9917-5a06-4c46-b4c7-04b56794d87d'
const PSYCHOLOGIST_IMG = 'https://www.figma.com/api/mcp/asset/9afe0166-ff03-43a5-bf40-5a7c6d14e411'
const LANDSCAPE_IMG = 'https://www.figma.com/api/mcp/asset/4167483a-283b-4ef9-b81b-5564950dac33'

const TOC = [
  'Indexing',
  'Steering Clear of Common AI Writing Pitfalls',
  'Understanding ChatGPT Capabilities - Define Your Style',
  'Understand Your Readers',
  'Creating Quality AI-powered Blogs that Stand Out',
  'Conclusion: Embracing AI in Blog Creation',
  'Afterword: The AI Behind This Article',
]

const RECOMMENDED = [
  { img: SMILING_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'integrating-ai-business-workflows' },
  { img: PSYCHOLOGIST_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'branding-strategy-ai' },
  { img: PSYCHOLOGIST_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'desk-productivity-ai' },
  { img: LANDSCAPE_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'team-collaboration-ai' },
]

const BLOG_DATA = {
  title: 'Put Your New Headline create Here With',
  subtitle: 'Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.',
  author: 'Author Name',
  date: 'Aug 15, 2021',
  readTime: '16 min read',
  category: 'AI Strategy',
}

function ShareButton({ children }) {
  return (
    <button className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-[#f4f4f5] transition-colors">
      {children}
    </button>
  )
}

function RecommendedCard({ card, delay = 0 }) {
  return (
    <Link href={`/blog/${card.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        className="relative rounded-[12px] overflow-hidden h-[500px] w-full shrink-0 cursor-pointer group"
      >
        <img src={card.img} alt="" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-[18px] flex flex-col gap-[8px]">
          <span
            className="text-[12px] leading-[18px] font-medium text-[#71717a] px-[12px] py-[6px] rounded-[16px] border border-[#e4e4e7] self-start"
            style={{ fontFamily: "Inter, sans-serif", background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) 100%), linear-gradient(90deg, #f4f4f5 0%, #f4f4f5 100%)' }}
          >
            Tags
          </span>
          <div className="flex items-start justify-between gap-[16px]">
            <p className="text-[#18181b] text-[20px] leading-[30px] font-semibold flex-1" style={{ fontFamily: "Inter, sans-serif" }}>
              {card.title}
            </p>
            <svg className="w-[24px] h-[24px] text-[#18181b] shrink-0 mt-[4px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const [activeToc, setActiveToc] = useState(0)
  const scrollContainerRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollContainerRef.current) return
    scrollContainerRef.current.scrollBy({ left: dir * 424, behavior: 'smooth' })
  }

  return (
    <>
      <Head>
        <title>{BLOG_DATA.title} - MANIFESTR Blog</title>
        <meta name="description" content={BLOG_DATA.subtitle.slice(0, 160)} />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">

          {/* Hero / Header section */}
          <section className="w-full py-[64px] md:py-[96px]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[32px]">
              <div className="flex flex-col md:flex-row gap-[48px] md:gap-[64px] items-center">
                {/* Left content */}
                <div className="flex flex-col gap-[32px] flex-1">
                  {/* Breadcrumbs */}
                  <nav className="flex items-center gap-[4px]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <Link href="/" className="text-[14px] leading-[20px] font-semibold text-[#18181b] px-[8px] py-[4px] hover:underline">
                      Home
                    </Link>
                    <svg className="w-[16px] h-[16px] text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href="/blog" className="text-[14px] leading-[20px] font-semibold text-[#18181b] px-[8px] py-[4px] hover:underline">
                      Blog
                    </Link>
                    <svg className="w-[16px] h-[16px] text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-[14px] leading-[20px] font-semibold text-[#18181b] px-[8px] py-[4px]">
                      {BLOG_DATA.category}
                    </span>
                    <span className="text-[14px] leading-[20px] font-semibold text-[#18181b] px-[8px] py-[4px]">
                      Article details
                    </span>
                  </nav>

                  {/* Title */}
                  <div className="flex flex-col gap-[16px] max-w-[592px]">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-[36px] md:text-[48px] leading-[1.2] text-black"
                    >
                      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800 }}>Put Your New Headline </span>
                      <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>create</span>
                      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800 }}> Here With</span>
                    </motion.h1>

                    <p className="text-[18px] leading-[28px] text-[#71717a] pb-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      {BLOG_DATA.subtitle}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-[16px]">
                      <img src={AUTHOR_IMG} alt="" className="w-[56px] h-[56px] rounded-full object-cover" />
                      <div className="flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
                        <span className="text-[16px] leading-[24px] font-medium text-[#18181b]">{BLOG_DATA.author}</span>
                        <span className="text-[16px] leading-[24px] text-[#71717a]">{BLOG_DATA.date} · {BLOG_DATA.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-full md:w-[624px] h-[300px] md:h-[416px] rounded-[12px] overflow-hidden shrink-0"
                >
                  <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Content section with sidebar */}
          <section className="w-full pb-[96px]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[32px]">
              <div className="flex flex-col md:flex-row gap-[48px] md:gap-[64px] items-start">

                {/* Sticky sidebar */}
                <aside className="w-full md:w-[280px] shrink-0 md:sticky md:top-[96px]">
                  <div className="flex flex-col gap-[32px]">
                    {/* Table of contents */}
                    <div className="flex flex-col gap-[19px]">
                      <h3 className="text-[20px] leading-[30px] font-semibold text-[#020617]" style={{ fontFamily: "Inter, sans-serif" }}>
                        In this article
                      </h3>
                      <nav className="flex flex-col gap-[4px]">
                        {TOC.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveToc(i)}
                            className={`text-left pl-[20px] py-[10px] text-[16px] leading-[24px] transition-colors ${
                              activeToc === i
                                ? 'border-l-[3px] border-[#020617] text-[#020617] font-medium'
                                : 'text-[#71717a] hover:text-[#18181b]'
                            }`}
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {item}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#e4e4e7]" />

                    {/* Newsletter */}
                    <div className="flex flex-col gap-[16px]">
                      <h3 className="text-[20px] leading-[30px] font-semibold text-[#020617]" style={{ fontFamily: "Inter, sans-serif" }}>
                        Subscribe to our newsletter
                      </h3>
                      <input
                        type="email"
                        placeholder="Search"
                        className="h-[44px] px-[14px] rounded-[12px] border border-[#d5d7da] bg-white text-[14px] leading-[20px] text-[#18181b] placeholder-[#71717a] outline-none focus:border-[#18181b] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors w-full"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                      <button
                        className="h-[44px] w-full rounded-[12px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Subscribe
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#e4e4e7]" />

                    {/* Share */}
                    <div className="flex flex-col gap-[32px]">
                      <h3 className="text-[18px] leading-[28px] font-medium text-[#18181b]" style={{ fontFamily: "Inter, sans-serif" }}>
                        Share this blog
                      </h3>
                      <div className="flex items-center gap-[8px]">
                        <ShareButton>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        </ShareButton>
                        <ShareButton>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#18181b">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </ShareButton>
                        <ShareButton>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#18181b">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </ShareButton>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Article content */}
                <article className="flex-1 min-w-0 flex flex-col gap-[36px]">
                  {/* Section 1 */}
                  <div className="flex flex-col gap-[24px]">
                    <h2
                      className="text-[30px] leading-[38px] text-[#1b1b1f]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                    >
                      Exploring Generative AI in Content Creation
                    </h2>
                    <div className="text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>
                        Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to
                        engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let
                        me share from my firsthand experience.
                      </p>
                      <p>
                        Google encourages high-quality blogs regardless of whether they&apos;re written by humans or created using
                        artificial intelligence like ChatGPT. Here&apos;s what matters: producing original material with expertise
                        and trustworthiness based on Google E-E-A-T principles.
                      </p>
                      <p>
                        This means focusing more on people-first writing rather than primarily employing AI Toolkit to manipulate
                        search rankings. There comes a time when many experienced professionals want to communicate their insights
                        but get stuck due to limited writing skills – that&apos;s where Generative AI can step in.
                      </p>
                      <p>
                        So, together, we&apos;re going explore how this technology could help us deliver valuable content without
                        sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common
                        pitfalls!). Hang tight - it&apos;ll be a fun learning journey!
                      </p>
                    </div>
                  </div>

                  {/* Section 2 — What is LMS? */}
                  <div className="flex flex-col gap-[24px]">
                    <h2
                      className="text-[30px] leading-[38px] text-[#1b1b1f]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                    >
                      What is LMS?
                    </h2>
                    <div className="text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>
                        Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget
                        vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate
                        arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
                      </p>
                      <p>
                        Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed
                        auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at
                        donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
                      </p>
                    </div>
                  </div>

                  {/* Content image */}
                  <div className="w-full h-[360px] md:h-[480px] rounded-[12px] overflow-hidden">
                    <img src={CONTENT_IMG} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Section 3 */}
                  <div className="flex flex-col gap-[24px]">
                    <h2
                      className="text-[30px] leading-[38px] text-[#1b1b1f]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                    >
                      Exploring Generative AI in Content Creation
                    </h2>
                    <div className="text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>
                        Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to
                        engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let
                        me share from my firsthand experience.
                      </p>
                      <p>
                        Google encourages high-quality blogs regardless of whether they&apos;re written by humans or created using
                        artificial intelligence like ChatGPT. Here&apos;s what matters: producing original material with expertise
                        and trustworthiness based on Google E-E-A-T principles.
                      </p>
                      <p>
                        This means focusing more on people-first writing rather than primarily employing AI Toolkit to manipulate
                        search rankings. There comes a time when many experienced professionals want to communicate their insights
                        but get stuck due to limited writing skills – that&apos;s where Generative AI can step in.
                      </p>
                      <p>
                        So, together, we&apos;re going explore how this technology could help us deliver valuable content without
                        sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common
                        pitfalls!). Hang tight - it&apos;ll be a fun learning journey!
                      </p>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="flex flex-col gap-[24px]">
                    <h2
                      className="text-[30px] leading-[38px] text-[#1b1b1f]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                    >
                      Exploring Generative AI in Content Creation
                    </h2>
                    <div className="text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>
                        Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to
                        engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let
                        me share from my firsthand experience.
                      </p>
                      <p>
                        Google encourages high-quality blogs regardless of whether they&apos;re written by humans or created using
                        artificial intelligence like ChatGPT. Here&apos;s what matters: producing original material with expertise
                        and trustworthiness based on Google E-E-A-T principles.
                      </p>
                      <p>
                        This means focusing more on people-first writing rather than primarily employing AI Toolkit to manipulate
                        search rankings. There comes a time when many experienced professionals want to communicate their insights
                        but get stuck due to limited writing skills – that&apos;s where Generative AI can step in.
                      </p>
                      <p>
                        So, together, we&apos;re going explore how this technology could help us deliver valuable content without
                        sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common
                        pitfalls!). Hang tight - it&apos;ll be a fun learning journey!
                      </p>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div className="flex flex-col gap-[20px]">
                    <h2
                      className="text-[30px] leading-[38px] text-[#1b1b1f]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                    >
                      Exploring Generative AI in Content Creation
                    </h2>
                    <div className="text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>
                        Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to
                        engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let
                        me share from my firsthand experience.
                      </p>
                      <p>
                        Google encourages high-quality blogs regardless of whether they&apos;re written by humans or created using
                        artificial intelligence like ChatGPT. Here&apos;s what matters: producing original material with expertise
                        and trustworthiness based on Google E-E-A-T principles.
                      </p>
                      <p>
                        This means focusing more on people-first writing rather than primarily employing AI Toolkit to manipulate
                        search rankings. There comes a time when many experienced professionals want to communicate their insights
                        but get stuck due to limited writing skills – that&apos;s where Generative AI can step in.
                      </p>
                      <p>
                        So, together, we&apos;re going explore how this technology could help us deliver valuable content without
                        sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common
                        pitfalls!). Hang tight - it&apos;ll be a fun learning journey!
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Recommended for You */}
          <section className="w-full bg-[#f9fafb] py-[80px] md:py-[96px]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-[36px]">
                <h2
                  className="text-[36px] md:text-[48px] leading-[60px] tracking-[-0.96px] text-black"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                >
                  Recommended for You
                </h2>
                <Link
                  href="/blog"
                  className="hidden md:flex items-center gap-[8px] h-[44px] px-[16px] rounded-[12px] border border-[#e4e4e7] bg-white text-[14px] leading-[20px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  All Trending Articles
                  <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>

              {/* Cards */}
              <div
                ref={scrollContainerRef}
                className="flex gap-[24px] overflow-x-auto scrollbar-hide pb-[4px]"
              >
                {RECOMMENDED.map((card, i) => (
                  <div key={card.slug} className="w-[300px] md:w-[400px] shrink-0">
                    <RecommendedCard card={card} delay={i * 0.1} />
                  </div>
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

        </main>
        <Footer />
      </div>
    </>
  )
}
