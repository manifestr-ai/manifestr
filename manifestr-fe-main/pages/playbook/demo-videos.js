import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import DemoVideos from '../../components/playbook/DemoVideos'

export default function DemoVideosPage() {
  return (
    <>
      <Head>
        <title>Demo Videos - MANIFESTR Playbook</title>
        <meta
          name="description"
          content="Explore quick, step-by-step video walkthroughs designed to help you build smarter, faster, and with confidence using MANIFESTR."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <DemoVideos />
        </main>
        <Footer />
      </div>
    </>
  )
}
