import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ProductUsageHeader from "../../components/admin/product-usage/ProductUsageHeader";
import OverviewFilters from "../../components/admin/overview/OverviewFilters";
import StatCard from "../../components/admin/overview/StatCard";
import DecksPerUserChart from "../../components/admin/product-usage/DecksPerUserChart";
import TimeToFirstOutput from "../../components/admin/product-usage/TimeToFirstOutput";
import CategoryPieChart from "../../components/admin/product-usage/CategoryPieChart";
import RewritesVsAccepts from "../../components/admin/product-usage/RewritesVsAccepts";
import AiStyleSettingsUsage from "../../components/admin/product-usage/AiStyleSettingsUsage";
import SlideTimeHeatmap from "../../components/admin/product-usage/SlideTimeHeatmap";
import SlideDropoff from "../../components/admin/product-usage/SlideDropoff";
import SlideRewritesVsAccepts from "../../components/admin/product-usage/SlideRewritesVsAccepts";
import RewritesVsAcceptsFlows from "../../components/admin/product-usage/RewritesVsAcceptsFlows";
import BouncedDecks from "../../components/admin/product-usage/BouncedDecks";
import CompletionTime from "../../components/admin/product-usage/CompletionTime";
import ToolUsersGrid from "../../components/admin/product-usage/ToolUsersGrid";
import MostCommonJourneys from "../../components/admin/product-usage/MostCommonJourneys";
import TransitionDropoffsFunnel from "../../components/admin/product-usage/TransitionDropoffsFunnel";
import MultiToolUsage from "../../components/admin/product-usage/MultiToolUsage";
import ToolPairingMatrix from "../../components/admin/product-usage/ToolPairingMatrix";
import { getAdminProductUsageData } from "../../services/admin/product-usage";

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] leading-[16px] font-semibold tracking-[0.08em] uppercase text-[#71717a] pt-1 sm:text-[12px] sm:leading-[18px] sm:pt-2">
      {children}
    </p>
  );
}
// { productUsageData }
export default function AdminProductUsage() {
  const [productUsageData, setProductUsageData] = useState(null);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(false);

  const stats = productUsageData?.stats || [];
  const behaviourStats = productUsageData?.behaviourStats || [];
  const journeyModes = productUsageData?.journeyModes || {};
  const journeyModeOptions = journeyModes?.options || [
    { id: "editors", label: "Editors" },
    { id: "tools", label: "Tools" },
  ];
  const [selectedJourneyMode, setSelectedJourneyMode] = useState(
    journeyModes?.defaultMode || "tools",
  );
  const selectedJourneyData = journeyModes?.[selectedJourneyMode] || {};
  const isEditorsMode = selectedJourneyMode === "editors";
  const usageSectionLabel = isEditorsMode
    ? "Most Used Editors"
    : "Most Used Tools";
  const journeySectionLabel = isEditorsMode
    ? "Cross-Editor Journeys"
    : "Cross-Tool Journeys";

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      getAdminProductUsageData()
        .then((data) => {
          if (!data) setError(true);
          else setProductUsageData(data);
        })
        .catch(() => setError(true));
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load data</div>;
  return (
    <>
      <Head>
        <title>Product Usage &amp; Engagement - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto">
            <ProductUsageHeader
              title={productUsageData?.header?.title}
              subtitle={productUsageData?.header?.subtitle}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              <OverviewFilters
                filters={productUsageData?.filters?.options}
                searchPlaceholder={productUsageData?.filters?.searchPlaceholder}
              />

              {/* ── Core Metrics ── */}
              <SectionLabel>Core Metrics</SectionLabel>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-[18px]">
                {stats.map((s) => (
                  <StatCard key={s.id || s.title} {...s} neutralBadge />
                ))}
              </div>

              {/* Usage trend charts */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <DecksPerUserChart data={productUsageData?.decksPerUser} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <TimeToFirstOutput
                    data={productUsageData?.timeToFirstOutput}
                  />
                </div>
              </div>

              {/* Session Frequency + Session Duration */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <DecksPerUserChart
                    data={productUsageData?.sessionFrequency}
                  />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <DecksPerUserChart data={productUsageData?.sessionDuration} />
                </div>
              </div>

              {/* ── Behaviour Tracking ── */}
              <SectionLabel>Behaviour Tracking</SectionLabel>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-[18px]">
                {behaviourStats.map((s) => (
                  <StatCard key={s.id || s.title} {...s} neutralBadge />
                ))}
              </div>

              {/* Accept vs Edit (Rewrites vs Accepts) + Most Used Document Types (Slide Types) */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <RewritesVsAccepts
                    data={productUsageData?.rewritesVsAccepts}
                  />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <CategoryPieChart data={productUsageData?.slideTypes} />
                </div>
              </div>

              {/* Export Types + AI Style Settings */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <CategoryPieChart data={productUsageData?.exportTypes} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <AiStyleSettingsUsage
                    data={productUsageData?.aiStyleSettingsUsage}
                  />
                </div>
              </div>

              <SlideTimeHeatmap data={productUsageData?.slideTimeHeatmap} />

              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <SlideDropoff data={productUsageData?.slideDropoff} />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <SlideRewritesVsAccepts
                    data={productUsageData?.slideRewritesVsAccepts}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-[1.75]">
                  <RewritesVsAcceptsFlows
                    data={productUsageData?.rewritesVsAcceptsFlows}
                  />
                </div>
                <div className="w-full min-w-0 lg:w-[355px] lg:shrink-0">
                  <BouncedDecks data={productUsageData?.bouncedDecks} />
                </div>
              </div>

              <CompletionTime data={productUsageData?.completionTime} />

              <div className="w-full">
                <div className="inline-flex items-center rounded-[10px] border border-[#e4e4e7] bg-white p-1">
                  {journeyModeOptions.map((option) => {
                    const isActive = selectedJourneyMode === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedJourneyMode(option.id)}
                        className={`h-8 rounded-[8px] px-4 text-[14px] leading-5 transition-colors ${
                          isActive
                            ? "bg-[#18181b] font-medium text-white"
                            : "font-normal text-[#52525b] hover:bg-[#f4f4f5]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <SectionLabel>{usageSectionLabel}</SectionLabel>
              <ToolUsersGrid
                data={
                  selectedJourneyData?.toolUsers || productUsageData?.toolUsers
                }
              />

              <SectionLabel>{journeySectionLabel}</SectionLabel>

              <MostCommonJourneys
                data={
                  selectedJourneyData?.mostCommonJourneys ||
                  productUsageData?.mostCommonJourneys
                }
              />

              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <div className="w-full min-w-0 lg:flex-1">
                  <TransitionDropoffsFunnel
                    data={
                      selectedJourneyData?.transitionDropoffsFunnel ||
                      productUsageData?.transitionDropoffsFunnel
                    }
                  />
                </div>
                <div className="w-full min-w-0 lg:flex-1">
                  <MultiToolUsage
                    data={
                      selectedJourneyData?.multiToolUsage ||
                      productUsageData?.multiToolUsage
                    }
                  />
                </div>
              </div>

              <ToolPairingMatrix
                data={
                  selectedJourneyData?.toolPairingMatrix ||
                  productUsageData?.toolPairingMatrix
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
