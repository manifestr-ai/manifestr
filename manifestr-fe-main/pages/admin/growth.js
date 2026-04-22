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

export default function AdminGrowth({ growthData }) {
  const stats = growthData?.stats || []

  return (
    <>
      <Head>
        <title>Growth &amp; User Health - Admin</title>
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

              {/* KPI — 2×2 mobile, single row on lg */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
                {stats.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* Metrics: Signups Over Time + Returning vs New */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <DauMauTrend data={growthData?.signupsOverTime} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <ReturningVsNewChart data={growthData?.returningVsNew} />
                </div>
              </div>

              {/* Breakdown: By Region · By Source · By User Type */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <ChannelBarChart data={growthData?.breakdownByRegion} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <ChannelBarChart data={growthData?.breakdownBySource} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <PaidVsOrganic data={growthData?.breakdownByUserType} />
                </div>
              </div>

              {/* User Health Score */}
              <UserHealthScoreCard data={growthData?.userHealthScore} />

              {/* Power Users Table */}
              <PowerUsersTable data={growthData?.powerUsers} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const growthData = await getAdminGrowthData(query)

  return {
    props: {
      growthData,
    },
  }
}
