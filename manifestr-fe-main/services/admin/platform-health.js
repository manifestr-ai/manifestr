import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_PLATFORM_HEALTH_DATA = {
  header: {
    title: 'Platform Health',
    subtitle: 'Monitor API performance, errors, and system alerts in real time.',
  },
  apiResponseTime: {
    title: 'API Response Time',
    value: '182ms',
    change: '-12ms',
    period: 'vs last 24h',
    status: 'healthy',
    statusLabel: 'Healthy',
  },
  errorRate: {
    title: 'Error Rate',
    value: '0.42%',
    change: '+0.08%',
    period: 'vs last 24h',
    status: 'warning',
    statusLabel: 'Elevated',
  },
  uptime: {
    title: 'Uptime (30d)',
    value: '99.98%',
    change: '+0.01%',
    period: 'vs last month',
    status: 'healthy',
    statusLabel: 'Healthy',
  },
  failuresAlerts: {
    title: 'Failures & Alerts',
    subtitle: 'Recent incidents across services',
    alerts: [
      {
        id: 'alert-1',
        service: 'Deck API',
        title: 'Elevated p95 latency on /deck/generate',
        severity: 'Critical',
        status: 'Active',
        timestamp: 'Apr 18, 11:42 UTC',
        description: 'Response time exceeded 2s threshold on 3.2% of requests over a 15 min window.',
      },
      {
        id: 'alert-2',
        service: 'Rewrite API',
        title: '500 error spike on /rewrite/stream',
        severity: 'High',
        status: 'Investigating',
        timestamp: 'Apr 18, 09:18 UTC',
        description: 'Error rate rose to 1.4% — linked to upstream model provider timeouts.',
      },
      {
        id: 'alert-3',
        service: 'Auth Service',
        title: 'Login success rate dropped',
        severity: 'Medium',
        status: 'Resolved',
        timestamp: 'Apr 17, 22:05 UTC',
        description: 'Temporary OAuth provider degradation. Auto-recovered in 8 minutes.',
      },
      {
        id: 'alert-4',
        service: 'Exports',
        title: 'Queue backlog above threshold',
        severity: 'Low',
        status: 'Resolved',
        timestamp: 'Apr 17, 14:37 UTC',
        description: 'Worker pool scaled up; queue drained within SLA.',
      },
    ],
  },
}

export async function getAdminPlatformHealthData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.PLATFORM_HEALTH, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_PLATFORM_HEALTH_DATA
  } catch (_error) {
    return DEFAULT_PLATFORM_HEALTH_DATA
  }
}

export { DEFAULT_PLATFORM_HEALTH_DATA }
