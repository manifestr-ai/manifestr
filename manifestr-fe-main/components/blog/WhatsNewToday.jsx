import { motion } from 'framer-motion'

const MAIN_IMG = 'https://www.figma.com/api/mcp/asset/29c6497a-fb84-429b-b14a-1bdcb6554895'
const ARTBOARD_IMG = 'https://www.figma.com/api/mcp/asset/a307e12b-41b0-4950-93ac-d293e969e122'
const DESK_IMG = 'https://www.figma.com/api/mcp/asset/0d7e264c-2f19-4368-a054-cfa4d7c59410'
const FISTBUMP_IMG = 'https://www.figma.com/api/mcp/asset/42a52fd1-ef57-4293-bacb-7813c18f625c'

const SMALL_CARDS = [
  { img: ARTBOARD_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: DESK_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: FISTBUMP_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
]

export default function WhatsNewToday() {
  return (
    <section className="w-full bg-[#f9fafb] py-[80px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-[16px] mb-[36px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[48px] leading-[60px] tracking-[-0.96px] text-black"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            {"What's New "}
            <span className="text-black">Today</span>
          </motion.h2>
          <p className="text-[16px] leading-[24px] text-right max-w-[445px] text-[#52525b]" style={{ fontFamily: "Inter, sans-serif" }}>
            Discover How Our Tool Has Helped Real Users Achieve More and Simplify Their Workflow
          </p>
        </div>

        {/* Large featured card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[12px] overflow-hidden h-[340px] md:h-[446px] mb-[24px] cursor-pointer group"
        >
          <img src={MAIN_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/66 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-[32px] md:px-[56px] md:py-[32px] flex flex-col gap-[8px]">
            <span className="bg-white text-[#212122] text-[12px] leading-[18px] font-medium px-[12px] py-[6px] rounded-[16px] self-start" style={{ fontFamily: "Inter, sans-serif" }}>
              New
            </span>
            <div className="flex items-center justify-between">
              <p className="text-white text-[16px] leading-[24px] font-medium flex-1 max-w-[1000px]" style={{ fontFamily: "Inter, sans-serif" }}>
                Best Practices for Integrating AI into Your Existing Business Workflows
              </p>
              <svg className="w-[24px] h-[24px] text-white shrink-0 ml-[8px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* 3 smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
          {SMALL_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative rounded-[12px] overflow-hidden h-[260px] md:h-[338px] cursor-pointer group"
            >
              <img src={card.img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/66 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-[16px] md:p-[32px] flex flex-col gap-[8px]">
                <span className="bg-white text-[#212122] text-[12px] leading-[18px] font-medium px-[12px] py-[6px] rounded-[16px] self-start" style={{ fontFamily: "Inter, sans-serif" }}>
                  New
                </span>
                <div className="flex items-center justify-between">
                  <p className="text-white text-[14px] md:text-[16px] leading-[24px] font-medium flex-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {card.title}
                  </p>
                  <svg className="w-[24px] h-[24px] text-white shrink-0 ml-[8px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
