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

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <GrowthHeader
              title={growthData?.header?.title}
              subtitle={growthData?.header?.subtitle}
            />

            <div className="flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              {/* Filters */}
              <OverviewFilters
                filters={growthData?.filters?.options}
                searchPlaceholder={growthData?.filters?.searchPlaceholder}
              />

              {/* KPI Row: New Signups · Activation Rate · DAU/MAU · Returning Users */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                {stats.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* Metrics: Signups Over Time + Returning vs New */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <DauMauTrend data={growthData?.signupsOverTime} />
                <ReturningVsNewChart data={growthData?.returningVsNew} />
              </div>

              {/* Breakdown: By Region · By Source · By User Type */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <ChannelBarChart data={growthData?.breakdownByRegion} />
                <ChannelBarChart data={growthData?.breakdownBySource} />
                <PaidVsOrganic data={growthData?.breakdownByUserType} />
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
