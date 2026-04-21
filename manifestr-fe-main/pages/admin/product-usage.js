import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import ProductUsageHeader from '../../components/admin/product-usage/ProductUsageHeader'
import OverviewFilters from '../../components/admin/overview/OverviewFilters'
import StatCard from '../../components/admin/overview/StatCard'
import DecksPerUserChart from '../../components/admin/product-usage/DecksPerUserChart'
import TimeToFirstOutput from '../../components/admin/product-usage/TimeToFirstOutput'
import CategoryPieChart from '../../components/admin/product-usage/CategoryPieChart'
import RewritesVsAccepts from '../../components/admin/product-usage/RewritesVsAccepts'
import AiStyleSettingsUsage from '../../components/admin/product-usage/AiStyleSettingsUsage'
import SlideTimeHeatmap from '../../components/admin/product-usage/SlideTimeHeatmap'
import SlideDropoff from '../../components/admin/product-usage/SlideDropoff'
import SlideRewritesVsAccepts from '../../components/admin/product-usage/SlideRewritesVsAccepts'
import RewritesVsAcceptsFlows from '../../components/admin/product-usage/RewritesVsAcceptsFlows'
import BouncedDecks from '../../components/admin/product-usage/BouncedDecks'
import CompletionTime from '../../components/admin/product-usage/CompletionTime'
import ToolUsersGrid from '../../components/admin/product-usage/ToolUsersGrid'
import MostCommonJourneys from '../../components/admin/product-usage/MostCommonJourneys'
import TransitionDropoffsFunnel from '../../components/admin/product-usage/TransitionDropoffsFunnel'
import MultiToolUsage from '../../components/admin/product-usage/MultiToolUsage'
import ToolPairingMatrix from '../../components/admin/product-usage/ToolPairingMatrix'
import { getAdminProductUsageData } from '../../services/admin/product-usage'

function SectionLabel({ children }) {
  return (
    <p className="text-[12px] leading-[18px] font-semibold tracking-[0.08em] uppercase text-[#71717a] pt-2">
      {children}
    </p>
  )
}

export default function AdminProductUsage({ productUsageData }) {
  const stats = productUsageData?.stats || []
  const behaviourStats = productUsageData?.behaviourStats || []
  const statsRow1 = stats.slice(0, 3)
  const statsRow2 = stats.slice(3, 6)

  return (
    <>
      <Head>
        <title>Product Usage &amp; Engagement - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <ProductUsageHeader
              title={productUsageData?.header?.title}
              subtitle={productUsageData?.header?.subtitle}
            />

            <div className="flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <OverviewFilters
                filters={productUsageData?.filters?.options}
                searchPlaceholder={productUsageData?.filters?.searchPlaceholder}
              />

              {/* ── Core Metrics ── */}
              <SectionLabel>Core Metrics</SectionLabel>

              {/* KPI Row 1: Outputs per User · Time to First Output · Session Frequency */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                {statsRow1.map((s) => (
                  <StatCard key={s.title} {...s} neutralBadge />
                ))}
              </div>

              {/* KPI Row 2: Avg Session Duration · Completion Rate · Abandonment Rate */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                {statsRow2.map((s) => (
                  <StatCard key={s.title} {...s} neutralBadge />
                ))}
              </div>

              {/* Usage trend charts */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <DecksPerUserChart data={productUsageData?.decksPerUser} />
                <TimeToFirstOutput data={productUsageData?.timeToFirstOutput} />
              </div>

              {/* Session Frequency + Session Duration */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <DecksPerUserChart data={productUsageData?.sessionFrequency} />
                <DecksPerUserChart data={productUsageData?.sessionDuration} />
              </div>

              {/* ── Behaviour Tracking ── */}
              <SectionLabel>Behaviour Tracking</SectionLabel>

              {/* Rewrites per Output · Accept Rate · Edit Rate */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                {behaviourStats.map((s) => (
                  <StatCard key={s.title} {...s} neutralBadge />
                ))}
              </div>

              {/* Accept vs Edit (Rewrites vs Accepts) + Most Used Document Types (Slide Types) */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <RewritesVsAccepts data={productUsageData?.rewritesVsAccepts} />
                <CategoryPieChart data={productUsageData?.slideTypes} />
              </div>

              {/* Export Types + AI Style Settings */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <CategoryPieChart data={productUsageData?.exportTypes} />
                <AiStyleSettingsUsage data={productUsageData?.aiStyleSettingsUsage} />
              </div>

              <SlideTimeHeatmap data={productUsageData?.slideTimeHeatmap} />

              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <SlideDropoff data={productUsageData?.slideDropoff} />
                <SlideRewritesVsAccepts data={productUsageData?.slideRewritesVsAccepts} />
              </div>

              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <RewritesVsAcceptsFlows data={productUsageData?.rewritesVsAcceptsFlows} />
                <BouncedDecks data={productUsageData?.bouncedDecks} />
              </div>

              <CompletionTime data={productUsageData?.completionTime} />

              {/* Most Used Tools */}
              <SectionLabel>Most Used Tools</SectionLabel>
              <ToolUsersGrid data={productUsageData?.toolUsers} />

              {/* ── Cross-Tool Journeys ── */}
              <SectionLabel>Cross-Tool Journeys</SectionLabel>

              {/* Most common tool sequences */}
              <MostCommonJourneys data={productUsageData?.mostCommonJourneys} />

              {/* Drop-off funnel + Multi-tool usage */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <TransitionDropoffsFunnel data={productUsageData?.transitionDropoffsFunnel} />
                <MultiToolUsage data={productUsageData?.multiToolUsage} />
              </div>

              <ToolPairingMatrix data={productUsageData?.toolPairingMatrix} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const productUsageData = await getAdminProductUsageData(query)

  return {
    props: {
      productUsageData,
    },
  }
}
