import { motion } from 'framer-motion'
import Link from 'next/link'

const DOC_BG_IMAGE = 'https://www.figma.com/api/mcp/asset/9f4989e6-5f3f-49b7-9439-4313354b7a4e'
const CHECK_ICON = 'https://www.figma.com/api/mcp/asset/8f78a161-db93-4963-b0bd-827757bc9583'

export default function ToolDocuments({ tool }) {
  const { documentsTitle, documentDescription, documentChecklist } = tool

  const titleWords = (documentsTitle || '').split(' ')
  const lastWord = titleWords.pop()
  const titleStart = titleWords.join(' ')

  return (
    <section className="w-full bg-white relative overflow-hidden min-h-[500px] md:min-h-[660px]">
      <img src={DOC_BG_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[80px] py-[64px] md:py-[110px]">
        <div className="max-w-[780px]">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-[24px]"
            style={{ fontSize: 'clamp(32px, 3.75vw, 54px)', lineHeight: '72px', letterSpacing: '-1.08px' }}
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
              className="text-[16px] md:text-[18px] leading-[28px] text-[#52525b] mb-[32px] max-w-[689px]"
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
                  <img src={CHECK_ICON} alt="" className="w-[20px] h-[20px] shrink-0" />
                  <span
                    className="text-[16px] md:text-[18px] leading-[24px] text-[#52525b]"
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
              className="inline-flex items-center justify-center h-[54px] px-[24px] bg-[#18181b] text-white text-[16px] md:text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-[#27272a] transition-colors"
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
