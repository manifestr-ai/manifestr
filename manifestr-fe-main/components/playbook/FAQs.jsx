import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'
import CldImage from '../ui/CldImage'

const HERO_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775045590/Container_1_wvlj7b.png'
const HERO_BG_MOBILE = 'https://www.figma.com/api/mcp/asset/adfa4784-8177-4390-8255-4e19c126cae6'
const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

const POPULAR_SEARCHES = [
  'What Toolkit are included?',
  'How do I upgrade?',
  'AI output quality',
  'Collaboration features',
]

const CATEGORIES = [
  { id: 'all', label: 'All Questions', count: 47, icon: 'help' },
  { id: 'billing', label: 'Billing and plans', count: 12, icon: 'card' },
  { id: 'technical', label: 'Technical Support', count: 10, icon: 'settings' },
  { id: 'account', label: 'Account Management', count: 30, icon: 'user' },
  { id: 'security', label: 'Security & Privacy', count: 6, icon: 'shield' },
  { id: 'features', label: 'Feature & Usage', count: 6, icon: 'zap' },
]

const FAQ_GROUPS = [
  {
    id: 'billing-subs',
    title: 'Billing & Subscriptions',
    category: 'billing',
    questions: [
      {
        id: 'tokens',
        q: 'What are tokens, and how do they work?',
        quickAnswer: 'Tokens are credits used to generate slides, visuals, documents, and insights. Each action consumes tokens based on complexity.',
        steps: [
          'Credits used to generate slides, visuals, documents, and insights.',
          'Credits used to generate slides, visuals, documents, and insights.',
          'Credits used to generate slides, visuals, documents, and insights.',
          'Credits used to generate slides, visuals, documents, and insights.',
        ],
        afterUpgrade: [
          'Credits used to generate slides, visuals, documents, and insights.',
          'Credits used to generate slides, visuals, documents, and insights.',
          'Credits used to generate slides, visuals, documents, and insights.',
          'Credits used to generate slides, visuals, documents, and insights.',
        ],
      },
      {
        id: 'upgrade-plan',
        q: 'How do I upgrade my plan?',
        quickAnswer: 'Navigate to Settings > Billing > Change Plan. Select your desired plan and confirm payment.',
      },
    ],
  },
  {
    id: 'ai-toolkit',
    title: 'AI Features & Smart Toolkit',
    category: 'features',
    questions: [
      {
        id: 'ai-quality',
        q: 'How does MANIFESTR ensure AI output quality?',
        quickAnswer: 'MANIFESTR uses advanced language models with built-in quality checks, brand-aware generation, and iterative refinement to produce professional-grade outputs.',
      },
      {
        id: 'ai-custom',
        q: 'Can I customise the AI outputs?',
        quickAnswer: 'Yes. You can set tone, style, and formatting preferences in your Style Guide to shape how AI generates content.',
      },
    ],
  },
  {
    id: 'collabs',
    title: 'Projects & Collaboration (Collabs)',
    category: 'account',
    questions: [
      {
        id: 'invite-team',
        q: 'How do I invite team members?',
        quickAnswer: 'Go to your project settings and click "Invite Members". Enter their email addresses and set permissions.',
      },
      {
        id: 'collab-roles',
        q: 'What collaboration roles are available?',
        quickAnswer: 'MANIFESTR supports Owner, Editor, and Viewer roles with granular permission controls.',
      },
    ],
  },
  {
    id: 'vault',
    title: 'Vault & Asset Management',
    category: 'features',
    questions: [
      {
        id: 'vault-storage',
        q: 'How much storage do I get in The Vault?',
        quickAnswer: 'Storage limits depend on your plan. Free plans include 500MB, while Pro and Enterprise plans offer significantly more.',
      },
      {
        id: 'vault-formats',
        q: 'What file formats does The Vault support?',
        quickAnswer: 'The Vault supports common image formats (PNG, JPG, SVG), documents (PDF, DOCX, PPTX), and brand assets.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & Technical',
    category: 'technical',
    questions: [
      {
        id: 'slow-gen',
        q: 'Why is content generation slow?',
        quickAnswer: 'Generation speed depends on complexity and server load. Try reducing the scope of your prompt or check our status page for any ongoing issues.',
      },
      {
        id: 'browser-support',
        q: 'Which browsers are supported?',
        quickAnswer: 'MANIFESTR works best on the latest versions of Chrome, Firefox, Safari, and Edge.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    category: 'all',
    questions: [
      {
        id: 'contact-support',
        q: 'How do I contact support?',
        quickAnswer: 'You can submit a ticket through The Playbook, email us at support@manifestr.com, or use the in-app chat.',
      },
      {
        id: 'response-time',
        q: 'What is the typical response time?',
        quickAnswer: 'We aim to respond within 24 hours on business days. Priority support is available on Pro and Enterprise plans.',
      },
    ],
  },
]

function CategoryIcon({ type, className = 'w-[16px] h-[16px]' }) {
  const icons = {
    help: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    card: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    user: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 10-16 0" />
      </svg>
    ),
    shield: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    zap: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  }
  return icons[type] || null
}

function QuestionDetail({ question }) {
  return (
    <div className="bg-[#f9fafb] border border-[#e4e4e7] rounded-[8px] p-[24px] flex-1 min-w-0 flex flex-col gap-[32px] md:self-stretch">
      <div className="flex items-center w-full">
        <span className="text-[18px] leading-[28px] font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
          {question.q}
        </span>
      </div>
      <div className="w-full h-px bg-[#e4e4e7]" />
      <div className="bg-[#f4f4f5] rounded-[16px] p-[24px] flex flex-col gap-[12px]">
        <span className="text-[18px] leading-[28px] font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
          Quick Answer
        </span>
        <p className="text-[14px] leading-[20px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {question.quickAnswer}
        </p>
      </div>
      {question.steps && (
        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[8px]">
            <span className="text-[16px] leading-[24px] font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
              Step-by-step upgrade process
            </span>
            <ul className="list-disc pl-[21px] flex flex-col gap-[12px]">
              {question.steps.map((step, i) => (
                <li key={i} className="text-[14px] leading-[20px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          {question.afterUpgrade && (
            <div className="flex flex-col gap-[8px]">
              <span className="text-[16px] leading-[24px] font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                What happens after upgrade
              </span>
              <ul className="list-disc pl-[21px] flex flex-col gap-[12px]">
                {question.afterUpgrade.map((item, i) => (
                  <li key={i} className="text-[14px] leading-[20px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="bg-[#fafafa] border border-dashed border-black rounded-[16px] p-[24px] md:p-[32px] flex flex-col gap-[32px] items-center">
        <div className="flex flex-col gap-[16px] items-start w-full">
          <p className="text-[20px] leading-[30px] font-semibold text-black text-center w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            Was this article helpful?
          </p>
          <div className="flex gap-[16px] w-full">
            <button className="flex-1 flex items-center justify-center gap-[8px] h-[44px] bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
              Yes
            </button>
            <button className="flex-1 flex items-center justify-center gap-[8px] h-[44px] bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
                <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
              </svg>
              No
            </button>
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <button className="flex items-center gap-[8px] px-[8px] py-[4px] text-[14px] font-medium text-[#18181b] hover:text-black transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy Link
          </button>
          <button className="flex items-center gap-[8px] px-[8px] py-[4px] text-[14px] font-medium text-[#18181b] hover:text-black transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

function ArrowIcon({ open }) {
  return (
    <svg
      className={`w-[16px] h-[16px] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState({})
  const [selectedQuestion, setSelectedQuestion] = useState(FAQ_GROUPS[0]?.questions[0] || null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGroups = useMemo(() => {
    if (searchQuery.trim()) {
      return FAQ_GROUPS.map((g) => ({
        ...g,
        questions: g.questions.filter((q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((g) => g.questions.length > 0)
    }
    if (activeCategory === 'all') return FAQ_GROUPS
    return FAQ_GROUPS.filter((g) => g.category === activeCategory)
  }, [activeCategory, searchQuery])

  const totalResults = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.questions.length, 0),
    [filteredGroups]
  )

  function toggleGroup(id) {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function selectQuestion(q) {
    setSelectedQuestion(q)
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative w-full h-[540px] md:h-[518px] flex flex-col items-stretch md:items-center justify-between md:justify-end p-[48px] md:pb-[48px] md:pt-[48px] md:px-[80px] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <CldImage src={HERO_BG_DESKTOP} alt="" className="hidden md:block absolute w-full h-full object-cover" />
          <img src={HERO_BG_MOBILE} alt="" className="md:hidden absolute w-full h-full object-cover" loading="eager" />
        </div>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-[24px] md:gap-[32px] w-full"
        >
          <div className="flex flex-col items-center gap-[25px] max-w-[847px] text-center w-full">
            <h1 className="text-[36px] md:text-[72px] leading-[44px] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] text-white">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                Frequently <span className="hidden md:inline">Asked</span><span className="md:hidden">asked</span>{' '}
              </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Questions</span>
            </h1>
            <p
              className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-white"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {"Find quick answers about MANIFESTR's Toolkit , plans, collaboration, and support."}
            </p>

            {/* Search */}
            <div className="bg-white rounded-[12px] md:rounded-[6px] border border-[#d5d7da] md:border-0 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex items-center gap-[8px] px-[14px] py-[10px] w-full md:w-[449px]">
              <svg className="w-[20px] h-[20px] text-[#71717a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-[16px] leading-[24px] text-black placeholder:text-[#71717a] outline-none bg-transparent"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-col items-center gap-[12px]">
            <span
              className="text-[12px] leading-[18px] font-semibold text-white"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Popular searches:
            </span>
            {/* Desktop: single row */}
            <div className="hidden md:flex flex-wrap items-center gap-[10px] justify-center">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-white rounded-[16px] px-[12px] py-[6px] text-[12px] leading-[18px] font-medium text-[#71717a] hover:text-[#18181b] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Mobile: 2 rows of 2, centered */}
            <div className="md:hidden flex flex-col items-stretch gap-[8px] w-[318px]">
              {[POPULAR_SEARCHES.slice(0, 2), POPULAR_SEARCHES.slice(2, 4)].map((row, i) => (
                <div key={i} className="flex gap-[10px] justify-center">
                  {row.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="bg-white/80 border border-[#e4e4e7] rounded-[16px] px-[12px] py-[6px] text-[12px] leading-[18px] font-medium text-[#71717a] hover:text-[#18181b] transition-colors whitespace-nowrap"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Tabs ─── */}
      {/* <PlaybookTabs /> */}

      {/* ─── FAQ Content ─── */}
      <section className="w-full bg-[#f9fafb] md:bg-white px-0 md:px-[80px] py-0 md:py-[96px]">
        {/* Desktop: 3-column dashed container */}
        <div className="hidden md:flex border border-black border-dashed rounded-[16px] p-[16px] gap-[24px] items-start justify-center">

          {/* Left sidebar — Categories */}
          <div className="bg-[#f9fafb] rounded-[8px] p-[16px] w-[298px] shrink-0 flex flex-col gap-[8px]">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery('') }}
                  className={`flex items-center gap-[12px] w-full px-[16px] py-[12px] rounded-[6px] transition-colors ${
                    isActive ? 'bg-white' : 'hover:bg-white/60'
                  }`}
                >
                  <span className="text-[#52525b]">
                    <CategoryIcon type={cat.icon} />
                  </span>
                  <span
                    className="flex-1 text-left text-[14px] leading-[20px] font-semibold text-[#52525b]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {cat.label}
                  </span>
                  <span className="border border-[#e4e4e7] rounded-[4px] px-[4px] py-px text-[12px] leading-[18px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Center — Questions accordion */}
          <div className="bg-[#f9fafb] rounded-[8px] p-[16px] flex-1 min-w-0 flex flex-col gap-[24px] self-stretch">
            <div className="bg-white border-b border-[#e4e4e7] rounded-[12px] overflow-hidden relative">
              <div className="px-[20px] py-[20px]">
                <p className="text-[16px] leading-[24px] font-semibold text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {activeCategory === 'all' ? 'All Questions' : CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </p>
              </div>
              <span
                className="absolute top-[12px] right-[16px] border border-[#e4e4e7] rounded-[16px] px-[8px] py-[2px] text-[12px] leading-[18px] font-medium text-[#71717a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {totalResults} results
              </span>
            </div>
            <div className="flex flex-col gap-[8px]">
              {filteredGroups.length === 0 ? (
                <p className="text-[16px] text-[#71717a] text-center py-[40px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No questions found.
                </p>
              ) : (
                filteredGroups.map((group) => {
                  const isExpanded = !!expandedGroups[group.id]
                  const isHighlighted = group.id === filteredGroups[0]?.id && !Object.keys(expandedGroups).length
                  return (
                    <div key={group.id}>
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={`w-full flex items-center justify-between px-[20px] py-[16px] rounded-[12px] border transition-colors ${
                          isExpanded || isHighlighted ? 'bg-[#f3f4f6] border-[#e4e4e7]' : 'bg-white border-[#e4e4e7]'
                        }`}
                      >
                        <span className="text-[20px] leading-[30px] font-medium text-black text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {group.title}
                        </span>
                        <ArrowIcon open={isExpanded} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-[4px] pt-[8px]">
                              {group.questions.map((q) => (
                                <button
                                  key={q.id}
                                  onClick={() => selectQuestion(q)}
                                  className={`w-full text-left px-[20px] py-[12px] rounded-[8px] transition-colors ${
                                    selectedQuestion?.id === q.id ? 'bg-[#f3f4f6]' : 'hover:bg-[#f9fafb]'
                                  }`}
                                >
                                  <span className="text-[14px] leading-[20px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {q.q}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right — Selected question detail (desktop) */}
          {selectedQuestion && (
            <QuestionDetail question={selectedQuestion} />
          )}
        </div>

        {/* Mobile: single-column stacked layout */}
        <div className="md:hidden flex flex-col">
          {/* Categories */}
          <div className="bg-[#f9fafb] border-b border-[#e4e4e7] px-[24px] py-[48px] flex flex-col gap-[8px]">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery('') }}
                  className={`flex items-center gap-[12px] w-full px-[16px] py-[12px] rounded-[6px] transition-colors ${
                    isActive ? 'bg-white' : 'hover:bg-white/60'
                  }`}
                >
                  <span className="text-[#52525b]">
                    <CategoryIcon type={cat.icon} />
                  </span>
                  <span
                    className="flex-1 text-left text-[14px] leading-[20px] font-semibold text-[#52525b]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {cat.label}
                  </span>
                  <span className="border border-[#e4e4e7] rounded-[4px] px-[4px] py-px text-[12px] leading-[18px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Questions accordion */}
          <div className="bg-[#f9fafb] border-b border-[#e4e4e7] px-[24px] py-[48px] flex flex-col gap-[24px]">
            <div className="bg-white border-b border-[#e4e4e7] rounded-[12px] overflow-hidden relative">
              <div className="px-[20px] py-[20px]">
                <p className="text-[16px] leading-[24px] font-semibold text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {activeCategory === 'all' ? 'All Questions' : CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </p>
              </div>
              <span
                className="absolute top-[12px] right-[16px] border border-[#e4e4e7] rounded-[16px] px-[8px] py-[2px] text-[12px] leading-[18px] font-medium text-[#71717a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {totalResults} results
              </span>
            </div>
            <div className="flex flex-col gap-[12px]">
              {filteredGroups.length === 0 ? (
                <p className="text-[16px] text-[#71717a] text-center py-[40px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No questions found.
                </p>
              ) : (
                filteredGroups.map((group) => {
                  const isExpanded = !!expandedGroups[group.id]
                  return (
                    <div key={group.id}>
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={`w-full flex items-center justify-between px-[20px] py-[16px] rounded-[12px] border transition-colors ${
                          isExpanded ? 'bg-[#f3f4f6] border-[#e4e4e7]' : 'bg-white border-[#e4e4e7]'
                        }`}
                      >
                        <span className="text-[16px] leading-[24px] text-black text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {group.title}
                        </span>
                        <ArrowIcon open={isExpanded} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-[4px] pt-[8px]">
                              {group.questions.map((q) => (
                                <button
                                  key={q.id}
                                  onClick={() => selectQuestion(q)}
                                  className={`w-full text-left px-[20px] py-[12px] rounded-[8px] transition-colors ${
                                    selectedQuestion?.id === q.id ? 'bg-[#f3f4f6]' : 'hover:bg-[#f9fafb]'
                                  }`}
                                >
                                  <span className="text-[14px] leading-[20px] font-medium text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {q.q}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Selected question detail (mobile — inline) */}
          {selectedQuestion && (
            <div className="px-[24px] py-[48px]">
              <QuestionDetail question={selectedQuestion} />
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="flex justify-center py-[36px] md:py-0 md:mt-[36px] bg-[#f9fafb] md:bg-transparent">
          <button
            className="flex items-center justify-center h-[44px] px-[16px] bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] leading-[20px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Load More Articles
          </button>
        </div>
      </section>

      {/* ─── Need More Help CTA ─── */}
      <section className="relative w-full h-[358px] md:h-[414px] flex items-center justify-center overflow-hidden px-6 md:px-0">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <CldImage src={CTA_BG} alt="" className="absolute w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-[24px] md:gap-[30px]">
          <div className="flex flex-col items-center gap-[12px] md:gap-[16px] text-center">
            <h2 className="text-[36px] md:text-[60px] leading-[44px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px] text-black">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
            </h2>
            <p
              className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#52525b] max-w-[316px] md:max-w-[603px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {"Can't find what you're looking for? Our support team is here to help you succeed with MANIFESTR."}
            </p>
          </div>
          <Link
            href="/playbook/submit-ticket"
            className="flex items-center justify-center h-[44px] px-[16px] bg-[#18181b] text-white rounded-[6px] text-[14px] leading-[20px] font-medium hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Submit a Support Ticket
          </Link>
        </div>
      </section>
    </>
  )
}
