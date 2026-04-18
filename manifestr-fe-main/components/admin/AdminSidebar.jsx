import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  BarChart3,
  Brain,
  LayoutDashboard,
  Puzzle,
  RefreshCw,
  ShoppingCart,
  Signal,
  Users,
  Workflow,
} from 'lucide-react'
import { ADMIN_GROUPED_ITEMS, ADMIN_PRIMARY_ITEMS } from './adminNavigation'

const ICON_MAP = {
  barChart3: BarChart3,
  brain: Brain,
  layoutDashboard: LayoutDashboard,
  puzzle: Puzzle,
  refreshCw: RefreshCw,
  shoppingCart: ShoppingCart,
  signal: Signal,
  users: Users,
  workflow: Workflow,
}

function SidebarItem({ item, active = false }) {
  const Icon = ICON_MAP[item.icon] || LayoutDashboard

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2 rounded-[6px] transition-colors self-stretch w-full ${
        active
          ? 'border border-[#e4e4e7] bg-[#f4f4f5] text-[#18181b]'
          : 'border border-transparent bg-white hover:bg-[#f4f4f5]'
      }`}
    >
      <Icon
        className="h-5 w-5 shrink-0"
        strokeWidth={1.75}
        color={active ? '#18181b' : '#71717a'}
      />
      <span
        className="text-[16px] leading-6 font-semibold whitespace-nowrap"
        style={{ color: active ? '#18181b' : '#52525b' }}
      >
        {item.label}
      </span>
    </Link>
  )
}

export default function AdminSidebar() {
  const router = useRouter()
  const currentPath = router.asPath.split('?')[0]

  const isActive = (href) =>
    currentPath === href || (href === '/admin/overview' && currentPath === '/admin')

  return (
    <aside
      className="no-scrollbar w-[274px] h-[calc(100vh-72px)] max-h-[calc(100vh-72px)] sticky top-[72px] self-start bg-white border-r border-[#e4e4e7] overflow-y-auto"
    >
      <div className="px-4 pt-8 pb-6">
        <nav className="flex flex-col gap-2">
          {ADMIN_PRIMARY_ITEMS.map((item) => (
            <SidebarItem key={item.href} item={item} active={isActive(item.href)} />
          ))}

          {ADMIN_GROUPED_ITEMS.map((group) => (
            <div key={group.heading} className="flex flex-col gap-2">
              <div className="px-3 pt-2">
                <p className="text-[12px] leading-[18px] font-semibold text-[#71717a] whitespace-nowrap">
                  {group.heading}
                </p>
              </div>
              {group.items.map((item) => (
                <SidebarItem key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
