import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DRIFT_ALERT_DEFAULT = {
  model: 'GPT-4.1 v12',
  severity: 'Critical',
  timestamp: 'Sep 17, 10:32 UTC',
  metricLabel: 'Rejection rate',
  metricValue: '+14% vs baseline',
  description: 'Unusual spike in content rejection patterns detected.',
  affectedTools: ['Deck', 'Rewrite'],
  samples: '247 samples analyzed',
}

const DEFAULT_AI_PERFORMANCE_DATA = {
  header: {
    title: 'AI Performance',
    subtitle: 'Track AI quality (success, sentiment) and speed (latency, drift alerts).',
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
  promptSuccess: {
    title: 'Prompt Success',
    success: 62,
    failed: 38,
    legend: [
      { label: 'Success', color: '#8696b0' },
      { label: 'Failed', color: '#18181b' },
    ],
  },
  latencyTrend: {
    title: 'MRR / ARR Trend',
    filterOptions: ['Both', 'Series 1', 'Series 2'],
    selectedFilter: 'Both',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['10ms', '8ms', '6ms', '4ms', '2ms', '0ms'],
    max: 10,
    series: [
      { label: 'Series 1', color: '#18181b', data: [5.0, 5.4, 5.6, 5.2, 5.8, 6.1, 6.4, 6.2, 6.5, 6.7, 7.0, 7.3] },
      { label: 'Series 2', color: '#8696b0', data: [3.8, 4.1, 4.0, 4.3, 4.2, 4.5, 4.4, 4.6, 4.5, 4.7, 4.6, 4.9] },
    ],
  },
  regenerations: {
    title: 'Regenerations',
    subtitle: '219 total regenerations',
    rows: [
      { label: 'Deck', caption: 'Share of total actions: 32%', value: '1,245' },
      { label: 'Slide', caption: 'Share of total actions: 11%', value: '1,472' },
      { label: 'Rewrite', caption: 'Share of total actions: 96%', value: '481' },
      { label: 'Export', caption: 'Share of total actions: 99%', value: '2,482' },
    ],
  },
  aiFeedback: {
    title: 'AI Feedback',
    xLabels: ['Positive', 'Neutral', 'Negative'],
    yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    max: 100,
    values: [52, 88, 74],
  },
  driftAlerts: {
    title: 'Drift Alerts',
    alerts: [
      { ...DRIFT_ALERT_DEFAULT, id: 'alert-1' },
      { ...DRIFT_ALERT_DEFAULT, id: 'alert-2' },
      { ...DRIFT_ALERT_DEFAULT, id: 'alert-3' },
      { ...DRIFT_ALERT_DEFAULT, id: 'alert-4' },
    ],
  },
}

export async function getAdminAiPerformanceData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.AI_PERFORMANCE, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_AI_PERFORMANCE_DATA
  } catch (_error) {
    return DEFAULT_AI_PERFORMANCE_DATA
  }
}

export { DEFAULT_AI_PERFORMANCE_DATA }
