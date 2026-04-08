import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') return

    setIsDeleting(true)
    await onConfirm()
    setIsDeleting(false)
  }

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('')
      onClose()
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
              className="bg-white rounded-xl shadow-2xl border border-[#e4e4e7] w-[90%] max-w-[520px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b]">
                      Delete Account
                    </h3>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isDeleting}
                    className="text-[#71717a] hover:text-[#18181b] transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Warning Box */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  {/* <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b] mb-2">
                        Warning: This action cannot be undone
                      </h4>
                      <p className="text-[14px] leading-[20px] text-[#71717a]">
                        Deleting your account will permanently remove:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-[14px] leading-[20px] text-[#71717a]">
                        <li>Your profile and personal information</li>
                        <li>All your projects and vault items</li>
                        <li>Style guides and generated content</li>
                        <li>All associated data and settings</li>
                      </ul>
                    </div>
                  </div> */}
                </div>

                {/* Confirmation Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                    Type <span className="font-bold text-red-600">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    disabled={isDeleting}
                    placeholder="Type DELETE here"
                    className="h-[40px] px-3 border border-[#e4e4e7] rounded-md bg-white text-[14px] leading-[20px] text-[#18181b] focus:outline-none focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-[#f4f4f5] border-t border-[#e4e4e7] flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="px-4 py-2 h-[40px] border border-[#e4e4e7] rounded-md bg-white text-[#18181b] font-medium text-[14px] leading-[20px] hover:bg-[#f4f4f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: confirmText === 'DELETE' && !isDeleting ? 1.02 : 1 }}
                  whileTap={{ scale: confirmText === 'DELETE' && !isDeleting ? 0.98 : 1 }}
                  onClick={handleConfirm}
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  className="px-4 py-2 h-[40px] bg-red-600 text-white rounded-md font-medium text-[14px] leading-[20px] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Account Permanently
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
