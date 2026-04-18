import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_FEATURE_ADOPTION_DATA = {
  header: {
    title: 'Feature Adoption',
    subtitle: 'Track how users discover, try, and adopt features across plans.',
  },
  filters: {
    searchPlaceholder: 'Search features, plans, segments...',
    options: {
      Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
      Feature: ['All features', 'Decks', 'Docs', 'Sheets', 'Charts'],
      Plan: ['All plans', 'Free', 'Pro', 'Team', 'Enterprise'],
      Persona: ['All personas', 'Founder', 'Operator', 'Investor'],
    },
  },
  stats: [
    { id: 'discovered', title: 'Discovered', value: '12,480', change: '+8%', period: 'vs last 30d' },
    { id: 'firstUse', title: 'First Use', value: '7,362', change: '+5%', period: 'vs last 30d' },
    { id: 'repeatUse', title: 'Repeat Use', value: '4,812', change: '+6%', period: 'vs last 30d' },
    { id: 'habitual', title: 'Habitual', value: '2,934', change: '+9%', period: 'vs last 30d' },
  ],
  adoptionFunnel: {
    title: 'Feature Usage Funnel',
    subheading: 'Discovered → First Use → Repeat → Habitual',
    rows: [
      { label: 'Discovered', sublabel: '12,480 users', percent: 100, display: '100%' },
      { label: 'First Use', sublabel: '7,362 users', percent: 59, display: '59.0%' },
      { label: 'Repeat', sublabel: '4,812 users', percent: 38.5, display: '38.5%' },
      { label: 'Habitual', sublabel: '2,934 users', percent: 23.5, display: '23.5%' },
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
  topFeatures: {
    title: 'Top Features by Adoption',
    subtitle: 'Highest habitual-use share across the product.',
    rows: [
      { feature: 'Deck Builder', habitual: 62, repeat: 74, firstUse: 88 },
      { feature: 'AI Rewrite', habitual: 54, repeat: 69, firstUse: 82 },
      { feature: 'Charts', habitual: 41, repeat: 58, firstUse: 71 },
      { feature: 'Docs Collaboration', habitual: 36, repeat: 52, firstUse: 64 },
      { feature: 'Export', habitual: 29, repeat: 44, firstUse: 58 },
    ],
  },
}

export async function getAdminFeatureAdoptionData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.FEATURE_ADOPTION, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_FEATURE_ADOPTION_DATA
  } catch (_error) {
    return DEFAULT_FEATURE_ADOPTION_DATA
  }
}

export { DEFAULT_FEATURE_ADOPTION_DATA }
