import { motion } from 'framer-motion'
import { MoreVertical } from 'lucide-react'
import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import StyleGuideDropdown from '../ui/StyleGuideDropdown'

export default function StyleGuideCard({
  category,
  title,
  subtitle,
  projectCount,
  gradient,
  index = 0,
  onClick,
  onOpen,
  onRename,
  onDownload,
  onDelete,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const buttonRef = useRef(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  const handleMenuClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const dropdownWidth = 200
      
      // Calculate position - align to the right edge of the button
      const left = rect.right - dropdownWidth
      const top = rect.bottom + 8
      
      setDropdownPosition({
        top: top,
        left: left
      })
      
      setIsDropdownOpen(true)
    } else {
      setIsDropdownOpen(false)
    }
  }

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative rounded-3xl overflow-hidden cursor-pointer min-h-[200px] group"
        style={{
          background: gradient,
        }}
        onClick={onClick}
      >
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between rounded-3xl overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[14px] leading-[20px] text-white/80 mb-2">
                {category}
              </p>
              <h3 className="text-[20px] md:text-[24px] font-bold leading-[28px] md:leading-[32px] text-white mb-1">
                {title}
              </h3>
              <p className="text-[16px] leading-[24px] text-white/90">
                {subtitle}
              </p>
            </div>
            <button
              ref={buttonRef}
              onClick={handleMenuClick}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100 z-10"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="text-[14px] leading-[20px] text-white/80">
            {projectCount} Projects
          </div>
        </div>
      </motion.div>

      {/* Dropdown Menu - Rendered via portal to document body */}
      {typeof document !== 'undefined' && isDropdownOpen && createPortal(
        <>
          {/* Invisible backdrop to catch clicks outside */}
          <div 
            onClick={(e) => {
              e.stopPropagation()
              handleCloseDropdown()
            }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              zIndex: 9998,
              background: 'transparent'
            }}
          />
          {/* Dropdown */}
          <StyleGuideDropdown
            isOpen={isDropdownOpen}
            onClose={handleCloseDropdown}
            onOpen={onOpen}
            onRename={onRename}
            onDownload={onDownload}
            onDelete={onDelete}
            position={dropdownPosition}
          />
        </>,
        document.body
      )}
    </>
  )
}

