import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PlaybookFAQs from '../../components/playbook/PlaybookFAQs'

export default function PlaybookFAQsPage() {
  return (
    <>
      <Head>
        <title>FAQs - MANIFESTR Playbook</title>
        <meta
          name="description"
          content="Common questions, answered. Platform, plans, AI, collaboration and support."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <PlaybookFAQs />
        </main>
        <Footer />
      </div>
    </>
  )
}
