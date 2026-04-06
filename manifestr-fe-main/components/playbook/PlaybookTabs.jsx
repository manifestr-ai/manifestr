import Link from 'next/link'
import { useRouter } from 'next/router'

const TABS = [
  { label: 'Knowledge Base', href: '/playbook/knowledge-base' },
  { label: 'Demo Videos', href: '/playbook/demo-videos' },
  { label: 'Glossary', href: '/playbook/glossary' },
  { label: 'Product Updates', href: '/playbook/product-updates' },
  { label: 'FAQs', href: '/playbook/faqs' },
  { label: 'Submit a Ticket', href: '/playbook/submit-ticket' },
]

export default function PlaybookTabs() {
  const router = useRouter()

  return (
    <div className="w-full bg-[#f9fafb] px-6 md:px-[80px]">
      <div className="relative flex items-center overflow-x-auto">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e5e7eb]" />
        {TABS.map((tab) => {
          const isActive = router.pathname === tab.href
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`relative shrink-0 flex items-center justify-center min-h-[48px] px-[16px] py-[12px] text-[16px] leading-[22px] tracking-[-0.112px] whitespace-nowrap transition-colors ${
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
    </div>
  )
}
