import Head from 'next/head'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'
import { ADMIN_GROUPED_ITEMS, ADMIN_PRIMARY_ITEMS } from '../../components/admin/adminNavigation'

const ALL_ITEMS = [...ADMIN_PRIMARY_ITEMS, ...ADMIN_GROUPED_ITEMS.flatMap((group) => group.items)]

function getTitleFromSection(section) {
  const current = ALL_ITEMS.find((item) => item.href === `/admin/${section}`)
  return current?.label || 'Admin'
}

export default function AdminSectionPage() {
  const router = useRouter()
  const section = router.query.section
  const pageTitle = typeof section === 'string' ? getTitleFromSection(section) : 'Admin'

  return (
    <>
      <Head>
        <title>{`${pageTitle} - Admin`}</title>
      </Head>
      <AdminLayout title={pageTitle}>
        <p className="text-base-muted-foreground text-[16px] leading-6">
          This is the <span className="font-semibold text-base-foreground">{pageTitle}</span> screen.
        </p>
      </AdminLayout>
    </>
  )
}
