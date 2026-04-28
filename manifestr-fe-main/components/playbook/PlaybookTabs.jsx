import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'

const TABS = [
  { label: 'Knowledge Base', href: '/playbook/knowledge-base' },
  { label: 'Demo Videos', href: '/playbook/demo-videos' },
  { label: 'Glossary', href: '/playbook/glossary' },
  { label: 'Product Updates', href: '/playbook/product-updates' },
  { label: 'FAQs', href: '/playbook/faqs' },
  { label: 'Submit a Ticket', href: '/playbook/submit-ticket' },
]

function TabArrow({ dir, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="touch-manipulation p-1 text-[#595e65] transition-colors hover:text-[#18181b]"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        {dir === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  )
}

export default function PlaybookTabs() {
  const router = useRouter()
  const scrollRef = useRef(null)

  const scrollByDir = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' })
  }

  return (
    <div className="w-full border-b border-[#e5e7eb] bg-[#f9fafb] px-6 md:px-[80px]">
      <div className="flex w-full min-h-[48px] items-end gap-1">
        <div className="flex shrink-0 items-end pb-[6px] md:hidden">
          <TabArrow dir="left" label="Scroll tabs left" onClick={() => scrollByDir(-1)} />
        </div>
        <div
          ref={scrollRef}
          className="relative flex min-h-[48px] min-w-0 flex-1 items-center overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {TABS.map((tab) => {
            const isActive = router.pathname === tab.href
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`relative flex min-h-[48px] shrink-0 items-center justify-center px-[16px] py-[12px] text-[16px] leading-[22px] tracking-[-0.112px] whitespace-nowrap transition-colors ${
                  isActive
                    ? 'font-bold text-[#1e293b]'
                    : 'font-medium text-[#595e65] hover:text-[#1e293b]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f0e1c]" />
                )}
              </Link>
            )
          })}
        </div>
        <div className="flex shrink-0 items-end pb-[6px] md:hidden">
          <TabArrow dir="right" label="Scroll tabs right" onClick={() => scrollByDir(1)} />
        </div>
      </div>
    </div>
  )
}
