import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const HERO_BG_DESKTOP = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775045890/Card_2_fitqot.png'
const HERO_BG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775224463/Card_3_xz4ihd.png'

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'eligibility', label: 'Eligibility & Account Responsibilities' },
  { id: 'use', label: 'Use of Services' },
  { id: 'payments', label: 'Payment & Subscriptions' },
  { id: 'ip', label: 'Intellectual Property' },
  { id: 'ai', label: 'AI Services & Generated Content' },
  { id: 'disclaimers', label: 'Disclaimers & Limitations of Liability' },
  { id: 'availability', label: 'Service Availability & Changes' },
  { id: 'termination', label: 'Termination & Suspension' },
  { id: 'governing', label: 'Governing Law & Dispute Resolution' },
  { id: 'contact', label: 'Contact Information' },
]

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('introduction')
  const sectionRefs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) {
        sectionRefs.current[s.id] = el
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative w-full h-[218px] md:h-[256px] flex flex-col items-center justify-between p-[48px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <CldImage src={HERO_BG_DESKTOP} alt="" className="hidden md:block absolute w-full h-full object-cover" />
          <CldImage src={HERO_BG_MOBILE} alt="" className="md:hidden absolute w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 55.86%, rgba(0,0,0,0.3) 100%)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center gap-[18px] md:gap-[11px] text-center text-white max-w-[342px] md:max-w-[551px]"
        >
          <h1 className="text-[36px] md:text-[72px] leading-[44px] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] text-white">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Terms of </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Service</span>
          </h1>
          <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            Binding Legal Agreement between you and MANIFESTR LLC
          </p>
          <p className="text-[16px] leading-[24px] text-white/95" style={{ fontFamily: 'Inter, sans-serif' }}>
            Last updated: 19 March 2026
          </p>
        </motion.div>
      </section>

      {/* ─── Content ─── */}
      <section className="w-full bg-white px-6 md:px-[32px] py-[48px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex gap-[64px] items-start">

          {/* Sticky sidebar */}
          <aside className="hidden lg:flex flex-col gap-[4px] min-w-[280px] shrink-0 sticky top-[100px]">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`text-left pl-[20px] py-[10px] border-l-[3px] transition-colors ${
                    isActive
                      ? 'border-[#020617] text-[#020617] font-medium'
                      : 'border-transparent text-[#52525b]'
                  }`}
                >
                  <span
                    className="text-[16px] leading-[24px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-[32px] md:gap-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* Introduction */}
            <div id="introduction" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Introduction
              </h2>
              <div className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <p>These Terms of Service (&quot;Agreement&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and MANIFESTR LLC (&quot;MANIFESTR,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), a Delaware limited liability company.</p>
                <p>By accessing or using our platform, applications, or services (collectively, the &quot;Services&quot;), you agree to be bound by this Agreement and our Privacy Policy. If you do not agree, you must discontinue use immediately.</p>
                <p>We may update these Terms from time to time. Where appropriate, we will notify you via email or within the platform. Continued use of the Services constitutes acceptance of the updated Terms.</p>
              </div>
            </div>

            {/* Eligibility & Account Responsibilities */}
            <div id="eligibility" className="flex flex-col gap-[24px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Eligibility &amp; Account Responsibilities
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li>You must be at least 18 years old or the legal age of majority in your jurisdiction</li>
                <li>You must provide accurate and current information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You are responsible for all activity under your account</li>
                <li><span className="font-bold text-[#52525b]">Business Use: </span>If registering on behalf of an organisation, you confirm you have authority to bind that entity.</li>
                <li><span className="font-bold text-[#52525b]">Team Accounts: </span>The account owner is responsible for all users under the account.</li>
              </ul>
            </div>

            {/* Use of Services */}
            <div id="use" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Use of Services
              </h2>

              <div className="flex flex-col gap-[16px]">
                <p className="text-[16px] leading-[24px] font-semibold text-[#09090b]">Permitted Use:</p>
                <ul className="list-disc pl-[21px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[2px]">
                  <li>Use the Services for lawful business and professional purposes</li>
                  <li>Generate and use outputs within your subscription limits</li>
                </ul>
              </div>

              <div className="flex flex-col gap-[16px]">
                <p className="text-[16px] leading-[24px] font-semibold text-[#09090b]">Prohibited Use:</p>
                <div className="text-[16px] leading-[24px] text-[#52525b]">
                  <p className="mb-[14px]">You agree not to, directly or indirectly:</p>
                  <ul className="list-disc pl-[21px] flex flex-col gap-[2px] mb-[14px]">
                    <li>Use the Services for unlawful, harmful, fraudulent, or abusive purposes</li>
                    <li>Reverse engineer, copy, or attempt to extract underlying systems</li>
                    <li>Circumvent security or platform protections</li>
                    <li>Share or resell access to the platform without authorization</li>
                    <li>Upload malicious code or infringing content</li>
                    <li>Misrepresent your identity</li>
                  </ul>
                  <p className="font-bold mb-[14px]">AI-Specific Restrictions:</p>
                  <ul className="list-disc pl-[21px] flex flex-col gap-[2px]">
                    <li>You agree not to use MANIFESTR&apos;s AI features to:</li>
                    <ul className="list-disc pl-[21px] flex flex-col gap-[2px] mt-[2px]">
                      <li>Generate unlawful, harmful, fraudulent, or deceptive content</li>
                      <li>Create content intended to mislead, impersonate, or defraud</li>
                      <li>Produce content that infringes intellectual property rights</li>
                      <li>Attempt to exploit, probe, or manipulate AI systems or safeguards</li>
                      <li>Generate or distribute malicious code, spam, or abusive material</li>
                    </ul>
                    <li>We reserve the right to restrict or suspend access where misuse is detected.</li>
                    <li>We reserve the right to monitor usage and enforce compliance.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payments & Subscriptions */}
            <div id="payments" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Payments &amp; Subscriptions
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li><span className="font-semibold text-[#09090b]">Paid Services: </span>Certain features require a paid subscription. Pricing, features, and limits are outlined on the Pricing page and may be updated.</li>
                <li><span className="font-semibold text-[#09090b]">Billing &amp; Renewal: </span>Subscriptions are billed in advance on a recurring basis (monthly or annually). Subscriptions renew automatically unless cancelled before the renewal date.</li>
                <li><span className="font-semibold text-[#09090b]">Plan Changes: </span>
                  <ul className="list-disc pl-[21px] mt-[4px] flex flex-col gap-[2px]">
                    <li><span className="font-bold">Upgrades:</span> Take effect immediately. Prorated charges may apply.</li>
                    <li><span className="font-bold">Downgrades:</span> Take effect at the end of the billing cycle. No refunds or credits are provided.</li>
                  </ul>
                </li>
                <li><span className="font-semibold text-[#09090b]">Pricing Changes: </span>We may update pricing from time to time. Where possible, we will provide notice before changes take effect.</li>
                <li><span className="font-semibold text-[#09090b]">Taxes: </span>All fees are exclusive of taxes. You are responsible for any applicable taxes, duties, or levies imposed by authorities.</li>
                <li><span className="font-semibold text-[#09090b]">Failure to Pay: </span>If payment fails:
                  <ul className="list-disc pl-[21px] mt-[4px] flex flex-col gap-[2px]">
                    <li>We may retry the charge</li>
                    <li>Access may be suspended</li>
                    <li>Continued failure may result in termination</li>
                    <li>We reserve the right to recover outstanding amounts.</li>
                  </ul>
                </li>
                <li><span className="font-semibold text-[#09090b]">Refunds: </span>Except where required by law:
                  <ul className="list-disc pl-[21px] mt-[4px] flex flex-col gap-[2px]">
                    <li>Payments are non-refundable</li>
                    <li>No refunds for unused time</li>
                    <li>No partial billing credits</li>
                  </ul>
                </li>
                <li><span className="font-semibold text-[#09090b]">Promotions &amp; Trials: </span>Free trials or promotions may be offered. Unless otherwise stated:
                  <ul className="list-disc pl-[21px] mt-[4px] flex flex-col gap-[2px]">
                    <li>Trials convert to paid subscriptions automatically</li>
                    <li>Billing begins at the end of the trial period</li>
                  </ul>
                </li>
                <li><span className="font-semibold text-[#09090b]">Payment Processing: </span>Payments are handled by third-party providers (e.g., Stripe). We do not store full payment card details.</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div id="ip" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Intellectual Property
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li><span className="font-semibold text-[#09090b]">Ownership of Platform: </span>MANIFESTR and its licensors retain all rights, title, and interest in the Services, including software, technology, algorithms, interfaces, designs, trademarks, and brand assets.</li>
                <li><span className="font-semibold text-[#09090b]">User Content: </span>You retain ownership of any content you upload to the Services. By uploading, you grant MANIFESTR a worldwide, non-exclusive, royalty-free license to host, process, and display such content solely for providing the Services.</li>
                <li><span className="font-semibold text-[#09090b]">Generated Outputs: </span>Subject to payment of applicable fees, you may use the outputs generated by the Services for your business purposes. MANIFESTR does not claim ownership of Outputs created using your User Content.</li>
                <li><span className="font-semibold text-[#09090b]">Feedback: </span>If you provide suggestions or feedback, you grant MANIFESTR a perpetual, irrevocable, royalty-free license to use such feedback without restriction or obligation.</li>
              </ul>
            </div>

            {/* AI Services & Generated Content */}
            <div id="ai" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                AI Services &amp; Generated Content
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li><span className="font-semibold text-[#09090b]">AI Functionality: </span>MANIFESTR provides AI-powered tools that generate content, including documents, presentations, strategies, financial outputs, reports, and other materials. These Outputs are generated based on user inputs, system prompts, and probabilistic machine learning models.</li>
                <li><span className="font-semibold text-[#09090b]">No Guarantee of Accuracy: </span>Outputs may contain errors, omissions, inconsistencies, or outdated information. MANIFESTR does not guarantee the accuracy, completeness, reliability, or suitability of any Outputs for your specific use case.</li>
                <li><span className="font-semibold text-[#09090b]">User Responsibility &amp; Review: </span>You are solely responsible for reviewing, validating, and approving all Outputs before using them.</li>
              </ul>
              <p className="text-[16px] leading-[24px] text-[#52525b]">This includes, without limitation:</p>
              <ul className="list-disc pl-[42px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[2px]">
                <li>Business decisions</li>
                <li>Financial planning or forecasts</li>
                <li>Client deliverables</li>
                <li>Legal, regulatory, or compliance-related content</li>
              </ul>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li><span className="font-semibold text-[#09090b]">No Professional Advice: </span>Outputs do not constitute professional, legal, financial, or tax advice. Consult qualified professionals before relying on any Output in a professional context.</li>
                <li><span className="font-semibold text-[#09090b]">Use at Your Own Risk: </span>MANIFESTR shall not be liable for any losses, damages, or claims arising from reliance on AI-generated Outputs.</li>
                <li><span className="font-semibold text-[#09090b]">Infringement &amp; IP Risk: </span>While we take reasonable steps to reduce the risk of infringing output, we cannot guarantee Outputs will not inadvertently include content similar to third-party intellectual property.</li>
              </ul>
            </div>

            {/* Disclaimers & Limitations */}
            <div id="disclaimers" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Disclaimers &amp; Limitations of Liability
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li><span className="font-semibold text-[#09090b]">Disclaimer of Warranties: </span>The Services are provided &quot;as is&quot; and &quot;as available.&quot; We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.</li>
                <li><span className="font-semibold text-[#09090b]">Limitation of Liability: </span>To the maximum extent permitted by law, MANIFESTR shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from your use of the Services.</li>
                <li><span className="font-semibold text-[#09090b]">Liability Cap: </span>Our total aggregate liability shall not exceed the fees you paid to MANIFESTR in the twelve (12) months preceding the event giving rise to the claim.</li>
              </ul>
            </div>

            {/* Service Availability & Changes */}
            <div id="availability" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Service Availability &amp; Changes
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li>We strive for reliable service but do not guarantee uninterrupted availability.</li>
                <li>Scheduled or emergency maintenance may occur.</li>
                <li>We may modify, suspend, or discontinue features at our discretion.</li>
              </ul>
            </div>

            {/* Termination & Suspension */}
            <div id="termination" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Termination &amp; Suspension
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li>You may cancel your account at any time.</li>
                <li>We may suspend or terminate your access if you breach these Terms.</li>
                <li>Upon termination, your right to use the Services ceases. Certain provisions of these Terms will survive termination.</li>
              </ul>
            </div>

            {/* Governing Law */}
            <div id="governing" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Governing Law &amp; Dispute Resolution
              </h2>
              <ul className="list-disc pl-[24px] text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[4px]">
                <li><span className="font-semibold text-[#09090b]">Governing Law: </span>This Agreement is governed by the laws of the State of Delaware, without regard to conflict of law principles.</li>
                <li><span className="font-semibold text-[#09090b]">Arbitration: </span>Any disputes shall be resolved through binding arbitration administered under JAMS rules, held in Delaware, USA.</li>
                <li><span className="font-semibold text-[#09090b]">Class Action Waiver: </span>You waive the right to participate in class-action lawsuits or class-wide arbitration.</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div id="contact" className="flex flex-col gap-[20px] scroll-mt-[120px]">
              <h2 className="text-[30px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#1b1b1f]" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                Contact Information
              </h2>
              <div className="text-[16px] leading-[24px] text-[#52525b]">
                <p className="mb-[8px]">For questions about these Terms, contact us at:</p>
                <p className="font-semibold text-[#09090b]">MANIFESTR LLC</p>
                <p>Email: legal@manifestr.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
