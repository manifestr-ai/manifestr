import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from '../../contexts/SidebarContext'
import {
  Clock, Star, FileText, Users, Archive, Trash2, ChevronDown, Check,
  Folder, MessageSquare, Bell, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react'

export default function CollabHubSidebar() {
  const router = useRouter()
  const currentPath = router.pathname
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const showVaultSidebar = isSidebarOpen('vault')

  // Vault section items
  const vaultItems = [
    { id: 'my-work', label: 'My Work', icon: Clock, href: '/collab-hub/vault/my-work' },
    { id: 'pinned', label: 'Pinned', icon: Star, href: '/collab-hub/vault/pinned' },
    { id: 'shared', label: 'Shared', icon: Users, href: '/collab-hub/vault/shared' },
    { id: 'archived', label: 'Archived', icon: Archive, href: '/collab-hub/vault/archived' },
  ]

  // Collabs section items
  const collabsItems = [
    { id: 'active', label: 'Active', icon: Folder, badge: '11', href: '/collab-hub/active' },
    { id: 'archived-completed', label: 'Archived / Completed', icon: CheckCircle2, href: '/collab-hub/archived-completed' },
    { id: 'team-members', label: 'Team members', icon: Users, href: '/collab-hub/team-members' },
    { id: 'threads', label: 'Threads', icon: MessageSquare, badge: '16', href: '/collab-hub/threads' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: '11', href: '/collab-hub/chat' },
  ]

  // Notify section items
  const notifyItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '7', href: '/collab-hub/notifications' },
    { id: 'awaiting-review', label: 'Awaiting Review', icon: Clock, badge: '4', href: '/collab-hub/awaiting-review' },
    { id: 'pending-approval', label: 'Pending Approval', icon: AlertCircle, badge: '2', href: '/collab-hub/pending-approval' },
  ]

  const isActive = (href) => {
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <div className="w-[273px] bg-white border-r border-[#e4e4e7] h-full flex flex-col overflow-y-auto">
      <div className="p-3">
        {/* THE VAULT Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <div
              onClick={() => toggleSidebar('vault')}
              className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2.5 h-[48px] flex items-center justify-between cursor-pointer hover:bg-[#f4f4f5] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#18181b]" />
                </div>
                <span className="text-[12px] font-bold leading-[18px] text-[#18181b] tracking-[0.6px] uppercase">
                  the vault
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showVaultSidebar ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </motion.div>

        {/* Vault Items (shown when vault sidebar is toggled) */}
        <AnimatePresence>
          {showVaultSidebar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="space-y-0">
                {vaultItems.map((item, index) => {
                  const Icon = item.icon
                  const itemIsActive = isActive(item.href)

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <Link href={item.href}>
                        <motion.div
                          whileHover={{ backgroundColor: '#f4f4f5' }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full h-[48px] px-3 py-2.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${itemIsActive ? 'bg-[#f4f4f5]' : ''
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-4 h-4 text-[#18181b]" />}
                            <span className={`text-[14px] leading-[21px] ${itemIsActive ? 'font-medium text-[#18181b]' : 'text-[#18181b]'
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLLABS Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="mb-2">
            <div className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2.5 h-[48px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#18181b]" />
                </div>
                <span className="text-[12px] font-bold leading-[18px] text-[#18181b] tracking-[0.6px] uppercase">
                  Collabs
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#71717a]" />
            </div>
          </div>

          <div className="space-y-0">
            {collabsItems.map((item, index) => {
              const Icon = item.icon
              const itemIsActive = isActive(item.href)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full h-[48px] px-3 py-2.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${itemIsActive ? 'bg-[#f4f4f5]' : ''
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-[#18181b]" />}
                        <span className={`text-[14px] leading-[21px] ${itemIsActive ? 'font-medium text-[#18181b]' : 'text-[#18181b]'
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
        </motion.div>

        {/* NOTIFY Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="mb-2">
            <div className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2.5 h-[48px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-[#18181b]" />
                </div>
                <span className="text-[12px] font-bold leading-[18px] text-[#18181b] tracking-[0.6px] uppercase">
                  Notify
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#71717a]" />
            </div>
          </div>

          <div className="space-y-0">
            {notifyItems.map((item, index) => {
              const Icon = item.icon
              const itemIsActive = isActive(item.href)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full h-[48px] px-3 py-2.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${itemIsActive ? 'bg-[#f4f4f5]' : ''
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-[#18181b]" />}
                        <span className={`text-[14px] leading-[21px] ${itemIsActive ? 'font-medium text-[#18181b]' : 'text-[#18181b]'
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
        </motion.div>

        {/* DELETED */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/collab-hub/deleted">
            <motion.div
              whileHover={{ backgroundColor: '#f4f4f5' }}
              whileTap={{ scale: 0.98 }}
              className={`w-full h-[48px] px-3 py-2.5 rounded-md flex items-center gap-2 transition-colors cursor-pointer ${isActive('/collab-hub/deleted') ? 'bg-[#f4f4f5]' : ''
                }`}
            >
              <Trash2 className="w-4 h-4 text-[#18181b]" />
              <span className={`text-[14px] leading-[21px] ${isActive('/collab-hub/deleted') ? 'font-medium text-[#18181b]' : 'text-[#18181b]'
                }`}>
                DELETED
              </span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

