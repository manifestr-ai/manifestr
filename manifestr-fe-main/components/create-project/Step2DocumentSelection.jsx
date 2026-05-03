import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'

/** Step 2: banner + four document cards per toolkit (tool id from create-project.js). */
const STEP2_BY_TOOL_ID = {
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
    { id: 'pitch-deck', title: 'Pitch Deck', subtitle: 'Startups, fundraising, sales', imageSrc: '/assets/dummy/tool-card-1.jpg' },
    { id: 'sales-deck', title: 'Sales Deck', subtitle: 'B2B sales, product demos', imageSrc: '/assets/dummy/tool-card-2.png' },
    { id: 'qbr', title: 'QBR', subtitle: 'Quarterly business reviews', imageSrc: '/assets/dummy/tool-card-3.jpg' },
    { id: 'marketing-deck', title: 'Marketing Deck', subtitle: 'Campaigns, brand strategy', imageSrc: '/assets/dummy/tool-card-4.jpg' },
  ],
  document: [
    { id: 'report', title: 'Report', subtitle: 'Analysis, summaries, insights', imageSrc: '/assets/dummy/tool-card-1.jpg' },
    { id: 'brief', title: 'Brief', subtitle: 'Creative, strategic, tactical', imageSrc: '/assets/dummy/tool-card-2.png' },
    { id: 'article', title: 'Article', subtitle: 'Blog posts, thought leadership', imageSrc: '/assets/dummy/tool-card-3.jpg' },
    { id: 'memo', title: 'Memo', subtitle: 'Internal announcements, policy', imageSrc: '/assets/dummy/tool-card-4.jpg' },
  ],
  spreadsheet: [
    { id: 'financial-model', title: 'Financial Model', subtitle: 'Forecasts, valuations', imageSrc: '/assets/dummy/tool-card-1.jpg' },
    { id: 'budget', title: 'Budget', subtitle: 'Expense tracking, planning', imageSrc: '/assets/dummy/tool-card-2.png' },
    { id: 'project-tracker', title: 'Project Tracker', subtitle: 'Timelines, Gantt charts', imageSrc: '/assets/dummy/tool-card-3.jpg' },
    { id: 'inventory', title: 'Inventory', subtitle: 'Stock management, logistics', imageSrc: '/assets/dummy/tool-card-4.jpg' },
  ],
  chart: [
    { id: 'chart-dashboard', title: 'Dashboard', subtitle: 'KPIs and performance views', imageSrc: '/assets/dummy/tool-card-1.jpg' },
    { id: 'chart-trends', title: 'Trends', subtitle: 'Time series and comparisons', imageSrc: '/assets/dummy/tool-card-2.png' },
    { id: 'chart-breakdown', title: 'Breakdown', subtitle: 'Segments and distributions', imageSrc: '/assets/dummy/tool-card-3.jpg' },
    { id: 'chart-forecast', title: 'Forecast', subtitle: 'Projections and scenarios', imageSrc: '/assets/dummy/tool-card-4.jpg' },
  ],
}

function DocumentCard({ document, isSelected, onClick }) {
  return (
    <div
      data-doc-card="true"
      onClick={onClick}
      className={`flex flex-col p-2 justify-between rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${isSelected
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
      <button className='flex items-center justify-center py-1.5 my-1 gap-2 bg-black text-white w-full rounded-md text-sm'>Select Document <ChevronDown className='w-4 h-4' /></button>
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

  const step2 = getStep2Config(selectedTool)
  const toolTitle = selectedTool?.title || 'Tool'

  const baseDocuments = useMemo(() => {
    if (step2?.documents?.length) return step2.documents
    const byOutput = documentTypesByOutput[selectedTool?.outputType] || documentTypesByOutput.presentation
    return byOutput
  }, [step2, selectedTool?.outputType])

  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return baseDocuments
    return baseDocuments.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q)
    )
  }, [baseDocuments, searchQuery])

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
            isSelected={selectedDocument === doc.id}
            onClick={() => onDocumentSelect(doc.id)}
          />
        ))}
      </div>

      {searchQuery.trim() && filteredDocuments.length === 0 && (
        <p className="text-sm text-base-muted-foreground+">No matches. Try another search.</p>
      )}

      <div className="w-full max-w-[630px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c7c7c]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Not Seeing it? Just type it in"
            className="w-full h-[40px] pl-12 pr-4 border border-[#dadada] rounded-lg bg-[#f6f6f6] text-[14px] leading-[20px] text-black placeholder:text-base-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#dadada] focus:border-[#dadada]"
          />
        </div>
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
