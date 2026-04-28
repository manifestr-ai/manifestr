import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const AFFILIATE_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023100/Affiliate2_1_ckvktn.jpg'
const CHECK_ICON = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023115/Vector_uz3ve2.svg'

const BENEFITS = [
  'Up to 50% commission: Industry-leading payouts',
  'Earn recurring monthly commissions on active referrals',
  'Real-time affiliate dashboard for effortless tracking',
  'Proven marketing assets to help you succeed',
  'Dedicated support team whenever you need it',
]

export default function WhyJoinAffiliate() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Right image — desktop only, positioned relative to section for full viewport bleed */}
      <div className="hidden md:block absolute right-0 top-0 bottom-[67px] w-[60%]">
        <CldImage
          src={AFFILIATE_IMG}
          alt="Affiliate team"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-[80px] pt-[48px] md:py-[80px] min-h-0 md:min-h-[790px]">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col gap-[24px] md:gap-[48px] w-full md:w-[648px]"
        >
          <div className="flex flex-col gap-[24px] md:gap-[32px]">
            <h2
              className="text-[30px] md:text-[54px] leading-[normal] md:leading-[72px] tracking-[-0.6px] md:tracking-[-1.08px] text-black"
            >
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Why Join the MANIFESTR </span>
              <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Affiliate </span>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Program?</span>
            </h2>
            <p
              className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b] max-w-[605px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              At MANIFESTR, we believe bold thinkers deserve bold rewards. Our Affiliate Program offers one of the highest paying commission structures you&apos;ll find anywhere, empowering you to transform referrals into real income.
            </p>
          </div>

          <div className="flex flex-col gap-[16px] md:gap-[20px]">
            <h3
              className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] text-black"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
            >
              Key Benefits:
            </h3>
            <div className="flex flex-col gap-[12px] md:gap-[20px]">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-[12px]"
                >
                  <CldImage src={CHECK_ICON} alt="" className="w-[20px] h-[20px] shrink-0 mt-[2px]" />
                  <span
                    className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {b}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <Link
            href="/signup"
            className="inline-flex h-11 mb-12 w-full items-center justify-center self-start rounded-[6px] bg-[#18181b] px-8 text-[14px] font-medium leading-5 text-white transition-colors duration-200 hover:bg-[#27272a] md:h-[54px] md:w-auto md:text-[18px] md:leading-[20px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Apply now
          </Link>
        </motion.div>
      </div>

      {/* Affiliate image — mobile only */}
      <div className="md:hidden w-full h-[315px] overflow-hidden">
        <CldImage
          src={AFFILIATE_IMG}
          alt="Affiliate team"
          className="h-auto block"
          style={{ scale: '120%', marginLeft: '-10%' }}
        />
      </div>

      {/* Marquee bar */}
      <div className="relative w-full md:mt-[-68px] h-[44px] md:h-[67px] bg-[#383838] md:bg-black/78 flex items-center justify-center overflow-hidden">
        <p
          className="text-white text-[14px] md:text-[26px] leading-[24px] md:leading-[42px] tracking-[0.28px] md:tracking-[0.52px] uppercase whitespace-nowrap"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
        >
          APPLY FOR YOUR EXCLUSIVE AFFILIATE LINK NOW
        </p>
      </div>
    </section>
  )
}
