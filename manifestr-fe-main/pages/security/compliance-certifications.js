import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import ComplianceCertifications from '../../components/security/ComplianceCertifications'

export default function ComplianceCertificationsPage() {
  return (
    <>
      <Head>
        <title>Compliance & Certifications - Security | MANIFESTR</title>
        <meta
          name="description"
          content="Aligned with global standards. SOC 2 Type II, GDPR, CPRA, HIPAA — learn how MANIFESTR meets international compliance frameworks."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 bg-white pt-[76px]">
          <ComplianceCertifications />
        </main>
        <Footer />
      </div>
    </>
  )
}
