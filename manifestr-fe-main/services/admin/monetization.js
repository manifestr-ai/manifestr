import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_MONETIZATION_DATA = {
  header: {
    title: 'Monetization',
    subtitle: 'Revenue, recurring metrics, and conversion.',
  },
  filters: {
    Timeframe: {
      label: '30 days',
      options: ['7 days', '30 days', '90 days', 'This year', 'All time'],
    },
    Plan: {
      label: 'All plans',
      options: ['All plans', 'Free', 'Pro', 'Enterprise'],
    },
  },
  totalRevenue: {
    title: 'Total Revenue',
    value: '$678K',
    change: '+15.2%',
    period: 'vs last month',
  },
  mrr: {
    title: 'MRR',
    value: '$47.2K',
    change: '+6.1%',
    period: 'vs last month',
  },
  arr: {
    title: 'ARR',
    value: '$566K',
    change: '+12.4%',
    period: 'vs last year',
  },
  conversionFunnel: {
    title: 'Conversion funnel',
    subheading: 'Sign-up to retained customer',
    rows: [
      { label: 'Free Users', sublabel: '10,000 users', percent: 100, display: '100%' },
      { label: 'Trial Started', sublabel: '3,500 users', percent: 35, display: '35.0%' },
      { label: 'Paid Conversion', sublabel: '2,500 users', percent: 25, display: '25.0%' },
      { label: 'Retained (30d)', sublabel: '1,995 users', percent: 20, display: '20.0%' },
    ],
  },
}

export async function getAdminMonetizationData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.MONETIZATION, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_MONETIZATION_DATA
  } catch (_error) {
    return DEFAULT_MONETIZATION_DATA
  }
}

export { DEFAULT_MONETIZATION_DATA }
