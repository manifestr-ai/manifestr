import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function ToolHero({ tool }) {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { heroImage, heroSprites, heroHeadline, heroCol1, heroCol2, darkBannerText, heroCtaPrimary, heroCtaSecondary, prefix, name } = tool

  return (
    <section ref={sectionRef} className="w-full">
      <style>{`
        @keyframes heroZoomIn       { from { transform: scale(1.08); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes theReveal        { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes strategistReveal { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeInUp         { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeIn           { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pieceRise        { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes floatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes floatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
        @keyframes floatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-13px) } }
        @keyframes floatD { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes floatE { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-11px) } }
      `}</style>

      {/* ─── FULL HERO (image spans from top to dark banner) ─── */}
      <div className="relative w-full overflow-hidden">
        {/* Background image covering entire hero */}
        <div
          className="absolute inset-0"
          style={{
            animation: visible ? 'heroZoomIn 1.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards' : 'none',
            opacity: visible ? undefined : 0,
          }}
        >
          <img src={heroImage} alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Title area — uses aspect ratio to size the top portion */}
        <div className="relative w-full" style={{ aspectRatio: '1440 / 760' }}>
          {/* Title overlay */}
          <div
            className="absolute pointer-events-none select-none flex flex-col items-center"
            style={{ left: '9.72%', width: '80.56%', top: '15%' }}
          >
            <p
              className="text-white uppercase text-center"
              style={{
                fontFamily: "'IvyPresto Headline', serif",
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(32px, 6.67vw, 96px)',
                lineHeight: 1.1,
                letterSpacing: '0.13em',
                textShadow: '0px 0px 0px #040404',
                animation: visible ? 'theReveal 1s cubic-bezier(0.16,1,0.3,1) 0.2s both' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              {prefix}
            </p>
            <p
              className="text-white uppercase text-center"
              style={{
                fontFamily: "'IvyPresto Headline', serif",
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(48px, 9.72vw, 140px)',
                lineHeight: 1,
                letterSpacing: '0.1em',
                textShadow: '12px 11px 35px #000',
                marginTop: '8px',
                animation: visible ? 'strategistReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s both' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              {name.toUpperCase()}
            </p>
          </div>

          {/* Floating sprites (Strategist only) */}
          {heroSprites && heroSprites.pieces.map((piece, i) => {
            const floatNames = ['floatA', 'floatB', 'floatC', 'floatD', 'floatE']
            return (
              <div
                key={i}
                className="absolute overflow-hidden pointer-events-none"
                style={{
                  left: piece.left,
                  top: piece.top,
                  width: piece.width,
                  height: piece.height,
                  animation: visible
                    ? `pieceRise 1s cubic-bezier(0.16,1,0.3,1) ${piece.entranceDelay} both, ${floatNames[i]} ${piece.floatDuration} ${piece.entranceDelay} ease-in-out infinite`
                    : 'none',
                  opacity: visible ? undefined : 0,
                }}
              >
                <img
                  src={heroSprites.sprite}
                  alt=""
                  className="absolute h-full max-w-none top-0"
                  style={{ left: piece.spriteLeft, width: piece.spriteWidth }}
                />
              </div>
            )
          })}
        </div>

        {/* Content area — still on the image, below the title area */}
        <div
          className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-[80px] pb-[60px]"
          style={{
            animation: visible ? 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
            opacity: visible ? undefined : 0,
          }}
        >
          <p
            className="uppercase text-black font-semibold text-[16px] md:text-[24px] tracking-[-0.02em] mb-[16px] md:mb-[24px] text-center"
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: '24px' }}
          >
            WHAT IT IS
          </p>

          <h2
            className="text-center text-black mb-10 max-w-[834px] mx-auto"
            style={{ fontSize: 'clamp(28px, 3.75vw, 54px)', lineHeight: '1.2', letterSpacing: '-0.02em' }}
          >
            {(heroHeadline || []).map((part, i) =>
              part.style === 'italic'
                ? <em key={i} style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>{part.text}</em>
                : <span key={i} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{part.text}</span>
            )}
          </h2>

          {(heroCol1 || heroCol2) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] md:gap-[80px] mb-10 max-w-[860px] mx-auto">
              {heroCol1 && (
                <p className="text-[#52525b] text-[16px] md:text-[18px] leading-[26px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {heroCol1}
                </p>
              )}
              {heroCol2 && (
                <p className="text-[#52525b] text-[16px] md:text-[18px] leading-[26px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {heroCol2}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px]">
            <Link
              href={heroCtaPrimary?.href || '/signup'}
              className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[24px] py-[14px] text-[16px] md:text-[18px] leading-[20px] font-medium hover:bg-[#27272a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {heroCtaPrimary?.label || 'Discover MANIFESTR Today'}
            </Link>
            <Link
              href={heroCtaSecondary?.href || '/tools'}
              className="inline-flex items-center justify-center bg-white border border-[#e4e4e7] text-[#18181b] rounded-[6px] px-[24px] py-[14px] text-[16px] md:text-[18px] leading-[20px] font-medium hover:bg-[#f4f4f5] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {heroCtaSecondary?.label || 'Explore All Tools'}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── DARK BANNER ─── */}
      {darkBannerText && (
        <div
          className="w-full flex items-center justify-center px-6 md:px-[80px] py-[20px]"
          style={{
            backgroundColor: '#272727',
            minHeight: '84px',
            animation: visible ? 'fadeIn 0.8s ease-out 1.3s both' : 'none',
            opacity: visible ? undefined : 0,
          }}
        >
          <p
            className="text-white text-center font-bold uppercase text-[14px] md:text-[24px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: '42px', letterSpacing: '2.4px' }}
          >
            {darkBannerText}
          </p>
        </div>
      )}
    </section>
  )
}
