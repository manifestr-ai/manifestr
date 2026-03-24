import { motion } from 'framer-motion'

// Brand logo URLs directly from Figma
const LOGOS_ROW_1 = [
  {
    name: 'Harvard Business School',
    src: 'https://www.figma.com/api/mcp/asset/607cc139-5dfa-4db4-8713-b258996e419a',
    width: 200,
  },
  {
    name: 'George P. Johnson',
    src: 'https://www.figma.com/api/mcp/asset/9f5272ec-ebb4-4d5a-ae36-33b3188bc77e',
    width: 220,
  },
  {
    name: 'State Street',
    src: 'https://www.figma.com/api/mcp/asset/ed8dd7f8-ee99-4b2e-a439-f5514bfc5cdc',
    width: 160,
  },
  {
    name: 'Mastercard',
    src: 'https://www.figma.com/api/mcp/asset/48e2c673-4524-4827-ad50-75d5890db5ad',
    width: 80,
  },
]

const LOGOS_ROW_2 = [
  {
    name: 'Darkhorse',
    src: 'https://www.figma.com/api/mcp/asset/ab62cae9-fcc1-4d6b-bad5-9142333f09a3',
    width: 200,
  },
  {
    name: 'Octagon',
    src: 'https://www.figma.com/api/mcp/asset/c094ebbb-d020-4c3a-b7a3-3dd106285771',
    width: 160,
  },
  {
    name: 'Bank of America',
    src: 'https://www.figma.com/api/mcp/asset/9827abd7-7f22-4787-a347-77cae5fcaba5',
    width: 220,
  },
  {
    name: 'Jack Morton',
    src: 'https://www.figma.com/api/mcp/asset/3a91ade7-ef8c-4559-b5aa-cd9e22dfa15f',
    width: 180,
  },
]

function LogoGrid({ logos, delay = 0 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 items-center justify-items-center w-full">
      {logos.map((logo, i) => (
        <motion.div
          key={logo.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + i * 0.08 }}
          className="flex items-center justify-center h-[56px] w-full"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className="max-h-full object-contain"
            style={{ maxWidth: logo.width }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function BuiltBySection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px]">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2
            className="text-[32px] sm:text-[44px] md:text-[60px] leading-[1.18] md:leading-[72px] text-black tracking-[-1.2px] mb-6 md:mb-8"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            Built by{' '}
            <span
              style={{
                fontFamily: "'IvyPresto Headline', serif",
                fontWeight: 600,
                fontStyle: 'italic',
              }}
            >
              professionals,
            </span>{' '}
            for professionals.
          </h2>

          <p
            className="text-[16px] md:text-[20px] leading-[28px] md:leading-[30px] text-[#18181b] font-medium max-w-[782px] mx-auto mb-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We&rsquo;ve worked through high-pressure pitches, complex budgets, and
            real-world delivery. We&rsquo;ve been client-facing, presented to
            executives and investors and operated in environments where the
            output matters.
          </p>

          <p
            className="text-[14px] md:text-[16px] leading-[24px] text-[#52525b] max-w-[782px] mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            That&rsquo;s why MANIFESTR is built for people who do the work: marketers,
            producers, founders, analysts, and executives who need consistency,
            control, and confidence across their documentation.
          </p>
        </motion.div>

        {/* Logo rows */}
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="w-full   pt-10 md:pt-12">
            <LogoGrid logos={LOGOS_ROW_1} delay={0} />
          </div>
          <div className="w-full   pt-10 md:pt-12">
            <LogoGrid logos={LOGOS_ROW_2} delay={0.1} />
          </div>
        </div>

      </div>
    </section>
  )
}
