import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import KnowledgeBaseCategory from '../../../components/playbook/KnowledgeBaseCategory'
import { getCategory, resolveArticle } from '../../../data/knowledgeBaseCategoryContent'

export default function KnowledgeBaseCategoryPage() {
  const router = useRouter()
  const raw = router.query.slug
  const categorySlug = Array.isArray(raw) ? raw[0] : raw
  const articleParam = router.query.article
  const articleSlug = Array.isArray(articleParam) ? articleParam[0] : articleParam

  const category = categorySlug ? getCategory(categorySlug) : null
  const article = categorySlug ? resolveArticle(categorySlug, articleSlug) : null

  const title = category && article
    ? `${article.title} — ${category.title} | MANIFESTR Playbook`
    : 'Knowledge Base | MANIFESTR Playbook'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={
            category
              ? `${category.description} Browse ${category.title} articles in the MANIFESTR Playbook.`
              : 'MANIFESTR Playbook knowledge base articles.'
          }
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          {categorySlug && <KnowledgeBaseCategory categorySlug={categorySlug} />}
        </main>
        <Footer />
      </div>
    </>
  )
}
