import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CldImage from '../ui/CldImage'
import { DEMO_VIDEOS } from '../../data/demoVideos'

const CTA_BG = 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1774941574/Rectangle_8_ymxlxb.jpg'

function PlayIcon({ size = 64 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 24 24" fill="#18181b">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

function CategoryBadge({ label }) {
  return (
    <span
      className="self-start rounded-full border border-[#d9d9d9] bg-white px-4 py-1.5 text-[14px] leading-5 text-[#6c6c6c]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {label}
    </span>
  )
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
    </svg>
  )
}

export default function VideoDetail({ video }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const related = DEMO_VIDEOS.filter((v) => v.slug !== video.slug).slice(0, 3)

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
          <span className="font-medium text-[#18181b]">{video.title}</span>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <section className="w-full bg-white px-6 py-[48px] md:px-[80px] md:py-[64px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-[48px] lg:flex-row lg:gap-[64px]">

          {/* ── Left: video + info ── */}
          <div className="flex min-w-0 flex-1 flex-col gap-[32px]">

            {/* Video player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative w-full overflow-hidden rounded-[16px] bg-[#0d0d0d]"
              style={{ aspectRatio: '16/9' }}
            >
              <CldImage
                src={video.image}
                alt={video.title}
                className="h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

              {/* Play button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="absolute inset-0 flex items-center justify-center transition-opacity"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <PlayIcon size={80} />
                </motion.div>
              </button>

              {/* Duration badge */}
              <span
                className="absolute bottom-4 right-4 rounded-full border border-[#d9d9d9] bg-white px-4 py-1.5 text-[14px] font-medium leading-5 text-[#341e1e]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {video.duration}
              </span>
            </motion.div>

            {/* Title + meta */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-[16px]"
            >
              <CategoryBadge label={video.category} />
              <h1
                className="text-[28px] leading-[36px] tracking-[-0.56px] text-[#1b1b1f] md:text-[36px] md:leading-[44px] md:tracking-[-0.72px]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}
              >
                {video.title}
              </h1>
              <div className="flex items-center gap-[8px]">
                <ClockIcon />
                <span
                  className="text-[16px] leading-[24px] text-[#71717a]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {video.duration} · {video.category}
                </span>
              </div>
              <p
                className="text-[16px] leading-[24px] text-[#71717a]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {video.fullDesc}
              </p>
            </motion.div>

            {/* What you'll learn */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col gap-[20px] rounded-[12px] border border-[#e4e4e7] bg-[#f9f9f9] p-[24px] md:p-[32px]"
            >
              <h2
                className="text-[24px] leading-[32px] text-[#1b1b1f]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
              >
                {"What you'll learn"}
              </h2>
              <ul className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
                {video.learn.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-[10px] text-[16px] leading-[24px] text-[#71717a]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <svg className="mt-[3px] h-4 w-4 shrink-0 text-[#18181b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Chapters */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-[20px]"
            >
              <h2
                className="text-[24px] leading-[32px] text-[#1b1b1f]"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
              >
                Chapters
              </h2>
              <ol className="flex flex-col gap-0">
                {video.chapters.map((ch, i) => (
                  <li
                    key={ch.time}
                    className="flex items-center gap-[16px] border-b border-[#e4e4e7] py-[14px] first:border-t"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <span className="w-[28px] text-[14px] font-medium leading-5 text-[#a1a1aa]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[16px] leading-[24px] text-[#1b1b1f]">{ch.label}</span>
                    <span className="shrink-0 rounded-full bg-[#f4f4f5] px-[10px] py-[2px] text-[13px] font-medium leading-5 text-[#71717a]">
                      {ch.time}
                    </span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>

          {/* ── Right: related videos sidebar ── */}
          <aside className="flex flex-col gap-[24px] lg:w-[340px] lg:shrink-0">
            <h2
              className="text-[20px] leading-[28px] text-[#1b1b1f]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600 }}
            >
              Related Videos
            </h2>
            <div className="flex flex-col gap-[20px]">
              {related.map((v) => (
                <Link
                  key={v.slug}
                  href={`/playbook/demo-videos/${v.slug}`}
                  className="group flex gap-[14px] rounded-[12px] border border-[#e4e4e7] p-[14px] transition-shadow hover:shadow-md"
                >
                  <div className="relative h-[72px] w-[120px] shrink-0 overflow-hidden rounded-[8px]">
                    <CldImage src={v.image} alt={v.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/90">
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="#18181b">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                    <span
                      className="text-[11px] uppercase tracking-wide text-[#71717a]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {v.category}
                    </span>
                    <h3
                      className="line-clamp-2 text-[14px] font-semibold leading-5 text-[#1b1b1f] group-hover:text-[#18181b]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {v.title}
                    </h3>
                    <span
                      className="mt-1 text-[12px] leading-4 text-[#71717a]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {v.duration}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* All videos link */}
            <Link
              href="/playbook/demo-videos"
              className="mt-2 flex items-center gap-[6px] text-[14px] font-medium leading-5 text-[#18181b] underline-offset-2 hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View all videos
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </aside>
        </div>
      </section>

      {/* ─── Need More Help? ─── */}
      <section className="relative h-[380px] w-full overflow-hidden md:h-[414px]">
        <CldImage src={CTA_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-[30px] px-6 text-center"
          >
            <div className="flex flex-col items-center gap-[16px]">
              <h2 className="text-[36px] leading-tight text-black md:text-[60px] md:leading-[72px] md:tracking-[-1.2px]">
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>Need More </span>
                <span style={{ fontFamily: "'IvyPresto Headline', serif", fontWeight: 600, fontStyle: 'italic' }}>Help?</span>
              </h2>
              <p
                className="max-w-[603px] text-[16px] leading-[24px] text-[#52525b]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {"Can't find what you're looking for? Our support team is here to help you succeed with MANIFESTR."}
              </p>
            </div>
            <Link
              href="/playbook/submit-ticket"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#18181b] px-4 text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#27272a]"
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
