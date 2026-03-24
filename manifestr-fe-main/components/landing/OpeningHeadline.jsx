import { motion } from 'framer-motion'

// Images from Figma
const IMG_LEFT   = 'https://www.figma.com/api/mcp/asset/eb8750e3-3b18-4bb1-93a5-213ffabbf258'   // woman with laptop (tall)
const IMG_RIGHT  = 'https://www.figma.com/api/mcp/asset/38586ac4-8b69-45cf-bbec-0e4c61319517'   // man at desk
const IMG_CIRCLE = 'https://www.figma.com/api/mcp/asset/a40da9c5-0529-483e-a625-9f9e7fa519b9'   // MANIFESTR. circular text + arrow
const IMG_LOGOMARK = 'https://www.figma.com/api/mcp/asset/85e5646a-2e87-4f0d-ac83-9e2cf367080f' // M. vector logomark

export default function OpeningHeadline() {
  return (
    <section className="relative w-full bg-[#f9fafb] overflow-hidden py-16 md:py-20">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px]">

        {/* ── Headline ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex items-start justify-center mb-12 md:mb-16"
        >
          <h2
            className="text-[32px] sm:text-[44px] md:text-[60px] leading-[1.18] md:leading-[72px] text-black tracking-[-1.2px] text-center max-w-[817px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
          >
            Opening&nbsp;&nbsp;
            <span
              className="tracking-[-1.2px]"
              style={{
                fontFamily: "'IvyPresto Headline', serif",
                fontWeight: 600,
                fontStyle: 'italic',
              }}
            >
              Headline
            </span>
            {' '}here about how it&rsquo;s all Toolkit&nbsp;&nbsp;in one
          </h2>

          {/* M. logomark – top-right of headline */}
          <div className="absolute -top-2 -right-2 md:top-0 md:-right-4 w-12 h-12 md:w-[72px] md:h-[72px] shrink-0">
            <img
              src={IMG_LOGOMARK}
              alt="M."
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* ── Two-column body ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">

          {/* Left – tall portrait image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-[38%] shrink-0"
          >
            <div className="relative w-full h-[320px] md:h-[510px] rounded-lg overflow-hidden">
              <img
                src={IMG_LEFT}
                alt="Professional at work"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Right – text + circle + portrait */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col justify-between gap-8 flex-1"
          >
            {/* Paragraph */}
            <p
              className="text-[16px] md:text-[18px] leading-[28px] text-[#52525b]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Lorem ipsum dolor sit amet consectetur. A donec magna arcu aenean
              facilisi feugiat natoque. Dignissim dolor lobortis lacus sed.
              Imperdiet mi non quisque consequat porttitor. Cras ipsum vulputate
              fringilla lobortis. Cras ornare a faucibus at vulputate. In
              vestibulum dui tincidunt volutpat mauris. Tincidunt iaculis
              venenatis velit scelerisque id aliquam fames neque volutpat. In id
              morbi pretium amet at est sem urna tellus.
            </p>

            {/* Circle logo + right image */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Rotating Manifestr circle */}
              <div
                className="shrink-0 w-[110px] h-[110px] md:w-[150px] md:h-[150px]"
                style={{ animation: 'spin 10s linear infinite' }}
              >
                <img
                  src={IMG_CIRCLE}
                  alt="MANIFESTR"
                  className="w-full h-full object-contain "
                />
              </div>

              {/* Man at desk image */}
              <div className="relative flex-1 h-[200px] md:h-[300px] rounded-xl overflow-hidden">
                <img
                  src={IMG_RIGHT}
                  alt="Professional at desk"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
