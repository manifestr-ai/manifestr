import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import BlogHero from '../../components/blog/BlogHero'
import TrendingArticles from '../../components/blog/TrendingArticles'
import WhatsNewToday from '../../components/blog/WhatsNewToday'
import ExploreCategories from '../../components/blog/ExploreCategories'

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog - MANIFESTR</title>
        <meta
          name="description"
          content="The latest writings from the MANIFESTR team. Explore articles on AI strategy, business workflows, and personal growth."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <BlogHero />
          <TrendingArticles />
          <WhatsNewToday />
          <ExploreCategories />
        </main>
        <Footer />
      </div>
    </>
  )
}
