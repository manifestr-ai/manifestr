import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const AFFILIATE_BG = 'https://www.figma.com/api/mcp/asset/e3d7f749-ec14-4ee3-bf50-8d04c79f6e6c'

const PLANS = [
  {
    name: 'Starter',
    desc: 'Advanced features and reporting.',
    monthlyPrice: 29,
    annualPrice: 24,
    regularPrice: '$49/month',
    features: [
      'All starter features +',
      'Up to 5 user accounts',
      'Team collaboration Toolkit',
      'Custom dashboards',
      'Multiple data export formats',
      'Basic custom integrations',
    ],
    cta: 'Choose Starter',
  },
  {
    name: 'Pro',
    desc: 'Advanced features and reporting.',
    monthlyPrice: 69,
    annualPrice: 59,
    regularPrice: '$129/month',
    features: [
      'All starter features +',
      'Up to 5 user accounts',
      'Team collaboration Toolkit',
      'Custom dashboards',
      'Multiple data export formats',
      'Basic custom integrations',
    ],
    cta: 'Choose Pro',
  },
  {
    name: 'Elite',
    desc: 'For Growing Teams',
    monthlyPrice: 99,
    annualPrice: 84,
    regularPrice: '$299/month',
    features: [
      'All starter features +',
      'Up to 5 user accounts',
      'Team collaboration Toolkit',
      'Custom dashboards',
      'Multiple data export formats',
      'Basic custom integrations',
    ],
    cta: 'Choose Elite',
  },
]

const FEATURE_GROUPS = [
  {
    title: 'Core Tool Access',
    features: [
      { name: 'The Deck (Slides)',              starter: true,  pro: true, elite: true },
      { name: 'The Briefcase (Docs)',            starter: true,  pro: true, elite: true },
      { name: 'Design Studio (Images/Assets)',   starter: false, pro: true, elite: true },
      { name: 'Analyzer (Data Viz)',             starter: false, pro: true, elite: true },
      { name: 'Cost CTRL (Budgets)',             starter: false, pro: true, elite: true },
      { name: 'The Strategist (Insights)',       starter: false, pro: true, elite: true },
      { name: 'Wordsmith (Copywriting)',         starter: false, pro: true, elite: true },
      { name: 'The Huddle (Meetings)',           starter: false, pro: true, elite: true },
    ],
  },
  {
    title: 'Usage & Limits',
    features: [
      { name: 'Wins / Month',            starter: '30',            pro: '100',       elite: 'Unlimited' },
      { name: 'Number of Users',         starter: false,           pro: true,        elite: 'Priority' },
      { name: 'Export Access',            starter: true,            pro: true,        elite: true },
      { name: 'Scheduled Exports/Reports', starter: true,          pro: true,        elite: true },
    ],
  },
  {
    title: 'AI & Automation',
    features: [
      { name: 'AI Assistant',              starter: true,  pro: true, elite: true },
      { name: 'Workflow Automations',       starter: false, pro: true, elite: true },
      { name: 'AI Summaries & Highlights',  starter: false, pro: true, elite: true },
    ],
  },
  {
    title: 'Branding & Customization',
    features: [
      { name: 'Brand Style Guide',           starter: false, pro: true,  elite: true },
      { name: 'Custom Branding Templates',    starter: false, pro: true,  elite: true },
      { name: 'Public/Private Link Controls', starter: false, pro: true,  elite: true },
    ],
  },
  {
    title: 'Collaboration & Management',
    features: [
      { name: 'Shared Vault',                starter: false, pro: false, elite: true },
      { name: 'Team Insights & Analytics',    starter: false, pro: true,  elite: true },
      { name: 'Commenting & Collaboration',   starter: false, pro: true,  elite: true },
      { name: 'Version History & Rollback',   starter: false, pro: false, elite: true },
      { name: 'Public/Private Link Controls', starter: false, pro: false, elite: true },
    ],
  },
  {
    title: 'Support & Services',
    features: [
      { name: 'Knowledge Base & Tutorials', starter: true,           pro: true,           elite: true },
      { name: 'Priority Processing',        starter: false,          pro: true,           elite: true },
      { name: 'Support',                    starter: 'Email',        pro: 'Email + Chat', elite: 'Dedicated' },
      { name: 'Onboarding Concierge',       starter: false,          pro: false,          elite: true },
    ],
  },
]

function CheckIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#18181b]" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10.5L8.5 13L14 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashIcon() {
  return <span className="text-[14px] text-[#d4d4d8]">&mdash;</span>
}

function CellValue({ value }) {
  if (value === true) return <CheckIcon />
  if (value === false) return <DashIcon />
  return (
    <span className="text-[14px] leading-[20px] font-medium text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {value}
    </span>
  )
}

export default function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <>
      {/* Heading section */}
      <section className="w-full pt-[96px] pb-[30px] px-6">
        <div className="max-w-[945px] mx-auto text-center flex flex-col items-center gap-[19px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>One click. </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Everything</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> changes.</span>
          </motion.h2>
          <p className="text-[18px] leading-[28px] text-[#52525b] max-w-[945px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            From pitch decks to campaign strategy, MANIFESTR gives you everything you need to build, brand, and scale all in one intelligent workspace. Choose your plan and unlock your new way of working.
          </p>
        </div>

        <div className="flex items-center justify-center gap-[12px] mt-[30px]">
          <Link
            href="/tools"
            className="h-[44px] px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore The Toolkit
          </Link>
          <button
            className="h-[44px] px-[16px] rounded-[6px] border border-[#e4e4e7] bg-white text-[#18181b] text-[14px] leading-[20px] font-medium hover:bg-[#f4f4f5] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore All Plans
          </button>
        </div>
      </section>

      {/* Compare all features heading */}
      <section className="w-full py-[48px] px-6">
        <h3
          className="text-[40px] leading-[36px] text-[#141414] text-center mb-[48px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          Compare all features
        </h3>

        {/* Comparison Table */}
        <div className="max-w-[1314px] mx-auto overflow-x-auto">
          <div className="min-w-[900px] border border-[#eaecf0] rounded-[12px] overflow-hidden">
            {/* Table Header Row */}
            <div className="flex border-b border-[#eaecf0]">
              {/* Left column header - Choose your plan + toggle */}
              <div className="w-[334px] shrink-0 bg-white p-[24px] flex flex-col items-center justify-center gap-[16px] border-r border-[#eaecf0]">
                <h4
                  className="text-[24px] leading-[32px] text-black"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                >
                  Choose your plan
                </h4>
                <div className="border border-[#e4e4e7] rounded-[6px] overflow-hidden">
                  <div className="bg-[#f4f4f5] rounded-[6px] p-[4px] flex w-[223px]">
                    <button
                      onClick={() => setIsAnnual(false)}
                      className={`flex-1 py-[6px] px-[12px] rounded-[2px] text-[14px] leading-[20px] font-medium transition-colors ${
                        !isAnnual
                          ? 'bg-white text-[#18181b] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_-1px_rgba(10,13,18,0.1)]'
                          : 'text-[#71717a]'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setIsAnnual(true)}
                      className={`flex-1 py-[6px] px-[12px] rounded-[2px] text-[14px] leading-[20px] font-medium transition-colors ${
                        isAnnual
                          ? 'bg-white text-[#18181b] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_-1px_rgba(10,13,18,0.1)]'
                          : 'text-[#71717a]'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <p className="text-[12px] leading-[18px] text-[#18181b] text-center max-w-[204px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cancel anytime - full access until your billing cycle ends
                </p>
              </div>

              {/* Plan headers */}
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="flex-1 border-r last:border-r-0 border-[#eaecf0] px-[24px] pt-[32px] pb-[24px] flex flex-col gap-[32px]"
                >
                  <div className="flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[4px]">
                      <h5
                        className="text-[24px] leading-[32px] text-black"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                      >
                        {plan.name}
                      </h5>
                      <p className="text-[16px] leading-[24px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {plan.desc}
                      </p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-end gap-[2px]">
                        <span
                          className="text-[24px] leading-none text-black pb-[20px]"
                          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                        >
                          $
                        </span>
                        <span
                          className="text-[48px] leading-none text-black"
                          style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                        >
                          {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-[14px] leading-[20px] text-[#18181b] pb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          /month
                        </span>
                      </div>
                      <span className="text-[12px] leading-[18px] text-[#18181b] text-right w-[86px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Regular price: {plan.regularPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-[6px]">
                        <span className="w-[16px] h-[16px] mt-px shrink-0">
                          {i === 0 ? (
                            <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                              <circle cx="8" cy="8" r="8" fill="#0EA5E9" />
                              <path d="M5 8.5L7 10.5L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                              <circle cx="8" cy="8" r="7.5" stroke="#d4d4d8" />
                              <path d="M5 8.5L7 10.5L11 6" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-[15px] leading-[1.2] tracking-[-0.45px] text-[#1a1a1a] ${
                            i === 0 ? '' : ''
                          }`}
                          style={{ fontFamily: i === 0 ? "'Hanken Grotesk', sans-serif" : 'Inter, sans-serif', fontWeight: i === 0 ? 700 : 400 }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="h-[44px] w-full rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Feature comparison rows */}
            {FEATURE_GROUPS.map((group) => (
              <div key={group.title}>
                {/* Group header */}
                <div className="flex bg-[#e7e7e7] border-b border-[#e2e3e4]">
                  <div className="w-[334px] shrink-0 px-[24px] py-[16px] border-r border-[#e2e3e4]">
                    <span className="text-[18px] leading-[28px] font-semibold text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {group.title}
                    </span>
                  </div>
                  <div className="flex-1" />
                </div>

                {/* Feature rows */}
                {group.features.map((feature, fIdx) => (
                  <div
                    key={`${group.title}-${fIdx}`}
                    className="flex border-b border-[#eaecf0] last:border-b-0"
                  >
                    <div className="w-[334px] shrink-0 pl-[60px] pr-[24px] py-[16px] border-r border-[#eaecf0]">
                      <span className="text-[14px] leading-[20px] font-medium text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {feature.name}
                      </span>
                    </div>
                    <div className="flex-1 flex">
                      {['starter', 'pro', 'elite'].map((planKey) => (
                        <div
                          key={planKey}
                          className="flex-1 px-[24px] py-[16px] border-r last:border-r-0 border-[#eaecf0] flex items-center"
                        >
                          <CellValue value={feature[planKey]} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Bottom CTA row */}
            <div className="flex border-t border-[#eaecf0]">
              <div className="w-[334px] shrink-0 border-r border-[#eaecf0]" />
              {PLANS.map((plan) => (
                <div key={plan.name} className="flex-1 px-[24px] py-[16px] border-r last:border-r-0 border-[#eaecf0]">
                  <button
                    className="h-[44px] w-full rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise card */}
      <section className="w-full py-[48px] px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="border border-dashed border-black rounded-[12px] p-[24px] flex flex-col md:flex-row items-center justify-between gap-[16px]">
            <div className="flex flex-col gap-[8px] max-w-[937px]">
              <h4 className="text-[20px] leading-[30px] font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                Enterprise
              </h4>
              <p className="text-[16px] leading-[24px] text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                For organizations requiring tailored features, custom integrations, or enhanced security.
              </p>
            </div>
            <Link
              href="/contact"
              className="h-[44px] px-[40px] rounded-[6px] border border-[#e4e4e7] bg-white text-[#18181b] text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#f4f4f5] transition-colors shrink-0"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Affiliate Program Banner */}
      <section className="w-full py-[32px] px-6">
        <div className="max-w-[1280px] mx-auto relative rounded-[12px] overflow-hidden h-[280px] md:h-[310px]">
          <img src={AFFILIATE_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-10 h-full flex flex-col justify-center px-[48px] md:px-[80px]">
            <h3 className="text-[36px] md:text-[54px] leading-tight md:leading-[72px] tracking-[-1.08px] text-white max-w-[608px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Apply to join our </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Exclusive</span>
              <br />
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Affiliate Program</span>
            </h3>
            <Link
              href="/affiliates"
              className="mt-[24px] h-[54px] px-[24px] rounded-[6px] bg-[#18181b] text-white text-[18px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors self-start"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Apply for Access
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
