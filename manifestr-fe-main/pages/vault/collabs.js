import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import CollabsSearchBar from '../../components/vault/CollabsSearchBar'
import VaultFolderGrid from '../../components/vault/VaultFolderGrid'
import VaultGrid from '../../components/vault/VaultGrid'
import CreateNewCollabModal from '../../components/vault/CreateNewCollabModal'
import UploadFileModal from '../../components/vault/UploadFileModal'
import api from '../../lib/api'
import { Loader2, FolderOpen } from 'lucide-react'

export default function VaultCollabs() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [collabProjects, setCollabProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  const handleFolderClick = (folder) => {
    if (folder.id) {
      router.push(`/vault/collabs/${folder.id}`)
    }
  }

  // Map collab projects to folder format
  const collabFolders = collabProjects.map(project => ({
    id: project.id,
    name: project.name,
    memberCount: project.memberCount || 0,
    documentCount: project.documentCount || 0
  }))

  // Background image URL for the header
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/Rectangle-2.png`
    : 'http://localhost:3000/assets/banners/Rectangle-2.png'

  return (
    <>
      <Head>
        <title>Collabs - The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <VaultHeader
          title="THE vault collabs"
          description={null}
          isBlack={false}
          backgroundImage={headerBackgroundImage}
          showActionButtons={false}
        />

        <CollabsSearchBar />

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
          <VaultFolderGrid folders={collabFolders} onFolderClick={handleFolderClick} />
        )}
      </div>

      <CreateNewCollabModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCollab}
      />

      <UploadFileModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={(data) => {
          console.log('Upload file:', data)
        }}
      />
    </>
  )
}

VaultCollabs.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}
