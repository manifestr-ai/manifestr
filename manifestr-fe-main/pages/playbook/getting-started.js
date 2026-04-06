import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import GettingStarted from '../../components/playbook/GettingStarted'

export default function GettingStartedPage() {
  return (
    <>
      <Head>
        <title>Getting Started - MANIFESTR Playbook</title>
        <meta
          name="description"
          content="Learn the basics of MANIFESTR with step-by-step guides for creating your first project, understanding workspaces, and more."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <GettingStarted />
        </main>
        <Footer />
      </div>
    </>
  )
}
