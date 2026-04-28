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
      <div className="relative w-full max-w-[1440px] mx-auto min-h-0 md:min-h-[1111px]">

        {/* Mobile: left column → right column → watermark bottom. Desktop: two columns row 1, watermark full width row 2. */}
        <div
          className="relative z-10 grid grid-cols-1 gap-y-[24px] px-6 pb-[24px] pt-[48px] md:grid-cols-2 md:gap-x-[41px] md:gap-y-[80px] md:px-[190px] md:pb-[80px] md:pt-[128px]"
        >
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:col-start-1 md:row-start-1 md:max-w-[506px]"
          >
            <h3
              className="capitalize text-[24px] md:text-[36px] leading-[32px] md:leading-[49px]
                         tracking-[-0.48px] md:tracking-[-0.72px] text-black mb-[16px] md:mb-[24px]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
            >
              let&rsquo;s be honest: we all know how long a deck takes.
            </h3>
            <div
              className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b] space-y-[16px]"
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
            className="w-full md:col-start-2 md:row-start-1 md:max-w-[524px]"
          >
            <h3
              className="capitalize text-[24px] md:text-[36px] leading-[32px] md:leading-[49px]
                         tracking-[-0.48px] md:tracking-[-0.72px] text-black mb-[16px] md:mb-[24px]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
            >
              from the silence of rock bottom, MANIFESTR was born.
            </h3>
            <div
              className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b] space-y-[16px]"
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

          {/* Watermark — bottom of section on mobile (after both columns); full width row below on desktop */}
          <div
            className="pointer-events-none col-span-1 w-full select-none md:col-span-2 md:row-start-2"
            aria-hidden="true"
          >
            <div className="relative">
              <p
                className="text-[20px] md:text-[64px] leading-none tracking-[-0.39px] md:tracking-[-1.28px] uppercase"
                style={watermarkStyle}
              >
                FROM THE
              </p>

              <p
                className="-ml-[2px] -mt-[5px] whitespace-nowrap text-[92px] leading-[0.95] tracking-[-1.85px] uppercase md:-ml-[20px] md:-mt-[20px] md:text-[300px] md:leading-none md:tracking-[-6px]"
                style={watermarkStyle}
              >
                SILENCE
              </p>

              <p
                className="mt-0 text-right text-[20px] leading-none tracking-[-0.39px] uppercase md:mt-[10px] md:text-[64px] md:tracking-[-1.28px]"
                style={watermarkStyle}
              >
                MANIFESTR WAS BORN
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
