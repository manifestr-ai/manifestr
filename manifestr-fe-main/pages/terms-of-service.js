import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import TermsOfService from '../components/legal/TermsOfService'

export default function TermsOfServicePage() {
  return (
    <>
      <Head>
        <title>Terms of Service - MANIFESTR</title>
        <meta
          name="description"
          content="Terms of Service - Binding Legal Agreement between you and MANIFESTR LLC."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <TermsOfService />
        </main>
        <Footer />
      </div>
    </>
  )
}
