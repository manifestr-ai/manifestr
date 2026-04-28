import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    title: 'Application Review',
    desc: 'We review every application carefully, with attention to experience, judgement, and alignment with how we work.',
  },
  {
    num: '02',
    title: 'Intro Chat',
    desc: 'A short conversation to understand your background, answer questions, and confirm mutual fit.',
  },
  {
    num: '03',
    title: 'Team Interviews',
    desc: "Conversations with people you'd work closely with, focused on skills, decision-making, and how you approach your work.",
  },
  {
    num: '04',
    title: 'Offer & Onboarding',
    desc: "If it's a mutual fit, you'll receive an offer and a clear onboarding plan to help you start strong at MANIFESTR.",
    isLast: true,
  },
]

export default function WhatToExpect() {
  return (
    <section className="w-full bg-white pt-8 pb-[48px] md:pt-12 md:pb-[96px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[24px] px-6 md:gap-[60px] md:px-[80px]">

        {/* Heading first, then intro (what to expect + empowering context) */}
        <div className="flex w-full max-w-[720px] flex-col items-center gap-[12px] text-center md:max-w-[860px]">
          <h2 className="max-w-[342px] text-[30px] leading-[43px] tracking-[-0.6px] text-black md:max-w-none md:text-[60px] md:leading-[72px] md:tracking-[-1.2px]">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The Application </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Process </span>
          </h2>
          <p
            className="w-full max-w-[342px] text-[16px] leading-[24px] text-[#52525b] md:max-w-none"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            What to expect when applying to MANIFESTR.
          </p>
        </div>

        {/* Mobile steps — centered text blocks */}
        <div className="md:hidden flex flex-col gap-[24px] w-full">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="text-center tracking-[-0.28px]"
            >
              <h3
                className="text-[24px] leading-[32px] text-black"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
              >
                {step.title}:
              </h3>
              <p
                className="text-[16px] leading-[24px] text-[#52525b] mt-2"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop steps — continuous vertical line through dot centers; single dot color */}
        <div className="hidden md:flex w-full max-w-[968px] items-stretch">
          <div className="flex flex-col w-[577px] shrink-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`flex items-center gap-[24px] shrink-0 ${step.isLast ? 'h-[110px]' : 'h-[139px]'}`}
              >
                <span
                  className="text-[36px] leading-[44px] tracking-[-0.72px] text-black shrink-0"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                >
                  {step.num}
                </span>
                <span
                  className="text-[36px] leading-[44px] tracking-[-0.72px] text-black"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                >
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-1 gap-[28px] min-w-0 pt-1">
            <div className="relative flex w-[15px] shrink-0 flex-col items-center">
              {/* One line from first dot center to last dot center (139×3 + 110 row heights) */}
              <motion.div
                aria-hidden
                className="absolute left-1/2 z-0 w-[2px] origin-top -translate-x-1/2 bg-[#d1d5db]"
                style={{
                  top: '69.5px',
                  bottom: '55px',
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 1,
                  ease: [0.33, 1, 0.68, 1],
                }}
              />
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className={`flex w-full items-center justify-center ${step.isLast ? 'h-[110px]' : 'h-[139px]'}`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      delay: 0.08 + i * 0.18,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative z-1 size-[15px] shrink-0 rounded-full bg-[#52525B]"
                  />
                </div>
              ))}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.45 }}
                  className={`flex items-center ${step.isLast ? 'min-h-[110px]' : 'min-h-[139px]'}`}
                >
                  <p
                    className="max-w-[362px] text-[16px] leading-[24px] text-[#52525b]"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
