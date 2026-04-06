import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CldImage from '../../components/ui/CldImage'

const HERO_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038474/Mads_smiling_2_oufgbz.png'
const CONTENT_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038474/Mads_smiling_2_oufgbz.png'
const AUTHOR_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038465/Ellipse_hhxkbs.png'
const SMILING_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038473/Mads_smiling_1_nlhaot.png'
const PSYCHOLOGIST_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038690/close-up-female-psychologist-writing-down-notes-therapy-with-her-male-patient_1_mg0o0u.png'
const LANDSCAPE_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775038867/image-13-1536x609_1_1_thstte.png'

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
        className="relative rounded-[6px] md:rounded-[12px] overflow-hidden h-[300px] md:h-[500px] w-full shrink-0 cursor-pointer group"
      >
        <CldImage src={card.img} alt="" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-[11px] md:p-[18px] flex flex-col gap-[5px] md:gap-[8px]">
          <span
            className="text-[7px] md:text-[12px] leading-[11px] md:leading-[18px] font-medium text-[#71717a] px-[7px] md:px-[12px] py-[4px] md:py-[6px] rounded-[16px] border border-[#e4e4e7] self-start"
            style={{ fontFamily: "Inter, sans-serif", background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) 100%), linear-gradient(90deg, #f4f4f5 0%, #f4f4f5 100%)' }}
          >
            Tags
          </span>
          <div className="flex items-start justify-between gap-[10px] md:gap-[16px]">
            <p className="text-[#18181b] text-[12px] md:text-[20px] leading-[18px] md:leading-[30px] font-semibold flex-1" style={{ fontFamily: "Inter, sans-serif" }}>
              {card.title}
            </p>
            <svg className="w-[14px] md:w-[24px] h-[14px] md:h-[24px] text-[#18181b] shrink-0 mt-[2px] md:mt-[4px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <section className="w-full py-[48px] md:py-[96px]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[32px]">
              <div className="flex flex-col gap-[16px] md:gap-[64px] md:flex-row items-center">
                {/* Left content */}
                <div className="flex flex-col gap-[24px] md:gap-[32px] flex-1 items-center md:items-start">
                  {/* Breadcrumbs */}
                  <nav className="flex items-center gap-[4px]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <Link href="/blog" className="text-[16px] md:text-[14px] leading-[24px] md:leading-[20px] md:font-semibold text-[#18181b] md:px-[8px] md:py-[4px] hover:underline">
                      Blog
                    </Link>
                    <svg className="w-[24px] md:w-[16px] h-[24px] md:h-[16px] text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-[16px] md:text-[14px] leading-[24px] md:leading-[20px] md:font-semibold text-[#18181b] md:px-[8px] md:py-[4px]">
                      Category
                    </span>
                    <svg className="w-[24px] md:w-[16px] h-[24px] md:h-[16px] text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-[16px] md:text-[14px] leading-[24px] md:leading-[20px] md:font-semibold text-[#18181b] md:px-[8px] md:py-[4px]">
                      Article
                    </span>
                  </nav>

                  {/* Title */}
                  <div className="flex flex-col gap-[25px] md:gap-[16px] max-w-[592px] w-full items-center md:items-start">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-[36px] md:text-[48px] leading-[normal] md:leading-[1.2] tracking-[-0.72px] md:tracking-normal text-black text-center md:text-left"
                    >
                      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Put Your New Headline </span>
                      <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>create </span>
                      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Here With </span>
                    </motion.h1>

                    <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-[#71717a] md:pb-[16px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      {BLOG_DATA.subtitle}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-[16px]">
                      <CldImage src={AUTHOR_IMG} alt="" className="w-[56px] h-[56px] rounded-full object-cover" />
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
                  className="w-full md:w-[624px] h-[319px] md:h-[416px] rounded-[6px] md:rounded-[12px] overflow-hidden shrink-0"
                >
                  <CldImage src={HERO_IMG} alt="" className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Content section with sidebar */}
          <section className="w-full py-[48px] md:py-0 md:pb-[96px]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[32px]">
              <div className="flex flex-col md:flex-row gap-[32px] md:gap-[64px] items-start">

                {/* Sticky sidebar — hidden on mobile */}
                <aside className="hidden md:flex w-[280px] shrink-0 md:sticky md:top-[96px]">
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
                <article className="flex-1 min-w-0 flex flex-col gap-[32px] md:gap-[36px]">
                  {/* Section 1 */}
                  <div className="flex flex-col gap-[16px] md:gap-[24px]">
                    <h2
                      className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] text-[#1b1b1f]"
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
                  <div className="flex flex-col gap-[12px] md:gap-[24px]">
                    <h2
                      className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] text-[#1b1b1f]"
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
                  <div className="w-full h-[341px] md:h-[480px] rounded-[12px] overflow-hidden">
                    <CldImage src={CONTENT_IMG} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Section 3 */}
                  <div className="flex flex-col gap-[16px] md:gap-[24px]">
                    <h2
                      className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] text-[#1b1b1f]"
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
                  <div className="flex flex-col gap-[16px] md:gap-[24px]">
                    <h2
                      className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] text-[#1b1b1f]"
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
                  <div className="flex flex-col gap-[16px] md:gap-[20px]">
                    <h2
                      className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] text-[#1b1b1f]"
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
          <section className="w-full bg-[#f9fafb] py-[48px] md:py-[96px] overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-[12px] mb-[32px] md:mb-[36px]">
                <h2
                  className="text-[36px] md:text-[48px] leading-[44px] md:leading-[60px] tracking-[-0.72px] md:tracking-[-0.96px] text-black"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                >
                  Recommended for You
                </h2>
                <Link
                  href="/blog"
                  className="flex items-center gap-[8px] h-[44px] px-[16px] rounded-[12px] border border-[#e4e4e7] bg-white text-[14px] leading-[20px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
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
                className="flex gap-[16px] md:gap-[24px] overflow-x-auto scrollbar-hide pb-[4px] -mx-6 px-6 md:mx-0 md:px-0"
              >
                {RECOMMENDED.map((card, i) => (
                  <div key={card.slug} className="w-[240px] md:w-[400px] shrink-0">
                    <RecommendedCard card={card} delay={i * 0.1} />
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center justify-center md:justify-end gap-[10px] mt-[24px]">
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
