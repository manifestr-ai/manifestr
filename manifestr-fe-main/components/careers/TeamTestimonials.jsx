import { motion } from 'framer-motion'

const AVATAR_BASE = 'https://www.figma.com/api/mcp/asset/'

const TESTIMONIALS = [
  { name: 'Alex', role: 'Product Designer', avatar: `${AVATAR_BASE}c832157c-1a94-4056-ba53-c9bcb1d38139`, quote: "I'm constantly inspired by the creative energy here, everyone wants to build something meaningful." },
  { name: 'Samira', role: 'Customer Success', avatar: `${AVATAR_BASE}baa05999-af6f-4fd3-91d5-32436e376c5a`, quote: '"From day one, I felt heard and supported. We truly care about our customers and each other.' },
  { name: 'David', role: 'Backend Engineer', avatar: `${AVATAR_BASE}0c79a2bf-49da-423a-8d79-c28da65d64a0`, quote: "The projects challenge me technically, and I know I'm making a real impact." },
  { name: 'Ava Wright', role: 'UX/UI Designer', avatar: `${AVATAR_BASE}2f45de8e-de9f-4804-a376-22dbe845f978`, quote: "I've been using this tool for several months now, and it has completely changed the way I manage my projects. The interface is incredibly user-friendly." },
  { name: 'Eduard Ranz', role: 'UX/UI Designer', avatar: `${AVATAR_BASE}2988f88b-236b-4e64-b3e4-27f1afa3c4cb`, quote: "I've been using this tool for several months now, and it has completely changed the way I manage my projects. The interface is incredibly user-friendly." },
  { name: 'Phoenix Baker', role: 'UX/UI Designer', avatar: `${AVATAR_BASE}2ab3f184-06b2-46c3-ae65-1f1757508af1`, quote: "I've been using this tool for several months now, and it has completely changed the way I manage my projects. The interface is incredibly user-friendly." },
]

export default function TeamTestimonials() {
  return (
    <section className="w-full bg-white py-[80px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">

        {/* Heading */}
        <div className="text-center mb-[20px]">
          <h2
            className="text-[40px] md:text-[60px] leading-[1.2] md:leading-[72px] tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>What Our </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Team</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> Says</span>
          </h2>
        </div>
        <p
          className="text-center text-[14px] md:text-[16px] leading-[24px] text-[#52525b] max-w-[518px] mx-auto mb-[60px]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Empowering ambitious minds with AI tools to thrive — without sacrificing their spark or well-being.
        </p>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#fafafa] border border-[#e4e4e7] rounded-[12px] p-[24px] flex flex-col gap-[24px]"
            >
              <div className="flex items-start gap-[12px]">
                <img
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
                className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b]"
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
