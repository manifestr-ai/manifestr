import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit2, Download, Trash2 } from 'lucide-react'
import { useRef } from 'react'

export default function StyleGuideDropdown({ 
  isOpen, 
  onClose, 
  onOpen, 
  onRename, 
  onDownload, 
  onDelete,
  position = { top: 0, left: 0 }
}) {
  const dropdownRef = useRef(null)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-[200px] bg-white rounded-xl shadow-2xl border border-[#e4e4e7] overflow-hidden"
          style={{ 
            position: 'fixed',
            top: `${position.top}px`, 
            left: `${position.left}px`,
            zIndex: 10000,
            pointerEvents: 'auto'
          }}
        >
          <div className="py-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpen()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f4f4f5] transition-colors text-left"
            >
              <Eye className="w-5 h-5 text-[#18181b]" />
              <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">Open</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onRename()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f4f4f5] transition-colors text-left"
            >
              <Edit2 className="w-5 h-5 text-[#18181b]" />
              <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">Rename</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDownload()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f4f4f5] transition-colors text-left"
            >
              <Download className="w-5 h-5 text-[#18181b]" />
              <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">Download</span>
            </button>

            <div className="border-t border-[#e4e4e7] my-2" />

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <span className="text-[14px] leading-[20px] text-red-600 font-medium">Delete</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
