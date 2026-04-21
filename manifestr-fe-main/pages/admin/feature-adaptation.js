import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import FeatureAdoptionHeader from '../../components/admin/feature-adoption/FeatureAdoptionHeader'
import AiPerformanceFilters from '../../components/admin/ai-performance/AiPerformanceFilters'
import StatCard from '../../components/admin/overview/StatCard'
import AdoptionFunnelChart from '../../components/admin/feature-adoption/AdoptionFunnelChart'
import FeatureAdoptionGrid from '../../components/admin/feature-adoption/FeatureAdoptionGrid'
import TopFeaturesTable from '../../components/admin/feature-adoption/TopFeaturesTable'
import PlanBreakdownChart from '../../components/admin/feature-adoption/PlanBreakdownChart'
import WorkspacesCreated from '../../components/admin/feature-adoption/WorkspacesCreated'
import MembersAdded from '../../components/admin/feature-adoption/MembersAdded'
import CommentsPerDocument from '../../components/admin/feature-adoption/CommentsPerDocument'
import SharedVsSoloUsage from '../../components/admin/feature-adoption/SharedVsSoloUsage'
import TopCollaborativeProjects from '../../components/admin/feature-adoption/TopCollaborativeProjects'
import TeamTable from '../../components/admin/feature-adoption/TeamTable'
import { getAdminFeatureAdoptionData } from '../../services/admin/feature-adoption'

function SectionLabel({ children }) {
  return (
    <div className="pt-2">
      <p className="text-[12px] leading-[18px] font-semibold tracking-[0.08em] uppercase text-[#71717a]">
        {children}
      </p>
    </div>
  )
}

export default function AdminFeatureAdoption({ featureAdoptionData }) {
  const stats = featureAdoptionData?.stats || []

  return (
    <>
      <Head>
        <title>Feature Adoption - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <FeatureAdoptionHeader
              title={featureAdoptionData?.header?.title}
              subtitle={featureAdoptionData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <AiPerformanceFilters
                searchPlaceholder={featureAdoptionData?.filters?.searchPlaceholder}
                options={featureAdoptionData?.filters?.options}
              />

              {/* KPI: Adoption Stages */}
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                {stats.map((s) => (
                  <StatCard
                    key={s.id}
                    title={s.title}
                    value={s.value}
                    change={s.change}
                    period={s.period}
                    neutralBadge
                  />
                ))}
              </div>

              {/* Overall Funnel */}
              <SectionLabel>Overall Adoption Funnel</SectionLabel>
              <AdoptionFunnelChart data={featureAdoptionData?.adoptionFunnel} />

              {/* Per-Feature Funnels + Adoption Score */}
              <SectionLabel>Per-Feature Funnels</SectionLabel>
              <FeatureAdoptionGrid data={featureAdoptionData?.featureAdoptionGrid} />

              {/* Feature Adoption Score Matrix */}
              <SectionLabel>Adoption Score Matrix</SectionLabel>
              <TopFeaturesTable data={featureAdoptionData?.topFeatures} />

              {/* Breakdowns */}
              <SectionLabel>Breakdowns</SectionLabel>
              <PlanBreakdownChart data={featureAdoptionData?.planBreakdown} />
              <div className="flex gap-[18px] flex-wrap lg:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <PlanBreakdownChart data={featureAdoptionData?.roleBreakdown} />
                </div>
                <div className="flex-1 min-w-0">
                  <PlanBreakdownChart data={featureAdoptionData?.regionBreakdown} />
                </div>
              </div>

              {/* Collaboration Hub */}
              <SectionLabel>Collaboration Hub</SectionLabel>

              <div className="flex gap-[18px] items-stretch">
                <WorkspacesCreated data={featureAdoptionData?.workspacesCreated} />
                <MembersAdded data={featureAdoptionData?.membersAdded} />
              </div>

              <CommentsPerDocument data={featureAdoptionData?.commentsPerDocument} />

              <div className="flex gap-[18px] items-stretch">
                <SharedVsSoloUsage data={featureAdoptionData?.sharedVsSolo} />
                <TopCollaborativeProjects data={featureAdoptionData?.topCollaborativeProjects} />
              </div>

              <TeamTable data={featureAdoptionData?.team} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const featureAdoptionData = await getAdminFeatureAdoptionData(query)

  return {
    props: {
      featureAdoptionData,
    },
  }
}
