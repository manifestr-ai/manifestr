import api from '../../lib/api'
import { API_BASE_URL, ENDPOINTS } from '../config'

const DEFAULT_MONETIZATION_DATA = {
  header: {
    title: 'Monetization',
    subtitle: 'Track revenue, conversion, and plan-level performance.',
  },
  filters: {
    Timeframe: {
      label: '30 days',
      options: ['7 days', '30 days', '90 days', 'This year', 'All time'],
    },
    Plan: {
      label: 'All plans',
      options: ['All plans', 'Free', 'Pro', 'Team', 'Enterprise'],
    },
    Region: {
      label: 'All regions',
      options: ['All regions', 'N. America', 'Europe', 'Asia', 'Other'],
    },
    Segment: {
      label: 'All segments',
      options: ['All segments', 'Founder', 'Operator', 'Investor', 'Analyst'],
    },
  },
  totalRevenue: {
    title: 'Total Revenue',
    value: '$678K',
    change: '+15.2%',
    period: 'vs last month',
  },
  mrr: {
    title: 'MRR',
    value: '$47.2K',
    change: '+6.1%',
    period: 'vs last month',
  },
  arr: {
    title: 'ARR',
    value: '$566K',
    change: '+12.4%',
    period: 'vs last year',
  },
  freeToPaid: {
    title: 'Free → Paid',
    value: '25.0%',
    change: '+2.1pp',
    period: 'vs last month',
  },
  upgradeRate: {
    title: 'Upgrade Rate',
    value: '8.4%',
    change: '+1.3pp',
    period: 'vs last month',
  },
  downgradeRate: {
    title: 'Downgrade Rate',
    value: '2.1%',
    change: '-0.4pp',
    period: 'vs last month',
    changeNegativeIsGood: true,
  },
  revenueTrend: {
    title: 'Revenue Trend',
    subtitle: 'MRR and ARR over the last 12 months.',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yLabels: ['60K', '50K', '40K', '30K', '20K', '10K', '0'],
    max: 60,
    min: 0,
    filterOptions: ['MRR', 'ARR (÷12)', 'Both'],
    selectedFilter: 'Both',
    series: [
      {
        key: 'mrr',
        label: 'MRR',
        color: '#18181b',
        data: [32, 34, 36, 38, 38.5, 40, 41, 42, 43, 44, 46, 47.2],
      },
      {
        key: 'arr_m',
        label: 'ARR (÷12)',
        color: '#a1a1aa',
        data: [33, 35, 37, 39, 40, 41.5, 42.5, 44, 44.5, 46, 47, 48.5],
      },
    ],
  },
  revenueByPlan: {
    title: 'Revenue by Plan',
    subtitle: 'Monthly recurring revenue contribution per plan.',
    total: 47200,
    rows: [
      { plan: 'Enterprise', revenue: 18400, formatted: '$18.4K', color: '#18181b' },
      { plan: 'Team',       revenue: 12800, formatted: '$12.8K', color: '#3f3f46' },
      { plan: 'Pro',        revenue: 10600, formatted: '$10.6K', color: '#71717a' },
      { plan: 'Free',       revenue: 5400,  formatted: '$5.4K',  color: '#a1a1aa' },
    ],
  },
  conversionFunnel: {
    title: 'Free → Paid Conversion Funnel',
    subheading: 'Sign-up to retained paying customer',
    rows: [
      { label: 'Free Users',      sublabel: '10,000 users', percent: 100, display: '100%' },
      { label: 'Trial Started',   sublabel: '3,500 users',  percent: 35,  display: '35.0%' },
      { label: 'Paid Conversion', sublabel: '2,500 users',  percent: 25,  display: '25.0%' },
      { label: 'Retained (30d)',  sublabel: '1,995 users',  percent: 20,  display: '20.0%' },
    ],
  },
  exportUsageByPlan: {
    title: 'Export Usage by Plan',
    subtitle: 'Total exports broken down by export type and plan.',
    legend: [
      { key: 'pdf',   label: 'PDF',   color: '#18181b' },
      { key: 'pptx',  label: 'PPTX',  color: '#3f3f46' },
      { key: 'docx',  label: 'DOCX',  color: '#71717a' },
      { key: 'other', label: 'Other', color: '#d4d4d8' },
    ],
    plans: [
      { label: 'Free',       values: [320, 140, 90,  50]  },
      { label: 'Pro',        values: [890, 620, 310, 140] },
      { label: 'Team',       values: [1240, 980, 540, 220] },
      { label: 'Enterprise', values: [1820, 1460, 820, 380] },
    ],
    max: 2000,
    yLabels: ['2000', '1500', '1000', '500', '0'],
  },
  paywallEvents: {
    title: 'Paywall Interaction Events',
    subtitle: 'User interactions with upgrade prompts and paywall screens.',
    events: [
      {
        id: 'shown',
        label: 'Paywall Shown',
        description: 'Users who encountered a paywall screen',
        count: '4,820',
        rate: null,
        trend: '+12%',
        color: '#3f3f46',
      },
      {
        id: 'clicked',
        label: 'Upgrade Clicked',
        description: 'Users who clicked an upgrade CTA',
        count: '1,936',
        rate: '40.2%',
        trend: '+8%',
        color: '#18181b',
      },
      {
        id: 'plan_selected',
        label: 'Plan Selected',
        description: 'Users who reached the plan selection screen',
        count: '1,248',
        rate: '25.9%',
        trend: '+5%',
        color: '#52525b',
      },
      {
        id: 'completed',
        label: 'Payment Completed',
        description: 'Users who successfully converted',
        count: '874',
        rate: '18.1%',
        trend: '+11%',
        color: '#18181b',
      },
      {
        id: 'abandoned',
        label: 'Checkout Abandoned',
        description: 'Users who dropped off at payment step',
        count: '374',
        rate: '7.8%',
        trend: '-3%',
        color: '#71717a',
      },
    ],
  },
  topRevenueUsers: {
    title: 'Top Users by Revenue',
    subtitle: 'Highest-value individual accounts this period.',
    rows: [
      { user: 'Orion Global Ltd',  plan: 'Enterprise', mrr: '$4,800', outputs: 1840, lastActive: '2d ago' },
      { user: 'BrightTech Inc',    plan: 'Enterprise', mrr: '$3,200', outputs: 1420, lastActive: '1d ago' },
      { user: 'Zenith Capital',    plan: 'Team',       mrr: '$1,800', outputs: 920,  lastActive: '4h ago' },
      { user: 'Nova Health',       plan: 'Team',       mrr: '$1,600', outputs: 780,  lastActive: '1d ago' },
      { user: 'Horizon Inc',       plan: 'Pro',        mrr: '$980',   outputs: 540,  lastActive: '3d ago' },
      { user: 'SkyBridge Analytics', plan: 'Pro',      mrr: '$840',   outputs: 460,  lastActive: '5h ago' },
      { user: 'Apex Ventures',     plan: 'Team',       mrr: '$720',   outputs: 390,  lastActive: '2d ago' },
    ],
  },
}

export async function getAdminMonetizationData(params = {}) {
  try {
    const response = await api.get(ENDPOINTS.ADMIN.MONETIZATION, {
      baseURL: API_BASE_URL,
      params,
    })

    return response?.data?.data || response?.data || DEFAULT_MONETIZATION_DATA
  } catch (_error) {
    return DEFAULT_MONETIZATION_DATA
  }
}

export { DEFAULT_MONETIZATION_DATA }
