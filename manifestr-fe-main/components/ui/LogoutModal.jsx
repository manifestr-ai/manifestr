import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, X } from 'lucide-react'

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl border border-[#e4e4e7] w-[90%] max-w-[440px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                      Log Out
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#71717a] hover:text-[#18181b] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[16px] leading-[24px] text-[#71717a]">
                  Are you sure you want to log out of your account? You'll need to sign in again to access your workspace.
                </p>
              </div>

              {/* Footer */}
              <div className="p-6 bg-[#f4f4f5] border-t border-[#e4e4e7] flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 h-[40px] border border-[#e4e4e7] rounded-md bg-white text-[#18181b] font-medium text-[14px] leading-[20px] hover:bg-[#f4f4f5] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="px-4 py-2 h-[40px] bg-red-600 text-white rounded-md font-medium text-[14px] leading-[20px] hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
