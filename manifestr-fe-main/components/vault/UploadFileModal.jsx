import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload as UploadIcon, FileText, CheckCircle2, ChevronDown, CheckCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/router'
import ToggleSwitch from '../forms/ToggleSwitch'

export default function UploadFileModal({ isOpen, onClose, onUpload }) {
  const router = useRouter()
  const modalRef = useRef(null)
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1) // 1 = Upload/Import, 2 = Review/Confirm
  const [activeTab, setActiveTab] = useState('Upload')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [documentName, setDocumentName] = useState('')
  const [selectedProject, setSelectedProject] = useState('Select project')
  const [selectedFolder, setSelectedFolder] = useState('My Vault')
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [showFolderDropdown, setShowFolderDropdown] = useState(false)
  const [syncToCollab, setSyncToCollab] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [importLink, setImportLink] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const projects = ['Project 1', 'Project 2', 'Project 3']
  const folders = ['My Vault', 'Collabs', 'Archived']

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowProjectDropdown(false)
        setShowFolderDropdown(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setActiveTab('Upload')
      setUploadedFiles([])
      setDocumentName('')
      setSelectedProject('Select project')
      setSelectedFolder('My Vault')
      setSyncToCollab(false)
      setImportLink('')
      setIsUploading(false)
    }
  }, [isOpen])

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files)
    const newFiles = fileArray.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: 'Uploaded',
    }))
    setUploadedFiles([...uploadedFiles, ...newFiles])
    if (newFiles.length > 0 && !documentName) {
      const fileName = newFiles[0].name.replace(/\.[^/.]+$/, '')
      setDocumentName(fileName)
    }
  }

  const handleFileInput = (e) => {
    handleFileSelect(e.target.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleImportSource = (source) => {
    // Simulate importing from source
    const newFile = {
      id: Date.now(),
      name: `imported-from-${source.toLowerCase().replace(' ', '-')}.pdf`,
      size: 0,
      type: 'application/pdf',
      file: null,
      status: 'Uploaded',
    }
    setUploadedFiles([...uploadedFiles, newFile])
    if (!documentName) {
      setDocumentName(`imported-from-${source.toLowerCase().replace(' ', '-')}`)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== fileId))
  }

  const handleReviewAndConfirm = () => {
    // Move to step 2
    setStep(2)
  }

  const handleGoToVault = async () => {
    if (onUpload) {
      try {
        setIsUploading(true)
        await onUpload({
          files: uploadedFiles,
          documentName,
          project: selectedProject,
          folder: selectedFolder,
          syncToCollab,
        })
        onClose()
      } catch (error) {
        // Error is handled by alert in parent, but we stop loading here
      } finally {
        setIsUploading(false)
      }
    } else {
      router.push('/vault')
      onClose()
    }
  }

  const handleUploadMore = () => {
    // Reset to step 1 but keep current files
    setStep(1)
    setActiveTab('Upload')
  }

  // Step 2: Review & Confirm Screen
  if (step === 2) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose()
              }
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] w-full max-w-[510px] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Step 2 Header */}
              <div className="border-b border-[rgba(0,0,0,0.1)] p-6 relative">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00bc7d] shrink-0" />
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[18px] font-semibold leading-[18px] text-neutral-950 tracking-[-0.4395px]">
                      Files Ready to Save
                    </h2>
                    <p className="text-[14px] font-normal leading-[20px] text-[#717182] tracking-[-0.1504px]">
                      Step 2 of 2 — Review and confirm.
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-4 w-4 h-4 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-neutral-950" />
                </motion.button>
              </div>

              {/* Step 2 Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#f4f4f4] rounded-[10px] p-6 space-y-3"
                  >
                    {/* File Info */}
                    <div className="flex gap-3 items-center">
                      <FileText className="w-5 h-5 text-[#18181b] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-normal leading-[24px] text-neutral-950 tracking-[-0.3125px] truncate">
                          {documentName || file.name.replace(/\.[^/.]+$/, '')}
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[#00bc7d] shrink-0" />
                      <p className="text-[16px] font-normal leading-[24px] text-[#00bc7d] tracking-[-0.3125px] shrink-0">
                        Complete
                      </p>
                    </div>

                    {/* File Details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-2 items-center">
                        <p className="text-[16px] font-normal leading-[24px] text-[#717182] tracking-[-0.3125px]">
                          Project:
                        </p>
                        <p className="text-[16px] font-normal leading-[24px] text-[#717182] tracking-[-0.3125px]">
                          {selectedProject === 'Select project' ? 'None' : selectedProject}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <p className="text-[16px] font-normal leading-[24px] text-[#717182] tracking-[-0.3125px]">
                          Saved to:
                        </p>
                        <p className="text-[16px] font-normal leading-[24px] text-[#717182] tracking-[-0.3125px]">
                          {selectedFolder}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Step 2 Footer */}
              <div className="border-t border-[rgba(0,0,0,0.1)] p-6">
                <div className="flex items-center justify-between gap-3">
                  <motion.button
                    onClick={handleUploadMore}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] px-[17px] text-[14px] font-medium leading-[20px] text-neutral-950 tracking-[-0.1504px] hover:bg-[#f4f4f5] transition-colors"
                  >
                    Upload More
                  </motion.button>
                  <motion.button
                    onClick={handleGoToVault}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isUploading}
                    className="bg-[#030213] text-white rounded-[8px] h-[36px] px-4 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Go to Vault'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Step 1: Upload/Import Screen
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-[#e4e4e7] rounded-lg w-full max-w-[620px] max-h-[90vh] overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[#e4e4e7] p-4 relative">
              <div className="flex items-start gap-4 pr-12">
                <UploadIcon className="w-5 h-5 text-[#18181b] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    Upload or Import Files
                  </h2>
                  <p className="text-[12px] font-normal leading-[18px] text-[#71717a]">
                    Step 1 of 2 — Upload or import your documents.
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-3 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5] transition-colors"
              >
                <X className="w-5 h-5 text-[#71717a]" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-6 pb-0">
              <div className="bg-[#f4f4f4] rounded-md p-1 flex gap-0">
                <motion.button
                  onClick={() => setActiveTab('Upload')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-3 py-1.5 rounded-sm text-[14px] font-medium leading-[20px] transition-all ${activeTab === 'Upload'
                      ? 'bg-white text-[#18181b] shadow-sm'
                      : 'bg-transparent text-[#71717a]'
                    }`}
                >
                  Upload
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('Import')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-3 py-1.5 rounded-sm text-[14px] font-medium leading-[20px] transition-all ${activeTab === 'Import'
                      ? 'bg-white text-[#18181b] shadow-sm'
                      : 'bg-transparent text-[#71717a]'
                    }`}
                >
                  Import
                </motion.button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'Upload' ? (
                <>
                  {/* Upload Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative bg-[#f4f4f4] h-[240px] rounded-[10px] flex flex-col items-center justify-center px-[50px] pt-[50px] pb-2 transition-colors ${isDragging ? 'bg-[#e4e4e7]' : ''
                      }`}
                  >
                    {/* Watermark Text */}
                    <p className="absolute font-['Playfair_Display'] italic font-semibold text-[98.087px] leading-[normal] text-black opacity-[0.03] select-none pointer-events-none top-[114px] left-[50px]">
                      VISIONARY
                    </p>

                    <div className="flex flex-col gap-4 items-center relative z-10">
                      <p className="text-[16px] font-normal leading-[24px] text-[#717182] text-center tracking-[-0.3125px]">
                        Click to upload or drag and drop files here
                      </p>
                      <p className="text-[16px] font-normal leading-[24px] text-[#717182] text-center tracking-[-0.3125px] max-w-[362px]">
                        Supports PDF, PPTX, DOCX, XLSX, MP4, PNG (up to 500 MB each)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                        accept=".pdf,.pptx,.docx,.xlsx,.mp4,.png"
                      />
                      <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#030213] text-white rounded-md h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                      >
                        <UploadIcon className="w-4 h-4" />
                        Select Files
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Import Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-normal leading-[24px] text-[#030213] tracking-[-0.3125px]">
                        +
                      </span>
                      <p className="text-[16px] font-normal leading-[24px] text-[#717182] tracking-[-0.3125px]">
                        Import From
                      </p>
                    </div>

                    {/* Import Source Buttons */}
                    <div className="grid grid-cols-3 gap-4">
                      <motion.button
                        onClick={() => handleImportSource('Google Drive')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[80px] flex items-center justify-center text-[14px] font-medium leading-[20px] text-neutral-950 tracking-[-0.1504px] hover:bg-[#f4f4f5] transition-colors"
                      >
                        Google Drive
                      </motion.button>
                      <motion.button
                        onClick={() => handleImportSource('Dropbox')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[80px] flex items-center justify-center text-[14px] font-medium leading-[20px] text-neutral-950 tracking-[-0.1504px] hover:bg-[#f4f4f5] transition-colors"
                      >
                        Dropbox
                      </motion.button>
                      <motion.button
                        onClick={() => handleImportSource('Other Source')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[80px] flex items-center justify-center text-[14px] font-medium leading-[20px] text-neutral-950 tracking-[-0.1504px] hover:bg-[#f4f4f5] transition-colors"
                      >
                        Other Source
                      </motion.button>
                    </div>

                    {/* Import Link Input */}
                    <div className="bg-[#f4f4f4] border border-transparent rounded-[8px] h-[36px] px-3 flex items-center">
                      <input
                        type="text"
                        value={importLink}
                        onChange={(e) => setImportLink(e.target.value)}
                        placeholder="Search or paste external link..."
                        className="w-full bg-transparent outline-none text-[14px] font-normal leading-[normal] text-[#717182] tracking-[-0.1504px] placeholder:text-[#717182]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* File Card */}
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#f4f4f4] rounded-[10px] p-6 space-y-4"
                >
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="space-y-4">
                      {/* File Info */}
                      <div className="flex gap-4 items-start">
                        <div className="bg-white rounded-[4px] w-10 h-10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#18181b]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-[16px] font-normal leading-[24px] text-neutral-950 tracking-[-0.3125px] truncate">
                              {file.name}
                            </p>
                            <CheckCircle2 className="w-4 h-4 text-[#00bc7d] shrink-0" />
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-[16px] font-normal leading-[24px] text-[#717182] tracking-[-0.3125px]">
                              {formatFileSize(file.size)}
                            </p>
                            <span className="text-[16px] font-normal leading-[24px] text-[#717182] tracking-[-0.3125px]">
                              •
                            </span>
                            <p className="text-[16px] font-normal leading-[24px] text-[#00bc7d] tracking-[-0.3125px]">
                              {file.status}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleRemoveFile(file.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/50 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        {/* Document Name */}
                        <div className="space-y-2">
                          <label className="text-[14px] font-medium leading-[14px] text-neutral-950 tracking-[-0.1504px]">
                            Document Name
                          </label>
                          <input
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            className="w-full h-[36px] px-3 bg-white border border-transparent rounded-md text-[14px] font-normal leading-[normal] text-[#717182] tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
                            placeholder="Enter document name"
                          />
                        </div>

                        {/* Add to Project & Destination Folder */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Add to Project */}
                          <div className="space-y-2">
                            <label className="text-[14px] font-medium leading-[14px] text-neutral-950 tracking-[-0.1504px]">
                              Add to Project
                            </label>
                            <div className="relative">
                              <motion.button
                                onClick={() => {
                                  setShowProjectDropdown(!showProjectDropdown)
                                  setShowFolderDropdown(false)
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-white border border-transparent rounded-md px-[13px] py-1 h-[36px] flex items-center justify-between hover:border-[#e4e4e7] transition-colors"
                              >
                                <span className="text-[14px] font-normal leading-[20px] text-[#717182] tracking-[-0.1504px]">
                                  {selectedProject}
                                </span>
                                <ChevronDown className="w-4 h-4 text-[#71717a]" />
                              </motion.button>
                              <AnimatePresence>
                                {showProjectDropdown && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                                  >
                                    {projects.map((project) => (
                                      <motion.button
                                        key={project}
                                        onClick={() => {
                                          setSelectedProject(project)
                                          setShowProjectDropdown(false)
                                        }}
                                        whileHover={{ backgroundColor: '#f4f4f5' }}
                                        className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                      >
                                        {project}
                                      </motion.button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Destination Folder */}
                          <div className="space-y-2">
                            <label className="text-[14px] font-medium leading-[14px] text-neutral-950 tracking-[-0.1504px]">
                              Destination Folder
                            </label>
                            <div className="relative">
                              <motion.button
                                onClick={() => {
                                  setShowFolderDropdown(!showFolderDropdown)
                                  setShowProjectDropdown(false)
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-white border border-transparent rounded-md px-[13px] py-1 h-[36px] flex items-center justify-between hover:border-[#e4e4e7] transition-colors"
                              >
                                <span className="text-[14px] font-normal leading-[20px] text-neutral-950 tracking-[-0.1504px]">
                                  {selectedFolder}
                                </span>
                                <ChevronDown className="w-4 h-4 text-[#71717a]" />
                              </motion.button>
                              <AnimatePresence>
                                {showFolderDropdown && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                                  >
                                    {folders.map((folder) => (
                                      <motion.button
                                        key={folder}
                                        onClick={() => {
                                          setSelectedFolder(folder)
                                          setShowFolderDropdown(false)
                                        }}
                                        whileHover={{ backgroundColor: '#f4f4f5' }}
                                        className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                      >
                                        {folder}
                                      </motion.button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        {/* Sync Checkbox */}
                        <ToggleSwitch
                          checked={syncToCollab}
                          onChange={(checked) => setSyncToCollab(checked)}
                          label="Sync this file to a Collab Hub project"
                          labelPosition="right"
                          className="text-[14px]"
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#e4e4e7] p-4">
              <div className="flex items-center justify-end gap-3">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleReviewAndConfirm}
                  disabled={uploadedFiles.length === 0}
                  whileHover={{ scale: uploadedFiles.length > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: uploadedFiles.length > 0 ? 0.98 : 1 }}
                  className={`rounded-md h-[40px] px-4 text-[14px] font-medium leading-[20px] transition-opacity ${uploadedFiles.length > 0
                      ? 'bg-[#18181b] text-white hover:opacity-90'
                      : 'bg-[#e4e4e7] text-[#71717a] cursor-not-allowed'
                    }`}
                >
                  Review & Confirm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
