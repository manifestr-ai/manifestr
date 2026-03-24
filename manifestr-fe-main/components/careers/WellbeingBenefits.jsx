import { motion } from 'framer-motion'

const TEXTURE_BG = 'https://www.figma.com/api/mcp/asset/5c037fe7-2e9a-4867-b821-8ebcd395e87f'

const ICONS = {
  remote: 'https://www.figma.com/api/mcp/asset/55a5b7d8-706c-46cf-ab42-cdcc3bf9bbd4',
  health: 'https://www.figma.com/api/mcp/asset/72e5c622-6034-4beb-8cbc-cfb639f827e7',
  timeoff: 'https://www.figma.com/api/mcp/asset/c68a84e2-1ddd-4749-9f87-e51d7919b603',
  learning: 'https://www.figma.com/api/mcp/asset/66e95ea5-c2e6-41ab-a900-30a1f7353610',
  family: [
    { src: 'https://www.figma.com/api/mcp/asset/b5c61ab2-a2f0-47c1-8225-7eb4100f787f', inset: '0 35.35% 76.17% 41.02%' },
    { src: 'https://www.figma.com/api/mcp/asset/ebda8b06-3e01-409e-be38-5f9299076478', inset: '23.83% 29.49% 58.59% 35.16%' },
    { src: 'https://www.figma.com/api/mcp/asset/21219f0f-9f41-4f9b-b470-87557fa7c0e8', inset: '56.74% 71.07% 0 0' },
    { src: 'https://www.figma.com/api/mcp/asset/f056a510-8ddc-428a-af1a-25e2d55093ff', inset: '46.19% 0 11.72% 17.39%' },
  ],
  bonuses: 'https://www.figma.com/api/mcp/asset/a1700ce9-4f66-49e4-84e6-2e4037f9283f',
}

function FigmaIcon({ icon }) {
  if (typeof icon === 'string') {
    return (
      <div className="relative w-[60px] h-[60px] overflow-hidden">
        <img src={icon} alt="" className="absolute inset-0 w-full h-full object-contain" />
      </div>
    )
  }
  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden">
      {icon.map((layer, i) => (
        <div key={i} className="absolute" style={{ inset: layer.inset }}>
          <img src={layer.src} alt="" className="absolute inset-0 w-full h-full" />
        </div>
      ))}
    </div>
  )
}

const BENEFITS = [
  { title: 'Fully Remote Friendly', desc: "Work where you perform best, whether that's at home, a café, or a shared workspace.", icon: ICONS.remote },
  { title: 'Comprehensive Health Plans', desc: 'Medical, dental, and mental health support to keep you and your family healthy.', icon: ICONS.health },
  { title: 'Generous Time Off', desc: 'Recharge with flexible PTO, paid holidays, and mental health days.', icon: ICONS.timeoff },
  { title: 'Learning & Development', desc: 'Annual budget for courses, conferences, or certifications.', icon: ICONS.learning },
  { title: 'Family Support', desc: 'Paid parental leave and flexible schedules for caregivers.', icon: ICONS.family },
  { title: 'Performance Bonuses', desc: 'Celebrate individual and team successes with performance-based rewards.', icon: ICONS.bonuses },
]

export default function WellbeingBenefits() {
  return (
    <section className="relative w-full overflow-hidden py-[80px] md:py-[96px]">

      {/* Stone background + texture overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[#deddda]" />
        <div className="absolute inset-0 opacity-[0.22] overflow-hidden">
          <img src={TEXTURE_BG} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[80px]">

        {/* Heading */}
        <div className="text-center mb-[20px]">
          <h2 className="text-[40px] md:text-[60px] leading-[1.2] md:leading-[72px] tracking-[-1.2px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Your </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Wellbeing</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> Matters</span>
          </h2>
        </div>
        <p
          className="text-center text-[14px] md:text-[16px] leading-[24px] text-[#52525b] max-w-[518px] mx-auto mb-[40px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          We believe great work happens when you feel supported, respected, and able to operate at your best.
        </p>

        {/* 3×2 card grid with outer shadow */}
        <div className="flex flex-col gap-[24px] shadow-[0px_8px_27.6px_0px_rgba(0,0,0,0.08)] rounded-[12px]">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {BENEFITS.slice(0, 3).map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white rounded-[12px] p-[24px] shadow-xs flex flex-col gap-[40px]"
              >
                <FigmaIcon icon={b.icon} />
                <div>
                  <h3
                    className="text-[20px] md:text-[24px] leading-[32px] text-black mb-[12px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {BENEFITS.slice(3).map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 3) * 0.08, duration: 0.5 }}
                className="bg-white rounded-[12px] p-[24px] shadow-xs flex flex-col gap-[40px]"
              >
                <FigmaIcon icon={b.icon} />
                <div>
                  <h3
                    className="text-[20px] md:text-[24px] leading-[32px] text-black mb-[12px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
