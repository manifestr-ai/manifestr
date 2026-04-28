import Head from 'next/head'
import Header from '../../../../components/layout/Header'
import Footer from '../../../../components/layout/Footer'
import VideoCategoryPage from '../../../../components/playbook/VideoCategoryPage'
import { VIDEO_CATEGORIES, getCategoryBySlug, getCategoryVideos } from '../../../../data/demoVideos'

export default function VideoCategoryRoute({ category, videos }) {
  return (
    <>
      <Head>
        <title>{category.title} – Demo Videos – MANIFESTR Playbook</title>
        <meta name="description" content={category.desc} />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <VideoCategoryPage category={category} videos={videos} />
        </main>
        <Footer />
      </div>
    </>
  )
}

export function getStaticPaths() {
  return {
    paths: Object.keys(VIDEO_CATEGORIES).map((slug) => ({ params: { category: slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const category = getCategoryBySlug(params.category)
  if (!category) return { notFound: true }

  // Serialize — strip the filter function before passing as props
  const { filter: _filter, ...categoryProps } = category
  const videos = getCategoryVideos(params.category)

  return {
    props: {
      category: categoryProps,
      videos,
    },
  }
}
