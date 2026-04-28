import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import Link from 'next/link'

const ROLES = [
  {
    title: 'AI Frontend Engineer',
    location: 'Remote • Product Engineering',
    desc: 'Create stunning, performant user interfaces that power the future of AI-driven productivity.',
    responsibilities: [
      'Design, build, and maintain web components for our suite of AI tools.',
      'Collaborate with backend, design, and product teams.',
      'Optimize performance for a seamless user experience.',
    ],
    requirements: [
      '3+ years building modern React applications.',
      'Strong grasp of responsive design and accessibility best practices.',
    ],
    niceToHaves: [
      'Experience with AI/ML-based products.',
      'Familiarity with Figma or similar design tools.',
    ],
    benefits: [
      'Flexible hours, competitive compensation, generous PTO, learning budgets, and more.',
    ],
  },
  {
    title: 'Marketing Content Strategist',
    location: 'Singapore • Marketing',
    desc: 'Craft compelling stories and campaigns to position MANIFESTR as the go-to platform for ambitious professionals.',
    responsibilities: [
      'Develop content strategies across blog, social, and email channels.',
      'Work closely with design and product to tell the MANIFESTR story.',
      'Analyze content performance and iterate for impact.',
    ],
    requirements: [
      '3+ years in content marketing or brand storytelling.',
      'Exceptional written and verbal communication skills.',
    ],
    niceToHaves: [
      'Experience in SaaS or productivity tools.',
      'Knowledge of SEO and analytics platforms.',
    ],
    benefits: [
      'Flexible hours, competitive compensation, generous PTO, learning budgets, and more.',
    ],
  },
  {
    title: 'Customer Success Lead',
    location: 'Remote • Customer Experience',
    desc: 'Empower customers to unlock the full potential of MANIFESTR through proactive, empathetic support.',
    responsibilities: [
      'Onboard and support customers to maximize platform adoption.',
      'Build lasting relationships and gather product feedback.',
      'Identify upsell opportunities and reduce churn.',
    ],
    requirements: [
      '2+ years in customer success or account management.',
      'Strong empathy and communication skills.',
    ],
    niceToHaves: [
      'Experience with SaaS onboarding flows.',
      'Familiarity with CRM tools like HubSpot or Intercom.',
    ],
    benefits: [
      'Flexible hours, competitive compensation, generous PTO, learning budgets, and more.',
    ],
  },
]

export default function OpenRoles() {
  const [selected, setSelected] = useState(0)
  const [jobsModalOpen, setJobsModalOpen] = useState(false)
  const role = ROLES[selected]

  useEffect(() => {
    if (!jobsModalOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setJobsModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [jobsModalOpen])

  return (
    <section
      id="roles"
      className="w-full bg-white overflow-x-hidden
                 py-[48px]
                 md:max-lg:py-[72px]
                 lg:py-[120px]"
    >
      <div
        className="mx-auto w-full min-w-0 max-w-[1280px]
                   px-4 sm:px-6
                   md:max-lg:px-8
                   lg:px-[80px]"
      >
        {/* Heading — md–lg: ~72% scale of lg for same visual ratio */}
        <div
          className="text-center
                     mb-4
                     md:max-lg:mb-4
                     lg:mb-5"
        >
          <h2
            className="mx-auto text-black
                       text-[30px] leading-[normal] tracking-[-0.6px] max-w-[266px]
                       md:max-lg:max-w-full md:max-lg:text-[40px] md:max-lg:leading-[48px] md:max-lg:tracking-[-0.8px]
                       lg:text-[60px] lg:leading-[72px] lg:tracking-[-1.2px] lg:max-w-none"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Find Your Next Role</span>
          </h2>
        </div>

        <p
          className="mx-auto text-center text-[#52525b]
                     text-[14px] leading-[20px] max-w-[459px] mb-6
                     md:max-lg:max-w-[min(100%,34rem)] md:max-lg:text-[14px] md:max-lg:leading-[22px] md:max-lg:mb-10
                     lg:text-[16px] lg:leading-[24px] lg:mb-[60px] lg:max-w-[459px]"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          If you move fast, think clearly and deliver work that matters, you&rsquo;ll fit right in.
        </p>

        {/* Mobile — horizontally scrolling role cards */}
        <div className="md:hidden flex gap-6 overflow-x-auto -mx-6 px-6 pb-1 scrollbar-hide">
          {ROLES.map((r, i) => {
            const isActive = i === selected
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(i)}
                className={`bg-[#fafafa] rounded-xl p-6 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] cursor-pointer
                            border shrink-0 w-[295px] flex flex-col gap-4
                            ${isActive ? 'border-[#18181b]' : 'border-[#e4e4e7]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3
                      className="text-2xl leading-8 text-black italic font-medium"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                    >
                      {r.title}
                    </h3>
                    <p
                      className="text-[13px] leading-5 text-[#52525b]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                    >
                      {r.location}
                    </p>
                  </div>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center
                                ${isActive ? 'bg-[#18181b]' : 'bg-[#ebebeb]'}`}
                  >
                    <ArrowUpRight
                      className={`w-4 h-4 shrink-0 origin-center transition-transform duration-200 ease-out
                                  ${isActive ? 'rotate-0 text-white' : 'rotate-90 text-black'}`}
                      aria-hidden
                    />
                  </div>
                </div>
                <p
                  className="text-base leading-6 text-[#52525b]"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                >
                  {r.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Tablet (768–1023) + Desktop (lg+) — two-column layout */}
        <div
          className="hidden md:flex w-full min-w-0 flex-row items-stretch
                     md:max-lg:gap-6
                     lg:justify-center lg:gap-10"
        >
          {/* Left: role cards */}
          <div
            className="flex min-w-0 flex-col
                       md:max-lg:basis-[47%] md:max-lg:max-w-[47%] md:max-lg:shrink-0 md:max-lg:gap-4
                       lg:w-[626px] lg:shrink-0 lg:gap-6"
          >
            {ROLES.map((r, i) => {
              const isActive = i === selected
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(i)}
                  className={`bg-[#fafafa] shadow-xs cursor-pointer border transition-colors flex-1
                              md:max-lg:p-4 md:max-lg:rounded-xl
                              lg:p-6 lg:rounded-xl
                              ${isActive ? 'border-[#18181b]' : 'border-[#e4e4e7]'}`}
                >
                  <div
                    className="flex items-start justify-between
                               md:max-lg:gap-2 md:max-lg:mb-3
                               lg:gap-3 lg:mb-4"
                  >
                    <div className="min-w-0 flex-1 pr-1">
                      <h3
                        className="text-black break-words
                                   md:max-lg:text-[18px] md:max-lg:leading-[24px]
                                   lg:text-[24px] lg:leading-8"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                      >
                        {r.title}
                      </h3>
                      <p
                        className="text-[#52525b]
                                   md:max-lg:text-[12px] md:max-lg:leading-[16px]
                                   lg:text-[14px] lg:leading-5"
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                      >
                        {r.location}
                      </p>
                    </div>
                    <div
                      className={`shrink-0 rounded-md flex items-center justify-center
                                  md:max-lg:h-7 md:max-lg:w-7
                                  lg:h-8 lg:w-8
                                  ${isActive ? 'bg-[#18181b]' : 'bg-[#ebebeb]'}`}
                    >
                      <ArrowUpRight
                        className={`shrink-0 origin-center transition-transform duration-200 ease-out
                                    md:max-lg:h-3.5 md:max-lg:w-3.5
                                    lg:h-4 lg:w-4
                                    ${isActive ? 'rotate-0 text-white' : 'rotate-90 text-black'}`}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <p
                    className="text-[#52525b] break-words
                               md:max-lg:text-[13px] md:max-lg:leading-[20px]
                               lg:text-base lg:leading-6"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                  >
                    {r.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>

          {/* Right: detail panel */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="min-w-0 flex-1 bg-[#f4f4f5] flex flex-col
                       md:max-lg:gap-4 md:max-lg:rounded-xl md:max-lg:p-4
                       lg:gap-6 lg:rounded-xl lg:p-6"
          >
            <div
              className="flex min-w-0 flex-col overflow-hidden
                         md:max-lg:gap-3
                         lg:gap-4"
            >
              <DetailSection title="Responsibilities" items={role.responsibilities} />
              <DetailSection title="Requirements:" items={role.requirements} />
              <DetailSection title="Nice-to-Haves" items={role.niceToHaves} />
              <DetailSection title="Benefits Teaser:" items={role.benefits} />
            </div>

            <div
              className="flex w-full min-w-0 flex-row items-center gap-2
                         md:max-lg:mt-auto md:max-lg:gap-3
                         lg:justify-end lg:gap-6"
            >
              <button
                type="button"
                onClick={() => setJobsModalOpen(true)}
                className="inline-flex flex-1 min-w-0 cursor-pointer items-center justify-center rounded-md bg-white border border-[#e4e4e7]
                           text-[#18181b] font-medium hover:bg-[#fafafa] transition-colors
                           md:max-lg:h-10 md:max-lg:px-4 md:max-lg:text-[12px] md:max-lg:leading-tight
                           lg:h-11 lg:flex-initial lg:px-6 lg:text-sm lg:leading-normal"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                More Opportunities
              </button>
              <Link
                href="#"
                className="inline-flex flex-1 min-w-0 items-center justify-center gap-1 rounded-md bg-[#18181b] text-white
                           font-medium hover:opacity-90 transition-opacity
                           md:max-lg:h-10 md:max-lg:gap-1.5 md:max-lg:px-4 md:max-lg:text-[12px] md:max-lg:leading-tight
                           lg:h-11 lg:flex-initial lg:gap-2 lg:px-6 lg:text-sm lg:leading-normal"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Apply Now
                <ArrowUpRight className="shrink-0 md:max-lg:h-3.5 md:max-lg:w-3.5 lg:h-4 lg:w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {typeof document !== 'undefined' && jobsModalOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="open-roles-modal-title"
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/50"
                aria-label="Close dialog"
                onClick={() => setJobsModalOpen(false)}
              />
              <div
                className="relative z-10 flex w-full max-w-lg max-h-[min(85vh,720px)] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
              >
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#e4e4e7] px-5 py-4 sm:px-6">
                  <h3
                    id="open-roles-modal-title"
                    className="text-lg font-semibold text-black sm:text-xl"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    All open roles
                  </h3>
                  <button
                    type="button"
                    onClick={() => setJobsModalOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#52525b] hover:bg-[#f4f4f5] hover:text-black transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ul className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
                  {ROLES.map((r, i) => (
                    <li key={r.title} className="border-b border-[#e4e4e7] last:border-b-0 last:pb-0 pb-4 mb-4 last:mb-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(i)
                          setJobsModalOpen(false)
                        }}
                        className="w-full text-left rounded-lg -mx-1 px-1 py-2 hover:bg-[#fafafa] transition-colors"
                      >
                        <p
                          className="text-base font-medium text-black sm:text-lg"
                          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                        >
                          {r.title}
                        </p>
                        <p
                          className="mt-1 text-sm text-[#52525b]"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                        >
                          {r.location}
                        </p>
                        <p
                          className="mt-2 text-sm leading-relaxed text-[#52525b] sm:text-[15px] sm:leading-6"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                        >
                          {r.desc}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>,
            document.body
          )
        : null}
    </section>
  )
}

function DetailSection({ title, items }) {
  return (
    <div className="flex min-w-0 flex-col md:max-lg:gap-1.5 lg:gap-2">
      <h4
        className="text-black font-semibold break-words
                   md:max-lg:text-[14px] md:max-lg:leading-[20px]
                   lg:text-lg lg:leading-7"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {title}
      </h4>
      <ul
        className="list-disc flex flex-col
                   ml-3 pl-0.5
                   md:max-lg:ml-4 md:max-lg:gap-0.5
                   lg:ml-6 lg:gap-1 lg:pl-0"
      >
        {items.map((item, i) => (
          <li
            key={i}
            className="min-w-0 break-words text-[#52525b]
                       md:max-lg:text-[13px] md:max-lg:leading-[20px]
                       lg:text-base lg:leading-6"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
