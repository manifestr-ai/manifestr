import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
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
  const role = ROLES[selected]

  return (
    <section id="roles" className="w-full bg-white py-[48px] md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">

        {/* Heading */}
        <div className="text-center mb-[16px] md:mb-[20px]">
          <h2 className="text-[30px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.6px] md:tracking-[-1.2px] text-black max-w-[266px] md:max-w-none mx-auto">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Find Your Next Role</span>
          </h2>
        </div>
        <p
          className="text-center text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#52525b] max-w-[459px] mx-auto mb-[24px] md:mb-[60px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Empowering ambitious minds with AI Toolkit to thrive without sacrificing their spark or well-being.
        </p>

        {/* Mobile — horizontally scrolling role cards */}
        <div className="md:hidden flex gap-[24px] overflow-x-auto -mx-6 px-6 pb-[4px] scrollbar-hide">
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
                className={`bg-[#fafafa] rounded-[12px] p-[24px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] cursor-pointer
                            border shrink-0 w-[295px] flex flex-col gap-[16px]
                            ${isActive ? 'border-[#18181b]' : 'border-[#e4e4e7]'}`}
              >
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="flex flex-col gap-[4px]">
                    <h3
                      className="text-[24px] leading-[32px] text-black italic font-medium"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                    >
                      {r.title}
                    </h3>
                    <p
                      className="text-[13px] leading-[20px] text-[#52525b]"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                    >
                      {r.location}
                    </p>
                  </div>
                  <div
                    className={`shrink-0 w-[32px] h-[32px] rounded-md flex items-center justify-center
                                ${isActive ? 'bg-[#18181b]' : 'bg-[#ebebeb]'}`}
                  >
                    <ArrowUpRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-black'}`} />
                  </div>
                </div>
                <p
                  className="text-[16px] leading-[24px] text-[#52525b]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  {r.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Desktop — Two-column layout */}
        <div className="hidden md:flex flex-row gap-[40px] items-stretch justify-center">
          <div className="w-[626px] shrink-0 flex flex-col gap-[24px]">
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
                  className={`bg-[#fafafa] rounded-[12px] p-[24px] shadow-xs cursor-pointer
                              border transition-colors flex-1
                              ${isActive ? 'border-[#18181b]' : 'border-[#e4e4e7]'}`}
                >
                  <div className="flex items-start justify-between gap-[12px] mb-[16px]">
                    <div>
                      <h3
                        className="text-[24px] leading-[32px] text-black"
                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                      >
                        {r.title}
                      </h3>
                      <p
                        className="text-[14px] leading-[20px] text-[#52525b]"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        {r.location}
                      </p>
                    </div>
                    <div
                      className={`shrink-0 w-[32px] h-[32px] rounded-md flex items-center justify-center
                                  ${isActive ? 'bg-[#18181b]' : 'bg-[#ebebeb]'}`}
                    >
                      <ArrowUpRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-black'}`} />
                    </div>
                  </div>
                  <p
                    className="text-[16px] leading-[24px] text-[#52525b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {r.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-[#f4f4f5] rounded-[12px] p-[24px] flex flex-col gap-[24px]"
          >
            <div className="flex flex-col gap-[16px]">
              <DetailSection title="Responsibilities" items={role.responsibilities} />
              <DetailSection title="Requirements:" items={role.requirements} />
              <DetailSection title="Nice-to-Haves" items={role.niceToHaves} />
              <DetailSection title="Benefits Teaser:" items={role.benefits} />
            </div>
            <div className="flex items-center justify-end gap-[24px]">
              <Link
                href="#"
                className="inline-flex items-center h-[44px] px-[24px] rounded-md bg-white border border-[#e4e4e7]
                           text-[#18181b] text-[14px] font-medium hover:bg-[#fafafa] transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                More Opportunities
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-[8px] h-[44px] px-[24px] rounded-md bg-[#18181b] text-white
                           text-[14px] font-medium hover:opacity-90 transition-opacity"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Apply Now
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DetailSection({ title, items }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h4
        className="text-[18px] leading-[28px] text-black font-semibold"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {title}
      </h4>
      <ul className="list-disc ml-[24px] flex flex-col gap-[4px]">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
