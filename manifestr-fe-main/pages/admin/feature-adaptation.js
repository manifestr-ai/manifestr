import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import FeatureAdoptionHeader from '../../components/admin/feature-adoption/FeatureAdoptionHeader'
import AiPerformanceFilters from '../../components/admin/ai-performance/AiPerformanceFilters'
import StatCard from '../../components/admin/overview/StatCard'
import AdoptionFunnelChart from '../../components/admin/feature-adoption/AdoptionFunnelChart'
import PlanBreakdownChart from '../../components/admin/feature-adoption/PlanBreakdownChart'
import TopFeaturesTable from '../../components/admin/feature-adoption/TopFeaturesTable'
import { getAdminFeatureAdoptionData } from '../../services/admin/feature-adoption'

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

              <AdoptionFunnelChart data={featureAdoptionData?.adoptionFunnel} />

              <PlanBreakdownChart data={featureAdoptionData?.planBreakdown} />

              <TopFeaturesTable data={featureAdoptionData?.topFeatures} />
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
