import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Settings, ArrowRight, AlertTriangle, CircleAlert, Circle } from 'lucide-react'
import {
  dismissNotification,
  fetchNotificationCounts,
  fetchNotifications,
  getNotificationTimeAgo,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/notifications'

export default function NotificationDropdown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [counts, setCounts] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const [items, nextCounts] = await Promise.all([
        fetchNotifications({ limit: 20 }),
        fetchNotificationCounts(),
      ])
      setNotifications(items)
      setCounts(nextCounts)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, loadNotifications])

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

  const tabs = [
    { id: 'all', label: 'All', count: counts.all || 0 },
    { id: 'unread', label: 'Unread', count: counts.unread || 0 },
    { id: 'critical', label: 'Critical', count: counts.critical || 0 },
    { id: 'important', label: 'Important', count: counts.important || 0 },
    { id: 'normal', label: 'Normal', count: counts.normal || 0 },
  ]

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.read_at
    return notification.severity === activeTab
  })

  const refreshAfterAction = async () => {
    await loadNotifications()
  }

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(notificationId)
    await refreshAfterAction()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    await refreshAfterAction()
  }

  const handleDismiss = async (notificationId) => {
    await dismissNotification(notificationId)
    await refreshAfterAction()
  }

  const handleOpen = async (notification) => {
    if (!notification.read_at) {
      await markNotificationRead(notification.id)
    }

    setIsOpen(false)
    router.push(notification.action_url || '/notifications')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-md p-3 transition-colors cursor-pointer relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[#71717A]" />
        {(counts.unread || 0) > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#18181b] rounded-full" />
        )}
      </motion.button>

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
              className="absolute right-0 top-[calc(100%+12px)] w-[498px] bg-white rounded-xl shadow-lg border border-[#e4e4e7] z-50 overflow-hidden"
            >
              <div className="max-h-[calc(100vh-100px)] flex flex-col">
                <div className="flex items-center justify-between px-4 pt-4 pb-4">
                  <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    All Notifications
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[14px] leading-[20px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer"
                    >
                      Mark as read
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        router.push('/settings')
                      }}
                      className="hover:bg-[#f4f4f5] rounded-md p-1.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#18181b]" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto px-4 pt-4 pb-4 border-b border-t border-[#e4e4e7]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex justify-center items-center gap-2 shrink-0 font-medium transition-colors cursor-pointer text-[12px] leading-[16px] border border-[#E4E4E7] rounded-[6px] h-[36px] px-3 py-2 ${
                        activeTab === tab.id
                          ? 'bg-[#18181b] text-white'
                          : 'bg-white text-[#71717a] hover:text-[#18181b]'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto min-h-[220px]">
                  {isLoading ? (
                    <div className="p-6 text-[14px] text-[#71717a]">Loading notifications...</div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="p-6 text-[14px] text-[#71717a]">No notifications yet.</div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {filteredNotifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                          >
                            <NotificationCard
                              notification={notification}
                              onDismiss={handleDismiss}
                              onMarkRead={handleMarkRead}
                              onOpen={handleOpen}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-white border-t border-[#e4e4e7] flex items-center justify-between">
                  <span className="text-[14px] leading-[20px] text-[#71717a]">
                    <span className="text-[#18181b]">{counts.unread || 0}</span> new alerts
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

function NotificationCard({ notification, onDismiss, onMarkRead, onOpen }) {
  const status = notification.severity || 'normal'

  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-[#D4183D] text-white'
      case 'important':
        return 'bg-[#18181b] text-white'
      default:
        return 'bg-[#ECEEF2] text-[#030213]'
    }
  }

  const StatusIcon = status === 'critical' ? AlertTriangle : status === 'important' ? CircleAlert : Circle

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`border-b border-[#e4e4e7] p-4${!notification.read_at ? ' border-l-2 border-l-black' : ''}`}
    >
      <div className="flex items-start gap-5">
        <StatusIcon
          className={`w-4 h-4 mt-1 shrink-0 ${
            status === 'critical' ? 'text-[#FB2C36]' : status === 'important' ? 'text-[#FF6900]' : 'text-[#99A1AF]'
          }`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] leading-[14px] font-medium ${getStatusColor()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-[12px] leading-[16px] text-[#71717a] flex gap-2">
              {getNotificationTimeAgo(notification.created_at)}
              {!notification.read_at && <span className="w-1.5 h-1.5 bg-[#18181b] rounded-full mt-1 shrink-0" />}
            </span>
          </div>

          <h3 className="text-[14px] leading-[20px] text-[#18181b] font-medium mb-1">
            {notification.title}
          </h3>
          {notification.body && (
            <p className="text-[12px] leading-[16px] text-[#71717a] mb-3 line-clamp-2">
              {notification.body}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onMarkRead(notification.id)}
              disabled={Boolean(notification.read_at)}
              className="text-[12px] leading-[16px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              Mark read
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onDismiss(notification.id)}
                className="text-[12px] leading-[16px] text-[#52525b] hover:text-[#18181b] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => onOpen(notification)}
                className="flex items-center justify-center h-[28px] px-[10px] gap-[6px] rounded-[8px] bg-[#101828] text-white text-[12px] leading-[16px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
