import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import AppHeader from '../../../components/layout/AppHeader'
import SidebarLayout from '../../../components/layout/SidebarLayout'
import { 
  Copy, Edit, Clock, X, Mail, MapPin, Briefcase, Users, TrendingUp,
  User, Building2, Calendar, Phone, Linkedin, FileText, CheckCircle2,
  Zap, MessageSquare, Plus, CheckCircle
} from 'lucide-react'
import EditTeamMemberModal from '../../../components/collab-hub/EditTeamMemberModal'

export default function TeamMemberDetails() {
  const router = useRouter()
  const { id } = router.query
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditModal, setShowEditModal] = useState(false)

  // Sample team member data - in a real app, this would come from an API based on the id
  const member = {
    id: id || '3',
    name: "Leah O'Brien",
    email: 'leah@manifestr.com',
    avatar: 'https://i.pravatar.cc/150?img=23',
    role: 'Founder & Executive Producer',
    location: 'Seoul, KST (+9)',
    lastActive: '20 mins ago',
    badges: ['Owner', 'Active', '🎬 Creator'],
    stats: {
      projects: 12,
      teamMembers: 24,
      completion: '98%'
    },
    details: {
      role: 'Owner',
      department: 'Leadership',
      employmentType: 'Full-time',
      joinDate: 'February 14, 2025',
      status: 'Active',
      phone: '+82 10 1234 5678',
      linkedin: 'linkedin.com/in/leahobrien',
      bio: 'Founder of MANIFESTR. Driving strategy, product and brand. Passionate about building creative teams and bringing innovative ideas to life through visual storytelling.',
      skills: ['Strategy', 'Leadership', 'Product', 'Branding', 'Design']
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(member.name)
    // You could add a toast notification here
  }

  return (
    <>
      <Head>
        <title>{member.name} - Team Member Details - Collab Hub - Manifestr</title>
      </Head>
      <div className="min-h-screen bg-[#fcfcfc]">
        <AppHeader />
        
        <SidebarLayout>
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Page Header */}
            <div className="bg-white border-b border-[#e4e4e7] px-8 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-[20px] font-semibold leading-[25px] text-[#18181b] mb-1">
                    Team Member — Details
                  </h1>
                  <p className="text-[14px] leading-[24px] text-[#71717a]">
                    View and manage team member information
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setShowEditModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    Trigger Error
                  </motion.button>
                  <motion.button
                    onClick={() => router.back()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-5 h-5 flex items-center justify-center text-[#71717a] hover:text-[#18181b] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-white border-b border-[#e4e4e7] px-8 py-8">
              <div className="flex items-start gap-8">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#e4e4e7] flex-shrink-0">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-[20px] font-semibold leading-[24px] text-[#18181b]">
                      {member.name}
                    </h2>
                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-7 h-7 flex items-center justify-center text-[#71717a] hover:text-[#18181b] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <p className="text-[16px] leading-[24px] text-[#18181b] mb-4">
                    {member.role}
                  </p>
                  
                  {/* Contact Info */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#71717a]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b]">
                        {member.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#71717a]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b]">
                        {member.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#71717a]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b]">
                        Last active {member.lastActive}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-[12px] font-medium leading-[16px] bg-[#18181b] text-white">
                      {member.badges[0]}
                    </span>
                    <span className="px-2 py-1 rounded-md text-[12px] font-medium leading-[16px] bg-[#d1fae5] text-[#065f46]">
                      {member.badges[1]}
                    </span>
                    <span className="px-2 py-1 rounded-md text-[12px] font-medium leading-[16px] bg-[#18181b] text-white">
                      {member.badges[2]}
                    </span>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Briefcase className="w-5 h-5 text-[#71717a]" />
                    </div>
                    <p className="text-[20px] font-semibold leading-[24px] text-[#18181b] mb-1">
                      {member.stats.projects}
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Projects
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Users className="w-5 h-5 text-[#71717a]" />
                    </div>
                    <p className="text-[20px] font-semibold leading-[24px] text-[#18181b] mb-1">
                      {member.stats.teamMembers}
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Team Members
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <TrendingUp className="w-5 h-5 text-[#71717a]" />
                    </div>
                    <p className="text-[20px] font-semibold leading-[24px] text-[#18181b] mb-1">
                      {member.stats.completion}
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#71717a]">
                      Completion
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-[#e4e4e7] px-8">
              <div className="flex items-center gap-8">
                {['overview', 'projects', 'activity'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative px-4 py-2.5 text-[14px] font-medium leading-[20px] transition-colors ${
                      activeTab === tab
                        ? 'text-[#18181b]'
                        : 'text-[#71717a] hover:text-[#18181b]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#18181b] rounded-t"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Role & Department Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-[#e4e4e7] rounded-lg p-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-[#71717a]" />
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              Role
                            </span>
                          </div>
                          <p className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                            {member.details.role}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-[#71717a]" />
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              Department
                            </span>
                          </div>
                          <p className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                            {member.details.department}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Employment & Join Date Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white border border-[#e4e4e7] rounded-lg p-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-5 h-5 text-[#71717a]" />
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              Employment Type
                            </span>
                          </div>
                          <p className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                            {member.details.employmentType}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-[#71717a]" />
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              Join Date
                            </span>
                          </div>
                          <p className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                            {member.details.joinDate}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Bio / Notes Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white border border-[#e4e4e7] rounded-lg p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-[#71717a]" />
                        <span className="text-[14px] leading-[20px] text-[#71717a]">
                          Bio / Notes
                        </span>
                      </div>
                      <p className="text-[14px] leading-[20px] text-[#18181b]">
                        {member.details.bio}
                      </p>
                    </motion.div>

                    {/* Status & Contact Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white border border-[#e4e4e7] rounded-lg p-6"
                    >
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              Status
                            </span>
                          </div>
                          <p className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                            {member.details.status}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-5 h-5 text-[#71717a]" />
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              Phone
                            </span>
                          </div>
                          <p className="text-[16px] font-medium leading-[24px] text-[#18181b]">
                            {member.details.phone}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Linkedin className="w-5 h-5 text-[#71717a]" />
                            <span className="text-[14px] leading-[20px] text-[#71717a]">
                              LinkedIn
                            </span>
                          </div>
                          <a 
                            href={`https://${member.details.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[16px] font-medium leading-[24px] text-[#18181b] hover:underline"
                          >
                            {member.details.linkedin}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Skills Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border border-[#e4e4e7] rounded-lg p-6"
                  >
                    <h3 className="text-[14px] leading-[20px] text-[#18181b] mb-4">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {member.details.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-md text-[12px] font-medium leading-[16px] bg-[#f4f4f5] text-[#18181b]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Brand Redesign 2025',
                      dueDate: 'Due 2025-11-15',
                      status: 'In Progress',
                      progress: 75,
                      teamMembers: 5,
                    },
                    {
                      title: 'Product Launch Campaign',
                      dueDate: 'Due 2025-10-01',
                      status: 'Completed',
                      progress: 100,
                      teamMembers: 8,
                    },
                    {
                      title: 'Website Optimization',
                      dueDate: 'Due 2025-12-01',
                      status: 'In Progress',
                      progress: 45,
                      teamMembers: 3,
                    },
                    {
                      title: 'Content Strategy Q4',
                      dueDate: 'Due 2025-11-30',
                      status: 'Planning',
                      progress: 20,
                      teamMembers: 4,
                    },
                  ].map((project, index) => {
                    const getStatusColor = (status) => {
                      switch (status) {
                        case 'Completed':
                          return 'bg-[#d1fae5] text-[#065f46]'
                        case 'In Progress':
                          return 'bg-[#dbeafe] text-[#1e40af]'
                        case 'Planning':
                          return 'bg-[#fed7aa] text-[#9a3412]'
                        default:
                          return 'bg-[#f4f4f5] text-[#71717a]'
                      }
                    }

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white border border-[#e4e4e7] rounded-lg p-6"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-[16px] font-semibold leading-[28px] text-[#18181b] mb-1">
                              {project.title}
                            </h3>
                            <p className="text-[14px] leading-[24px] text-[#71717a]">
                              {project.dueDate}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-[12px] font-medium leading-[16px] ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>

                        {/* Progress Section */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[14px] leading-[20px] text-[#18181b]">
                              Progress
                            </span>
                            <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="h-full bg-[#1e40af] rounded-full"
                            />
                          </div>
                        </div>

                        {/* Team Members */}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#71717a]" />
                          <span className="text-[14px] leading-[20px] text-[#18181b]">
                            {project.teamMembers} team members
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="bg-white border border-[#e4e4e7] rounded-lg">
                  {[
                    {
                      icon: Zap,
                      iconColor: 'text-[#1e40af]',
                      action: 'Updated project status',
                      project: 'Brand Redesign 2025',
                      time: '20 mins ago',
                    },
                    {
                      icon: CheckCircle,
                      iconColor: 'text-[#10b981]',
                      action: 'Completed task',
                      project: 'Product Launch Campaign',
                      time: '2 hours ago',
                    },
                    {
                      icon: MessageSquare,
                      iconColor: 'text-[#71717a]',
                      action: 'Added new comment',
                      project: 'Website Optimization',
                      time: '5 hours ago',
                    },
                    {
                      icon: Plus,
                      iconColor: 'text-[#a855f7]',
                      action: 'Created new project',
                      project: 'Content Strategy Q4',
                      time: '1 day ago',
                    },
                    {
                      icon: CheckCircle2,
                      iconColor: 'text-[#71717a]',
                      action: 'Approved deliverable',
                      project: 'Brand Redesign 2025',
                      time: '2 days ago',
                    },
                  ].map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-center gap-4 px-4 py-4 ${
                          index !== 4 ? 'border-b border-[#e4e4e7]' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                          <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] leading-[24px] text-[#18181b] mb-1">
                            {activity.action}
                          </p>
                          <p className="text-[14px] leading-[20px] text-[#71717a]">
                            {activity.project}
                          </p>
                        </div>

                        {/* Time */}
                        <div className="flex-shrink-0">
                          <p className="text-[14px] leading-[20px] text-[#71717a] whitespace-nowrap">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </SidebarLayout>
      </div>

      {/* Edit Team Member Modal */}
      <EditTeamMemberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        member={member}
        onSave={(formData) => {
          // Handle save - in a real app, this would make an API call
          // You could update the member state here or refetch data
        }}
      />
    </>
  )
}

