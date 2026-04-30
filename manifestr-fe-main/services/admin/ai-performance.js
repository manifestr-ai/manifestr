import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

// const DRIFT_ALERT_DEFAULT = {
//   model: 'GPT-4.1 v12',
//   severity: 'Critical',
//   timestamp: 'Sep 17, 10:32 UTC',
//   metricLabel: 'Rejection rate',
//   metricValue: '+14% vs baseline',
//   description: 'Unusual spike in content rejection patterns detected.',
//   affectedTools: ['Deck', 'Rewrite'],
//   samples: '247 samples analyzed',
// }

// const DEFAULT_AI_PERFORMANCE_DATA = {
//   header: {
//     title: 'AI Performance',
//     subtitle: 'Measure AI output quality, prompt performance, error logs, and latency alerts.',
//   },
//   filters: {
//     searchPlaceholder: 'Search files, content, and tags...',
//     options: {
//       Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
//       Cohort: ['All cohorts', 'New users', 'Returning', 'Power users'],
//       Persona: ['All personas', 'Founder', 'Operator', 'Investor'],
//       Device: ['All devices', 'Desktop', 'Mobile', 'Tablet'],
//     },
//   },
//   outputMetrics: {
//     cards: [
//       {
//         id: 'acceptance',
//         icon: 'acceptance',
//         title: 'Output Acceptance Rate',
//         value: '73.4%',
//         change: '+2.1%',
//         period: 'vs last 30d',
//       },
//       {
//         id: 'editAccept',
//         icon: 'editAccept',
//         title: 'Edit vs Accept Ratio',
//         value: '1 : 2.8',
//         change: '+0.3',
//         period: 'vs last 30d',
//       },
//       {
//         id: 'regenerations',
//         icon: 'regenerations',
//         title: 'Regen per Output',
//         value: '1.4×',
//         change: '-0.2×',
//         period: 'vs last 30d',
//       },
//       {
//         id: 'latency',
//         icon: 'latency',
//         title: 'Avg Time to Generate',
//         value: '4.7s',
//         change: '-0.6s',
//         period: 'vs last 30d',
//       },
//     ],
//   },
//   promptSuccess: {
//     title: 'Prompt Success',
//     success: 62,
//     failed: 38,
//     legend: [
//       { label: 'Success', color: '#8696b0' },
//       { label: 'Failed', color: '#18181b' },
//     ],
//   },
//   latencyTrend: {
//     title: 'MRR / ARR Trend',
//     filterOptions: ['Both', 'Series 1', 'Series 2'],
//     selectedFilter: 'Both',
//     months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     yLabels: ['10ms', '8ms', '6ms', '4ms', '2ms', '0ms'],
//     max: 10,
//     series: [
//       { label: 'Series 1', color: '#18181b', data: [5.0, 5.4, 5.6, 5.2, 5.8, 6.1, 6.4, 6.2, 6.5, 6.7, 7.0, 7.3] },
//       { label: 'Series 2', color: '#8696b0', data: [3.8, 4.1, 4.0, 4.3, 4.2, 4.5, 4.4, 4.6, 4.5, 4.7, 4.6, 4.9] },
//     ],
//   },
//   regenerations: {
//     title: 'Regenerations',
//     subtitle: '219 total regenerations',
//     rows: [
//       { label: 'Deck', caption: 'Share of total actions: 32%', value: '1,245' },
//       { label: 'Slide', caption: 'Share of total actions: 11%', value: '1,472' },
//       { label: 'Rewrite', caption: 'Share of total actions: 96%', value: '481' },
//       { label: 'Export', caption: 'Share of total actions: 99%', value: '2,482' },
//     ],
//   },
//   aiFeedback: {
//     title: 'AI Feedback',
//     xLabels: ['Positive', 'Neutral', 'Negative'],
//     yLabels: ['100%', '80%', '60%', '40%', '20%', '0%'],
//     max: 100,
//     values: [52, 88, 74],
//   },
//   completionRate: {
//     title: 'Prompt Completion Rate',
//     filterOptions: ['Last 7d', 'Last 30d', 'Last 90d'],
//     selectedFilter: 'Last 30d',
//     total: 12480,
//     bars: [
//       { label: 'Completed', value: 78, color: '#18181b' },
//       { label: 'Partial', value: 14, color: '#8696b0' },
//       { label: 'Abandoned', value: 8, color: '#e4e4e7' },
//     ],
//   },
//   aiLogs: {
//     title: 'AI Logs',
//     errors: [
//       {
//         id: 'err-1',
//         severity: 'Critical',
//         message: 'OpenAI API returned 500 during deck generation',
//         timestamp: 'Apr 21, 09:14 UTC',
//         model: 'GPT-4o',
//         tool: 'Deck',
//         detail: 'POST https://api.openai.com/v1/chat/completions\nStatus: 500 Internal Server Error\nRetry attempts: 3\nUser ID: usr_8af2c1',
//       },
//       {
//         id: 'err-2',
//         severity: 'Error',
//         message: 'Prompt token limit exceeded — input truncated',
//         timestamp: 'Apr 21, 08:47 UTC',
//         model: 'GPT-4o',
//         tool: 'Rewrite',
//         detail: 'Input tokens: 128,412 / limit: 128,000. Truncation applied at context boundary.',
//       },
//       {
//         id: 'err-3',
//         severity: 'Error',
//         message: 'Content policy violation — generation blocked',
//         timestamp: 'Apr 20, 22:33 UTC',
//         model: 'GPT-4.1',
//         tool: 'Slide',
//         detail: 'OpenAI moderation flagged request as potential policy violation. Category: violence/graphic.',
//       },
//       {
//         id: 'err-4',
//         severity: 'Warning',
//         message: 'Unexpected JSON structure in model response',
//         timestamp: 'Apr 20, 19:05 UTC',
//         model: 'GPT-4o-mini',
//         tool: 'Deck',
//         detail: 'Expected field "slides" not found in response. Fallback rendering applied.',
//       },
//       {
//         id: 'err-5',
//         severity: 'Warning',
//         message: 'Rate limit hit — request queued with 3.2s delay',
//         timestamp: 'Apr 20, 17:51 UTC',
//         model: 'GPT-4o',
//         tool: 'Rewrite',
//         detail: 'Rate limit: 10,000 TPM. Queued request executed after 3.2s. No user-facing error shown.',
//       },
//     ],
//     timeouts: [
//       {
//         id: 'to-1',
//         severity: 'Timeout',
//         message: 'Generation request timed out after 30s',
//         timestamp: 'Apr 21, 09:02 UTC',
//         model: 'GPT-4o',
//         tool: 'Deck',
//         detail: 'Request to /v1/chat/completions exceeded 30s timeout threshold. Connection aborted.',
//       },
//       {
//         id: 'to-2',
//         severity: 'Timeout',
//         message: 'Realtime session handshake timed out',
//         timestamp: 'Apr 21, 07:38 UTC',
//         model: 'gpt-4o-realtime',
//         tool: 'Home',
//         detail: 'WebRTC handshake with /v1/realtime/sessions did not complete within 10s. Session abandoned.',
//       },
//       {
//         id: 'to-3',
//         severity: 'Warning',
//         message: 'Slow response — 18.4s to first token',
//         timestamp: 'Apr 20, 23:11 UTC',
//         model: 'GPT-4.1',
//         tool: 'Slide',
//         detail: 'Time-to-first-token exceeded 15s warning threshold. Prompt length: 4,200 tokens.',
//       },
//       {
//         id: 'to-4',
//         severity: 'Timeout',
//         message: 'Status polling exceeded max retries',
//         timestamp: 'Apr 20, 20:44 UTC',
//         model: 'GPT-4o',
//         tool: 'Vault',
//         detail: 'Generation job /ai/generation/job_a8f2 polled 20 times without terminal state.',
//       },
//     ],
//   },
//   aiAlerts: {
//     title: 'Alerts',
//     failureSpikes: [
//       {
//         id: 'fs-1',
//         title: 'Deck tool — failure rate spike',
//         severity: 'Critical',
//         model: 'GPT-4o',
//         description: 'Failure rate jumped from 2.1% to 17.4% over the past 2 hours. Likely correlated with upstream API instability.',
//         metric: '+15.3% failure rate',
//         time: '2 hours ago',
//       },
//       {
//         id: 'fs-2',
//         title: 'Rewrite — rejection spike detected',
//         severity: 'High',
//         model: 'GPT-4.1',
//         description: 'Content rejection rate increased sharply. 34 consecutive rejections across 12 users.',
//         metric: '+34 rejections / hr',
//         time: '4 hours ago',
//       },
//       {
//         id: 'fs-3',
//         title: 'Global error rate above threshold',
//         severity: 'Warning',
//         model: 'All models',
//         description: 'Overall AI error rate at 5.8%, crossing the 5% alert threshold.',
//         metric: '5.8% error rate',
//         time: '6 hours ago',
//       },
//     ],
//     latencyIssues: [
//       {
//         id: 'li-1',
//         title: 'P95 latency breached 12s SLA',
//         severity: 'Critical',
//         model: 'GPT-4o',
//         description: 'P95 generation latency reached 14.2s, exceeding the 12s SLA target for Deck tool.',
//         metric: 'P95: 14.2s',
//         time: '1 hour ago',
//       },
//       {
//         id: 'li-2',
//         title: 'Realtime session — elevated TTFT',
//         severity: 'Warning',
//         model: 'gpt-4o-realtime',
//         description: 'Average time-to-first-token rose to 6.8s vs baseline of 2.1s. Investigating routing.',
//         metric: 'TTFT: 6.8s (+224%)',
//         time: '3 hours ago',
//       },
//       {
//         id: 'li-3',
//         title: 'Slow streaming — tokens/sec degraded',
//         severity: 'Warning',
//         model: 'GPT-4.1',
//         description: 'Streaming throughput dropped from 48 tok/s to 19 tok/s on Slide editor.',
//         metric: '19 tok/s (–60%)',
//         time: '5 hours ago',
//       },
//     ],
//   },
//   driftAlerts: {
//     title: 'Drift Alerts',
//     alerts: [
//       { ...DRIFT_ALERT_DEFAULT, id: 'alert-1' },
//       { ...DRIFT_ALERT_DEFAULT, id: 'alert-2' },
//       { ...DRIFT_ALERT_DEFAULT, id: 'alert-3' },
//       { ...DRIFT_ALERT_DEFAULT, id: 'alert-4' },
//     ],
//   },
//   predictiveSignals: {
//     highActivityCohorts: {
//       title: 'High Activity Cohorts',
//       cohorts: [
//         {
//           id: 'power-users',
//           name: 'Power Users',
//           badge: 'Very High',
//           metrics: [
//             { label: 'Users:', value: '234' },
//             { label: 'Avg Sessions:', value: '8.2/day' },
//             { label: 'Retention:', value: '94%' },
//             { label: 'Expansion:', value: 'Likely' },
//           ],
//           action: { label: 'Triger Upsell', intent: 'upgrade' },
//         },
//         {
//           id: 'growing-teams-1',
//           name: 'Growing Teams',
//           badge: 'High',
//           metrics: [
//             { label: 'Users:', value: '234' },
//             { label: 'Avg Sessions:', value: '8.2/day' },
//             { label: 'Retention:', value: '94%' },
//             { label: 'Expansion:', value: 'Likely' },
//           ],
//         },
//         {
//           id: 'growing-teams-2',
//           name: 'Growing Teams',
//           badge: 'High',
//           metrics: [
//             { label: 'Users:', value: '234' },
//             { label: 'Avg Sessions:', value: '8.2/day' },
//             { label: 'Retention:', value: '94%' },
//             { label: 'Expansion:', value: 'Likely' },
//           ],
//         },
//         {
//           id: 'new-adapters',
//           name: 'New Adapters',
//           badge: 'Very High',
//           metrics: [
//             { label: 'Users:', value: '234' },
//             { label: 'Avg Sessions:', value: '8.2/day' },
//             { label: 'Retention:', value: '94%' },
//             { label: 'Expansion:', value: 'Likely' },
//           ],
//           action: { label: 'Triger Upsell', intent: 'upgrade' },
//         },
//       ],
//     },
//     churnRiskHeatmap: {
//       title: 'Churn Risk Heatmap',
//       columns: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
//       rows: [
//         { segment: 'Trial', values: [100, 26, 80, 38] },
//         { segment: 'Basic', values: [75, 44, 100, 14] },
//         { segment: 'Pro', values: [80, 90, 75, 29] },
//         { segment: 'Enterprise', values: [30, 29, 38, 63] },
//       ],
//     },
//     aiFrustrationAlerts: {
//       title: 'AI Frustration Alerts',
//       alerts: [
//         {
//           id: 'techcorp',
//           title: 'TechCorp Inc.',
//           status: 'New',
//           description: 'High regeneration rate on presentaions',
//           score: '8.2/10',
//           time: '2 hours ago',
//         },
//         {
//           id: 'startup-xyz',
//           title: 'Startup XYZ',
//           status: 'InProgress',
//           description: 'High regeneration rate on presentaions',
//           score: '8.2/10',
//           time: '2 hours ago',
//         },
//       ],
//     },
//   },
// }

export const getAdminAiPerformanceData = async (params = {}) => {
  try {
    const res = await api.get(ENDPOINTS.ADMIN.AI_PERFORMANCE, {
      baseURL: API_BASE_URL,
      params,
    })

    return res?.data?.details || null
  } catch (err) {
    console.error(err)
    return null
  }
}
