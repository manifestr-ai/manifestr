import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";

import Head from "next/head";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import FeatureAdoptionHeader from "../../components/admin/feature-adoption/FeatureAdoptionHeader";
import AiPerformanceFilters from "../../components/admin/ai-performance/AiPerformanceFilters";
import StatCard from "../../components/admin/overview/StatCard";
import AdoptionFunnelChart from "../../components/admin/feature-adoption/AdoptionFunnelChart";
import FeatureAdoptionGrid from "../../components/admin/feature-adoption/FeatureAdoptionGrid";
import TopFeaturesTable from "../../components/admin/feature-adoption/TopFeaturesTable";
import PlanBreakdownChart from "../../components/admin/feature-adoption/PlanBreakdownChart";
import WorkspacesCreated from "../../components/admin/feature-adoption/WorkspacesCreated";
import MembersAdded from "../../components/admin/feature-adoption/MembersAdded";
import CommentsPerDocument from "../../components/admin/feature-adoption/CommentsPerDocument";
import SharedVsSoloUsage from "../../components/admin/feature-adoption/SharedVsSoloUsage";
import TopCollaborativeProjects from "../../components/admin/feature-adoption/TopCollaborativeProjects";
import TeamTable from "../../components/admin/feature-adoption/TeamTable";
import { getAdminFeatureAdoptionData } from "../../services/admin/feature-adoption";
import OverviewFilters from "../../components/admin/overview/OverviewFilters";
import { useAdminDashboardFilters } from "../../contexts/AdminDashboardFiltersContext";

function SectionLabel({ children }) {
  return (
    <div className="pt-1 sm:pt-2">
      <p className="text-[11px] leading-[16px] font-semibold tracking-[0.08em] uppercase text-[#71717a] sm:text-[12px] sm:leading-[18px]">
        {children}
      </p>
    </div>
  );
}

export default function AdminFeatureAdoption() {
  const { apiParams, applyFiltersChange, selections, search } =
    useAdminDashboardFilters();
  const [featureAdoptionData, setFeatureAdoptionData] = useState(null);
  const [error, setError] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchFeatureAdoption();
    }
  }, [user?.is_admin, apiParams]);

  const fetchFeatureAdoption = async () => {
    try {
      const data = await getAdminFeatureAdoptionData(apiParams);
      if (!data) {
        setError(true);
      } else {
        setFeatureAdoptionData(data);
      }
    } catch {
      setError(true);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load data</div>;
  }

  const stats = featureAdoptionData?.stats || [];

  return (
    <>
      <Head>
        <title>Feature Adaptation - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto">
            <FeatureAdoptionHeader
              title={featureAdoptionData?.header?.title}
              subtitle={featureAdoptionData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              {/* <AiPerformanceFilters
                searchPlaceholder={featureAdoptionData?.filters?.searchPlaceholder}
                options={featureAdoptionData?.filters?.options}
                onFiltersChange={handleFiltersChange}
              /> */}

              <OverviewFilters
                filters={featureAdoptionData?.filters?.options}
                searchPlaceholder={featureAdoptionData?.filters?.searchPlaceholder}
                selections={selections}
                search={search}
                onFiltersChange={applyFiltersChange}
              />

              {/* KPI: Adoption Stages */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
                {stats.map((s) => (
                  <StatCard
                    key={s.id || s.title}
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
              <FeatureAdoptionGrid
                data={featureAdoptionData?.featureAdoptionGrid}
              />

              {/* Feature Adoption Score Matrix */}
              <SectionLabel>Adoption Score Matrix</SectionLabel>
              <TopFeaturesTable data={featureAdoptionData?.topFeatures} />

              {/* Breakdowns */}
              <SectionLabel>Breakdowns</SectionLabel>
              <PlanBreakdownChart data={featureAdoptionData?.planBreakdown} />
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <PlanBreakdownChart
                    data={featureAdoptionData?.roleBreakdown}
                  />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <PlanBreakdownChart
                    data={featureAdoptionData?.regionBreakdown}
                  />
                </div>
              </div>

              {/* Collaboration Hub */}
              <SectionLabel>Collaboration Hub</SectionLabel>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <WorkspacesCreated
                    data={featureAdoptionData?.workspacesCreated}
                  />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <MembersAdded data={featureAdoptionData?.membersAdded} />
                </div>
              </div>

              <CommentsPerDocument
                data={featureAdoptionData?.commentsPerDocument}
              />

              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <SharedVsSoloUsage data={featureAdoptionData?.sharedVsSolo} />
                </div>
                <div className="w-full min-w-0 lg:flex-[1.4]">
                  <TopCollaborativeProjects
                    data={featureAdoptionData?.topCollaborativeProjects}
                  />
                </div>
              </div>

              <TeamTable data={featureAdoptionData?.team} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
