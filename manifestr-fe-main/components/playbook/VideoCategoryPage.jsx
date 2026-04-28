import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

function PlayIcon({ size = 61 }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.33} height={size * 0.33} viewBox="0 0 24 24" fill="#232323">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

export default function VideoCategoryPage({ category, videos }) {
  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="w-full border-b border-t border-[#e5e7eb] bg-white px-6 md:px-[80px]">
        <div
          className="flex min-h-[54px] flex-wrap items-center gap-[8px] py-3 text-[16px] leading-[24px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Link href="/playbook" className="text-[#52525b] hover:underline">Playbook</Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/playbook/demo-videos" className="text-[#52525b] hover:underline">Demo Videos</Link>
          <svg className="h-4 w-4 shrink-0 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-[#18181b]">{category.title}</span>
        </div>
      </div>

      {/* ─── Header ─── */}
      <section className="w-full bg-white px-6 pt-[48px] pb-[8px] md:px-[80px] md:pt-[64px] md:pb-[12px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-[12px]"
        >
          <h1
            className="text-[36px] leading-tight text-black md:text-[48px] md:leading-[60px] md:tracking-[-0.96px]"
          >
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{category.title.split(' ')[0]} </span>
            <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>
              {category.title.split(' ').slice(1).join(' ') || category.title}
            </span>
          </h1>
          <p className="text-[16px] leading-[24px] text-[#71717a] max-w-[640px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {category.desc}
          </p>
          <p className="text-[14px] leading-5 text-[#a1a1aa]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {videos.length} video{videos.length !== 1 ? 's' : ''} · {category.meta.split('•')[1]?.trim()}
          </p>
        </motion.div>
      </section>

      {/* ─── Videos Grid ─── */}
      <section className="w-full bg-[#f4f4f5] px-6 py-[28px] md:px-[80px] md:py-[40px]">
        {videos.length === 0 ? (
          <p className="py-12 text-center text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            No videos in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-14 lg:grid-cols-3">
            {videos.map((video, i) => (
              <Link
                key={video.slug}
                href={`/playbook/demo-videos/${video.slug}`}
                className="group flex flex-col gap-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col gap-5"
                >
                  <div className="relative h-[280px] overflow-hidden rounded-lg">
                    <CldImage
                      src={video.image}
                      alt={video.title}
                      className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <PlayIcon size={61} />
                    <span
                      className="absolute right-4 top-4 rounded-full border border-[#d9d9d9] bg-white px-4 py-[6px] text-[14px] font-medium leading-5 text-[#341e1e]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {video.duration}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3
                      className="text-[20px] leading-[28px] tracking-[-0.4px] text-[#1c1c1c] transition-colors group-hover:text-[#18181b] md:text-[24px] md:leading-normal md:tracking-[-0.72px]"
                      style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
                    >
                      {video.title}
                    </h3>
                    <p className="text-[16px] leading-[1.6] text-[#475569]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {video.desc}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── Back / all videos ─── */}
      <div className="w-full bg-white px-6 pb-[48px] md:px-[80px] md:pb-[64px]">
        <Link
          href="/playbook/demo-videos"
          className="inline-flex items-center gap-2 text-[14px] font-medium leading-5 text-[#18181b] underline-offset-2 hover:underline"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          View all videos
        </Link>
      </div>

      {/* ─── Need More Help? ─── */}
      <section className="relative h-[380px] w-full overflow-hidden md:h-[414px]">
        <CldImage src={CTA_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8 px-6 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-[36px] leading-tight text-black md:text-[60px] md:leading-[72px] md:tracking-[-1.2px]">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p className="max-w-[603px] text-[16px] leading-[24px] text-[#52525b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {"Can't find what you're looking for?"}
                <br />
                Our support team is here to help you succeed with MANIFESTR.
              </p>
            </div>
            <Link
              href="/playbook/submit-ticket"
              className="inline-flex h-[44px] min-h-[44px] items-center justify-center rounded-[6px] bg-[#18181b] px-4 text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a] md:h-[54px] md:min-h-[54px] md:px-6 md:text-[16px]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Submit a Support Ticket
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
