import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const SMILING_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029560/Mads_smiling_1_ewvmlk.png'
const PSYCHOLOGIST_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029562/close-up-female-psychologist-writing-down-notes-therapy-with-her-male-patient_1_cwctit.png'
const LANDSCAPE_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775029563/close-up-female-psychologist-writing-down-notes-therapy-with-her-male-patient_1-1_y2s7bk.png'

const ARTICLES = [
  { img: SMILING_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: PSYCHOLOGIST_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: PSYCHOLOGIST_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
  { img: LANDSCAPE_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows' },
]

export default function TrendingArticles() {
  return (
    <section className="w-full bg-[#f9fafb] pt-[48px] pb-[12px] md:pt-[96px] md:pb-[16px] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        <div className="mb-[32px] md:mb-[36px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[30px] md:text-[48px] leading-[38px] md:leading-[60px] tracking-[-0.96px] text-black"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            Trending Articles
          </motion.h2>
        </div>

        {/* Cards row — no scrollbar */}
        <div
          className="flex gap-[16px] md:gap-[24px] overflow-x-auto [&::-webkit-scrollbar]:hidden pb-[4px] -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ARTICLES.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative rounded-[6px] md:rounded-[12px] overflow-hidden shrink-0 w-[240px] md:w-[400px] h-[300px] md:h-[500px] cursor-pointer group"
            >
              <CldImage src={article.img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/66" />
              <div className="absolute bottom-0 left-0 right-0 p-[16px] md:p-[32px] flex flex-col gap-[8px]">
                <span
                  className="bg-white text-[#212122] text-[10px] md:text-[12px] leading-[18px] font-medium px-[12px] py-[6px] h-[18px] md:h-auto flex items-center rounded-[16px] self-start"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  New
                </span>
                <div className="flex items-center justify-between">
                  <p className="text-white text-[12px] md:text-[16px] leading-[24px] font-medium flex-1 w-[197px] md:w-auto" style={{ fontFamily: "Inter, sans-serif" }}>
                    {article.title}
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
