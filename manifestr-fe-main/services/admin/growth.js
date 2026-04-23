import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from "../config";

// const DEFAULT_GROWTH_DATA = {
//   header: {
//     title: 'Growth & User Health',
//     subtitle: 'Understand acquisition quality and engagement.',
//   },
//   filters: {
//     searchPlaceholder: 'Search users, channels, regions...',
//     options: {
//       Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
//       Channel: ['All channels', 'Organic', 'Paid', 'Referral', 'Direct'],
//       Plan: ['All plans', 'Starter', 'Pro', 'Enterprise'],
//       Region: ['All regions', 'N. America', 'Europe', 'Asia', 'Other'],
//     },
//   },
//   stats: [
//     { title: 'New Signups (30d)', value: '2,430', change: '+8%', period: 'vs last 30d' },
//     { title: 'Activation Rate', value: '61%', change: '+3%', period: 'vs last 30d' },
//     { title: 'DAU / MAU', value: '38.2%', change: '+1.4%', period: 'vs last 30d' },
//     { title: 'Returning Users', value: '68%', change: '+2%', period: 'vs last 30d' },
//   ],
//   signupsOverTime: {
//     title: 'Signups Over Time',
//     filterOptions: ['last 7d', 'last 30d', 'last 90d', 'all time'],
//     selectedFilter: 'last 30d',
//     months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     series: [180, 220, 195, 240, 260, 300, 280, 320, 310, 340, 330, 365],
//     max: 400,
//     change: '+8%',
//     period: 'vs last 30d',
//   },
//   returningVsNew: {
//     title: 'Returning vs New Users',
//     filterOptions: ['last 7d', 'last 30d', 'last 90d'],
//     selectedFilter: 'last 30d',
//     months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     yLabels: ['600', '500', '400', '300', '200', '0'],
//     returning: [260, 310, 285, 330, 350, 380, 360, 400, 390, 420, 405, 440],
//     newUsers: [180, 220, 195, 240, 260, 300, 280, 320, 310, 340, 330, 365],
//     max: 600,
//     legend: [
//       { label: 'Returning', color: '#18181b' },
//       { label: 'New', color: '#a1a1aa' },
//     ],
//   },
//   breakdownByRegion: {
//     title: 'By Region',
//     xLabels: ['N. America', 'Europe', 'Asia', 'Other'],
//     values: [42, 28, 18, 12],
//     max: 50,
//     yLabels: ['50%', '40%', '30%', '20%', '10%', '0%'],
//     footer: 'Share of signups (%)',
//   },
//   breakdownBySource: {
//     title: 'By Source',
//     xLabels: ['Organic', 'Paid Search', 'Referral', 'Direct'],
//     values: [38, 26, 22, 14],
//     max: 50,
//     yLabels: ['50%', '40%', '30%', '20%', '10%', '0%'],
//     footer: 'Share of signups (%)',
//   },
//   breakdownByUserType: {
//     title: 'By User Type',
//     organic: 68,
//     paid: 32,
//     legend: [
//       { label: 'Returning', color: '#18181b' },
//       { label: 'New', color: '#94a3b8' },
//     ],
//   },
//   userHealthScore: {
//     title: 'User Health Score',
//     averageScore: 72,
//     distribution: {
//       green: { label: 'Healthy', range: '≥70', count: 8420, pct: 62 },
//       amber: { label: 'At Risk', range: '40–69', count: 3280, pct: 24 },
//       red: { label: 'Critical', range: '<40', count: 1900, pct: 14 },
//     },
//     weights: [
//       { label: 'Session Frequency', weight: 0.35 },
//       { label: 'Outputs Created', weight: 0.30 },
//       { label: 'Recency (last active)', weight: 0.20 },
//       { label: 'Features Used', weight: 0.15 },
//     ],
//   },
//   powerUsers: {
//     title: 'Power Users',
//     subtitle: 'Top 10% most active users this month',
//     rows: [
//       { id: 'u1', name: 'sarah@acme.com', company: 'Acme Corp', outputsCreated: 142, sessions: 48, lastActive: '2h ago', healthScore: 94 },
//       { id: 'u2', name: 'james@oriontech.io', company: 'Orion Tech', outputsCreated: 118, sessions: 41, lastActive: '6h ago', healthScore: 88 },
//       { id: 'u3', name: 'priya@nova.co', company: 'Nova Health', outputsCreated: 97, sessions: 36, lastActive: '1d ago', healthScore: 82 },
//       { id: 'u4', name: 'tom@brightlabs.io', company: 'BrightLabs', outputsCreated: 84, sessions: 29, lastActive: '2d ago', healthScore: 76 },
//       { id: 'u5', name: 'anna@horizon.co', company: 'Horizon Media', outputsCreated: 73, sessions: 24, lastActive: '3d ago', healthScore: 71 },
//       { id: 'u6', name: 'carlos@startup.xyz', company: 'Startup XYZ', outputsCreated: 61, sessions: 18, lastActive: '5d ago', healthScore: 58 },
//       { id: 'u7', name: 'mei@techventures.sg', company: 'Tech Ventures', outputsCreated: 52, sessions: 14, lastActive: '8d ago', healthScore: 44 },
//       { id: 'u8', name: 'luke@demo-co.com', company: 'Demo Co.', outputsCreated: 38, sessions: 9, lastActive: '14d ago', healthScore: 31 },
//     ],
//   },
// }

export async function getAdminGrowthData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.GROWTH, {
      params,
    })

    // backend must return full structure
    return response?.data?.details

  } catch (error) {
    console.error(
      'Growth API Error:',
      error?.response?.data || error.message
    )

    // no fallback anymore
    return null
  }
}