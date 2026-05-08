import api from '../lib/api'

export const fetchNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params })
  return response.data?.data || []
}

export const fetchNotificationCounts = async () => {
  const response = await api.get('/notifications/counts')
  return response.data?.data || {}
}

export const markNotificationRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`)
  return response.data?.data
}

export const markAllNotificationsRead = async () => {
  const response = await api.patch('/notifications/read-all')
  return response.data
}

export const dismissNotification = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/dismiss`)
  return response.data?.data
}

export const getNotificationTimeAgo = (dateString) => {
  if (!dateString) return ''

  const createdAt = new Date(dateString).getTime()
  const diffSeconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000))

  if (diffSeconds < 60) return 'just now'

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
