import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const CTA_BG = 'https://www.figma.com/api/mcp/asset/49121c76-10df-4cd0-bc7d-45441508d68e'

const SIDEBAR_ITEMS = [
  'Introduction to MANIFESTR',
  'Getting Started with Your First Project',
  'Inviting Team Members',
  'Creating a Style Guide',
  'Using the AI Assistant',
  'Keyboard Shortcuts',
]

export default function GettingStarted() {
  const [activeArticle, setActiveArticle] = useState(1)

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="w-full bg-white border-t border-b border-[#e5e7eb] px-6 md:px-[80px]">
        <div className="flex min-h-[54px] flex-wrap items-center gap-[8px] py-3 text-[16px] leading-[24px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Link href="/playbook" className="text-[#52525b] hover:underline">
            Playbook
          </Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/playbook/knowledge-base" className="text-[#52525b] hover:underline">
            Knowledge Base
          </Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/playbook/getting-started" className="text-[#52525b] hover:underline">
            Getting Started
          </Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="max-w-full font-medium text-[#18181b]">Getting Started with Your First Project</span>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <section className="w-full bg-white px-6 md:px-[112px] py-[80px]">
        <div className="flex gap-[64px] max-w-[1217px] mx-auto">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-[321px] shrink-0">
            <p
              className="mb-[16px] text-[16px] font-semibold leading-[24px] text-[#1b1b1f]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Getting Started
            </p>
            <nav className="flex flex-col">
              {SIDEBAR_ITEMS.map((item, i) => (
                <button
                  key={item}
                  onClick={() => setActiveArticle(i)}
                  className={`flex min-h-[48px] items-center border-l-2 px-[16px] py-[12px] text-left text-[16px] leading-[24px] transition-colors ${
                    activeArticle === i
                      ? 'border-[#020617] font-semibold text-[#1b1b1f]'
                      : 'border-[#e4e4e7] font-medium text-[#71717a] hover:text-[#1b1b1f]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-w-0"
          >
            <div className="flex flex-col gap-[28px] md:gap-[32px]">
              {/* Title */}
              <h1
                className="text-[24px] leading-[32px] tracking-[-0.72px] text-[#1b1b1f] md:text-[36px] md:leading-[44px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
              >
                Getting Started with Your First Project
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-[10px] gap-y-2 border-t border-b border-dashed border-[#e2e8f0] py-[16px]">
                <div className="flex items-center gap-[6px]">
                  <svg className="h-4 w-4 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Updated: January 15, 2025
                  </span>
                </div>
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#71717a]" aria-hidden />
                <div className="flex items-center gap-[6px]">
                  <svg className="h-4 w-4 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    5 min read
                  </span>
                </div>
              </div>

              {/* Article Body — body scale aligned with Cookie / Privacy policy pages (16px / 24px) */}
              <div className="flex flex-col gap-[48px]">
                <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Welcome to MANIFESTR! This guide will walk you through creating your first project and help you understand the core concepts of our platform.
                </p>

                <div className="flex flex-col gap-[20px]">
                  <h2
                    className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    {"What you'll learn"}
                  </h2>
                  <div className="flex flex-col gap-[12px]">
                    {[
                      'How to create a new project',
                      'Understanding the project workspace',
                      'Adding your first assets',
                      'Inviting team members',
                      'Basic navigation and shortcuts',
                    ].map((item) => (
                      <p key={item} className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-[20px]">
                  <h2
                    className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    Step 1: Creating Your Project
                  </h2>
                  <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {'To create your first project, navigate to your dashboard and click the "New Project" button in the top right corner. You\'ll be prompted to:'}
                  </p>
                  {[
                    { term: 'Name your project:', desc: "Choose a descriptive name that reflects what you're building." },
                    { term: 'Select a template:', desc: 'Choose from our pre-built templates or start from scratch.' },
                    { term: 'Choose privacy settings:', desc: 'Decide whether your project will be private or shared with your team.' },
                  ].map((item) => (
                    <p key={item.term} className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="font-semibold text-[#1b1b1f]">{item.term} </span>
                      {item.desc}
                    </p>
                  ))}
                </div>

                <div className="border-l-4 border-[#09090b] bg-[#f4f4f4] py-[19px] pl-[32px]">
                  <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="font-semibold text-[#1b1b1f]">Pro tip: </span>
                    Use descriptive naming conventions from the start. This will help you and your team stay organized as your projects grow.
                  </p>
                </div>

                <div className="flex flex-col gap-[20px]">
                  <h2
                    className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    Step 2: Understanding Your Workspace
                  </h2>
                  <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {"Once your project is created, you'll see the main workspace interface. Let's break down the key areas:"}
                  </p>
                  {[
                    { term: 'Toolbar:', desc: 'Quick access to essential Toolkit and actions' },
                    { term: 'Canvas:', desc: 'Your main working area for designs and assets' },
                    { term: 'Properties Panel:', desc: 'Adjust settings and properties for selected items' },
                    { term: 'Asset Library:', desc: 'Browse and manage your project files' },
                  ].map((item) => (
                    <p key={item.term} className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="font-semibold text-[#1b1b1f]">{item.term} </span>
                      {item.desc}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col gap-[20px]">
                  <h2
                    className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    Step 3: Adding Your First Assets
                  </h2>
                  <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    You can add assets to your project in several ways:
                  </p>
                  <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[8px]">
                    {[
                      'Drag and drop files directly onto the canvas',
                      'Use the "Upload" button in the toolbar',
                      'Import from cloud storage services',
                      'Create new designs using our built-in Toolkit',
                    ].map((item) => (
                      <li key={item} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-[20px]">
                  <h2
                    className="text-[24px] leading-[32px] text-[#1b1b1f] md:text-[30px] md:leading-[38px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                  >
                    Next Steps
                  </h2>
                  <p className="text-[16px] leading-[24px] text-[#71717a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Congratulations on creating your first project! Here are some recommended next steps:
                  </p>
                  <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#71717a] flex flex-col gap-[8px]">
                    {[
                      'Explore our design templates',
                      'Invite your team members',
                      'Set up your design system',
                      'Learn about keyboard shortcuts',
                    ].map((item) => (
                      <li key={item} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* ─── Need More Help? ─── */}
      <section className="w-full relative h-[380px] md:h-[414px] overflow-hidden">
        <CldImage src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-[30px] px-6 text-center"
          >
            <div className="flex flex-col items-center gap-[16px]">
              <h2 className="text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-1.2px] text-black">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p
                className="max-w-[603px] text-[16px] leading-[24px] text-[#71717a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Our support team is here to assist you with any questions.
              </p>
            </div>
            <Link
              href="/playbook/submit-ticket"
              className="h-[44px] px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Submit a Support Ticket
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
