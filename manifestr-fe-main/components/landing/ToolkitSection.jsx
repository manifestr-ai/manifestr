import { useState } from 'react'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const TOOLKIT_BG = '/assets/landing/toolkit-bg.jpg'

const tools = [
  {
    id: 'deck',
    title: 'THE',
    accent: 'deck',
    description:
      'On-brand, editable presentation decks with visuals, charts and structured slides.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774942622/Stra_7_nkbwni.jpg',
  },
  {
    id: 'strategist',
    title: 'THE',
    accent: 'strategist',
    description:
      'Turn objectives into clear, data-driven strategies and roadmaps.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941775/Stra-7_capdej.jpg',
  },
  {
    id: 'cost-ctrl',
    title: 'COST',
    accent: 'CTRL',
    description:
      'Smart budgets, cost breakdowns and financial summaries built fast.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774942621/Stra_8_fv428n.jpg',
  },
  {
    id: 'analyzer',
    title: 'THE',
    accent: 'analyzer',
    description:
      'Data reports, competitive analyses and insight-driven documents.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941773/Stra-2_pbxx8o.jpg',
  },
  {
    id: 'design-studio',
    title: 'Design',
    accent: 'studio',
    description:
      'Custom visuals, social assets and branded graphics in minutes.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941774/Stra-3_ysxkgz.jpg',
  },
  {
    id: 'briefcase',
    title: 'THE',
    accent: 'BRIEFCASE',
    description:
      'Polished briefs, proposals and strategic documents for every pitch.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941775/Stra-6_ubdfxg.jpg',
  },
  {
    id: 'huddle',
    title: 'The',
    accent: 'huddle',
    description:
      'Meeting notes, agendas and action plans to keep teams aligned.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941775/Stra-5_u1vfl9.jpg',
  },
  {
    id: 'wordsmith',
    title: 'THE',
    accent: 'wordsmith',
    description:
      'Long-form copy, articles, scripts and written content with AI.',
    image:
      'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941775/Stra-4_nmzjna.jpg',
  },
]

/* ── Desktop accordion card (hover-based) ── */
function ToolCard({ tool, isExpanded, onHover, onClick }) {
  return (
    <div
      onMouseEnter={onHover}
      onClick={onClick}
      className="relative shrink-0 h-[409px] overflow-hidden cursor-pointer"
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

      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-10"
        style={{
          bottom: 48,
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
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)

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
            <h2>
              <span
                className="font-bold italic text-white text-[30px] leading-[72px] tracking-[-0.6px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                THE{' '}
              </span>
              <span
                className="italic text-[#858585] text-[40px] leading-[76px] tracking-[-0.4px]"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 300 }}
              >
                toolkit
              </span>
            </h2>

            <div className="mt-6 flex flex-col gap-5">
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
                className="inline-flex items-center justify-center h-[54px] w-[160px] border border-white rounded-[6px] text-[18px] leading-[20px] text-white font-medium hover:bg-white/10 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore Toolkit
              </Link>
            </div>
          </div>

          <div
            className="relative z-10 mt-8 pl-6 overflow-x-auto [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex gap-5 pr-6 w-max">
              {tools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isExpanded={mobileActiveIndex === index}
                  onClick={() => setMobileActiveIndex(index)}
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
            <div className="flex flex-row items-start gap-12 w-[312px] shrink-0">
              <div className="flex items-center justify-center w-[56px] h-[302px]">
                <div className="-rotate-90 whitespace-nowrap">
                  <span
                    className="text-[60px] leading-[72px] font-bold italic text-white tracking-[-1.2px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                  >
                    THE{' '}
                  </span>
                  <span
                    className="text-[72px] leading-[76px] italic text-[#858585] tracking-[-0.72px]"
                    style={{
                      fontFamily: "'IvyPresto Headline', serif",
                      fontWeight: 300,
                    }}
                  >
                    toolkit
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5 w-[220px]">
                <p
                  className="text-[16px] leading-[24px] text-white font-normal"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  MANIFESTR works with you to create high-quality decks, briefs,
                  strategies, reports, visuals, budgets, and more fast. Impress,
                  win, and elevate your impact with polished outputs in minutes.
                </p>
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center h-[54px] w-[160px] border border-white rounded-md text-[18px] leading-[20px] text-white font-medium hover:bg-white/10 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Explore
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
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
