import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  Bell,
  Search,
  Settings,
  Menu,
  X,
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
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../logo/Logo'
import { normalizeUrl } from '../../utils/url'
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

function AdminAvatar({ user, size = 'lg' }) {
  const profileImageUrl = normalizeUrl(user?.profile_image_url)
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email?.[0]?.toUpperCase() || 'A'

  const dim = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-10 h-10 text-[14px]'

  return (
    <div className={`relative shrink-0 ${dim} rounded-full border border-black/8 overflow-hidden bg-[#e4e4e7] flex items-center justify-center`}>
      {profileImageUrl ? (
        <Image src={profileImageUrl} alt="User avatar" fill className="object-cover" />
      ) : (
        <span className={`font-semibold text-[#18181b] leading-none`}>{initials}</span>
      )}
    </div>
  )
}

/* ── Mobile drawer nav item ─────────────────────────────────── */
function DrawerNavItem({ item, active, onClose }) {
  const Icon = ICON_MAP[item.icon] || LayoutDashboard
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[6px] transition-colors w-full ${
        active
          ? 'border border-[#e4e4e7] bg-[#f4f4f5] text-[#18181b]'
          : 'border border-transparent hover:bg-[#f4f4f5] text-[#52525b]'
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} color={active ? '#18181b' : '#71717a'} />
      <span className="text-[15px] leading-6 font-semibold whitespace-nowrap" style={{ color: active ? '#18181b' : '#52525b' }}>
        {item.label}
      </span>
    </Link>
  )
}

/* ── Mobile drawer ──────────────────────────────────────────── */
function MobileDrawer({ open, onClose, user }) {
  const router = useRouter()
  const currentPath = router.asPath.split('?')[0]
  const isActive = (href) =>
    currentPath === href || (href === '/admin/overview' && currentPath === '/admin')

  // Close on route change
  useEffect(() => {
    if (open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#e4e4e7] shrink-0">
          <Link href="/admin/overview" onClick={onClose} className="flex items-center">
            <Logo size="sm" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-[6px] hover:bg-[#f4f4f5] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#71717a]" strokeWidth={1.75} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {ADMIN_PRIMARY_ITEMS.map((item) => (
            <DrawerNavItem key={item.href} item={item} active={isActive(item.href)} onClose={onClose} />
          ))}

          {ADMIN_GROUPED_ITEMS.map((group) => (
            <div key={group.heading} className="flex flex-col gap-1 mt-2">
              <div className="px-3 pt-2 pb-1">
                <p className="text-[11px] leading-[18px] font-semibold text-[#a1a1aa] uppercase tracking-wide">
                  {group.heading}
                </p>
              </div>
              {group.items.map((item) => (
                <DrawerNavItem key={item.href} item={item} active={isActive(item.href)} onClose={onClose} />
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e4e4e7] px-4 py-4">
          <button
            type="button"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-[6px] hover:bg-[#f4f4f5] transition-colors text-[#52525b]"
          >
            <Settings className="w-5 h-5" strokeWidth={1.75} color="#71717a" />
            <span className="text-[15px] font-semibold">Settings</span>
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Main header ────────────────────────────────────────────── */
export default function AdminHeader() {
  const { user } = useAuth()
  const [searchValue, setSearchValue] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const searchRef = useRef(null)

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e4e4e7]">
        <div className="flex items-center justify-between w-full max-w-[1376px] mx-auto
          h-16 px-4
          lg:h-[72px] lg:px-8"
        >
          {/* ── LEFT ─────────────────────────────────────────── */}
          <div className="flex items-center gap-0 lg:gap-0">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden -ml-1 mr-3 p-2 rounded-[6px] hover:bg-[#f4f4f5] transition-colors shrink-0"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="w-5 h-5 text-[#18181b]" strokeWidth={1.75} />
            </button>

            {/* Logo */}
            <Link href="/admin/overview" className="shrink-0 flex items-center lg:-ml-16">
              <span className="block lg:hidden">
                <Logo size="sm" />
              </span>
              <span className="hidden lg:block">
                <Logo size="md" />
              </span>
            </Link>
          </div>

          {/* ── RIGHT ────────────────────────────────────────── */}
          <div className="flex items-center gap-3 lg:gap-4">

            {/* Search — desktop only */}
            <div className="hidden lg:block w-[301px]">
              <div className="flex items-center gap-2 h-10 rounded-[8px] border border-[#e2e4e9] bg-[#f4f4f4] pl-[10px] pr-2 py-2 shadow-[0px_1px_2px_rgba(228,229,231,0.24)]">
                <Search className="w-5 h-5 shrink-0 text-[#868c98]" strokeWidth={1.75} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent outline-none text-[14px] leading-5 font-normal text-[#18181b] placeholder:text-[#868c98]"
                />
              </div>
            </div>

            {/* Actions + Avatar */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Settings */}
              <button
                type="button"
                className="hidden lg:flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#e2e4e9] bg-white shadow-[0px_1px_2px_rgba(82,88,102,0.06)] hover:bg-[#f4f4f5] transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-[#525866]" strokeWidth={1.75} />
              </button>

              {/* Bell */}
              <button
                type="button"
                className="h-9 w-9 flex items-center justify-center rounded-[8px] border border-[#e2e4e9] bg-white shadow-[0px_1px_2px_rgba(82,88,102,0.06)] hover:bg-[#f4f4f5] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#525866]" strokeWidth={1.75} />
              </button>

              {/* Avatar — sm (24px) on mobile, lg (40px) on desktop */}
              <div className="lg:hidden">
                <AdminAvatar user={user} size="sm" />
              </div>
              <div className="hidden lg:block">
                <AdminAvatar user={user} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} />
    </>
  )
}
