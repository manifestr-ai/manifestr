import { useMemo, useState } from 'react'
import Link from 'next/link'
import CldImage from '../ui/ToolkitCldImage'
import { MobileToolAccordion, TOOLS, MOBILE_TOOL_ORDER } from '../tools/toolkitMobileShared'

const TOOLKIT_BG = '/assets/landing/toolkit-bg.jpg'

const tools = [
  {
    id: 'deck',
    title: 'THE',
    accent: 'deck',
    textBottom: 50,
    description:
      'On-brand, editable presentation decks with visuals, charts and structured slides.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
  },
  {
    id: 'strategist',
    title: 'THE',
    accent: 'strategist',
    textBottom: 76,
    description:
      'Strategic plans, positioning and decision frameworks backed by data and built to execute.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
  },
  {
    id: 'cost-ctrl',
    title: 'COST',
    accent: 'CTRL',
    textBottom: 64,
    description:
      'Budgets, forecasts, financials and reconciliations delivered in a clear, structured format.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
  },
  {
    id: 'analyzer',
    title: 'THE',
    accent: 'analyzer',
    textBottom: 74,
    description:
      'Data and insights shaped into charts and visuals for confident decision-making.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
  },
  {
    id: 'design-studio',
    title: 'Design',
    accent: 'studio',
    textBottom: 76,
    description:
      'Polished, editable images and visuals that elevate everything you create in MANIFESTR.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
  },
  {
    id: 'briefcase',
    title: 'THE',
    accent: 'briefcase',
    textBottom: 76,
    description:
      'Structured, professional documentation including briefs, reports, timelines and run sheets.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
  },
  {
    id: 'huddle',
    title: 'THE',
    accent: 'huddle',
    textBottom: 66,
    description:
      'Agendas, minutes, summaries and follow-ups, structured to support a continuous flow.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
  },
  {
    id: 'wordsmith',
    title: 'THE',
    accent: 'wordsmith',
    textBottom: 88,
    description:
      'Professional copywriter delivering brand-aligned writing across formats and audiences.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
  },
]

/* ── Desktop accordion card (hover-based) ── */
function ToolCard({ tool, isExpanded, onHover, textBottom }) {
  return (
    <Link
      href={`/tools/${tool.id}`}
      onMouseEnter={onHover}
      aria-label={`View ${tool.title} ${tool.accent}`}
      className="relative shrink-0 h-[409px] overflow-hidden cursor-pointer block"
      style={{
        width: isExpanded ? 277 : 71,
        borderRadius: isExpanded ? 24 : 150,
        transition: 'width 0.45s cubic-bezier(.4,0,.2,1), border-radius 0.45s cubic-bezier(.4,0,.2,1)',
      }}
    >
      <CldImage
        src={tool.image}
        alt={`${tool.title} ${tool.accent}`}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isExpanded
            ? 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.65) 100%)'
            : 'linear-gradient(to bottom, transparent 45%, white 68%)',
          transition: 'background 0.45s cubic-bezier(.4,0,.2,1)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end"
        style={{
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          transitionDelay: isExpanded ? '0.15s' : '0s',
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        <p
          className={`tracking-[0.96px] whitespace-nowrap ${
            tool.id === 'design-studio' ? 'normal-case' : 'uppercase'
          }`}
        >
          <span
            className="text-[24px] leading-[44px] font-extrabold text-white"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            {tool.title}{' '}
          </span>
          <span
            className={`text-[28px] leading-[44px] italic text-white ${
              tool.id === 'cost-ctrl' ? 'uppercase' : 'lowercase'
            }`}
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

      <div
        className="absolute inset-0 hidden md:flex items-end justify-center"
        style={{
          paddingBottom: textBottom,
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
            className={`text-[22px] leading-[44px] font-extrabold text-[#282828] tracking-[0.96px] ${
              tool.id === 'design-studio' ? '' : 'uppercase'
            }`}
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            {tool.title}{' '}
          </span>
          <span
            className={`text-[26px] leading-[44px] text-[#282828] italic ${tool.id === 'cost-ctrl' ? 'uppercase' : 'lowercase'}`}
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600 }}
          >
            {tool.accent}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ToolkitSection() {
  const [hoveredIndex, setHoveredIndex] = useState(0)
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)
  const mobileGridTools = useMemo(
    () =>
      MOBILE_TOOL_ORDER.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(
        Boolean
      ),
    []
  )

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden">
        <section className="relative overflow-hidden pb-[80px]">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.94)]" />
          <CldImage
            src={TOOLKIT_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          />

          <div className="relative z-10 px-6 pt-6">
            {/* Typography aligned with AboutHero (components/about/AboutHero.jsx) */}
            <h2
              className="text-[36px] leading-[44px] tracking-[-0.72px] text-white"
              style={{ textShadow: '0px 4px 20.9px rgba(0,0,0,0.25)' }}
            >
              <span className="font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif",fontSize: 30,fontWeight: 700 }}>
                THE{' '}
              </span>
              <span
                className="italic text-[#858585]"
                style={{ fontFamily: "'IvyPresto Headline', serif",fontSize: 40, fontWeight: 300, fontStyle: 'italic' }}
              >
                toolkit
              </span>
            </h2>

            <div className="mt-4 flex flex-col gap-5">
              <p
                className="text-[16px] text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="font-bold leading-[24px]">
                  Eight tools. One system.
                  <br />
                </span>
                <span className="leading-[24px]">
                  Designed to support every part of professional work. Each tool
                  plays a distinct role, delivering consistent output from
                  planning through execution.
                </span>
              </p>
              <Link
                href="/tools"
                className="inline-flex w-fit self-start items-center justify-center h-[54px] px-[20px] border border-white rounded-[6px] text-[18px] leading-[20px] text-white font-medium hover:bg-white/10 transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore The Toolkit
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-10 px-6 pb-2">
            <div className="flex flex-col gap-[17px] max-w-[345px] mx-auto w-full">
              {mobileGridTools.map((tool, index) => (
                <MobileToolAccordion
                  key={tool.slug}
                  tool={tool}
                  isExpanded={mobileActiveIndex === index}
                  onTap={() => setMobileActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── DESKTOP ── */}
      <section className="relative w-full hidden md:block h-[903px] overflow-hidden">
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.94)]" />
        <CldImage
          src={TOOLKIT_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-[80px] h-full flex items-start mt-32">
          <div className="flex flex-row gap-0 w-full">
            {/* Left: vertical title + copy + button */}
            <div className="flex flex-row items-start gap-10 w-[312px] shrink-0">
              <div className="flex items-center justify-center w-[56px] min-h-[302px]">
                <div
                  className="-rotate-90 whitespace-nowrap text-[72px] leading-[80px] tracking-[-1.44px] text-white"
                  style={{ textShadow: '0px 4px 20.9px rgba(0,0,0,0.25)' }}
                >
                  <span className="font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    THE{' '}
                  </span>
                  <span
                    className="italic text-[#858585]"
                    style={{
                      fontFamily: "'IvyPresto Headline', serif",
                      fontWeight: 600,
                      fontStyle: 'italic',
                    }}
                  >
                    toolkit
                  </span>
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-5">
              <p
                className="text-[16px] text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="font-bold leading-[24px]">
                  Eight tools. One system.
                  <br />
                </span>
                <span className="leading-[24px]">
                  Designed to support every part of professional work. Each tool
                  plays a distinct role, delivering consistent output from
                  planning through execution.
                </span>
              </p>
              <Link
                href="/tools"
                className="inline-flex w-fit self-start items-center justify-center h-[54px] px-[20px] border border-white rounded-[6px] text-[18px] leading-[20px] text-white font-medium hover:bg-white/10 transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore The Toolkit
              </Link>
            </div>
            </div>

            {/* Tool cards row */}
            <div className="flex gap-5 lg:ml-[54px]">
              {tools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isExpanded={hoveredIndex === index}
                  onHover={() => setHoveredIndex(index)}
                  textBottom={tool.textBottom}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
