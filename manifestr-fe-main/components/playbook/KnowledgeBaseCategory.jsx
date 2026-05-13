import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'
import FirstProjectGuideBody, { GenericKbArticleBody } from './kbArticleBodies/FirstProjectGuideBody'
import { getCategory, getArticle } from '../../data/knowledgeBaseCategoryContent'

const CTA_BG =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774957277/Rectangle_34624791_eotkfo.jpg'

function articleSectionId(slug) {
  return `kb-article-${slug}`
}

export default function KnowledgeBaseCategory({ categorySlug }) {
  const router = useRouter()
  const articleParam = router.query.article
  const articleSlugFromQuery = Array.isArray(articleParam) ? articleParam[0] : articleParam

  const category = useMemo(() => getCategory(categorySlug), [categorySlug])
  const [activeNavSlug, setActiveNavSlug] = useState(null)

  useEffect(() => {
    if (!router.isReady || !category?.articles?.length) return

    const fromQuery =
      articleSlugFromQuery && getArticle(categorySlug, articleSlugFromQuery)
        ? articleSlugFromQuery
        : null
    let fromHash = null
    if (typeof window !== 'undefined' && window.location.hash?.startsWith('#kb-article-')) {
      const s = window.location.hash.slice('#kb-article-'.length)
      if (getArticle(categorySlug, s)) fromHash = s
    }
    const target = fromQuery || fromHash

    if (target) {
      requestAnimationFrame(() => {
        document.getElementById(articleSectionId(target))?.scrollIntoView({ behavior: 'auto', block: 'start' })
        setActiveNavSlug(target)
      })
    } else {
      setActiveNavSlug(category.articles[0].slug)
    }
  }, [router.isReady, categorySlug, articleSlugFromQuery, category])

  useEffect(() => {
    if (!category?.articles?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (id.startsWith('kb-article-')) {
            setActiveNavSlug(id.slice('kb-article-'.length))
            break
          }
        }
      },
      { rootMargin: '-110px 0px -55% 0px', threshold: 0 }
    )

    category.articles.forEach((a) => {
      const el = document.getElementById(articleSectionId(a.slug))
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [category])

  function scrollToArticle(slug) {
    const el = document.getElementById(articleSectionId(slug))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${articleSectionId(slug)}`)
      }
      setActiveNavSlug(slug)
    }
  }

  if (!router.isReady) {
    return <div className="min-h-[40vh] w-full bg-white" aria-hidden />
  }

  if (!category) {
    return (
      <div className="w-full bg-white px-6 py-[80px] text-center">
        <p className="text-[16px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Category not found.
        </p>
        <Link href="/playbook/knowledge-base" className="mt-4 inline-block text-[#2563eb] hover:underline">
          Back to Knowledge Base
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="w-full bg-white border-t border-b border-[#e5e7eb] px-6 md:px-[80px]">
        <div
          className="flex min-h-[54px] flex-wrap items-center gap-[8px] py-3 text-[16px] leading-[24px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Link href="/playbook" className="text-[#52525b] hover:underline">
            Playbook
          </Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/playbook/knowledge-base" className="text-[#52525b] hover:underline">
            Knowledge Base
          </Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="max-w-full font-medium text-[#18181b]">{category.title}</span>
        </div>
      </div>

      <section className="w-full bg-white px-6 md:px-[112px] py-[80px]">
        <div className="mb-8 flex flex-col gap-2 md:hidden">
          <label
            className="text-[14px] font-medium text-[#52525b]"
            htmlFor="kb-article-select"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Jump to article
          </label>
          <select
            id="kb-article-select"
            value={activeNavSlug ?? category.articles[0]?.slug ?? ''}
            onChange={(e) => scrollToArticle(e.target.value)}
            className="w-full rounded-[6px] border border-[#e4e4e7] bg-white px-3 py-2.5 text-[16px] text-[#18181b] outline-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {category.articles.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-[64px] max-w-[1217px] mx-auto">
          <aside className="no-scrollbar hidden md:flex flex-col w-[321px] shrink-0 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto">
            <p
              className="mb-[16px] text-[16px] font-semibold leading-[24px] text-[#1b1b1f]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {category.title}
            </p>
            <nav className="flex flex-col" aria-label="Articles in this category">
              {category.articles.map((item) => {
                const active = item.slug === activeNavSlug
                return (
                  <a
                    key={item.slug}
                    href={`#${articleSectionId(item.slug)}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToArticle(item.slug)
                    }}
                    className={`flex min-h-[48px] items-center border-l-2 px-[16px] py-[12px] text-left text-[16px] leading-[24px] transition-colors cursor-pointer ${
                      active
                        ? 'border-[#020617] font-semibold text-[#1b1b1f]'
                        : 'border-[#e4e4e7] font-medium text-[#71717a] hover:text-[#1b1b1f]'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.title}
                  </a>
                )
              })}
            </nav>
          </aside>

          <div className="flex-1 min-w-0 flex flex-col gap-[56px] md:gap-[72px]">
            {category.articles.map((article, index) => {
              const isRichFirstProject =
                categorySlug === 'getting-started' && article.slug === 'first-project' && article.rich

              return (
                <motion.article
                  key={article.slug}
                  id={articleSectionId(article.slug)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4 }}
                  className={`scroll-mt-[100px] min-w-0 ${index > 0 ? 'pt-[48px] md:pt-[56px] border-t border-[#e4e4e7]' : ''}`}
                >
                  <div className="flex flex-col gap-[28px] md:gap-[32px]">
                    <h2
                      className="text-[24px] leading-[32px] tracking-[-0.72px] text-[#1b1b1f] md:text-[36px] md:leading-[44px]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                    >
                      {article.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-[10px] gap-y-2 border-t border-b border-dashed border-[#e2e8f0] py-[16px]">
                      <div className="flex items-center gap-[6px]">
                        <svg className="h-4 w-4 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Updated: {article.updated}
                        </span>
                      </div>
                      <span className="h-1 w-1 shrink-0 rounded-full bg-[#71717a]" aria-hidden />
                      <div className="flex items-center gap-[6px]">
                        <svg className="h-4 w-4 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {article.readMinutes} min read
                        </span>
                      </div>
                    </div>

                    {isRichFirstProject ? (
                      <FirstProjectGuideBody />
                    ) : (
                      <GenericKbArticleBody categoryTitle={category.title} articleTitle={article.title} />
                    )}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="w-full relative h-[380px] md:h-[414px] overflow-hidden">
        <CldImage src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-[30px] px-6 text-center"
          >
            <div className="flex flex-col items-center gap-[16px]">
              <h2 className="text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-1.2px] text-black">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p
                className="max-w-[603px] text-[16px] leading-[24px] text-[#71717a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Our support team is here to assist you with any questions.
              </p>
            </div>
            <Link
              href="/playbook/submit-ticket"
              className="h-[44px] px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Submit a Support Ticket
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
