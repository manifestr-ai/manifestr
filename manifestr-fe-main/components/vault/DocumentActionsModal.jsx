import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Download, Folder, Copy, Check, ChevronDown, Users, FileText, Shield, Plus, Pin, Archive, Trash2 } from 'lucide-react'
import ToggleSwitch from '../forms/ToggleSwitch'
import api from '../../lib/api'

export default function DocumentActionsModal({ isOpen, onClose, document, onUpdate }) {
  const modalRef = useRef(null)
  const [primaryTab, setPrimaryTab] = useState('Share') // Share, Export, Save & Organize, Manage
  const [shareSubTab, setShareSubTab] = useState('Share Link') // Share Link, Invite & Review, Manage Access
  const [linkExpiry, setLinkExpiry] = useState('7 days')
  const [defaultRole, setDefaultRole] = useState('Viewer')
  const [allowComments, setAllowComments] = useState(false)
  const [allowDownloads, setAllowDownloads] = useState(false)
  const [requireAuth, setRequireAuth] = useState(true)
  const [passwordProtect, setPasswordProtect] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [sendForReview, setSendForReview] = useState(false)
  const [personalMessage, setPersonalMessage] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('PDF')
  const [includeComments, setIncludeComments] = useState(false)
  const [addWatermark, setAddWatermark] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('Marketing Pitch 2025 - Q4 Strategy')
  const [notes, setNotes] = useState('')
  const [saveLocation, setSaveLocation] = useState('Vault Root')
  const [versionControl, setVersionControl] = useState('new-version')
  const [tags, setTags] = useState(['Strategy', 'Executive', 'PitchDeck'])
  const [tagInput, setTagInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [showLinkExpiryDropdown, setShowLinkExpiryDropdown] = useState(false)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showBulkActionsDropdown, setShowBulkActionsDropdown] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const linkExpiryOptions = ['7 days', '30 days', '90 days', 'Never']
  const roleOptions = ['Viewer', 'Editor', 'Admin', 'Owner']
  const locationOptions = ['Vault Root', 'Collabs', 'Projects', 'Archived']
  const bulkActionsOptions = ['Change Role', 'Remove Access', 'Export List']

  // Sample team members data
  const internalMembers = [
    { name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Can edit', avatar: 'SC' },
    { name: 'Michael Roberts', email: 'michael.r@company.com', role: 'Can view', avatar: 'MR' },
  ]

  const externalCollaborators = [
    { name: 'Jessica Wong', email: 'jessica@partner.com', role: 'Can view', avatar: 'JW', expires: '11/23/25' },
    { name: 'David Kim', email: 'david@client.com', role: 'Can view', avatar: 'DK', expires: '12/01/25', status: 'Pending' },
  ]

  const formatOptions = [
    { id: 'pdf', name: 'PDF', description: 'Best for sharing', icon: '📄' },
    { id: 'powerpoint', name: 'PowerPoint', description: 'Editable slides', icon: '📊' },
    { id: 'word', name: 'Word', description: 'Editable document', icon: '📝' },
    { id: 'google-docs', name: 'Google Docs', description: 'Cloud format', icon: '☁️' },
    { id: 'html', name: 'HTML', description: 'Web version', icon: '🌐' },
    { id: 'notion', name: 'Notion', description: 'Export to Notion', icon: '📋' },
    { id: 'csv', name: 'CSV', description: 'Data export', icon: '📈' },
    { id: 'print', name: 'Print', description: 'High quality', icon: '🖨️' },
  ]

  const suggestedTags = ['Q4', '2025', 'Client', 'Internal', 'Draft', 'Final']

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLinkExpiryDropdown(false)
        setShowRoleDropdown(false)
        setShowLocationDropdown(false)
        setShowBulkActionsDropdown(false)
      }
    }

    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside)
      return () => window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setPrimaryTab('Share')
      setShareSubTab('Share Link')
      setCopied(false)
    }
  }, [isOpen])

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://manifestr.app/share/abc123def')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddTag = () => {
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddEmail = () => {
    if (emailInput.trim()) {
      // Handle adding email
      setEmailInput('')
    }
  }

  // Handle Pin/Unpin
  const handleTogglePin = async () => {
    if (!document?.id) return
    setIsProcessing(true)
    try {
      if (document.isPinned) {
        await api.delete(`/ai/pin/${document.id}`)
        console.log(`📌 Unpinned: ${document.title}`)
        showToast('Document unpinned successfully', 'success')
      } else {
        const response = await api.post(`/ai/pin/${document.id}`)
        if (response.data.status === 'error') {
          showToast(response.data.message, 'error')
          setIsProcessing(false)
          return
        }
        console.log(`📌 Pinned: ${document.title}`)
        showToast('Document pinned successfully', 'success')
      }

      // Notify parent to update the document
      if (onUpdate) {
        onUpdate({ ...document, isPinned: !document.isPinned })
      }

      onClose()
    } catch (err) {
      console.error('Failed to toggle pin:', err)
      showToast(err.response?.data?.message || 'Failed to pin/unpin document', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Archive/Unarchive
  const handleArchive = async () => {
    if (!document?.id) return
    setIsProcessing(true)
    
    const isCurrentlyArchived = document?.isArchived
    
    try {
      if (isCurrentlyArchived) {
        // Unarchive
        await api.post(`/ai/unarchive/${document.id}`)
        console.log(`📤 Unarchived: ${document.title}`)
        showToast('Document unarchived successfully!', 'success')
        
        if (onUpdate) {
          onUpdate({ ...document, isArchived: false })
        }
      } else {
        // Archive
        await api.post(`/ai/archive/${document.id}`)
        console.log(`📦 Archived: ${document.title}`)
        showToast('Document archived successfully!', 'success')
        
        if (onUpdate) {
          onUpdate({ ...document, isArchived: true })
        }
      }
      
      onClose()
    } catch (err) {
      console.error('Failed to archive/unarchive:', err)
      showToast(err.response?.data?.message || `Failed to ${isCurrentlyArchived ? 'unarchive' : 'archive'} document`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Delete (SOFT DELETE)
  const handleDelete = async () => {
    if (!document?.id) return
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsProcessing(true)
    try {
      await api.delete(`/ai/generation/${document.id}`)
      console.log(`🗑️ Soft deleted: ${document.title}`)

      // Notify parent to remove the document
      if (onUpdate) {
        onUpdate(null, 'delete') // Signal deletion
      }

      showToast('Document deleted successfully!', 'success')
      onClose()
    } catch (err) {
      console.error('Failed to delete:', err)
      showToast(err.response?.data?.message || 'Failed to delete document', 'error')
    } finally {
      setIsProcessing(false)
      setShowDeleteConfirm(false)
    }
  }

  const shareLink = 'https://manifestr.app/share/abc123def'

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
            className="bg-white rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] w-full max-w-[510px] max-h-[90vh] overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-0 relative">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-6 top-6 w-5 h-5 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[#4f5857]" />
              </motion.button>

              <div className="flex flex-col gap-3 items-center text-center mb-5">
                <h2 className="font-['HK_Grotesk'] font-semibold text-[30px] leading-[1.2] text-zinc-900 tracking-[-0.6px]">
                  Document Actions
                </h2>
                <p className="font-['Inter'] font-normal text-[16px] leading-[1.5] text-zinc-500 tracking-[-0.16px]">
                  Share, export, or save your document
                </p>
              </div>

              {/* Primary Tabs */}
              <div className="bg-gray-200 rounded-[18px] p-[3.5px] grid grid-cols-4 gap-0 mb-5">
                <motion.button
                  onClick={() => setPrimaryTab('Share')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === 'Share'
                    ? 'bg-white text-zinc-900'
                    : 'bg-transparent text-zinc-900'
                    }`}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
                <motion.button
                  onClick={() => setPrimaryTab('Export')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === 'Export'
                    ? 'bg-white text-zinc-900'
                    : 'bg-transparent text-zinc-900'
                    }`}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
                <motion.button
                  onClick={() => setPrimaryTab('Save & Organize')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === 'Save & Organize'
                    ? 'bg-white text-zinc-900'
                    : 'bg-transparent text-zinc-900'
                    }`}
                >
                  <Folder className="w-4 h-4" />
                  Save
                </motion.button>
                <motion.button
                  onClick={() => setPrimaryTab('Manage')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === 'Manage'
                    ? 'bg-white text-zinc-900'
                    : 'bg-transparent text-zinc-900'
                    }`}
                >
                  <Shield className="w-4 h-4" />
                  Manage
                </motion.button>
              </div>

              {/* Secondary Tabs (for Share) */}
              {primaryTab === 'Share' && (
                <div className="bg-gray-200 rounded-[18px] p-[3.5px] grid grid-cols-3 gap-0 mb-6">
                  <motion.button
                    onClick={() => setShareSubTab('Share Link')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-[29px] rounded-[18px] flex items-center justify-center text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${shareSubTab === 'Share Link'
                      ? 'bg-white text-zinc-900'
                      : 'bg-transparent text-zinc-900'
                      }`}
                  >
                    Share Link
                  </motion.button>
                  <motion.button
                    onClick={() => setShareSubTab('Invite & Review')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-[29px] rounded-[18px] flex items-center justify-center text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${shareSubTab === 'Invite & Review'
                      ? 'bg-white text-zinc-900'
                      : 'bg-transparent text-zinc-900'
                      }`}
                  >
                    Invite & Review
                  </motion.button>
                  <motion.button
                    onClick={() => setShareSubTab('Manage Access')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-[29px] rounded-[18px] flex items-center justify-center text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${shareSubTab === 'Manage Access'
                      ? 'bg-white text-zinc-900'
                      : 'bg-transparent text-zinc-900'
                      }`}
                  >
                    Manage Access
                  </motion.button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Share Link Tab */}
              {primaryTab === 'Share' && shareSubTab === 'Share Link' && (
                <div className="space-y-6">
                  {/* Share Link Input */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                      Share link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 h-[36px] px-3 bg-white border border-transparent rounded-[12px] text-[14px] font-normal leading-[20px] text-[#0a0e1a] tracking-[-0.1504px]"
                      />
                      <motion.button
                        onClick={handleCopyLink}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#f8f9fb] border border-[rgba(15,23,42,0.06)] rounded-[6px] w-9 h-9 flex items-center justify-center"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-zinc-900" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Link Expiry & Default Role */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Link expiry
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowLinkExpiryDropdown(!showLinkExpiryDropdown)
                            setShowRoleDropdown(false)
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {linkExpiry}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showLinkExpiryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {linkExpiryOptions.map((option) => (
                                <motion.button
                                  key={option}
                                  onClick={() => {
                                    setLinkExpiry(option)
                                    setShowLinkExpiryDropdown(false)
                                  }}
                                  whileHover={{ backgroundColor: '#f4f4f5' }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {option}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Default role
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowRoleDropdown(!showRoleDropdown)
                            setShowLinkExpiryDropdown(false)
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {defaultRole}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showRoleDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {roleOptions.map((role) => (
                                <motion.button
                                  key={role}
                                  onClick={() => {
                                    setDefaultRole(role)
                                    setShowRoleDropdown(false)
                                  }}
                                  whileHover={{ backgroundColor: '#f4f4f5' }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {role}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Allowances */}
                  <div className="space-y-3">
                    <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                      Allowances
                    </label>
                    <div className="space-y-3">
                      <ToggleSwitch
                        checked={allowComments}
                        onChange={(checked) => setAllowComments(checked)}
                        label="Allow comments"
                        labelPosition="right"
                      />
                      <ToggleSwitch
                        checked={allowDownloads}
                        onChange={(checked) => setAllowDownloads(checked)}
                        label="Allow downloads"
                        labelPosition="right"
                      />
                      <ToggleSwitch
                        checked={requireAuth}
                        onChange={(checked) => setRequireAuth(checked)}
                        label="Require authentication"
                        labelPosition="right"
                      />
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={passwordProtect}
                          onChange={(checked) => setPasswordProtect(checked)}
                        />
                        <label className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                          Password protect{' '}
                          <span className="text-zinc-500">(optional future enhancement)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-gray-200 border border-slate-200 rounded-[12px] p-4 flex gap-2 items-center">
                    <Shield className="w-5 h-5 text-zinc-900" />
                    <p className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Secure sharing with enterprise-grade encryption.
                    </p>
                  </div>
                </div>
              )}

              {/* Invite & Review Tab */}
              {primaryTab === 'Share' && shareSubTab === 'Invite & Review' && (
                <div className="space-y-6">
                  {/* Add Users */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                        Add users
                      </label>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-[32px] px-3 rounded-[12px] flex items-center gap-2 text-[14px] font-medium leading-[20px] text-zinc-900 tracking-[-0.1504px] hover:bg-gray-100"
                      >
                        <Users className="w-4 h-4" />
                        Add from Team
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="email@domain.com"
                        className="flex-1 h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] font-normal leading-[normal] text-zinc-500 tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
                      />
                      <motion.button
                        onClick={handleAddEmail}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-zinc-900 text-white rounded-[6px] h-[36px] px-4 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] hover:opacity-90"
                      >
                        Add
                      </motion.button>
                    </div>
                  </div>

                  {/* Link Expiry & Default Role */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Link expiry
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowLinkExpiryDropdown(!showLinkExpiryDropdown)
                            setShowRoleDropdown(false)
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {linkExpiry}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showLinkExpiryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {linkExpiryOptions.map((option) => (
                                <motion.button
                                  key={option}
                                  onClick={() => {
                                    setLinkExpiry(option)
                                    setShowLinkExpiryDropdown(false)
                                  }}
                                  whileHover={{ backgroundColor: '#f4f4f5' }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {option}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Default role
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowRoleDropdown(!showRoleDropdown)
                            setShowLinkExpiryDropdown(false)
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {defaultRole}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showRoleDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {roleOptions.map((role) => (
                                <motion.button
                                  key={role}
                                  onClick={() => {
                                    setDefaultRole(role)
                                    setShowRoleDropdown(false)
                                  }}
                                  whileHover={{ backgroundColor: '#f4f4f5' }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {role}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                      Options
                    </label>
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={sendForReview}
                        onChange={(checked) => setSendForReview(checked)}
                      />
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-900" />
                        <label className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                          Send for review
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                      Personal message (optional)
                    </label>
                    <textarea
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Add a message to your invitation..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[16px] font-normal leading-[24px] text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] resize-none"
                    />
                  </div>

                  {/* Note */}
                  <div className="bg-gray-200 rounded-[12px] p-4">
                    <p className="text-[14px] leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                      <span className="font-bold">Note:</span> Team selection triggers user avatar & role fetch. Non-team emails prompt: "Invite this user to your workspace?"
                    </p>
                  </div>
                </div>
              )}

              {/* Manage Access Tab */}
              {primaryTab === 'Share' && shareSubTab === 'Manage Access' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Team Members
                    </h3>
                    <div className="relative">
                      <motion.button
                        onClick={() => {
                          setShowBulkActionsDropdown(!showBulkActionsDropdown)
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] w-[216px] flex items-center justify-between"
                      >
                        <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                          Bulk Actions
                        </span>
                        <ChevronDown className="w-4 h-4 text-[#71717a]" />
                      </motion.button>
                      <AnimatePresence>
                        {showBulkActionsDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden min-w-[216px]"
                          >
                            {bulkActionsOptions.map((action) => (
                              <motion.button
                                key={action}
                                onClick={() => {
                                  setShowBulkActionsDropdown(false)
                                }}
                                whileHover={{ backgroundColor: '#f4f4f5' }}
                                className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                              >
                                {action}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Internal Members */}
                  <div className="space-y-4">
                    <h4 className="text-[14px] font-medium leading-[24px] text-zinc-900">
                      Internal Members
                    </h4>
                    <div className="space-y-3">
                      {internalMembers.map((member, index) => (
                        <div
                          key={index}
                          className="bg-zinc-100 rounded-[12px] p-3 flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                            <span className="text-[16px] font-normal leading-[24px] text-white tracking-[-0.3125px]">
                              {member.avatar}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px] truncate">
                              {member.name}
                            </p>
                            <p className="text-[16px] font-normal leading-[24px] text-zinc-500 tracking-[-0.3125px] truncate">
                              {member.email}
                            </p>
                          </div>
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className="bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] w-[115px] flex items-center justify-between"
                            >
                              <span className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                                {member.role}
                              </span>
                              <ChevronDown className="w-4 h-4 text-[#71717a]" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[rgba(15,23,42,0.06)]" />

                  {/* External Collaborators */}
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      External Collaborators
                    </h4>
                    <div className="space-y-3">
                      {externalCollaborators.map((member, index) => (
                        <div
                          key={index}
                          className="bg-zinc-100 rounded-[12px] p-3 flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                            <span className="text-[16px] font-normal leading-[24px] text-white tracking-[-0.3125px]">
                              {member.avatar}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-normal leading-[24px] text-[#0f172b] tracking-[-0.3125px] truncate">
                              {member.name}
                            </p>
                            <p className="text-[16px] font-normal leading-[24px] text-zinc-500 tracking-[-0.3125px] truncate">
                              {member.email}
                            </p>
                            {member.expires && (
                              <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                                Expires {member.expires}
                              </p>
                            )}
                          </div>
                          {member.status && (
                            <div className="bg-black rounded-[12px] px-2 py-1">
                              <span className="text-[12px] font-medium leading-[16px] text-white">
                                {member.status}
                              </span>
                            </div>
                          )}
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className="bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] w-[115px] flex items-center justify-between"
                            >
                              <span className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                                {member.role}
                              </span>
                              <ChevronDown className="w-4 h-4 text-[#71717a]" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-gray-200 border border-slate-200 rounded-[12px] p-4 flex gap-2 items-center">
                    <Shield className="w-5 h-5 text-zinc-900" />
                    <p className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Secure sharing with enterprise-grade encryption.
                    </p>
                  </div>
                </div>
              )}

              {/* Export Tab */}
              {primaryTab === 'Export' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-1">
                    <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Export Document
                    </h3>
                    <p className="text-[14px] font-normal leading-[20px] text-[#62748e] tracking-[-0.1504px]">
                      Download your document in your preferred format
                    </p>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Select format
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {formatOptions.map((format) => (
                        <motion.button
                          key={format.id}
                          onClick={() => setSelectedFormat(format.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-[12px] border-2 flex flex-col items-center gap-2 ${selectedFormat === format.id
                            ? 'bg-zinc-900 border-[#0f172b] text-white'
                            : 'bg-white border-gray-200 text-zinc-900'
                            }`}
                        >
                          <span className="text-2xl">{format.icon}</span>
                          <div className="text-center">
                            <p
                              className={`text-[12px] font-normal leading-[16px] ${selectedFormat === format.id ? 'text-white' : 'text-zinc-900'
                                }`}
                            >
                              {format.name}
                            </p>
                            <p
                              className={`text-[12px] font-normal leading-[16px] ${selectedFormat === format.id ? 'text-[#cad5e2]' : 'text-[#62748e]'
                                }`}
                            >
                              {format.description}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-medium leading-[24px] text-[#0f172b] tracking-[-0.3125px]">
                      Options
                    </h4>
                    <div className="bg-zinc-100 rounded-[12px] p-4 space-y-3">
                      <ToggleSwitch
                        checked={includeComments}
                        onChange={(checked) => setIncludeComments(checked)}
                        label="Include comments and annotations"
                        labelPosition="right"
                      />
                      <ToggleSwitch
                        checked={addWatermark}
                        onChange={(checked) => setAddWatermark(checked)}
                        label="Add watermark (Draft)"
                        labelPosition="right"
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div className="bg-gray-200 rounded-[12px] p-4">
                    <p className="text-[14px] leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                      <span className="font-bold">Note:</span> Exported files are downloaded directly to your device. Use "Save to Vault" to store documents in your workspace.
                    </p>
                  </div>
                </div>
              )}

              {/* Save & Organize Tab */}
              {primaryTab === 'Save & Organize' && (
                <div className="space-y-6">
                  {/* Auto-saved Info */}
                  <div className="bg-gray-200 border border-slate-200 rounded-[14px] p-4 flex gap-3 items-start">
                    <Check className="w-5 h-5 text-zinc-900 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[14px] font-bold leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                        Auto-saved:
                      </p>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                        Documents are automatically saved. Use this to organize into folders, collab spaces, or projects.
                      </p>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Document Information
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                        Update title and add notes
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Document title
                      </label>
                      <input
                        type="text"
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                        className="w-full h-[36px] px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[16px] font-normal leading-[24px] text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add internal notes about this document..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[16px] font-normal leading-[24px] text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] resize-none"
                      />
                    </div>
                  </div>

                  {/* Save Location */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Save Location
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                        Choose vault folder, collab space, or project
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Location
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowLocationDropdown(!showLocationDropdown)
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {saveLocation}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showLocationDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {locationOptions.map((location) => (
                                <motion.button
                                  key={location}
                                  onClick={() => {
                                    setSaveLocation(location)
                                    setShowLocationDropdown(false)
                                  }}
                                  whileHover={{ backgroundColor: '#f4f4f5' }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {location}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="bg-zinc-100 rounded-[6px] p-3 flex gap-2 items-center">
                        <span className="text-[14px] font-medium leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                          Path:
                        </span>
                        <span className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                          {saveLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Version Control */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Version Control
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-[#62748e] tracking-[-0.1504px]">
                        Choose how to handle existing files
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="versionControl"
                          value="new-version"
                          checked={versionControl === 'new-version'}
                          onChange={(e) => setVersionControl(e.target.value)}
                          className="w-4 h-4"
                        />
                        <label className="text-[16px] font-normal leading-[24px] text-[#0a0e1a] tracking-[-0.3125px]">
                          Save as new version (v2.1)
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="versionControl"
                          value="replace"
                          checked={versionControl === 'replace'}
                          onChange={(e) => setVersionControl(e.target.value)}
                          className="w-4 h-4"
                        />
                        <label className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                          Replace existing file
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tags & Organization */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Tags & Organization
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                        Add tags to help find this document
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTag()
                          }
                        }}
                        placeholder="Add tag (e.g., Strategy, Q4)"
                        className="flex-1 h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] font-normal leading-[normal] text-zinc-500 tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
                      />
                      <motion.button
                        onClick={handleAddTag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#f8f9fb] border border-[rgba(15,23,42,0.06)] rounded-[12px] w-[42px] h-[36px] flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-zinc-900" />
                      </motion.button>
                    </div>

                    {/* Active Tags */}
                    {tags.length > 0 && (
                      <div className="bg-slate-50 rounded-[14px] p-3 flex flex-wrap gap-2 min-h-[46px]">
                        {tags.map((tag, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-zinc-900 rounded-[12px] px-2 py-1 flex items-center gap-1.5 h-[22px]"
                          >
                            <span className="text-[12px] font-medium leading-[16px] text-white">
                              #{tag}
                            </span>
                            <motion.button
                              onClick={() => handleRemoveTag(tag)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-4 h-4 flex items-center justify-center"
                            >
                              <X className="w-3 h-3 text-white" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Tags */}
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            if (!tags.includes(tag)) {
                              setTags([...tags, tag])
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="border border-[rgba(15,23,42,0.06)] rounded-[12px] px-2 py-1 h-[22px] flex items-center"
                        >
                          <span className="text-[12px] font-medium leading-[16px] text-[#0a0e1a]">
                            #{tag}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Manage Tab */}
              {primaryTab === 'Manage' && (
                <div className="space-y-6">
                  {/* Info Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-[14px] p-4 flex gap-3 items-start">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[14px] font-bold leading-[20px] text-blue-900 tracking-[-0.1504px]">
                        Document Management
                      </p>
                      <p className="text-[14px] font-normal leading-[20px] text-blue-700 tracking-[-0.1504px]">
                        Pin for quick access, archive to hide from main vault, or permanently delete this document.
                      </p>
                    </div>
                  </div>

                  {/* Document Info */}
                  <div className="bg-gray-50 rounded-[12px] p-4">
                    <h4 className="text-[14px] font-semibold leading-[20px] text-zinc-900 mb-2">
                      {document?.title || 'Untitled Document'}
                    </h4>
                    <p className="text-[13px] leading-[18px] text-zinc-600">
                      {document?.project || 'Document'}
                    </p>
                  </div>

                  {/* Action Cards */}
                  <div className="space-y-3">
                    {/* Pin Document */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-white border border-gray-200 rounded-[12px] p-4 cursor-pointer hover:border-blue-400 transition-all"
                      onClick={handleTogglePin}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${document?.isPinned ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                          <Pin className={`w-5 h-5 ${document?.isPinned ? 'text-blue-600 fill-blue-600' : 'text-gray-600'
                            }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[16px] font-semibold leading-[24px] text-zinc-900 mb-1">
                            {document?.isPinned ? 'Unpin Document' : 'Pin Document'}
                          </h4>
                          <p className="text-[14px] leading-[20px] text-zinc-600">
                            {document?.isPinned
                              ? 'Remove from pinned documents'
                              : 'Pin to top of vault for quick access (max 10 pins)'}
                          </p>
                        </div>
                        {document?.isPinned && (
                          <div className="px-2 py-1 bg-blue-100 rounded-md">
                            <span className="text-[12px] font-medium text-blue-700">Pinned</span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Archive/Unarchive Document */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`bg-white border border-gray-200 rounded-[12px] p-4 cursor-pointer transition-all ${
                        document?.isArchived 
                          ? 'hover:border-green-400' 
                          : 'hover:border-yellow-400'
                      }`}
                      onClick={handleArchive}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          document?.isArchived ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          <Archive className={`w-5 h-5 ${
                            document?.isArchived ? 'text-green-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[16px] font-semibold leading-[24px] text-zinc-900 mb-1">
                            {document?.isArchived ? 'Unarchive Document' : 'Archive Document'}
                          </h4>
                          <p className="text-[14px] leading-[20px] text-zinc-600">
                            {document?.isArchived
                              ? 'Restore this document back to the main vault.'
                              : 'Hide from main vault but keep accessible in archived section. Can be restored anytime.'}
                          </p>
                        </div>
                        {document?.isArchived && (
                          <div className="px-2 py-1 bg-yellow-100 rounded-md">
                            <span className="text-[12px] font-medium text-yellow-700">Archived</span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Delete Document */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`bg-white border rounded-[12px] p-4 cursor-pointer transition-all ${showDeleteConfirm
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-400'
                        }`}
                      onClick={handleDelete}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${showDeleteConfirm ? 'bg-red-200' : 'bg-red-100'
                          }`}>
                          <Trash2 className={`w-5 h-5 ${showDeleteConfirm ? 'text-red-700' : 'text-red-600'
                            }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-[16px] font-semibold leading-[24px] mb-1 ${showDeleteConfirm ? 'text-red-700' : 'text-zinc-900'
                            }`}>
                            {showDeleteConfirm ? 'Click Again to Confirm Delete' : 'Delete Document'}
                          </h4>
                          <p className={`text-[14px] leading-[20px] ${showDeleteConfirm ? 'text-red-600 font-medium' : 'text-zinc-600'
                            }`}>
                            {showDeleteConfirm
                              ? 'This action cannot be undone! All data will be permanently deleted.'
                              : 'Permanently delete this document. This action cannot be undone.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Warning */}
                  {!showDeleteConfirm && (
                    <div className="bg-red-50 border border-red-200 rounded-[12px] p-4">
                      <p className="text-[13px] leading-[18px] text-red-700">
                        <span className="font-bold">Warning:</span> Deleting a document is permanent and cannot be undone. Consider archiving instead if you may need it later.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#e4e4e7] p-6 flex items-center justify-end gap-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-[#e4e4e7] rounded-[6px] h-[40px] px-4 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
              >
                Cancel
              </motion.button>
              {primaryTab !== 'Manage' && (
                <motion.button
                  onClick={() => {
                    // Handle action based on current tab
                    onClose()
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#18181b] text-white rounded-[6px] h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                >
                  {primaryTab === 'Share' && shareSubTab === 'Share Link' && 'Share'}
                  {primaryTab === 'Share' && shareSubTab === 'Invite & Review' && 'Send Invite'}
                  {primaryTab === 'Share' && shareSubTab === 'Manage Access' && 'Save Changes'}
                  {primaryTab === 'Export' && (
                    <>
                      <Download className="w-4 h-4" />
                      Export as {selectedFormat.toUpperCase()}
                    </>
                  )}
                  {primaryTab === 'Save & Organize' && (
                    <>
                      <Folder className="w-4 h-4" />
                      Save & Organize
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 bg-white rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 px-4 py-3 min-w-[320px]"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-500' :
                toast.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
              }`} />
            <p className="text-[14px] font-medium text-gray-900 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

