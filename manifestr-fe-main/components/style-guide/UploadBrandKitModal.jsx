import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

export default function UploadBrandKitModal({
  isOpen,
  onClose,
  onImported,
  parseAndNormalize,
}) {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const reset = () => {
    setFileName('')
    setError('')
    setIsDragging(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const processFile = useCallback(
    async (file) => {
      setError('')
      if (!file) return
      const lower = file.name.toLowerCase()
      if (!lower.endsWith('.json')) {
        setError('Please choose a .json file.')
        return
      }
      setFileName(file.name)
      try {
        const text = await file.text()
        const parsed = JSON.parse(text)
        const state = parseAndNormalize(parsed)
        reset()
        onImported(state)
      } catch (e) {
        const msg =
          e instanceof SyntaxError
            ? 'This file is not valid JSON.'
            : e?.message || 'Could not read this style guide file.'
        setError(msg)
      }
    },
    [onImported, parseAndNormalize]
  )

  const onInputChange = (e) => {
    const file = e.target.files?.[0]
    void processFile(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    void processFile(file)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl border border-[#e4e4e7] w-full max-w-[520px] overflow-hidden"
            >
              <div className="p-6 border-b border-[#e4e4e7] flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#f4f4f5] rounded-full flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#18181b]" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold leading-[26px] text-[#18181b]">
                      Upload brand kit (.json)
                    </h3>
                    <p className="mt-1 text-[14px] leading-[20px] text-[#71717a]">
                      Use a style guide JSON export from Manifestr or a compatible file. All wizard steps will be
                      prefilled — you can review and edit each step.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[#71717a] hover:text-[#18181b] transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={onInputChange}
                />

                <button
                  type="button"
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`w-full rounded-xl border-2 border-dashed px-4 py-10 flex flex-col items-center justify-center gap-3 transition-colors ${
                    isDragging
                      ? 'border-[#18181b] bg-[#fafafa]'
                      : 'border-[#e4e4e7] bg-[#fafafa] hover:border-[#a1a1aa]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-[#e4e4e7] flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#52525b]" />
                  </div>
                  <div className="text-center">
                    <span className="text-[14px] font-medium text-[#18181b]">Drop a file here or click to browse</span>
                    <p className="mt-1 text-[13px] text-[#71717a]">Only .json files</p>
                  </div>
                </button>

                {fileName ? (
                  <p className="text-[13px] text-[#52525b] text-center truncate" title={fileName}>
                    Selected: {fileName}
                  </p>
                ) : null}

                {error ? (
                  <p className="text-[14px] leading-[20px] text-red-600 text-center" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg text-[14px] font-medium text-[#52525b] hover:bg-[#f4f4f5] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
