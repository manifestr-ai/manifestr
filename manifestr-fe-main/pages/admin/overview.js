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
  const row1 = overviewData?.statRows?.[0] || []
  const row2 = overviewData?.statRows?.[1] || []

  return (
    <>
      <Head>
        <title>Executive Overview - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <OverviewHeader
              title={overviewData?.header?.title}
              subtitle={overviewData?.header?.subtitle}
            />

            <div className="flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              {/* Filters */}
              <OverviewFilters
                filters={overviewData?.filters?.options}
                searchPlaceholder={overviewData?.filters?.searchPlaceholder}
              />

              {/* KPI Row 1: Total Users · New Signups (7d) · DAU/MAU */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                {row1.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* KPI Row 2: Activation Rate · MRR · Revenue This Month */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                {row2.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* Charts Row: User Growth (line) + Conversion Funnel (mini) */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <DauMauTrend data={overviewData?.userGrowth} />
                <ConversionFunnel data={overviewData?.conversionFunnel} />
              </div>

              {/* Charts + Feed Row: Revenue Trend (line) + Recent Activity */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <MrrArrTrend data={overviewData?.revenueTrend} />
                <RecentActivityFeed data={overviewData?.recentActivity} />
              </div>

              {/* Alerts: System Issues · Revenue Drops · Churn Spikes */}
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
