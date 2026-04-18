import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import PlatformHealthHeader from '../../components/admin/platform-health/PlatformHealthHeader'
import HealthStatCard from '../../components/admin/platform-health/HealthStatCard'
import FailuresAlertsList from '../../components/admin/platform-health/FailuresAlertsList'
import { getAdminPlatformHealthData } from '../../services/admin/platform-health'

export default function AdminPlatformHealth({ platformHealthData }) {
  return (
    <>
      <Head>
        <title>Platform Health - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <PlatformHealthHeader
              title={platformHealthData?.header?.title}
              subtitle={platformHealthData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                <HealthStatCard data={platformHealthData?.apiResponseTime} />
                <HealthStatCard data={platformHealthData?.errorRate} />
                <HealthStatCard data={platformHealthData?.uptime} />
              </div>

              <FailuresAlertsList data={platformHealthData?.failuresAlerts} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const platformHealthData = await getAdminPlatformHealthData(query)

  return {
    props: {
      platformHealthData,
    },
  }
}
