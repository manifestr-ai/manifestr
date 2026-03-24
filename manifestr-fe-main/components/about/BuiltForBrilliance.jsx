import { motion } from 'framer-motion'

const LAPTOP_IMG = 'https://www.figma.com/api/mcp/asset/8576910e-813d-4d94-9f7d-8071890d822a'

export default function BuiltForBrilliance() {
  return (
    <section className="relative w-full overflow-hidden bg-[rgba(222,221,218,0.85)] py-[80px] md:py-[0px]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-[700px] md:min-h-[1004px]">

        {/* Left — image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-[50%] px-6 md:px-0 md:pl-[124px] md:py-[154px]"
        >
          <div className="rounded-[12px] overflow-hidden h-[360px] md:h-[696px]">
            <img
              src={LAPTOP_IMG}
              alt="Professional working"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Right gradient glow — subtle radial gradient on desktop */}
        <div
          className="hidden md:block absolute top-0 right-0 w-[50%] h-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(246,246,245,1) 0%, rgba(227,226,223,1) 100%)',
          }}
        />

        {/* Right content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-10 w-full md:w-[50%] px-6 md:px-0 md:pl-[60px] md:pr-[80px] py-[40px] md:py-[154px] flex flex-col justify-center"
        >
          <p
            className="text-[24px] leading-[24px] tracking-[0.48px] uppercase text-[rgba(24,24,27,0.32)] mb-[32px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            BUILT FOR BRILLIANCE
          </p>

          <h3
            className="text-[28px] md:text-[36px] leading-[1.36] md:leading-[49px] tracking-[-0.72px] text-black mb-[24px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            Why is it called MANIFESTR? Because your ideas deserve more than formatting, rewrites and burnout.
          </h3>

          <p
            className="text-[16px] md:text-[18px] leading-[26px] text-[#52525b] mb-[24px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            It was created to transform vision into execution, giving professionals the freedom, clarity, and power to create at the highest level.
          </p>

          {/* Pull quote */}
          <div className="flex gap-[16px] items-start mb-[32px]">
            <div className="w-[5px] bg-[#242424] rounded-full shrink-0" style={{ minHeight: 68 }} />
            <blockquote
              className="text-[20px] md:text-[24px] leading-[32px] tracking-[1.5px] text-black"
              style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 300, fontStyle: 'italic' }}
            >
              &ldquo;I lived the pain. I built the solution, and now it&rsquo;s yours.&rdquo;
            </blockquote>
          </div>

          <p
            className="text-[16px] md:text-[18px] leading-[26px] text-[#52525b]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            More than a powerful AI platform, it is my way of giving back to an industry I love. One that shaped me, transformed me, and demanded everything in return. MANIFESTR was built by professionals, for professionals: designed for the pace, the polish, the pressure, and the quality that set great work apart.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
