import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import MonetizationHeader from '../../components/admin/monetization/MonetizationHeader'
import RevenueStatCard from '../../components/admin/monetization/RevenueStatCard'
import FunnelCard from '../../components/admin/monetization/FunnelCard'
import RevenueTrendChart from '../../components/admin/monetization/RevenueTrendChart'
import RevenueByPlanChart from '../../components/admin/monetization/RevenueByPlanChart'
import ExportUsageByPlan from '../../components/admin/monetization/ExportUsageByPlan'
import PaywallEvents from '../../components/admin/monetization/PaywallEvents'
import TopRevenueUsersTable from '../../components/admin/monetization/TopRevenueUsersTable'
import { getAdminMonetizationData } from '../../services/admin/monetization'

function SectionLabel({ children }) {
  return (
    <div className="pt-2">
      <p className="text-[12px] leading-[18px] font-semibold tracking-[0.08em] uppercase text-[#71717a]">
        {children}
      </p>
    </div>
  )
}

export default function AdminMonetization({ monetizationData }) {
  return (
    <>
      <Head>
        <title>Monetization - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <MonetizationHeader
              title={monetizationData?.header?.title}
              subtitle={monetizationData?.header?.subtitle}
              filters={monetizationData?.filters}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">

              {/* Core Revenue Metrics */}
              <SectionLabel>Core Revenue Metrics</SectionLabel>

              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                <RevenueStatCard data={monetizationData?.totalRevenue} />
                <RevenueStatCard data={monetizationData?.mrr} />
                <RevenueStatCard data={monetizationData?.arr} />
              </div>

              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                <RevenueStatCard data={monetizationData?.freeToPaid} />
                <RevenueStatCard data={monetizationData?.upgradeRate} />
                <RevenueStatCard data={monetizationData?.downgradeRate} />
              </div>

              {/* Revenue Trend Chart */}
              <SectionLabel>Revenue Trend</SectionLabel>
              <RevenueTrendChart data={monetizationData?.revenueTrend} />

              {/* Revenue by Plan + Conversion Funnel */}
              <SectionLabel>Plan Breakdown & Conversion</SectionLabel>
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap items-stretch">
                <RevenueByPlanChart data={monetizationData?.revenueByPlan} />
                <div className="flex-1 min-w-0">
                  <FunnelCard data={monetizationData?.conversionFunnel} />
                </div>
              </div>

              {/* Export Usage + Paywall Events */}
              <SectionLabel>Export & Paywall</SectionLabel>
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap items-stretch">
                <ExportUsageByPlan data={monetizationData?.exportUsageByPlan} />
                <PaywallEvents data={monetizationData?.paywallEvents} />
              </div>

              {/* Top Users by Revenue */}
              <SectionLabel>Top Users by Revenue</SectionLabel>
              <TopRevenueUsersTable data={monetizationData?.topRevenueUsers} />

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const monetizationData = await getAdminMonetizationData(query)

  return {
    props: {
      monetizationData,
    },
  }
}
