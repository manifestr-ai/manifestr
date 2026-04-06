import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import SubmitTicket from '../../components/playbook/SubmitTicket'

export default function SubmitTicketPage() {
  return (
    <>
      <Head>
        <title>Submit a Ticket - MANIFESTR Playbook</title>
        <meta
          name="description"
          content="Reach out to our support team if you need further assistance. Submit a support ticket for MANIFESTR."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <SubmitTicket />
        </main>
        <Footer />
      </div>
    </>
  )
}
