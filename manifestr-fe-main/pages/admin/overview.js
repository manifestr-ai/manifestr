import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import OverviewHeader from '../../components/admin/overview/OverviewHeader'
import OverviewFilters from '../../components/admin/overview/OverviewFilters'
import StatCard from '../../components/admin/overview/StatCard'
import MrrArrTrend from '../../components/admin/overview/MrrArrTrend'
import ClosedWonChart from '../../components/admin/overview/ClosedWonChart'
import DauMauTrend from '../../components/admin/overview/DauMauTrend'
import AiTrustScore from '../../components/admin/overview/AiTrustScore'
import TopCustomersTable from '../../components/admin/overview/TopCustomersTable'
import PlatformHealth from '../../components/admin/overview/PlatformHealth'
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

          {/* Page content */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Page header — white bg */}
            <OverviewHeader
              title={overviewData?.header?.title}
              subtitle={overviewData?.header?.subtitle}
            />

            {/* Main body — muted bg */}
            <div className="flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              {/* Filters */}
              <OverviewFilters
                filters={overviewData?.filters?.options}
                searchPlaceholder={overviewData?.filters?.searchPlaceholder}
              />

              {/* KPI Row 1 */}
              <div className="flex gap-[18px]">
                {row1.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* KPI Row 2 */}
              <div className="flex gap-[18px]">
                {row2.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* Charts Row: MRR Trend + Closed-Won */}
              <div className="flex gap-[18px]">
                <MrrArrTrend data={overviewData?.mrrArrTrend} />
                <ClosedWonChart data={overviewData?.closedWon} />
              </div>

              {/* Charts Row: DAU/MAU + AI Trust */}
              <div className="flex gap-[18px]">
                <DauMauTrend data={overviewData?.dauMauTrend} />
                <AiTrustScore data={overviewData?.aiTrustScore} />
              </div>

              {/* Bottom Row: Customers Table + Platform Health */}
              <div className="flex gap-[18px]">
                <TopCustomersTable data={overviewData?.topCustomers} />
                <PlatformHealth data={overviewData?.platformHealth} />
              </div>
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
