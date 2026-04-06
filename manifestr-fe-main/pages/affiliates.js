import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AffiliateHero from '../components/affiliate/AffiliateHero'
import WhyJoinAffiliate from '../components/affiliate/WhyJoinAffiliate'
import HowItWorks from '../components/affiliate/HowItWorks'
import CommissionTiers from '../components/affiliate/CommissionTiers'
import EarningPotential from '../components/affiliate/EarningPotential'
import DashboardToolkit from '../components/affiliate/DashboardToolkit'
import AffiliateFAQ from '../components/affiliate/AffiliateFAQ'
import AffiliateGetStarted from '../components/affiliate/AffiliateGetStarted'

export default function Affiliates() {
  return (
    <>
      <Head>
        <title>Affiliate Program - MANIFESTR</title>
        <meta
          name="description"
          content="Join the MANIFESTR Affiliate Program. Earn up to 50% commission with industry-leading payouts, recurring monthly commissions, and a dedicated affiliate dashboard."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <AffiliateHero />
          <WhyJoinAffiliate />
          <HowItWorks />
          <CommissionTiers />
          <EarningPotential />
          <DashboardToolkit />
          <AffiliateFAQ />
          <AffiliateGetStarted />
        </main>
        <Footer />
      </div>
    </>
  )
}
