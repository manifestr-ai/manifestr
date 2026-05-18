import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const MARBLE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777351461/Affiliate_Marble_Background_1441x628_x2_tfg9jx.webp'

const TIERS = [
  { label: 'Starter', badge: 'Noir', pct: 30, range: '0–99 new paid accounts' },
  { label: 'Growth', badge: 'Gold', pct: 40, range: '100–499 accounts' },
  { label: 'Elite', badge: 'Master', pct: 50, range: '500+ accounts' },
]

const ivyItalic = {
  fontFamily: "'IvyPresto Headline', serif",
  fontWeight: 600,
  fontStyle: 'italic',
}

/** Figma 12075:28049 — mobile commission row (absolute positions shared across 30/40/50) */
function CommissionRateRow({ pct }) {
  return (
    <div
      className="relative h-[56px] w-full shrink-0 md:hidden"
      aria-label={`${pct}% Commissions`}
    >
      <span
        className="absolute left-0 top-0 whitespace-nowrap text-[48px] leading-[56px] tracking-[-0.96px] text-black"
        style={ivyItalic}
      >
        {pct}
      </span>
      <span
        className="absolute left-[52.914px] top-[24.5px] whitespace-nowrap text-[24px] leading-[28px] tracking-[-0.48px] text-black"
        style={ivyItalic}
      >
        %
      </span>
      <span
        className="absolute left-[80.203px] top-[30.5px] whitespace-nowrap text-[18px] leading-[24px] text-black"
        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
      >
        Commissions
      </span>
    </div>
  )
}

/** Desktop commission row — flex layout for equal-height cards */
function CommissionRateRowDesktop({ pct }) {
  return (
    <div className="hidden md:flex min-w-0 flex-nowrap items-end whitespace-nowrap">
      <span className="inline-flex shrink-0 items-end">
        <span
          className="text-[72px] leading-none tracking-[-1.44px] text-black"
          style={ivyItalic}
        >
          {pct}
        </span>
        <span
          className="text-[32px] leading-none tracking-[-0.64px] text-black"
          style={ivyItalic}
        >
          %
        </span>
      </span>
      <span
        className="ml-[10px] shrink-0 text-[24px] leading-none text-black"
        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
      >
        Commissions
      </span>
    </div>
  )
}

export default function CommissionTiers() {
  return (
    <section className="relative w-full overflow-hidden bg-[#242424] py-[70px]">
      <div className="absolute inset-0">
        <CldImage src={MARBLE_BG} alt="" className="h-full w-full object-cover opacity-[0.39]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-[80px]">
        {/* Figma 12075:28036 — mobile heading gap 12px, cards gap 40px below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-[40px] flex flex-col gap-3 text-center md:mb-[60px] md:gap-4"
        >
          <h2 className="text-[36px] leading-[44px] tracking-[-0.72px] text-white md:text-[54px] md:leading-[72px] md:tracking-[-1.08px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Commission </span>
            <span style={ivyItalic}>Tiers</span>
          </h2>
          <p
            className="text-[18px] leading-[24px] text-white md:text-[18px] md:leading-[26px]"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            Unlock higher tiers. Elevate your status. Rewards reserved for those who rise.
          </p>
        </motion.div>

        {/* Figma 12075:28043 — cards 342×191, gap 16px */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch md:gap-5">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.badge}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex h-[191px] flex-col border border-[#e4e4e7] bg-white p-[25px] shadow-sm rounded-[14px] md:h-auto md:min-h-0 md:rounded-[12px] md:p-[43px]"
            >
              {/* Figma 12075:28071 — badge + content gap 17px */}
              <div className="flex h-full min-h-0 flex-col gap-[17px] md:gap-0 md:h-full">
                <div
                  className="flex h-[40px] shrink-0 items-center justify-center self-start rounded-full bg-black px-4 md:h-[44px] md:px-8"
                >
                  <span
                    className="text-[16px] leading-6 text-white md:text-[24px] md:leading-none"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    <span className="md:hidden">{tier.label}</span>
                    <span className="hidden md:inline">{tier.badge}</span>
                  </span>
                </div>

                <div className="flex h-[84px] min-h-0 flex-col gap-2 md:h-auto md:flex-1 md:gap-0">
                  <div aria-hidden className="hidden min-h-[30px] flex-1 md:block" />
                  <div className="flex min-h-0 flex-col gap-2 md:gap-0">
                    <CommissionRateRow pct={tier.pct} />
                    <CommissionRateRowDesktop pct={tier.pct} />

                    <p
                      className="shrink-0 text-[16px] leading-5 text-[#18181b] md:mt-5 md:text-[18px] md:leading-[18px]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                    >
                      {tier.range}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
