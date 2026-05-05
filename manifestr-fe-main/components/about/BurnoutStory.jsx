import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const WOMAN_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777351403/Leah_Studio_Shot_pq03z6.webp'

export default function BurnoutStory() {
  return (
    <section className="relative w-full overflow-hidden bg-[rgba(222,221,218,0.85)]">

      {/* "BURN  O UT" watermark — sits at the bottom, partially clipped by overflow-hidden — desktop only */}
      <div
        className="absolute left-0 right-0 pointer-events-none select-none hidden md:block"
        style={{ bottom: '-7%' }}
        aria-hidden="true"
      >
        <p
          className="text-[299px] leading-none tracking-[-5.98px] whitespace-nowrap"
          style={{
            fontFamily: "'IvyPresto Headline', serif",
            fontWeight: 600,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            background: 'linear-gradient(to top, rgba(227,226,223,0.52) 5.49%, rgba(193,192,186,0.52) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          BURN&nbsp;&nbsp;O UT
        </p>
      </div>

      {/* Content row */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-0 md:min-h-[972px]">

        {/* ── Left: text content ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-[48%] shrink-0 px-6 md:px-0 md:pl-[115px] md:pr-[40px]
                     pt-[48px] md:pt-[155px] pb-[24px] md:pb-[80px] flex flex-col gap-[24px]"
        >
          {/* Label */}
          <p
            className="text-[16px] md:text-[24px] leading-[24px] tracking-[0.32px] md:tracking-[0.48px] uppercase
                       text-[rgba(0,0,0,0.3)]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            EXTRAORDINARY AT A COST
          </p>

          {/* Heading */}
          <h3
            className="text-[24px] md:text-[36px] leading-[32px] md:leading-[49px]
                       tracking-[-0.48px] md:tracking-[-0.72px] text-black max-w-[520px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            To everyone else, I was unstoppable. Privately, I was burning out.
          </h3>

          {/* Paragraph 1 */}
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525c]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Friends and family got the scraps of my time. Relationships weren&rsquo;t even on the table. The reality was long hours, little sleep, relentless clients, lean teams stretched thin, and deadlines that never ended. And the admin never stopped.
          </p>

          {/* Pull quote with vertical bar */}
          <div className="flex items-stretch border-l-4 border-black pl-[20px] py-[12px] md:py-0 md:pl-0 md:border-l-0 md:gap-[16px]">
            <div className="hidden md:block w-[5px] shrink-0 bg-[#242424] rounded-full" />
            <blockquote
              className="text-[16px] md:text-[24px] leading-[24px] md:leading-[32px] tracking-[0.32px] md:tracking-[1.5px] text-black"
              style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 300, fontStyle: 'italic' }}
            >
              &ldquo;On paper, it was the dream career.{' '}
              <br className="hidden md:block" />
              Privately, I was burning out.&rdquo;
            </blockquote>
          </div>

          {/* Paragraph 2 */}
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525c]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            If you&rsquo;ve ever been across multiple projects at once, you know the feeling. No support because everyone&rsquo;s maxed out. You&rsquo;re juggling stakeholders, executive updates, reports, timelines, registrations, and decks. Then come the rewrites. The formatting. The endless version control.
          </p>
        </motion.div>

        {/* ── Right: woman photo — flush right, fills full section height ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="w-full md:w-[57%] relative min-h-[466px] md:min-h-0"
        >
          <CldImage
            src={WOMAN_IMG}
            alt="Professional woman in black dress"
            className="w-full h-full object-cover object-top absolute inset-0"
            style={{ objectPosition: 'center top' }}
          />
        </motion.div>

      </div>
    </section>
  )
}
