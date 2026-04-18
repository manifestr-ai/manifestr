import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_OVERVIEW_DATA = {
  header: {
    title: 'Executive Overview',
    subtitle: 'Company-wide performance metrics',
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
      { title: 'Active Users', value: '8,920', change: '+12%', period: 'vs last 30d' },
      { title: 'MRR/ARR', value: '$58K / $1.89M', change: '+6%', period: 'vs last 30d' },
    ],
    [
      { title: 'CAC vs LTV', value: '$420 / $3,750', change: '+8%', period: 'vs last 30d' },
      { title: 'Pipeline Value', value: '$4.2M', change: '+8%', period: 'vs last 30d' },
      { title: 'Win Rate %', value: '31%', change: '-7%', period: 'vs last 30d' },
    ],
  ],
  mrrArrTrend: {
    title: 'MRR / ARR Trend',
    filterOptions: ['Both', 'MRR', 'ARR'],
    selectedFilter: 'Both',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['60K', '40K', '20K', '10K', '5K', '0'],
    mrrData: [12, 14, 13, 15, 16, 18, 17, 19, 20, 22, 21, 24],
    arrData: [8, 9, 8, 10, 11, 12, 11, 13, 14, 15, 14, 16],
    mrrDollar: ['$120K', '$140K', '$130K', '$150K', '$160K', '$180K', '$170K', '$190K', '$200K', '$220K', '$210K', '$240K'],
    arrDollar: ['$0.96M', '$1.08M', '$0.96M', '$1.2M', '$1.32M', '$1.44M', '$1.32M', '$1.56M', '$1.68M', '$1.8M', '$1.68M', '$1.92M'],
    max: 60,
    change: '+8%',
    period: 'MoM',
  },
  closedWon: {
    title: 'Closed-Won This Month',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['60K', '40K', '20K', '10K', '5K', '0'],
    values: [8, 12, 18, 22, 28, 35, 42, 48, 38, 30, 25, 20],
    valueLabels: ['$8K', '$12K', '$18K', '$22K', '$28K', '$35K', '$42K', '$48K', '$38K', '$30K', '$25K', '$20K'],
    max: 60,
  },
  dauMauTrend: {
    title: 'DAU / MAU Trend',
    filterOptions: ['last 7d', 'last 30d', 'last 90d', 'all time'],
    selectedFilter: 'last 30d',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.75, 3.8, 3.82, 3.85, 3.8, 3.8],
    max: 5,
    change: '-0.6%',
    period: 'vs last 30d',
  },
  aiTrustScore: {
    title: 'AI Trust Score',
    score: 67,
    status: 'Good',
    summary: 'Last 30d: 8,420 accepts / 960 rejects',
  },
  topCustomers: {
    title: 'Top 10 Customers by Revenue',
    filterOptions: ['last 7d', 'last 30d', 'last 90d', 'all time'],
    selectedFilter: 'last 30d',
    customers: [
      { account: 'Acme Corp', plan: 'Enterprise', mrr: '$42,500', growth: '+18%' },
      { account: 'BrightLabs', plan: 'Pro', mrr: '$17,200', growth: '+6%' },
      { account: 'Nova Health', plan: 'Enterprise', mrr: '$35,000', growth: '+12%' },
      { account: 'Horizon Media', plan: 'Starter', mrr: '$14,600', growth: '-3%' },
      { account: 'Orion Tech', plan: 'Starter', mrr: '$28,900', growth: '+22%' },
    ],
  },
  platformHealth: {
    title: 'Platform Health',
    score: 87,
    status: 'Good',
    metrics: [
      { label: 'Uptime:', value: '99.98%' },
      { label: 'Latency (p95):', value: '220ms' },
      { label: 'Error rate:', value: '0.4%' },
      { label: 'CSAT:', value: '4.2 / 5' },
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
