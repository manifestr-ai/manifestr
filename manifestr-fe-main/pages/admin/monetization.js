import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import MonetizationHeader from '../../components/admin/monetization/MonetizationHeader'
import RevenueStatCard from '../../components/admin/monetization/RevenueStatCard'
import FunnelCard from '../../components/admin/monetization/FunnelCard'
import { getAdminMonetizationData } from '../../services/admin/monetization'

export default function AdminMonetization({ monetizationData }) {
  return (
    <>
      <Head>
        <title>Monetization - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <MonetizationHeader
              title={monetizationData?.header?.title}
              subtitle={monetizationData?.header?.subtitle}
              filters={monetizationData?.filters}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                <RevenueStatCard data={monetizationData?.totalRevenue} />
                <RevenueStatCard data={monetizationData?.mrr} />
                <RevenueStatCard data={monetizationData?.arr} />
              </div>

              <div className="w-full min-w-0">
                <FunnelCard data={monetizationData?.conversionFunnel} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const monetizationData = await getAdminMonetizationData(query)

  return {
    props: {
      monetizationData,
    },
  }
}
