import { motion } from 'framer-motion'

const MARBLE_BG = 'https://www.figma.com/api/mcp/asset/96acccfc-bac3-4307-8992-5b3fceddf221'

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
        <img src={MARBLE_BG} alt="" className="w-full h-full object-cover opacity-[0.39]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-[80px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[60px]"
        >
          <h2 className="text-[40px] md:text-[54px] leading-[72px] tracking-[-1.08px] text-white">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Commission </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Tiers</span>
          </h2>
          <p
            className="text-[18px] leading-[24px] text-white mt-[16px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Unlock higher tiers. Elevate your status. Rewards reserved for those who rise.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.badge}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white border border-[#e4e4e7] rounded-[12px] p-[43px] flex flex-col gap-[30px] shadow-sm"
            >
              {/* Badge */}
              <div
                className="bg-black text-white rounded-[52px] h-[44px] px-[32px] flex items-center justify-center self-start"
              >
                <span
                  className="text-[24px] leading-[44px]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  {tier.badge}
                </span>
              </div>

              {/* Percentage */}
              <div className="flex items-end gap-[8px]">
                <span
                  className="text-[72px] leading-[72px] tracking-[-1.44px] text-black"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  {tier.pct}
                </span>
                <span
                  className="text-[32px] leading-[24px] tracking-[-0.64px] text-black mb-[4px]"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  %
                </span>
                <span
                  className="text-[24px] leading-[24px] text-black ml-[8px] mb-[4px]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  Commissions
                </span>
              </div>

              {/* Range */}
              <p
                className="text-[18px] leading-[18px] text-[#18181b]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                {tier.range}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
