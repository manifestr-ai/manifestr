import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const ROCK_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025006/Image_Rock_2_iyceuw.jpg'
const CHECK_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023115/Vector_uz3ve2.svg'
const DASHBOARD_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775025215/DashboardSection_a5pmld.jpg'
const MOBILE_CHECK_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023115/Vector_uz3ve2.svg'

const FEATURES = [
  'Real-time earnings and conversion tracking',
  'Professional banner ads and graphics',
  'Email templates and social media content',
  'Detailed analytics and performance insights',
  'Dedicated affiliate support team',
  'Marketing guides and best practices',
]

const MOBILE_FEATURES = [
  'Real-time earnings and conversion tracking',
  'Professional banner ads and graphics',
  'Email templates and social media content',
  'Dedicated affiliate support team',
  'Marketing guides and best practices',
]

export default function DashboardToolkit() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden md:block relative bg-white min-h-[771px]">
        <div className="absolute inset-0">
          <CldImage src={ROCK_BG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-[83px] py-[84px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-[24px] max-w-[608px]"
          >
            <h2 className="text-[54px] leading-[72px] tracking-[-1.08px] text-black">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Exclusive </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Dashboard</span>
              <br />
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>&amp; Toolkit</span>
            </h2>
            <p
              className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b] max-w-[605px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              Get everything you need to succeed with our comprehensive affiliate dashboard and marketing toolkit.
            </p>
          </motion.div>
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
                <CldImage src={CHECK_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
                <span
                  className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  {f}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-[40px]"
          >
            <button
              className="bg-[#18181b] text-white text-[18px] leading-[20px] font-medium h-[54px] px-[24px] rounded-[6px] hover:bg-[#333] transition-colors duration-200 cursor-pointer"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Get Your Unique Affiliate Link
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden bg-[#deddd9] relative" style={{ height: 870 }}>
        <div className="pl-6 py-[48px] flex flex-col gap-[24px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[36px] leading-[44px] tracking-[-0.72px] text-black">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Exclusive </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Dashboard</span>
              <br />
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>&amp; Toolkit</span>
            </h2>
          </motion.div>

          <p
            className="text-[16px] leading-[24px] text-[#52525b] max-w-[341px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Get everything you need to succeed with our comprehensive affiliate dashboard and marketing toolkit.
          </p>

          <div className="flex flex-col gap-[16px]">
            {MOBILE_FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-start gap-[12px]"
              >
                <CldImage src={MOBILE_CHECK_ICON} alt="" className="w-[20px] h-[20px] shrink-0 mt-[2px]" />
                <span
                  className="text-[16px] leading-[24px] text-[#52525b]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  {i === 0 ? (
                    <>
                      Real-time earnings and conversion
                      <br />
                      tracking
                    </>
                  ) : (
                    f
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dashboard image + CTA — absolutely positioned */}
        <div className="absolute left-0 w-full overflow-hidden" style={{ top: 400, height: 439 }}>
          <CldImage
            src={DASHBOARD_IMG}
            alt="Affiliate dashboard"
            className="absolute max-w-none pointer-events-none"
            style={{ width: '100%', height: '180.68%', left: '0%', bottom: -12 }}
          />
          <div className="absolute left-6 right-6 bottom-8">
            <button
              type="button"
              className="bg-[#18181b] text-white text-[18px] leading-[20px] font-medium h-[54px] min-h-[54px] w-full rounded-[6px] hover:bg-[#27272a] transition-colors duration-200 cursor-pointer inline-flex items-center justify-center"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Get Your Unique Affiliate Link
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
