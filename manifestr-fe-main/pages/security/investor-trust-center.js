import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import InvestorTrustCenter from '../../components/security/InvestorTrustCenter'

export default function InvestorTrustCenterPage() {
  return (
    <>
      <Head>
        <title>Investor Trust Center - Security | MANIFESTR</title>
        <meta
          name="description"
          content="Proof, not promises. Access SOC 2 reports, penetration testing summaries, DPA, and security whitepapers from the MANIFESTR Investor Trust Center."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <InvestorTrustCenter />
        </main>
        <Footer />
      </div>
    </>
  )
}
