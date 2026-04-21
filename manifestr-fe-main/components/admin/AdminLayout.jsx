import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <AdminHeader />
      {/* Offset for sticky 72px header */}
      <div className="flex min-h-[calc(100vh-72px)]">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {title && (
            <div className="mb-6">
              <h1 className="text-[28px] leading-9 font-semibold text-base-foreground">{title}</h1>
            </div>
          )}
          <div className="rounded-xl border border-base-border bg-white p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
