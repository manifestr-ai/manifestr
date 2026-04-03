import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, Search, ChevronLeft, Shield, Pencil, Eye, User } from 'lucide-react'

export default function CollabMembersView({ collab, onBack }) {
  const [searchQuery, setSearchQuery] = useState('')

  const getRoleIcon = (role) => {
    if (role === 'owner') return <Shield className="w-3.5 h-3.5" />
    if (role === 'admin') return <Shield className="w-3.5 h-3.5" />
    if (role === 'editor') return <Pencil className="w-3.5 h-3.5" />
    return <Eye className="w-3.5 h-3.5" />
  }

  const getRoleColor = (role) => {
    if (role === 'owner') return 'text-purple-600'
    if (role === 'admin') return 'text-blue-600'
    if (role === 'editor') return 'text-green-600'
    return 'text-gray-600'
  }

  const getStatusBadge = (status) => {
    if (status === 'accepted' || status === 'active') {
      return <span className="px-2 py-1 text-[11px] font-medium bg-green-100 text-green-700 rounded-md">Active</span>
    }
    return <span className="px-2 py-1 text-[11px] font-medium bg-yellow-100 text-yellow-700 rounded-md">Pending</span>
  }

  const getLastActive = (member) => {
    if (member.status === 'pending') return 'Never'
    if (member.accepted_at) {
      const date = new Date(member.accepted_at)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 60) return `${diffMins} mins ago`
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
      if (diffDays === 1) return '1 day ago'
      if (diffDays < 30) return `${diffDays} days ago`
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    }
    return '2 hours ago'
  }

  const members = collab?.members || []

  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true
    const user = member.users || {}
    const query = searchQuery.toLowerCase()
    const firstName = (user.first_name || '').toLowerCase()
    const lastName = (user.last_name || '').toLowerCase()
    const email = (user.email || '').toLowerCase()
    return firstName.includes(query) || lastName.includes(query) || email.includes(query)
  })

  return (
    <div className="px-4 md:px-[38px] pt-8 py-6 w-full bg-white min-h-screen">
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#18181b] hover:text-[#52525b] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Collabs
      </motion.button>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member..."
            className="w-full h-[40px] pl-10 pr-3 bg-white border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-[#e4e4e7] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#e4e4e7] bg-[#f4f4f5] text-[12px] font-medium text-[#71717a]">
          <div className="flex-1">User name</div>
          <div className="w-[120px]">Rule</div>
          <div className="w-[120px]">Status</div>
          <div className="w-[140px]">Last active</div>
          <div className="w-[80px] text-center">Actions</div>
        </div>

        {/* Table Rows */}
        {filteredMembers.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No members found' : 'No members yet'}
            </p>
          </div>
        ) : (
          filteredMembers.map((member, index) => {
            const user = member.users || {}
            const firstName = user.first_name || ''
            const lastName = user.last_name || ''
            const fullName = `${firstName} ${lastName}`.trim() || 'User'

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center px-4 py-3 border-b border-[#e4e4e7] last:border-b-0 hover:bg-[#fafafa] transition-colors"
              >
                {/* User name */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#18181b] to-[#52525b] flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {fullName[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#18181b]">
                      {fullName}
                    </p>
                    <p className="text-[12px] text-[#71717a]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="w-[120px]">
                  <div className={`flex items-center gap-1.5 ${getRoleColor(member.role)}`}>
                    {getRoleIcon(member.role)}
                    <span className="text-[14px] capitalize">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="w-[120px]">
                  {getStatusBadge(member.status)}
                </div>

                {/* Last active */}
                <div className="w-[140px]">
                  <span className="text-[13px] text-[#71717a]">
                    {getLastActive(member)}
                  </span>
                </div>

                {/* Actions */}
                <div className="w-[80px] flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#f4f4f5] rounded-md transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-[#71717a]" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
