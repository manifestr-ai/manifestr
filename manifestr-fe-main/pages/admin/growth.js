import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import Head from 'next/head'

import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import GrowthHeader from '../../components/admin/growth/GrowthHeader'
import OverviewFilters from '../../components/admin/overview/OverviewFilters'
import StatCard from '../../components/admin/overview/StatCard'
import DauMauTrend from '../../components/admin/overview/DauMauTrend'
import ReturningVsNewChart from '../../components/admin/growth/ReturningVsNewChart'
import ChannelBarChart from '../../components/admin/growth/ChannelBarChart'
import PaidVsOrganic from '../../components/admin/growth/PaidVsOrganic'
import UserHealthScoreCard from '../../components/admin/growth/UserHealthScoreCard'
import PowerUsersTable from '../../components/admin/growth/PowerUsersTable'

import { getAdminGrowthData } from '../../services/admin/growth'

export default function AdminGrowth() {
  const [growthData, setGrowthData] = useState(null)
  const [error, setError] = useState(false)

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
      getAdminGrowthData()
        .then((data) => {
          if (!data) {
            setError(true)
          } else {
            setGrowthData(data)
          }
        })
        .catch(() => setError(true))
    }
  }, [user?.is_admin])

  // UI states
  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Failed to load data</div>
  // if (!growthData) return <div className="p-6">No data available</div>

  const stats = Array.isArray(growthData?.stats) ? growthData.stats : []

  return (
    <>
      <Head>
        <title>Growth & User Health - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />

        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <GrowthHeader
              title={growthData?.header?.title}
              subtitle={growthData?.header?.subtitle}
            />

            <div className="flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">

              {/* Filters */}
              <OverviewFilters
                filters={growthData?.filters?.options}
                searchPlaceholder={growthData?.filters?.searchPlaceholder}
              />

              {/* KPI */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
                {stats.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* Charts */}
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-[18px]">
                <div className="w-full lg:flex-1">
                  <DauMauTrend data={growthData?.signupsOverTime} />
                </div>
                <div className="w-full lg:flex-1">
                  <ReturningVsNewChart data={growthData?.returningVsNew} />
                </div>
              </div>

              {/* Breakdown */}
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-[18px]">
                <div className="w-full lg:flex-1">
                  <ChannelBarChart data={growthData?.breakdownByRegion} />
                </div>
                <div className="w-full lg:flex-1">
                  <ChannelBarChart data={growthData?.breakdownBySource} />
                </div>
                <div className="w-full lg:flex-1">
                  <PaidVsOrganic data={growthData?.breakdownByUserType} />
                </div>
              </div>

              {/* Health Score */}
              <UserHealthScoreCard data={growthData?.userHealthScore} />

              {/* Power Users */}
              <PowerUsersTable data={growthData?.powerUsers} />

            </div>
          </div>
        </div>
      </div>
    </>
  )
}