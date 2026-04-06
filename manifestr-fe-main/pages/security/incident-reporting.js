import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import IncidentReporting from '../../components/security/IncidentReporting'

export default function IncidentReportingPage() {
  return (
    <>
      <Head>
        <title>Incident Reporting - Security | MANIFESTR</title>
        <meta
          name="description"
          content="Transparency in action. Learn about MANIFESTR's incident response protocol, vulnerability disclosure, and bug bounty program."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <IncidentReporting />
        </main>
        <Footer />
      </div>
    </>
  )
}
