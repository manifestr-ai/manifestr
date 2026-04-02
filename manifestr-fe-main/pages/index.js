import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/landing/HeroSection'
import OpeningHeadline from '../components/landing/OpeningHeadline'
import MarqueeBar from '../components/landing/MarqueeBar'
import ToolkitSection from '../components/landing/ToolkitSection'
import VideoSection from '../components/landing/VideoSection'
import AchievementsSection from '../components/landing/AchievementsSection'
import BuiltBySection from '../components/landing/BuiltBySection'
import GetStartedSection from '../components/landing/GetStartedSection'

export default function Home() {
  return (
    <>
      <Head>
        <title>Manifestr - Elevate Your Game</title>
        <meta
          name="description"
          content="MANIFESTR works with you to create high-quality decks, briefs, strategies, reports, visuals, budgets, and more — fast."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <OpeningHeadline />
          <MarqueeBar />
          <ToolkitSection />
          <VideoSection />
          <AchievementsSection />
          <BuiltBySection />
          <GetStartedSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
