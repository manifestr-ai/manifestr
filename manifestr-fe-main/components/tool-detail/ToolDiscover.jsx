import Link from 'next/link'
import { motion } from 'framer-motion'
import CldImage from '../ui/CldImage'

function Badge({ children, dark = false }) {
  return (
    <span
      className={`inline-flex items-center px-[12px] py-[6px] rounded-[16px] border text-[12px] leading-[18px] font-medium ${
        dark ? 'border-[#e4e4e7] text-[#71717a]' : 'border-[#e4e4e7] text-[#71717a]'
      }`}
      style={{ background: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}
    >
      {children}
    </span>
  )
}

export default function ToolDiscover({ relatedTools }) {
  if (!relatedTools || relatedTools.length === 0) return null

  return (
    <section className="w-full bg-white py-[48px] md:py-[96px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[32px] md:text-[54px] leading-tight tracking-[-0.64px] md:tracking-[-1.08px] text-center mb-[32px] md:mb-[48px]"
        >
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Discover The Full </span>
          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Toolkit</span>
        </motion.h2>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-[24px]">
          {relatedTools.map((rt, i) => (
            <motion.div
              key={rt.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link href={`/tools/${rt.slug}`} className="block">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-[12px] overflow-hidden h-[550px] flex flex-col cursor-pointer hover:shadow-lg transition-shadow bg-white border border-[#e4e3e1]"
                >
                  <div className="h-[266px] relative overflow-hidden m-[18px] mb-0 rounded-[12px]">
                    <CldImage src={rt.heroImage} alt={`${rt.prefix} ${rt.name}`} className="w-full h-full object-cover object-top rounded-[12px]" />
                  </div>
                  <div className="flex-1 p-[18px] pt-[24px] flex flex-col gap-[16px]">
                    <div>
                      <h3 className="text-[36px] leading-[44px] tracking-[-0.72px] mb-[8px]">
                        <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                          {rt.prefix === 'THE' ? 'The ' : `${rt.prefix} `}
                        </span>
                        <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
                          {rt.name}
                        </span>
                      </h3>
                      <p className="text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {rt.tagline.split('\n')[1] || rt.tagline.split('\n')[0]}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-[10px] mt-auto">
                      {rt.badges.map((b) => <Badge key={b}>{b}</Badge>)}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden overflow-x-auto -mx-6 px-6 scrollbar-hide">
          <div className="flex gap-[16px] w-max">
            {relatedTools.map((rt, i) => (
              <motion.div
                key={rt.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="w-[326px] shrink-0"
              >
                <Link href={`/tools/${rt.slug}`} className="block">
                  <div className="rounded-[10px] overflow-hidden h-[436px] flex flex-col bg-black shadow-sm">
                    <div className="h-[211px] relative overflow-hidden m-[14px] mb-0 rounded-[10px]">
                      <CldImage src={rt.heroImage} alt={`${rt.prefix} ${rt.name}`} className="w-full h-full object-cover object-top rounded-[10px]" />
                    </div>
                    <div className="flex-1 p-[14px] pt-[16px] flex flex-col gap-[14px]">
                      <div>
                        <h3 className="text-[29px] leading-[35px] tracking-[-0.57px] mb-[6px] text-white">
                          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                            {rt.prefix === 'THE' ? 'The ' : `${rt.prefix} `}
                          </span>
                          <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
                            {rt.name}
                          </span>
                        </h3>
                        <p className="text-[13px] leading-[19px] text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {rt.tagline.split('\n')[1] || rt.tagline.split('\n')[0]}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-[8px] mt-auto">
                        {rt.badges.map((b) => <Badge key={b}>{b}</Badge>)}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
