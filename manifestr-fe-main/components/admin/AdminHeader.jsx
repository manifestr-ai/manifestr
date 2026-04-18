import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Search, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../logo/Logo'
import { normalizeUrl } from '../../utils/url'

// Token values read from Figma MCP (node 11426:44391)
// base/background : #ffffff
// base/border     : #e4e4e7
// base/foreground : #18181b
// base/muted-foreground : #71717a
// border-radius/md : 6px
// spacing/8 (h-padding) : 32px
// spacing/4 (action gap) : 16px
// spacing/24 (search→actions gap) : 96px

function AdminAvatar({ user }) {
  const profileImageUrl = normalizeUrl(user?.profile_image_url)
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <div className="relative shrink-0 w-10 h-10 rounded-full border border-black/8 overflow-hidden bg-[#e4e4e7] flex items-center justify-center">
      {profileImageUrl ? (
        <Image
          src={profileImageUrl}
          alt="Admin avatar"
          fill
          className="object-cover"
        />
      ) : (
        <span className="text-[14px] font-semibold text-[#18181b] leading-none">
          {initials}
        </span>
      )}
    </div>
  )
}

export default function AdminHeader() {
  const { user } = useAuth()
  const [searchValue, setSearchValue] = useState('')

  return (
    // bg: base/background #ffffff  |  border-b: base/border #e4e4e7  |  h: 72px
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e4e4e7]">
      {/* Container: max-w-[1376px], px spacing/8 = 32px, h-[72px] */}
      <div className="flex h-[72px] items-center justify-between px-8 w-full max-w-[1440px] mx-auto">

        {/* Left — Logo */}
        <Link href="/admin/overview" className="shrink-0 flex items-center">
          <Logo size="sm" />
        </Link>

        {/* Right — Search + gap-[96px] + Actions + Avatar */}
        <div className="flex items-center gap-[96px]">

          {/* Search input: w-320, bg #ffffff, border #e4e4e7, rounded-md 6px, px-3 py-2 */}
          <div className="w-[320px]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[#e4e4e7] bg-white">
              {/* Search icon: 20×20, color: base/muted-foreground #71717a */}
              <Search className="w-5 h-5 shrink-0 text-[#71717a]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-[16px] leading-6 font-normal text-[#18181b] placeholder:text-[#71717a]"
              />
            </div>
          </div>

          {/* Actions + Avatar: gap-[16px] between each element */}
          <div className="flex items-center gap-4">

            {/* Settings: bg #ffffff, p-3, rounded-[6px], icon 20×20 color #18181b */}
            <button
              type="button"
              className="p-3 rounded-[6px] bg-white hover:bg-[#f4f4f5] transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-[#71717a]" strokeWidth={1.5} />
            </button>

            {/* Bell: same treatment */}
            <button
              type="button"
              className="p-3 rounded-[6px] bg-white hover:bg-[#f4f4f5] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#71717a]" strokeWidth={1.5} />
            </button>

            {/* Avatar: 40×40, border rgba(0,0,0,0.08) */}
            <AdminAvatar user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
