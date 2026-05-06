import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import Head from "next/head";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LifecycleHeader from "../../components/admin/lifecycle/LifecycleHeader";
import StatCard from "../../components/admin/overview/StatCard";
import LifecycleStagesChart from "../../components/admin/lifecycle/LifecycleStagesChart";
import UserSegmentsTable from "../../components/admin/lifecycle/UserSegmentsTable";

import { getAdminLifecycleData } from "../../services/admin/lifecycle";
import OverviewFilters from "../../components/admin/overview/OverviewFilters";
import { useAdminDashboardFilters } from "../../contexts/AdminDashboardFiltersContext";

export default function AdminLifecycle() {
  const { apiParams, applyFiltersChange, selections, search } =
    useAdminDashboardFilters();
  
  const [lifecycleData, setLifecycleData] = useState(null);
  const [lifecycleLoading, setLifecycleLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔐 Admin protection
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 📡 Fetch
  useEffect(() => {
    if (user?.is_admin) {
      fetchLifecycle();
    }
  }, [user?.is_admin, apiParams]);

  const fetchLifecycle = async () => {
    setLifecycleLoading(true);
    setError(false);
    try {
      const data = await getAdminLifecycleData(apiParams);
      if (!data) {
        setError(true);
      } else {
        setLifecycleData(data);
      }
    } catch {
      setError(true);
    } finally {
      setLifecycleLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load data</div>;

  if (user?.is_admin && (lifecycleLoading || lifecycleData == null)) {
    return (
      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />
          <div className="flex flex-1 items-center justify-center p-6 text-[#71717a]">
            Loading lifecycle…
          </div>
        </div>
      </div>
    );
  }

  const stats = lifecycleData?.stats || [];

  return (
    <>
      <Head>
        <title>User Lifecycle &amp; Segmentation - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto">
            <LifecycleHeader
              title={lifecycleData?.header?.title}
              subtitle={lifecycleData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              <OverviewFilters
                filters={lifecycleData?.filters?.options}
                searchPlaceholder={lifecycleData?.filters?.searchPlaceholder}
                selections={selections}
                search={search}
                onFiltersChange={applyFiltersChange}
              />

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

              <LifecycleStagesChart data={lifecycleData?.lifecycleStages} />

              <UserSegmentsTable data={lifecycleData?.segments} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
