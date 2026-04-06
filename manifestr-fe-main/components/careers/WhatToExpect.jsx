import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    title: 'Application Review',
    desc: 'We review every application carefully, with attention to experience, judgement, and alignment with how we work.',
    isFirst: true,
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
    <section className="w-full bg-white py-[48px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px] flex flex-col gap-[24px] md:gap-[60px] items-center">

        {/* Heading */}
        <div className="flex flex-col gap-[12px] items-center text-center w-full">
          <h2 className="text-[30px] md:text-[60px] leading-[43px] md:leading-[72px] tracking-[-0.6px] md:tracking-[-1.2px] text-black max-w-[342px] md:max-w-none">
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>The Application </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Process </span>
          </h2>
          <p
            className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#52525c] w-full max-w-[342px] md:max-w-none"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            Empowering ambitious minds with AI Toolkit to thrive - without sacrificing their spark or well-being.
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
              <p
                className="text-[16px] leading-[17px] text-black font-bold"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                {step.title}:
              </p>
              <p
                className="text-[14px] leading-[17px] text-black mt-[4px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400 }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop steps — with timeline */}
        <div className="hidden md:flex flex-col items-start w-full max-w-[968px]">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`flex items-start w-full ${step.isLast ? 'h-[110px]' : 'h-[139px]'}`}
            >
              <div className="flex items-center gap-[24px] shrink-0 w-[577px] h-full">
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
              </div>
              <div className="flex gap-[28px] h-full items-start">
                <div className="flex flex-col items-center h-full w-[11px] shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.3, duration: 0.35, type: 'spring', stiffness: 300 }}
                    className={`w-[11px] h-[11px] rounded-full shrink-0 mt-[4px]
                                ${step.isFirst ? 'bg-[#18181b]' : 'bg-[#71717a]'}`}
                  />
                  {!step.isLast && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.5, duration: 0.45, ease: 'easeOut' }}
                      className="flex-1 w-px bg-[#d1d5db] mt-[4px] origin-top"
                    />
                  )}
                </div>
                <div className="flex flex-col items-start w-[362px]">
                  <p
                    className="text-[16px] leading-[24px] text-[#18181b]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
