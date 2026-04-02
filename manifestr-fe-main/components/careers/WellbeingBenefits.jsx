import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const TEXTURE_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026878/Why_uwfw9f.jpg'

const ICONS = {
  remote: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026874/work_1_wibjis.svg',
  health: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026874/XMLID_482__axymgz.svg',
  timeoff: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026836/arrows_1_gyym15.svg',
  learning: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026874/reading-book_1_1_jandqs.svg',
  family: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026874/customer_3_1_vwbqvy.svg',
  bonuses: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775026874/line-chart_5_1_bkdcz4.svg',
}

function FigmaIcon({ icon }) {
  if (typeof icon === 'string') {
    return (
      <div className="relative w-[60px] h-[60px] overflow-hidden">
        <CldImage src={icon} alt="" className="absolute inset-0 w-full h-full object-contain" />
      </div>
    )
  }
  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden">
      {icon.map((layer, i) => (
        <div key={i} className="absolute" style={{ inset: layer.inset }}>
          <CldImage src={layer.src} alt="" className="absolute inset-0 w-full h-full" />
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
    <section className="relative w-full overflow-hidden py-[48px] md:py-[96px]">

      {/* Stone background + texture overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[#deddda]" />
        <div className="absolute inset-0 opacity-[22] overflow-hidden">
          <CldImage src={TEXTURE_BG} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[80px]">

        {/* Heading */}
        <div className="text-center mb-[20px]">
          <h2 className="text-[30px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.6px] md:tracking-[-1.2px] text-black max-w-[266px] md:max-w-none mx-auto">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Your Wellbeing Matters</span>
          </h2>
        </div>
        <p
          className="text-center text-[16px] leading-[24px] text-[#52525b] max-w-[336px] md:max-w-[518px] mx-auto mb-[24px] md:mb-[40px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          We believe great work happens when you feel supported and valued, inside and outside of work.
        </p>

        {/* Mobile — horizontally scrolling benefit cards */}
        <div className="md:hidden flex gap-[24px] overflow-x-auto -mx-6 px-6 pb-[4px] scrollbar-hide">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white rounded-[12px] p-[24px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex flex-col gap-[40px] w-[295px] shrink-0"
            >
              <FigmaIcon icon={b.icon} />
              <div className="flex flex-col gap-[12px]">
                <h3
                  className="text-[24px] leading-[32px] text-black"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-[16px] leading-[24px] text-[#52525b]"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop — 3×2 card grid */}
        <div className="hidden md:flex flex-col gap-[24px] shadow-[0px_8px_27.6px_0px_rgba(0,0,0,0.08)] rounded-[12px]">
          <div className="grid grid-cols-3 gap-[24px]">
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
                    className="text-[24px] leading-[32px] text-black mb-[12px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-[16px] leading-[24px] text-[#52525b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[24px]">
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
                    className="text-[24px] leading-[32px] text-black mb-[12px]"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-[16px] leading-[24px] text-[#52525b]"
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
