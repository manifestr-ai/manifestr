import { motion } from 'framer-motion'
import { MoreVertical } from 'lucide-react'
import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import StyleGuideDropdown from '../ui/StyleGuideDropdown'

export default function StyleGuideCard({
  category,
  categoryDetail = 'Style Guide',
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

      const left = rect.right - dropdownWidth
      const top = rect.bottom + 8

      setDropdownPosition({
        top: top,
        left: left,
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
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        className="relative rounded-xl overflow-hidden cursor-pointer min-h-[192px] group shadow-[0px_1px_3px_rgba(0,0,0,0.08)]"
        style={{
          background: gradient,
        }}
        onClick={onClick}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-6 rounded-xl">
          {/* Top: header + menu (Figma 9742:8858) */}
          <div className="flex shrink-0 items-center justify-between gap-3 w-full">
            <div className="flex min-w-0 flex-wrap items-center gap-1 text-[14px] leading-5 tracking-[-0.15px]">
              <span className="font-semibold text-white truncate">{category}</span>
              {categoryDetail ? (
                <span className="font-normal text-[#e3e3e3] truncate">{categoryDetail}</span>
              ) : null}
            </div>
            <button
              ref={buttonRef}
              type="button"
              aria-label="More actions"
              onClick={handleMenuClick}
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-md bg-white/10 transition-colors hover:bg-white/[0.18] z-10"
            >
              <MoreVertical className="h-4 w-4 text-white" strokeWidth={2} />
            </button>
          </div>

          {/* Title block — gap 4px per Figma */}
          <div className="flex flex-1 flex-col justify-center gap-1 min-h-[52px] py-1">
            <h3 className="text-[20px] font-medium leading-7 text-white tracking-[-0.45px] truncate">
              {title}
            </h3>
            <p className="text-[14px] font-medium leading-5 text-white tracking-[-0.15px] truncate">
              {subtitle}
            </p>
          </div>

          {/* Footer: count + muted label (Figma 9742:8872) */}
          <div className="flex h-9 shrink-0 items-center">
            <div className="flex items-center gap-1.5 text-[14px] leading-5 font-normal tracking-[-0.15px]">
              <span className="text-white">{projectCount}</span>
              <span className="text-[#d1d5dc]">Projects</span>
            </div>
          </div>
        </div>
      </motion.div>

      {typeof document !== 'undefined' && isDropdownOpen && createPortal(
        <>
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
              background: 'transparent',
            }}
          />
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
