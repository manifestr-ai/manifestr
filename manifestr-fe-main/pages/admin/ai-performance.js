import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AiPerformanceHeader from "../../components/admin/ai-performance/AiPerformanceHeader";
import AiPerformanceFilters from "../../components/admin/ai-performance/AiPerformanceFilters";
import OutputMetricsCards from "../../components/admin/ai-performance/OutputMetricsCards";
import PromptSuccessChart from "../../components/admin/ai-performance/PromptSuccessChart";
import LatencyTrendChart from "../../components/admin/ai-performance/LatencyTrendChart";
import RegenerationsList from "../../components/admin/ai-performance/RegenerationsList";
import AiFeedbackBarChart from "../../components/admin/ai-performance/AiFeedbackBarChart";
import CompletionRateChart from "../../components/admin/ai-performance/CompletionRateChart";
import AILogsSection from "../../components/admin/ai-performance/AILogsSection";
import AIAlertsSection from "../../components/admin/ai-performance/AIAlertsSection";
import DriftAlertsGrid from "../../components/admin/ai-performance/DriftAlertsGrid";
import PredictiveSignalsSection from "../../components/admin/ai-performance/PredictiveSignalsSection";

import { getAdminAiPerformanceData } from "../../services/admin/ai-performance";
import OverviewFilters from "../../components/admin/overview/OverviewFilters";

export default function AdminAiPerformance() {
  const [filters, setFilters] = useState({
    timeframe: "Last 30d",
    search: "",
  });
  const handleFiltersChange = ({ search, filters: selected }) => {
    setFilters({
      timeframe: selected?.Timeframe || "Last 30d",
      search: search || "",
    });
  };

  const [aiPerformanceData, setAiPerformanceData] = useState(null);
  const [error, setError] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔐 protect
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 📡 fetch
  useEffect(() => {
    if (user?.is_admin) {
      fetchAiPerformance();
    }
  }, [user?.is_admin, filters]);

  const fetchAiPerformance = async () => {
    try {
      const data = await getAdminAiPerformanceData(filters);
      if (!data) {
        setError(true);
      } else {
        setAiPerformanceData(data);
      }
    } catch {
      setError(true);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load</div>;
  return (
    <>
      <Head>
        <title>AI Performance - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <AiPerformanceHeader
              title={aiPerformanceData?.header?.title}
              subtitle={aiPerformanceData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              {/* <AiPerformanceFilters
                searchPlaceholder={
                  aiPerformanceData?.filters?.searchPlaceholder
                }
                options={aiPerformanceData?.filters?.options}
                onFiltersChange={handleFiltersChange}
              /> */}
              <OverviewFilters
                filters={aiPerformanceData?.filters?.options}
                searchPlaceholder={
                  aiPerformanceData?.filters?.searchPlaceholder
                }
                onFiltersChange={handleFiltersChange}
              />

              {/* Metrics: acceptance rate, edit/accept ratio, regen per output, time to generate */}
              <OutputMetricsCards data={aiPerformanceData?.outputMetrics} />

              {/* Prompt Performance: success rate + latency trend */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <PromptSuccessChart data={aiPerformanceData?.promptSuccess} />
                <LatencyTrendChart data={aiPerformanceData?.latencyTrend} />
              </div>

              {/* Prompt Performance: regenerations + output quality signals */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <RegenerationsList data={aiPerformanceData?.regenerations} />
                <AiFeedbackBarChart data={aiPerformanceData?.aiFeedback} />
              </div>

              {/* Prompt Performance: completion rate */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <CompletionRateChart data={aiPerformanceData?.completionRate} />
              </div>

              {/* Logs: AI errors + timeouts */}
              <AILogsSection data={aiPerformanceData?.aiLogs} />

              {/* Alerts: failure spikes + latency issues */}
              <AIAlertsSection data={aiPerformanceData?.aiAlerts} />

              <PredictiveSignalsSection
                data={aiPerformanceData?.predictiveSignals}
              />

              <DriftAlertsGrid data={aiPerformanceData?.driftAlerts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
