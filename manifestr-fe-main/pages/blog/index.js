import { useState } from 'react'
import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import BlogHero from '../../components/blog/BlogHero'
import TrendingArticles from '../../components/blog/TrendingArticles'
import WhatsNewToday from '../../components/blog/WhatsNewToday'
import ExploreCategories from '../../components/blog/ExploreCategories'

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState(null)

  const handleCategoryChange = (cat) => {
    setActiveCategory((prev) => (prev === cat ? null : cat))
  }

  const handleClearCategory = () => setActiveCategory(null)

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
          <BlogHero
            activeCategory={activeCategory}
            onClearCategory={handleClearCategory}
          />
          <TrendingArticles />
          <WhatsNewToday />
          <ExploreCategories
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </main>
        <Footer />
      </div>
    </>
  )
}
