import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_FEATURE_ADOPTION_DATA = {
  header: {
    title: 'Feature Adoption',
    subtitle: 'Measure depth of feature usage — from discovery to habitual use.',
  },
  filters: {
    searchPlaceholder: 'Search features, plans, segments...',
    options: {
      Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
      Feature: ['All features', 'Brand Uploads', 'Collaboration', 'Export Types', 'AI Narration', 'Voice Input', 'Templates', 'Chart Builder', 'Spreadsheet Editor'],
      Plan: ['All plans', 'Free', 'Pro', 'Team', 'Enterprise'],
      Role: ['All roles', 'Founder', 'Operator', 'Investor', 'Analyst'],
      Region: ['All regions', 'N. America', 'Europe', 'Asia', 'Other'],
    },
  },
  stats: [
    { id: 'discovered', title: 'Discovered', value: '12,480', change: '+8%', period: 'vs last 30d' },
    { id: 'firstUse', title: 'First Use', value: '7,362', change: '+5%', period: 'vs last 30d' },
    { id: 'repeatUse', title: 'Repeat Use', value: '4,812', change: '+6%', period: 'vs last 30d' },
    { id: 'habitual', title: 'Habitual', value: '2,934', change: '+9%', period: 'vs last 30d' },
  ],
  adoptionFunnel: {
    title: 'Overall Adoption Funnel',
    subheading: 'Discovered → First Use → Repeat → Habitual',
    rows: [
      { label: 'Discovered', sublabel: '12,480 users', percent: 100, display: '100%' },
      { label: 'First Use', sublabel: '7,362 users', percent: 59, display: '59.0%' },
      { label: 'Repeat Use', sublabel: '4,812 users', percent: 38.5, display: '38.5%' },
      { label: 'Habitual', sublabel: '2,934 users', percent: 23.5, display: '23.5%' },
    ],
  },
  featureAdoptionGrid: {
    title: 'Funnel per Feature',
    subtitle: 'Adoption depth for each tracked feature — Discovered → First Use → Repeat Use → Habitual.',
    features: [
      {
        id: 'brand-uploads',
        name: 'Brand Uploads',
        stages: { discovered: 100, firstUse: 74, repeat: 52, habitual: 38 },
        adoptionScore: 54,
      },
      {
        id: 'collaboration',
        name: 'Collaboration',
        stages: { discovered: 100, firstUse: 68, repeat: 48, habitual: 32 },
        adoptionScore: 49,
      },
      {
        id: 'export-types',
        name: 'Export Types',
        stages: { discovered: 100, firstUse: 88, repeat: 74, habitual: 62 },
        adoptionScore: 75,
      },
      {
        id: 'ai-narration',
        name: 'AI Narration',
        stages: { discovered: 100, firstUse: 52, repeat: 28, habitual: 14 },
        adoptionScore: 31,
      },
      {
        id: 'voice-input',
        name: 'Voice Input',
        stages: { discovered: 100, firstUse: 44, repeat: 22, habitual: 11 },
        adoptionScore: 26,
      },
      {
        id: 'templates',
        name: 'Templates',
        stages: { discovered: 100, firstUse: 82, repeat: 66, habitual: 48 },
        adoptionScore: 65,
      },
      {
        id: 'chart-builder',
        name: 'Chart Builder',
        stages: { discovered: 100, firstUse: 71, repeat: 58, habitual: 41 },
        adoptionScore: 57,
      },
      {
        id: 'spreadsheet-editor',
        name: 'Spreadsheet Editor',
        stages: { discovered: 100, firstUse: 62, repeat: 44, habitual: 28 },
        adoptionScore: 45,
      },
    ],
  },
  planBreakdown: {
    title: 'Breakdown by Plan',
    subtitle: 'Share of users reaching each adoption stage by plan.',
    chartWidth: 920,
    chartHeight: 300,
    max: 100,
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    stageSeries: [
      { key: 'discovered', label: 'Discovered', color: '#18181b' },
      { key: 'firstUse', label: 'First Use', color: '#3f3f46' },
      { key: 'repeat', label: 'Repeat', color: '#71717a' },
      { key: 'habitual', label: 'Habitual', color: '#a1a1aa' },
    ],
    plans: [
      { label: 'Free', values: [100, 52, 28, 14] },
      { label: 'Pro', values: [100, 68, 46, 28] },
      { label: 'Team', values: [100, 74, 55, 38] },
      { label: 'Enterprise', values: [100, 82, 64, 47] },
    ],
  },
  roleBreakdown: {
    title: 'Breakdown by Role',
    subtitle: 'Adoption stage penetration per user role.',
    chartWidth: 920,
    chartHeight: 300,
    max: 100,
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    stageSeries: [
      { key: 'discovered', label: 'Discovered', color: '#18181b' },
      { key: 'firstUse', label: 'First Use', color: '#3f3f46' },
      { key: 'repeat', label: 'Repeat', color: '#71717a' },
      { key: 'habitual', label: 'Habitual', color: '#a1a1aa' },
    ],
    plans: [
      { label: 'Founder', values: [100, 76, 58, 42] },
      { label: 'Operator', values: [100, 71, 52, 36] },
      { label: 'Investor', values: [100, 58, 38, 22] },
      { label: 'Analyst', values: [100, 82, 66, 48] },
    ],
  },
  regionBreakdown: {
    title: 'Breakdown by Region',
    subtitle: 'Adoption stage penetration across regions.',
    chartWidth: 920,
    chartHeight: 300,
    max: 100,
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    stageSeries: [
      { key: 'discovered', label: 'Discovered', color: '#18181b' },
      { key: 'firstUse', label: 'First Use', color: '#3f3f46' },
      { key: 'repeat', label: 'Repeat', color: '#71717a' },
      { key: 'habitual', label: 'Habitual', color: '#a1a1aa' },
    ],
    plans: [
      { label: 'N. America', values: [100, 78, 60, 44] },
      { label: 'Europe', values: [100, 72, 54, 38] },
      { label: 'Asia', values: [100, 64, 44, 28] },
      { label: 'Other', values: [100, 56, 36, 20] },
    ],
  },
  topFeatures: {
    title: 'Feature Adoption Score Matrix',
    subtitle: 'Adoption depth for all tracked features across all four stages.',
    periods: ['Discovered', 'First Use', 'Repeat', 'Habitual'],
    keys: ['discovered', 'firstUse', 'repeat', 'habitual'],
    rows: [
      { feature: 'Export Types',        discovered: 100, firstUse: 88, repeat: 74, habitual: 62 },
      { feature: 'Templates',           discovered: 100, firstUse: 82, repeat: 66, habitual: 48 },
      { feature: 'Chart Builder',        discovered: 100, firstUse: 71, repeat: 58, habitual: 41 },
      { feature: 'Brand Uploads',        discovered: 100, firstUse: 74, repeat: 52, habitual: 38 },
      { feature: 'Collaboration',        discovered: 100, firstUse: 68, repeat: 48, habitual: 32 },
      { feature: 'Spreadsheet Editor',   discovered: 100, firstUse: 62, repeat: 44, habitual: 28 },
      { feature: 'AI Narration',         discovered: 100, firstUse: 52, repeat: 28, habitual: 14 },
      { feature: 'Voice Input',          discovered: 100, firstUse: 44, repeat: 22, habitual: 11 },
    ],
  },
  workspacesCreated: {
    title: 'Workspaces Created',
    total: '128 total workspaces',
    rows: [
      { name: 'Zenith', users: '10,000 users', percent: 35.0 },
      { name: 'BrightTech', users: '10,000 users', percent: 25.0 },
      { name: 'Orion Global', users: '10,000 users', percent: 79.8 },
      { name: 'Horizon Inc', users: '10,000 users', percent: 79.8 },
    ],
  },
  membersAdded: {
    title: 'Members Added',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['250', '200', '150', '100', '50', '0'],
    max: 250,
    bars: [60, 80, 50, 70, 40, 90, 60, 110, 70, 180, 90, 60],
    trend: [55, 75, 65, 65, 60, 85, 75, 100, 90, 160, 110, 100],
    timeframeOptions: ['Monthly', 'Weekly', 'Yearly'],
    selectedTimeframe: 'Monthly',
  },
  commentsPerDocument: {
    title: 'Comments per Document',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yLabels: ['10', '8', '6', '4', '2', '0'],
    min: 0,
    max: 10,
    data: [1, 2, 3, 4, 5, 6, 8.5],
  },
  sharedVsSolo: {
    title: 'Shared vs Solo Usage',
    slices: [
      { label: 'Shared', value: 62, color: '#94a3b8', textColor: 'white' },
      { label: 'Solo', value: 38, color: '#18181b', textColor: 'white' },
    ],
  },
  topCollaborativeProjects: {
    title: 'Top Collaborative Projects',
    searchPlaceholder: 'Search accounts...',
    rows: [
      { project: 'Pitch Deck v3', members: 8, docs: 12, exports: 63, lastActive: '15/03/2024' },
      { project: 'BrightLabs', members: 9, docs: 41, exports: 423, lastActive: '15/03/2024' },
      { project: 'Nova Health', members: 3, docs: 52, exports: 142, lastActive: '15/03/2024' },
      { project: 'Pitch Deck v3', members: 45, docs: 13, exports: 15, lastActive: '15/03/2024' },
      { project: 'Orion Tech', members: 13, docs: 4, exports: 73, lastActive: '15/03/2024' },
    ],
  },
  team: {
    title: 'Team',
    searchPlaceholder: 'Search accounts...',
    rows: [
      { member: 'J. Smith', role: 'Admin', docsCreated: 12, exports: 63, lastActive: '15/03/2024' },
      { member: 'L. Wong', role: 'Editor', docsCreated: 41, exports: 423, lastActive: '15/03/2024' },
      { member: 'A. Khan', role: 'Viewer', docsCreated: 52, exports: 142, lastActive: '15/03/2024' },
      { member: 'J. Smith', role: 'Editor', docsCreated: 13, exports: 15, lastActive: '15/03/2024' },
      { member: 'L. Wong', role: 'Editor', docsCreated: 4, exports: 73, lastActive: '15/03/2024' },
    ],
  },
}

export const getAdminFeatureAdoptionData = async (params = {}) => {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.FEATURE_ADOPTION, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.details || null
  } catch (err) {
    console.error('Feature Adoption API error:', err)
    return null
  }
}
