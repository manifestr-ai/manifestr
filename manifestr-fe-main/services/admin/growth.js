import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_GROWTH_DATA = {
  header: {
    title: 'Growth & Acquisition',
    subtitle: 'Track how users discover, activate, and stay.',
  },
  filters: {
    searchPlaceholder: 'Search channels, campaigns...',
    options: {
      Timeframe: ['Last 7d', 'Last 30d', 'Last 90d', 'This year', 'All time'],
      Channel: ['All channels', 'Organic', 'Paid', 'Referral', 'Direct'],
      Plan: ['All plans', 'Starter', 'Pro', 'Enterprise'],
    },
  },
  stats: [
    { title: 'New Signups', value: '2,430', change: '+8%', period: 'vs last 30d' },
    { title: 'Activation %', value: '54%', change: '+12%', period: 'vs last 30d' },
    { title: 'DAU/MAU', value: '0.27', change: '+12%', period: 'vs last 30d' },
    { title: 'Invite Conv.', value: '34%', change: '+6%', period: 'vs last 30d' },
  ],
  mrrArrTrend: {
    title: 'MRR / ARR Trend',
    filterOptions: ['Both', 'Free', 'Paid'],
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
    legend: [
      { label: 'Free', color: '#18181b' },
      { label: 'Paid', color: '#a1a1aa' },
    ],
  },
  upgradesCancels: {
    title: 'Upgrades vs Cancels',
    filterOptions: ['last 7d', 'last 30d', 'last 90d'],
    selectedFilter: 'last 30d',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['500', '400', '300', '200', '100', '0'],
    upgrades: [40, 75, 47, 70, 10, 47, 40, 70, 47, 40, 70, 47],
    cancels: [55, 55, 18, 55, 32, 18, 55, 55, 18, 55, 55, 18],
    max: 500,
    legend: [
      { label: 'Upgrades', color: '#18181b' },
      { label: 'Cancels', color: '#a1a1aa' },
    ],
  },
  retentionTable: {
    title: 'Closed-Won This Month',
    periods: ['W1', 'W2', 'W3', 'W4', 'W5'],
    cohorts: [
      { label: 'May', values: [100, 26, 80, 38, 75] },
      { label: 'Jun', values: [75, 44, 100, 14, 38] },
      { label: 'Jul', values: [80, 90, 75, 29, 59] },
      { label: 'Aug', values: [30, 29, 38, 63, 100] },
      { label: 'Sep', values: [38, 80, 54, 75, 80] },
    ],
  },
  cacByChannel: {
    title: 'CAC by Channel',
    xLabels: ['Paid Search', 'Social', 'Email', 'Events'],
    values: [108, 76, 132, 132],
    max: 200,
    footer: 'Customer Acquisition Cost ($)',
  },
  cpsCppTrend: {
    title: 'CPS vs CPP',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['$500', '$400', '$300', '$200', '$100', '$0'],
    cpsData: [120, 140, 130, 155, 145, 160, 150, 170, 165, 175, 168, 180],
    cppData: [280, 320, 300, 350, 340, 360, 345, 380, 370, 390, 375, 400],
    max: 500,
    legend: [
      { label: 'CPS (Cost per Signup)', color: '#18181b' },
      { label: 'CPP (Cost per Paid)', color: '#a1a1aa' },
    ],
  },
  paidVsOrganic: {
    title: 'Paid vs Organic',
    organic: 62,
    paid: 38,
    legend: [
      { label: 'Organic', color: '#18181b' },
      { label: 'Paid', color: '#a1a1aa' },
    ],
  },
  arpuByChannel: {
    title: 'ARPU by Channel',
    xLabels: ['Paid Search', 'Social', 'Email', 'Events'],
    values: [108, 76, 132, 132],
    max: 200,
    footer: 'Customer Acquisition Cost ($)',
  },
}

export async function getAdminGrowthData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.GROWTH, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_GROWTH_DATA
  } catch (_error) {
    return DEFAULT_GROWTH_DATA
  }
}

export { DEFAULT_GROWTH_DATA }
