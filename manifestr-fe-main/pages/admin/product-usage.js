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
    <p className="text-[11px] leading-[16px] font-semibold tracking-[0.08em] uppercase text-[#71717a] pt-1 sm:text-[12px] sm:leading-[18px] sm:pt-2">
      {children}
    </p>
  )
}

export default function AdminProductUsage({ productUsageData }) {
  const stats = productUsageData?.stats || []
  const behaviourStats = productUsageData?.behaviourStats || []

  return (
    <>
      <Head>
        <title>Product Usage &amp; Engagement - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto">
            <ProductUsageHeader
              title={productUsageData?.header?.title}
              subtitle={productUsageData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              <OverviewFilters
                filters={productUsageData?.filters?.options}
                searchPlaceholder={productUsageData?.filters?.searchPlaceholder}
              />

              {/* ── Core Metrics ── */}
              <SectionLabel>Core Metrics</SectionLabel>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-[18px]">
                {stats.map((s) => (
                  <StatCard key={s.id || s.title} {...s} neutralBadge />
                ))}
              </div>

              {/* Usage trend charts */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <DecksPerUserChart data={productUsageData?.decksPerUser} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <TimeToFirstOutput data={productUsageData?.timeToFirstOutput} />
                </div>
              </div>

              {/* Session Frequency + Session Duration */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <DecksPerUserChart data={productUsageData?.sessionFrequency} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <DecksPerUserChart data={productUsageData?.sessionDuration} />
                </div>
              </div>

              {/* ── Behaviour Tracking ── */}
              <SectionLabel>Behaviour Tracking</SectionLabel>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-[18px]">
                {behaviourStats.map((s) => (
                  <StatCard key={s.id || s.title} {...s} neutralBadge />
                ))}
              </div>

              {/* Accept vs Edit (Rewrites vs Accepts) + Most Used Document Types (Slide Types) */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <RewritesVsAccepts data={productUsageData?.rewritesVsAccepts} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <CategoryPieChart data={productUsageData?.slideTypes} />
                </div>
              </div>

              {/* Export Types + AI Style Settings */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <CategoryPieChart data={productUsageData?.exportTypes} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <AiStyleSettingsUsage data={productUsageData?.aiStyleSettingsUsage} />
                </div>
              </div>

              <SlideTimeHeatmap data={productUsageData?.slideTimeHeatmap} />

              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <SlideDropoff data={productUsageData?.slideDropoff} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <SlideRewritesVsAccepts data={productUsageData?.slideRewritesVsAccepts} />
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-[1.75]">
                  <RewritesVsAcceptsFlows data={productUsageData?.rewritesVsAcceptsFlows} />
                </div>
                <div className="w-full min-w-0 lg:w-[355px] lg:shrink-0">
                  <BouncedDecks data={productUsageData?.bouncedDecks} />
                </div>
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
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <TransitionDropoffsFunnel data={productUsageData?.transitionDropoffsFunnel} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <MultiToolUsage data={productUsageData?.multiToolUsage} />
                </div>
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
