import { motion } from 'framer-motion'

const ROCK_BG = 'https://www.figma.com/api/mcp/asset/14e75e5e-ca57-4437-9829-f339f8de8747'
const CHECK_ICON = 'https://www.figma.com/api/mcp/asset/44b553e6-dce4-4ab2-bef7-3c6694c42b48'

const FEATURES = [
  'Real-time earnings and conversion tracking',
  'Professional banner ads and graphics',
  'Email templates and social media content',
  'Detailed analytics and performance insights',
  'Dedicated affiliate support team',
  'Marketing guides and best practices',
]

export default function DashboardToolkit() {
  return (
    <section className="relative w-full bg-white overflow-hidden min-h-[600px] md:min-h-[771px]">
      {/* Rock background */}
      <div className="absolute inset-0">
        <img src={ROCK_BG} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-[83px] py-[84px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-[24px] max-w-[608px]"
        >
          {/* Heading */}
          <h2 className="text-[36px] md:text-[54px] leading-[72px] tracking-[-1.08px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Exclusive </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Dashboard</span>
            <br />
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>&amp; Toolkit</span>
          </h2>

          <p
            className="text-[18px] leading-[28px] text-[#52525b] max-w-[605px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Get everything you need to succeed with our comprehensive affiliate dashboard and marketing toolkit.
          </p>
        </motion.div>

        {/* Feature checklist */}
        <div className="flex flex-col gap-[20px] mt-[40px] max-w-[586px]">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="flex items-center gap-[12px]"
            >
              <img src={CHECK_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
              <span
                className="text-[18px] leading-[24px] text-[#52525b]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                {f}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-[40px]"
        >
          <button
            className="bg-[#18181b] text-white text-[18px] leading-[20px] font-medium h-[54px] px-[24px] rounded-[6px] hover:bg-[#333] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Get Your Unique Affiliate Link
          </button>
        </motion.div>
      </div>
    </section>
  )
}
