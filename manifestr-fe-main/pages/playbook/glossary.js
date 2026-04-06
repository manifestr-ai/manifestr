import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import Glossary from '../../components/playbook/Glossary'

export default function GlossaryPage() {
  return (
    <>
      <Head>
        <title>Glossary - MANIFESTR Playbook</title>
        <meta
          name="description"
          content="MANIFESTR key terms and concepts, clearly defined. Browse the glossary to understand the terminology used across the platform."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <Glossary />
        </main>
        <Footer />
      </div>
    </>
  )
}
