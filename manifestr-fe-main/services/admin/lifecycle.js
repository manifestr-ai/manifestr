import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_LIFECYCLE_DATA = {
  header: {
    title: 'User Lifecycle & Segmentation',
    subtitle: 'Understand where users sit in the lifecycle and take action on key segments.',
  },
  filters: {
    searchPlaceholder: 'Search users, segments, plans...',
    options: {
      Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
      Plan: ['All plans', 'Free', 'Pro', 'Team', 'Enterprise'],
      Persona: ['All personas', 'Founder', 'Operator', 'Investor'],
      Device: ['All devices', 'Desktop', 'Mobile', 'Tablet'],
    },
  },
  stats: [
    { id: 'total', title: 'Total Users', value: '18,420', change: '+4%', period: 'vs last 30d' },
    { id: 'active', title: 'Active Users', value: '11,384', change: '+6%', period: 'vs last 30d' },
    { id: 'atRisk', title: 'At Risk', value: '1,248', change: '-3%', period: 'vs last 30d' },
    { id: 'dormant', title: 'Dormant', value: '2,104', change: '+1%', period: 'vs last 30d' },
  ],
  lifecycleStages: {
    title: 'Lifecycle Stages',
    subtitle: 'Distribution of users across lifecycle stages.',
    total: 18420,
    stages: [
      { key: 'new', label: 'New', value: 2940, share: 16, color: '#18181b' },
      { key: 'activated', label: 'Activated', value: 4120, share: 22, color: '#27272a' },
      { key: 'active', label: 'Active', value: 7264, share: 39, color: '#52525b' },
      { key: 'at_risk', label: 'At Risk', value: 1248, share: 7, color: '#8696b0' },
      { key: 'dormant', label: 'Dormant', value: 2104, share: 12, color: '#a1a1aa' },
      { key: 'churned', label: 'Churned', value: 744, share: 4, color: '#d4d4d8' },
    ],
  },
  segments: {
    title: 'User Segments',
    subtitle: 'High-value and at-risk segments with suggested actions.',
    rows: [
      {
        id: 'power-free',
        name: 'Power Free Users',
        description: 'Free users with >20 sessions in 30d',
        users: '1,842',
        health: 'Healthy',
        tone: 'positive',
        action: { label: 'Send Upgrade Offer', intent: 'upgrade' },
      },
      {
        id: 'trial-stalled',
        name: 'Trial Stalled',
        description: 'Started trial but no activation action in 7d',
        users: '612',
        health: 'At Risk',
        tone: 'warn',
        action: { label: 'Re-engage', intent: 're-engage' },
      },
      {
        id: 'dormant-pro',
        name: 'Dormant Pro',
        description: 'Pro accounts inactive for 30+ days',
        users: '284',
        health: 'Churning',
        tone: 'negative',
        action: { label: 'Win-back Email', intent: 're-engage' },
      },
      {
        id: 'team-expansion',
        name: 'Team Expansion',
        description: 'Teams hitting seat limits 3 months in a row',
        users: '96',
        health: 'Upsell',
        tone: 'positive',
        action: { label: 'Upgrade to Enterprise', intent: 'upgrade' },
      },
      {
        id: 'low-adoption',
        name: 'Low Adoption',
        description: 'Paid users using < 2 features',
        users: '438',
        health: 'At Risk',
        tone: 'warn',
        action: { label: 'Feature Tour', intent: 're-engage' },
      },
    ],
  },
}

export async function getAdminLifecycleData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.LIFECYCLE, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_LIFECYCLE_DATA
  } catch (_error) {
    return DEFAULT_LIFECYCLE_DATA
  }
}

export { DEFAULT_LIFECYCLE_DATA }
