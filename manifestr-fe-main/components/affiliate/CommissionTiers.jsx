import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const MARBLE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777351461/Affiliate_Marble_Background_1441x628_x2_tfg9jx.webp'

const TIERS = [
  { label: 'Starter', badge: 'Noir', pct: 30, range: '0–99 new paid accounts' },
  { label: 'Growth', badge: 'Gold', pct: 40, range: '100–499 accounts' },
  { label: 'Elite', badge: 'Master', pct: 50, range: '500+ accounts' },
]

export default function CommissionTiers() {
  return (
    <section className="relative w-full bg-[#242424] overflow-hidden py-[70px]">
      {/* Marble texture */}
      <div className="absolute inset-0">
        <CldImage src={MARBLE_BG} alt="" className="w-full h-full object-cover opacity-[0.39]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[40px] md:mb-[60px]"
        >
          <h2 className="text-[36px] md:text-[54px] leading-[44px] md:leading-[72px] tracking-[-0.72px] md:tracking-[-1.08px] text-white">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Commission </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Tiers</span>
          </h2>
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-white mt-[12px] md:mt-[16px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Unlock higher tiers. Elevate your status. Rewards reserved for those who rise.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] md:gap-[20px]">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.badge}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white border border-[#e4e4e7] rounded-[14px] md:rounded-[12px] p-[25px] md:p-[43px] flex flex-col gap-[17px] md:gap-[30px] shadow-sm"
            >
              {/* Badge */}
              <div
                className="bg-black text-white rounded-full h-[40px] md:h-[44px] px-[16px] md:px-[32px] flex items-center justify-center self-start"
              >
                <span
                  className="text-[16px] md:text-[24px] leading-[24px] md:leading-[44px]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  <span className="md:hidden">{tier.label}</span>
                  <span className="hidden md:inline">{tier.badge}</span>
                </span>
              </div>

              {/* Percentage */}
              <div className="flex flex-col gap-0">
                <div className="flex items-end">
                  <span
                    className="text-[48px] md:text-[72px] leading-[56px] md:leading-[72px] tracking-[-0.96px] md:tracking-[-1.44px] text-black"
                    style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                  >
                    {tier.pct}
                  </span>
                  <span
                    className="text-[24px] md:text-[32px] leading-[28px] md:leading-[24px] tracking-[-0.48px] md:tracking-[-0.64px] text-black"
                    style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                  >
                    %
                  </span>
                  <span
                    className="text-[18px] md:text-[24px] leading-[24px] text-black ml-[12px] md:ml-[8px]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  >
                    Commissions
                  </span>
                </div>

                <p
                  className="mt-4 text-[16px] md:mt-5 md:text-[18px] leading-[20px] md:leading-[18px] text-[#18181b]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  {tier.range}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
