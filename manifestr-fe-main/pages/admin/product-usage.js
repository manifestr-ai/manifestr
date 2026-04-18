import Head from 'next/head'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import ProductUsageHeader from '../../components/admin/product-usage/ProductUsageHeader'
import OverviewFilters from '../../components/admin/overview/OverviewFilters'
import StatCard from '../../components/admin/overview/StatCard'
import DecksPerUserChart from '../../components/admin/product-usage/DecksPerUserChart'
import TimeToFirstOutput from '../../components/admin/product-usage/TimeToFirstOutput'
import CategoryPieChart from '../../components/admin/product-usage/CategoryPieChart'
import RewritesVsAccepts from '../../components/admin/product-usage/RewritesVsAccepts'
import AiStyleSettingsUsage from '../../components/admin/product-usage/AiStyleSettingsUsage'
import { getAdminProductUsageData } from '../../services/admin/product-usage'

export default function AdminProductUsage({ productUsageData }) {
  const stats = productUsageData?.stats || []

  return (
    <>
      <Head>
        <title>Product Usage &amp; Engagement - Admin</title>
      </Head>

      <div className="min-h-screen bg-[#f4f4f5]">
        <AdminHeader />
        <div className="flex h-[calc(100vh-72px)]">
          <AdminSidebar />

          <div className="no-scrollbar flex-1 min-w-0 h-[calc(100vh-72px)] overflow-y-auto flex flex-col">
            <ProductUsageHeader
              title={productUsageData?.header?.title}
              subtitle={productUsageData?.header?.subtitle}
            />

            <div className="flex-1 flex flex-col gap-6 px-8 py-6 bg-[#f4f4f5]">
              <OverviewFilters
                filters={productUsageData?.filters?.options}
                searchPlaceholder={productUsageData?.filters?.searchPlaceholder}
              />

              <div className="flex gap-[18px]">
                {stats.map((s) => (
                  <StatCard key={s.title} {...s} neutralBadge />
                ))}
              </div>

              <div className="flex gap-[18px]">
                <DecksPerUserChart data={productUsageData?.decksPerUser} />
                <TimeToFirstOutput data={productUsageData?.timeToFirstOutput} />
              </div>

              <div className="flex gap-[18px] items-stretch">
                <CategoryPieChart data={productUsageData?.slideTypes} />
                <RewritesVsAccepts data={productUsageData?.rewritesVsAccepts} />
              </div>

              <div className="flex gap-[18px] items-stretch">
                <CategoryPieChart data={productUsageData?.exportTypes} />
                <AiStyleSettingsUsage data={productUsageData?.aiStyleSettingsUsage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const productUsageData = await getAdminProductUsageData(query)

  return {
    props: {
      productUsageData,
    },
  }
}
