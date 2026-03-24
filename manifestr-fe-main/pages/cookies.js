import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CookiePolicy from '../components/legal/CookiePolicy'

export default function CookiePolicyPage() {
  return (
    <>
      <Head>
        <title>Cookie Policy - MANIFESTR</title>
        <meta
          name="description"
          content="Cookie Policy - Learn how MANIFESTR uses cookies and similar technologies."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <CookiePolicy />
        </main>
        <Footer />
      </div>
    </>
  )
}
