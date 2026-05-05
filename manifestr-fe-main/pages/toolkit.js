import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import AppHeader from '../components/layout/AppHeader'
import ToolCard from '../components/create-project/ToolCard'

/** Toolkit hero strip — same fixed height as grey banner; your Cloudinary artwork */
const TOOLKIT_BANNER_IMG =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777750618/ToolKit_lbwo3b.png'

// Tools ordered to match Figma layout:
// Row 1: THE strategist, THE briefcase, THE analyser, DESIGN studio
// Row 2: WORDSMITH, THE deck, THE huddle, COST CTRL
const tools = [
  // Row 1
  {
    id: 'strategist',
    title: 'THE strategist',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'briefcase',
    title: 'THE briefcase',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'analyser',
    title: 'THE analyser',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Anaylzer_z859cm.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'design-studio',
    title: 'DESIGN studio',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Design_Studio_r4wu94.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  // Row 2
  {
    id: 'wordsmith',
    title: 'WORDSMITH',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/WordSmith_oehdl2.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'deck',
    title: 'THE deck',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Deck_osyogl.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'huddle',
    title: 'THE huddle',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749408/Frame_2147229006_zbhsvs.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
  {
    id: 'cost-ctrl',
    title: 'COST CTRL',
    subtitle: 'Sales Decks • Presentations • Pitches',
    imageSrc: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/Cost_Ctrl_vveufa.png',
    description: {
      title: 'Strategy & Insights Studio',
      content: `Purpose: Turn objectives into clear, data-driven strategies.

Best For: Campaigns • Market entry • Pitches • Brand or business plans

Outputs: Strategy decks, roadmaps, and messaging frameworks`,
      quickTip: 'Upload a brief - STRATEGIST builds insights and goals in minutes.',
    },
  },
]

export default function Toolkit() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState('')
  const [isSortOpen, setIsSortOpen] = useState(false)

  const handleToolSelect = (toolId) => {
    router.push(`/create-project?tool=${toolId}`)
  }

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
  ]

  return (
    <>
      <Head>
        <title>Toolkit - Manifestr</title>
        <meta name="description" content="Explore Manifestr's powerful toolkit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white min-h-screen w-full flex flex-col">
        {/* Header */}
        <AppHeader showRightActions={true} />

        {/* Spacer for fixed header */}
        <div className="h-[72px]" />

        {/* Main — thin banner h-[199px] + Cloudinary ToolKit art (same dimensions as grey strip) */}
        <main className="relative flex-1 overflow-x-hidden bg-white">
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-[199px] overflow-hidden bg-zinc-200" aria-hidden>
            <Image
              src={TOOLKIT_BANNER_IMG}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_52%]"
            />
          </div>

          <div className="relative z-10 w-full pb-20 pt-[51px]">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-8 max-w-[1280px] px-6 md:mb-16 md:px-8"
            >
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <h1 className="font-hero text-[36px] font-bold leading-tight tracking-[-0.96px] text-black md:text-[48px] md:leading-[48px]">
                    THE{' '}
                    <span
                      className="font-accent lowercase italic font-bold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      toolkit
                    </span>
                  </h1>
                  <p className="text-[16px] leading-[24px] text-zinc-600">
                    Hover over a tool for more info
                  </p>
                </div>

                <div className="relative self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-4 hover:bg-zinc-50 transition-colors"
                    aria-expanded={isSortOpen}
                    aria-haspopup="listbox"
                  >
                    <span className="text-[14px] font-medium leading-[20px] text-[#18181b]">Sort By</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} aria-hidden />
                      <div className="absolute right-0 z-20 mt-1 w-[160px] overflow-hidden rounded-md border border-[#e4e4e7] bg-white shadow-lg">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSortBy(option.value)
                              setIsSortOpen(false)
                            }}
                            className={`w-full px-4 py-2 text-left text-[14px] leading-[20px] hover:bg-zinc-50 transition-colors ${
                              sortBy === option.value ? 'bg-zinc-50 font-medium text-[#18181b]' : 'text-[#18181b]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mx-auto mt-12 w-full max-w-[1290px] px-4 md:mt-20"
            >
              <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-4">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full max-w-[302px]"
                  >
                    <ToolCard
                      title={tool.title}
                      subtitle={tool.subtitle}
                      imageSrc={tool.imageSrc}
                      description={tool.description}
                      onClick={() => handleToolSelect(tool.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}

