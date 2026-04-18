import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_PRODUCT_USAGE_DATA = {
  header: {
    title: 'Product Usage & Engagement',
    subtitle: 'Understand how customers use the product.',
  },
  filters: {
    searchPlaceholder: 'Search files, content, and tags...',
    options: {
      Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
      Cohort: ['All cohorts', 'New users', 'Returning', 'Power users'],
      Persona: ['All personas', 'Founder', 'Operator', 'Investor'],
      Device: ['All devices', 'Desktop', 'Mobile', 'Tablet'],
    },
  },
  stats: [
    { title: 'Brand Uploads', value: '320', change: '+8%', period: 'vs last 30d' },
    { title: 'Voice Inputs', value: '780', change: '+8%', period: 'vs last 30d' },
    { title: 'Narrations', value: '210', change: '-7%', period: 'vs last 30d' },
  ],
  decksPerUser: {
    title: 'Decks per User',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['3.0', '2.5', '2.0', '1.5', '1.0', '0.5'],
    min: 0.5,
    max: 3.0,
    data: [1.2, 1.35, 1.5, 1.65, 1.8, 2.0, 2.15, 2.35, 2.5, 2.7, 2.9, 3.1],
  },
  timeToFirstOutput: {
    title: 'Time to First Output',
    xLabels: ['0h', '6h', '1d', '3d', '5d', '10d', '14d'],
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    max: 100,
    data: [48, 55, 60, 62, 65, 68, 72],
  },
  slideTypes: {
    title: 'Slide Types',
    slices: [
      { label: 'Title + Content', value: 32, color: '#334155', textColor: 'white' },
      { label: 'Comparison', value: 38, color: '#1e293b', textColor: 'white' },
      { label: 'Chart', value: 12, color: '#e2e8f0', textColor: '#09090b' },
      { label: 'Quote', value: 8, color: '#475569', textColor: 'white' },
      { label: 'Others', value: 10, color: '#94a3b8', textColor: 'white' },
    ],
  },
  rewritesVsAccepts: {
    title: 'Rewrites vs Accepts',
    filterOptions: ['Both', 'Accepted', 'Edited'],
    selectedFilter: 'Both',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    max: 100,
    accepted: [55, 70, 40, 62, 78, 35, 55, 60, 58, 42, 50, 57],
    edited: [58, 75, 42, 65, 82, 38, 58, 65, 62, 45, 55, 60],
    legend: [
      { label: 'Accepted As-Is', color: '#18181b' },
      { label: 'Further Edited', color: '#cbd5e1' },
    ],
  },
  exportTypes: {
    title: 'Export Types',
    slices: [
      { label: 'PDF', value: 42, color: '#334155', textColor: 'white' },
      { label: 'PPTX', value: 38, color: '#1e293b', textColor: 'white' },
      { label: 'DOCX', value: 9, color: '#e2e8f0', textColor: '#09090b' },
      { label: 'Other', value: 11, color: '#94a3b8', textColor: 'white' },
    ],
  },
  aiStyleSettingsUsage: {
    title: 'AI Style Settings Usage',
    rows: [
      { rank: 1, name: 'Professional', value: '1,240', percent: '38.1% of users' },
      { rank: 3, name: 'Business', value: '810', percent: '34.5% of users' },
      { rank: 5, name: 'Educational', value: '1140', percent: '40.2% of users' },
      { rank: 5, name: 'Playful', value: '1140', percent: '40.2% of users' },
    ],
  },
}

export async function getAdminProductUsageData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.PRODUCT_USAGE, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_PRODUCT_USAGE_DATA
  } catch (_error) {
    return DEFAULT_PRODUCT_USAGE_DATA
  }
}

export { DEFAULT_PRODUCT_USAGE_DATA }
