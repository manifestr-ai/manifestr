import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const HERO_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775562811/cd66b20ab0bb6b7b84ff9c24d6b8b90e19c2fc02_qxz0oy.jpg'

const STATS = [
  { value: '99.99%', label: 'Uptime SLA' },
  { value: 'AES-256', label: 'Encryption at rest, TLS 1.3 in transit' },
  { value: '24/7', label: 'Monitoring & alerting' },
  { value: 'Certified', label: 'Against leading global frameworks' },
]

const FRAMEWORK_CARDS = [
  {
    title: 'Data Protection',
    description: 'End-to-end safeguards with encryption, backups, and strict access control.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775562726/Container_ba62of.png',
    href: '/security/data-protection',
  },
  {
    title: 'Compliance & Certifications',
    description: 'Verified by SOC 2, GDPR, and CPRA to meet global standards.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775562726/Container-1_owwi8c.png',
    href: '/security/compliance-certifications',
  },
  {
    title: 'User Responsibility',
    description: 'A shared model: we secure the platform, you manage safe access.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775562727/Container-2_cxgesn.png',
    href: '/security/user-responsibility',
  },
  {
    title: 'Incident Reporting',
    description: 'Fast, transparent reporting with dedicated response and bug bounty.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775562726/Container-3_nydrou.png',
    href: '/security/incident-reporting',
  },
  {
    title: 'Continuous Monitoring',
    description: 'Real-time monitoring, audits, and pen-tests for ongoing protection.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775562726/Container-4_pi17zj.png',
    href: '/security/continuous-monitoring',
  },
  {
    title: 'Investor Trust Center',
    description: 'Secure access to audit reports, compliance docs, and policies.',
    image: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775562726/Container-5_jemwhe.png',
    href: '/security/investor-trust-center',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export default function Security() {
  const font = { fontFamily: 'Inter, sans-serif' }
  const headingFont = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative w-full h-[218px] md:h-[256px] flex flex-col items-center justify-center p-[48px] overflow-hidden">
        <CldImage src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <h1 className="text-[36px] md:text-[72px] leading-[36px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.44px] text-white">
            <span style={headingFont}>Trust and </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              Security
            </span>
          </h1>
        </motion.div>
      </section>

      {/* ─── Main Content (white) ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[48px] md:py-[96px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[24px] md:gap-[48px] items-center">
          <motion.h2
            {...fadeUp}
            className="text-[#0d0d0d] text-center text-[36px] leading-[44px] md:text-[72px] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] max-w-[1100px]"
            style={headingFont}
          >
            Security isn&apos;t an afterthought. It&apos;s our foundation.
          </motion.h2>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#0d0d0d] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-center max-w-[874px]"
            style={font}
          >
            At MANIFESTR, your data is guarded with the same precision we use to build our platform: encrypted,
            compliant, and continuously monitored. Security is not a feature. It&apos;s the core of everything we do.
          </motion.p>

          {/* Stats */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full"
          >
            {STATS.map((stat) => (
              <div key={stat.value} className="bg-[#f4f4f5] rounded-[12px] p-[24px] flex flex-col gap-[8px] justify-center min-h-[160px]">
                <span
                  className="text-[#18181b] tracking-[-0.88px]"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic', fontSize: '44px', lineHeight: '55px' }}
                >
                  {stat.value}
                </span>
                <span className="text-[#52525b] text-[16px] leading-[24px]" style={font}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-[12px]"
          >
            <Link
              href="#framework"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
              style={font}
            >
              Explore Our Safeguards
            </Link>
            <Link
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-[#e4e4e7] text-[#18181b] rounded-[6px] px-[32px] h-[44px] md:py-[12px] text-[14px] leading-[20px] font-medium hover:bg-[#f4f4f5] transition-colors"
              style={font}
            >
              Download Investor Security Pack
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Security Framework (gray) ─── */}
      <section id="framework" className="w-full bg-[#f4f4f5] px-6 md:px-[80px] py-[48px] md:py-[80px] scroll-mt-[80px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[24px] md:gap-[64px] items-center">
          {/* Heading */}
          <motion.div {...fadeUp} className="flex flex-col gap-[12px] md:gap-[24px] items-center text-center w-full">
            <h2 className="text-black text-[36px] md:text-[60px] leading-tight md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.2px]">
              <span style={headingFont}>Explore Our </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
                Security
              </span>
              <span style={headingFont}> Framework</span>
            </h2>
            <p className="text-[#52525b] text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] max-w-[830px]" style={font}>
              From data protection to investor assurance, each part of MANIFESTR&apos;s security program is built to
              earn and keep your trust. Dive into the areas that matter most to you.
            </p>
          </motion.div>

          {/* Cards - horizontal scroll on mobile, grid on desktop */}
          <div className="w-full overflow-x-auto md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-max md:w-full">
              {FRAMEWORK_CARDS.map((card, i) => (
                <Link key={card.title} href={card.href} className="contents">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="bg-white border border-[#e4e4e7] rounded-[12px] overflow-hidden flex flex-col group cursor-pointer w-[315px] md:w-auto shrink-0 md:shrink"
                  >
                    <div className="relative w-full h-[207px] md:h-[254px] overflow-hidden">
                      <CldImage
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                    <div className="p-[21px] md:p-[24px] flex flex-col gap-[12px]">
                      <h3 className="text-black text-[24px] leading-[32px]" style={headingFont}>
                        {card.title}
                      </h3>
                      <p className="text-[#52525b] text-[16px] leading-[24px]" style={font}>
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
