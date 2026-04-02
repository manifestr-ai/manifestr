import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const BG_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'
const MOBILE_BG_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'
const ARROW_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775028600/Vector_z91ror.svg'

export default function CommitmentToInclusion() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Desktop background */}
      <div className="absolute inset-0 hidden md:block">
        <CldImage
          src={BG_IMG}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Mobile background */}
      <div className="absolute inset-0 md:hidden overflow-hidden">
        <CldImage
          src={MOBILE_BG_IMG}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mobile layout */}
      <div className="md:hidden relative flex flex-col items-center gap-[31px] px-[29px] py-[102px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-[31px] w-full max-w-[332px]"
        >
          <h2 className="text-[30px] leading-[35px] tracking-[-0.6px] text-black text-center">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Our </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              Commitment
            </span>
            <br />
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> to Inclusion</span>
          </h2>

          <p
            className="text-[14px] leading-[24px] text-black text-center max-w-[340px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            At MANIFESTR, inclusion is not a statement. It&apos;s a standard. We prioritise equitable access, diverse perspectives, and an environment where people are respected for the quality of their work and ideas.
          </p>

          <div className="w-[284px] h-[134px] bg-black rounded-[13px] flex items-center justify-center px-[12px]">
            <p
              className="text-white text-[27px] leading-[normal] tracking-[-0.54px] text-center"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
            >
              Different minds.<br />
              Shared mission.<br />
              Infinite possibilities.
            </p>
          </div>

          <button
            className="flex items-center gap-[8px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium px-[24px] py-[8px] h-[44px] rounded-[6px] hover:bg-[#333] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Read Our DEI Statement
            <CldImage src={ARROW_IMG} alt="" className="w-[16px] h-[16px]" />
          </button>
        </motion.div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex relative max-w-[1440px] mx-auto px-[66px] py-[48px] flex-row items-center gap-[40px] min-h-[414px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-[20px] w-[758px] shrink-0"
        >
          <h2
            className="text-[60px] leading-[72px] tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Our </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Commitment</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}> to Inclusion</span>
          </h2>

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

          <button
            className="self-start flex items-center gap-[8px] bg-[#18181b] text-white text-[14px] leading-[20px] font-medium px-[24px] py-[8px] h-[44px] rounded-[6px] hover:bg-[#333] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Read Our DEI Statement
            <CldImage src={ARROW_IMG} alt="" className="w-[16px] h-[16px]" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="ml-auto w-[454px] h-[278px] bg-[#18181b] rounded-[12px] flex flex-col justify-center px-[24px] pt-[59px] pb-[24px] shrink-0"
        >
          <p
            className="text-white text-[40px] leading-normal tracking-[-0.8px] text-center"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            Different minds.
            <br />
            Shared mission.
            <br />
            Infinite possibilities.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
