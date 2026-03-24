import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const TOOL_IMAGES = {
  strategist: 'https://www.figma.com/api/mcp/asset/1232619e-56ec-45d1-ade6-505f88052789',
  analyser: 'https://www.figma.com/api/mcp/asset/91c57640-d153-4a23-a2ee-85d8098d1854',
  briefcase: 'https://www.figma.com/api/mcp/asset/44d9d982-b982-4725-95f4-3f85e40dce26',
  designStudio: 'https://www.figma.com/api/mcp/asset/52777462-5102-479a-a3fe-1162f9b1e4a8',
  mLogo: 'https://www.figma.com/api/mcp/asset/503b5a4d-d6ce-4dda-857b-8da23e301830',
  wordsmith: 'https://www.figma.com/api/mcp/asset/644ff9a5-7586-458a-b596-d899ff4d40fa',
  deck: 'https://www.figma.com/api/mcp/asset/3381566f-175f-44fb-8c9c-385d2026182d',
  huddle: 'https://www.figma.com/api/mcp/asset/c72d86d7-5341-4f2d-b886-7657ea0b1e88',
  costCtrl: 'https://www.figma.com/api/mcp/asset/9411f739-d713-4266-b239-63250530150a',
}

const HERO_IMAGE = 'https://www.figma.com/api/mcp/asset/6231fc6a-4031-476c-9e99-4ec39076893d'

const TOOLS = [
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
      content: 'Turn objectives into clear, data-driven strategies.',
      quickTip: 'Upload a brief — STRATEGIST builds insights and goals in minutes.',
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
      content: 'Discover and report on data-driven insights.',
      quickTip: 'Connect your data for instant analysis.',
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
      content: 'Create professional briefs and documents.',
      quickTip: 'Start from templates or from scratch.',
    },
  },
  {
    slug: 'design-studio',
    image: TOOL_IMAGES.designStudio,
    titleParts: [
      { text: 'DESIGN ', font: 'hk', size: 30 },
      { text: 'studio', font: 'ivy', size: 40 },
    ],
    tags: ['Images', 'Visuals', 'Moodboards'],
    description: {
      title: 'Visual & Design',
      content: 'Build visuals and moodboards.',
      quickTip: 'Drag, drop, and design in one place.',
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
      content: 'Create and refine copy and messaging.',
      quickTip: 'Write and polish content in one place.',
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
      content: 'Create decks and pitches.',
      quickTip: 'AI-assisted slides in minutes.',
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
      content: 'Agendas, meetings, and memos.',
      quickTip: 'Run better meetings with structured agendas.',
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
      content: 'Control costs and forecast.',
      quickTip: 'Track budgets and forecasts in one place.',
    },
  },
]

function ToolCard({ tool, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  if (tool.type === 'logo') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="bg-[#18181b] rounded-[12px] border border-[#e4e3e1] flex items-center justify-center aspect-302/370 cursor-pointer"
      >
        <img src={tool.image} alt="MANIFESTR" className="w-[145px] h-[115px] object-contain" />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative bg-white rounded-[12px] overflow-hidden aspect-302/369 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col p-[12px] h-full">
        {/* Image */}
        <div className="relative w-full flex-1 rounded-[12px] overflow-hidden">
          <img
            src={tool.image}
            alt=""
            className="w-full h-full object-cover rounded-[12px] transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        </div>

        {/* Title + tags */}
        <div className="flex flex-col items-center mt-[10px]">
          <h3 className="text-center tracking-[-0.6px]">
            {tool.titleParts.map((part, i) => (
              <span
                key={i}
                className="text-black leading-[44px]"
                style={{
                  fontFamily: part.font === 'ivy'
                    ? "'IvyPresto Headline', serif"
                    : "'Hanken Grotesk', sans-serif",
                  fontWeight: part.font === 'ivy' ? 600 : 800,
                  fontStyle: part.font === 'ivy' ? 'italic' : 'normal',
                  fontSize: `${part.size}px`,
                }}
              >
                {part.text}
              </span>
            ))}
          </h3>
          <p
            className="text-[14px] leading-[20px] text-black text-center mt-[6px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {tool.tags.join(' • ')}
          </p>
        </div>
      </div>

      {/* Hover overlay — slides up from bottom */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isHovered ? 0 : '100%' }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 bg-white rounded-[12px] z-20 flex flex-col p-[16px]"
      >
        {/* Title on overlay */}
        <div className="flex flex-col items-center justify-center text-center mb-[10px]">
          <h3 className="text-center tracking-[-0.6px]">
            {tool.titleParts.map((part, i) => (
              <span
                key={i}
                className="text-black leading-[44px]"
                style={{
                  fontFamily: part.font === 'ivy'
                    ? "'IvyPresto Headline', serif"
                    : "'Hanken Grotesk', sans-serif",
                  fontWeight: part.font === 'ivy' ? 600 : 800,
                  fontStyle: part.font === 'ivy' ? 'italic' : 'normal',
                  fontSize: `${part.size}px`,
                }}
              >
                {part.text}
              </span>
            ))}
          </h3>
          <p
            className="text-[14px] leading-[20px] text-black text-center mt-[4px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {tool.tags.join(' • ')}
          </p>
        </div>

        {/* Description */}
        {tool.description && (
          <div className="flex-1 overflow-hidden flex flex-col gap-[8px]">
            <p
              className="font-bold text-[14px] leading-[20px] text-black"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {tool.description.title}
            </p>
            <p
              className="text-[14px] leading-[20px] text-[#52525b] line-clamp-3"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {tool.description.content}
            </p>
            {tool.description.quickTip && (
              <p
                className="text-[14px] leading-[20px] text-[#52525b] line-clamp-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className="font-bold text-black">Quick Tip:</span>{' '}
                {tool.description.quickTip}
              </p>
            )}
          </div>
        )}

        {/* Start Now button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (tool.slug) router.push(`/tools/${tool.slug}`)
          }}
          className="mt-[12px] w-full bg-[#18181b] hover:bg-[#27272a] text-white text-[14px] font-medium leading-[20px] py-[12px] px-[16px] rounded-[8px] transition-colors duration-200 shrink-0 cursor-pointer"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Start Now
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function ToolsGrid() {
  return (
    <section className="relative w-full bg-[#e9e9ea] overflow-hidden">
      <div
        aria-hidden="true"
        className="hidden xl:block absolute left-[-250px] top-0 bottom-0 w-[62%] overflow-hidden pointer-events-none"
      >
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-[95%] w-auto max-w-none object-cover object-[center_top]"
        />
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-[22%] translate-y-[23%] text-[200px] md:text-[300px] text-white opacity-[0.32] pointer-events-none select-none whitespace-nowrap leading-none"
        style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
      >
        ELEVATE
      </span>

      <div className="relative z-10 max-w-[1040px] mx-auto px-6 md:px-[80px] xl:max-w-[960px] xl:px-0 xl:ml-auto xl:mr-[15%] pt-[80px] pb-[260px] md:pt-[126px] md:pb-[320px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[40px] md:mb-[42px] max-w-[900px] mx-auto"
        >
          <h2 className="text-[28px] md:text-[36px] leading-[1.35] md:leading-[49px] tracking-[-0.72px] capitalize mb-[16px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
              Eight intelligent tools. One connected{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              System.
            </span>
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[26px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            High-end, executive-level documentation across strategy, decks, documents, data, visuals and
            delivery, produced through one seamless system. MANIFESTR enables professionals to move
            from idea to execution with speed and confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[14px] gap-y-[24px] md:gap-x-[26px] md:gap-y-[36px]">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.type === 'logo' ? 'logo' : tool.titleParts.map(p => p.text).join('')} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
