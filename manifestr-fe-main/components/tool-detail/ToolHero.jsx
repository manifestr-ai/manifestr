import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import CldImage from '../ui/CldImage'

/** Design Studio hero overlay: identical type size on DESIGN + STUDIO lines (max 140px). */
const DESIGN_STUDIO_OVERLAY_LINE = {
  fontFamily: "'IvyPresto Headline', serif",
  fontStyle: 'italic',
  fontWeight: 700,
  fontSize: 'clamp(48px, 9.5vw, 140px)',
  lineHeight: 1.05,
  letterSpacing: '0.1em',
  textShadow: '12px 11px 35px #000',
}

const MOBILE_HERO_IVY = {
  fontFamily: "'IvyPresto Headline', serif",
  fontStyle: 'italic',
  fontWeight: 700,
  textShadow: '0 2px 20px rgba(0,0,0,0.5), 2px 4px 24px rgba(0,0,0,0.35)',
}

/** Big tool name on the image (THE STRATEGIST, DESIGN / STUDIO, etc.) — mobile only. */
function MobileHeroToolTitle({ slug, prefix, name, visible }) {
  const animReveal = (delay) => ({
    animation: visible ? `theReveal 1s cubic-bezier(0.16,1,0.3,1) ${delay}s both` : 'none',
    opacity: visible ? undefined : 0,
  })
  const animStrategist = (delay) => ({
    animation: visible ? `strategistReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s both` : 'none',
    opacity: visible ? undefined : 0,
  })

  if (slug === 'design-studio') {
    const fs = 'clamp(32px, 9.5vw, 52px)'
    return (
      <div className="flex max-w-[min(100%,360px)] flex-col items-center gap-1 text-center">
        <p
          className="text-white uppercase"
          style={{
            ...MOBILE_HERO_IVY,
            fontSize: fs,
            lineHeight: 1.05,
            letterSpacing: '0.1em',
            ...animReveal(0.2),
          }}
        >
          {prefix}
        </p>
        <p
          className="text-white uppercase pl-2"
          style={{
            ...MOBILE_HERO_IVY,
            fontSize: fs,
            lineHeight: 1.05,
            letterSpacing: '0.1em',
            ...animStrategist(0.45),
          }}
        >
          {name.toUpperCase()}
        </p>
      </div>
    )
  }
  if (slug === 'deck' || slug === 'cost-ctrl') {
    return (
      <div className="flex max-w-[min(100%,360px)] flex-wrap items-baseline justify-center gap-x-2 text-center">
        <span
          className="text-white uppercase"
          style={{
            ...MOBILE_HERO_IVY,
            fontSize: 'clamp(40px, 12vw, 64px)',
            lineHeight: 1,
            letterSpacing: '0.1em',
            ...animReveal(0.2),
          }}
        >
          {prefix}
        </span>
        <span
          className="text-white uppercase"
          style={{
            ...MOBILE_HERO_IVY,
            fontSize: 'clamp(40px, 12vw, 64px)',
            lineHeight: 1,
            letterSpacing: '0.1em',
            ...animStrategist(0.45),
          }}
        >
          {name.toUpperCase()}
        </span>
      </div>
    )
  }
  return (
    <div className="flex max-w-[min(100%,360px)] flex-col items-center gap-0.5 text-center">
      <p
        className="text-white uppercase"
        style={{
          ...MOBILE_HERO_IVY,
          fontSize: 'clamp(26px, 7vw, 36px)',
          lineHeight: 1.1,
          letterSpacing: '0.13em',
          ...animReveal(0.2),
        }}
      >
        {prefix}
      </p>
      <p
        className="text-white uppercase"
        style={{
          ...MOBILE_HERO_IVY,
          fontSize: 'clamp(36px, 11vw, 56px)',
          lineHeight: 1,
          letterSpacing: '0.1em',
          marginTop: '4px',
          ...animStrategist(0.45),
        }}
      >
        {name.toUpperCase()}
      </p>
    </div>
  )
}

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

  const {
    slug,
    heroImage,
    heroImageMobile,
    heroSprites,
    heroHeadline,
    heroCol1,
    heroCol2,
    darkBannerText,
    heroCtaPrimary,
    heroCtaSecondary,
    prefix,
    name,
  } = tool
  const mobileHeroImageSrc = heroImageMobile || heroImage
  const hasSprites = !!heroSprites
  /** Analyzer / Briefcase / Wordsmith: left-align prefix + name; outer flex still centers the group; smaller clamps. */
  const stackedHeroTitle =
    slug === 'analyzer' || slug === 'briefcase' || slug === 'wordsmith'
  /** Design Studio: same font size on both lines; STUDIO nudged 12px right; group centered. */
  const designStudioStackedTitle = slug === 'design-studio'
  /** Headline copy uses newlines (e.g. after first sentence). */
  const heroHeadlinePreservesBreaks =
    slug === 'analyzer' ||
    slug === 'briefcase' ||
    slug === 'design-studio' ||
    slug === 'wordsmith' ||
    slug === 'deck' ||
    slug === 'huddle' ||
    slug === 'cost-ctrl'
  /** Extra space above hero headline (Design Studio “Define…” block). */
  const designStudioHeadlineTopSpace = slug === 'design-studio'
  /** Per-tool desktop title overlay vertical position (default 24%). */
  const heroTitleOverlayTop =
    slug === 'huddle' ? '40%' : slug === 'cost-ctrl' ? '50%' : '24%'

  /** Mobile: lower tool title on image + stronger pull-up for body copy under gradient */
  const mobileHeroTighterSpacing =
    slug === 'design-studio' ||
    slug === 'analyzer' ||
    slug === 'cost-ctrl' ||
    slug === 'huddle'

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
           STRATEGIST LAYOUT — hero + content below
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

            {/* Tool name — top of image; top scrim for legibility; bottom blend into white section */}
            <div className="pointer-events-none select-none md:hidden absolute inset-x-0 top-0 z-10 flex justify-center bg-linear-to-b from-black/55 via-black/20 to-transparent px-4 pb-14 pt-10">
              <MobileHeroToolTitle slug={slug} prefix={prefix} name={name} visible={visible} />
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-5 h-[38%] min-h-[110px] bg-linear-to-t from-white via-white/75 to-transparent md:hidden"
              aria-hidden
            />
          </div>

          {/* Content on white */}
          <div
            className="max-w-[1440px] mx-auto px-[14px] md:px-[80px] pb-[60px]"
            style={{
              animation: visible ? 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
              opacity: visible ? undefined : 0,
            }}
          >
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
                className="inline-flex h-[54px] w-[289px] max-w-full shrink-0 items-center justify-center rounded-[6px] bg-[#18181b] px-[24px] text-[18px] font-medium leading-[20px] text-white whitespace-nowrap hover:bg-[#27272a] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {heroCtaPrimary?.label || 'Discover MANIFESTR Today'}
              </Link>
              <Link
                href={heroCtaSecondary?.href || '/tools'}
                className="inline-flex h-[54px] w-[289px] max-w-full shrink-0 items-center justify-center rounded-[6px] border border-[#e4e4e7] bg-white px-[24px] text-[18px] font-medium leading-[20px] text-[#18181b] whitespace-nowrap hover:bg-[#f4f4f5] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {heroCtaSecondary?.label || 'Explore Our Tools'}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── MOBILE: fixed-aspect hero image + tool title overlay, then headline & CTAs ── */}
          <div className="md:hidden relative w-full bg-[#faf9f7]">
            <div className="relative w-full overflow-hidden aspect-390/520">
              <div
                className="absolute inset-0"
                style={{
                  animation: visible ? 'heroZoomIn 1.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards' : 'none',
                  opacity: visible ? undefined : 0,
                }}
              >
                <CldImage
                  src={mobileHeroImageSrc}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  priority
                />
              </div>
              {/* Fade bottom of image into cream background */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[45%]"
                aria-hidden
                style={{ background: 'linear-gradient(to top, #faf9f7 0%, #faf9f7 10%, rgba(250,249,247,0.7) 55%, transparent 100%)' }}
              />
              {/* Tool name — top of image with dark-to-transparent gradient behind */}
              <div
                className={`absolute inset-x-0 top-0 z-20 flex flex-col items-center pointer-events-none select-none px-4 pb-16 ${mobileHeroTighterSpacing ? 'pt-26' : 'pt-10'}`}
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)' }}
              >
                <MobileHeroToolTitle slug={slug} prefix={prefix} name={name} visible={visible} />
              </div>
            </div>

            <div
              className={`relative z-10 flex w-full max-w-[362px] mx-auto flex-col items-center gap-[26px] pl-[13px] pr-[15px] pb-[67px] pt-0 ${mobileHeroTighterSpacing ? '-mt-44' : '-mt-36'}`}
              style={{
                animation: visible ? 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <h2
                className={`w-[362px] max-w-full text-center tracking-[-0.64px] text-black ${heroHeadlinePreservesBreaks ? 'whitespace-pre-line' : ''}`}
              >
                <span className="block text-[32px] leading-[44px]">
                  {(heroHeadline || []).map((part, i) => {
                    const t = heroHeadlinePreservesBreaks ? part.text : part.text.replace(/\n/g, ' ')
                    return part.style === 'italic'
                      ? (
                          <em key={i} style={{ fontFamily: "'IvyPresto Headline', serif", fontStyle: 'italic', fontWeight: 600 }}>
                            {t}
                          </em>
                        )
                      : (
                          <span key={i} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                            {t}
                          </span>
                        )
                  })}
                </span>
              </h2>

              {heroCol1 && (
                <p
                  className="w-[337px] max-w-full text-center text-[15px] font-normal leading-[26px] text-[#52525b]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCol1}
                </p>
              )}

              {/* Primary CTA — Figma 13636:24618 (289×54, shadcn Button lg) */}
              <div className="flex w-full flex-col items-center gap-[8px]">
                <Link
                  href={heroCtaPrimary?.href || '/signup'}
                  className="inline-flex h-[54px] w-[289px] max-w-full shrink-0 items-center justify-center rounded-[6px] bg-[#18181b] px-[24px] text-[18px] font-medium leading-[20px] text-white whitespace-nowrap hover:bg-[#27272a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCtaPrimary?.label || 'Discover MANIFESTR Today'}
                </Link>
                <Link
                  href={heroCtaSecondary?.href || '/tools'}
                  className="inline-flex h-[54px] w-[289px] max-w-full shrink-0 items-center justify-center rounded-[6px] border border-solid border-[#e4e4e7] bg-white px-[24px] text-[18px] font-medium leading-[20px] text-[#18181b] whitespace-nowrap hover:bg-[#f4f4f5] transition-colors"
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
            </div>

            <div className="relative w-full aspect-1440/760">
              <div
                className="absolute pointer-events-none select-none flex flex-col items-center"
                style={{ left: '9.72%', width: '80.56%', top: heroTitleOverlayTop }}
              >
                {stackedHeroTitle ? (
                  <div className="inline-flex flex-col items-start">
                    <p
                      className="text-white uppercase text-left whitespace-nowrap"
                      style={{
                        fontFamily: "'IvyPresto Headline', serif",
                        fontStyle: 'italic', fontWeight: 700,
                        fontSize: 'clamp(42px, 5.9vw, 86px)', lineHeight: 1.1,
                        letterSpacing: '0.13em', textShadow: '0px 0px 0px #040404',
                        animation: visible ? 'theReveal 1s cubic-bezier(0.16,1,0.3,1) 0.2s both' : 'none',
                        opacity: visible ? undefined : 0,
                        ...(slug === 'wordsmith' ? { marginLeft: '146px',marginTop:'130px' } : {}),
                      }}
                    >
                      {prefix}
                    </p>
                    <p
                      className="text-white uppercase text-left whitespace-nowrap"
                      style={{
                        fontFamily: "'IvyPresto Headline', serif",
                        fontStyle: 'italic', fontWeight: 700,
                        fontSize: 'clamp(40px, 8.6vw, 124px)', lineHeight: 1,
                        letterSpacing: '0.1em', textShadow: '12px 11px 35px #000',
                        marginTop: '8px',
                        animation: visible ? 'strategistReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s both' : 'none',
                        opacity: visible ? undefined : 0,
                      }}
                    >
                      {name.toUpperCase()}
                    </p>
                  </div>
                ) : designStudioStackedTitle ? (
                  <div className="inline-flex flex-col items-start">
                    <p
                      className="text-white uppercase text-left whitespace-nowrap"
                      style={{
                        ...DESIGN_STUDIO_OVERLAY_LINE,
                        animation: visible ? 'theReveal 1s cubic-bezier(0.16,1,0.3,1) 0.2s both' : 'none',
                        opacity: visible ? undefined : 0,
                      }}
                    >
                      {prefix}
                    </p>
                    <p
                      className="text-white uppercase text-left whitespace-nowrap"
                      style={{
                        ...DESIGN_STUDIO_OVERLAY_LINE,
                        marginTop: '8px',
                        marginLeft: '36px',
                        animation: visible ? 'strategistReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s both' : 'none',
                        opacity: visible ? undefined : 0,
                      }}
                    >
                      {name.toUpperCase()}
                    </p>
                  </div>
                ) : slug === 'deck' || slug === 'cost-ctrl' ? (
                  <div className="inline-flex max-w-full flex-nowrap items-baseline justify-center gap-x-[0.55em] text-center text-white uppercase">
                    <span
                      className="shrink-0 whitespace-nowrap"
                      style={{
                        fontFamily: "'IvyPresto Headline', serif",
                        fontStyle: 'italic', fontWeight: 700,
                        fontSize: 'clamp(48px, 9.72vw, 140px)', lineHeight: 1,
                        letterSpacing: '0.1em', textShadow: '12px 11px 35px #000',
                        animation: visible ? 'theReveal 1s cubic-bezier(0.16,1,0.3,1) 0.2s both' : 'none',
                        opacity: visible ? undefined : 0,
                      }}
                    >
                      {prefix}
                    </span>
                    <span
                      className="shrink-0 whitespace-nowrap"
                      style={{
                        fontFamily: "'IvyPresto Headline', serif",
                        fontStyle: 'italic', fontWeight: 700,
                        fontSize: 'clamp(48px, 9.72vw, 140px)', lineHeight: 1,
                        letterSpacing: '0.1em', textShadow: '12px 11px 35px #000',
                        animation: visible ? 'strategistReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s both' : 'none',
                        opacity: visible ? undefined : 0,
                      }}
                    >
                      {name.toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            <div
              className="relative z-10 max-w-[1440px] mx-auto px-[80px] pb-[60px]"
              style={{
                animation: visible ? 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <h2
                className={`text-center text-black mb-10 max-w-[834px] mx-auto leading-[1.2] tracking-[-0.02em] ${heroHeadlinePreservesBreaks ? 'whitespace-pre-line' : ''} ${designStudioHeadlineTopSpace ? 'md:mt-14 lg:mt-16' : ''}`}
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
                  className="inline-flex h-[54px] w-[289px] max-w-full shrink-0 items-center justify-center rounded-[6px] bg-[#18181b] px-[24px] text-[18px] font-medium leading-[20px] text-white whitespace-nowrap hover:bg-[#27272a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {heroCtaPrimary?.label || 'Discover MANIFESTR Today'}
                </Link>
                <Link
                  href={heroCtaSecondary?.href || '/tools'}
                  className="inline-flex h-[54px] w-[289px] max-w-full shrink-0 items-center justify-center rounded-[6px] border border-[#e4e4e7] bg-white px-[24px] text-[18px] font-medium leading-[20px] text-[#18181b] whitespace-nowrap hover:bg-[#f4f4f5] transition-colors"
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
