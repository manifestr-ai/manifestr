import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function RenameStyleGuideModal({ isOpen, onClose, onConfirm, currentName }) {
  const [newName, setNewName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setNewName(currentName || '')
    }
  }, [isOpen, currentName])

  const handleConfirm = async () => {
    if (!newName.trim()) return

    setIsRenaming(true)
    await onConfirm(newName.trim())
    setIsRenaming(false)
  }

  const handleClose = () => {
    if (!isRenaming) {
      setNewName('')
      onClose()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newName.trim()) {
      handleConfirm()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl border border-[#e4e4e7] w-[90%] max-w-[480px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                      Rename Style Guide
                    </h3>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isRenaming}
                    className="text-[#71717a] hover:text-[#18181b] transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isRenaming}
                    placeholder="Enter brand name"
                    autoFocus
                    className="h-[48px] px-4 border border-[#e4e4e7] rounded-md bg-white text-[16px] leading-[24px] text-[#18181b] focus:outline-none focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-[#f4f4f5] border-t border-[#e4e4e7] flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  disabled={isRenaming}
                  className="px-4 py-2 h-[40px] border border-[#e4e4e7] rounded-md bg-white text-[#18181b] font-medium text-[14px] leading-[20px] hover:bg-[#f4f4f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: !newName.trim() || isRenaming ? 1 : 1.02 }}
                  whileTap={{ scale: !newName.trim() || isRenaming ? 1 : 0.98 }}
                  onClick={handleConfirm}
                  disabled={!newName.trim() || isRenaming}
                  className="px-4 py-2 h-[40px] bg-[#18181b] text-white rounded-md font-medium text-[14px] leading-[20px] hover:bg-[#27272a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRenaming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Renaming...
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Rename
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
