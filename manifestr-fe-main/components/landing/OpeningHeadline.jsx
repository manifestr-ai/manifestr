import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

/**
 * Figma: MANIFESTR Marketing Site — Opening Headline (node 14464:24612).
 * Mobile circular mark + image row: nodes 12067:8166, 12067:8160 (dev).
 * MCP asset URLs expire (~7 days); mirror uploads to Cloudinary for production.
 * @see https://www.figma.com/design/ulm4bsVlGaA3CAnXauawhS/MANIFESTR-Marketing-Site?node-id=14464-24612
 * @see https://www.figma.com/design/ulm4bsVlGaA3CAnXauawhS/MANIFESTR-Marketing-Site?node-id=12067-8160
 * @see https://www.figma.com/design/ulm4bsVlGaA3CAnXauawhS/MANIFESTR-Marketing-Site?node-id=12067-8166
 */
const FIGMA_ASSETS = {
  logomark:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046046/Vector_1_tmgxe4.svg',
  circleRing:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046160/Group_jbs8sb.svg',
  imageLeft:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777458800/Homepage_Woman_x2_bedzbo.webp',
  imageRight:
    'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046086/Placeholder_Image-1_ldgb49.png',
}

const IMG_LEFT =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777458800/Homepage_Woman_x2_bedzbo.webp'
const IMG_RIGHT =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046086/Placeholder_Image-1_ldgb49.png'
const LOGOMARK_FALLBACK = '/assets/logos/M.logo.svg'
const IMG_CIRCLE =
  'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775046160/Group_jbs8sb.svg'

/** Body copy under hero — matches Figma muted-foreground / Inter specs */
const BODY_COPY_STYLE = {
  fontFamily: 'Inter',
  fontSize: '20px',
  fontStyle: 'normal',
  fontWeight: 300,
  lineHeight: '28px',
  color: '#52525B',
}

/**
 * Desktop only — M. logomark uses `position: absolute` on the hero shell
 * (`max-w-[1440px]` + horizontal padding). Edit these three values to move it.
 * (Mobile M sits above the headline, centered; desktop M stays absolute.)
 */
const DESKTOP_M_LOGO = {
  topPx: 120,
  rightPx: 140,
  sizePx: 96,
}

/** Figma 12067:8166 — inner black mark (dev mode width / height) */
const MOBILE_MANIFESTR_INNER = {
  widthPx: 55.372,
  heightPx: 55.606,
}

function ManifestrCircle() {
  const { widthPx: innerW, heightPx: innerH } = MOBILE_MANIFESTR_INNER
  /** Ring frame — desktop ratio ring : inner = 150 : 87 */
  const ringSize = Math.round(Math.max(innerW, innerH) * (150 / 87) * 1000) / 1000
  const iconPx = Math.round(Math.min(innerW, innerH) * 0.42 * 100) / 100

  return (
    <>
      {/* Mobile — Figma 12067:8166 */}
      <div
        className="relative flex h-[226px] shrink-0 items-center justify-center md:hidden"
        style={{ width: `${ringSize}px` }}
      >
        <div className="relative shrink-0" style={{ width: `${ringSize}px`, height: `${ringSize}px` }}>
          <CldImage
            src={FIGMA_ASSETS.circleRing}
            alt=""
            className="absolute inset-0 block size-full max-w-none object-contain"
            style={{ animation: 'spinRing 12s linear infinite' }}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = IMG_CIRCLE
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex shrink-0 items-center justify-center rounded-full bg-[#18181b]"
              style={{ width: `${innerW}px`, height: `${innerH}px` }}
            >
              <svg
                style={{ width: `${iconPx}px`, height: `${iconPx}px` }}
                viewBox="0 0 40 40"
                fill="none"
                stroke="white"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 30L30 10" />
                <path d="M13 10h17v17" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop — original proportions (Figma opening headline desktop) */}
      <div className="relative hidden h-[235px] w-[150px] shrink-0 items-center justify-center py-[42px] md:flex md:py-[70px]">
        <div className="relative size-[150px] shrink-0">
          <CldImage
            src={FIGMA_ASSETS.circleRing}
            alt=""
            className="absolute inset-0 block size-full max-w-none object-contain"
            style={{ animation: 'spinRing 12s linear infinite' }}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = IMG_CIRCLE
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-[87px] items-center justify-center rounded-full bg-[#18181b]">
              <svg
                className="size-[44px]"
                viewBox="0 0 40 40"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 30L30 10" />
                <path d="M13 10h17v17" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function OpeningHeadline() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f9fafb] py-12 md:py-20">
      <style>{`@keyframes spinRing { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 md:px-[80px]">
        {/* Desktop M. — absolute; position controlled only via DESKTOP_M_LOGO above */}
        <div
          className="pointer-events-none absolute z-20 hidden md:block"
          style={{
            top: `${DESKTOP_M_LOGO.topPx}px`,
            right: `${DESKTOP_M_LOGO.rightPx}px`,
            width: DESKTOP_M_LOGO.sizePx,
            height: DESKTOP_M_LOGO.sizePx,
          }}
        >
          <CldImage
            src={FIGMA_ASSETS.logomark}
            alt="M."
            className="size-full object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = LOGOMARK_FALLBACK
            }}
          />
        </div>

        {/* ── Top: mobile M above headline; headline + subhead (centered) ── */}
        <div className="relative mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto flex w-full max-w-[1343px] flex-col items-center text-center"
          >
            <div className="mb-4 flex justify-center md:hidden">
              <CldImage
                src={FIGMA_ASSETS.logomark}
                alt="M."
                className="size-14 object-contain sm:size-16"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = LOGOMARK_FALLBACK
                }}
              />
            </div>
            <h2
              className="mx-auto max-w-[1100px] px-2 text-[30px] leading-[1.1] tracking-[-0.6px] text-black sm:text-[44px] sm:leading-[1.08] sm:tracking-[-0.72px] md:px-14 md:text-[60px] md:leading-[62px] md:tracking-[-1.2px] lg:px-24"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
            >
              Professional documentation for
              <br />
              real-world{' '}
              <span
                style={{
                  fontFamily: "'IvyPresto Headline', serif",
                  fontWeight: 600,
                  fontStyle: 'italic',
                }}
              >
                execution.
              </span>
            </h2>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto mb-8 max-w-[900px] px-2 text-center text-[17px] font-medium leading-[24px] text-[#18181b] sm:text-[18px] sm:leading-[26px] md:mb-14 md:max-w-none md:text-[28px] md:leading-[36px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          You were hired for your expertise, not to format documents.
        </motion.p>

        {/* ── Mobile: body copy + images ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 flex flex-col gap-4 px-1 text-center text-[16px] font-light leading-[24px] text-[#52525B] not-italic md:hidden"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <p>
            Presentations, documents, spreadsheets, charts, visuals and copy are produced
            inside a single, refined execution system.
          </p>
          <p>
            By removing hours of manual creation, rewrites, editing and tool switching,
            MANIFESTR turns ideas into polished work, ready to deliver.
          </p>
        </motion.div>

        <div className="mt-6 flex flex-col gap-3 md:hidden">
          <div className="flex items-center gap-3">
            <div className="relative h-[226px] w-[65%] min-w-0 shrink-0 overflow-hidden rounded-lg">
              <CldImage
                src={IMG_LEFT}
                alt="Professional at work"
                className="absolute inset-0 size-full object-cover object-top"
              />
            </div>
            <ManifestrCircle />
          </div>
          <div className="relative h-[229px] w-full overflow-hidden rounded-lg">
            <CldImage
              src={IMG_RIGHT}
              alt="Professional at desk"
              className="absolute inset-0 size-full object-cover object-center"
            />
          </div>
        </div>

        {/* ── Desktop: Figma gap ~54px, left 500×510, right column max 637 ── */}
        <div className="mt-12 hidden min-w-0 flex-col gap-[54px] md:mt-0 md:flex md:flex-row md:items-start">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="w-full shrink-0 md:w-[min(100%,500px)] md:max-w-[500px]"
          >
            <div className="relative h-[510px] w-full overflow-hidden rounded-[12px]">
              <CldImage
                src={FIGMA_ASSETS.imageLeft}
                alt="Professional at work"
                className="absolute inset-0 size-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src = IMG_LEFT
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="flex min-w-0 flex-1 flex-col gap-8 md:max-w-[637px]"
          >
            <div
              className="mt-8 flex max-w-[634px] flex-col gap-[18px] pl-[6px] not-italic md:mt-10"
              style={BODY_COPY_STYLE}
            >
              <p>
                Presentations, documents, spreadsheets, charts, visuals and copy are produced
                inside a single, refined execution system.
              </p>
              <p>
                By removing hours of manual creation, rewrites, editing and tool switching,
                MANIFESTR turns ideas into polished work, ready to deliver.
              </p>
            </div>

            <div className="flex h-[300px] w-full max-w-[634px] items-center gap-9">
              <ManifestrCircle />
              <div className="relative h-[300px] min-w-0 flex-1 overflow-hidden rounded-[12px] md:max-w-[448px]">
                <CldImage
                  src={FIGMA_ASSETS.imageRight}
                  alt="Professional at desk"
                  className="absolute inset-0 size-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.src = IMG_RIGHT
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
