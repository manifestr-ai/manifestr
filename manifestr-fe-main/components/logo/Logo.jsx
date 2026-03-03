import Image from 'next/image'

export default function Logo({ size = 'md', className = '', onClick }) {
  const sizes = {
    xs: { width: 100, height: 14 },
    sm: { width: 120, height: 18 },
    md: { width: 214.5, height: 24 },
    lg: { width: 286, height: 32 },
    xl: { width: 429, height: 48 },
  }

  const { width, height } = sizes[size] || sizes.md

  return (
    <div 
      className={`relative ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`} 
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      <Image
        src="/assets/logos/text-logo.svg"
        alt="Manifestr Logo"
        fill
        className="object-contain"
        draggable={false}
      />
    </div>
  )
}
