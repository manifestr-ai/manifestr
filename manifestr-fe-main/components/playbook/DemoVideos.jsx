import { motion } from 'framer-motion'
import Link from 'next/link'
import PlaybookTabs from './PlaybookTabs'

const HERO_BG = 'https://www.figma.com/api/mcp/asset/481a3577-84c8-43e2-aab5-cd613c2fa5b4'
const CTA_BG = 'https://www.figma.com/api/mcp/asset/7adf3647-c549-4907-83ee-1baaa6b47e0c'

const BROWSE_CATEGORIES = [
  {
    image: 'https://www.figma.com/api/mcp/asset/75fb7561-7ef6-453a-89b7-816546a1251b',
    title: 'Getting Started',
    desc: 'Essential videos for new users',
    meta: '8 videos • 45 min',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/c7a7ae9e-2603-419e-b53b-c3d57763e7c5',
    title: 'Pro Tips',
    desc: 'Advanced techniques and workflows',
    meta: '12 videos • 1h 20min',
  },
]

const TUTORIALS = [
  {
    image: 'https://www.figma.com/api/mcp/asset/865c5317-f688-4236-b2a8-cee4c36ad235',
    category: 'Getting Started',
    title: 'Creating Your First Project',
    desc: 'Learn the basics of setting up and managing projects in MANIFESTR.',
    duration: '5:32',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/78c85ded-cf4f-4d32-aefa-48ff15476a89',
    category: 'Collaboration',
    title: 'Team Collaboration Essentials',
    desc: 'Discover how to invite team members and collaborate in real-time.',
    duration: '5:32',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/d2bc2211-b717-4de2-8b36-c9ac9535c613',
    category: 'Design',
    title: 'Design System Setup',
    desc: 'Build a comprehensive design system from scratch.',
    duration: '5:32',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/229f5d38-bd88-4a29-ae7a-554092ce587f',
    category: 'AI Toolkit',
    title: 'Using AI Toolkit Effectively',
    desc: "Maximize productivity with MANIFESTR's AI-powered features.",
    duration: '5:32',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/1dcfec7a-0394-4f8b-a1ed-19c72d73d632',
    category: 'Advanced',
    title: 'Version Control Best Practices',
    desc: 'Master branching, merging, and version management.',
    duration: '5:32',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/5d0940b3-5c0e-4c31-847f-8b499b992cc3',
    category: 'Integration',
    title: 'Integrating with Third-Party Toolkit',
    desc: 'Connect MANIFESTR with your favorite apps and services.',
    duration: '5:32',
  },
]

function PlayIcon({ size = 61 }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm bg-white/90 flex items-center justify-center rounded-full z-10"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.33} height={size * 0.33} viewBox="0 0 24 24" fill="#232323">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

export default function DemoVideos() {
  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="w-full bg-white border-t border-b border-[#e5e7eb] px-6 md:px-[80px]">
        <div className="flex items-center gap-[8px] h-[54px]">
          <Link
            href="/playbook"
            className="text-[14px] leading-[21px] text-[#52525b] hover:underline"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Playbook
          </Link>
          <svg className="w-[16px] h-[16px] text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="text-[14px] leading-[21px] font-medium text-[#18181b]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Demo Videos
          </span>
        </div>
      </div>

      {/* ─── Tabs ─── */}

      {/* ─── Hero ─── */}
      <section className="relative w-full h-[518px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-[32px] w-full max-w-[544px] px-6"
        >
          <div className="flex flex-col items-center gap-[20px] text-center">
            <h1 className="text-[42px] md:text-[72px] leading-[1.1] md:leading-[90px] tracking-[-1.44px] text-white">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Demo </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Videos</span>
            </h1>
            <p className="text-[18px] leading-[28px] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              Explore quick, step-by-step walkthroughs designed to help you build smarter, faster, and with confidence.
            </p>
          </div>

          <Link
            href="/signup"
            className="h-[44px] px-[24px] rounded-[6px] bg-white text-[#0d0d0d] text-[14px] leading-[20px] font-medium inline-flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Enter MANIFESTR
          </Link>
        </motion.div>
      </section>

            <PlaybookTabs />
      {/* ─── Browse by Category ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[96px]">
        <div className="flex flex-col gap-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[48px] leading-tight md:leading-[60px] tracking-[-0.96px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Browse by </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Category</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {BROWSE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative h-[400px] md:h-[500px] rounded-[12px] overflow-hidden cursor-pointer group"
              >
                <img src={cat.image} alt="" className="absolute inset-0 w-full h-full object-cover rounded-[12px]" />
                <div
                  className="absolute inset-0 rounded-[12px]"
                  style={{ backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)' }}
                />
                <PlayIcon size={84} />
                <div className="absolute bottom-0 left-0 right-0 p-[24px] flex flex-col gap-[24px]">
                  <div className="flex flex-col gap-[16px] text-white">
                    <h3
                      className="text-[30px] leading-[38px] tracking-[-0.39px]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                    >
                      {cat.title}
                    </h3>
                    <p
                      className="text-[16px] leading-[1.6]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {cat.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-white border border-[#d9d9d9] rounded-full px-[24px] py-[6px] text-[16px] leading-[1.65] text-[#6c6c6c] tracking-[-0.48px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {cat.meta}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── All Tutorials ─── */}
      <section className="w-full bg-white px-6 md:px-[80px] py-[96px]">
        <div className="flex flex-col gap-[32px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[48px] leading-tight md:leading-[60px] tracking-[-0.96px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>All </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Tutorials</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
            {TUTORIALS.map((tut, i) => (
              <motion.div
                key={tut.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col gap-[16px] cursor-pointer group"
              >
                <div className="relative h-[280px] rounded-[8px] overflow-hidden">
                  <img src={tut.image} alt="" className="w-full h-full object-cover rounded-[8px]" />
                  <PlayIcon size={61} />
                  <span
                    className="absolute top-[16px] right-[16px] bg-white border border-[#d9d9d9] rounded-full px-[24px] py-[6px] text-[16px] leading-[1.65] font-medium text-[#341e1e] tracking-[-0.48px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {tut.duration}
                  </span>
                </div>

                <div className="flex flex-col gap-[16px]">
                  <span
                    className="self-start bg-white border border-[#d9d9d9] rounded-full px-[24px] py-[6px] text-[16px] leading-[1.65] text-[#6c6c6c] tracking-[-0.48px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {tut.category}
                  </span>
                  <div className="flex flex-col gap-[8px]">
                    <h3
                      className="text-[24px] leading-normal tracking-[-0.72px] text-[#1c1c1c]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                    >
                      {tut.title}
                    </h3>
                    <p
                      className="text-[16px] leading-[1.6] text-[#475569]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {tut.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Need More Help? ─── */}
      <section className="w-full relative h-[380px] md:h-[414px] overflow-hidden">
        <img src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
                className="text-[16px] leading-[24px] text-[#52525b] max-w-[603px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {"Can't find what you're looking for? Our support team is here to help you succeed with MANIFESTR."}
              </p>
            </div>
            <Link
              href="/contact"
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
