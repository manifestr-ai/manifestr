import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Security from '../components/legal/Security'

export default function SecurityPage() {
  return (
    <>
      <Head>
        <title>Trust and Security - MANIFESTR</title>
        <meta
          name="description"
          content="Security is our foundation. Learn how MANIFESTR protects your data with encryption, compliance, and continuous monitoring."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <Security />
        </main>
        <Footer />
      </div>
    </>
  )
}
