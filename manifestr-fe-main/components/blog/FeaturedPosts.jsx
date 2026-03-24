import { motion } from 'framer-motion'
import Link from 'next/link'

const FEATURED_MAIN = 'https://www.figma.com/api/mcp/asset/29c6497a-fb84-429b-b14a-1bdcb6554895'
const BRANDING_IMG = 'https://www.figma.com/api/mcp/asset/af3c4a46-f663-427d-b8c7-95ab935417ee'
const DESK_IMG = 'https://www.figma.com/api/mcp/asset/8623fad3-5bd4-4e5a-942b-2fa60840091e'
const FISTBUMP_IMG = 'https://www.figma.com/api/mcp/asset/42a52fd1-ef57-4293-bacb-7813c18f625c'
const SUIT_IMG = 'https://www.figma.com/api/mcp/asset/3659ea13-2e13-4f45-a563-a7033e9c98b1'

const CARDS = [
  { img: FEATURED_MAIN, title: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam.', slug: 'mi-tincidunt-elit', tag: 'Tag', large: true },
  { img: SUIT_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'integrating-ai-business-workflows', tag: 'New' },
  { img: BRANDING_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'branding-strategy-ai', tag: 'New' },
  { img: DESK_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'desk-productivity-ai', tag: 'New' },
  { img: FISTBUMP_IMG, title: 'Best Practices for Integrating AI into Your Existing Business Workflows', slug: 'team-collaboration-ai', tag: 'New' },
]

function BlogCard({ img, title, slug, tag, delay = 0 }) {
  return (
    <Link href={`/blog/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        className="relative rounded-[12px] overflow-hidden group cursor-pointer h-full"
      >
        <img src={img} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/66 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-[16px] md:p-[32px] flex flex-col gap-[8px]">
          <span className="bg-white text-[#212122] text-[12px] leading-[18px] font-medium px-[12px] py-[6px] rounded-[16px] self-start" style={{ fontFamily: "Inter, sans-serif" }}>
            {tag}
          </span>
          <div className="flex items-center justify-between">
            <p className="text-white text-[14px] md:text-[16px] leading-[24px] font-medium flex-1" style={{ fontFamily: "Inter, sans-serif" }}>
              {title}
            </p>
            <svg className="w-[24px] h-[24px] text-white shrink-0 ml-[8px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function FeaturedPosts() {
  const main = CARDS[0]
  const side = CARDS[1]
  const bottom = CARDS.slice(2)

  return (
    <section className="w-full bg-white pb-[60px] md:pb-[80px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[80px]">
        {/* Large featured + side card */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-[24px] mb-[24px]" style={{ minHeight: 446 }}>
          <BlogCard img={main.img} title={main.title} slug={main.slug} tag={main.tag} />
          <BlogCard img={side.img} title={side.title} slug={side.slug} tag={side.tag} delay={0.1} />
        </div>

        {/* 3 smaller cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]" style={{ height: 338 }}>
          {bottom.map((card, i) => (
            <BlogCard key={card.slug} img={card.img} title={card.title} slug={card.slug} tag={card.tag} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
