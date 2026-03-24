import { motion } from 'framer-motion'

const BG_IMG    = 'https://www.figma.com/api/mcp/asset/c1464cf0-ca75-406d-b125-b4d8f911a082'
const ARROW_IMG = 'https://www.figma.com/api/mcp/asset/8cf98a58-d287-4dcf-9974-dbae3724bdcf'

export default function CommitmentToInclusion() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src={BG_IMG}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content row */}
      <div className="relative max-w-[1440px] mx-auto px-[66px] py-[48px] flex flex-col md:flex-row items-start md:items-center gap-[40px] min-h-[414px]">

        {/* Left — heading + body + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-[20px] w-full md:w-[758px] shrink-0"
        >
          {/* Heading */}
          <h2
            className="text-[40px] md:text-[60px] leading-[72px] tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Our </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Commitment</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> to Inclusion</span>
          </h2>

          {/* Body */}
          <div
            className="text-[16px] leading-[24px] text-[#52525b] flex flex-col gap-[16px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            <p>
              At MANIFESTR, diversity is not a checkbox, it&apos;s a strength. We believe the future of work is shaped by bringing together different perspectives, experiences, and ways of thinking.
            </p>
            <p>
              Every background adds depth, and authenticity drives better outcomes. We foster a team where inclusion is lived day to day, not written into policy. A culture where people are respected, trusted, and valued for the quality of what they contribute.
            </p>
          </div>

          {/* CTA button */}
          <button
            className="self-start flex items-center gap-[8px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium px-[24px] py-[8px] h-[44px] rounded-[6px] hover:bg-[#333] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Read Our DEI Statement
            <img src={ARROW_IMG} alt="" className="w-[16px] h-[16px]" />
          </button>
        </motion.div>

        {/* Right — dark quote card */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:ml-auto w-full md:w-[454px] h-[278px] bg-[#18181b] rounded-[12px] flex flex-col justify-center px-[24px] pt-[59px] pb-[24px] shrink-0"
        >
          <p
            className="text-white text-[40px] leading-normal tracking-[-0.8px] text-center"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            Different minds.{'\n'}
            <br />
            Shared mission.{'\n'}
            <br />
            Infinite possibilities.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
