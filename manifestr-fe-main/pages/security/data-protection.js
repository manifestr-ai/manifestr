import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import DataProtection from '../../components/security/DataProtection'

export default function DataProtectionPage() {
  return (
    <>
      <Head>
        <title>Data Protection - Security | MANIFESTR</title>
        <meta
          name="description"
          content="Your data, secured at every layer. Learn how MANIFESTR protects customer data with encryption, access controls, backups, and zero-trust architecture."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <DataProtection />
        </main>
        <Footer />
      </div>
    </>
  )
}
