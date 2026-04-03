import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const TESTIMONIALS = [
  { name: 'Alex', role: 'Product Designer', avatar: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027954/Avatar-2_vkhbmr.png', quote: "\u201CThere\u2019s a clear bar for quality here. You\u2019re trusted to make decisions, but you\u2019re also expected to think things through and stand behind your work.\u201D" },
  { name: 'Ava', role: 'UX/UI Designer', avatar: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027954/Avatar-3_xpnuin.png', quote: "\u201CThere\u2019s a strong emphasis on clarity. Decisions are intentional, feedback is direct, and the work speaks for itself.\u201D" },
  { name: 'Samira', role: 'Customer Success', avatar: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027955/Avatar_w5hdpf.png', quote: "\u201CFrom day one, the expectations were clear. You\u2019re supported, but you\u2019re also accountable. That balance makes the work feel meaningful.\u201D" },
  { name: 'Eduard Ranz', role: 'UX/UI Designer', avatar: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027955/Avatar-5_qfpsgy.png', quote: "\u201CYou\u2019re not asked to perform or overexplain. Good thinking and well-executed work are what earn trust here.\u201D" },
  { name: 'David', role: 'Backend Engineer', avatar: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027955/Avatar-1_fyj4gc.png', quote: "\u201CThe work is technically demanding in the right way. You\u2019re solving real problems, not polishing things that don\u2019t matter.\u201D" },
  { name: 'Phoenix Baker', role: 'UX/UI Designer', avatar: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775027954/Avatar-4_c8wftw.png', quote: "\u201CIt\u2019s a focused environment. People come prepared, respect each other\u2019s time, and take responsibility for outcomes.\u201D" },
]

export default function TeamTestimonials() {
  return (
    <section className="w-full bg-white py-[48px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">

        {/* Heading */}
        <div className="text-center mb-[20px]">
          <h2
            className="text-[30px] md:text-[60px] leading-[normal] md:leading-[72px] tracking-[-0.6px] md:tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>What Our Team Says</span>
          </h2>
        </div>
        <p
          className="text-center text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#52525b] max-w-[518px] mx-auto mb-[24px] md:mb-[60px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Empowering ambitious minds with AI Toolkit to thrive - without sacrificing their spark or well-being.
        </p>

        {/* Mobile — horizontally scrolling testimonial cards */}
        <div className="md:hidden flex gap-[24px] overflow-x-auto overflow-y-hidden -mx-6 px-6 pb-[4px] scrollbar-hide">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#f4f4f4] border border-[#e4e4e7] rounded-[12px] p-[24px] flex flex-col gap-[24px] w-[295px] shrink-0"
            >
              <div className="flex items-start gap-[12px]">
                <CldImage
                  src={t.avatar}
                  alt={t.name}
                  className="w-[60px] h-[60px] rounded-full object-cover border-[1.5px] border-black/8"
                />
                <div className="w-[163px]">
                  <p
                    className="text-[18px] leading-[28px] text-[#030303] font-semibold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[14px] leading-[20px] text-[#373940]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
              <p
                className="text-[16px] leading-[24px] text-[#52525b]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                {t.quote}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop — Testimonial grid */}
        <div className="hidden md:grid grid-cols-3 gap-[24px]">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name + '-desktop'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#fafafa] border border-[#e4e4e7] rounded-[12px] p-[24px] flex flex-col gap-[24px]"
            >
              <div className="flex items-start gap-[12px]">
                <CldImage
                  src={t.avatar}
                  alt={t.name}
                  className="w-[60px] h-[60px] rounded-full object-cover border-[1.5px] border-transparent"
                />
                <div>
                  <p
                    className="text-[18px] leading-[28px] text-[#030303] font-semibold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[14px] leading-[20px] text-[#373940]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
              <p
                className="text-[16px] leading-[24px] text-[#52525b]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                {t.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
