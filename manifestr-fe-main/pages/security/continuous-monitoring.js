import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import ContinuousMonitoring from '../../components/security/ContinuousMonitoring'

export default function ContinuousMonitoringPage() {
  return (
    <>
      <Head>
        <title>Continuous Monitoring &amp; Updates - Security | MANIFESTR</title>
        <meta
          name="description"
          content="Always on. Always evolving. Learn about MANIFESTR's 24/7 monitoring, penetration testing, employee training, and patch management."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <ContinuousMonitoring />
        </main>
        <Footer />
      </div>
    </>
  )
}
