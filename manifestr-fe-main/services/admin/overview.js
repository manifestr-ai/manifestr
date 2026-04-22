import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_OVERVIEW_DATA = {
  header: {
    title: 'Executive Overview',
    subtitle: 'High-level snapshot of platform health.',
  },
  filters: {
    searchPlaceholder: 'Search files, content, and tags...',
    options: {
      Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
      Cohort: ['All cohorts', 'New users', 'Returning', 'Power users'],
      Persona: ['All personas', 'Freelancer', 'Agency', 'Enterprise'],
      Device: ['All devices', 'Desktop', 'Mobile', 'Tablet'],
    },
  },
  statRows: [
    [
      { title: 'Total Users', value: '42,580', change: '+8%', period: 'vs last 30d' },
      { title: 'New Signups (7d)', value: '1,284', change: '+14%', period: 'vs prev 7d' },
      { title: 'DAU / MAU', value: '38.2%', change: '+1.4%', period: 'vs last 30d' },
    ],
    [
      { title: 'Activation Rate', value: '61%', change: '+3%', period: 'vs last 30d' },
      { title: 'MRR', value: '$58,400', change: '+6%', period: 'vs last 30d' },
      { title: 'Revenue This Month', value: '$124,800', change: '+9%', period: 'vs last month' },
    ],
  ],
  userGrowth: {
    title: 'User Growth',
    filterOptions: ['last 7d', 'last 30d', 'last 90d', 'all time'],
    selectedFilter: 'last 30d',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [28, 31, 34, 36, 38, 41, 39, 43, 44, 45, 44, 45],
    max: 50,
    change: '+8%',
    period: 'vs last 30d',
  },
  revenueTrend: {
    title: 'Revenue Trend',
    filterOptions: ['Both', 'MRR', 'ARR'],
    selectedFilter: 'Both',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['80K', '60K', '40K', '20K', '10K', '0'],
    mrrData: [40, 44, 42, 47, 49, 53, 51, 55, 57, 60, 59, 64],
    arrData: [28, 31, 30, 33, 35, 37, 36, 38, 40, 42, 41, 44],
    mrrDollar: ['$40K', '$44K', '$42K', '$47K', '$49K', '$53K', '$51K', '$55K', '$57K', '$60K', '$59K', '$64K'],
    arrDollar: ['$0.34M', '$0.37M', '$0.36M', '$0.40M', '$0.42M', '$0.44M', '$0.43M', '$0.46M', '$0.48M', '$0.50M', '$0.49M', '$0.53M'],
    max: 80,
    change: '+9%',
    period: 'MoM',
  },
  conversionFunnel: {
    title: 'Conversion Funnel',
    steps: [
      { label: 'Visitors', value: 84200, valueLabel: '84,200' },
      { label: 'Signups', value: 12480, valueLabel: '12,480' },
      { label: 'Activated', value: 7610, valueLabel: '7,610' },
      { label: 'Paying', value: 3240, valueLabel: '3,240' },
      { label: 'Retained (90d)', value: 2180, valueLabel: '2,180' },
    ],
  },
  recentActivity: {
    title: 'Recent Activity',
    events: [
      { id: 'ev-1', type: 'signup', actor: 'sarah@acme.com', description: 'New signup — Pro Trial', time: '2m ago' },
      { id: 'ev-2', type: 'upgrade', actor: 'Bright Labs', description: 'Upgraded to Enterprise', time: '14m ago' },
      { id: 'ev-3', type: 'payment', actor: 'Nova Health', description: 'Invoice paid · $35,000', time: '31m ago' },
      { id: 'ev-4', type: 'login', actor: 'james@oriontech.io', description: 'First login after 32d', time: '47m ago' },
      { id: 'ev-5', type: 'signup', actor: 'demo@horizon.co', description: 'New signup — Starter', time: '1h ago' },
      { id: 'ev-6', type: 'alert', actor: 'System', description: 'Churn spike detected · Basic plan', time: '2h ago' },
      { id: 'ev-7', type: 'payment', actor: 'Orion Tech', description: 'Invoice paid · $28,900', time: '3h ago' },
    ],
  },
  alerts: {
    title: 'Alerts',
    system: [
      { id: 'sys-1', title: 'API Latency Spike', description: 'p95 latency exceeded 800ms for 12 min on /api/deck/generate', severity: 'critical', time: '18m ago' },
      { id: 'sys-2', title: 'Error Rate Elevated', description: 'Error rate at 2.1% — above 1% threshold on export service', severity: 'warning', time: '54m ago' },
    ],
    revenue: [
      { id: 'rev-1', title: 'MRR Drop Detected', description: 'MRR fell 4.2% day-over-day — 3 Enterprise downgrades', severity: 'warning', time: '2h ago' },
      { id: 'rev-2', title: 'Failed Payment', description: '7 payment failures in the last 24h · $12,400 at risk', severity: 'critical', time: '4h ago' },
    ],
    churn: [
      { id: 'churn-1', title: 'Churn Spike — Basic', description: '14 Basic-plan cancellations in 48h vs. 3 avg', severity: 'critical', time: '1h ago' },
      { id: 'churn-2', title: 'At-Risk Cohort Growing', description: 'Dormant Pro accounts up 18% this week', severity: 'warning', time: '6h ago' },
    ],
  },
}

export async function getAdminOverviewData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.OVERVIEW, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_OVERVIEW_DATA
  } catch (_error) {
    return DEFAULT_OVERVIEW_DATA
  }
}

export { DEFAULT_OVERVIEW_DATA }
