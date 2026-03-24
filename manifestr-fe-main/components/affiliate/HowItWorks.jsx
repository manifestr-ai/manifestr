import { motion } from 'framer-motion'

const PEOPLE_IMG = 'https://www.figma.com/api/mcp/asset/85411230-8a85-492e-93e8-899c55934cd5'
const CURVE_LINE = 'https://www.figma.com/api/mcp/asset/19a2bc3a-ec5c-418c-a6a3-179cc5748166'
const DOT_ICON_1 = 'https://www.figma.com/api/mcp/asset/242429fa-a8b5-4d23-8984-7a944fdc3475'
const DOT_ICON_2 = 'https://www.figma.com/api/mcp/asset/2c73f803-68dc-4b2b-be66-7549c8860ba7'

const gradientNum = {
  backgroundImage: 'linear-gradient(189.42deg, rgb(125,125,125) 1.23%, rgba(125,125,125,0) 72.82%)',
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
        <div className="absolute bottom-[-300px] left-0 w-full">
          <img
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
            className="text-[16px] leading-[24px] text-[#52525b] mx-auto mt-[12px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, width: 898 }}
          >
            At MANIFESTR, we believe bold thinkers deserve bold rewards. Our Affiliate Program offers one of the highest paying commission structures you&apos;ll find anywhere - empowering you to transform referrals into real income.
          </p>
        </motion.div>

        {/* Curved connecting line */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ left: 49, top: -65, width: 1296, height: 788 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ transform: 'rotate(19.36deg)' }}
          >
            <img src={CURVE_LINE} alt="" style={{ width: 1232, height: 402 }} />
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
          <img src={DOT_ICON_1} alt="" className="w-full h-full object-contain" />
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
          <img src={DOT_ICON_2} alt="" className="w-full h-full object-contain" />
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
          className="absolute text-[18px] leading-[24px] text-[#52525b] -translate-y-1/2"
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
          <img src={DOT_ICON_2} alt="" className="w-full h-full object-contain" />
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

      {/* === MOBILE fallback === */}
      <div className="md:hidden relative px-6 py-[60px]">
        <div className="text-center mb-[48px]">
          <h2 className="text-[36px] leading-[44px] tracking-[-1.2px] text-black">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>How it </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Works</span>
          </h2>
          <p
            className="text-[14px] leading-[22px] text-[#52525b] mt-[16px]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            At MANIFESTR, we believe bold thinkers deserve bold rewards. Our Affiliate Program offers one of the highest paying commission structures you&apos;ll find anywhere.
          </p>
        </div>

        <div className="flex flex-col gap-[48px]">
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
            >
              <p
                className="text-[100px] leading-[100px] tracking-[-2px] uppercase font-bold select-none"
                style={{ ...gradientNum, fontFamily: "'Hanken Grotesk', sans-serif", opacity: 0.5 }}
              >
                {step.num}
              </p>
              <h3
                className="text-[28px] leading-[36px] text-black mt-[-16px]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
              >
                {step.title}
              </h3>
              <p
                className="text-[16px] leading-[24px] text-[#52525b] mt-[8px]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-[48px] relative w-full h-[300px] rounded-[12px] overflow-hidden">
          <img src={PEOPLE_IMG} alt="" className="w-full h-full object-cover object-top" />
        </div>
      </div>
    </section>
  )
}
