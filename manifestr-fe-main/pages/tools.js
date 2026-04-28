import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ToolsHero from '../components/tools/ToolsHero'
import ToolsGrid from '../components/tools/ToolsGrid'
import ToolsStats from '../components/tools/ToolsStats'
import ToolsFAQ from '../components/tools/ToolsFAQ'
import ToolsCTA from '../components/tools/ToolsCTA'

export default function Tools() {
  return (
    <>
      <Head>
        <title>The Toolkit - MANIFESTR</title>
        <meta
          name="description"
          content="Explore the MANIFESTR Toolkit — AI-powered tools for strategy, design, presentations, and more. Build, brand, and scale faster."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="min-w-0 flex-1 bg-white pt-[76px]">
          <ToolsHero />
          <ToolsGrid />
          <ToolsStats />
          <ToolsFAQ />
          <ToolsCTA />
        </main>
        <Footer />
      </div>
    </>
  )
}
