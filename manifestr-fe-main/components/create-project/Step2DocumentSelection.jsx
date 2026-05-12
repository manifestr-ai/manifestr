import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'
import { DOCUMENT_DROPDOWN_OPTIONS } from './documentDropdownOptions'

/** Step 2: banner + four document cards per toolkit (tool id from create-project.js). */
export const STEP2_BY_TOOL_ID = {
  analyser: {
    bannerSrc: '/assets/banners/the-analyzer.svg',
    bannerTitle: 'THE ANALYZER',
    documents: [
      {
        id: 'analyser-charts',
        title: 'Charts',
        subtitle: 'Traditional & business-orientated',
        imageSrc: '/assets/cards/analyzer1.svg',
      },
      {
        id: 'analyser-graphs',
        title: 'Graphs',
        subtitle: 'Flows, networks & relationships',
        imageSrc: '/assets/cards/analyzer2.svg',
      },
      {
        id: 'analyser-maps',
        title: 'Maps',
        subtitle: 'Geospatial & location-based',
        imageSrc: '/assets/cards/analyzer3.svg',
      },
      {
        id: 'analyser-insights',
        title: 'Insights',
        subtitle: 'Reports & dashboards',
        imageSrc: '/assets/cards/analyzer4.svg',
      },
    ],
  },
  'design-studio': {
    bannerSrc: '/assets/banners/design-studio.svg',
    documents: [
      {
        id: 'design-brand-identity',
        title: 'Brand & Identity',
        subtitle: 'Brand rules, style, creative direction',
        imageSrc: '/assets/cards/design-studio1.svg',
      },
      {
        id: 'design-inspiration',
        title: 'Inspiration & Concepts',
        subtitle: 'Ideas, mood, creative alignment',
        imageSrc: '/assets/cards/design-studio2.svg',
      },
      {
        id: 'design-assets',
        title: 'Assets & Editing',
        subtitle: 'Create, edit, refine visuals',
        imageSrc: '/assets/cards/design-studio3.svg',
      },
      {
        id: 'design-campaigns',
        title: 'Campaigns & Launches',
        subtitle: 'From concept to market execution',
        imageSrc: '/assets/cards/design-studio4.svg',
      },
    ],
  },
  huddle: {
    bannerSrc: '/assets/banners/the-huddle.svg',
    documents: [
      {
        id: 'huddle-pre-meeting',
        title: 'Pre-Meeting / Setup',
        subtitle: 'Prep & alignment',
        imageSrc: '/assets/cards/huddle1.svg',
      },
      {
        id: 'huddle-in-meeting',
        title: 'In-Meeting Docs',
        subtitle: 'Live capture & decisions',
        imageSrc: '/assets/cards/huddle2.svg',
      },
      {
        id: 'huddle-follow-up',
        title: 'Post-Meeting Follow-Ups',
        subtitle: 'Recaps & accountability',
        imageSrc: '/assets/cards/huddle3.svg',
      },
      {
        id: 'huddle-specialized',
        title: 'Specialized Meeting Types',
        subtitle: 'Specific formats & contexts',
        imageSrc: '/assets/cards/huddle4.svg',
      },
    ],
  },
  wordsmith: {
    bannerSrc: '/assets/banners/the-wordsmith.svg',
    bannerTitle: 'THE WORDSMITH',
    documents: [
      {
        id: 'wordsmith-marketing',
        title: 'Marketing & Campaigns',
        subtitle: 'Persuasive, sales-focused copy',
        imageSrc: '/assets/cards/wordsmith1.svg',
      },
      {
        id: 'wordsmith-editorial',
        title: 'Editorial & Long Form',
        subtitle: 'Thought leadership & storytelling',
        imageSrc: '/assets/cards/wordsmith2.svg',
      },
      {
        id: 'wordsmith-corporate',
        title: 'Corporate & Professional',
        subtitle: 'Formal, structured communication',
        imageSrc: '/assets/cards/wordsmith3.svg',
      },
      {
        id: 'wordsmith-creative',
        title: 'Creative, Community & Localization',
        subtitle: 'Engagement-driven & adaptive',
        imageSrc: '/assets/cards/wordsmith4.svg',
      },
    ],
  },
  'cost-ctrl': {
    bannerSrc: '/assets/banners/cost-ctrl.svg',
    bannerTitle: 'COST CTRL',
    documents: [
      {
        id: 'cost-budgets',
        title: 'Budgets & Forecasts',
        subtitle: 'Planning, estimating, projecting',
        imageSrc: '/assets/cards/cost-ctrl1.svg',
      },
      {
        id: 'cost-transactions',
        title: 'Transactions & Tracking',
        subtitle: 'Ongoing spend & payments',
        imageSrc: '/assets/cards/cost-ctrl2.svg',
      },
      {
        id: 'cost-reconciliation',
        title: 'Reconciliation & Reporting',
        subtitle: 'Planned vs actual',
        imageSrc: '/assets/cards/cost-ctrl3.svg',
      },
      {
        id: 'cost-strategy',
        title: 'Profitability, Compliance & Strategy',
        subtitle: 'Financial health & decisions',
        imageSrc: '/assets/cards/cost-ctrl4.svg',
      },
    ],
  },
  briefcase: {
    bannerSrc: '/assets/banners/the-briefcase.svg',
    documents: [
      {
        id: 'briefcase-briefs',
        title: 'Briefs & Plans',
        subtitle: 'Front-end alignment and preparation',
        imageSrc: '/assets/cards/briefcase1.svg',
      },
      {
        id: 'briefcase-reports',
        title: 'Reports & Debriefs',
        subtitle: 'Post-action insights & accountability',
        imageSrc: '/assets/cards/briefcase2.svg',
      },
      {
        id: 'briefcase-contracts',
        title: 'Contracts & Compliance',
        subtitle: 'Formal agreements & governance',
        imageSrc: '/assets/cards/briefcase3.svg',
      },
      {
        id: 'briefcase-operations',
        title: 'Operations & Delivery',
        subtitle: 'Execution tools & structured processes',
        imageSrc: '/assets/cards/briefcase4.svg',
      },
    ],
  },
  deck: {
    bannerSrc: '/assets/banners/the-deck.svg',
    documents: [
      {
        id: 'deck-proposals',
        title: 'Proposals',
        subtitle: 'Pitches, bids, recommendations',
        imageSrc: '/assets/cards/deck1.svg',
      },
      {
        id: 'deck-plans',
        title: 'Plans',
        subtitle: 'Strategy, roadmaps, direction',
        imageSrc: '/assets/cards/deck2.svg',
      },
      {
        id: 'deck-reports',
        title: 'Reports',
        subtitle: 'Performance, insights, results',
        imageSrc: '/assets/cards/deck3.svg',
      },
      {
        id: 'deck-presentations',
        title: 'Presentations',
        subtitle: 'Training, keynotes, inspiration',
        imageSrc: '/assets/cards/deck4.svg',
      },
    ],
  },
  strategist: {
    bannerSrc: '/assets/banners/the-strategist.svg',
    documents: [
      {
        id: 'strategist-analysis',
        title: 'Analysis & Research',
        subtitle: 'Deep dives & external views',
        imageSrc: '/assets/cards/strategist1.svg',
      },
      {
        id: 'strategist-frameworks',
        title: 'Frameworks & Tools',
        subtitle: 'Strategic models & matrices',
        imageSrc: '/assets/cards/strategist2.svg',
      },
      {
        id: 'strategist-playbooks',
        title: 'Strategic Plans & Playbooks',
        subtitle: 'Action-orientated growth docs',
        imageSrc: '/assets/cards/strategist3.svg',
      },
      {
        id: 'strategist-people',
        title: 'People & Organization',
        subtitle: 'Structures & alignment',
        imageSrc: '/assets/cards/strategist4.svg',
      },
    ],
  },
}

// Fallback when tool has no dedicated step-2 config (first four per output type)
const documentTypesByOutput = {
  presentation: [
    {
      id: 'pitch-deck',
      title: 'Pitch Deck',
      subtitle: 'Startups, fundraising, sales',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
    },
    {
      id: 'sales-deck',
      title: 'Sales Deck',
      subtitle: 'B2B sales, product demos',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
    },
    {
      id: 'qbr',
      title: 'QBR',
      subtitle: 'Quarterly business reviews',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
    },
    {
      id: 'marketing-deck',
      title: 'Marketing Deck',
      subtitle: 'Campaigns, brand strategy',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'Design showcase, case studies',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
    },
    {
      id: 'keynote',
      title: 'Keynote',
      subtitle: 'Conferences, big announcements',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
    },
    {
      id: 'training',
      title: 'Training',
      subtitle: 'Workshops, educational decks',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
    },
    {
      id: 'all-hands',
      title: 'All Hands',
      subtitle: 'Company updates, culture',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
    },
  ],
  document: [
    {
      id: 'report',
      title: 'Report',
      subtitle: 'Analysis, summaries, insights',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
    },
    {
      id: 'brief',
      title: 'Brief',
      subtitle: 'Creative, strategic, tactical',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
    },
    {
      id: 'article',
      title: 'Article',
      subtitle: 'Blog posts, thought leadership',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
    },
    {
      id: 'memo',
      title: 'Memo',
      subtitle: 'Internal announcements, policy',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
    },
    {
      id: 'case-study',
      title: 'Case Study',
      subtitle: 'Customer success stories',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
    },
    {
      id: 'white-paper',
      title: 'White Paper',
      subtitle: 'In-depth industry analysis',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
    },
    {
      id: 'proposal',
      title: 'Proposal',
      subtitle: 'Project bids, scope of work',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
    },
    {
      id: 'specs',
      title: 'Specifications',
      subtitle: 'Product requirements, tech specs',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
    },
  ],
  spreadsheet: [
    {
      id: 'financial-model',
      title: 'Financial Model',
      subtitle: 'Forecasts, valuations',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
    },
    {
      id: 'budget',
      title: 'Budget',
      subtitle: 'Expense tracking, planning',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
    },
    {
      id: 'project-tracker',
      title: 'Project Tracker',
      subtitle: 'Timelines, Gantt charts',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      subtitle: 'Stock management, logistics',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
    },
    {
      id: 'marketing-analytics',
      title: 'Marketing Analytics',
      subtitle: 'Campaign performance',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
    },
    {
      id: 'sales-pipeline',
      title: 'Sales Pipeline',
      subtitle: 'CRM data, deal tracking',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
    },
    {
      id: 'cap-table',
      title: 'Cap Table',
      subtitle: 'Equity distribution, rounds',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
    },
    {
      id: 'invoice',
      title: 'Invoice',
      subtitle: 'Billing, accounts receivable',
      imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
    },
  ],
}

function DocumentCard({ document, isSelected, isOpen, options, onClick, onToggleDropdown, onDocumentTypeSelect }) {
  return (
    <div
      data-doc-card="true"
      onClick={onClick}
      className={`relative flex flex-col p-2 justify-between rounded-xl cursor-pointer transition-all duration-200 ${isOpen ? 'z-50' : 'z-0'} ${isSelected
        ? 'border-2 border-[#000000] shadow-lg'
        : 'border-2 border-transparent shadow-sm hover:shadow-md'
        }`}
    >
      <div>
      <div className="relative w-full h-[118px] bg-gray-200 rounded-t-xl overflow-hidden">
        {document.imageSrc ? (
          <Image
            src={document.imageSrc}
            alt={document.title}
            fill
            quality={100}
            className="object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-full bg-base-muted flex items-center justify-center">
            <span className="text-base-muted-foreground text-sm">Image</span>
          </div>
        )}
      </div>

      <div className="p-2 w-full mt-2 flex flex-col items-center">
          <h3 className="font-hero font-medium text-[16px] text-[#16192C] mb-1">
            {document.title}
          </h3>
          <p className="text-[14px] text-center text-[#425466]">
            {document.subtitle}
          </p>
      </div>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggleDropdown()
        }}
        className="flex items-center justify-center py-1.5 my-1 gap-2 bg-black text-white w-full rounded-md text-sm transition-colors hover:bg-[#242424] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-expanded={isOpen}
      >
        Select Document
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute left-2 right-2 top-[calc(100%-4px)] z-50 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-[#efefef] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#737373]">
              {options.length} document{options.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="max-h-[min(52vh,320px)] overflow-y-auto overscroll-contain p-1.5">
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={`${document.id}-${option.title}`}
                  type="button"
                  onClick={() => onDocumentTypeSelect(option)}
                  className="group flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#f5f5f5] focus:bg-[#f5f5f5] focus:outline-none"
                >
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium leading-5 text-[#16192C] group-hover:text-black">
                      {option.title}
                    </span>
                    {option.editor && (
                      <span className="mt-0.5 block text-[11px] leading-4 text-[#737373]">
                        {option.editor}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-[#525252]">
                    Open
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-[13px] text-[#737373]">
                No documents configured for this section yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function renderToolTitle(title, textColor = 'text-white') {
  if (!title) return null
  const upper = title.toUpperCase()
  if (upper.startsWith('THE ')) {
    const rest = title.substring(4)
    return (
      <span className="flex items-baseline">
        <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.6px] ${textColor}`}>
          THE&nbsp;
        </span>
        <span
          className={`font-accent italic font-bold text-[40px] leading-[44px] tracking-[-0.72px] ${textColor} lowercase`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {rest}
        </span>
      </span>
    )
  }
  if (title.includes(' ')) {
    const parts = title.split(' ')
    const firstPart = parts[0]
    const rest = parts.slice(1).join(' ')
    return (
      <span className="flex items-baseline">
        <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.72px] ${textColor}`}>
          {firstPart}&nbsp;
        </span>
        <span
          className={`font-accent italic font-bold text-[40px] leading-[44px] tracking-[-0.72px] ${textColor} lowercase`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {rest}
        </span>
      </span>
    )
  }
  return (
    <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.6px] ${textColor}`}>
      {title}
    </span>
  )
}

function getStep2Config(selectedTool) {
  if (!selectedTool?.id) return null
  return STEP2_BY_TOOL_ID[selectedTool.id] || null
}

export default function Step2DocumentSelection({ selectedTool, selectedDocument, onDocumentSelect }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [confidentialMode, setConfidentialMode] = useState(false)
  const [openDocumentId, setOpenDocumentId] = useState(null)

  const step2 = getStep2Config(selectedTool)
  const toolTitle = selectedTool?.title || 'Tool'

  const baseDocuments = useMemo(() => {
    if (step2?.documents?.length) return step2.documents
    const byOutput = documentTypesByOutput[selectedTool?.outputType] || documentTypesByOutput.presentation
    return byOutput
  }, [step2, selectedTool?.outputType])

  const filteredDocuments = useMemo(() => {
    return baseDocuments
  }, [baseDocuments])

  const searchDocumentMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []

    const rankMatch = (option) => {
      const title = option.title.toLowerCase()
      const editor = (option.editor || '').toLowerCase()

      if (title === q) return 0
      if (title.startsWith(q)) return 1
      if (title.includes(q)) return 2
      if (editor.includes(q)) return 3
      return 4
    }

    return baseDocuments
      .flatMap((category) => {
        const options = DOCUMENT_DROPDOWN_OPTIONS[category.title] || []
        return options
          .map((option) => ({
            category,
            option,
            rank: rankMatch(option),
          }))
          .filter((match) => match.rank < 4)
      })
      .sort((a, b) => a.rank - b.rank || a.option.title.localeCompare(b.option.title))
      .slice(0, 40)
  }, [baseDocuments, searchQuery])

  const selectedDocumentId = typeof selectedDocument === 'string'
    ? selectedDocument
    : selectedDocument?.categoryId

  const handleDocumentTypeSelect = (category, option) => {
    setOpenDocumentId(null)
    onDocumentSelect({
      id: `${category.id}:${option.title}`,
      categoryId: category.id,
      categoryTitle: category.title,
      title: option.title,
      editor: option.editor,
    })
  }

  const bannerSrc = step2?.bannerSrc || selectedTool?.imageSrc
  const bannerTitle = step2?.bannerTitle ?? toolTitle
  // Dedicated step-2 banner art already includes the toolkit title in the image
  const showBannerTitleOverlay = !step2?.bannerSrc

  return (
    <div className="flex flex-col gap-[35px] items-center w-full max-w-[1110px] mx-auto">
      <div className="relative w-full h-[186px] rounded-xl overflow-hidden">
        {bannerSrc && (
          <div className="absolute inset-0">
            <Image
              src={bannerSrc}
              alt={bannerTitle}
              fill
              quality={100}
              className="object-cover object-[center_28%]"
              priority
            />
            <div className={`absolute inset-0 ${showBannerTitleOverlay ? 'bg-black/20' : 'bg-black/0'}`} />
          </div>
        )}
        {showBannerTitleOverlay && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="flex items-center text-center">
              {renderToolTitle(bannerTitle, 'text-white')}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[12px] items-center w-full">
        <div className="flex flex-col gap-[5px] items-center w-full">
          <h1 className="font-hero font-semibold text-[36px] tracking-[-0.72px] text-black text-center">
            Let&apos;s create your document
          </h1>
          <p className="text-[16px] text-center text-base-muted-foreground+">
            Select what you&apos;re creating - we&apos;ll shape it into something polished.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {filteredDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isSelected={selectedDocumentId === doc.id || openDocumentId === doc.id}
            isOpen={openDocumentId === doc.id}
            options={DOCUMENT_DROPDOWN_OPTIONS[doc.title] || []}
            onClick={() => {
              setOpenDocumentId((currentId) => (currentId === doc.id ? null : doc.id))
            }}
            onToggleDropdown={() => {
              setOpenDocumentId((currentId) => (currentId === doc.id ? null : doc.id))
            }}
            onDocumentTypeSelect={(option) => handleDocumentTypeSelect(doc, option)}
          />
        ))}
      </div>

      <div className={`relative w-full max-w-[630px] ${searchQuery.trim() ? 'z-40' : 'z-10'}`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c7c7c]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && searchDocumentMatches[0]) {
                event.preventDefault()
                handleDocumentTypeSelect(searchDocumentMatches[0].category, searchDocumentMatches[0].option)
              }
            }}
            placeholder="Not Seeing it? Just type it in"
            className="w-full h-[40px] pl-12 pr-4 border border-[#dadada] rounded-lg bg-[#f6f6f6] text-[14px] leading-[20px] text-black placeholder:text-base-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#dadada] focus:border-[#dadada]"
          />
        </div>

        {searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#efefef] px-4 py-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#737373]">
                Document matches
              </p>
              <p className="text-[12px] text-[#737373]">
                {searchDocumentMatches.length > 0 ? 'Press Enter for top result' : 'No exact document found'}
              </p>
            </div>
            <div className="max-h-[min(42vh,300px)] overflow-y-auto overscroll-contain p-1.5">
              {searchDocumentMatches.length > 0 ? (
                searchDocumentMatches.map(({ category, option }) => (
                  <button
                    key={`${category.id}-search-${option.title}`}
                    type="button"
                    onClick={() => handleDocumentTypeSelect(category, option)}
                    className="group flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#f5f5f5] focus:bg-[#f5f5f5] focus:outline-none"
                  >
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium leading-5 text-[#16192C] group-hover:text-black">
                        {option.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-[#737373]">
                        {category.title}{option.editor ? ` - ${option.editor}` : ''}
                      </span>
                    </span>
                    <span className="mt-0.5 shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-[#525252]">
                      Select
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-center text-[13px] text-[#737373]">
                  Try a broader term, or open the closest category dropdown.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 w-full flex-wrap">
        <span className="text-[14px] leading-[24px] text-black">
          Confidential Mode
        </span>
        <span className="text-[14px] leading-[24px] text-base-muted-foreground+">
          |
        </span>
        <span className="text-[14px] leading-[24px] text-base-muted-foreground+">
          Extra Safeguard for sensitive work
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={confidentialMode}
            onChange={(e) => setConfidentialMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-base-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18181B]"></div>
        </label>
      </div>
    </div>
  )
}
