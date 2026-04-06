import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import KnowledgeBase from '../../components/playbook/KnowledgeBase'

export default function KnowledgeBasePage() {
  return (
    <>
      <Head>
        <title>Knowledge Base - MANIFESTR Playbook</title>
        <meta
          name="description"
          content="In-depth guides and resources to help you master MANIFESTR. Browse by category to find the answers you need."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <KnowledgeBase />
        </main>
        <Footer />
      </div>
    </>
  )
}
