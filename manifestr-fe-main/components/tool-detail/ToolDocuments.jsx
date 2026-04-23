import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const DOC_BG_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774955690/Frame_2147229619_ymqnrl.jpg'
const CHECK_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774955815/Vector_f5rveb.svg'

export default function ToolDocuments({ tool }) {
  const { documentsTitle, documentDescription, documentChecklist } = tool

  const titleWords = (documentsTitle || '').split(' ')
  const lastWord = titleWords.pop()
  const titleStart = titleWords.join(' ')

  return (
    <section className="w-full bg-white relative overflow-hidden md:min-h-[660px]">
      <CldImage src={DOC_BG_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none" />
      <div className="absolute inset-0 bg-white/80 md:bg-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-[48px] md:py-[110px]">
        <div className="w-full max-w-[960px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[32px] md:text-[54px] leading-[39px] md:leading-[72px] tracking-[-0.64px] md:tracking-[-1.08px] mb-[16px] md:mb-[24px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
              {titleStart}{' '}
            </span>
            <em style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              {lastWord}
            </em>
          </motion.h2>

          {documentDescription && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[16px] md:text-[18px] leading-[28px] text-[#52525b] mb-[32px] max-w-full"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {documentDescription}
            </motion.p>
          )}

          {documentChecklist && documentChecklist.length > 0 && (
            <div className="flex flex-col gap-[20px] mb-[40px]">
              {documentChecklist.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-[12px]"
                >
                  <CldImage src={CHECK_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
                  <span
                    className="text-[16px] md:text-[18px] leading-[24px] text-[#52525b] text-left"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-[54px] px-[24px] bg-[#18181b] text-white text-[16px] md:text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore MANIFESTR
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
