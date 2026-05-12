const SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1536, 1920, 2048]

function isCloudinaryUrl(src) {
  return typeof src === 'string' && src.includes('res.cloudinary.com')
}

function isSvgUrl(src) {
  return typeof src === 'string' && src.toLowerCase().endsWith('.svg')
}

/** Maps prop to Cloudinary quality. Default app-wide is `q_100` (least compression). */
function qualitySegment(quality) {
  if (quality === 'best') return 'q_auto:best'
  if (quality === 'auto') return 'q_auto'
  if (typeof quality === 'number') return `q_${Math.min(100, Math.max(1, quality))}`
  return 'q_100'
}

function addTransforms(src, width, quality = 100) {
  if (!isCloudinaryUrl(src) || isSvgUrl(src)) return src
  if (src.includes('f_auto')) return src

  const q = qualitySegment(quality)
  const parts = width ? `f_auto,${q},w_${width},c_limit` : `f_auto,${q}`

  return src.replace('/upload/', `/upload/${parts}/`)
}

function buildSrcSet(src, quality = 100) {
  if (!isCloudinaryUrl(src) || isSvgUrl(src)) return undefined

  return SRCSET_WIDTHS.map((w) => `${addTransforms(src, w, quality)} ${w}w`).join(', ')
}

export default function CldImage({
  src,
  alt = '',
  priority = false,
  sizes = '100vw',
  className,
  style,
  /** `100` = `q_100` (max). Use `'best'` for `q_auto:best`, or `'auto'` for `q_auto` if you need smaller files. */
  cloudinaryQuality = 100,
  /** Explicit width for `src` fallback so the browser gets enough pixels before / besides srcset (retina). */
  fallbackWidth,
  ...rest
}) {
  const quality = cloudinaryQuality
  const srcAttr =
    fallbackWidth != null ? addTransforms(src, fallbackWidth, quality) : addTransforms(src, undefined, quality)

  return (
    <img
      src={srcAttr}
      srcSet={buildSrcSet(src, quality)}
      sizes={isCloudinaryUrl(src) && !isSvgUrl(src) ? sizes : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={style}
      {...rest}
    />
  )
}
