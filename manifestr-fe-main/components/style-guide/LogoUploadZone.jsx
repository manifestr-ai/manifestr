import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudUpload, Plus, ChevronDown } from 'lucide-react'
import Image from 'next/image'

export default function LogoUploadZone({ onFilesChange }) {
  const [files, setFiles] = useState([
    { id: 1, name: 'Primary_Logo', size: '139 KB', category: 'Primary Logo' },
    { id: 2, name: 'Horizontal_Lockup', size: '226 KB', category: 'Secondary / Horizontal Lockup' },
    { id: 3, name: 'Logo_White', size: '115 KB', category: 'White / Reversed Logo' },
    { id: 4, name: 'App_Icon', size: '94 KB', category: 'App Icon' },
    { id: 5, name: 'Watermark_Overlay', size: '65 KB', category: 'Watermark / Overlay Logo' },
  ])
  const [openDropdowns, setOpenDropdowns] = useState({})
  const fileInputRef = useRef(null)

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
    const newFiles = Array.from(selectedFiles).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      category: 'Primary Logo',
      file,
    }))
    setFiles((prev) => [...prev, ...newFiles])
    if (onFilesChange) {
      onFilesChange([...files, ...newFiles])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files)
  }

  const handleCategoryChange = (fileId, category) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, category } : f))
    )
    setOpenDropdowns((prev) => ({ ...prev, [fileId]: false }))
  }

  const toggleDropdown = (fileId) => {
    setOpenDropdowns((prev) => {
      const isOpen = !!prev[fileId]
      if (isOpen) {
        return {}
      }
      return { [fileId]: true }
    })
  }

  // Close dropdowns when clicking outside
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
      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="bg-[#f4f4f5] rounded-xl p-12 relative overflow-hidden min-h-[230px] flex items-center justify-center"
      >
        {/* Background Watermark */}
        <div className="absolute -bottom-4 left-0 right-0 text-center">
          <p
            className="text-[90px] font-bold text-[#18181b] opacity-[0.03] italic whitespace-nowrap leading-none mb-0"
            style={{ fontFamily: "'IvyPresto Headline', serif" }}
          >
            LIMITLESS POTENTIAL
          </p>
        </div>

        {/* Upload Content */}
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

          {/* Instruction Text */}
          <p className="text-[16px] leading-[24px] text-[#18181b] font-medium">
            Upload or drag and drop files here
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#18181b] text-white flex items-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <CloudUpload className="w-5 h-5" />
              <span className="text-[14px] leading-[20px] font-medium">
                Click to upload
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#18181b] text-white flex items-center gap-2 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[14px] leading-[20px] font-medium">
                Import from drive
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between py-4"
            >
              {/* File Info */}
               <div className="flex items-center gap-3">
                <span className="text-[14px] leading-[20px] font-medium text-[#18181b]">
                  {file.name}
                </span>
                <span className="text-[12px] leading-[16px] text-[#71717a]">
                  {file.size}
                </span>
              </div>

              {/* Separator Line */}
              <div className="flex-1 h-[8px] bg-[#030213] rounded-full mx-4" />

              {/* Category Dropdown */}
              <div className="relative dropdown-container">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleDropdown(file.id)}
                  className="flex items-center gap-3 px-6 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl hover:bg-[#f1f5f9] transition-colors cursor-pointer min-w-[280px] justify-between shadow-sm"
                >
                  <span className="text-[14px] font-medium leading-[20px] text-[#1e293b]">
                    {file.category}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#94a3b8] transition-transform duration-300 ${openDropdowns[file.id] ? 'rotate-180' : ''
                      }`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {openDropdowns[file.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-1 w-full bg-white border border-[#e4e4e7] rounded-lg shadow-lg overflow-hidden"
                    >
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(file.id, category)}
                          className={`w-full text-left px-4 py-2 text-[14px] leading-[20px] hover:bg-[#f4f4f5] transition-colors cursor-pointer ${file.category === category
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
}

