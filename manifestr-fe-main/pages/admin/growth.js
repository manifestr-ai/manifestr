import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import GrowthHeader from '../../components/admin/growth/GrowthHeader'
import OverviewFilters from '../../components/admin/overview/OverviewFilters'
import StatCard from '../../components/admin/overview/StatCard'
import MrrArrTrend from '../../components/admin/overview/MrrArrTrend'
import UpgradesCancelsChart from '../../components/admin/growth/UpgradesCancelsChart'
import RetentionHeatmap from '../../components/admin/growth/RetentionHeatmap'
import ChannelBarChart from '../../components/admin/growth/ChannelBarChart'
import CpsCppTrend from '../../components/admin/growth/CpsCppTrend'
import PaidVsOrganic from '../../components/admin/growth/PaidVsOrganic'
import { getAdminGrowthData } from '../../services/admin/growth'

export default function AdminGrowth({ growthData }) {
  const stats = growthData?.stats || []

  return (
    <>
      <Head>
        <title>Growth &amp; Acquisition - Admin</title>
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
              <OverviewFilters
                filters={growthData?.filters?.options}
                searchPlaceholder={growthData?.filters?.searchPlaceholder}
              />

              <div className="flex gap-[18px]">
                {stats.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              <MrrArrTrend data={growthData?.mrrArrTrend} />

              <div className="flex gap-[18px]">
                <UpgradesCancelsChart data={growthData?.upgradesCancels} />
                <RetentionHeatmap data={growthData?.retentionTable} />
              </div>

              <div className="flex gap-[18px]">
                <ChannelBarChart data={growthData?.cacByChannel} />
                <CpsCppTrend data={growthData?.cpsCppTrend} />
              </div>

              <div className="flex gap-[18px]">
                <PaidVsOrganic data={growthData?.paidVsOrganic} />
                <ChannelBarChart data={growthData?.arpuByChannel} />
              </div>
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
