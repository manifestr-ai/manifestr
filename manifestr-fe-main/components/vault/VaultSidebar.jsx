import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Star, Sparkles, Share2, Archive, Trash2, ChevronDown } from 'lucide-react'
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
    { id: 'prompts', label: 'Prompts in progress', icon: Sparkles, hasDropdown: false, badge: '31', href: '/vault/prompts' },
    { id: 'collabs', label: 'Collabs', icon: Share2, hasDropdown: false, badge: null, href: '/vault/collabs' },
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
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                    <path d="M2.84505 6.63546L3.55599 5.26098C3.63328 5.10749 3.75084 4.97789 3.89611 4.88606C4.04137 4.79422 4.20887 4.74361 4.38068 4.73963H9.48047M9.48047 4.73963C9.62528 4.73937 9.76822 4.7723 9.89833 4.83588C10.0284 4.89946 10.1422 4.99201 10.231 5.10641C10.3198 5.22081 10.3812 5.35404 10.4105 5.49585C10.4397 5.63767 10.4362 5.78431 10.3999 5.92452L9.67005 8.76827C9.61724 8.97282 9.49763 9.15386 9.33019 9.28266C9.16274 9.41146 8.95708 9.48064 8.74583 9.47921H1.89714C1.64573 9.47921 1.40463 9.37934 1.22686 9.20157C1.04909 9.0238 0.949219 8.7827 0.949219 8.5313V2.36984C0.949219 2.11843 1.04909 1.87733 1.22686 1.69956C1.40463 1.52179 1.64573 1.42192 1.89714 1.42192H3.74557C3.90411 1.42037 4.0605 1.4586 4.20043 1.53312C4.34036 1.60764 4.45937 1.71607 4.54656 1.84848L4.93047 2.41723C5.01678 2.5483 5.13428 2.65588 5.27243 2.73033C5.41058 2.80478 5.56505 2.84377 5.72198 2.8438H8.53255C8.78396 2.8438 9.02506 2.94367 9.20283 3.12143C9.3806 3.2992 9.48047 3.54031 9.48047 3.79171V4.73963Z" stroke="currentColor" strokeWidth="0.947917" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-[48px] px-3 py-2.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                      isDeleted && itemIsActive
                        ? 'bg-[#191919] hover:bg-[#191919]'
                        : itemIsActive
                          ? 'bg-[#f4f4f5] hover:bg-[#f4f4f5]'
                          : 'hover:bg-[#f4f4f5]'
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
