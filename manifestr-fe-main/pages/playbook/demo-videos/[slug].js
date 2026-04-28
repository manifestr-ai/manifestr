import Head from 'next/head'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import VideoDetail from '../../../components/playbook/VideoDetail'
import { DEMO_VIDEOS, getVideoBySlug } from '../../../data/demoVideos'

export default function VideoDetailPage({ video }) {
  if (!video) return null

  return (
    <>
      <Head>
        <title>{video.title} - MANIFESTR Playbook</title>
        <meta name="description" content={video.desc} />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <VideoDetail video={video} />
        </main>
        <Footer />
      </div>
    </>
  )
}

export function getStaticPaths() {
  return {
    paths: DEMO_VIDEOS.map((v) => ({ params: { slug: v.slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const video = getVideoBySlug(params.slug)
  if (!video) return { notFound: true }
  return { props: { video } }
}
