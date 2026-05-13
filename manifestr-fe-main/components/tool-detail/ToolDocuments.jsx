import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/ToolkitCldImage'

const DOC_BG_IMAGE =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777351581/Laptop_Rock_Desktop_1441x915_x2__Light_vw1azu.webp'
const CHECK_ICON =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774955815/Vector_f5rveb.svg'

/** Desktop hero — scale > 1 zooms in (origin keeps laptop in frame). */
const DESKTOP_HERO_IMAGE_SCALE = 1.14

const hk700 = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }
const ivy = { fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }
const inter = { fontFamily: 'Inter, sans-serif' }

export default function ToolDocuments({ tool }) {
  const { slug, documentsTitle, documentDescription, documentChecklist } = tool
  const shiftDocumentsLeft = slug === 'analyzer'

  const words = (documentsTitle || '').trim().split(/\s+/).filter(Boolean)
  const lastWord = words.length ? words[words.length - 1] : ''
  const wordsBeforeLast = words.length > 1 ? words.slice(0, -1) : []
  const holdIdx = wordsBeforeLast.findIndex((w) => w.toLowerCase() === 'hold')
  const titleBeforeHold =
    holdIdx >= 0 ? wordsBeforeLast.slice(0, holdIdx).join(' ') : wordsBeforeLast.join(' ')
  const titleFromHold = holdIdx >= 0 ? wordsBeforeLast.slice(holdIdx).join(' ') : ''
  const titleStart = holdIdx >= 0 ? '' : wordsBeforeLast.join(' ')

  /** Shared heading JSX — color applied by parent */
  function TitleContent({ textClass }) {
    return holdIdx >= 0 ? (
      <>
        <span className={textClass} style={hk700}>{titleBeforeHold}</span>
        <br />
        <span className={textClass} style={hk700}>{titleFromHold} </span>
        <em className={`not-italic ${textClass}`} style={ivy}>{lastWord}</em>
      </>
    ) : (
      <>
        <span className={textClass} style={hk700}>{titleStart} </span>
        <em className={`not-italic ${textClass}`} style={ivy}>{lastWord}</em>
      </>
    )
  }

  /* ─────────────────────────────────────────────
     DESKTOP  — Figma 12469:22812
     bg-white, absolute image bleed, content col
  ───────────────────────────────────────────── */
  const desktopChecklist = documentChecklist || []
  // Figma: items start top:318, each +44px. Button top:603.
  // Content col starts top:110. Title h≈72, gap:24, desc h≈84 → col bottom ≈ 290.
  // Normal flow in a max-width column so variable-length content never overflows the viewport.

  return (
    <>
      {/* ── DESKTOP ── */}
      <section className="relative hidden w-full overflow-x-hidden bg-white md:block">
        {/* Figma frame: content ~657px tall → 720px min-height; clip bleed like other tool sections */}
        <div
          className="relative w-full min-w-0"
          style={{ minHeight: '720px' }}
        >
          {/* Full-width bg image — contained to viewport (no min-width:1583px scroll) */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
          >
            <CldImage
              src={DOC_BG_IMAGE}
              alt=""
              className="absolute inset-0 h-full w-full max-w-none object-cover object-right"
              style={{
                transform: `scale(${DESKTOP_HERO_IMAGE_SCALE})`,
                transformOrigin: '82% 48%',
              }}
            />
          </div>

          {/* Figma 12469:22815 — content column: left ~83px, top ~110, max 780px (fluid below xl) */}
          <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[1440px] flex-col px-8 pb-16 pt-[110px] md:px-10 lg:pl-[83px] lg:pr-10 xl:px-12 min-[1600px]:px-16">
            <div className="flex w-full min-w-0 max-w-[780px] flex-col">
            {/* Figma 12469:22817 — title + description, gap:24 */}
            <div className="flex flex-col gap-6">
              <h2
                className="max-w-full text-[54px] leading-[72px] tracking-[-1.08px] text-black"
                style={hk700}
              >
                <TitleContent textClass="text-black" />
              </h2>

              {documentDescription && (
                <p
                  className="max-w-full text-[18px] font-normal leading-[28px] text-[#52525b] md:max-w-[min(689px,100%)]"
                  style={inter}
                >
                  {documentDescription}
                </p>
              )}
            </div>

            {/* Figma 12469:22821–22856 — checklist: mt≈33px, gap:20px (44 - 24 lineheight) */}
            {desktopChecklist.length > 0 && (
              <ul
                className="m-0 flex list-none flex-col p-0"
                style={{ marginTop: '33px', gap: '20px' }}
              >
                {desktopChecklist.map((item, i) => (
                  <li key={i} className="flex min-w-0 items-center" style={{ gap: '12px' }}>
                    {/* Figma 12469:22822 — checked circle icon, 20×20 */}
                    <img
                      src={CHECK_ICON}
                      alt=""
                      width="20"
                      height="20"
                      className="shrink-0"
                      style={{ filter: 'brightness(0)' }}
                      aria-hidden
                    />
                    <span
                      className="min-w-0 break-words text-[18px] font-normal leading-6 text-[#52525b]"
                      style={inter}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Figma 12469:22857 — CTA button: top:603, mt≈41 after last item */}
            <div style={{ marginTop: '41px' }}>
              <Link
                href="/signup"
                className="inline-flex h-[54px] w-fit items-center justify-center rounded-md bg-[#18181b] px-6 text-[18px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a] whitespace-nowrap"
                style={inter}
              >
                Explore MANIFESTR
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE — original dark layout, unchanged ── */}
      <section className="relative w-full overflow-hidden bg-zinc-950 md:hidden md:min-h-[660px]">
        <CldImage
          src={DOC_BG_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-[48px] sm:px-6">
          <div className={`w-full max-w-[960px] ${shiftDocumentsLeft ? 'ml-0' : ''}`}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-[16px] text-[32px] leading-[39px] tracking-[-0.64px] text-white"
            >
              {holdIdx >= 0 ? (
                <>
                  <span style={hk700}>{titleBeforeHold}</span>
                  <br />
                  <span style={hk700}>{titleFromHold} </span>
                  <em className="text-white" style={ivy}>{lastWord}</em>
                </>
              ) : (
                <>
                  <span style={hk700}>{titleStart} </span>
                  <em className="text-white" style={ivy}>{lastWord}</em>
                </>
              )}
            </motion.h2>

            {documentDescription && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-[32px] max-w-[min(100%,48rem)] text-[16px] leading-[28px] text-white/90"
                style={inter}
              >
                {documentDescription}
              </motion.p>
            )}

            {documentChecklist && documentChecklist.length > 0 && (
              <div className="mb-[40px] flex flex-col gap-[20px]">
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
                      className="h-[20px] w-[20px] shrink-0 brightness-0 invert"
                    />
                    <span
                      className="text-left text-[16px] leading-[24px] text-white/90"
                      style={inter}
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
                className="inline-flex h-[54px] items-center justify-center rounded-[6px] bg-white px-[24px] text-[16px] font-medium leading-[20px] text-[#18181b] transition-colors hover:bg-zinc-100 whitespace-nowrap"
                style={inter}
              >
                Explore MANIFESTR
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
