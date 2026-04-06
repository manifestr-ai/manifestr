import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AboutHero from '../components/about/AboutHero'
import WhoWeAre from '../components/about/WhoWeAre'
import WhatWeStandFor from '../components/about/WhatWeStandFor'
import EverythingBegins from '../components/about/EverythingBegins'
import BurnoutStory from '../components/about/BurnoutStory'
import FromTheSilence from '../components/about/FromTheSilence'
import BuiltForBrilliance from '../components/about/BuiltForBrilliance'
import ByProfessionals from '../components/about/ByProfessionals'
import TheNewEra from '../components/about/TheNewEra'

export default function About() {
  return (
    <>
      <Head>
        <title>About - Manifestr | Born From Burnout. Built for Brilliance</title>
        <meta
          name="description"
          content="MANIFESTR was created from firsthand experience of modern, high-stakes work. We exist to simplify execution, restore clarity, and help ambitious professionals operate at their best."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-[76px]">
          <AboutHero />
          <WhoWeAre />
          <WhatWeStandFor />
          <EverythingBegins />
          <BurnoutStory />
          <FromTheSilence />
          <BuiltForBrilliance />
          <ByProfessionals />
          <TheNewEra />
        </main>
        <Footer />
      </div>
    </>
  )
}
