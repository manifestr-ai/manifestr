import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import Head from "next/head";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import RetentionHeader from "../../components/admin/retention/RetentionHeader";
import OverviewFilters from "../../components/admin/overview/OverviewFilters";
import StatCard from "../../components/admin/overview/StatCard";
import CohortRetentionTable from "../../components/admin/retention/CohortRetentionTable";
import TrendLineChart from "../../components/admin/retention/TrendLineChart";
import RevenueRetentionStats from "../../components/admin/retention/RevenueRetentionStats";
import ChurnAnalysisBreakdown from "../../components/admin/retention/ChurnAnalysisBreakdown";
import ChurnBreakdownChart from "../../components/admin/retention/ChurnBreakdownChart";

import { getAdminRetentionData } from "../../services/admin/retention";

export default function AdminRetention() {
  const [retentionData, setRetentionData] = useState(null);
  const [error, setError] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔐 Admin protection
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 📡 Fetch data (client-side → token works)
  useEffect(() => {
    if (user?.is_admin) {
      getAdminRetentionData()
        .then((data) => {
          if (!data) setError(true);
          else setRetentionData(data);
        })
        .catch(() => setError(true));
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Failed to load data</div>

  const stats = retentionData?.stats || [];

  return (
    <>
      <Head>
        <title>Retention &amp; Churn - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <RetentionHeader
              title={retentionData?.header?.title}
              subtitle={retentionData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              {/* Filters */}
              <OverviewFilters
                filters={retentionData?.filters?.options}
                searchPlaceholder={retentionData?.filters?.searchPlaceholder}
              />

              {/* KPI — 2×2 mobile, one row on lg */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
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

              {/* Cohort Retention Heatmap (1D / 7D / 30D) */}
              <CohortRetentionTable data={retentionData?.cohortRetention} />

              {/* Retention Curve + Churn Trend */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <TrendLineChart
                    key="retention-curve"
                    data={retentionData?.retentionCurve}
                  />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <TrendLineChart
                    key="churn-trend"
                    data={retentionData?.churnRateTrend}
                  />
                </div>
              </div>

              {/* Revenue Retention: NRR · GRR · Expansion · Contraction */}
              <RevenueRetentionStats data={retentionData?.revenueRetention} />

              {/* NRR / GRR Trend + Churn Reasons */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <TrendLineChart
                    key="nrr-grr-trend"
                    data={retentionData?.nrrGrrTrend}
                  />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <ChurnBreakdownChart data={retentionData?.churnReasons} />
                </div>
              </div>

              {/* Churn Analysis: By Plan · By Segment · By Source */}
              <ChurnAnalysisBreakdown data={retentionData?.churnAnalysis} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


