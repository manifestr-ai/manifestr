import { motion } from 'framer-motion'

const AFFILIATE_IMG = 'https://www.figma.com/api/mcp/asset/aeb76f4c-da6c-4bf8-b868-d3525f5f0cd1'
const CHECK_ICON = 'https://www.figma.com/api/mcp/asset/44b553e6-dce4-4ab2-bef7-3c6694c42b48'

const BENEFITS = [
  'Up to 50% commission: Industry-leading payouts',
  'Earn recurring monthly commissions on active referrals',
  'Real-time affiliate dashboard for effortless tracking',
  'Proven marketing assets to help you succeed',
  'Dedicated support team whenever you need it',
]

export default function WhyJoinAffiliate() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px] py-[80px] min-h-[790px]">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col gap-[48px] w-full md:w-[648px]"
        >
          <div className="flex flex-col gap-[32px]">
            <h2
              className="text-[36px] md:text-[54px] leading-[72px] tracking-[-1.08px] text-black"
            >
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Why Join the </span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>Manifestr</span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Affiliate</span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> Program?</span>
            </h2>
            <p
              className="text-[16px] leading-[24px] text-[#52525b] max-w-[605px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              At MANIFESTR, we believe bold thinkers deserve bold rewards. Our Affiliate Program offers one of the highest paying commission structures you&apos;ll find anywhere, empowering you to transform referrals into real income.
            </p>
          </div>

          <div className="flex flex-col gap-[20px]">
            <h3
              className="text-[24px] leading-[32px] text-black"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
            >
              Key Benefits:
            </h3>
            <div className="flex flex-col gap-[20px]">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-[12px]"
                >
                  <img src={CHECK_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
                  <span
                    className="text-[16px] md:text-[18px] leading-[24px] text-[#52525b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {b}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right image */}
        <div className="hidden md:block absolute right-0 top-[-27px] w-[55%] h-[749px]">
          <img
            src={AFFILIATE_IMG}
            alt="Affiliate team"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Marquee bar */}
      <div className="relative w-full mt-[-68px] h-[67px] bg-black/78 flex items-center justify-center overflow-hidden">
        <p
          className="text-white text-[18px] md:text-[26px] leading-[42px] tracking-[0.52px] uppercase whitespace-nowrap"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          APPLY FOR YOUR EXCLUSIVE AFFILIATE LINK NOW
        </p>
      </div>
    </section>
  )
}
