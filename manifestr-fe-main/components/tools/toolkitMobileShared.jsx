import { useRouter } from 'next/router'
import CldImage from '../ui/CldImage'

const TOOL_IMAGES = {
  strategist: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
  analyser: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
  briefcase: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
  designStudio: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
  mLogo: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774944350/Manifestr_Icon_Reverse_2_rwa1j0.svg',
  wordsmith: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
  deck: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
  huddle: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
  costCtrl: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
}

const TOOL_THUMBS = {
  deck: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
  analyzer: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
  'cost-ctrl': 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
  strategist: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
  wordsmith: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
  huddle: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
  briefcase: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
  'design-studio': 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
}

/* Shared with ToolsGrid desktop grid + landing ToolkitSection mobile accordion */
export const TOOLS = [
  {
    slug: 'strategist',
    image: TOOL_IMAGES.strategist,
    titleParts: [
      { text: 'THE ', font: 'hk', size: 30 },
      { text: 'strategist', font: 'ivy', size: 40 },
    ],
    tags: ['Strategy', 'Positioning', 'Direction'],
    description: {
      title: 'Strategy & Positioning',
      content:
        'Strategic plans, positioning and decision frameworks backed by data and built to execute.',
    },
  },
  {
    slug: 'analyzer',
    image: TOOL_IMAGES.analyser,
    titleParts: [
      { text: 'THE ', font: 'hk', size: 30 },
      { text: 'analyzer', font: 'ivy', size: 40 },
    ],
    tags: ['Insights', 'Analysis', 'Reporting'],
    description: {
      title: 'Insights & Analysis',
      content:
        'Data and insights shaped into charts and visuals for confident decision-making.',
    },
  },
  {
    slug: 'briefcase',
    image: TOOL_IMAGES.briefcase,
    titleParts: [
      { text: 'THE ', font: 'hk', size: 30 },
      { text: 'briefcase', font: 'ivy', size: 40 },
    ],
    tags: ['Briefs', 'Templates', 'Documents'],
    description: {
      title: 'Briefs & Documents',
      content:
        'Structured, professional documentation including briefs, reports, timelines and run sheets.',
    },
  },
  {
    slug: 'design-studio',
    image: TOOL_IMAGES.designStudio,
    titleParts: [
      { text: 'DESIGN ', font: 'hk', size: 30 },
      { text: ' studio', font: 'ivy', size: 40 },
    ],
    tags: ['Images', 'Visuals', 'Moodboards'],
    description: {
      title: 'Visual & Design',
      content:
        'Polished, editable images and visuals that elevate everything you create in MANIFESTR.',
    },
  },
  {
    type: 'logo',
    image: TOOL_IMAGES.mLogo,
  },
  {
    slug: 'wordsmith',
    image: TOOL_IMAGES.wordsmith,
    titleParts: [
      { text: 'THE ', font: 'hk', size: 30 },
      { text: 'wordsmith', font: 'ivy', size: 40 },
    ],
    tags: ['Copy', 'Content', 'Messaging'],
    description: {
      title: 'Copy & Content',
      content:
        'Professional copywriter delivering brand-aligned writing across formats and audiences.',
    },
  },
  {
    slug: 'deck',
    image: TOOL_IMAGES.deck,
    titleParts: [
      { text: 'THE ', font: 'hk', size: 30 },
      { text: 'deck', font: 'ivy', size: 40 },
    ],
    tags: ['Presentations', 'Slides', 'Pitches'],
    description: {
      title: 'Presentations',
      content:
        'On-brand, editable presentation decks with visuals, charts and structured slides.',
    },
  },
  {
    slug: 'huddle',
    image: TOOL_IMAGES.huddle,
    titleParts: [
      { text: 'THE ', font: 'hk', size: 30 },
      { text: 'huddle', font: 'ivy', size: 40 },
    ],
    tags: ['Agendas', 'Meetings', 'Minutes'],
    description: {
      title: 'Meetings & Memos',
      content:
        'Agendas, minutes, summaries and follow-ups, structured to support a continuous flow.',
    },
  },
  {
    slug: 'cost-ctrl',
    image: TOOL_IMAGES.costCtrl,
    titleParts: [
      { text: 'COST ', font: 'hk', size: 30 },
      { text: 'CTRL', font: 'ivy', size: 40 },
    ],
    tags: ['Costs', 'Budgets', 'Forecasting'],
    description: {
      title: 'Budgets & Forecasting',
      content:
        'Budgets, forecasts, financials and reconciliations delivered in a clear, structured format.',
    },
  },
]

export const MOBILE_TOOL_ORDER = [
  'deck',
  'strategist',
  'cost-ctrl',
  'analyzer',
  'design-studio',
  'briefcase',
  'huddle',
  'wordsmith',
]

export function MobileToolAccordion({ tool, isExpanded, onTap }) {
  const router = useRouter()
  const titleText = tool.titleParts[0].text.trim()
  const accentText = tool.titleParts[1].text
  const thumbSrc = TOOL_THUMBS[tool.slug]

  return (
    <div
      onClick={() => {
        if (isExpanded && tool.slug) {
          router.push(`/tools/${tool.slug}`)
        } else {
          onTap()
        }
      }}
      className="relative w-full overflow-hidden cursor-pointer"
      style={{
        height: isExpanded ? 232 : 59,
        borderRadius: isExpanded ? 20 : 125,
        transition:
          'height 0.45s cubic-bezier(.4,0,.2,1), border-radius 0.45s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {thumbSrc && (
        <CldImage
          src={thumbSrc}
          alt={`${titleText} ${accentText}`}
          className="absolute top-0 bottom-0 right-0 w-[70%] h-full object-cover object-right"
          style={{
            opacity: isExpanded ? 0 : 1,
            transition: 'opacity 0.35s cubic-bezier(.4,0,.2,1)',
          }}
        />
      )}

      <CldImage
        src={tool.image}
        alt={`${titleText} ${accentText}`}
        className="absolute inset-0 w-full h-full object-cover object-top-right"
        style={{
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.35s cubic-bezier(.4,0,.2,1)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isExpanded
            ? 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)'
            : 'linear-gradient(to left, transparent 44%, white 68%)',
          transition: 'background 0.45s cubic-bezier(.4,0,.2,1)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end"
        style={{
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          transitionDelay: isExpanded ? '0.15s' : '0s',
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        <p className="uppercase tracking-[0.8px] text-white text-balance">
          <span
            className="text-[20px] leading-[36px] font-extrabold"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            {titleText}{' '}
          </span>
          <span
            className={`text-[23px] leading-[36px] italic ${tool.slug === 'cost-ctrl' ? 'uppercase' : 'lowercase'}`}
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
          >
            {accentText}
          </span>
        </p>
        <p
          className="text-[12px] leading-[17px] text-white font-medium mt-1 max-w-[298px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {tool.description.content}
        </p>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-start flex-wrap gap-x-1 gap-y-0 pl-5 pr-2"
        style={{
          opacity: isExpanded ? 0 : 1,
          transition: 'opacity 0.25s ease',
          transitionDelay: isExpanded ? '0s' : '0.18s',
          pointerEvents: isExpanded ? 'none' : 'auto',
        }}
      >
        <span
          className="text-[20px] leading-[37px] font-extrabold text-[#282828] uppercase tracking-[0.88px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          {titleText}
        </span>
        <span
          className={`text-[24px] leading-[37px] text-[#282828] italic tracking-[0.96px] ${tool.slug === 'cost-ctrl' ? 'uppercase' : 'lowercase'}`}
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
        >
          {accentText}
        </span>
      </div>
    </div>
  )
}

// Default export required so Turbopack can include this module in a page chunk
export default MobileToolAccordion
