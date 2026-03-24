import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import PrivacyPolicy from '../components/legal/PrivacyPolicy'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - MANIFESTR</title>
        <meta
          name="description"
          content="Privacy Policy - Learn how MANIFESTR collects, uses, and protects your data."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <PrivacyPolicy />
        </main>
        <Footer />
      </div>
    </>
  )
}
