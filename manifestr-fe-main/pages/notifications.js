import React, { useState } from 'react'
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
} from 'lucide-react'
import AppHeader from '../components/layout/AppHeader'
import Button from '../components/ui/Button'

export default function Notifications() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [priority, setPriority] = useState('all')
  const [expandedItems, setExpandedItems] = useState(new Set())

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'approvals', label: 'Approvals', badge: 3 },
    { id: 'due-soon', label: 'Due Soon', badge: 5 },
    { id: 'mentions', label: 'Mentions' },
    { id: 'access', label: 'Access' },
    { id: 'system', label: 'System' },
  ]

  const notifications = {
    today: [
      {
        id: 1,
        type: 'approval',
        title: 'Approval required: Q4 Marketing Campaign Deck',
        description: 'Kate Morman',
        timestamp: '2 hours ago',
        actions: ['Decline', 'Approve'],
      },
      {
        id: 2,
        type: 'due-today',
        icon: Clock,
        title: 'Due Today: Shiseido Brand Guidelines Review',
        tags: ['Due Today', 'High Priority'],
        description: 'Critical review deadline is today at 5:00 PM.',
        progress: { completed: 4, total: 8 },
        details: {
          due: 'Due Nov 5, 2025 5:00 PM',
          estimated: '6h estimated',
          timestamp: '30 minutes ago',
        },
        assigned: 'You, Kate Morman, Design Team',
        dependencies: 2,
        actions: ['Mark Complete', 'Update Progress', 'Request Extension', 'View Details'],
      },
      {
        id: 3,
        type: 'approval',
        title: 'Multi-stage approval: Annual Report Design',
        description: 'Design Team',
        timestamp: '2 hours ago',
        actions: ['Decline', 'Approve'],
      },
      {
        id: 4,
        type: 'due-tomorrow',
        icon: Clock,
        title: 'Due Tomorrow: Client Presentation Prep',
        tags: ['Due Soon', 'High Priority'],
        description: 'Critical review deadline is today at 5:00 PM.',
        progress: { completed: 2, total: 5 },
        details: {
          due: 'Due Nov 5, 2025 5:00 PM',
          estimated: '6h estimated',
          timestamp: '5 hours ago',
        },
        assigned: 'You, Kate Morman, Design Team',
        dependencies: 2,
        actions: ['Mark Complete', 'Update Progress', 'View Details'],
      },
      {
        id: 5,
        type: 'access',
        icon: User,
        title: 'Access request: Q4 Strategy Document',
        tags: ['Medium Priority', 'High Priority'],
        description: 'Sarah Park is requesting editor access.',
        details: {
          requester: 'Sarah Park',
          timestamp: '6 hours ago',
        },
        actions: ['Grant Editor Access', 'Grant Viewer Access', 'Deny'],
      },
    ],
    yesterday: [
      {
        id: 6,
        type: 'approval',
        title: 'Approval required: Budget Allocation Sheet',
        description: 'Finance Team',
        timestamp: '2 hours ago',
        actions: ['Decline', 'Approve'],
      },
      {
        id: 7,
        type: 'overdue',
        icon: AlertTriangle,
        title: 'Overdue: Monthly Performance Report',
        tags: ['Due Today', 'High Priority'],
        description: 'Report submission was due 2 days ago.',
        progress: { completed: 5, total: 6 },
        details: {
          due: 'Due Nov 5, 2025 5:00 PM',
          estimated: '6h estimated',
          timestamp: '30 minutes ago',
        },
        assigned: 'You',
        actions: ['Submit Now', 'View Tasks', 'View Details'],
      },
      {
        id: 8,
        type: 'warning',
        icon: 'diamond',
        title: 'Low tokens warning',
        tags: ['Medium Priority'],
        description: 'You have 72 tokens remaining. Consider purchasing more to continue using premium features.',
        details: {
          timestamp: '6 hours ago',
        },
        actions: ['Buy Tokens', 'View Usage'],
      },
    ],
    thisWeek: [
      {
        id: 9,
        type: 'mention',
        icon: MessageSquare,
        title: 'Mention: You were tagged in Collab Hub',
        tags: ['Medium Priority'],
        description: 'Can you review the new branding guidelines?',
        details: {
          author: 'Sarah Park',
          timestamp: '2 days ago',
        },
        actions: ['Reply', 'View Comment'],
      },
      {
        id: 10,
        type: 'due-upcoming',
        icon: Calendar,
        title: 'Due in 3 days: Website Redesign Mockups',
        tags: ['Upcoming'],
        description: 'First draft mockups due for client review.',
        progress: { completed: 5, total: 6 },
        details: {
          due: 'Due Nov 5, 2025 5:00 PM',
          estimated: '6h estimated',
          timestamp: '30 minutes ago',
        },
        assigned: 'You',
        actions: ['Mark Complete', 'Update Progress', 'Request Extension', 'View Details'],
      },
      {
        id: 11,
        type: 'system',
        icon: Settings,
        title: 'System Update: New approval workflow features',
        tags: ['Medium Priority'],
        description: 'Version 2.5.0 includes enhanced approval tracking and deadline reminders.',
        details: {
          timestamp: '4 days ago',
        },
        actions: ['View Updates', 'Dismiss'],
      },
    ],
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
    const all = [...notifications.today, ...notifications.yesterday, ...notifications.thisWeek]
    if (activeTab === 'all') return all
    if (activeTab === 'approvals') return all.filter((n) => n.type === 'approval')
    if (activeTab === 'due-soon') return all.filter((n) => n.type.includes('due') || n.type === 'overdue')
    if (activeTab === 'mentions') return all.filter((n) => n.type === 'mention')
    if (activeTab === 'access') return all.filter((n) => n.type === 'access')
    if (activeTab === 'system') return all.filter((n) => n.type === 'system' || n.type === 'warning')
    return all
  }

  const NotificationCard = ({ notification, index }) => {
    const Icon = notification.icon
    const isExpanded = expandedItems.has(notification.id)
    const progressPercentage = notification.progress
      ? (notification.progress.completed / notification.progress.total) * 100
      : 0

    // Simple approval card layout
    if (notification.type === 'approval' && !notification.icon) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="bg-white rounded-xl border border-[#e4e4e7] p-6 mb-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-2">
                {notification.title}
              </h3>
              <p className="text-[14px] leading-[20px] text-[#71717a] mb-1">
                {notification.description}
              </p>
              <p className="text-[12px] leading-[16px] text-[#71717a]">
                {notification.timestamp}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button variant="secondary" size="sm">
                Decline
              </Button>
              <Button variant="primary" size="sm">
                Approve
              </Button>
            </div>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="bg-white rounded-xl border border-[#e4e4e7] p-6 mb-4 hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#18181b]" />
            </div>
          )}
          {notification.icon === 'diamond' && (
            <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] flex items-center justify-center shrink-0">
              <span className="text-[#18181b] text-xl">💎</span>
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
            {notification.tags && (
              <div className="flex flex-wrap gap-2 mb-3">
                {notification.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#18181b] text-white text-[12px] leading-[16px] font-medium rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-[14px] leading-[20px] text-[#71717a] mb-3">
              {notification.description}
            </p>

            {/* Progress Bar */}
            {notification.progress && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] leading-[16px] text-[#71717a]">
                    {notification.progress.completed} of {notification.progress.total} tasks completed
                  </span>
                </div>
                <div className="w-full h-2 bg-[#e4e4e7] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="h-full bg-[#18181b] rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Details */}
            {notification.details && (
              <div className="space-y-1 mb-3">
                {notification.details.due && (
                  <p className="text-[12px] leading-[16px] text-[#71717a]">{notification.details.due}</p>
                )}
                {notification.details.estimated && (
                  <p className="text-[12px] leading-[16px] text-[#71717a]">{notification.details.estimated}</p>
                )}
                {notification.details.requester && (
                  <p className="text-[12px] leading-[16px] text-[#71717a]">
                    {notification.details.requester} - {notification.details.timestamp}
                  </p>
                )}
                {notification.details.author && (
                  <p className="text-[12px] leading-[16px] text-[#71717a]">
                    {notification.details.author} - {notification.details.timestamp}
                  </p>
                )}
                {notification.details.timestamp && !notification.details.requester && !notification.details.author && (
                  <p className="text-[12px] leading-[16px] text-[#71717a]">{notification.details.timestamp}</p>
                )}
              </div>
            )}

            {/* Assigned */}
            {notification.assigned && (
              <p className="text-[12px] leading-[16px] text-[#71717a] mb-3">
                Assigned: {notification.assigned}
              </p>
            )}

            {/* Dependencies */}
            {notification.dependencies && (
              <button
                onClick={() => toggleExpand(notification.id)}
                className="text-[12px] leading-[16px] text-[#18181b] font-medium hover:opacity-80 transition-opacity mb-3"
              >
                Show dependencies ({notification.dependencies})
              </button>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {notification.actions.map((action, idx) => {
                if (action === 'Approve' || action === 'Decline') {
                  return (
                    <Button
                      key={idx}
                      variant={action === 'Approve' ? 'primary' : 'secondary'}
                      size="sm"
                      className="text-[12px]"
                    >
                      {action}
                    </Button>
                  )
                }
                return (
                  <button
                    key={idx}
                    className="px-3 py-1.5 text-[12px] leading-[16px] text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f5] rounded-md transition-colors"
                  >
                    {action}
                  </button>
                )
              })}
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
                    className={`px-4 py-2 rounded-lg text-[14px] leading-[20px] font-medium transition-colors shrink-0 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-[#18181b] text-white'
                        : 'bg-white text-[#71717a] hover:text-[#18181b] border border-[#e4e4e7]'
                    }`}
                  >
                    {tab.label}
                    {tab.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[12px] leading-[16px] font-medium ${
                          activeTab === tab.id
                            ? 'bg-white/20 text-white'
                            : 'bg-[#f4f4f5] text-[#71717a]'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
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
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-[14px] leading-[20px] text-[#71717a] hover:text-[#18181b] transition-colors">
                    Mark all as read
                  </button>
                  <button className="px-4 py-2 text-[14px] leading-[20px] text-[#71717a] hover:text-[#18181b] transition-colors">
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
              {/* Today */}
              {notifications.today.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-4">Today</h2>
                  <AnimatePresence>
                    {notifications.today.map((notification, index) => (
                      <NotificationCard key={notification.id} notification={notification} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.section>
              )}

              {/* Yesterday */}
              {notifications.yesterday.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-4">Yesterday</h2>
                  <AnimatePresence>
                    {notifications.yesterday.map((notification, index) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        index={notifications.today.length + index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.section>
              )}

              {/* This Week */}
              {notifications.thisWeek.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-4">This Week</h2>
                  <AnimatePresence>
                    {notifications.thisWeek.map((notification, index) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        index={notifications.today.length + notifications.yesterday.length + index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.section>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

