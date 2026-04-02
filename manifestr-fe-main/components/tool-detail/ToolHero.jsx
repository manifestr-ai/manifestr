import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

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
  const hasSprites = !!heroSprites

  return (
    <section ref={sectionRef} className="w-full">
      <style>{`
        @keyframes heroZoomIn       { from { opacity: 0; transform: scale(1.08) } to { opacity: 1; transform: scale(1) } }
        @keyframes theReveal        { from { opacity: 0; letter-spacing: 28px; transform: translateY(-20px) } to { opacity: 1; letter-spacing: 12.48px; transform: translateY(0) } }
        @keyframes strategistReveal { from { opacity: 0; letter-spacing: 36px; transform: translateY(24px) } to { opacity: 1; letter-spacing: 14px; transform: translateY(0) } }
        @keyframes fadeInUp         { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeIn           { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pieceRise        { from { opacity: 0; transform: translateY(60px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes floatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes floatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes floatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes floatD { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes floatE { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
      `}</style>

      {hasSprites ? (
        /* ══════════════════════════════════════════
           STRATEGIST LAYOUT — gradient fade to white, content below
           ══════════════════════════════════════════ */
        <div className="bg-white">
          {/* Hero banner */}
          <div className="relative w-full overflow-hidden aspect-13/10 md:aspect-1440/760">
            <div
              className="absolute inset-0"
              style={{
                animation: visible ? 'heroZoomIn 1.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <CldImage src={heroImage} alt="" className="w-full h-full object-cover md:object-center" priority />
              <div className="absolute inset-0 bg-black/0 md:bg-black/20" />
            </div>

            {/* Title overlay — desktop only */}
            <div
              className="absolute pointer-events-none select-none hidden md:flex flex-col items-center"
              style={{ left: '9.72%', width: '80.56%', top: '15%' }}
            >
              <p
                className="text-white uppercase text-center"
                style={{
                  fontFamily: "'IvyPresto Headline', serif",
                  fontStyle: 'italic', fontWeight: 700,
                  fontSize: 'clamp(48px, 6.67vw, 96px)', lineHeight: 1.1,
                  letterSpacing: '0.13em', textShadow: '0px 0px 0px #040404',
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
                  fontStyle: 'italic', fontWeight: 700,
                  fontSize: 'clamp(72px, 9.72vw, 140px)', lineHeight: 1,
                  letterSpacing: '0.1em', textShadow: '12px 11px 35px #000',
                  marginTop: '8px',
                  animation: visible ? 'strategistReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s both' : 'none',
                  opacity: visible ? undefined : 0,
                }}
              >
                {name.toUpperCase()}
              </p>
            </div>

            {/* Chess piece sprites — desktop only */}
            <div className="hidden md:contents">
              {heroSprites.pieces.map((piece, i) => {
                const floatNames = ['floatA', 'floatB', 'floatC', 'floatD', 'floatE']
                return (
                  <div
                    key={i}
                    className="absolute overflow-hidden pointer-events-none"
                    style={{
                      left: piece.left, top: piece.top, width: piece.width, height: piece.height,
                      animation: visible
                        ? `pieceRise 1s cubic-bezier(0.16,1,0.3,1) ${piece.entranceDelay} both, ${floatNames[i]} ${piece.floatDuration} ${piece.entranceDelay} ease-in-out infinite`
                        : 'none',
                      opacity: visible ? undefined : 0,
                    }}
                  >
                    <CldImage
                      src={heroSprites.sprite} alt=""
                      className="absolute h-full max-w-none top-0"
                      style={{ left: piece.spriteLeft, width: piece.spriteWidth }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Gradient fade to white */}
            <div className="absolute inset-x-0 bottom-0 h-[30%] md:h-[25%] bg-linear-to-b from-transparent to-white pointer-events-none" />
          </div>

          {/* Content on white */}
          <div
            className="max-w-[1440px] mx-auto px-[14px] md:px-[80px] pb-[60px]"
            style={{
              animation: visible ? 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
              opacity: visible ? undefined : 0,
            }}
          >
            <p
              className="uppercase text-black font-semibold text-[20px] md:text-[24px] tracking-[-0.4px] md:tracking-[-0.02em] mb-[24px] text-center"
              style={{ fontFamily: 'Inter, sans-serif', lineHeight: '24px' }}
            >
              WHAT IT IS
            </p>

            <h2
              className="text-center text-black mb-10 max-w-[362px] md:max-w-[834px] mx-auto leading-[44px] md:leading-[1.2] tracking-[-0.64px] md:tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 3.75vw, 54px)' }}
            >
              {(heroHeadline || []).map((part, i) =>
                part.style === 'italic'
                  ? <em key={i} style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>{part.text}</em>
                  : <span key={i} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{part.text}</span>
              )}
            </h2>

            {(heroCol1 || heroCol2) && (
              <div className="flex flex-col md:grid md:grid-cols-2 gap-[24px] md:gap-[80px] mb-10 max-w-[337px] md:max-w-[860px] mx-auto">
                {heroCol1 && <p className="text-[#52525b] text-[15px] md:text-[18px] leading-[26px] text-center md:text-left" style={{ fontFamily: 'Inter, sans-serif' }}>{heroCol1}</p>}
                {heroCol2 && <p className="text-[#52525b] text-[15px] md:text-[18px] leading-[26px] text-center md:text-left" style={{ fontFamily: 'Inter, sans-serif' }}>{heroCol2}</p>}
              </div>
            )}

            <div className="flex flex-col items-center justify-center gap-[15px] md:gap-[12px] md:max-w-none mx-auto md:flex-row">
              <Link
                href={heroCtaPrimary?.href || '/signup'}
                className="inline-flex items-center justify-center w-full md:w-auto bg-[#18181b] text-white rounded-[6px] px-[24px] h-[54px] md:h-auto md:py-[8px] text-[18px] leading-[20px] font-medium whitespace-nowrap hover:bg-[#27272a] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {heroCtaPrimary?.label || 'Discover MANIFESTR Today'}
              </Link>
              <Link
                href={heroCtaSecondary?.href || '/tools'}
                className="inline-flex items-center justify-center w-full md:w-auto bg-white border border-[#e4e4e7] text-[#18181b] rounded-[6px] px-[24px] h-[54px] md:h-auto md:py-[8px] text-[18px] leading-[20px] font-medium whitespace-nowrap hover:bg-[#f4f4f5] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {heroCtaSecondary?.label || 'Explore Our Tools'}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── MOBILE: image on top, content on white below ── */}
          <div className="md:hidden bg-white">
            <div
              className="relative w-full overflow-hidden aspect-13/10"
              style={{
                animation: visible ? 'heroZoomIn 1.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <CldImage src={heroImage} alt="" className="w-full h-full object-cover object-top" priority />
              <div className="absolute inset-x-0 bottom-0 h-[40%] bg-linear-to-b from-transparent to-white pointer-events-none" />
            </div>

            <div
              className="pb-[60px]"
              style={{
                animation: visible ? 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <p
                className="uppercase text-black font-semibold text-[20px] tracking-[-0.4px] mb-[24px] text-center"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: '24px' }}
              >
                WHAT IT IS
              </p>

              <h2
                className="text-center text-black mb-10 max-w-[362px] mx-auto leading-[44px] tracking-[-0.64px] capitalize"
                style={{ fontSize: '32px' }}
              >
                {(heroHeadline || []).map((part, i) =>
                  part.style === 'italic'
                    ? <em key={i} style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>{part.text}</em>
                    : <span key={i} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{part.text}</span>
                )}
              </h2>

              {heroCol1 && (
                <p
                  className="text-[#52525b] text-[15px] leading-[26px] text-center max-w-[337px] mx-auto mb-10"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCol1}
                </p>
              )}

              <div className="flex flex-col gap-[15px] px-[51px]">
                <Link
                  href={heroCtaPrimary?.href || '/signup'}
                  className="inline-flex items-center justify-center w-full bg-[#18181b] text-white rounded-[6px] px-[24px] h-[54px] text-[18px] leading-[20px] font-medium whitespace-nowrap hover:bg-[#27272a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCtaPrimary?.label || 'Discover MANIFESTR Today'}
                </Link>
                <Link
                  href={heroCtaSecondary?.href || '/tools'}
                  className="inline-flex items-center justify-center w-full bg-white border border-[#e4e4e7] text-[#18181b] rounded-[6px] px-[24px] h-[54px] text-[18px] leading-[20px] font-medium whitespace-nowrap hover:bg-[#f4f4f5] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCtaSecondary?.label || 'Explore Our Tools'}
                </Link>
              </div>
            </div>
          </div>

          {/* ── DESKTOP: full-bleed image, content overlaid ── */}
          <div className="hidden md:block relative w-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                animation: visible ? 'heroZoomIn 1.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <CldImage src={heroImage} alt="" className="w-full h-full object-cover object-top" priority />
              <div className="absolute inset-0 bg-black/15" />
            </div>

            <div className="relative w-full aspect-1440/760">
              <div
                className="absolute pointer-events-none select-none flex flex-col items-center"
                style={{ left: '9.72%', width: '80.56%', top: '15%' }}
              >
                <p
                  className="text-white uppercase text-center"
                  style={{
                    fontFamily: "'IvyPresto Headline', serif",
                    fontStyle: 'italic', fontWeight: 700,
                    fontSize: 'clamp(48px, 6.67vw, 96px)', lineHeight: 1.1,
                    letterSpacing: '0.13em', textShadow: '0px 0px 0px #040404',
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
                    fontStyle: 'italic', fontWeight: 700,
                    fontSize: 'clamp(48px, 9.72vw, 140px)', lineHeight: 1,
                    letterSpacing: '0.1em', textShadow: '12px 11px 35px #000',
                    marginTop: '8px',
                    animation: visible ? 'strategistReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s both' : 'none',
                    opacity: visible ? undefined : 0,
                  }}
                >
                  {name.toUpperCase()}
                </p>
              </div>
            </div>

            <div
              className="relative z-10 max-w-[1440px] mx-auto px-[80px] pb-[60px]"
              style={{
                animation: visible ? 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <p
                className="uppercase text-black font-semibold text-[24px] tracking-[-0.02em] mb-[24px] text-center"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: '24px' }}
              >
                WHAT IT IS
              </p>

              <h2
                className="text-center text-black mb-10 max-w-[834px] mx-auto leading-[1.2] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(32px, 3.75vw, 54px)' }}
              >
                {(heroHeadline || []).map((part, i) =>
                  part.style === 'italic'
                    ? <em key={i} style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>{part.text}</em>
                    : <span key={i} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{part.text}</span>
                )}
              </h2>

              {(heroCol1 || heroCol2) && (
                <div className="grid grid-cols-2 gap-[80px] mb-10 max-w-[860px] mx-auto">
                  {heroCol1 && <p className="text-[#52525b] text-[18px] leading-[26px] text-left" style={{ fontFamily: 'Inter, sans-serif' }}>{heroCol1}</p>}
                  {heroCol2 && <p className="text-[#52525b] text-[18px] leading-[26px] text-left" style={{ fontFamily: 'Inter, sans-serif' }}>{heroCol2}</p>}
                </div>
              )}

              <div className="flex items-center justify-center gap-[12px]">
                <Link
                  href={heroCtaPrimary?.href || '/signup'}
                  className="inline-flex items-center justify-center bg-[#18181b] text-white rounded-[6px] px-[24px] py-[8px] text-[18px] leading-[20px] font-medium whitespace-nowrap hover:bg-[#27272a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCtaPrimary?.label || 'Discover MANIFESTR Today'}
                </Link>
                <Link
                  href={heroCtaSecondary?.href || '/tools'}
                  className="inline-flex items-center justify-center bg-white border border-[#e4e4e7] text-[#18181b] rounded-[6px] px-[24px] py-[8px] text-[18px] leading-[20px] font-medium whitespace-nowrap hover:bg-[#f4f4f5] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCtaSecondary?.label || 'Explore Our Tools'}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── DARK BANNER ─── */}
      {darkBannerText && (
        <div
          className="w-full flex items-center justify-center px-6 md:px-[80px] py-5 md:min-h-[84px]"
          style={{
            backgroundColor: '#272727',
            animation: visible ? 'fadeIn 0.8s ease-out 1.3s both' : 'none',
            opacity: visible ? undefined : 0,
          }}
        >
          <p
            className="text-white text-center font-bold uppercase text-[24px] leading-[32px] tracking-[2.4px]"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            <span className="md:hidden">{darkBannerText.split(/;\s*|\s*—\s*/)[0]}</span>
            <span className="hidden md:inline">{darkBannerText}</span>
          </p>
        </div>
      )}
    </section>
  )
}
