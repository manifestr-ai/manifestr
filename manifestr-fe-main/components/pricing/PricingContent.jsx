import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const AFFILIATE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027959/Rectangle_34624854_ga3xmx.png'

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
    popular: true,
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
      { name: 'Support',                    starter: 'Email',        pro: 'Email\n+ Chat', elite: 'Dedicated' },
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

function FilledCheckIcon() {
  return (
    <svg className="w-[20px] h-[20px]" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#18181b" />
      <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashIcon() {
  return <span className="text-[14px] text-[#d4d4d8]">&mdash;</span>
}

function CellValue({ value, filled }) {
  if (value === true) return filled ? <FilledCheckIcon /> : <CheckIcon />
  if (value === false) return <DashIcon />
  return (
    <span
      className={`text-[14px] leading-[20px] font-medium text-[#18181b] ${typeof value === 'string' && value.includes('\n') ? 'whitespace-pre-line' : ''}`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {value}
    </span>
  )
}

function MobileFeatureGroup({ group }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-[12px] border border-[#eaecf0] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-[14px] md:p-[16px] bg-[#fafafa] hover:bg-[#f4f4f5] transition-colors"
      >
        <span
          className="text-[15px] md:text-[16px] leading-[24px] font-semibold text-[#18181b]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {group.title}
        </span>
        <svg
          className={`w-[20px] h-[20px] shrink-0 text-[#71717a] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-x-[4px] px-[14px] md:px-[16px] py-[8px] bg-[#f4f4f5] border-t border-[#eaecf0]">
              <span className="text-[11px] leading-[16px] font-medium text-[#71717a] uppercase tracking-[0.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Feature
              </span>
              {['Starter', 'Pro', 'Elite'].map((name) => (
                <span
                  key={name}
                  className="text-[11px] leading-[16px] font-medium text-[#71717a] uppercase tracking-[0.5px] text-center"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {name}
                </span>
              ))}
            </div>
            {group.features.map((feature, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-x-[4px] px-[14px] md:px-[16px] py-[10px] border-t border-[#f4f4f5] items-center"
              >
                <span
                  className="text-[13px] md:text-[14px] leading-[18px] text-[#18181b] pr-[4px]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {feature.name}
                </span>
                {['starter', 'pro', 'elite'].map((planKey) => (
                  <div key={planKey} className="flex justify-center">
                    <CellValue value={feature[planKey]} filled={planKey === 'pro'} />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BillingToggle({ isAnnual, setIsAnnual }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[280px]">
      <div className="border border-[#e4e4e7] rounded-[6px] overflow-hidden w-full">
        <div className="bg-[#f4f4f5] rounded-[6px] p-[4px] flex w-full min-w-[223px]">
          <button
            type="button"
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
            type="button"
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
      <p
        className="text-[12px] leading-[18px] text-center text-[#52525b] max-w-[240px]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <span className="font-medium text-[#18181b]">15% off</span> when you pay annually
      </p>
    </div>
  )
}

function FeatureCheckIcon({ index, isPopular }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
        <circle cx="8" cy="8" r="8" fill="#0EA5E9" />
        <path d="M5 8.5L7 10.5L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (isPopular) {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
        <circle cx="8" cy="8" r="8" fill="#18181b" />
        <path d="M5 8.5L7 10.5L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
      <circle cx="8" cy="8" r="7.5" stroke="#d4d4d8" />
      <path d="M5 8.5L7 10.5L11 6" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlanCard({ plan, isAnnual }) {
  return (
    <div
      className={`rounded-[14px] border flex flex-col p-[24px] md:p-[16px] gap-[24px] md:gap-[16px] ${
        plan.popular ? 'border-[#18181b] border-2' : 'border-[#e4e4e7]'
      }`}
    >
      {plan.popular && (
        <div className="bg-[#18181b] rounded-[8px] self-start py-[6px] px-[16px] md:py-[3px] md:px-[10px]">
          <span
            className="text-white text-[12px] md:text-[11px] tracking-[0.96px] uppercase"
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
          >
            Most Popular
          </span>
        </div>
      )}

      <div className="flex flex-col gap-[4px]">
        <h4
          className="text-black text-[24px] md:text-[20px] leading-[32px] md:leading-[28px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          {plan.name}
        </h4>
        <p
          className="text-[#18181b] text-[16px] md:text-[13px] leading-[24px] md:leading-[18px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {plan.desc}
        </p>
      </div>

      <div className="flex items-end justify-between md:flex-col md:items-start md:gap-[4px]">
        <div className="flex items-end gap-[2px]">
          <span
            className="leading-none text-black text-[24px] md:text-[18px] pb-[16px] md:pb-[10px]"
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
          >
            $
          </span>
          <span
            className="leading-none text-black text-[48px] md:text-[36px]"
            style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
          >
            {isAnnual ? plan.annualPrice : plan.monthlyPrice}
          </span>
          <span
            className="leading-[20px] text-[#18181b] text-[14px] md:text-[12px] pb-[8px] md:pb-[5px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            /month
          </span>
        </div>
        <span
          className="text-[12px] leading-[18px] text-[#18181b] text-right w-[86px] md:text-left md:w-auto"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Regular price: {plan.regularPrice}
        </span>
      </div>

      <div className="flex flex-col gap-[10px] md:gap-[8px]">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-start gap-[6px]">
            <span className="mt-px shrink-0 w-[16px] h-[16px] md:w-[14px] md:h-[14px]">
              <FeatureCheckIcon index={i} isPopular={plan.popular} />
            </span>
            <span
              className="leading-[1.2] tracking-[-0.45px] text-[#1a1a1a] text-[15px] md:text-[13px]"
              style={{
                fontFamily: i === 0 ? "'Hanken Grotesk', sans-serif" : 'Inter, sans-serif',
                fontWeight: i === 0 ? 700 : 400,
              }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>

      <button
        className="w-full rounded-[6px] bg-[#18181b] text-white leading-[20px] font-medium hover:bg-[#27272a] transition-colors mt-auto h-[44px] md:h-[40px] text-[14px] md:text-[13px]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {plan.cta}
      </button>
    </div>
  )
}

export default function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <>
      {/* Heading section */}
      <section className="w-full pt-[48px] md:pt-[96px] pb-[30px] px-6">
        <div className="max-w-[945px] mx-auto text-center flex flex-col items-center gap-[19px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>One click. </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Everything</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> changes.</span>
          </motion.h2>
          <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-[#52525b] max-w-[945px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            From pitch decks to campaign strategy, MANIFESTR gives you everything you need to build, brand, and scale all in one intelligent workspace. Choose your plan and unlock your new way of working.
          </p>
        </div>

        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] mt-[30px]">
          <Link
            href="/tools"
            className="h-[36px] md:h-[44px] px-[12px] md:px-[16px] rounded-[6px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors w-full sm:w-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore The Toolkit
          </Link>
          <button
            className="h-[36px] md:h-[44px] px-[12px] md:px-[16px] rounded-[6px] border border-[#e4e4e7] bg-white text-[#18181b] text-[14px] leading-[20px] font-medium hover:bg-[#f4f4f5] transition-colors w-full sm:w-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Explore All Plans
          </button>
        </div> */}
      </section>

      {/* Mobile & Tablet plan cards + feature comparison */}
      <section className="lg:hidden w-full px-6 py-[32px]">
        <div className="flex flex-col items-center gap-[16px] mb-[24px]">
          <h3
            className="text-[28px] sm:text-[30px] leading-[normal] text-[#141414] text-center"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            Choose your plan
          </h3>
          <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] max-w-[960px] mx-auto">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>

        {/* Mobile & Tablet Feature Comparison */}
        <div className="mt-[32px] md:mt-[48px]">
          <h4
            className="text-[24px] md:text-[30px] leading-[32px] text-[#141414] text-center mb-[20px] md:mb-[32px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            Compare all features
          </h4>
          <div className="flex flex-col gap-[12px] max-w-[960px] mx-auto">
            {FEATURE_GROUPS.map((group) => (
              <MobileFeatureGroup key={group.title} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* Desktop comparison table — lg and up */}
      <section className="hidden lg:block w-full py-[48px] px-6">
        <h3
          className="text-[40px] leading-[36px] text-[#141414] text-center mb-[48px]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
        >
          Compare all features
        </h3>

        <div className="max-w-[1314px] mx-auto overflow-x-auto">
          <div className="relative min-w-[900px] pt-[40px]">
            <div
              className="absolute top-0 z-10 flex items-center justify-center bg-[#18181b] rounded-t-[16px] h-[40px] px-[32px]"
              style={{
                left: 'calc(334px + (100% - 334px) / 3)',
                width: 'calc((100% - 334px) / 3)',
              }}
            >
              <span
                className="text-white text-[16px] tracking-[1.28px] uppercase"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
              >
                Most Popular Plan
              </span>
            </div>

            <div className="relative border border-[#eaecf0] rounded-[12px] overflow-hidden">
              <div
                className="absolute top-0 bottom-0 z-10 pointer-events-none border-x-2 border-b-2 border-[#18181b]"
                style={{
                  left: 'calc(334px + (100% - 334px) / 3)',
                  width: 'calc((100% - 334px) / 3)',
                }}
              />

              {/* Table Header Row */}
              <div className="flex border-b border-[#eaecf0]">
                <div className="w-[334px] shrink-0 bg-white p-[24px] flex flex-col items-center justify-center gap-[16px] border-r border-[#eaecf0]">
                  <h4
                    className="text-[24px] leading-[32px] text-black"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    Choose your plan
                  </h4>
                  <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
                  <p className="text-[12px] leading-[18px] text-[#18181b] text-center max-w-[204px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Cancel anytime - full access until your billing cycle ends
                  </p>
                </div>

                {PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className="flex-1 border-r last:border-r-0 border-[#eaecf0] flex flex-col relative"
                  >
                    <div className="px-[24px] pt-[32px] pb-[24px] flex flex-col gap-[32px] flex-1">
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
                              <FeatureCheckIcon index={i} isPopular={plan.popular} />
                            </span>
                            <span
                              className="text-[15px] leading-[1.2] tracking-[-0.45px] text-[#1a1a1a]"
                              style={{
                                fontFamily: i === 0 ? "'Hanken Grotesk', sans-serif" : 'Inter, sans-serif',
                                fontWeight: i === 0 ? 700 : 400,
                              }}
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
                  </div>
                ))}
              </div>

              {/* Feature comparison rows */}
              {FEATURE_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="flex bg-[#e7e7e7] border-b border-[#e2e3e4]">
                    <div className="w-[334px] shrink-0 px-[24px] py-[16px] border-r border-[#e2e3e4]">
                      <span className="text-[18px] leading-[28px] font-semibold text-[#18181b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {group.title}
                      </span>
                    </div>
                    <div className="flex-1" />
                  </div>

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
                            <CellValue value={feature[planKey]} filled={planKey === 'pro'} />
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
                  <div
                    key={plan.name}
                    className="flex-1 px-[24px] py-[16px] border-r last:border-r-0 border-[#eaecf0]"
                  >
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
        </div>
      </section>

      {/* Affiliate Program Banner — full-width on mobile like careers; inset + max width from md */}
      <section className="w-full py-[32px] px-0 md:px-6">
        <div className="relative w-full md:max-w-[1280px] md:mx-auto rounded-none md:rounded-[12px] overflow-hidden h-[180px] sm:h-[220px] md:h-[310px]">
          <CldImage src={AFFILIATE_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-10 h-full flex flex-col justify-center px-[20px] sm:px-[32px] md:px-[80px]">
            <h3 className="text-[22px] sm:text-[32px] md:text-[54px] leading-[28px] sm:leading-[40px] md:leading-[72px] tracking-[-0.48px] md:tracking-[-1.08px] text-white max-w-[608px]">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Apply to join our </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Exclusive</span>
              <br />
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Affiliate Program</span>
            </h3>
            <Link
              href="/affiliates"
              className="mt-[12px] sm:mt-[16px] md:mt-[24px] h-[36px] sm:h-[44px] md:h-[54px] px-[16px] md:px-[24px] rounded-[6px] bg-[#18181b] text-white text-[13px] sm:text-[14px] md:text-[18px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#27272a] transition-colors self-start"
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
