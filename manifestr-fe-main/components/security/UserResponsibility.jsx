import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775563449/ImageWithFallback-5_iptowr.png'

function ChevronRight() {
  return (
    <svg className="w-[16px] h-[16px] shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

const MANIFESTR_ROLE = [
  {
    title: 'Platform Encryption:',
    items: ['Data encrypted in transit (TLS 1.3) and at rest (AES-256), with encryption keys rotated and managed under NIST standards.'],
  },
  {
    title: 'Monitoring & Threat Detection:',
    items: ['Continuous monitoring, intrusion detection, anomaly detection, and incident response protocols.'],
  },
  {
    title: 'Compliance Assurance:',
    items: ['SOC 2 Type II, GDPR, CPRA, HIPAA (where applicable), and a roadmap to ISO/IEC 27001.'],
  },
  {
    title: 'Subprocessor Due Diligence:',
    items: ['Legal and security vetting of all subprocessors and vendors with Data Processing Agreements (DPAs) in place.'],
  },
  {
    title: 'Resilience & Recovery:',
    items: ['Geo-redundant backups, disaster recovery testing, and business continuity planning.'],
  },
  {
    title: 'Employee Safeguards:',
    items: ['Background checks, security training, and strict role-based access for MANIFESTR staff.'],
  },
]

const USER_ROLE = [
  {
    title: 'Use Strong, Unique Passwords',
    items: [
      'Follow NIST 800-63B guidelines: minimum 12 characters, avoid dictionary words, no reuse across systems.',
      'Store credentials securely (e.g., via password managers).',
    ],
  },
  {
    title: 'Enable Multi-Factor Authentication (MFA)',
    items: [
      'MFA adds a critical second layer of identity verification.',
      'Required for all administrative users; strongly recommended for all accounts.',
      'Failure to enable MFA may constitute negligence under certain data protection frameworks.',
    ],
  },
  {
    title: 'Restrict Access to Authorized Team Members Only',
    items: [
      'Apply the principle of least privilege: grant access only to those with a legitimate business need.',
      'Remove or suspend accounts immediately when employees leave or change roles.',
      'Conduct quarterly access reviews to validate active users.',
    ],
  },
  {
    title: 'Maintain Secure Devices & Endpoints',
    items: [
      'Keep operating systems and applications patched with latest security updates.',
      'Use endpoint protection (antivirus, firewalls, EDR Toolkit).',
      'Encrypt local drives and secure mobile devices with strong authentication.',
    ],
  },
  {
    title: 'Follow Internal Organizational Policies',
    items: [
      'Train employees on phishing, credential hygiene, and safe data handling.',
      'Establish written policies for account management and security incidents.',
      'Document compliance with GDPR/CPRA accountability requirements.',
    ],
  },
]

const bodyText =
  'text-[#52525b] text-[16px] leading-[24px] md:text-[18px] md:leading-[28px]'

export default function UserResponsibility() {
  const font = { fontFamily: 'Inter, sans-serif' }
  const headingFont = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="w-full bg-white overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px] py-9 md:py-[64px]">
          <nav className="flex flex-wrap items-center justify-center gap-[4px] mb-6">
            <Link href="/" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Home</Link>
            <ChevronRight />
            <Link href="/security" className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px] hover:text-[#18181b]" style={font}>Security</Link>
            <ChevronRight />
            <span className="text-[14px] leading-[20px] font-semibold text-[#71717a] px-[8px] py-[4px]" style={font}>User Responsibility</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex flex-col gap-6 md:gap-8 w-full lg:w-[592px] shrink-0 items-center text-center">
              <div className="flex flex-col gap-[20px] w-full items-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                  className="text-center text-[36px] leading-[1.1] tracking-[-0.72px] text-black md:text-[72px] md:leading-[1.12] md:tracking-[-1.44px]"
                  style={headingFont}
                >
                  Security is a shared responsibility.
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className={`flex flex-col gap-[20px] w-full items-center text-center ${bodyText}`}
                  style={font}
                >
                  <p className={`max-w-[640px] ${bodyText}`}>
                    At MANIFESTR, security is built on a Shared Responsibility Model. This model defines what we
                    secure at the platform level, and what customers must secure at the account and endpoint level.
                  </p>

                  <div className="flex flex-col gap-[8px] w-full max-w-[560px] mx-auto items-center">
                    <p className="text-[#18181b] font-semibold text-[18px] leading-[28px]">MANIFESTR&apos;s role:</p>
                    <p className={bodyText}>Protecting the platform infrastructure, ensuring compliance, and implementing enterprise-grade controls.</p>
                  </div>

                  <div className="flex flex-col gap-[8px] w-full max-w-[560px] mx-auto items-center">
                    <p className="text-[#18181b] font-semibold text-[18px] leading-[28px]">Your role:</p>
                    <p className={bodyText}>Protecting credentials, endpoints, and internal access management.</p>
                  </div>

                  <p className={`max-w-[640px] ${bodyText}`}>
                    This clear division of responsibilities ensures that both MANIFESTR and our customers uphold their
                    obligations under laws such as GDPR, CPRA, and HIPAA (where applicable), as well as industry
                    standards including SOC 2 Type II and NIST cybersecurity guidelines.
                  </p>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <Link
                  href="/security/compliance-certifications"
                  className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                  style={font}
                >
                  See Our Compliance Standards
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block flex-1 min-w-0"
            >
              <div className="w-full rounded-[12px] overflow-hidden" style={{ aspectRatio: '624 / 756' }}>
                <CldImage src={HERO_IMAGE} alt="User responsibility" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Mobile hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:hidden mt-8 w-full flex justify-center"
          >
            <div className="w-full max-w-[342px] h-[292px] rounded-[12px] overflow-hidden">
              <CldImage src={HERO_IMAGE} alt="User responsibility" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Two-Column Roles ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-9 md:py-[64px]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-start">
          {/* MANIFESTR's Role */}
          <motion.div {...fadeUp} className="flex-1 min-w-0 flex flex-col gap-8 md:gap-10 items-center text-center">
            <div className="flex flex-col gap-[20px] items-center">
              <h2 className="text-black tracking-[-0.6px] md:tracking-[-1.2px] text-[30px] leading-[38px] md:text-[60px] md:leading-[72px]" style={headingFont}>
                MANIFESTR&apos;s Role
              </h2>
              <p className={`max-w-[640px] ${bodyText}`} style={font}>
                As the service provider, MANIFESTR is responsible for securing the underlying platform and ensuring
                compliance across its infrastructure. Our obligations include:
              </p>
            </div>

            <div className="flex flex-col gap-[20px] w-full max-w-[640px] mx-auto items-center">
              {MANIFESTR_ROLE.map((section) => (
                <div key={section.title} className="flex flex-col gap-[12px] items-center w-full">
                  <h4 className="text-[#18181b] text-[18px] leading-[28px] font-semibold" style={font}>{section.title}</h4>
                  <ul className="flex flex-col gap-[8px] list-none p-0 m-0">
                    {section.items.map((item, i) => (
                      <li key={i} className={`${bodyText}`} style={font}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className={`max-w-[640px] ${bodyText}`} style={font}>
              These safeguards represent MANIFESTR&apos;s non-negotiable obligations under our Terms of Service, Privacy
              Policy, and Data Processing Agreements.
            </p>

            <div className="flex flex-col gap-8 md:gap-10 items-center w-full max-w-[640px] mx-auto">
              <p className={bodyText} style={font}>
                Security is strongest when shared. By combining MANIFESTR&apos;s enterprise-grade controls with your
                organization&apos;s account- and device-level security, together we ensure a comprehensive defense against
                evolving threats. This partnership enables compliance with global regulations, protects sensitive data,
                and sustains the trust of your users and stakeholders. This shared model ensures your workflows remain
                safe end-to-end.
              </p>
              <Link
                href="#"
                className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
                style={font}
              >
                Enable MFA Now
              </Link>
            </div>
          </motion.div>

          {/* User's Role */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="flex-1 min-w-0 flex flex-col gap-8 md:gap-10 items-center text-center">
            <div className="flex flex-col gap-[20px] items-center">
              <h2 className="text-black tracking-[-0.6px] md:tracking-[-1.2px] text-[30px] leading-[38px] md:text-[60px] md:leading-[72px]" style={headingFont}>
                User&apos;s Role
              </h2>
              <p className={`max-w-[640px] ${bodyText}`} style={font}>
                While MANIFESTR protects the platform, customers retain responsibility for how their accounts, teams,
                and devices interact with the system. To maintain compliance and minimize liability, customers must:
              </p>
            </div>

            <div className="flex flex-col gap-[20px] w-full max-w-[640px] mx-auto items-center">
              {USER_ROLE.map((section) => (
                <div key={section.title} className="flex flex-col gap-[12px] items-center w-full">
                  <h4 className="text-[#18181b] text-[18px] leading-[28px] font-semibold" style={font}>{section.title}</h4>
                  <ul className="flex flex-col gap-[8px] list-none p-0 m-0">
                    {section.items.map((item, i) => (
                      <li key={i} className={bodyText} style={font}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className={`max-w-[640px] ${bodyText}`} style={font}>
              Failure to fulfill these user-side responsibilities may shift liability to the customer in the event of a
              data breach. Regulators such as the California Privacy Protection Agency (CPRA) and EU supervisory
              authorities (GDPR) hold businesses accountable for negligent user practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Legal Disclaimer ─── */}
      <section className="w-full bg-[#e4e3e1] px-6 md:px-[80px] py-5 md:py-8">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-2 md:gap-3 items-center text-center">
          <motion.h2
            {...fadeUp}
            className="text-black tracking-[-0.48px] md:tracking-[-0.72px] text-[22px] leading-[28px] md:text-[34px] md:leading-[42px]"
            style={headingFont}
          >
            Legal Disclaimer
          </motion.h2>
          <motion.p
            {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-[1120px] text-[#52525b] text-[14px] leading-[20px] md:text-[15px] md:leading-[22px]" style={font}
          >
            This page is provided for informational purposes only and does not constitute legal advice.
            MANIFESTR&apos;s Shared Responsibility Model reflects common SaaS industry practices (SOC 2, NIST, CSA).
            Customers remain responsible for maintaining the security of their accounts, credentials, and devices,
            as well as compliance with applicable data protection laws (including GDPR, CPRA, and HIPAA where
            relevant). For specific legal advice regarding your obligations, consult a qualified attorney.
          </motion.p>
        </div>
      </section>
    </>
  )
}
