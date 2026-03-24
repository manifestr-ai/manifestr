import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FAQs from '../components/playbook/FAQs'

export default function FAQsPage() {
  return (
    <>
      <Head>
        <title>FAQs - MANIFESTR</title>
        <meta
          name="description"
          content="Common questions, answered. Platform, plans, AI, collaboration and support."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <FAQs />
        </main>
        <Footer />
      </div>
    </>
  )
}
