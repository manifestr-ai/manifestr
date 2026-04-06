import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import ProductUpdates from '../../components/playbook/ProductUpdates'

export default function ProductUpdatesPage() {
  return (
    <>
      <Head>
        <title>Product Updates - MANIFESTR Playbook</title>
        <meta
          name="description"
          content="See what's new, improved, and coming soon in MANIFESTR. Stay up to date with the latest product updates and releases."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <ProductUpdates />
        </main>
        <Footer />
      </div>
    </>
  )
}
