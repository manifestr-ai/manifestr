import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import PlaybookHero from '../components/playbook/PlaybookHero'
import PlaybookContent from '../components/playbook/PlaybookContent'

export default function Playbook() {
  return (
    <>
      <Head>
        <title>Playbook - MANIFESTR</title>
        <meta
          name="description"
          content="Your support hub for how-to's, walkthroughs, and tips. Browse the MANIFESTR knowledge base, tutorials, FAQs, and more."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <PlaybookHero />
          <PlaybookContent />
        </main>
        <Footer />
      </div>
    </>
  )
}
