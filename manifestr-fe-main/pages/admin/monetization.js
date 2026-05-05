import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import MonetizationHeader from "../../components/admin/monetization/MonetizationHeader";
import RevenueStatCard from "../../components/admin/monetization/RevenueStatCard";
import FunnelCard from "../../components/admin/monetization/FunnelCard";
import RevenueTrendChart from "../../components/admin/monetization/RevenueTrendChart";
import RevenueByPlanChart from "../../components/admin/monetization/RevenueByPlanChart";
import ExportUsageByPlan from "../../components/admin/monetization/ExportUsageByPlan";
import PaywallEvents from "../../components/admin/monetization/PaywallEvents";
import TopRevenueUsersTable from "../../components/admin/monetization/TopRevenueUsersTable";

import { getAdminMonetizationData } from "../../services/admin/monetization";

function SectionLabel({ children }) {
  return (
    <div className="pt-2">
      <p className="text-[12px] font-semibold uppercase text-[#71717a]">
        {children}
      </p>
    </div>
  );
}

export default function AdminMonetization() {
  const [monetizationData, setMonetizationData] = useState(null);
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
      getAdminMonetizationData()
        .then((data) => {
          if (!data) setError(true);
          else setMonetizationData(data);
        })
        .catch(() => setError(true));
    }
  }, [user]);

  if (loading ) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load data</div>;
  }
  return (
    <>
      <Head>
        <title>Monetization - Admin</title>
      </Head>

      <div className="admin-card-theme min-h-screen bg-white">
        <AdminHeader />
        <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="flex-1 min-w-0 flex flex-col">
            <MonetizationHeader
              title={monetizationData?.header?.title}
              subtitle={monetizationData?.header?.subtitle}
              filters={monetizationData?.filters}
            />

            <div className="relative z-0 flex-1 flex flex-col gap-4 px-4 py-4 bg-white lg:gap-6 lg:px-8 lg:py-6">
              {/* Core Revenue Metrics */}
              <SectionLabel>Core Revenue Metrics</SectionLabel>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
                <RevenueStatCard data={monetizationData?.totalRevenue} />
                <RevenueStatCard data={monetizationData?.mrr} />
                <RevenueStatCard data={monetizationData?.arr} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
                <RevenueStatCard data={monetizationData?.freeToPaid} />
                <RevenueStatCard data={monetizationData?.upgradeRate} />
                <RevenueStatCard data={monetizationData?.downgradeRate} />
              </div>

              {/* Revenue Trend Chart */}
              <SectionLabel>Revenue Trend</SectionLabel>
              <RevenueTrendChart data={monetizationData?.revenueTrend} />

              {/* Revenue by Plan + Conversion Funnel */}
              <SectionLabel>Plan Breakdown & Conversion</SectionLabel>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <RevenueByPlanChart data={monetizationData?.revenueByPlan} />
                <div className="min-w-0 flex-1 lg:min-w-0">
                  <FunnelCard data={monetizationData?.conversionFunnel} />
                </div>
              </div>

              {/* Export Usage + Paywall Events */}
              <SectionLabel>Export & Paywall</SectionLabel>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[18px]">
                <ExportUsageByPlan data={monetizationData?.exportUsageByPlan} />
                <PaywallEvents data={monetizationData?.paywallEvents} />
              </div>

              {/* Top Users by Revenue */}
              <SectionLabel>Top Users by Revenue</SectionLabel>
              <TopRevenueUsersTable data={monetizationData?.topRevenueUsers} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


