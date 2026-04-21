import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import PlatformHealthHeader from '../../components/admin/platform-health/PlatformHealthHeader'
import APIPercentilesCard from '../../components/admin/platform-health/APIPercentilesCard'
import HealthStatCard from '../../components/admin/platform-health/HealthStatCard'
import EndpointPerformanceTable from '../../components/admin/platform-health/EndpointPerformanceTable'
import QueueAndExportsMonitor from '../../components/admin/platform-health/QueueAndExportsMonitor'
import SystemLogsSection from '../../components/admin/platform-health/SystemLogsSection'
import RealtimeSystemAlerts from '../../components/admin/platform-health/RealtimeSystemAlerts'
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
              {/* Metrics: p50/p95/p99 + error rate + timeout rate + uptime */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                <APIPercentilesCard data={platformHealthData?.apiPercentiles} />
                <HealthStatCard data={platformHealthData?.errorRate} />
                <HealthStatCard data={platformHealthData?.timeoutRate} />
                <HealthStatCard data={platformHealthData?.uptime} />
              </div>

              {/* Monitoring: endpoint performance table */}
              <EndpointPerformanceTable data={platformHealthData?.endpointPerformance} />

              {/* Monitoring: queue delays + export processing time */}
              <QueueAndExportsMonitor data={platformHealthData?.monitoring} />

              {/* Logs: incident log, deploy log, release impact */}
              <SystemLogsSection data={platformHealthData?.systemLogs} />

              {/* Alerts: real-time system alerts */}
              <RealtimeSystemAlerts data={platformHealthData?.realtimeAlerts} />

              {/* Legacy failures & alerts list */}
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
