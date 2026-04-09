import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const TOOL_IMAGES = {
  strategist: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943913/Frame_2147229006-3_bmpqki.jpg',
  analyser: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943913/Frame_2147229988_qqmda6.jpg',
  briefcase: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943914/Frame_2147229988-1_t5bpbd.jpg',
  designStudio: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943913/Frame_2147229006-5_nyawnk.jpg',
  mLogo: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774944350/Manifestr_Icon_Reverse_2_rwa1j0.svg',
  wordsmith: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943913/Frame_2147229006-2_dnxkir.jpg',
  deck: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943913/Frame_2147229006-4_edhaou.jpg',
  huddle: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943914/Frame_2147229006_s7kczy.jpg',
  costCtrl: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943913/Frame_2147229006-1_ohfioc.jpg',
}

const TOOL_THUMBS = {
  deck: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648466/Stra_knxfh3.png',
  analyzer: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648468/Stra-2_vrwn3v.png',
  'cost-ctrl': 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648467/Stra-1_qiykoo.png',
  strategist: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648465/Stra-8_zhxvh2.png',
  wordsmith: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648462/Stra-6_bdrpoz.png',
  huddle: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648462/Stra-5_oakd3c.png',
  briefcase: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648462/Stra-4_p60d5g.png',
  'design-studio': 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775648462/Stra-3_qbmovn.png',
}

const HERO_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774944466/37_modern-founder_model-07-shot-02b_2_wj98bv.svg'

/* Copy aligned with components/landing/ToolkitSection.jsx `tools` */
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
      content: 'Turn objectives into clear, data-driven strategies and roadmaps.',
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
      content: 'Data reports, competitive analyses and insight-driven documents.',
    },
  },
  {
    slug: 'briefcase',
    image: TOOL_IMAGES.briefcase,
    titleParts: [
      { text: 'THE ', font: 'hk', size: 30 },
      { text: 'BRIEFCASE', font: 'ivy', size: 40 },
    ],
    tags: ['Briefs', 'Templates', 'Documents'],
    description: {
      title: 'Briefs & Documents',
      content: 'Polished briefs, proposals and strategic documents for every pitch.',
    },
  },
  {
    slug: 'design-studio',
    image: TOOL_IMAGES.designStudio,
    titleParts: [
      { text: 'Design ', font: 'hk', size: 30 },
      { text: 'studio', font: 'ivy', size: 40 },
    ],
    tags: ['Images', 'Visuals', 'Moodboards'],
    description: {
      title: 'Visual & Design',
      content: 'Custom visuals, social assets and branded graphics in minutes.',
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
      content: 'Long-form copy, articles, scripts and written content with AI.',
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
      { text: 'The ', font: 'hk', size: 30 },
      { text: 'huddle', font: 'ivy', size: 40 },
    ],
    tags: ['Agendas', 'Meetings', 'Minutes'],
    description: {
      title: 'Meetings & Memos',
      content: 'Meeting notes, agendas and action plans to keep teams aligned.',
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
      content: 'Smart budgets, cost breakdowns and financial summaries built fast.',
    },
  },
]

/* ── Desktop grid card ── */
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
        className="relative rounded-[12px] border border-[#e4e3e1] flex items-center justify-center aspect-302/370 cursor-pointer overflow-hidden"
      >
        <CldImage
          src="https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943941/Wordsmith_1_jfi1kq.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)]" />
        <CldImage src={tool.image} alt="MANIFESTR" className="relative z-10 w-[145px] h-[115px] object-contain" />
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
        <div className="relative w-full flex-1 rounded-[12px] overflow-hidden">
          <CldImage
            src={tool.image}
            alt=""
            className="w-full h-full object-cover rounded-[12px] transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        </div>

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

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isHovered ? 0 : '100%' }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 bg-white rounded-[12px] z-20 flex flex-col p-[16px]"
      >
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

/* ── Mobile vertical accordion card ── */
function MobileToolAccordion({ tool, isExpanded, onTap }) {
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
      {/* Thumbnail — visible when collapsed */}
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

      {/* Full image — visible when expanded */}
      <CldImage
        src={tool.image}
        alt={`${titleText} ${accentText}`}
        className="absolute inset-0 w-full h-full object-cover object-right"
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

      {/* Expanded: title + description at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end"
        style={{
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          transitionDelay: isExpanded ? '0.15s' : '0s',
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        <p className="uppercase tracking-[0.8px] whitespace-nowrap">
          <span
            className="text-[20px] leading-[36px] font-extrabold text-white"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            {titleText}{' '}
          </span>
          <span
            className="text-[23px] leading-[36px] lowercase italic text-white"
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

      {/* Collapsed: left-aligned name */}
      <div
        className="absolute inset-0 flex items-center justify-start gap-1 pl-5"
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
          className="text-[24px] leading-[37px] text-[#282828] italic lowercase tracking-[0.96px]"
          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
        >
          {accentText}
        </span>
      </div>
    </div>
  )
}

const MOBILE_TOOL_ORDER = ['deck', 'strategist', 'cost-ctrl', 'analyzer', 'design-studio', 'briefcase', 'huddle', 'wordsmith']

export default function ToolsGrid() {
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)
  const mobileTools = MOBILE_TOOL_ORDER.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(Boolean)

  return (
    <section className="relative w-full bg-[#e9e9ea] overflow-hidden">
      {/* Desktop hero image */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute top-0 bottom-0 overflow-hidden pointer-events-none   "
      >
        <CldImage
          src={HERO_IMAGE}
          alt=""
          className="h-[102%] w-auto max-w-none object-cover mt-[-108px] object-top"
          priority
        />
      </div>

      {/* ELEVATE watermark */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 translate-y-[23%] text-[91px] md:text-[200px] lg:text-[300px] opacity-[0.32] pointer-events-none select-none whitespace-nowrap leading-none left-[21px] md:left-auto lg:left-[18%] xl:left-[12%] 2xl:left-[20%]"
        style={{
          fontFamily: "'IvyPresto Headline', serif",
          fontWeight: 600,
          fontStyle: 'italic',
          color: '#a3a3a3',
        }}
      >
        ELEVATE
      </span>

      {/* ── MOBILE ── */}
      <div className="md:hidden relative z-10 px-6 pt-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-[329px] mx-auto"
        >
          <h2 className="text-[32px] leading-[45px] tracking-[-0.65px] capitalize mb-4">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
              Eight intelligent tools. One connected{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              System.
            </span>
          </h2>
          <p
            className="text-[18px] leading-[26px] text-[#52525b] max-w-[321px] mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            High-end, executive-level documentation across strategy, decks,
            documents, data, visuals and delivery, produced through one seamless
            system. MANIFESTR enables professionals to move from idea to
            execution with speed and confidence.
          </p>
        </motion.div>

        <div className="flex flex-col gap-[17px] max-w-[345px] mx-auto">
          {mobileTools.map((tool, index) => (
            <MobileToolAccordion
              key={tool.slug}
              tool={tool}
              isExpanded={mobileActiveIndex === index}
              onTap={() => setMobileActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block relative z-10 max-w-[1040px] mx-auto px-[80px] lg:max-w-[700px] lg:px-0 lg:ml-auto lg:mr-[5%] xl:max-w-[960px] xl:mr-[8%] 2xl:ml-[32%] 2xl:mr-auto pt-[126px] pb-[320px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[42px] max-w-[900px] mx-auto"
        >
          <h2 className="text-[36px] leading-[49px] tracking-[-0.72px] capitalize mb-[16px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
              Eight intelligent tools. One connected{' '}
            </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              System.
            </span>
          </h2>
          <p
            className="text-[18px] leading-[26px] text-[#52525b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            High-end, executive-level documentation across strategy, decks,
            documents, data, visuals and delivery, produced through one seamless
            system. MANIFESTR enables professionals to move from idea to
            execution with speed and confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-x-[26px] gap-y-[36px]">
          {TOOLS.map((tool, i) => (
            <ToolCard
              key={tool.type === 'logo' ? 'logo' : tool.titleParts.map((p) => p.text).join('')}
              tool={tool}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
