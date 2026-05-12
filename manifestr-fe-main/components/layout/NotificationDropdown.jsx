import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Settings, ArrowRight, LucideBell, BellDot, BellDotIcon, BellElectric } from 'lucide-react'
import api from '../../lib/api'

export default function NotificationDropdown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
    // Also fetch unread count on mount
    fetchUnreadCount()
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/notifications', {
        params: { limit: 50 }
      })
      
      if (response.data.status === 'success') {
        // Map backend format to frontend format
        const mappedNotifications = response.data.data.notifications.map(n => ({
          id: n.id,
          status: n.priority, // 'critical', 'important', 'normal'
          unread: !n.is_read,
          timestamp: formatTimestamp(n.created_at),
          title: n.title,
          message: n.message,
          actionUrl: n.action_url,
          actionText: n.action_text,
        }))
        setNotifications(mappedNotifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      // Keep empty array on error
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count')
      if (response.data.status === 'success') {
        setUnreadCount(response.data.data.count)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await api.post('/api/notifications/mark-read', {
        notificationIds: [notificationId]
      })
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, unread: false } : n
      ))
      fetchUnreadCount() // Refresh badge count
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.post('/api/notifications/mark-all-read')
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const dismissNotification = async (notificationId) => {
    try {
      // Change priority to normal (for dismiss action)
      await api.post('/api/notifications/change-priority', {
        notificationIds: [notificationId],
        priority: 'normal'
      })
      // Update local state - change priority to normal
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, status: 'normal' } : n
      ))
    } catch (error) {
      console.error('Failed to dismiss notification:', error)
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // Calculate tab counts from real data
  const allCount = notifications.length
  const unreadCountTab = notifications.filter(n => n.unread).length
  const criticalCount = notifications.filter(n => n.status === 'critical').length
  const importantCount = notifications.filter(n => n.status === 'important').length
  const normalCount = notifications.filter(n => n.status === 'normal').length

  const tabs = [
    { id: 'all', label: 'All', count: allCount },
    { id: 'unread', label: 'Unread', count: unreadCountTab },
    { id: 'critical', label: 'Critical', count: criticalCount },
    { id: 'important', label: 'Important', count: importantCount },
    { id: 'normal', label: 'Normal', count: normalCount },
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
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-md p-3 transition-colors cursor-pointer relative"
      >
        <Bell className="w-5 h-5 text-[#71717A]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#18181b] rounded-full" />
        )}
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
              className="absolute right-0 top-[calc(100%+12px)] w-[498px] bg-[#ffffff] rounded-xl shadow-lg border border-[#e4e4e7] z-50 overflow-hidden"
            >
            <div className="max-h-[calc(100vh-100px)] flex flex-col">
              {/* Header */}
              
                <div className="flex items-center justify-between px-4 pt-4 pb-4 ">
                  <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    All Notifications
                  </h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={markAllAsRead}
                      className="text-[14px] leading-[20px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer"
                    >
                      Mark as read
                    </button>
                    <button className="hover:bg-[#f4f4f5] rounded-md p-1.5 transition-colors cursor-pointer">
                      <Settings className="w-4 h-4 text-[#18181b]" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto px-4 pt-4 pb-4 border-b border-t border-[#e4e4e7]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex justify-center items-center gap-[var(--spacing-2,8px)] shrink-0 font-medium transition-colors cursor-pointer text-[12px] leading-[16px] border border-[var(--base-border,#E4E4E7)] rounded-[var(--border-radius-md,6px)] bg-[var(--base-background,#FFF)] h-[var(--height-h-9,36px)] px-[var(--spacing-3,12px)] py-[var(--spacing-2,8px)] ${
                        activeTab === tab.id
                          ? 'bg-[#18181b] text-[#18181b] font-semibold'
                          : 'text-[#71717a] hover:text-[#18181b]'
                     
                      }`}
                 
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
             

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-[#71717a]">Loading notifications...</div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="w-12 h-12 text-[#e4e4e7] mb-3" />
                    <p className="text-[#71717a] text-[14px]">No notifications yet</p>
                    <p className="text-[#a1a1aa] text-[12px] mt-1">
                      You'll see updates about collaboration, wins, and threads here
                    </p>
                  </div>
                ) : (
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
                            onMarkAsRead={markAsRead}
                            onDismiss={dismissNotification}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white border-t border-[#e4e4e7] flex items-center justify-between">
                <span className="text-[14px] leading-[20px] text-[#71717a]">
                 <span className='text-[#18181b]'>{unreadCount}</span> new alerts
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/notifications')
                  }}
                  className="flex justify-center items-center gap-[11.875px] px-[11px] py-[6px] rounded-[8px] border border-[#D1D5DC] bg-white text-[14px] leading-[20px] text-[#18181b] font-medium hover:opacity-80 transition-opacity cursor-pointer"
             
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
function NotificationCard({ notification, onMarkAsRead, onDismiss }) {
  const router = useRouter()

  const handleOpen = () => {
    // Mark as read when opened
    if (notification.unread) {
      onMarkAsRead(notification.id)
    }
    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const handleMarkRead = (e) => {
    e.stopPropagation() // Prevent card click
    onMarkAsRead(notification.id)
  }

  const handleDismiss = (e) => {
    e.stopPropagation() // Prevent card click
    onDismiss(notification.id)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-[#D4183D] text-white'
      case 'important':
        return 'bg-[#18181b] text-white'
      default:
        return 'bg-[#ECEEF2] text-[#030213]'
    }
  }


  let svg_critcal =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M14.4866 12.0015L9.15329 2.66812C9.037 2.46292 8.86836 2.29224 8.66457 2.1735C8.46078 2.05475 8.22915 1.99219 7.99329 1.99219C7.75743 1.99219 7.52579 2.05475 7.322 2.1735C7.11822 2.29224 6.94958 2.46292 6.83329 2.66812L1.49995 12.0015C1.38241 12.205 1.32077 12.4361 1.32129 12.6711C1.32181 12.9062 1.38447 13.137 1.50292 13.34C1.62136 13.5431 1.79138 13.7112 1.99575 13.8273C2.20011 13.9435 2.43156 14.0036 2.66662 14.0015H13.3333C13.5672 14.0012 13.797 13.9394 13.9995 13.8223C14.202 13.7052 14.3701 13.5368 14.487 13.3342C14.6038 13.1315 14.6653 12.9017 14.6653 12.6678C14.6652 12.4338 14.6036 12.204 14.4866 12.0015Z" stroke="#FB2C36" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 6V8.66667" stroke="#FB2C36" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 11.3359H8.00667" stroke="#FB2C36" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`; 

let svg_important =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_9327_437281)">
    <path d="M7.99967 14.6693C11.6816 14.6693 14.6663 11.6845 14.6663 8.0026C14.6663 4.32071 11.6816 1.33594 7.99967 1.33594C4.31778 1.33594 1.33301 4.32071 1.33301 8.0026C1.33301 11.6845 4.31778 14.6693 7.99967 14.6693Z" stroke="#FF6900" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 5.33594V8.0026" stroke="#FF6900" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 10.6641H8.00667" stroke="#FF6900" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_9327_437281">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`; 

let svg_normal =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_9327_437237)">
    <path d="M7.99967 14.6693C11.6816 14.6693 14.6663 11.6845 14.6663 8.0026C14.6663 4.32071 11.6816 1.33594 7.99967 1.33594C4.31778 1.33594 1.33301 4.32071 1.33301 8.0026C1.33301 11.6845 4.31778 14.6693 7.99967 14.6693Z" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_9327_437237">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`; 


  const getStatusSVG = (status) => {
    switch (status) {
      case 'critical':
        return svg_critcal
      case 'important':
        return svg_important
      default:
        return svg_normal
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`border-b border-[#e4e4e7] p-4${notification.unread ? ' border-l-1 border-l-black' : ''}`}
 
    >
      <div className="flex items-start gap-5">
    
      <div
        className="w-2 h-2 mt-2 shrink-0"
        dangerouslySetInnerHTML={{ __html: getStatusSVG(notification.status) }}
      />



        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] leading-[14px] font-medium ${getStatusColor(notification.status)}`}>
              {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
            </span>
            <span className="text-[12px] leading-[16px] text-[#71717a] flex gap-2">
              {notification.timestamp} {notification.unread ? <div className="w-1.5 h-1.5 bg-[#18181b] rounded-full mt-1 shrink-0" /> : <div className="w-2 shrink-0" />}

            </span>
          </div>

          <h3 className="text-[14px] leading-[20px] text-[#18181b] font-medium mb-3">
            {notification.title}
          </h3>
          {notification.message && (
            <p className="text-[12px] leading-[16px] text-[#71717a] mb-3">
              {notification.message}
            </p>
          )}
          <div className="flex items-center justify-between">
            {notification.unread && (
              <button 
                onClick={handleMarkRead}
                className="text-[12px] leading-[16px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer"
              >
                Mark read
              </button>
            )}
            <div className="flex items-center gap-4 ml-auto">
              <button 
                onClick={handleDismiss}
                className="text-[12px] leading-[16px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              {notification.actionUrl && (
                <button
                  onClick={handleOpen}
                  className="flex items-center justify-center h-[28px] px-[10px] gap-[6px] rounded-[8px] bg-[#101828] text-white text-[12px] leading-[16px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {notification.actionText || 'Open'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

