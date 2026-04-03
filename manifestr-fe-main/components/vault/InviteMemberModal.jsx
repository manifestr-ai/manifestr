import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Loader2, Mail, ChevronDown, Trash2 } from 'lucide-react'
import api from '../../lib/api'

export default function InviteMemberModal({ isOpen, onClose, collabProjectId, collabName, onMemberAdded }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const [isInviting, setIsInviting] = useState(false)
  const [members, setMembers] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const roles = [
    { value: 'admin', label: 'Admin', desc: 'Can manage members and documents' },
    { value: 'editor', label: 'Editor', desc: 'Can add and edit documents' },
    { value: 'viewer', label: 'Viewer', desc: 'Can only view documents' }
  ]

  useEffect(() => {
    if (isOpen && collabProjectId) {
      fetchMembers()
    }
  }, [isOpen, collabProjectId])

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const fetchMembers = async () => {
    try {
      setIsLoadingMembers(true)
      const response = await api.get(`/collab-projects/${collabProjectId}`)
      
      if (response.data.status === 'success') {
        setMembers(response.data.data.members || [])
      }
    } catch (error) {
      console.error('❌ Failed to fetch members:', error)
    } finally {
      setIsLoadingMembers(false)
    }
  }

  const handleInvite = async () => {
    if (!email || !email.includes('@') || isInviting) return

    try {
      setIsInviting(true)

      const response = await api.post(`/collab-projects/${collabProjectId}/members`, {
        email: email.trim(),
        role
      })

      if (response.data.status === 'success') {
        showToast(`Invited ${email} as ${role}!`, 'success')
        setEmail('')
        
        setTimeout(() => {
          fetchMembers()
          if (onMemberAdded) onMemberAdded()
        }, 500)
      }
    } catch (error) {
      console.error('❌ Failed to invite:', error)
      showToast(error.response?.data?.message || 'Failed to invite member', 'error')
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member from the collab?')) return

    try {
      const response = await api.delete(`/collab-projects/${collabProjectId}/members/${userId}`)
      
      if (response.data.status === 'success') {
        showToast('Member removed', 'success')
        fetchMembers()
        if (onMemberAdded) onMemberAdded()
      }
    } catch (error) {
      console.error('❌ Failed to remove member:', error)
      showToast(error.response?.data?.message || 'Failed to remove member', 'error')
    }
  }

  const getRoleBadgeColor = (role) => {
    if (role === 'owner') return 'bg-purple-100 text-purple-800'
    if (role === 'admin') return 'bg-blue-100 text-blue-800'
    if (role === 'editor') return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-[#e4e4e7] rounded-lg w-full max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-[#e4e4e7] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                    Invite Members
                  </h2>
                  <p className="text-[14px] text-[#71717a] mt-1">
                    to "{collabName}"
                  </p>
                </div>
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

            {/* Invite Form */}
            <div className="p-4 border-b border-[#e4e4e7] space-y-3">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-[#52525b]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleInvite()
                    }}
                    placeholder="colleague@company.com"
                    className="w-full h-[40px] pl-10 pr-3 bg-white border border-[#e4e4e7] rounded-md text-[14px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-medium text-[#52525b]">
                  Role
                </label>
                <div className="relative">
                  <motion.button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-[40px] flex items-center justify-between hover:border-[#18181b] transition-colors"
                  >
                    <span className="text-[14px] text-[#18181b] capitalize">
                      {roles.find(r => r.value === role)?.label || role}
                    </span>
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
                        {roles.map((r) => (
                          <motion.button
                            key={r.value}
                            onClick={() => {
                              setRole(r.value)
                              setShowRoleDropdown(false)
                            }}
                            whileHover={{ backgroundColor: '#f4f4f5' }}
                            className="w-full px-3 py-2.5 text-left"
                          >
                            <p className="text-[14px] font-medium text-[#18181b]">{r.label}</p>
                            <p className="text-[12px] text-[#71717a]">{r.desc}</p>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                onClick={handleInvite}
                disabled={isInviting || !email}
                whileHover={{ scale: isInviting ? 1 : 1.02 }}
                whileTap={{ scale: isInviting ? 1 : 0.98 }}
                className="w-full bg-[#18181b] text-white rounded-md h-[40px] flex items-center justify-center gap-2 text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInviting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Inviting...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Send Invite</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Current Members */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-3">
                <h3 className="text-[14px] font-semibold text-[#18181b]">
                  Members ({members.length})
                </h3>
              </div>

              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No members yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => {
                    const user = member.users || {}
                    const firstName = user.first_name || ''
                    const lastName = user.last_name || ''
                    const fullName = `${firstName} ${lastName}`.trim()
                    const displayName = fullName || user.email?.split('@')[0] || 'User'

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-[#f9fafb] border border-[#e4e4e7] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#18181b] to-[#52525b] flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {displayName[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-[#18181b]">
                              {displayName}
                            </p>
                            <p className="text-[12px] text-[#71717a]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-[11px] font-medium ${getRoleBadgeColor(member.role)}`}>
                            {member.role}
                          </span>
                          {member.role !== 'owner' && (
                            <motion.button
                              onClick={() => handleRemoveMember(user.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {toast.show && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-4 right-4"
                >
                  <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                    toast.type === 'error' ? 'bg-red-500' : 
                    toast.type === 'success' ? 'bg-green-500' : 
                    'bg-blue-500'
                  } text-white`}>
                    <span className="text-sm font-medium">{toast.message}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
