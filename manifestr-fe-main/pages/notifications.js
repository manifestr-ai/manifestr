import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Settings,
  Clock,
  AlertTriangle,
  User,
  Lock,
  MessageSquare,
  Calendar,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Bell,
} from 'lucide-react'
import AppHeader from '../components/layout/AppHeader'
import Button from '../components/ui/Button'
import api from '../lib/api'

export default function Notifications() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [priority, setPriority] = useState('all')
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/notifications', {
        params: { limit: 100 }
      })
      
      if (response.data.status === 'success') {
        const mappedNotifications = response.data.data.notifications.map(n => ({
          id: n.id,
          type: mapNotificationType(n.type),
          priority: n.priority,
          title: n.title,
          description: n.message,
          timestamp: formatTimestamp(n.created_at),
          createdAt: n.created_at, // Keep original date for grouping
          unread: !n.is_read,
          actionUrl: n.action_url,
          actionText: n.action_text,
          actorName: n.actor_name,
          actorAvatar: n.actor_avatar,
          metadata: n.metadata,
          icon: getIconForType(n.type),
          tags: getTagsForNotification(n),
          actions: getActionsForNotification(n),
        }))
        setNotifications(mappedNotifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Map backend notification types to UI categories
  const mapNotificationType = (backendType) => {
    if (backendType.includes('collab')) return 'collaboration'
    if (backendType.includes('thread') || backendType.includes('mention')) return 'mention'
    if (backendType.includes('wins')) return 'system'
    if (backendType === 'document_shared') return 'access'
    return 'system'
  }

  // Get icon for notification type
  const getIconForType = (type) => {
    if (type.includes('collab')) return User
    if (type.includes('thread') || type.includes('mention')) return MessageSquare
    if (type.includes('wins')) return AlertTriangle
    if (type === 'document_shared') return Lock
    return Settings
  }

  // Get tags based on priority and status
  const getTagsForNotification = (n) => {
    const tags = []
    if (n.priority === 'critical') tags.push('High Priority')
    if (n.priority === 'important') tags.push('Important')
    if (!n.is_read) tags.push('Unread')
    return tags
  }

  // Get actions based on notification type
  const getActionsForNotification = (n) => {
    const actions = []
    if (n.action_url) {
      actions.push(n.action_text || 'Open')
    }
    if (!n.is_read) {
      actions.push('Mark as Read')
    }
    actions.push('Dismiss')
    return actions
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  // Calculate tab counts dynamically
  const allCount = notifications.length
  const unreadCount = notifications.filter(n => n.unread).length
  const collaborationCount = notifications.filter(n => n.type === 'collaboration').length
  const mentionCount = notifications.filter(n => n.type === 'mention').length
  const accessCount = notifications.filter(n => n.type === 'access').length
  const systemCount = notifications.filter(n => n.type === 'system').length
  const criticalCount = notifications.filter(n => n.priority === 'critical').length

  const tabs = [
    { id: 'all', label: 'All', badge: allCount },
    { id: 'unread', label: 'Unread', badge: unreadCount },
    { id: 'critical', label: 'Critical', badge: criticalCount },
    { id: 'collaboration', label: 'Collaboration', badge: collaborationCount },
    { id: 'mentions', label: 'Mentions', badge: mentionCount },
    { id: 'system', label: 'System', badge: systemCount },
  ]

  // Action handlers
  const markAsRead = async (notificationId) => {
    try {
      await api.post('/api/notifications/mark-read', {
        notificationIds: [notificationId]
      })
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, unread: false } : n
      ))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.post('/api/notifications/mark-all-read')
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const dismissNotification = async (notificationId) => {
    try {
      await api.post('/api/notifications/change-priority', {
        notificationIds: [notificationId],
        priority: 'normal'
      })
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, priority: 'normal' } : n
      ))
    } catch (error) {
      console.error('Failed to dismiss notification:', error)
    }
  }

  const archiveAll = async () => {
    try {
      const notificationIds = notifications.map(n => n.id)
      await api.post('/api/notifications/archive', {
        notificationIds
      })
      // Refresh notifications
      await fetchNotifications()
    } catch (error) {
      console.error('Failed to archive all:', error)
    }
  }

  const handleAction = async (notification, action) => {
    if (action === 'Mark as Read') {
      await markAsRead(notification.id)
    } else if (action === 'Dismiss') {
      await dismissNotification(notification.id)
    } else if (notification.actionUrl) {
      // Navigate to the action URL
      if (notification.unread) {
        await markAsRead(notification.id)
      }
      router.push(notification.actionUrl)
    }
  }

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getFilteredNotifications = () => {
    let filtered = notifications

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'unread') {
        filtered = filtered.filter(n => n.unread)
      } else if (activeTab === 'critical') {
        filtered = filtered.filter(n => n.priority === 'critical')
      } else {
        filtered = filtered.filter(n => n.type === activeTab)
      }
    }

    // Filter by priority
    if (priority !== 'all') {
      filtered = filtered.filter(n => n.priority === priority)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.description?.toLowerCase().includes(query) ||
        n.actorName?.toLowerCase().includes(query)
      )
    }

    return filtered
  }

  // Group notifications by time
  const groupNotificationsByTime = (notifications) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    }

    notifications.forEach(notification => {
      const createdAt = new Date(notification.createdAt)
      
      if (createdAt >= today) {
        groups.today.push(notification)
      } else if (createdAt >= yesterday) {
        groups.yesterday.push(notification)
      } else if (createdAt >= thisWeek) {
        groups.thisWeek.push(notification)
      } else {
        groups.older.push(notification)
      }
    })

    return groups
  }

  const filteredNotifications = getFilteredNotifications()
  const groupedNotifications = groupNotificationsByTime(filteredNotifications)

  const NotificationCard = ({ notification, index }) => {
    const Icon = notification.icon
    const isExpanded = expandedItems.has(notification.id)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className={`bg-white rounded-xl border border-[#e4e4e7] p-6 mb-4 hover:shadow-md transition-shadow ${
          notification.unread ? 'border-l-4 border-l-[#18181b]' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#18181b]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[16px] font-semibold leading-[24px] text-[#18181b] pr-4">
                {notification.title}
              </h3>
              <button className="text-[#71717a] hover:text-[#18181b] transition-colors shrink-0">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Tags */}
            {notification.tags && notification.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {notification.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 text-[12px] leading-[16px] font-medium rounded ${
                      tag === 'High Priority' || tag === 'Critical'
                        ? 'bg-red-600 text-white'
                        : tag === 'Important'
                        ? 'bg-orange-600 text-white'
                        : tag === 'Unread'
                        ? 'bg-[#18181b] text-white'
                        : 'bg-[#f4f4f5] text-[#18181b]'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {notification.description && (
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-3">
                {notification.description}
              </p>
            )}

            {/* Actor Info */}
            {notification.actorName && (
              <p className="text-[12px] leading-[16px] text-[#71717a] mb-3">
                From: {notification.actorName}
              </p>
            )}

            {/* Timestamp */}
            <p className="text-[12px] leading-[16px] text-[#71717a] mb-3">
              {notification.timestamp}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {notification.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(notification, action)}
                  className={`px-3 py-1.5 text-[12px] leading-[16px] rounded-md transition-colors ${
                    action === notification.actionText || action === 'Open'
                      ? 'bg-[#18181b] text-white hover:opacity-90'
                      : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f5]'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <Head>
        <title>Notifications - Manifestr</title>
        <meta name="description" content="View and manage your notifications" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-[#f4f4f5] min-h-screen w-full flex flex-col">
        <AppHeader showRightActions={true} />
        <div className="h-[72px]" />

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-[48px] font-bold leading-[56px] tracking-[-0.96px] text-[#18181b] mb-2">
                Notify.
              </h1>
              <p className="text-[18px] leading-[28px] text-[#71717a] mb-6">

              {(() => {
                let user = null;
                try {
                  user = JSON.parse(localStorage.getItem('user'));
                } catch {}
                const name = user
                  ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email
                  : "User";
                return <>Welcome Back, {name}. Here's what's new in your Collabs.</>;
              })()}
               
              </p>

              {/* Tabs */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-[14px] leading-[20px] font-medium transition-colors shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-[#18181b] text-white'
                        : 'bg-white text-[#71717a] hover:text-[#18181b] border border-[#e4e4e7]'
                    }`}
                  >
                    {tab.label} ({tab.badge ?? 0})
                  </button>
                ))}
              </div>

              {/* Search and Actions */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#71717a]" />
                  <input
                    type="text"
                    placeholder="Search updates, people, or projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-[14px] leading-[20px] text-[#71717a] hover:text-[#18181b] transition-colors"
                  >
                    Mark all as read
                  </button>
                  <button 
                    onClick={archiveAll}
                    className="px-4 py-2 text-[14px] leading-[20px] text-[#71717a] hover:text-[#18181b] transition-colors"
                  >
                    Archive all
                  </button>
                  <button className="p-2 hover:bg-[#f4f4f5] rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-[#71717a]" />
                  </button>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-[20px] text-[#71717a]">Sort by:</span>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e4e4e7] rounded-lg text-[14px] leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
                    Recent
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-[20px] text-[#71717a]">Priority:</span>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e4e4e7] rounded-lg text-[14px] leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
                    All
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Notifications List */}
            <div className="space-y-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18181b] mb-4"></div>
                  <p className="text-[#71717a]">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell className="w-16 h-16 text-[#e4e4e7] mb-4" />
                  <h2 className="text-[20px] font-semibold text-[#18181b] mb-2">No notifications</h2>
                  <p className="text-[#71717a]">
                    {searchQuery 
                      ? 'No notifications match your search'
                      : activeTab === 'unread'
                      ? "You're all caught up!"
                      : 'You have no notifications in this category'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Today */}
                  {groupedNotifications.today.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-4">Today</h2>
                      <AnimatePresence>
                        {groupedNotifications.today.map((notification, index) => (
                          <NotificationCard key={notification.id} notification={notification} index={index} />
                        ))}
                      </AnimatePresence>
                    </motion.section>
                  )}

                  {/* Yesterday */}
                  {groupedNotifications.yesterday.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-4">Yesterday</h2>
                      <AnimatePresence>
                        {groupedNotifications.yesterday.map((notification, index) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            index={groupedNotifications.today.length + index}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.section>
                  )}

                  {/* This Week */}
                  {groupedNotifications.thisWeek.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-4">This Week</h2>
                      <AnimatePresence>
                        {groupedNotifications.thisWeek.map((notification, index) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            index={groupedNotifications.today.length + groupedNotifications.yesterday.length + index}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.section>
                  )}

                  {/* Older */}
                  {groupedNotifications.older.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h2 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-4">Older</h2>
                      <AnimatePresence>
                        {groupedNotifications.older.map((notification, index) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            index={groupedNotifications.today.length + groupedNotifications.yesterday.length + groupedNotifications.thisWeek.length + index}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.section>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

