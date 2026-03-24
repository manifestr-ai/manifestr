import { motion } from 'framer-motion'

const watermarkStyle = {
  fontFamily: "'IvyPresto Headline', serif",
  fontWeight: 600,
  fontStyle: 'italic',
  color: 'rgba(227,226,223,0.52)',
}

export default function FromTheSilence() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="relative w-full max-w-[1440px] mx-auto min-h-[600px] md:min-h-[1111px]">

        {/* ── Two-column text content ── */}
        <div className="relative z-10 flex flex-col md:flex-row gap-[40px] md:gap-[72px]
                        px-6 md:px-[190px] pt-[80px] md:pt-[128px]">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 max-w-[506px]"
          >
            <h3
              className="text-[26px] md:text-[36px] leading-[1.36] md:leading-[49px]
                         tracking-[-0.72px] text-black mb-[24px]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
            >
              Let&rsquo;s Be Honest: We All Know
              <br className="hidden md:block" />
              {' '}How Long A Deck Takes.
            </h3>
            <div
              className="text-[15px] md:text-[18px] leading-[26px] text-[#52525b] space-y-[16px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              <p>
                Hours, sometimes days, just to make it look right. Sure, we reuse templates, but lining up boxes and checking fonts? Who has time for that when deadlines are already closing in?
              </p>
              <p>
                You&rsquo;re more than capable of the work. But it&rsquo;s the documentation that drains your hours. Time that should be spent elevating projects, driving strategy, and creating impact.
              </p>
              <p>
                It&rsquo;s never been about whether you can do it. Of course you can. The real question is: why should you have to?
              </p>
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-full md:w-1/2 max-w-[492px]"
          >
            <h3
              className="text-[26px] md:text-[36px] leading-[1.36] md:leading-[49px]
                         tracking-[-0.72px] text-black mb-[24px]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
            >
              From The Silence Of Rock Bottom, MANIFESTR Was Born.
            </h3>
            <div
              className="text-[15px] md:text-[18px] leading-[26px] text-[#52525b] space-y-[16px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              <p>
                I searched everywhere for a solution. AI became the only option. Not because it was trendy, but because it was survival. I tried every platform, every tool. Some were fine for quick drafts, but none delivered agency-grade, executive-ready output.
              </p>
              <p>
                So I leaned in. I learned to push AI harder, to master prompts, to make it faster and sharper. What started as survival became a skillset. But even then, it wasn&rsquo;t built for people like us. Not really.
              </p>
              <p>
                That&rsquo;s when the idea broke through. From the silence of rock bottom, MANIFESTR was born.
              </p>
              <p>
                So I built the solution I could never find.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Watermark layer ── */}
        <div
          className="pointer-events-none select-none w-full px-6 md:px-[190px]
                     mt-[60px] md:mt-[80px] pb-[40px] md:pb-[80px]"
          aria-hidden="true"
        >
          {/* "FROM THE" — left-aligned, smaller */}
          <p
            className="text-[48px] md:text-[64px] leading-none tracking-[-1.28px] uppercase"
            style={watermarkStyle}
          >
            FROM THE
          </p>

          {/* "SILENCE" — massive, forced single line, overflows and clips at section edge */}
          <p
            className="text-[22vw] leading-none tracking-[-6px] uppercase whitespace-nowrap
                       -mt-[10px] md:-mt-[20px] -ml-[10px] md:-ml-[20px]"
            style={watermarkStyle}
          >
            SILENCE
          </p>

          {/* "MANIFESTR WAS BORN" — right-of-center */}
          <p
            className="text-[36px] md:text-[64px] leading-none tracking-[-1.28px] uppercase
                       text-right md:text-right mt-[20px] md:mt-[10px]"
            style={watermarkStyle}
          >
            MANIFESTR WAS BORN
          </p>
        </div>

      </div>
    </section>
  )
}
