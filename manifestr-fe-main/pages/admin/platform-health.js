import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'
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
import OverviewFilters from '../../components/admin/overview/OverviewFilters'

import { getAdminPlatformHealthData } from '../../services/admin/platform-health'
import { useAdminDashboardFilters } from '../../contexts/AdminDashboardFiltersContext'

export default function AdminPlatformHealth() {
  const [platformHealthData, setplatformHealthData] = useState(null)
  const [error, setError] = useState(false)
  const { apiParams, applyFiltersChange, selections, search } =
    useAdminDashboardFilters()

  const { user, loading } = useAuth()
  const router = useRouter()

  // 🔐 Protect route
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace('/login')
    }
  }, [user, loading, router])

  // 📡 Fetch data
  useEffect(() => {
    if (user?.is_admin) {
      getAdminPlatformHealthData(apiParams)
        .then((res) => {
          if (!res) setError(true)
          else setplatformHealthData(res)
        })
        .catch(() => setError(true))
    }
  }, [user?.is_admin, apiParams])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Failed to load</div>
  return (
    <>
      <Head>
        <title>Platform Health - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <PlatformHealthHeader
              title={platformHealthData?.header?.title}
              subtitle={platformHealthData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              <OverviewFilters
                filters={platformHealthData?.filters?.options}
                searchPlaceholder={
                  platformHealthData?.filters?.searchPlaceholder
                }
                selections={selections}
                search={search}
                onFiltersChange={applyFiltersChange}
              />

              {/* Metrics: p50/p95/p99 + error rate + timeout rate + uptime */}
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-[18px] lg:flex-nowrap">
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

