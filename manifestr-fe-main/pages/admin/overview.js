import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import Head from "next/head";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import OverviewHeader from "../../components/admin/overview/OverviewHeader";
import OverviewFilters from "../../components/admin/overview/OverviewFilters";
import StatCard from "../../components/admin/overview/StatCard";
import DauMauTrend from "../../components/admin/overview/DauMauTrend";
import MrrArrTrend from "../../components/admin/overview/MrrArrTrend";
import ConversionFunnel from "../../components/admin/overview/ConversionFunnel";
import RecentActivityFeed from "../../components/admin/overview/RecentActivityFeed";
import AlertsFeed from "../../components/admin/overview/AlertsFeed";

import { getAdminOverviewData } from "../../services/admin/overview";
import { useAdminDashboardFilters } from "../../contexts/AdminDashboardFiltersContext";

export default function AdminOverview() {
  const { apiParams, applyFiltersChange, selections, search } =
    useAdminDashboardFilters();
  const [overviewData, setOverviewData] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔐 Protect route (admin only)
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 📡 Fetch data
  useEffect(() => {
    if (user?.is_admin) {
      fetchOverview()
    }
  }, [user?.is_admin, apiParams]);

  const fetchOverview = async () => {
    setOverviewLoading(true);
    setError(false);
    try {
      const data = await getAdminOverviewData(apiParams);

      if (!data) {
        setError(true);
      } else {
        setOverviewData(data);
      }
    } catch {
      setError(true);
    } finally {
      setOverviewLoading(false);
    }
  };

  // UI States
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load data</div>;
  }

  if (user?.is_admin && (overviewLoading || overviewData == null)) {
    return (
      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />
          <div className="flex flex-1 items-center justify-center p-6 text-[#71717a]">
            Loading overview…
          </div>
        </div>
      </div>
    );
  }

  // if (!overviewData) {
  //   return <div className="p-6">No data available</div>
  // }

  // Safe flatten
  const statCards = Array.isArray(overviewData?.statRows)
    ? overviewData.statRows.flat()
    : [];
  return (
    <>
      <Head>
        <title>Executive Overview - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <OverviewHeader
              title={overviewData?.header?.title}
              subtitle={overviewData?.header?.subtitle}
            />

            <div className="flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              {/* Filters */}
              <OverviewFilters
                filters={overviewData?.filters?.options}
                searchPlaceholder={overviewData?.filters?.searchPlaceholder}
                selections={selections}
                search={search}
                onFiltersChange={applyFiltersChange}
              />

              {/* KPI metrics — 2 per row mobile, 3 per row desktop */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-[18px]">
                {statCards.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
              </div>

              {/* Charts Row: User Growth + Conversion Funnel */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <DauMauTrend data={overviewData?.userGrowth} />
                <ConversionFunnel data={overviewData?.conversionFunnel} />
              </div>

              {/* Charts + Feed Row: Revenue Trend + Recent Activity */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <MrrArrTrend data={overviewData?.revenueTrend} />
                <RecentActivityFeed data={overviewData?.recentActivity} />
              </div>

              {/* Alerts */}
              <AlertsFeed data={overviewData?.alerts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
