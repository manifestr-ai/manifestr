import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import PricingHero from '../components/pricing/PricingHero'
import PricingContent from '../components/pricing/PricingContent'
import PricingFAQ from '../components/pricing/PricingFAQ'

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing - MANIFESTR</title>
        <meta
          name="description"
          content="Choose the MANIFESTR plan that fits your workflow. From Starter to Enterprise, unlock AI-powered tools to build, brand, and scale."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <PricingHero />
          <PricingContent />
          <PricingFAQ />
        </main>
        <Footer />
      </div>
    </>
  )
}
