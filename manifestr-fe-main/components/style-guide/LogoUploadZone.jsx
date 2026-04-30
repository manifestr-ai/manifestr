import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudUpload, Plus, ChevronDown } from 'lucide-react'
import Image from 'next/image'

function formatDisplaySize(item) {
  if (item == null) return '—'
  if (typeof item.size === 'number') {
    if (item.size < 1024) return `${item.size} B`
    return `${(item.size / 1024).toFixed(0)} KB`
  }
  return item.size || '—'
}

function rowReactKey(file, index) {
  if (file?.id != null) return String(file.id)
  if (file?.fileKey != null) return String(file.fileKey)
  if (file?.url) return file.url
  if (file?.file && file.file instanceof File) {
    return `${file.file.name}-${file.file.size}-${file.file.lastModified}`
  }
  return `logo-row-${index}`
}

const LogoUploadZone = forwardRef(function LogoUploadZone(
  { logos = [], onFilesAdded, onLogosChange },
  ref
) {
  const [openDropdowns, setOpenDropdowns] = useState({})
  const fileInputRef = useRef(null)

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  useImperativeHandle(ref, () => ({ openFilePicker }), [openFilePicker])

  const categories = [
    'Primary Logo',
    'Secondary / Horizontal Lockup',
    'White / Reversed Logo',
    'App Icon',
    'Watermark / Overlay Logo',
    'Favicon',
    'Social Media Logo',
    'Other',
  ]

  const handleFileSelect = (selectedFiles) => {
    const list =
      selectedFiles instanceof FileList
        ? Array.from(selectedFiles)
        : Array.from(selectedFiles || [])
    if (!list.length) return

    const newItems = list.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      category: 'Primary Logo',
      file,
    }))

    if (onFilesAdded) {
      onFilesAdded(newItems)
    }
  }

  const openImportFromDrive = async () => {
    if (typeof window === 'undefined') {
      openFilePicker()
      return
    }

    if (typeof window.showOpenFilePicker === 'function') {
      try {
        const handles = await window.showOpenFilePicker({
          multiple: true,
          types: [
            {
              description: 'Images',
              accept: {
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/gif': ['.gif'],
                'image/webp': ['.webp'],
                'image/svg+xml': ['.svg'],
              },
            },
          ],
        })
        const files = await Promise.all(handles.map((h) => h.getFile()))
        const imageFiles = files.filter((f) => f.type.startsWith('image/'))
        if (imageFiles.length) {
          handleFileSelect(imageFiles)
        }
      } catch (e) {
        if (e?.name !== 'AbortError') {
          openFilePicker()
        }
      }
      return
    }

    openFilePicker()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files
    const imageFiles = Array.from(dropped).filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length) {
      handleFileSelect(imageFiles)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e) => {
    const { files } = e.target
    if (files?.length) {
      handleFileSelect(files)
    }
    e.target.value = ''
  }

  const handleCategoryChange = (rowIndex, category) => {
    if (!onLogosChange) return
    onLogosChange(logos.map((f, i) => (i === rowIndex ? { ...f, category } : f)))
    setOpenDropdowns((prev) => ({ ...prev, [rowIndex]: false }))
  }

  const toggleDropdown = (rowIndex) => {
    setOpenDropdowns((prev) => {
      const isOpen = !!prev[rowIndex]
      if (isOpen) {
        return {}
      }
      return { [rowIndex]: true }
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdowns({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="bg-[#f4f4f5] rounded-xl p-12 relative overflow-hidden min-h-[230px] flex items-center justify-center"
      >
        <div className="absolute -bottom-4 left-0 right-0 text-center">
          <p
            className="text-[90px] font-bold text-[#18181b] opacity-[0.03] italic whitespace-nowrap leading-none mb-0"
            style={{ fontFamily: "'IvyPresto Headline', serif" }}
          >
            LIMITLESS POTENTIAL
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 w-full">
          <div className="w-14 h-14 flex items-center justify-center">
            <Image
              src="/assets/logos/M.logo.svg"
              alt="Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>

          <p className="text-[16px] leading-[24px] text-[#18181b] font-medium">
            Upload or drag and drop files here
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openFilePicker}
              className="bg-[#18181b] text-white flex items-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              aria-label="Choose logo images from your device"
            >
              <CloudUpload className="w-5 h-5" />
              <span className="text-[14px] leading-[20px] font-medium">Click to upload</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openImportFromDrive}
              className="bg-[#18181b] text-white flex items-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              aria-label="Import images from Google Drive folder or device (uses file picker)"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[14px] leading-[20px] font-medium">Import from drive</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {logos.length > 0 && (
        <div className="mt-8 space-y-4">
          {logos.map((file, rowIndex) => (
            <motion.div
              key={rowReactKey(file, rowIndex)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[14px] leading-[20px] font-medium text-[#18181b] truncate">
                  {file.name}
                </span>
                <span className="text-[12px] leading-[16px] text-[#71717a] shrink-0">
                  {formatDisplaySize(file)}
                </span>
              </div>

              <div className="flex-1 h-[8px] bg-[#030213] rounded-full mx-4 min-w-[24px]" />

              <div className="relative dropdown-container">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleDropdown(rowIndex)}
                  className="flex items-center gap-3 px-6 py-3 bg-white border border-[#e4e4e7] rounded-xl hover:bg-[#f4f4f5] transition-colors cursor-pointer min-w-[280px] justify-between"
                >
                  <span className="text-[14px] font-semibold leading-[20px] text-[#18181b]">
                    {file.category || 'Primary Logo'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#71717a] transition-transform duration-300 ${
                      openDropdowns[rowIndex] ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {openDropdowns[rowIndex] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-1 w-full bg-white border border-[#e4e4e7] rounded-xl shadow-[0px_10px_20px_rgba(0,0,0,0.06)] overflow-hidden"
                    >
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategoryChange(rowIndex, category)}
                          className={`w-full text-left px-4 py-2 text-[14px] leading-[20px] hover:bg-[#f4f4f5] transition-colors cursor-pointer ${
                            (file.category || 'Primary Logo') === category
                              ? 'bg-[#f4f4f5] font-medium text-[#18181b]'
                              : 'text-[#18181b]'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
})

LogoUploadZone.displayName = 'LogoUploadZone'

export default LogoUploadZone
