import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const DOC_BG_IMAGE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774955690/Frame_2147229619_ymqnrl.jpg'
const CHECK_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774955815/Vector_f5rveb.svg'

export default function ToolDocuments({ tool }) {
  const { slug, documentsTitle, documentDescription, documentChecklist } = tool
  const shiftDocumentsLeft = slug === 'analyzer'

  const words = (documentsTitle || '').trim().split(/\s+/).filter(Boolean)
  const lastWord = words.length ? words[words.length - 1] : ''
  const wordsBeforeLast = words.length > 1 ? words.slice(0, -1) : []
  const holdIdx = wordsBeforeLast.findIndex((w) => w.toLowerCase() === 'hold')
  const titleBeforeHold =
    holdIdx >= 0 ? wordsBeforeLast.slice(0, holdIdx).join(' ') : wordsBeforeLast.join(' ')
  const titleFromHold =
    holdIdx >= 0 ? wordsBeforeLast.slice(holdIdx).join(' ') : ''
  const titleStart = holdIdx >= 0 ? '' : wordsBeforeLast.join(' ')

  return (
    <section className="w-full bg-zinc-950 relative overflow-hidden md:min-h-[660px]">
      <CldImage src={DOC_BG_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none" />
      <div className="absolute inset-0 bg-black/60 md:bg-black/55 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-[48px] md:py-[110px]">
        <div
          className={`w-full max-w-[960px] ${shiftDocumentsLeft ? 'md:-ml-6 lg:-ml-10 xl:-ml-14' : ''}`}
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-white text-[32px] md:text-[54px] leading-[39px] md:leading-[72px] tracking-[-0.64px] md:tracking-[-1.08px] mb-[16px] md:mb-[24px]"
          >
            {holdIdx >= 0 ? (
              <>
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  {titleBeforeHold}
                </span>
                <br />
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  {titleFromHold}{' '}
                </span>
                <em
                  className="text-white"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  {lastWord}
                </em>
              </>
            ) : (
              <>
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  {titleStart}{' '}
                </span>
                <em
                  className="text-white"
                  style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}
                >
                  {lastWord}
                </em>
              </>
            )}
          </motion.h2>

          {documentDescription && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[16px] md:text-[18px] leading-[28px] text-white/90 mb-[32px] max-w-[min(100%,48rem)]"
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
                  <CldImage
                    src={CHECK_ICON}
                    alt=""
                    className="w-[20px] h-[20px] shrink-0 brightness-0 invert"
                  />
                  <span
                    className="text-[16px] md:text-[18px] leading-[24px] text-white/90 text-left"
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
              className="inline-flex items-center justify-center h-[54px] px-[24px] bg-white text-[#18181b] text-[16px] md:text-[18px] leading-[20px] font-medium rounded-[6px] hover:bg-zinc-100 transition-colors whitespace-nowrap"
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
