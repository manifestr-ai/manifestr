import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CloudUpload, Pencil, ChevronDown, ArrowRight, Loader2 } from 'lucide-react'
import api from '../../lib/api'

export default function CreateNewCollabModal({ isOpen, onClose, onCreate, mode = 'create', initialData = null }) {
  const modalRef = useRef(null)
  const [coverImage, setCoverImage] = useState(null)
  const [collabName, setCollabName] = useState('')
  const [purposeNotes, setPurposeNotes] = useState('')
  const [tags, setTags] = useState(['campaign', 'social', 'manifestr'])
  const [tagInput, setTagInput] = useState('')
  const [inviteEmails, setInviteEmails] = useState(['umarzapta@gmail.com', 'umarzapta@gmail.com'])
  const [emailInput, setEmailInput] = useState('m')
  const [selectedRole, setSelectedRole] = useState('Editor')
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const roles = ['Owner', 'Admin', 'Editor', 'Viewer']

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowRoleDropdown(false)
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
      if (mode === 'edit' && initialData) {
        setCoverImage(initialData.coverImage ?? null)
        setCollabName(initialData.collabName ?? '')
        setPurposeNotes(initialData.purposeNotes ?? '')
        setTags(Array.isArray(initialData.tags) ? initialData.tags : ['campaign', 'social', 'manifestr'])
        setTagInput('')
        setInviteEmails(Array.isArray(initialData.inviteEmails) ? initialData.inviteEmails : [])
        setEmailInput('')
        setSelectedRole(initialData.role ?? 'Editor')
      } else {
        setCoverImage(null)
        setCollabName('')
        setPurposeNotes('')
        setTags(['campaign', 'social', 'manifestr'])
        setTagInput('')
        setInviteEmails(['umarzapta@gmail.com', 'umarzapta@gmail.com'])
        setEmailInput('')
        setSelectedRole('Editor')
      }
    }
  }, [isOpen, mode, initialData])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const removeEmail = (index) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index))
  }

  const addEmail = () => {
    const email = emailInput.trim()
    if (email && email.includes('@') && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email])
      setEmailInput('')
    }
  }

  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addEmail()
    } else if (e.key === 'Backspace' && emailInput === '' && inviteEmails.length > 0) {
      removeEmail(inviteEmails.length - 1)
    }
  }

  const handleCreate = async () => {
    if (!collabName.trim()) {
      showToast('Please enter a collab name', 'error')
      return
    }

    setIsCreating(true)

    try {
      const response = await api.post('/collab-projects', {
        name: collabName.trim(),
        coverImage: coverImage || null,
        purposeNotes: purposeNotes || '',
        tags: tags,
        inviteEmails: inviteEmails.filter(e => e && e.includes('@')),
        role: selectedRole.toLowerCase()
      })

      if (response.data.status === 'success') {
        console.log('✅ Collab created:', response.data.data)
        showToast('Collab created successfully!', 'success')

        if (onCreate) {
          onCreate(response.data.data)
        }

        setTimeout(() => {
          onClose()
        }, 500)
      }
    } catch (error) {
      console.error('❌ Failed to create collab:', error)
      showToast(error.response?.data?.message || 'Failed to create collab', 'error')
    } finally {
      setIsCreating(false)
    }
  }

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
              <div className="flex items-center justify-between">
                <h2
                  className="font-inter text-[16px] font-semibold leading-[24px] text-[var(--base-foreground,#18181B)]"
                  style={{
                    color: "var(--base-foreground, #18181B)",
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "24px"
                  }}
                >
                  {mode === 'edit' ? 'Edit Project' : 'Create New Collab'}
                </h2>

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5] transition-colors"
                >
                  <X className="w-5 h-5 text-[#71717a]" />
                </motion.button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Collab Cover Image */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                  Collab Cover Image
                </label>
                <div className="relative bg-[#f4f4f4] h-[240px] rounded-[10px] overflow-hidden mt-1">
                  {/* Watermark Text */}
                  <p
                    className="absolute text-black opacity-[0.03] left-[28px] top-[135px] w-[564px]"
                    style={{
                      fontFamily: '"IvyPresto Headline", serif',
                      fontSize: "98.087px",
                      fontStyle: "italic",
                      fontWeight: 600,
                      lineHeight: "normal",
                    }}
                  >
                    BOSS VIBES
                  </p>


                  {coverImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <motion.button
                        onClick={() => setCoverImage(null)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-md flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-[524px]">
                      <label>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 flex items-center gap-2 cursor-pointer hover:border-[#18181b] transition-colors"
                        >
                          <CloudUpload className="w-4 h-4 text-[#18181b]" />
                          <span className="text-[14px] font-medium leading-[20px] text-[#18181b] whitespace-nowrap">
                            Click to upload
                          </span>
                        </motion.div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[12px] leading-[18px] text-[#71717a] text-center w-full">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Collab Name */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  Collab name
                </label>
                <input
                  type="text"
                  value={collabName}
                  onChange={(e) => setCollabName(e.target.value)}
                  placeholder="Give your workspace a clear, memorable name."
                  className="w-full h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-md text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent mt-1"
                />
              </div>

              {/* Purpose/Notes */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#464649]">
                  Purpose/Notes
                </label>
                <div className="relative">
                  <textarea
                    value={purposeNotes}
                    onChange={(e) => setPurposeNotes(e.target.value)}
                    placeholder="Notes..."
                    className="w-full h-[132px] px-[14px] py-3 bg-white border border-[#e4e4e7] rounded-md text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent resize-none mt-1"
                  />
                  {/* Resize handle indicator */}
                  <div className="absolute bottom-[6px] right-[6px] w-3 h-3 opacity-30 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M11 11L1 1M11 11H7M11 11V7M1 1H5M1 1V5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tag */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  Tag
                </label>
                <div className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 min-h-[36px] flex flex-wrap gap-2 items-center mt-1">
                  {tags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-white border border-[#e4e4e7] rounded-md pl-[9px] pr-1 py-0.5 flex items-center gap-1.5"
                    >
                      <span className="text-[14px] font-medium leading-[20px] text-[#464649] whitespace-nowrap">
                        {tag}
                      </span>
                      <motion.button
                        onClick={() => removeTag(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-0.5 rounded hover:bg-[#f4f4f5] transition-colors flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-[#71717a]" />
                      </motion.button>
                    </motion.div>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    className="flex-1 min-w-[120px] outline-none text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] bg-transparent"
                  />
                </div>
              </div>

              {/* Invite Users */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  Invite Users
                </label>
                <div className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 min-h-[36px] flex flex-wrap gap-2 items-center mt-1">
                  {inviteEmails.map((email, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-white border border-[#e4e4e7] rounded-md pl-[9px] pr-1 py-0.5 flex items-center gap-1.5"
                    >
                      <span className="text-[14px] font-medium leading-[20px] text-[#464649] whitespace-nowrap">
                        {email}
                      </span>
                      <motion.button
                        onClick={() => removeEmail(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-0.5 rounded hover:bg-[#f4f4f5] transition-colors flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-[#71717a]" />
                      </motion.button>
                    </motion.div>
                  ))}
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleEmailKeyPress}
                    onBlur={addEmail}
                    placeholder={inviteEmails.length === 0 ? "Enter email addresses..." : ""}
                    className="flex-1 min-w-[120px] outline-none text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] bg-transparent"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium leading-[20px] text-[#52525b]">
                  Role
                </label>
                <div className="relative mt-1">
                  <motion.button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-[36px] flex items-center justify-between hover:border-[#18181b] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Pencil className="w-5 h-5 text-[#71717a]" />
                      <span className="text-[16px] leading-[24px] text-[#18181b]">
                        {selectedRole}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {showRoleDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                      >
                        {roles.map((role) => (
                          <motion.button
                            key={role}
                            onClick={() => {
                              setSelectedRole(role)
                              setShowRoleDropdown(false)
                            }}
                            whileHover={{ backgroundColor: '#f4f4f5' }}
                            className="w-full px-3 py-2 text-left text-[16px] leading-[24px] text-[#18181b]"
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

            {/* Modal Footer */}
            <div className="border-t border-[#e4e4e7] p-4">
              <div className="flex items-center justify-between">
                <motion.button
                  onClick={() => {
                    // Help action
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-1 py-1 text-[14px] font-medium leading-[20px] text-[#18181b] hover:opacity-70 transition-opacity"
                >
                  Help?
                </motion.button>
                <motion.button
                  onClick={handleCreate}
                  disabled={isCreating}
                  whileHover={{ scale: isCreating ? 1 : 1.02 }}
                  whileTap={{ scale: isCreating ? 1 : 0.98 }}
                  className="bg-[#18181b] text-white rounded-md h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'edit' ? 'Save Changes' : 'Create & Enter Collab'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Toast Notification */}
          <AnimatePresence>
            {toast.show && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 z-[10000]"
              >
                <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' :
                    toast.type === 'success' ? 'bg-green-500' :
                      'bg-blue-500'
                  } text-white`}>
                  <span className="text-sm font-medium">{toast.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
