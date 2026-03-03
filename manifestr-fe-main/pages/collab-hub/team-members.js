import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import EditTeamMemberModal from '../../components/collab-hub/EditTeamMemberModal'
import { Search, ChevronDown, Crown, User, Edit, Eye, MoreVertical, Plus } from 'lucide-react'

export default function TeamMembers() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllTagsDropdown, setShowAllTagsDropdown] = useState(false)
  const [showRecentsDropdown, setShowRecentsDropdown] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  const teamMembers = [
    {
      id: 1,
      name: 'Umar Islam',
      email: 'umar@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Owner',
      roleIcon: Crown,
      status: 'Active',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jessica',
      email: 'jessica@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Admin',
      roleIcon: User,
      status: 'Active',
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Leah OB',
      email: 'leah@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Editor',
      roleIcon: Edit,
      status: 'Active',
      lastActive: '20 mints ago',
    },
    {
      id: 4,
      name: 'Nasir Ali',
      email: 'nasir@example.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'Editor',
      roleIcon: Edit,
      status: 'Pending',
      lastActive: 'Never',
    },
    {
      id: 5,
      name: 'Amima Sabir',
      email: 'nasir@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Viewer',
      roleIcon: Eye,
      status: 'Active',
      lastActive: '21 August 2...',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-[#d1fae5] text-[#065f46]'
      case 'Pending':
        return 'bg-[#fef3c7] text-[#92400e]'
      default:
        return 'bg-[#f4f4f5] text-[#71717a]'
    }
  }

  return (
    <>
      <Head>
        <title>Team Members - Collab Hub - Manifestr</title>
      </Head>
      <div className="min-h-screen bg-[#f4f4f4]">
        <AppHeader />
        
        <SidebarLayout>
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="bg-white border-b border-[#e4e4e7] px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-[24px] font-semibold leading-[32px] text-[#18181b]">
                  Team members
                </h1>
                <motion.button
                  onClick={() => setShowAddModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#18181b] text-white rounded-md h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Add Team Member
                </motion.button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border-b border-[#e4e4e7] px-8 py-4">
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-[250px]">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="w-5 h-5 text-[#71717a]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search member..."
                    className="w-full h-[40px] pl-10 pr-4 bg-white border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:border-[#18181b]"
                  />
                </div>

                {/* All Tags Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => {
                      setShowAllTagsDropdown(!showAllTagsDropdown)
                      setShowRecentsDropdown(false)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  >
                    <span>All tags</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllTagsDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                </div>

                {/* Recents Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => {
                      setShowRecentsDropdown(!showRecentsDropdown)
                      setShowAllTagsDropdown(false)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  >
                    <span>Recents</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showRecentsDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-8">
              <div className="bg-white border border-[#e4e4e7] rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e4e4e7]">
                      <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[20px] text-[#18181b]">
                        User name
                      </th>
                      <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[20px] text-[#18181b]">
                        Rule
                      </th>
                      <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[20px] text-[#18181b]">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[20px] text-[#18181b]">
                        Last active
                      </th>
                      <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[20px] text-[#18181b]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member, index) => {
                      const RoleIcon = member.roleIcon
                      return (
                        <motion.tr
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => router.push(`/collab-hub/team-members/${member.id}`)}
                          className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#e4e4e7]">
                                <img 
                                  src={member.avatar} 
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-[14px] font-medium leading-[20px] text-[#18181b]">
                                  {member.name}
                                </p>
                                <p className="text-[12px] leading-[18px] text-[#71717a]">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <RoleIcon className="w-4 h-4 text-[#18181b]" />
                              <span className="text-[14px] leading-[20px] text-[#18181b]">
                                {member.role}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              {member.lastActive}
                            </span>
                          </td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => router.push(`/collab-hub/team-members/${member.id}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 bg-[#18181b] text-white rounded-md text-[12px] font-medium leading-[18px] hover:opacity-90 transition-opacity"
                              >
                                View Details
                              </motion.button>
                              <motion.button
                                onClick={() => setEditingMember(member)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-[#f4f4f5] rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-[#18181b]" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-[#f4f4f5] rounded-md transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-[#18181b]" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </div>

      {/* Add Team Member Modal */}
      <EditTeamMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        member={null}
        onSave={(formData) => {
          // Handle save - in a real app, this would make an API call
          // You could add the member to the list here or refetch data
          setShowAddModal(false)
        }}
      />

      {/* Edit Team Member Modal */}
      <EditTeamMemberModal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        member={editingMember}
        onSave={(formData) => {
          // Handle save - in a real app, this would make an API call
          // You could update the member in the list here or refetch data
          setEditingMember(null)
        }}
      />
    </>
  )
}

