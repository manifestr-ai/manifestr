/**
 * Knowledge Base category hub: /playbook/knowledge-base/[slug]
 * Each category lists articles; category pages render all articles in one flow
 * with anchors `kb-article-{slug}`. Optional `?article=` still scrolls to a section on load.
 */

const d = (slug, title, updated, readMinutes, extra = {}) => ({
  slug,
  title,
  updated,
  readMinutes,
  ...extra,
})

export const KB_CATEGORY_SLUGS = [
  'getting-started',
  'collaboration',
  'design',
  'integration',
  'security',
  'billing-plans',
  'troubleshooting',
  'mobile-app',
]

/** @type {Record<string, { title: string; description: string; defaultArticleSlug: string; articles: ReturnType<typeof d>[] }>} */
export const KB_CATEGORY_MAP = {
  'getting-started': {
    title: 'Getting Started',
    description: 'Learn the basics of MANIFESTR',
    defaultArticleSlug: 'first-project',
    articles: [
      d('introduction', 'Introduction to MANIFESTR', 'December 1, 2024', 3),
      d('first-project', 'Getting Started with Your First Project', 'January 15, 2025', 5, { rich: true }),
      d('inviting-team-members', 'Inviting Team Members', 'January 10, 2025', 4),
      d('creating-a-style-guide', 'Creating a Style Guide', 'January 8, 2025', 6),
      d('using-the-ai-assistant', 'Using the AI Assistant', 'January 5, 2025', 5),
      d('keyboard-shortcuts', 'Keyboard Shortcuts', 'December 20, 2024', 3),
      d('dashboard-overview', 'Dashboard overview', 'December 18, 2024', 4),
      d('account-setup-checklist', 'Account setup checklist', 'December 15, 2024', 3),
      d('workspace-terminology', 'Workspace terminology', 'December 12, 2024', 4),
      d('importing-existing-assets', 'Importing existing assets', 'December 10, 2024', 5),
      d('notifications-and-activity', 'Notifications and activity', 'December 8, 2024', 3),
      d('whats-new', "What's new in MANIFESTR", 'December 5, 2024', 2),
    ],
  },
  collaboration: {
    title: 'Collaboration',
    description: 'Team workflows and features',
    defaultArticleSlug: 'shared-workspaces',
    articles: Array.from({ length: 15 }, (_, i) => {
      const n = i + 1
      const topics = [
        'Shared workspaces overview',
        'Real-time co-editing basics',
        'Comments, mentions, and threads',
        'Sharing projects with guests',
        'Roles and permissions',
        'Version history and restores',
        'Team notifications',
        'Activity feed and audit trail',
        'Approvals and review flows',
        'Organizing teams and spaces',
        'Handoffs between departments',
        'Meeting notes in MANIFESTR',
        'Embedding external content',
        'Slack and email digests',
        'Collaboration best practices',
      ]
      return d(
        `collaboration-topic-${n}`,
        topics[i] || `Collaboration guide ${n}`,
        'January 12, 2025',
        4 + (i % 4)
      )
    }),
  },
  design: {
    title: 'Design',
    description: 'Design system and styling',
    defaultArticleSlug: 'design-system-overview',
    articles: Array.from({ length: 18 }, (_, i) => {
      const n = i + 1
      const topics = [
        'Design system overview',
        'Colors, type, and spacing tokens',
        'Components and variants',
        'Using the style guide tool',
        'Brand kits across projects',
        'Layouts and responsive frames',
        'Imagery and asset guidelines',
        'Accessibility checks',
        'Exporting for developers',
        'Design QA checklists',
        'Template libraries',
        'Theming dark and light modes',
        'Iconography standards',
        'Motion and interaction notes',
        'File naming conventions',
        'Design critiques in-app',
        'Moodboards and references',
        'Handoff to production',
      ]
      return d(`design-topic-${n}`, topics[i] || `Design topic ${n}`, 'January 11, 2025', 5 + (i % 3))
    }),
  },
  integration: {
    title: 'Integration',
    description: 'Connect with other Toolkit',
    defaultArticleSlug: 'integration-overview',
    articles: Array.from({ length: 10 }, (_, i) => {
      const titles = [
        'Integration overview',
        'Google Workspace connection',
        'Microsoft 365 connection',
        'Slack notifications',
        'Webhooks and automation',
        'API keys and security',
        'Importing from Notion',
        'Cloud storage providers',
        'Single sign-on (SSO)',
        'Custom integrations roadmap',
      ]
      const n = i + 1
      return d(`integration-topic-${n}`, titles[i] || `Integration topic ${n}`, 'January 9, 2025', 4 + (i % 3))
    }),
  },
  security: {
    title: 'Security',
    description: 'Privacy and security features',
    defaultArticleSlug: 'data-protection-overview',
    articles: Array.from({ length: 8 }, (_, i) => {
      const titles = [
        'Data protection overview',
        'Encryption at rest and in transit',
        'Access controls and SSO',
        'Compliance and certifications',
        'Data residency options',
        'Incident response',
        'Vendor and subprocessors',
        'Security FAQs',
      ]
      const n = i + 1
      return d(`security-topic-${n}`, titles[i] || `Security topic ${n}`, 'January 7, 2025', 3 + (i % 4))
    }),
  },
  'billing-plans': {
    title: 'Billing & Plans',
    description: 'Subscription management',
    defaultArticleSlug: 'plans-overview',
    articles: Array.from({ length: 7 }, (_, i) => {
      const titles = [
        'Plans overview',
        'Upgrading and downgrading',
        'Invoices and receipts',
        'Payment methods',
        'Wins and usage',
        'Cancellation policy',
        'Tax and VAT',
      ]
      const n = i + 1
      return d(`billing-topic-${n}`, titles[i] || `Billing topic ${n}`, 'January 6, 2025', 3 + (i % 2))
    }),
  },
  troubleshooting: {
    title: 'Troubleshooting',
    description: 'Common issues and fixes',
    defaultArticleSlug: 'common-issues',
    articles: Array.from({ length: 14 }, (_, i) => {
      const n = i + 1
      return d(
        `troubleshooting-topic-${n}`,
        `Fix: common issue ${n}`,
        'January 4, 2025',
        2 + (i % 5)
      )
    }),
  },
  'mobile-app': {
    title: 'Mobile App',
    description: 'Using MANIFESTR on mobile',
    defaultArticleSlug: 'mobile-overview',
    articles: Array.from({ length: 9 }, (_, i) => {
      const titles = [
        'Mobile app overview',
        'Installing and signing in',
        'Offline access',
        'Push notifications',
        'Mobile uploads',
        'Biometric lock',
        'Tablet layout tips',
        'Sync with desktop',
        'Mobile troubleshooting',
      ]
      const n = i + 1
      return d(`mobile-topic-${n}`, titles[i] || `Mobile topic ${n}`, 'January 3, 2025', 3 + (i % 3))
    }),
  },
}

export function getCategory(slug) {
  if (!slug || typeof slug !== 'string') return null
  return KB_CATEGORY_MAP[slug] || null
}

export function getArticle(categorySlug, articleSlug) {
  const cat = getCategory(categorySlug)
  if (!cat) return null
  return cat.articles.find((a) => a.slug === articleSlug) || null
}

export function resolveArticle(categorySlug, articleSlugFromQuery) {
  const cat = getCategory(categorySlug)
  if (!cat) return null
  if (articleSlugFromQuery) {
    const found = cat.articles.find((a) => a.slug === articleSlugFromQuery)
    if (found) return found
  }
  return (
    cat.articles.find((a) => a.slug === cat.defaultArticleSlug) || cat.articles[0] || null
  )
}
