import Head from 'next/head'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ContactHero from '../components/contact/ContactHero'
import ContactContent from '../components/contact/ContactContent'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - MANIFESTR</title>
        <meta
          name="description"
          content="Have a question, need support, or want to start a conversation? Reach out and we'll point you in the right direction."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <ContactHero />
          <ContactContent />
        </main>
        <Footer />
      </div>
    </>
  )
}
