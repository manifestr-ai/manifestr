import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react'
import AppHeader from '../components/layout/AppHeader'
import Button from '../components/ui/Button'
import {
  dismissNotification,
  fetchNotificationCounts,
  fetchNotifications,
  getNotificationTimeAgo,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notifications'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'approvals', label: 'Approvals', countKey: 'approvals' },
  { id: 'due-soon', label: 'Due Soon', countKey: 'dueSoon' },
  { id: 'mentions', label: 'Mentions', countKey: 'mentions' },
  { id: 'access', label: 'Access', countKey: 'access' },
  { id: 'system', label: 'System', countKey: 'system' },
]

const categoryIcons = {
  approvals: ShieldCheck,
  'due-soon': Clock,
  mentions: MessageSquare,
  access: User,
  system: Settings,
}

export default function Notifications() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [priority, setPriority] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [notifications, setNotifications] = useState([])
  const [counts, setCounts] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = {
        limit: 100,
        category: activeTab === 'all' ? undefined : activeTab,
        severity: priority === 'all' ? undefined : priority,
        status: status === 'all' ? undefined : status,
      }

      const [items, nextCounts] = await Promise.all([
        fetchNotifications(params),
        fetchNotificationCounts(),
      ])

      setNotifications(items)
      setCounts(nextCounts)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, priority, status])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const visibleNotifications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return notifications

    return notifications.filter((notification) => {
      return [
        notification.title,
        notification.body,
        notification.type,
        notification.category,
        notification.severity,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [notifications, query])

  const handleOpen = async (notification) => {
    if (!notification.read_at) {
      await markNotificationRead(notification.id)
    }

    router.push(notification.action_url || '/notifications')
  }

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(notificationId)
    await loadNotifications()
  }

  const handleDismiss = async (notificationId) => {
    await dismissNotification(notificationId)
    await loadNotifications()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    await loadNotifications()
  }

  return (
    <>
      <Head>
        <title>Notifications | Manifestr</title>
      </Head>
      <div className="min-h-screen bg-[#f7f7f8]">
        <AppHeader />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <section className="bg-white rounded-2xl border border-[#e4e4e7] p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#18181b] text-white flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-[24px] font-semibold leading-[32px] text-[#18181b]">
                        Notification Center
                      </h1>
                      <p className="text-[14px] leading-[20px] text-[#71717a]">
                        Track collab invites, thread assignments, replies, and access updates.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
                    Mark all read
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => router.push('/settings')}>
                    Preferences
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                <SummaryCard label="All" value={counts.all || 0} />
                <SummaryCard label="Unread" value={counts.unread || 0} />
                <SummaryCard label="Critical" value={counts.critical || 0} tone="red" />
                <SummaryCard label="Important" value={counts.important || 0} tone="dark" />
                <SummaryCard label="Normal" value={counts.normal || 0} />
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#e4e4e7]">
              <div className="p-4 border-b border-[#e4e4e7] flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`h-9 px-3 rounded-md border text-[13px] font-medium whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-[#18181b] text-white border-[#18181b]'
                          : 'bg-white text-[#52525b] border-[#e4e4e7] hover:text-[#18181b]'
                      }`}
                    >
                      {tab.label}
                      {tab.countKey ? ` (${counts[tab.countKey] || 0})` : ` (${counts.all || 0})`}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search notifications..."
                      className="h-9 pl-9 pr-3 rounded-md border border-[#e4e4e7] text-[13px] outline-none focus:border-[#18181b]"
                    />
                  </div>
                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="h-9 px-3 rounded-md border border-[#e4e4e7] text-[13px] outline-none bg-white"
                  >
                    <option value="all">All priority</option>
                    <option value="critical">Critical</option>
                    <option value="important">Important</option>
                    <option value="normal">Normal</option>
                  </select>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-9 px-3 rounded-md border border-[#e4e4e7] text-[13px] outline-none bg-white"
                  >
                    <option value="all">All status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>

              <div className="p-4">
                {isLoading ? (
                  <EmptyState title="Loading notifications..." />
                ) : visibleNotifications.length === 0 ? (
                  <EmptyState title="No notifications found" description="New collab and thread activity will appear here." />
                ) : (
                  <div className="space-y-3">
                    {visibleNotifications.map((notification, index) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        index={index}
                        onDismiss={handleDismiss}
                        onMarkRead={handleMarkRead}
                        onOpen={handleOpen}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

function SummaryCard({ label, value, tone = 'light' }) {
  const classes = {
    light: 'bg-[#f4f4f5] text-[#18181b]',
    red: 'bg-[#fef2f2] text-[#dc2626]',
    dark: 'bg-[#18181b] text-white',
  }

  return (
    <div className={`rounded-xl p-4 ${classes[tone]}`}>
      <p className="text-[12px] leading-[16px] opacity-70">{label}</p>
      <p className="text-[24px] leading-[32px] font-semibold">{value}</p>
    </div>
  )
}

function EmptyState({ title, description }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <Bell className="w-10 h-10 text-[#a1a1aa] mb-3" />
      <p className="text-[15px] font-medium text-[#18181b]">{title}</p>
      {description && <p className="text-[13px] text-[#71717a] mt-1">{description}</p>}
    </div>
  )
}

function NotificationCard({ notification, index, onDismiss, onMarkRead, onOpen }) {
  const Icon = categoryIcons[notification.category] || Bell
  const isUnread = !notification.read_at
  const isCritical = notification.severity === 'critical'
  const isImportant = notification.severity === 'important'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`rounded-xl border p-5 bg-white hover:shadow-sm transition-shadow ${
        isUnread ? 'border-[#18181b]' : 'border-[#e4e4e7]'
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isCritical ? 'bg-[#fef2f2] text-[#dc2626]' : isImportant ? 'bg-[#18181b] text-white' : 'bg-[#f4f4f5] text-[#52525b]'
          }`}
        >
          {isCritical ? <AlertTriangle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] leading-[16px] uppercase tracking-wide text-[#71717a]">
              {notification.category || 'system'}
            </span>
            <span className="text-[11px] leading-[16px] px-2 py-0.5 rounded-full bg-[#f4f4f5] text-[#52525b]">
              {notification.severity || 'normal'}
            </span>
            {isUnread && <span className="text-[11px] leading-[16px] px-2 py-0.5 rounded-full bg-[#18181b] text-white">Unread</span>}
            <span className="text-[12px] leading-[16px] text-[#71717a]">
              {getNotificationTimeAgo(notification.created_at)}
            </span>
          </div>
          <h3 className="text-[16px] leading-[24px] font-semibold text-[#18181b]">
            {notification.title}
          </h3>
          {notification.body && (
            <p className="text-[14px] leading-[20px] text-[#52525b] mt-1">
              {notification.body}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button variant="primary" size="sm" onClick={() => onOpen(notification)}>
              Open
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onMarkRead(notification.id)}
              disabled={!isUnread}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Mark read
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onDismiss(notification.id)}>
              <XCircle className="w-4 h-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
