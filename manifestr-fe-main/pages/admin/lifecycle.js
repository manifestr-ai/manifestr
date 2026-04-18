import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import LifecycleHeader from '../../components/admin/lifecycle/LifecycleHeader'
import AiPerformanceFilters from '../../components/admin/ai-performance/AiPerformanceFilters'
import StatCard from '../../components/admin/overview/StatCard'
import LifecycleStagesChart from '../../components/admin/lifecycle/LifecycleStagesChart'
import UserSegmentsTable from '../../components/admin/lifecycle/UserSegmentsTable'
import { getAdminLifecycleData } from '../../services/admin/lifecycle'

export default function AdminLifecycle({ lifecycleData }) {
  const stats = lifecycleData?.stats || []

  return (
    <>
      <Head>
        <title>User Lifecycle - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <LifecycleHeader
              title={lifecycleData?.header?.title}
              subtitle={lifecycleData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <AiPerformanceFilters
                searchPlaceholder={lifecycleData?.filters?.searchPlaceholder}
                options={lifecycleData?.filters?.options}
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

              <LifecycleStagesChart data={lifecycleData?.lifecycleStages} />

              <UserSegmentsTable data={lifecycleData?.segments} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const lifecycleData = await getAdminLifecycleData(query)

  return {
    props: {
      lifecycleData,
    },
  }
}
