export const ADMIN_PRIMARY_ITEMS = [
  { label: 'Overview', href: '/admin/overview', icon: 'layoutDashboard' },
  { label: 'Growth & Acquisition', href: '/admin/growth', icon: 'users' },
]

export const ADMIN_GROUPED_ITEMS = [
  {
    heading: 'Analytics',
    items: [
      { label: 'Retention', href: '/admin/retention', icon: 'refreshCw' },
      { label: 'Lifecycle', href: '/admin/lifecycle', icon: 'workflow' },
      { label: 'Product Usage', href: '/admin/product-usage', icon: 'barChart3' },
    ],
  },
  {
    heading: 'Revenue & Sales',
    items: [
      { label: 'Feature Adaptation', href: '/admin/feature-adaptation', icon: 'puzzle' },
      { label: 'Monetization', href: '/admin/monetization', icon: 'shoppingCart' },
    ],
  },
  {
    heading: 'AI & Insights',
    items: [
      { label: 'AI Performance', href: '/admin/ai-performance', icon: 'brain' },
      { label: 'Platform Health', href: '/admin/platform-health', icon: 'signal' },
    ],
  },
]

export const DEFAULT_ADMIN_ROUTE = '/admin/overview'
