import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import RetentionHeader from '../../components/admin/retention/RetentionHeader'
import AiPerformanceFilters from '../../components/admin/ai-performance/AiPerformanceFilters'
import StatCard from '../../components/admin/overview/StatCard'
import CohortRetentionTable from '../../components/admin/retention/CohortRetentionTable'
import TrendLineChart from '../../components/admin/retention/TrendLineChart'
import ChurnBreakdownChart from '../../components/admin/retention/ChurnBreakdownChart'
import { getAdminRetentionData } from '../../services/admin/retention'

export default function AdminRetention({ retentionData }) {
  const stats = retentionData?.stats || []

  return (
    <>
      <Head>
        <title>Retention & Churn - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <RetentionHeader
              title={retentionData?.header?.title}
              subtitle={retentionData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <AiPerformanceFilters
                searchPlaceholder={retentionData?.filters?.searchPlaceholder}
                options={retentionData?.filters?.options}
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

              <CohortRetentionTable data={retentionData?.cohortRetention} />

              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <TrendLineChart key="churn-rate-trend" data={retentionData?.churnRateTrend} />
                <ChurnBreakdownChart data={retentionData?.churnBreakdown} />
              </div>

              <TrendLineChart key="nrr-grr-trend" data={retentionData?.nrrGrrTrend} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const retentionData = await getAdminRetentionData(query)

  return {
    props: {
      retentionData,
    },
  }
}
