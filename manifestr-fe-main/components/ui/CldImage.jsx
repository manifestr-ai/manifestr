const SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048]

function isCloudinaryUrl(src) {
  return typeof src === 'string' && src.includes('res.cloudinary.com')
}

function isSvgUrl(src) {
  return typeof src === 'string' && src.toLowerCase().endsWith('.svg')
}

function addTransforms(src, width) {
  if (!isCloudinaryUrl(src) || isSvgUrl(src)) return src
  if (src.includes('f_auto')) return src

  const parts = width
    ? `f_auto,q_auto,w_${width},c_limit`
    : 'f_auto,q_auto'

  return src.replace('/upload/', `/upload/${parts}/`)
}

function buildSrcSet(src) {
  if (!isCloudinaryUrl(src) || isSvgUrl(src)) return undefined

  return SRCSET_WIDTHS
    .map((w) => `${addTransforms(src, w)} ${w}w`)
    .join(', ')
}

export default function CldImage({
  src,
  alt = '',
  priority = false,
  sizes = '100vw',
  className,
  style,
  ...rest
}) {
  return (
    <img
      src={addTransforms(src)}
      srcSet={buildSrcSet(src)}
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
