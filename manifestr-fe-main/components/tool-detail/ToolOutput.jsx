import Link from 'next/link'
import CldImage from '../ui/ToolkitCldImage'

/**
 * Reference: see_the_calibre_section PNG + Figma 12468:22109/22110.
 * Fixed tile widths (px) per row — sums + 3×COL_GAP = GRID_W for each row.
 */
const COL_GAP = 18
const ROW_GAP = 18
const GRID_W = 896
const GRID_H = 608
const TILE_RADIUS = 4
/** Middle row shifts left (toward copy) after parent -rotate-30 */
const MIDDLE_ROW_SHIFT_X = -104
const MIDDLE_ROW_SHIFT_X_MOBILE = -40

const IMAGE_ROWS = [
  [
    { src: 'https://picsum.photos/seed/out1/460/486', w: 224 },
    { src: 'https://picsum.photos/seed/out2/460/486', w: 196 },
    { src: 'https://picsum.photos/seed/out3/460/486', w: 248 },
    { src: 'https://picsum.photos/seed/out4/460/486', w: 174 },
  ],
  [
    { src: 'https://picsum.photos/seed/out6/460/486', w: 200 },
    { src: 'https://picsum.photos/seed/out7/460/486', w: 228 },
    { src: 'https://picsum.photos/seed/out8/460/486', w: 220 },
    { src: 'https://picsum.photos/seed/out9/460/486', w: 194 },
  ],
  [
    { src: 'https://picsum.photos/seed/out11/460/486', w: 214 },
    { src: 'https://picsum.photos/seed/out12/460/486', w: 206 },
    { src: 'https://picsum.photos/seed/out13/460/486', w: 232 },
    { src: 'https://picsum.photos/seed/out14/460/486', w: 190 },
  ],
]

/** Figma 12468:22109 — middle line + body paragraph, keyed by tool slug. */
const OUTPUT_SECTION_BY_SLUG = {
  strategist: {
    middleLine: 'The Strategist',
    body: 'Forget generic strategy outputs. Strategy, held to a higher standard. The Strategist creates structured, decision-ready documents designed for real execution. Every insight is refined, defensible, and built to perform under scrutiny. Curious? See it in action.',
  },
  deck: {
    middleLine: 'The Deck',
    body: 'Forget average presentations. This is persuasion engineered to win the room. The Deck produces structured, visually powerful presentations designed to command attention and drive decision. Every slide is intentional, refined and built to stand up under pressure. Curious? See it in action.',
  },
  analyzer: {
    middleLine: 'The Analyzer',
    body: 'Forget surface-level reporting. Insight designed to remove doubt. The Analyzer produces structured, decision-ready analysis built to withstand challenge. Every chart is intentional, refined, and built to support confident decisions. Curious? See it in action.',
  },
  briefcase: {
    middleLine: 'The Briefcase',
    body: 'Forget scattered notes and decisions lost in threads. This is documentation built to run the work. The Briefcase produces structured, execution-ready documents designed to align teams and secure scope. Every detail is deliberate, defined, and built to prevent drift.\nCurious? See it in action.',
  },
  'cost-ctrl': {
    middleLine: 'Cost CTRL',
    body: 'Forget spreadsheet chaos and financial guesswork. This is commercial discipline in action. Cost CTRL produces structured, decision-ready financial documents built for accountability, margin protection, and growth. Every number is precise, defensible, and built to support confident scale. Curious? See it in action.',
  },
  wordsmith: {
    middleLine: 'The Wordsmith',
    body: 'Forget filler copy and empty messaging. This is language built to influence. Wordsmith produces structured, outcome-driven messaging designed to shape perception and drive decision. Every word is deliberate, refined, and built to alter the outcome. Curious? See it in action.',
  },
  'design-studio': {
    middleLine: 'The Design Studio',
    body: 'Forget generic visuals and design guesswork. This is creative that elevates value. Design Studio produces structured, brand-aligned visuals designed to meet a professional standard. Every asset is intentional, refined, and built to define perception instantly. Curious? See it in action.',
  },
  huddle: {
    middleLine: 'The Huddle',
    body: 'Forget meetings that go nowhere. This is collaboration built for execution. The Huddle produces structured, accountability-ready documentation designed to move work forward. Every conversation is structured and built to translate into documented results. Curious? See it in action.',
  },
}

function getOutputSection(slug) {
  return OUTPUT_SECTION_BY_SLUG[slug] || OUTPUT_SECTION_BY_SLUG.strategist
}

const hk700 = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }
const ivyCalibre = {
  fontFamily: "'IvyPresto Headline', serif",
  fontWeight: 600,
  fontStyle: 'italic',
}

/** Figma 12468:22111 — copy stack (left inset tightened vs Figma 74px) */
const COPY = {
  leftPx: 32,
  /** Wide enough for line 2: "{tool} delivers" on one physical line */
  columnMaxPx: 720,
  /** Line 1: "The Calibre of Output" */
  titleLine1MaxPx: 555,
  /** Figma body width */
  bodyWidthPx: 513,
  /** gap between title / body / button row */
  stackGapPx: 24,
}

/**
 * Figma 12468:22110 — rotated collage; absolute frame clips off viewport edges.
 */
function OutputImageGrid() {
  return (
    <div
      className="pointer-events-none absolute hidden md:flex items-center justify-center"
      style={{
        width: '1260px',
        height: '1080px',
        right: '-380px',
        top: '-348px',
      }}
      aria-hidden
    >
      <div
        className="-rotate-30 flex-none"
        style={{ width: `${GRID_W}px`, height: `${GRID_H}px` }}
      >
        <div
          className="flex h-full w-full flex-col"
          style={{ gap: `${ROW_GAP}px` }}
        >
          {IMAGE_ROWS.map((row, ri) => (
            <div
              key={ri}
              className={`flex min-h-0 flex-1 flex-row ${ri === 1 ? 'relative z-10' : 'relative z-0'}`}
              style={{
                gap: `${COL_GAP}px`,
                transform: ri === 1 ? `translateX(${MIDDLE_ROW_SHIFT_X}px)` : undefined,
              }}
            >
              {row.map((tile, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className="min-h-0 shrink-0 overflow-hidden"
                  style={{
                    width: `${tile.w}px`,
                    height: '100%',
                    borderRadius: `${TILE_RADIUS}px`,
                  }}
                >
                  <CldImage
                    src={tile.src}
                    alt=""
                    className="size-full object-cover"
                    style={{ filter: 'grayscale(100%)' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Mobile: proportional scale of the same grid math */
function OutputImageGridMobile() {
  const scale = 0.52
  const mw = Math.round(GRID_W * scale)
  const mh = Math.round(GRID_H * scale)
  const gx = Math.round(COL_GAP * scale)
  const gy = Math.round(ROW_GAP * scale)
  const r = Math.max(2, Math.round(TILE_RADIUS * scale))

  return (
    <div
      className="relative mx-[-16px] h-[220px] overflow-hidden md:hidden"
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="-rotate-30 flex-none"
          style={{ width: `${mw}px`, height: `${mh}px` }}
        >
          <div className="flex h-full w-full flex-col" style={{ gap: `${gy}px` }}>
            {IMAGE_ROWS.map((row, ri) => (
              <div
                key={ri}
                className={`flex min-h-0 flex-1 flex-row ${ri === 1 ? 'relative z-10' : 'relative z-0'}`}
                style={{
                  gap: `${gx}px`,
                  transform:
                    ri === 1 ? `translateX(${MIDDLE_ROW_SHIFT_X_MOBILE}px)` : undefined,
                }}
              >
                {row.map((tile, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    className="min-h-0 shrink-0 overflow-hidden"
                    style={{
                      width: `${Math.round(tile.w * scale)}px`,
                      height: '100%',
                      borderRadius: `${r}px`,
                    }}
                  >
                    <CldImage
                      src={tile.src}
                      alt=""
                      className="size-full object-cover"
                      style={{ filter: 'grayscale(100%)' }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ToolOutput({ tool }) {
  const slug = tool?.slug
  const { middleLine, body } = getOutputSection(slug)

  return (
    <section className="w-full overflow-hidden bg-[#f4f4f5]">
      <div
        className="relative mx-auto min-h-[400px] w-full max-w-[1440px] md:min-h-[680px]"
      >
        <OutputImageGrid />

        <div className="relative z-10 px-5 py-14 sm:px-8 md:px-0 md:py-0">
          <div
            className="hidden md:flex md:flex-col"
            style={{
              position: 'absolute',
              left: `${COPY.leftPx}px`,
              top: '50%',
              transform: 'translateY(50%)',
              maxWidth: `${COPY.columnMaxPx}px`,
              gap: `${COPY.stackGapPx}px`,
            }}
          >
            <h2 className="shrink-0 text-[60px] leading-[62px] tracking-[-1.2px] text-black" style={hk700}>
              <span className="block" style={{ maxWidth: `${COPY.titleLine1MaxPx}px` }}>
                <span style={hk700}>The </span>
                <em className="not-italic" style={ivyCalibre}>
                  Calibre
                </em>
                <span style={hk700}> of Output</span>
              </span>
              <span className="block whitespace-nowrap" style={hk700}>
                {middleLine} delivers
              </span>
            </h2>

            <p
              className={`shrink-0 text-[18px] font-normal leading-[28px] text-[#52525b] ${body.includes('\n') ? 'whitespace-pre-line' : ''}`}
              style={{
                fontFamily: 'Inter, sans-serif',
                width: `${COPY.bodyWidthPx}px`,
                maxWidth: '100%',
              }}
            >
              {body}
            </p>

            <Link
              href="/signup"
              className="inline-flex h-11 w-fit shrink-0 items-center justify-start rounded-md bg-[#18181b] px-5 text-left text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a] whitespace-nowrap"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
            </Link>
          </div>

          <div className="flex flex-col gap-5 md:hidden">
            <h2
              className="text-center text-[32px] leading-[38px] tracking-[-0.64px] text-black"
              style={hk700}
            >
              <span className="block">
                <span style={hk700}>The </span>
                <em className="not-italic" style={ivyCalibre}>
                  Calibre
                </em>
                <span style={hk700}> of Output</span>
              </span>
              <span className="block whitespace-nowrap" style={hk700}>
                {middleLine} delivers
              </span>
            </h2>

            <p
              className={`text-center text-[16px] font-normal leading-[26px] text-[#52525b] ${body.includes('\n') ? 'whitespace-pre-line' : ''}`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {body}
            </p>

            <OutputImageGridMobile />

            <Link
              href="/signup"
              className="inline-flex h-11 w-fit shrink-0 items-center justify-start self-start rounded-md bg-[#18181b] px-5 text-left text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a] whitespace-nowrap"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Enter MANIFESTR
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
