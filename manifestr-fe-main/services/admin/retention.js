import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_RETENTION_DATA = {
  header: {
    title: 'Retention & Churn',
    subtitle: 'Track user retention cohorts, churn signals, and revenue retention health.',
  },
  filters: {
    searchPlaceholder: 'Search cohorts, plans, segments...',
    options: {
      Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
      Cohort: ['All cohorts', 'New users', 'Returning', 'Power users'],
      Persona: ['All personas', 'Founder', 'Operator', 'Investor'],
      Device: ['All devices', 'Desktop', 'Mobile', 'Tablet'],
    },
  },
  stats: [
    { id: 'churnRate', title: 'Churn Rate', value: '2.8%', change: '-0.4%', period: 'vs last 30d' },
    { id: 'nrr', title: 'Net Revenue Retention', value: '112%', change: '+3%', period: 'vs last 30d' },
    { id: 'grr', title: 'Gross Revenue Retention', value: '94%', change: '+1%', period: 'vs last 30d' },
    { id: 'avgRetention', title: 'Avg Retention (30d)', value: '68%', change: '+2%', period: 'vs last 30d' },
  ],
  cohortRetention: {
    title: 'Cohort Retention',
    subtitle: 'Share of users retained 1 day, 7 days, and 30 days after sign-up.',
    periods: ['1d', '7d', '30d'],
    rows: [
      { cohort: 'Apr 2026', size: '1,240 users', values: [82, 61, 42] },
      { cohort: 'Mar 2026', size: '1,184 users', values: [79, 58, 39] },
      { cohort: 'Feb 2026', size: '1,092 users', values: [81, 60, 41] },
      { cohort: 'Jan 2026', size: '1,043 users', values: [76, 55, 36] },
      { cohort: 'Dec 2025', size: '982 users', values: [74, 52, 33] },
      { cohort: 'Nov 2025', size: '954 users', values: [77, 54, 35] },
    ],
  },
  churnRateTrend: {
    title: 'Churn Rate Trend',
    filterOptions: ['Both', 'Customer Churn', 'Revenue Churn'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['6%', '5%', '4%', '3%', '2%', '1%', '0%'],
    max: 6,
    series: [
      { label: 'Customer Churn', color: '#18181b', data: [3.4, 3.2, 3.0, 2.9, 3.1, 2.8, 2.7, 2.6, 2.8, 2.7, 2.5, 2.4] },
      { label: 'Revenue Churn', color: '#8696b0', data: [2.1, 2.0, 1.9, 2.0, 2.2, 1.8, 1.7, 1.6, 1.8, 1.7, 1.5, 1.4] },
    ],
  },
  nrrGrrTrend: {
    title: 'NRR / GRR Trend',
    filterOptions: ['Both', 'NRR', 'GRR'],
    chartWidth: 920,
    chartHeight: 280,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['120%', '110%', '100%', '90%', '80%'],
    max: 120,
    min: 80,
    series: [
      {
        label: 'NRR',
        color: '#18181b',
        data: [102, 104, 105, 106, 107, 108, 109, 110, 110, 111, 112, 113],
      },
      {
        label: 'GRR',
        color: '#8696b0',
        data: [90, 91, 91, 92, 92, 93, 93, 94, 94, 94, 95, 95],
      },
    ],
  },
  churnBreakdown: {
    title: 'Churn Breakdown',
    subtitle: '318 churned accounts',
    segments: [
      { label: 'Price', value: 38, color: '#18181b' },
      { label: 'Missing features', value: 24, color: '#52525b' },
      { label: 'Competitor', value: 18, color: '#8696b0' },
      { label: 'Low usage', value: 12, color: '#a1a1aa' },
      { label: 'Other', value: 8, color: '#d4d4d8' },
    ],
  },
}

export async function getAdminRetentionData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.RETENTION, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_RETENTION_DATA
  } catch (_error) {
    return DEFAULT_RETENTION_DATA
  }
}

export { DEFAULT_RETENTION_DATA }
