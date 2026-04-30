import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

// const DEFAULT_LIFECYCLE_DATA = {
//   header: {
//     title: 'User Lifecycle & Segmentation',
//     subtitle: 'Turn analytics into action — every stage, every segment.',
//   },
//   filters: {
//     searchPlaceholder: 'Search users, segments, plans...',
//     options: {
//       Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
//       Plan: ['All plans', 'Free', 'Pro', 'Team', 'Enterprise'],
//       Stage: ['All stages', 'New', 'Activated', 'Engaged', 'Power User', 'At Risk', 'Dormant', 'Churned', 'Reactivated'],
//       Persona: ['All personas', 'Founder', 'Operator', 'Investor'],
//     },
//   },
//   stats: [
//     { id: 'total', title: 'Total Users', value: '18,420', change: '+4%', period: 'vs last 30d' },
//     { id: 'engaged', title: 'Engaged + Power', value: '7,488', change: '+8%', period: 'vs last 30d' },
//     { id: 'atRisk', title: 'At Risk', value: '1,248', change: '-3%', period: 'vs last 30d' },
//     { id: 'reactivated', title: 'Reactivated (30d)', value: '284', change: '+22%', period: 'vs last 30d' },
//   ],
//   lifecycleStages: {
//     title: 'Lifecycle Stages',
//     subtitle: 'Distribution of users across all 8 lifecycle stages.',
//     total: 18420,
//     stages: [
//       { key: 'new',         label: 'New',         value: 1840,  share: 10, color: '#1e293b' },
//       { key: 'activated',   label: 'Activated',   value: 2940,  share: 16, color: '#334155' },
//       { key: 'engaged',     label: 'Engaged',     value: 4204,  share: 23, color: '#475569' },
//       { key: 'power_user',  label: 'Power User',  value: 3284,  share: 18, color: '#64748b' },
//       { key: 'at_risk',     label: 'At Risk',     value: 1248,  share: 7,  color: '#94a3b8' },
//       { key: 'dormant',     label: 'Dormant',     value: 2104,  share: 11, color: '#a1a1aa' },
//       { key: 'churned',     label: 'Churned',     value: 2516,  share: 14, color: '#d4d4d8' },
//       { key: 'reactivated', label: 'Reactivated', value: 284,   share: 1,  color: '#7c3aed' },
//     ],
//   },
//   segments: {
//     title: 'Lifecycle Segments',
//     subtitle: 'Per-stage metrics and action triggers for every user group.',
//     rows: [
//       {
//         id: 'new-signups',
//         stage: 'new',
//         stageLabel: 'New',
//         name: 'New Signups',
//         description: 'Signed up in the last 7 days',
//         users: '1,840',
//         avgOutputs: '0.8',
//         revenueValue: '$0',
//         lastActivity: '< 2d',
//         actions: [
//           { label: 'Trigger Onboarding', intent: 'onboarding' },
//         ],
//       },
//       {
//         id: 'activated',
//         stage: 'activated',
//         stageLabel: 'Activated',
//         name: 'Recently Activated',
//         description: 'Completed first key action within 7d',
//         users: '2,940',
//         avgOutputs: '3.4',
//         revenueValue: '$12,400',
//         lastActivity: '< 3d',
//         actions: [
//           { label: 'Trigger Onboarding', intent: 'onboarding' },
//           { label: 'Trigger Upgrade Prompt', intent: 'upgrade' },
//         ],
//       },
//       {
//         id: 'engaged',
//         stage: 'engaged',
//         stageLabel: 'Engaged',
//         name: 'Engaged Users',
//         description: '5–20 sessions in last 30d',
//         users: '4,204',
//         avgOutputs: '8.2',
//         revenueValue: '$48,600',
//         lastActivity: '< 1d',
//         actions: [
//           { label: 'Trigger Upgrade Prompt', intent: 'upgrade' },
//         ],
//       },
//       {
//         id: 'power-users',
//         stage: 'power_user',
//         stageLabel: 'Power User',
//         name: 'Power Users',
//         description: '>30 sessions, high output rate',
//         users: '3,284',
//         avgOutputs: '14.2',
//         revenueValue: '$84,200',
//         lastActivity: '< 1d',
//         actions: [
//           { label: 'Trigger Upgrade Prompt', intent: 'upgrade' },
//         ],
//       },
//       {
//         id: 'at-risk',
//         stage: 'at_risk',
//         stageLabel: 'At Risk',
//         name: 'At-Risk Accounts',
//         description: 'Usage dropped >40% vs prior 30d',
//         users: '1,248',
//         avgOutputs: '2.1',
//         revenueValue: '$22,800',
//         lastActivity: '< 8d',
//         actions: [
//           { label: 'Send Retention Email', intent: 'retention-email' },
//           { label: 'Trigger Win-back', intent: 'win-back' },
//         ],
//       },
//       {
//         id: 'dormant',
//         stage: 'dormant',
//         stageLabel: 'Dormant',
//         name: 'Dormant Users',
//         description: 'No activity in 30+ days',
//         users: '2,104',
//         avgOutputs: '0.2',
//         revenueValue: '$8,400',
//         lastActivity: '> 30d',
//         actions: [
//           { label: 'Trigger Win-back', intent: 'win-back' },
//           { label: 'Send Retention Email', intent: 'retention-email' },
//         ],
//       },
//       {
//         id: 'churned',
//         stage: 'churned',
//         stageLabel: 'Churned',
//         name: 'Churned Accounts',
//         description: 'Cancelled or lapsed billing',
//         users: '2,516',
//         avgOutputs: '0.0',
//         revenueValue: '$0',
//         lastActivity: '> 60d',
//         actions: [
//           { label: 'Trigger Win-back', intent: 'win-back' },
//         ],
//       },
//       {
//         id: 'reactivated',
//         stage: 'reactivated',
//         stageLabel: 'Reactivated',
//         name: 'Reactivated Users',
//         description: 'Returned after churn or 30d+ dormancy',
//         users: '284',
//         avgOutputs: '4.8',
//         revenueValue: '$6,200',
//         lastActivity: '< 5d',
//         actions: [
//           { label: 'Send Retention Email', intent: 'retention-email' },
//           { label: 'Trigger Upgrade Prompt', intent: 'upgrade' },
//         ],
//       },
//     ],
//   },
// }

export async function getAdminLifecycleData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.LIFECYCLE, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.details || null

  } catch (error) {
    console.error('Lifecycle API Error:', error?.response?.data || error.message)
    return null
  }
}