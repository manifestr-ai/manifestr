import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const LAPTOP_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775041143/Rectangle_34624833_g3e8qg.png'

export default function BuiltForBrilliance() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Mobile gradient bg */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: 'linear-gradient(to bottom, #f6f6f5, #e3e2df)' }}
      />
      {/* Desktop bg */}
      <div className="absolute inset-0 hidden md:block bg-[rgba(222,221,218,0.85)]" />

      <div className="relative max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-0 md:min-h-[1004px]">

        {/* Left — image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-6 w-full md:w-[50%] px-6 pt-0 md:px-0 md:pl-[124px] md:py-[154px]"
        >
          <div className="rounded-[14px] md:rounded-[12px] overflow-hidden h-[421px] md:h-[696px]">
            <CldImage
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
          className="relative z-10 w-full md:w-[50%] px-6 md:px-0 md:pl-[60px] md:pr-[80px] py-[24px] md:py-[154px] pb-[48px] flex flex-col justify-center gap-[16px] md:gap-0"
        >
          <p
            className="text-[16px] md:text-[24px] leading-[24px] tracking-[0.32px] md:tracking-[0.48px] uppercase text-[rgba(0,0,0,0.3)] md:mb-[32px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            BUILT FOR BRILLIANCE
          </p>

          <h3
            className="text-[24px] md:text-[36px] leading-[32px] md:leading-[49px] tracking-[-0.48px] md:tracking-[-0.72px] text-black md:mb-[24px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            Why is it called MANIFESTR? Because your ideas deserve more than formatting, rewrites and burnout.
          </h3>

          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525c] md:mb-[24px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            It was created to transform vision into execution, giving professionals the freedom, clarity, and power to create at the highest level.
          </p>

          {/* Pull quote */}
          <div className="flex items-start border-l-4 border-black pl-[20px] py-[12px] md:py-0 md:pl-0 md:border-l-0 md:gap-[16px] md:mb-[32px]">
            <div className="hidden md:block w-[5px] bg-[#242424] rounded-full shrink-0" style={{ minHeight: 68 }} />
            <blockquote
              className="text-[16px] md:text-[24px] leading-[24px] md:leading-[32px] tracking-[0.32px] md:tracking-[1.5px] text-black"
              style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 300, fontStyle: 'italic' }}
            >
              &ldquo;I lived the pain. I built the solution, and now it&rsquo;s yours.&rdquo;
            </blockquote>
          </div>

          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525c]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            More than a powerful AI platform, it is my way of giving back to an industry I love. One that shaped me, transformed me, and demanded everything in return. MANIFESTR was built by professionals, for professionals: designed for the pace, the polish, the pressure, and the quality that set great work apart.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
