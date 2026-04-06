import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import UserResponsibility from '../../components/security/UserResponsibility'

export default function UserResponsibilityPage() {
  return (
    <>
      <Head>
        <title>User Responsibility - Security | MANIFESTR</title>
        <meta
          name="description"
          content="Security is a shared responsibility. Learn what MANIFESTR secures and what you manage to keep your data safe."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <UserResponsibility />
        </main>
        <Footer />
      </div>
    </>
  )
}
