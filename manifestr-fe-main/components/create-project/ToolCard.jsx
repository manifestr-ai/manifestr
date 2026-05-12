import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Helper function to parse title and render it correctly
function renderTitle(title, textColor = 'text-black') {
  // Handle titles like "THE strategist", "THE analyser", etc.
  if (title.startsWith('THE ')) {
    const rest = title.substring(4)
    return (
      <>
        <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.6px] ${textColor}`}>
          THE{' '}
        </span>
        <span className={`font-accent italic font-bold text-[40px] leading-[44px] tracking-[-0.72px] ${textColor} lowercase`} style={{ fontFamily: "'IvyPresto Headline', serif" }}>
          {rest}
        </span>
      </>
    )
  }
  // Handle titles like "DESIGN studio"
  if (title.includes(' ')) {
    const parts = title.split(' ')
    const firstPart = parts[0]
    const rest = parts.slice(1).join(' ')
    return (
      <>
        <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.72px] ${textColor}`}>
          {firstPart}
        </span>
        <span className={`font-accent italic font-bold text-[40px] leading-[44px] tracking-[-0.72px] ${textColor} lowercase`} style={{ fontFamily: "'Playfair Display', serif" }}>
          {' '}{rest}
        </span>
      </>
    )
  }
  // Handle single word titles like "WORDSMITH"
  return (
    <span className={`font-hero font-extrabold text-[30px] leading-[44px] tracking-[-0.6px] ${textColor}`}>
      {title}
    </span>
  )
}

export default function ToolCard({
  title,
  subtitle,
  imageSrc,
  hoverImageSrc,
  description,
  onClick,
  isSelected = false,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-tool-card="true"
      className={`relative bg-white rounded-xl overflow-hidden h-[369px] cursor-pointer group shadow-sm hover:shadow-xl transition-shadow duration-300 ${isSelected ? 'border-2 border-[#000000]' : 'border-2 border-transparent'
        }`}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
        className="flex flex-col p-3 h-full relative"
      >
        {/* Image Section */}
        <div className="w-full h-[243px] rounded-xl overflow-hidden shrink-0">
          <div className="relative w-full h-full">
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={title}
                fill
                quality={100}
                className="object-cover rounded-xl"
              />
            )}
            {hoverImageSrc && isHovered && (
              <div className="absolute inset-0">
                <Image
                  src={hoverImageSrc}
                  alt={title}
                  fill
                  quality={100}
                  className="object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </div>

        {/* Title Section */}
        <div className="mt-4 w-full z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h3>{renderTitle(title)}</h3>
          </div>
        </div>

        {/* Subtitle Section */}
        <div className="mt-auto mb-2 w-full z-10">
          <div className="flex items-center justify-center gap-1">
            {subtitle.split(' • ').map((item, index, array) => (
              <div key={index} className="flex items-center">
                <p className="text-[14px] leading-[20px] text-black font-normal">
                  {item}
                </p>
                {index < array.length - 1 && (
                  <div className="mx-1 w-1 h-1">
                    <div className="w-full h-full bg-black rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* White Overlay - Slides from bottom on hover */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: isHovered ? 0 : '100%' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 bg-white rounded-xl z-20"
        >
          {/* Content on overlay */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Title on overlay */}
              <div className="mb-2 shrink-0">
                <div className="flex flex-col items-center justify-center text-center mb-1.5">
                  <h3>{renderTitle(title, 'text-black')}</h3>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {subtitle.split(' • ').map((item, index, array) => (
                    <div key={index} className="flex items-center">
                      <p className="text-[14px] leading-[20px] text-black font-normal">
                        {item}
                      </p>
                      {index < array.length - 1 && (
                        <div className="mx-1 w-1 h-1">
                          <div className="w-full h-full bg-black rounded-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Content */}
              {description && (
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  {description.title && (
                    <p className="font-bold text-[14px] leading-[20px] mb-1.5 text-black shrink-0">
                      {description.title}
                    </p>
                  )}
                  {description.content && (
                    <div className="text-[14px] leading-[20px] text-black mb-1.5 line-clamp-4">
                      {description.content}
                    </div>
                  )}
                  {description.quickTip && (
                    <p className="text-[14px] leading-[20px] text-black shrink-0 line-clamp-2">
                      <span className="font-bold">Quick Tip:</span>{' '}
                      {description.quickTip}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Start Now Button */}
            {/* <button
              onClick={(e) => {
                e.stopPropagation()
                if (onClick) onClick()
              }}
              className="w-full bg-[#18181b] hover:bg-[#27272a] active:bg-[#18181b] text-white font-bold text-[14px] leading-[20px] py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer shrink-0 mt-2"
            >
              Start Now
            </button> */}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

