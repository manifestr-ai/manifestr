import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Settings, ArrowRight, LucideBell, BellDot, BellDotIcon, BellElectric } from 'lucide-react'

export default function NotificationDropdown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const dropdownRef = useRef(null)

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      status: 'critical',
      unread: true,
      timestamp: '2 hours ago',
      title: 'Approval required: Q4 Marketing Campaign Deck',
    },
    {
      id: 2,
      status: 'critical',
      unread: true,
      timestamp: '30 minutes ago',
      title: 'Due Today: Shiseido Brand Guidelines Review',
    },
    {
      id: 3,
      status: 'critical',
      unread: true,
      timestamp: '4 hours ago',
      title: 'Multi-stage approval: Annual Report Design',
    },
    {
      id: 4,
      status: 'critical',
      unread: true,
      timestamp: '5 hours ago',
      title: 'Due Tomorrow: Client Presentation Prep',
    },
  ]

  const tabs = [
    { id: 'all', label: 'All', count: 8 },
    { id: 'unread', label: 'Unread', count: 5 },
    { id: 'critical', label: 'Critical', count: 6 },
    { id: 'important', label: 'Important', count: 5 },
  ]

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
    ? notifications.filter(n => n.unread)
    : notifications.filter(n => n.status === activeTab)

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-md p-3 transition-colors cursor-pointer relative"
      >
        <Bell className="w-5 h-5 text-[#71717A]" />
        {/* {notifications.filter(n => n.unread).length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#18181b] rounded-full" />
        )} */}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-[calc(100%+12px)] w-[420px] bg-[#F9FAFB] rounded-xl shadow-lg border border-[#e4e4e7] z-50 overflow-hidden"
            >
            <div className="max-h-[calc(100vh-100px)] flex flex-col">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 bg-white border-b border-[#e4e4e7]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    All Notifications
                  </h2>
                  <div className="flex items-center gap-4">
                    <button className="text-[14px] leading-[20px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer">
                      Mark as read
                    </button>
                    <button className="hover:bg-[#f4f4f5] rounded-md p-1.5 transition-colors cursor-pointer">
                      <Settings className="w-4 h-4 text-[#18181b]" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-md text-[12px] leading-[16px] font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-[#18181b] text-white'
                          : 'bg-transparent text-[#71717a] hover:text-[#18181b]'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <NotificationCard
                          notification={notification}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white border-t border-[#e4e4e7] flex items-center justify-between">
                <span className="text-[14px] leading-[20px] text-[#71717a]">
                  5 new alerts
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/notifications')
                  }}
                  className="flex items-center gap-1 text-[14px] leading-[20px] text-[#18181b] font-medium hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Open Center
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Notification Card Component
function NotificationCard({ notification }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-[#18181b] text-white'
      case 'important':
        return 'bg-[#52525b] text-white'
      default:
        return 'bg-[#e4e4e7] text-[#18181b]'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl border border-[#e4e4e7] p-4"
    >
      <div className="flex items-start gap-3">
        {/* Unread Indicator */}
        {notification.unread && (
          <div className="w-2 h-2 bg-[#18181b] rounded-full mt-2 shrink-0" />
        )}
        {!notification.unread && <div className="w-2 shrink-0" />}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] leading-[14px] font-medium ${getStatusColor(notification.status)}`}>
              {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
            </span>
            <span className="text-[12px] leading-[16px] text-[#71717a]">
              {notification.timestamp}
            </span>
          </div>
          <h3 className="text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
            {notification.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-[12px] leading-[16px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer">
                Mark read
              </button>
              <button className="text-[12px] leading-[16px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer">
                Dismiss
              </button>
            </div>
            <button className="px-4 py-1.5 bg-[#18181b] text-white text-[12px] leading-[16px] font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer">
              Open
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

