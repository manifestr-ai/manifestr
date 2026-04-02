import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const PORTRAIT = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041144/Rectangle_23179_jogmce.png'

export default function EverythingBegins() {
  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto">

        {/* ── Section heading ── */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[30px] md:text-[54px] leading-[normal] md:leading-[54px] tracking-[-0.6px] md:tracking-[-1.08px] text-black
                     pt-[48px] md:pt-[83px] pb-[32px] md:pb-[60px] px-6 md:whitespace-nowrap"
        >
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
            Everything{' '}
          </span>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
            begins with an idea{' '}
          </span>
        </motion.h2>

        {/* ── Two-column body ── */}
        <div className="flex flex-col md:flex-row pb-[48px] md:pb-[83px]">

          {/* Left — tall rounded image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-[44%] px-6 md:px-0 md:pl-[68px] shrink-0"
          >
            <div className="rounded-[14px] md:rounded-[12px] overflow-hidden h-[456px] md:h-[724px]">
              <CldImage
                src={PORTRAIT}
                alt="Two women sitting on a glass floor overlooking New York skyline"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Right — story content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-full md:w-[56%] px-6 md:px-0 md:pl-[67px] md:pr-[80px]
                       pt-[24px] md:pt-[95px] flex flex-col gap-[16px] md:gap-[24px]"
          >

            {/* Mixed-font heading — matches Figma mid-word font switching exactly */}
            <h3
              className="text-[24px] md:text-[36px] leading-[32px] md:leading-[49px] tracking-[-0.48px] md:tracking-[-0.72px] text-black"
            >
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Burnout</span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}> almost b</span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>roke</span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}> me.</span>
              <br />
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                It hit so hard I thought i&rsquo;d never get back up&hellip; and I don&rsquo;t break easily.
              </span>
            </h3>

            {/* Paragraph 1 */}
            <p
              className="text-[15px] md:text-[18px] leading-[26px] text-[#52525b]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              But this was different. Rock bottom left me empty, numb, silent, undone. Yet in that silence, an idea broke through, clearer than anything I&rsquo;d ever felt. Once it arrived, it never left.
            </p>

            {/* Paragraph 2 */}
            <p
              className="text-[15px] md:text-[18px] leading-[26px] text-[#52525b]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              I&rsquo;ve had an incredible career: from running Superyacht parties at F1 and managing venue logistics for Eminem and Taylor Swift, to opening a stadium, delivering award-winning experiences, and seeing 100,000 people at a single event. Along the way, I delivered projects across seven countries for brands like TikTok, Shiseido, Porsche, and Binance, with agencies including George P. Johnson, DARKHORSE, Jack Morton, and Lux Events.
            </p>

            {/* Pull quote — vertical bar + italic quote */}
            <div className="flex items-stretch border-l-4 border-black pl-[20px] md:pl-0 md:border-l-0 md:gap-[16px]">
              <div className="hidden md:block w-[5px] shrink-0 rounded-full bg-[#242424]" />
              <blockquote
                className="text-[18px] md:text-[32px] leading-[26px] md:leading-[40px] tracking-[0.36px] md:tracking-[2px] text-black md:lowercase"
                style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 300, fontStyle: 'italic' }}
              >
                &ldquo;Burnout almost broke me. Yet in{' '}
                <br className="hidden md:block" />
                that silence, an idea broke through.&rdquo;
              </blockquote>
            </div>

            {/* Paragraph 3 */}
            <p
              className="text-[15px] md:text-[18px] leading-[26px] text-[#52525b]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              On paper, it was the dream career. And in many ways, it truly was. Extraordinary moments. Worth it? Absolutely. But it demanded everything.
            </p>

          </motion.div>
        </div>

      </div>
    </section>
  )
}
