import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AiPerformanceHeader from '../../components/admin/ai-performance/AiPerformanceHeader'
import AiPerformanceFilters from '../../components/admin/ai-performance/AiPerformanceFilters'
import OutputMetricsCards from '../../components/admin/ai-performance/OutputMetricsCards'
import PromptSuccessChart from '../../components/admin/ai-performance/PromptSuccessChart'
import LatencyTrendChart from '../../components/admin/ai-performance/LatencyTrendChart'
import RegenerationsList from '../../components/admin/ai-performance/RegenerationsList'
import AiFeedbackBarChart from '../../components/admin/ai-performance/AiFeedbackBarChart'
import CompletionRateChart from '../../components/admin/ai-performance/CompletionRateChart'
import AILogsSection from '../../components/admin/ai-performance/AILogsSection'
import AIAlertsSection from '../../components/admin/ai-performance/AIAlertsSection'
import DriftAlertsGrid from '../../components/admin/ai-performance/DriftAlertsGrid'
import PredictiveSignalsSection from '../../components/admin/ai-performance/PredictiveSignalsSection'
import { getAdminAiPerformanceData } from '../../services/admin/ai-performance'

export default function AdminAiPerformance({ aiPerformanceData }) {
  return (
    <>
      <Head>
        <title>AI Performance - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <AiPerformanceHeader
              title={aiPerformanceData?.header?.title}
              subtitle={aiPerformanceData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <AiPerformanceFilters
                searchPlaceholder={aiPerformanceData?.filters?.searchPlaceholder}
                options={aiPerformanceData?.filters?.options}
              />

              {/* Metrics: acceptance rate, edit/accept ratio, regen per output, time to generate */}
              <OutputMetricsCards data={aiPerformanceData?.outputMetrics} />

              {/* Prompt Performance: success rate + latency trend */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <PromptSuccessChart data={aiPerformanceData?.promptSuccess} />
                <LatencyTrendChart data={aiPerformanceData?.latencyTrend} />
              </div>

              {/* Prompt Performance: regenerations + output quality signals */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <RegenerationsList data={aiPerformanceData?.regenerations} />
                <AiFeedbackBarChart data={aiPerformanceData?.aiFeedback} />
              </div>

              {/* Prompt Performance: completion rate */}
              <div className="flex gap-[18px] items-stretch flex-wrap lg:flex-nowrap">
                <CompletionRateChart data={aiPerformanceData?.completionRate} />
              </div>

              {/* Logs: AI errors + timeouts */}
              <AILogsSection data={aiPerformanceData?.aiLogs} />

              {/* Alerts: failure spikes + latency issues */}
              <AIAlertsSection data={aiPerformanceData?.aiAlerts} />

              <PredictiveSignalsSection data={aiPerformanceData?.predictiveSignals} />

              <DriftAlertsGrid data={aiPerformanceData?.driftAlerts} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const aiPerformanceData = await getAdminAiPerformanceData(query)

  return {
    props: {
      aiPerformanceData,
    },
  }
}
