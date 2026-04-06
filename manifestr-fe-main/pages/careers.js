import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CareersHero from '../components/careers/CareersHero'
import WhyChoose from '../components/careers/WhyChoose'
import HowWeWork from '../components/careers/HowWeWork'
import OpenRoles from '../components/careers/OpenRoles'
import WellbeingBenefits from '../components/careers/WellbeingBenefits'
import TeamTestimonials from '../components/careers/TeamTestimonials'
import WhatToExpect from '../components/careers/WhatToExpect'
import CommitmentToInclusion from '../components/careers/CommitmentToInclusion'
import AffiliateBanner from '../components/careers/AffiliateBanner'

export default function Careers() {
  return (
    <>
      <Head>
        <title>Careers - Manifestr | Make Your Mark</title>
        <meta
          name="description"
          content="Join the MANIFESTR team. We're building the future of professional work with thinkers, makers, and challengers who thrive on possibility."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <CareersHero />
          <WhyChoose />
          <HowWeWork />
          <OpenRoles />
          <WellbeingBenefits />
          <TeamTestimonials />
          <AffiliateBanner />
          <WhatToExpect />
          <CommitmentToInclusion />
        </main>
        <Footer />
      </div>
    </>
  )
}
