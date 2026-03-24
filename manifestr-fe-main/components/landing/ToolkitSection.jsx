import { useState } from 'react'
import Link from 'next/link'

const TOOLKIT_BG = '/assets/landing/toolkit-bg.jpg'

const tools = [
  {
    id: 'deck',
    title: 'THE',
    accent: 'deck',
    description:
      'On-brand, editable presentation decks with visuals, charts and structured slides.',
    image:
      'https://www.figma.com/api/mcp/asset/aca9bee8-c136-4c54-9dc4-ba4805182290',
  },
  {
    id: 'strategist',
    title: 'THE',
    accent: 'strategist',
    description:
      'Turn objectives into clear, data-driven strategies and roadmaps.',
    image:
      'https://www.figma.com/api/mcp/asset/fb8c8ab0-8cfe-42e2-8970-9b3fccd1bd79',
  },
  {
    id: 'cost-ctrl',
    title: 'COST',
    accent: 'CTRL',
    description:
      'Smart budgets, cost breakdowns and financial summaries built fast.',
    image:
      'https://www.figma.com/api/mcp/asset/19e788dc-38c9-4e9a-94e0-379a5ff54bf3',
  },
  {
    id: 'analyzer',
    title: 'THE',
    accent: 'analyzer',
    description:
      'Data reports, competitive analyses and insight-driven documents.',
    image:
      'https://www.figma.com/api/mcp/asset/c95d79b5-4753-4b61-9bec-28229598af27',
  },
  {
    id: 'design-studio',
    title: 'Design',
    accent: 'studio',
    description:
      'Custom visuals, social assets and branded graphics in minutes.',
    image:
      'https://www.figma.com/api/mcp/asset/b3236c8d-fb40-4260-b067-3d7e053a54d6',
  },
  {
    id: 'briefcase',
    title: 'THE',
    accent: 'BRIEFCASE',
    description:
      'Polished briefs, proposals and strategic documents for every pitch.',
    image:
      'https://www.figma.com/api/mcp/asset/c3a13c50-6aab-46ee-b9ac-708809814983',
  },
  {
    id: 'huddle',
    title: 'The',
    accent: 'huddle',
    description:
      'Meeting notes, agendas and action plans to keep teams aligned.',
    image:
      'https://www.figma.com/api/mcp/asset/70b852e4-71e7-459f-9c1a-cbf6c724f068',
  },
  {
    id: 'wordsmith',
    title: 'THE',
    accent: 'wordsmith',
    description:
      'Long-form copy, articles, scripts and written content with AI.',
    image:
      'https://www.figma.com/api/mcp/asset/e212fed7-e468-48bd-9748-a1b2d6360bbf',
  },
]

function ToolCard({ tool, isExpanded, onHover }) {
  return (
    <div
      onMouseEnter={onHover}
      className="relative shrink-0 h-[360px] md:h-[409px] overflow-hidden cursor-pointer"
      style={{
        width: isExpanded ? 277 : 71,
        borderRadius: isExpanded ? 24 : 150,
        transition: 'width 0.45s cubic-bezier(.4,0,.2,1), border-radius 0.45s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {/* Background image */}
      <img
        src={tool.image}
        alt={`${tool.title} ${tool.accent}`}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Gradient overlay — dark bottom when expanded, white bottom when collapsed */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isExpanded
            ? 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.65) 100%)'
            : 'linear-gradient(to bottom, transparent 45%, white 68%)',
          transition: 'background 0.45s cubic-bezier(.4,0,.2,1)',
        }}
      />

      {/* ── Expanded state: bottom-left title + description ── */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end"
        style={{
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          transitionDelay: isExpanded ? '0.15s' : '0s',
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        <p className="uppercase tracking-[0.96px] whitespace-nowrap">
          <span
            className="text-[24px] leading-[44px] font-extrabold text-white"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            {tool.title}{' '}
          </span>
          <span
            className="text-[28px] leading-[44px] lowercase italic text-white"
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
          >
            {tool.accent}
          </span>
        </p>
        <p
          className="text-[14px] leading-[20px] text-white font-medium mt-1 max-w-[229px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {tool.description}
        </p>
      </div>

      {/* ── Collapsed state: vertical text bottom-aligned ── */}
      <div
         className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-10"
        style={{
          bottom: 48,          /* fixed px — same for every card */
          opacity: isExpanded ? 0 : 1,
          transition: 'opacity 0.25s ease',
          transitionDelay: isExpanded ? '0s' : '0.18s',
          pointerEvents: isExpanded ? 'none' : 'auto',
        }}
      >
        <div
          className="whitespace-nowrap"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center center' }}
        >
          <span
            className="text-[22px] leading-[44px] font-extrabold text-[#282828] uppercase tracking-[0.96px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            {tool.title}{' '}
          </span>
          <span
            className="text-[26px] leading-[44px] text-[#282828] italic lowercase"
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
          >
            {tool.accent}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ToolkitSection() {
  const [hoveredIndex, setHoveredIndex] = useState(0)

  return (
    <section className="relative w-full py-16 md:py-0 md:h-[903px] overflow-hidden">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.94)]" />
      <img
        src={TOOLKIT_BG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-[80px] h-full flex items-start mt-32">
        <div className="flex flex-col md:flex-row gap-10 md:gap-0 w-full">

          {/* Left: "THE toolkit" label + copy + button */}
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 md:w-[312px] shrink-0">
            {/* Vertical title (desktop) */}
            <div className="hidden md:flex items-center justify-center w-[56px] h-[302px]">
              <div className="-rotate-90 whitespace-nowrap">
                <span
                  className="text-[60px] leading-[72px] font-bold italic text-white tracking-[-1.2px]"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  THE{' '}
                </span>
                <span
                  className="text-[72px] leading-[76px] italic text-[#858585] tracking-[-0.72px]"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 300 }}
                >
                  toolkit
                </span>
              </div>
            </div>

            {/* Horizontal title (mobile) */}
            <div className="md:hidden">
              <span
                className="text-[40px] leading-[48px] font-bold italic text-white tracking-[-1.2px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                THE{' '}
              </span>
              <span
                className="text-[48px] leading-[52px] italic text-[#858585] tracking-[-0.72px]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 300 }}
              >
                toolkit
              </span>
            </div>

            <div className="flex flex-col gap-6 md:w-[220px]">
              <p
                className="text-[16px] leading-[24px] text-white font-normal"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                MANIFESTR works with you to create high-quality decks, briefs,
                strategies, reports, visuals, budgets, and more fast. Impress,
                win, and elevate your impact with polished outputs in minutes.
              </p>
              <Link
                href="/toolkit"
                className="inline-flex items-center justify-center h-[54px] w-[160px] border border-white rounded-md text-[18px] leading-[20px] text-white font-medium hover:bg-white/10 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Tool cards row */}
          <div className="flex gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:ml-[54px]">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isExpanded={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
