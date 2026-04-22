import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import OverviewHeader from '../../components/admin/overview/OverviewHeader'
import OverviewFilters from '../../components/admin/overview/OverviewFilters'
import StatCard from '../../components/admin/overview/StatCard'
import DauMauTrend from '../../components/admin/overview/DauMauTrend'
import MrrArrTrend from '../../components/admin/overview/MrrArrTrend'
import ConversionFunnel from '../../components/admin/overview/ConversionFunnel'
import RecentActivityFeed from '../../components/admin/overview/RecentActivityFeed'
import AlertsFeed from '../../components/admin/overview/AlertsFeed'
import { getAdminOverviewData } from '../../services/admin/overview'

export default function AdminOverview({ overviewData }) {
  const statCards = [
    ...(overviewData?.statRows?.[0] || []),
    ...(overviewData?.statRows?.[1] || []),
  ]

  return (
    <>
      <Head>
        <title>Executive Overview - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <OverviewHeader
              title={overviewData?.header?.title}
              subtitle={overviewData?.header?.subtitle}
            />

            <div className="flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              {/* Filters */}
              <OverviewFilters
                filters={overviewData?.filters?.options}
                searchPlaceholder={overviewData?.filters?.searchPlaceholder}
              />

              {/* KPI metrics — 2 per row mobile, 3 per row desktop */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-[18px]">
                {statCards.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* Charts Row: User Growth + Conversion Funnel */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <DauMauTrend data={overviewData?.userGrowth} />
                <ConversionFunnel data={overviewData?.conversionFunnel} />
              </div>

              {/* Charts + Feed Row: Revenue Trend + Recent Activity */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <MrrArrTrend data={overviewData?.revenueTrend} />
                <RecentActivityFeed data={overviewData?.recentActivity} />
              </div>

              {/* Alerts */}
              <AlertsFeed data={overviewData?.alerts} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const overviewData = await getAdminOverviewData(query)

  return {
    props: {
      overviewData,
    },
  }
}
