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
  slideTimeHeatmap: {
    title: 'Slide Time Heatmap',
    slides: [1, 2, 3, 4, 5, 6, 7],
    rows: [
      [28, 12, 28, 12, 24, 12, 24],
      [24, 18, 28, 18, 10, 10, 38],
      [28, 28, 24, 28, 18, 12, 18],
      [12, 12, 12, 12, 28, 24, 28],
      [38, 28, 18, 28, 28, 24, 28],
    ],
  },
  slideDropoff: {
    title: 'Slide Drop-off',
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    max: 100,
    data: [52, 58, 48, 55, 62, 50, 55, 60, 58, 50, 58, 62, 55, 58, 62],
  },
  slideRewritesVsAccepts: {
    title: 'Rewrites vs Accepts',
    filterOptions: ['Both', 'Accepted', 'Edited'],
    selectedFilter: 'Both',
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    max: 100,
    categories: [
      { label: 'Title', accepted: 35, edited: 25 },
      { label: 'Content', accepted: 78, edited: 15 },
      { label: 'Content', accepted: 62, edited: 25 },
      { label: 'Quote', accepted: 48, edited: 50 },
    ],
    legend: [
      { label: 'Accepted As-Is', color: '#18181b' },
      { label: 'Further Edited', color: '#cbd5e1' },
    ],
  },
  rewritesVsAcceptsFlows: {
    title: 'Rewrites vs Accepts',
    filterOptions: ['Both', 'Accepted', 'Edited'],
    selectedFilter: 'Both',
    rows: [
      { rank: 1, flow: 'Title → Content', value: '1,240', percent: '38.1% of users' },
      { rank: 2, flow: 'Content → Chart', value: '960', percent: '38.1% of users' },
      { rank: 3, flow: 'Chart → Export', value: '810', percent: '34.5% of users' },
      { rank: 4, flow: 'Content → Quote', value: '810', percent: '34.5% of users' },
    ],
  },
  bouncedDecks: {
    title: 'Bounced Decks',
    value: '18%',
    valueLabel: 'bounce rate',
    change: '+8%',
    period: 'vs last 30d',
    description: 'Total started vs completed decks.',
    breakdown: '(450 started, 370 exported)',
  },
  completionTime: {
    title: 'Completion Time',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['35m', '30m', '25m', '20m', '15m', '10m'],
    min: 10,
    max: 35,
    data: [30, 30, 29, 28, 27, 27, 28, 27, 26, 25, 24, 24],
    timeframeOptions: ['last 1 year', 'last 6 months', 'last 30d'],
    selectedTimeframe: 'last 1 year',
  },
  toolUsers: {
    tools: [
      { name: 'Briefcase', users: '3,200' },
      { name: 'Strategist', users: '5,800' },
      { name: 'The Deck', users: '4,100' },
      { name: 'Analyzer', users: '7,500' },
      { name: 'Design Studio', users: '2,700' },
      { name: 'Cost CTRL', users: '6,300' },
      { name: 'Wordsmith', users: '1,900' },
      { name: 'The Huddle', users: '8,200' },
    ],
  },
  mostCommonJourneys: {
    title: 'Most Common User Journeys',
    rows: [
      { rank: 1, journey: 'Briefcase → The Deck', value: '1,240', percent: '38.1% of users' },
      { rank: 2, journey: 'Briefcase → Strategist', value: '960', percent: '38.1% of users' },
      { rank: 3, journey: 'The Deck → Analyzer', value: '810', percent: '34.5% of users' },
      { rank: 4, journey: 'The Deck → Design Studio', value: '810', percent: '34.5% of users' },
      { rank: 5, journey: 'Strategist → The Deck', value: '1140', percent: '40.2% of users' },
      { rank: 6, journey: 'Strategist → Cost CTRL', value: '1140', percent: '40.2% of users' },
    ],
  },
  transitionDropoffsFunnel: {
    title: 'Transition Drop-offs (Funnel)',
    stages: [
      'Full Journey',
      'Performance Review',
      'Visual Enhancement',
      'Content Creation',
      'Template Deck',
      'Initial Research',
    ],
    xLabels: [0, 1, 2, 3, 4, 5],
    min: 0,
    max: 6,
    data: [0.3, 1.0, 1.8, 2.8, 3.7, 4.6, 5.2],
  },
  multiToolUsage: {
    title: 'Multi-Tool Usage',
    percent: '48%',
    percentLabel: 'Users utilize multiple tools',
    rows: [
      { label: 'Single Tool', value: 1450, percent: 40 },
      { label: 'Two Tools', value: 1450, percent: 40 },
      { label: 'Three Tools', value: 1450, percent: 45 },
      { label: '4+ Tools', value: 1450, percent: 60 },
    ],
    powerUsersLabel: 'Power Users (3+ tools):',
    powerUsersValue: '16%',
  },
  toolPairingMatrix: {
    title: 'Tool Pairing Effectiveness Matrix',
    rows: [
      { rank: 1, combination: 'Briefcase + The Deck', usage: '1,240', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 2, combination: 'Design Studio + Wordsmith', usage: '3,100', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 3, combination: 'The Deck + Analyzer', usage: '1,870', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 4, combination: 'Wordsmith + The Huddle', usage: '2,900', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 5, combination: 'The Deck + Analyzer', usage: '2,300', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 6, combination: 'Wordsmith + The Huddle', usage: '3,500', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 7, combination: 'Briefcase + Strategist', usage: '2,650', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 8, combination: 'Analyzer + The Huddle', usage: '3,300', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 9, combination: 'Strategist + The Deck', usage: '4,200', effectiveness: '92%', satisfaction: '4.8' },
      { rank: 10, combination: 'Cost CTRL + Analyzer', usage: '1,240', effectiveness: '92%', satisfaction: '4.8' },
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
