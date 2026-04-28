import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const PEOPLE_IMG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775631915/upscaled-image-1760619644309_1_m8hpfj.png'
const PEOPLE_IMG_MOBILE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023332/upscaled-image-1760619644309_1_oezfn4.jpg'
const CURVE_LINE = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023333/Vector_1_b73kah.svg'
const DOT_ICON_1 = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023336/Group_1577708898_ctj0lu.svg'
const DOT_ICON_2 = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1775023336/Group_1577708898_ctj0lu.svg'

const gradientNum = {
  backgroundImage: 'linear-gradient(189.42deg, rgb(125,125,125) 1.23%, rgba(125,125,125,0) 72.82%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

const mobileGradientNum = {
  backgroundImage: 'linear-gradient(180.3deg, rgb(125,125,125) 31.86%, rgba(125,125,125,0) 112.38%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

export default function HowItWorks() {
  return (
    <section className="relative w-full overflow-hidden bg-[#eeede9]">
      {/* === DESKTOP (md+) — pixel-faithful to Figma === */}
      <div className="hidden md:block relative w-full max-w-full mx-auto" style={{ height: 1186 }}>
        {/* People background image */}
        <div className="absolute  left-0 w-full">
          <CldImage
            src={PEOPLE_IMG}
            alt=""
            className="w-full h-auto object-center"
          />
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="absolute text-center"
          style={{ left: 79, top: 81, width: 1280, height: 144 }}
        >
          <h2
            className="text-[60px] leading-[72px] tracking-[-1.2px] text-black"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>How it </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Works</span>
          </h2>
          <p
            className="text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] text-[#52525b] mx-auto mt-[12px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, width: 898 }}
          >
            At MANIFESTR, we believe bold thinkers deserve bold rewards. Our Affiliate Program offers one of the highest paying commission structures you&apos;ll find anywhere - empowering you to transform referrals into real income.
          </p>
        </motion.div>

        {/* Curved connecting line */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ left: 59, top: -50, width: 1296, height: 788 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ transform: 'rotate(0.36deg)' }}
          >
            <CldImage src={CURVE_LINE} alt="" style={{ width: 1232, height: 402 }} />
          </motion.div>
        </div>

        {/* === Step 01 === */}
        {/* Number */}
        <p
          className="absolute text-[200px] leading-[200px] tracking-[-4px] uppercase font-bold opacity-50 whitespace-nowrap text-center -translate-x-1/2 select-none"
          style={{ ...gradientNum, fontFamily: "'Hanken Grotesk', sans-serif", left: 346.5, top: 269 }}
        >
          01
        </p>
        {/* Dot */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          className="absolute"
          style={{ left: 130, top: 287, width: 53, height: 53 }}
        >
          <CldImage src={DOT_ICON_1} alt="" className="w-full h-full object-contain" />
        </motion.div>
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="absolute text-[36px] leading-[44px] text-black -translate-y-1/2"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, left: 130, top: 487, width: 320 }}
        >
          Sign Up &amp; Get Your Unique Link
        </motion.p>
        {/* Desc */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="absolute text-[18px] leading-[24px] text-[#52525b] -translate-y-1/2"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, left: 130, top: 563 }}
        >
          Quick, free, and easy.
        </motion.p>

        {/* === Step 02 === */}
        <p
          className="absolute text-[200px] leading-[200px] tracking-[-4px] uppercase font-bold opacity-50 whitespace-nowrap text-center -translate-x-1/2 select-none"
          style={{ ...gradientNum, fontFamily: "'Hanken Grotesk', sans-serif", left: 763.5, top: 236 }}
        >
          02
        </p>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          className="absolute"
          style={{ left: 523, top: 308, width: 52, height: 52 }}
        >
          <CldImage src={DOT_ICON_2} alt="" className="w-full h-full object-contain" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="absolute text-[36px] leading-[44px] text-black whitespace-nowrap -translate-y-1/2"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, left: 523, top: 470 }}
        >
          Share MANIFESTR
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="absolute text-[18px] leading-[26px] text-[#52525b] -translate-y-1/2"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, left: 523, top: 548, width: 320 }}
        >
          Promote to your audience, network, or clients using your personalized marketing assets.
        </motion.p>

        {/* === Step 03 === */}
        <p
          className="absolute text-[200px] leading-[200px] tracking-[-4px] uppercase font-bold opacity-50 whitespace-nowrap text-center -translate-x-1/2 select-none"
          style={{ ...gradientNum, fontFamily: "'Hanken Grotesk', sans-serif", left: 1196.5, top: 269 }}
        >
          03
        </p>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
          className="absolute"
          style={{ left: 968, top: 335, width: 52, height: 52 }}
        >
          <CldImage src={DOT_ICON_2} alt="" className="w-full h-full object-contain" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="absolute text-[36px] leading-[44px] text-black -translate-y-1/2"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, left: 968, top: 490, width: 320 }}
        >
          Earn Recurring Commissions
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="absolute text-[18px] leading-[24px] text-[#52525b] -translate-y-1/2"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, left: 968, top: 590, width: 364 }}
        >
          Get paid monthly as long as your referrals remain active, tracked automatically in your affiliate dashboard.
        </motion.p>
      </div>

      {/* === MOBILE === */}
      <div className="md:hidden relative bg-[#f2f2f1] overflow-hidden" style={{ minHeight: 1500 }}>
        {/* Background people image — centered behind lower steps */}
        <div
          className="absolute pointer-events-none left-1/2 -translate-x-1/2 overflow-hidden"
          style={{ top: 410, width: 1152, height: 1124 }}
        >
          <CldImage
            alt=""
            src={PEOPLE_IMG_MOBILE}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative px-6 py-[48px] flex flex-col items-center">
          <div className="text-center mb-[16px] w-full">
            <h2 className="text-[30px] leading-[normal] tracking-[-0.6px] text-black">
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>How it Works</span>
            </h2>
          </div>
          <p
            className="text-[16px] leading-[24px] text-[#52525b] text-center mb-[24px] w-full"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            At MANIFESTR, we believe bold thinkers deserve bold rewards. Our Affiliate Program offers one of the highest paying commission structures you&apos;ll find anywhere, empowering you to transform referrals into real income.
          </p>

          <div className="flex flex-col gap-[40px] items-center w-full">
            {[
              { num: '01', title: 'Sign Up & Get Your Unique Link', desc: 'Quick, free, and easy.' },
              { num: '02', title: 'Share MANIFESTR', desc: 'Promote to your audience, network, or clients using your personalized marketing assets.' },
              { num: '03', title: 'Earn Recurring Commissions', desc: 'Get paid monthly as long as your referrals remain active, tracked automatically in your affiliate dashboard.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex flex-col gap-0 items-center w-full"
              >
                <p
                  className="mb-[16px] text-[84px] leading-[84px] tracking-[-1.68px] uppercase font-bold select-none text-center w-full"
                  style={{ ...mobileGradientNum, fontFamily: "'Hanken Grotesk', sans-serif", opacity: 0.5 }}
                >
                  {step.num}
                </p>
                <div className="flex flex-col gap-[8px] text-center items-center w-full">
                  <h3
                    className="text-[32px] leading-[44px] text-black"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[16px] leading-[24px] text-[#52525b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
