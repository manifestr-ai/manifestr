import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Star, Sparkles, Share2, Archive, Trash2, ChevronDown, Folder } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'

export default function VaultSidebar() {
  const router = useRouter()
  const currentPath = router.pathname
  // const collabsHref = currentPath.startsWith('/collab-hub') ? '/collab-hub' : '/vault/collabs'
  const { openSidebar } = useSidebar()

  const sidebarItems = [
    { id: 'the-vault', label: 'the vault', icon: null, hasDropdown: true, badge: null, href: '/vault' },
    { id: 'recents', label: 'Recents', icon: FileText, hasDropdown: false, badge: null, href: '/vault/recents' },
    { id: 'pinned', label: 'Pinned', icon: Star, hasDropdown: false, badge: null, href: '/vault/pinned' },
    { id: 'prompts', label: 'Prompts in progress', icon: Sparkles, hasDropdown: false, badge: '31', href: '/vault/recents' },
    { id: 'collabs', label: 'Collabs', icon: Share2, hasDropdown: false, badge: null, href: '/collab-hub' },
    { id: 'archived', label: 'Archived / Completed', icon: Archive, hasDropdown: false, badge: null, href: '/vault/archived' },
    { id: 'deleted', label: 'DELETED.', icon: Trash2, hasDropdown: false, badge: null, href: '/vault/deleted' },
  ]

  const isActive = (href) => {
    if (href === '/vault') return currentPath === '/vault'
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <div className="w-[273px] bg-white border-r border-[#e4e4e7] h-full flex flex-col">
      <div className="p-3">
        {/* The Vault Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Link href="/vault">
              <div
                onClick={() => openSidebar('collabsFolder')}
                className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-md px-3 py-2.5 h-[48px] flex items-center justify-between cursor-pointer hover:bg-[#ededf0] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-[#18181b]" />
                  <Folder className="w-4 h-4 text-[#18181b]" />
                  <span className="text-[12px] font-bold leading-[18px] text-[#18181b] tracking-[0.6px] uppercase">
                    THE VAULT
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <div className="space-y-0">
          {sidebarItems.slice(1).map((item, index) => {
            const Icon = item.icon
            const itemIsActive = isActive(item.href)
            const isDeleted = item.id === 'deleted'

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ backgroundColor: isDeleted && itemIsActive ? '#191919' : '#f4f4f5' }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-[48px] px-3 py-2.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${isDeleted && itemIsActive
                      ? 'bg-[#191919]'
                      : itemIsActive
                        ? 'bg-[#f4f4f5]'
                        : ''
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <Icon className={`w-4 h-4 ${isDeleted && itemIsActive ? 'text-white' : 'text-[#18181b]'
                          }`} />
                      )}
                      <span className={`text-[14px] leading-[21px] ${isDeleted && itemIsActive
                        ? 'font-bold text-white tracking-[-0.1504px]'
                        : itemIsActive
                          ? 'font-medium text-[#18181b]'
                          : 'text-[#18181b]'
                        }`}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-[#f4f4f5] border border-[#e4e4e7] rounded-md text-[12px] font-medium leading-[20px] text-[#18181b]">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
