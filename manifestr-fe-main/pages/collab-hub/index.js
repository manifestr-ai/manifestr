import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import CollabsSearchBar from '../../components/vault/CollabsSearchBar'
import VaultGrid from '../../components/vault/VaultGrid'
import CollabMembersView from '../../components/vault/CollabMembersView'
import CreateNewCollabModal from '../../components/vault/CreateNewCollabModal'
import { motion } from 'framer-motion'
import { Plus, Loader2, FolderOpen } from 'lucide-react'
import api from '../../lib/api'

export default function CollabHub() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const [collabProjects, setCollabProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [viewingMembers, setViewingMembers] = useState(false)

  useEffect(() => {
    fetchCollabProjects()
  }, [])

  const fetchCollabProjects = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/collab-projects')

      if (response.data.status === 'success') {
        const projects = response.data.data || []
        console.log(`✅ Fetched ${projects.length} collab projects`)
        setCollabProjects(projects)
      }
    } catch (error) {
      console.error('❌ Failed to fetch collab projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCollab = (data) => {
    console.log('🎯 Collab created:', data)
    fetchCollabProjects()

    if (data && data.id) {
      setTimeout(() => {
        router.push(`/vault/collabs/${data.id}`)
      }, 600)
    }
  }

  const handleCollabClick = (card) => {
    if (card?.id) {
      router.push(`/vault/collabs/${card.id}`)
    }
  }

  const handleViewMembers = async (collabId) => {
    try {
      console.log(`👥 Viewing members for collab: ${collabId}`)
      const response = await api.get(`/collab-projects/${collabId}`)
      if (response.data.status === 'success') {
        setSelectedCollab(response.data.data)
        setViewingMembers(true)
      }
    } catch (error) {
      console.error('❌ Failed to fetch collab details:', error)
    }
  }

  const handleBackToCollabs = () => {
    setViewingMembers(false)
    setSelectedCollab(null)
  }

  // Map collab projects to card format (like vault documents)
  const collabCards = collabProjects.map(project => ({
    id: project.id,
    title: project.name,
    project: `${project.documentCount || 0} projects`,
    status: project.status === 'active' ? 'Active' : 'Archived',
    thumbnail: project.cover_image || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
    collaborators: [], // Will be populated from members if needed
    memberCount: project.memberCount || 0,
    lastEdited: project.updated_at ? new Date(project.updated_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'Just now',
  }))

  const headerBackgroundImage =
    typeof window !== 'undefined'
      ? `${window.location.origin}/assets/banners/abstract-white-wave.png`
      : 'http://localhost:3000/assets/banners/abstract-white-wave.png'

  return (
    <>
      <Head>
        <title>Collab Hub - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {!viewingMembers && (
          <>
            <VaultHeader
              title={<span className="text-[#18181b] font-bold">Collabs</span>}
              description="Collabs are shared workspaces to keep people + documents together, all in one view."
              isBlack={false}
              backgroundImage={headerBackgroundImage}
              showActionButtons={true}
              customActionButton={
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-black border border-[#e4e4e7] rounded-md h-[40px] px-4 flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:bg-[#f4f4f5] transition-colors w-full md:w-auto shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  New Collab
                </motion.button>
              }
            />

            <CollabsSearchBar
              placeholder="Search style guides..."
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </>
        )}

        {viewingMembers && selectedCollab ? (
          <CollabMembersView 
            collab={selectedCollab}
            onBack={handleBackToCollabs}
          />
        ) : (
          <>
            {isLoading ? (
              <div className="px-4 md:px-[38px] py-12 w-full flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                <p className="text-gray-500 text-lg">Loading your collabs...</p>
              </div>
            ) : collabProjects.length === 0 ? (
              <div className="px-4 md:px-[38px] py-12 w-full flex flex-col items-center justify-center">
                <FolderOpen className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No collab projects yet</p>
                <p className="text-gray-400 text-sm">Create your first collab to get started!</p>
              </div>
            ) : (
              <VaultGrid
                cards={collabCards}
                showTitle={false}
                viewMode={viewMode}
                onCardClick={handleCollabClick}
                onMemberCountClick={handleViewMembers}
              />
            )}
          </>
        )}

        <CreateNewCollabModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCollab}
        />
      </div>
    </>
  )
}

CollabHub.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>{page}</SidebarLayout>
    </div>
  )
}
