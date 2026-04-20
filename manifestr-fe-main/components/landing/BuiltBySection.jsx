import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

const ALL_LOGOS = [
  {
    name: 'Harvard Business School',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941384/pngegg_1_bdis89.svg',
    width: 360,
  },
  {
    name: 'George P. Johnson',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941383/logo-white_bd68dd36cfd4aca51e8e_1_ukzygk.svg',
    width: 220,
  },
  {
    name: 'State Street',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941384/state-street-seeklogo_1_hixodr.svg',
    width: 160,
  },
  {
    name: 'Mastercard',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941383/SVGRepo_iconCarrier_odpbzt.svg',
    width: 87,
  },
  {
    name: 'Darkhorse',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941385/DARKHORSE_Logo_1_cdcjkj.svg',
    width: 360,
  },
  {
    name: 'Octagon',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943312/Octogon_1_r8bun8.png',
    width: 160,
    mobileWidth: 220,
  },
  {
    name: 'Bank of America',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774943312/pngfind.com-logo-america-png-6828898_1_1_1_ulidji.png',
    width: 220,
    mobileWidth: 280,
  },
  {
    name: 'Jack Morton',
    src: 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941383/Jack_Morton_2_duiyyy.svg',
    width: 180,
  },
]

// Mobile layout configuration
const MOBILE_LAYOUT = [
  { row: 1, logos: [0, 1] }, // Harvard, George P. Johnson
  { row: 2, logos: [5, 6, 3] }, // Octagon, Bank of America, Mastercard
  { row: 3, logos: [2, 4, 7] }, // State Street, Darkhorse, Jack Morton
]

const MOBILE_LOGOS = MOBILE_LAYOUT.flatMap(row => row.logos)

export default function BuiltBySection() {
  return (
    <section className="w-full bg-white py-12 md:py-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px]">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 md:mb-14"
        >
          <h2
            className="text-[28px] sm:text-[44px] md:text-[60px] leading-[1.25] md:leading-[72px] text-black tracking-[-0.6px] md:tracking-[-1.2px] mb-4 md:mb-8"
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
            </span>
            <br className="md:hidden" />{' '}
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

        {/* Logo grid — custom mobile layout, 4 cols desktop */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-x-10 md:gap-y-12 md:items-center md:justify-items-center md:pt-12">
          {ALL_LOGOS.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex items-center justify-center h-[56px] w-full"
            >
              <CldImage
                src={logo.src}
                alt={logo.name}
                className="max-h-full object-contain"
                style={{ 
                  maxWidth: `${logo.width}px`,
                  width: '100%',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile layout - 3 custom rows */}
        <div className="md:hidden space-y-8 pt-6">
          {MOBILE_LAYOUT.map((row, rowIdx) => (
            <div key={`row-${rowIdx}`} className={`grid gap-x-6 gap-y-8 items-center justify-items-center ${
              row.logos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {row.logos.map((logoIdx, colIdx) => {
                const logo = ALL_LOGOS[logoIdx]
                return (
                  <motion.div
                    key={logo.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (rowIdx * 3 + colIdx) * 0.06 }}
                    className="flex items-center justify-center h-[48px] w-full"
                  >
                    <CldImage
                      src={logo.src}
                      alt={logo.name}
                      className="max-h-full object-contain"
                      style={{ 
                        maxWidth: logo.mobileWidth ? `${logo.mobileWidth}px` : `${logo.width}px`,
                        width: '100%',
                      }}
                    />
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}