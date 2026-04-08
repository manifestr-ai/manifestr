import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AppHeader from '../components/layout/AppHeader'
import SidebarLayout from '../components/layout/SidebarLayout'
import VaultHeader from '../components/vault/VaultHeader'
import VaultSearchBar from '../components/vault/VaultSearchBar'
import VaultFolderGrid from '../components/vault/VaultFolderGrid'
import VaultGrid from '../components/vault/VaultGrid'
import CreateNewCollabModal from '../components/vault/CreateNewCollabModal'
import UploadFileModal from '../components/vault/UploadFileModal'
import api from '../lib/api'
import { VAULT_FOLDERS, getVaultFolderHref } from '../components/vault/vaultFolders'
import { useToast } from '../components/ui/Toast'

export default function Vault() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  // State for vault items
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const dummyItems = [
    {
      id: 'demo-1',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      thumbnail: '/assets/dummy/project-1.png',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=4' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=6' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=7' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-1', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-2',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Review',
      thumbnail: '/assets/dummy/project-2.png',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=8' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=9' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=10' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=13' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=14' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: true,
      collaboratorName: null,
      rawData: { id: 'demo-2', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-3',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      thumbnail: '/assets/dummy/project-3.png',
      collaborators: [
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=15' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=16' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=17' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=18' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: true,
      isPinned: false,
      collaboratorName: 'Leah',
      rawData: { id: 'demo-3', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-4',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=19' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=20' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=21' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=22' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-4', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-5',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Draft',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=23' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=24' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=25' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=26' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-5', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-6',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      thumbnail: '/assets/dummy/project-1.png',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=27' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=28' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=29' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=30' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-6', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-7',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Review',
      thumbnail: '/assets/dummy/project-2.png',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=31' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=32' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=33' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=34' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-7', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-8',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      thumbnail: '/assets/dummy/project-3.png',
      collaborators: [
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=35' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=36' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=37' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=38' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: 'Leah',
      rawData: { id: 'demo-8', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-9',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=39' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=40' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=41' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=42' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-9', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-10',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Draft',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=43' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=44' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=45' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=46' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-10', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-11',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      thumbnail: '/assets/dummy/project-1.png',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=47' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=48' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=49' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=50' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-11', type: 'document' },
      isDummy: true,
    },
    {
      id: 'demo-12',
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Review',
      thumbnail: '/assets/dummy/project-2.png',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=51' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=52' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=53' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=54' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      isPinned: false,
      collaboratorName: null,
      rawData: { id: 'demo-12', type: 'document' },
      isDummy: true,
    },
  ]

  // Fetch ALL user's projects (owned + shared) on mount
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setIsLoading(true)

        // Fetch BOTH owned documents and shared documents
        const [ownedRes, sharedRes] = await Promise.all([
          api.get('/ai/recent-generations?limit=1000'), // Fetch ALL owned documents (high limit)
          api.get('/collaborations/shared-with-me') // Fetch ALL shared documents
        ])

        let allProjects = []

        // Add owned documents
        if (ownedRes.data.status === 'success') {
          allProjects = [...ownedRes.data.data]
        }

        // Add shared documents
        if (sharedRes.data.status === 'success') {
          allProjects = [...allProjects, ...sharedRes.data.data]
        }

        // Sort by date (most recent first)
        allProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        // Fetch pin status for user
        let pinnedDocIds = []
        try {
          const pinsRes = await api.get('/ai/pinned')
          if (pinsRes.data.status === 'success') {
            pinnedDocIds = pinsRes.data.data.map(p => p.id)
          }
        } catch (err) {
          console.log('⚠️ Could not fetch pinned status')
        }

        // 🚀 BATCH FETCH: Get ALL collaborators in ONE API call!
        console.log(`🚀 BATCH: Fetching collaborators for ${allProjects.length} projects in ONE call...`)
        const startTime = Date.now()
        
        let collaboratorsByDocId = {}
        try {
          const docIds = allProjects.map(p => p.id)
          const batchRes = await api.post('/collaborations/batch-collaborators', { documentIds: docIds })
          
          if (batchRes.data.status === 'success') {
            collaboratorsByDocId = batchRes.data.data
            const totalCollabs = Object.values(collaboratorsByDocId).reduce((sum, arr) => sum + arr.length, 0)
            console.log(`✅ BATCH: Fetched ${totalCollabs} collaborators in ${Date.now() - startTime}ms`)
          }
        } catch (err) {
          console.log('⚠️ Batch fetch failed, collaborators will be empty:', err.message)
        }

        // Map projects with their collaborators (NO MORE API CALLS!)
        const mappedItems = allProjects.map(project => {
          // Get collaborators from batch response
          const collabsData = collaboratorsByDocId[project.id] || []
          
          // Map to VaultCard format: { name, avatar, role, email }
          const collaborators = collabsData.map(collab => {
            const user = collab.users || {}
            const firstName = user.first_name || ''
            const lastName = user.last_name || ''
            const fullName = `${firstName} ${lastName}`.trim()
            const displayName = fullName || user.email?.split('@')[0] || 'User'

            return {
              name: displayName,
              avatar: null,
              role: collab.role,
              email: user.email
            }
          })

          return {
            id: project.id,
            title: project.title || 'Untitled Project',
            project: getProjectTypeLabel(project.type),
            status: project.status?.toUpperCase() === 'COMPLETED' ? 'Final' : 'In Progress',
            thumbnail: project.coverImage || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
            collaborators: collaborators,
            lastEdited: project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Just now',
            type: project.type,
            isShared: project.isShared || false,
            isPinned: pinnedDocIds.includes(project.id),
            rawData: project
          }
        })

        console.log(`✅ Vault loaded with ${mappedItems.length} projects`)
        setItems(mappedItems.length > 0 ? mappedItems : dummyItems)
      } catch (err) {
        console.error('Failed to fetch projects:', err)
        setItems(dummyItems)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllProjects()
  }, [])

  // Helper function to get user-friendly project type label
  const getProjectTypeLabel = (type) => {
    if (!type) return 'Document'
    const lowerType = type.toLowerCase()
    if (lowerType.includes('presentation')) return 'Presentation'
    if (lowerType.includes('spreadsheet') || lowerType.includes('sheet')) return 'Spreadsheet'
    if (lowerType.includes('chart')) return 'Chart'
    if (lowerType.includes('image')) return 'Image'
    return 'Document'
  }

  // Handle project click - route to appropriate editor
  const handleProjectClick = (card) => {
    if (card?.isDummy) return
    const project = card.rawData
    const type = (project.type || 'document').toLowerCase()

    console.log('🔍 Opening project:', project.id, 'Type:', type)

    // Smart routing based on type
    let path
    if (type.includes('presentation')) {
      path = `/presentation-editor?id=${project.id}`
    } else if (type.includes('chart')) {
      path = `/chart-viewer?id=${project.id}`
    } else if (type.includes('spreadsheet') || type.includes('sheet')) {
      path = `/spreadsheet-editor?id=${project.id}`
    } else if (type.includes('image')) {
      path = `/image-editor?id=${project.id}`
    } else {
      path = `/docs-editor?id=${project.id}`
    }

    router.push(path)
  }

  const handleEdit = (card) => {
    setEditingCard(card)
    setShowEditModal(true)
  }

  const handleEditSave = (payload) => {
    if (!editingCard) return

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== editingCard.id) return item
        const nextTitle = payload?.collabName || item.title
        const nextCover = payload?.coverImage || item.thumbnail
        return {
          ...item,
          title: nextTitle,
          thumbnail: nextCover,
          rawData: {
            ...(item.rawData || {}),
            title: nextTitle,
            coverImage: nextCover,
          },
        }
      })
    )

    setShowEditModal(false)
    setEditingCard(null)
  }

  // Handle pin/unpin
  const handlePin = async (card) => {
    try {
      if (card?.isDummy) {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === card.id
              ? { ...item, isPinned: !item.isPinned }
              : item
          )
        )
        return
      }
      if (card.isPinned) {
        // Unpin
        await api.delete(`/ai/pin/${card.id}`)
        console.log(`📌 Unpinned: ${card.title}`)
      } else {
        // Pin
        const response = await api.post(`/ai/pin/${card.id}`)
        if (response.data.status === 'error') {
          showError(response.data.message)
          return
        }
        console.log(`📌 Pinned: ${card.title}`)
      }

      // Update local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === card.id
            ? { ...item, isPinned: !item.isPinned }
            : item
        )
      )
    } catch (err) {
      console.error('Failed to pin/unpin:', err)
      showError(err.response?.data?.message || 'Failed to pin document')
    }
  }

  // Handle document update from modal (pin, archive, delete)
  const handleUpdate = (updatedCardOrId, action) => {
    if (action === 'delete') {
      // Remove from list
      setItems(prevItems => prevItems.filter(item => item.id !== updatedCardOrId))
    } else if (updatedCardOrId) {
      // Update in list
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === updatedCardOrId.id ? { ...item, ...updatedCardOrId } : item
        )
      )
    }
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredItems = items.filter((card) => {
    if (!normalizedQuery) return true
    const haystack = [
      card.title,
      card.project,
      card.status,
      card.lastEdited,
      card.collaboratorName,
      ...(card.collaborators || []).map((c) => c?.name),
      ...(card.collaborators || []).map((c) => c?.email),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const documentCards = filteredItems.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of vault content
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Background image URL for the header
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/wheel-banner.png`
    : 'http://localhost:3000/assets/banners/wheel-banner.png'

  return (
    <>
      <Head>
        <title>The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <VaultHeader
          title="THE vault"
          backgroundImage={headerBackgroundImage}
          onNewCollabClick={() => setShowCreateModal(true)}
          onUploadClick={() => setShowUploadModal(true)}
        />

        {/* Search and Filters */}
        <VaultSearchBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          query={searchQuery}
          onQueryChange={(next) => {
            setSearchQuery(next)
            setCurrentPage(1)
          }}
        />

        {/* Folders Section */}
        <VaultFolderGrid folders={VAULT_FOLDERS.map((f) => ({ name: f.name, href: getVaultFolderHref(f.id) }))} />

        {/* Documents Grid with Loading State */}
        {isLoading ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg">Loading your projects...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg mb-2">No projects yet.</p>
            <p className="text-gray-400 text-sm">Create your first project to get started!</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg mb-2">No results found.</p>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
          </div>
        ) : (
          <>
            <VaultGrid
              cards={documentCards}
              viewMode={viewMode}
              onCardClick={handleProjectClick}
              onPin={handlePin}
              onUpdate={handleUpdate}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 md:px-[38px] pb-8 w-full">
                <div className="flex items-center justify-between">
                  {/* Left: Showing X-Y of Z items */}
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} projects
                  </p>

                  {/* Center: Page numbers */}
                  <div className="flex items-center gap-2">
                    {/* Previous button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        // Show first page, last page, current page, and pages around current
                        const showPage = page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)

                        // Show ellipsis
                        if (!showPage) {
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 text-gray-400">...</span>
                          }
                          return null
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                      Next
                    </button>
                  </div>

                  {/* Right: Empty div for spacing */}
                  <div className="w-[180px]"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create New Collab Modal */}
      <CreateNewCollabModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(data) => {
          // Handle collab creation - in a real app, this would make an API call
        }}
      />

      {/* Upload File Modal */}
      <UploadFileModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={async (data) => {
          try {
            // Import services dynamically if not already imported at top level
            // but for cleaner code let's assume we can reuse the logic or imports
            // Since we are inside a callback, dynamic import is fine
            const { getPresignedUrl, uploadToS3 } = await import('../services/uploads')
            const { createFileItem, listVaultItems } = await import('../services/vault')

            // Upload each file
            for (const fileItem of data.files) {
              const file = fileItem.file
              if (!file) continue

              // 1. Get presigned URL
              // Use "vaults/documents" folder for now
              const folderPath = 'vaults/documents'
              const { uploadUrl, fileKey } = await getPresignedUrl(file.name, file.type, folderPath)

              // 2. Upload to S3
              await uploadToS3(uploadUrl, file)

              // 3. Create file item in backend
              await createFileItem({
                title: fileItem.name, // Use the name from the modal (which might be renamed) or original file name? Modal allows renaming "Document Name" but that seems to apply to the whole batch or single file?
                // The modal has "Document Name" input which seems to apply if there is 1 file, or maybe it's just a general name.
                // But the loop iterates uploadedFiles.
                // Let's use fileItem.name which comes from the modal's state
                fileKey: fileKey,
                parentId: 'root', // Default to root for now, or match selectedFolder if we had IDs
                status: 'Draft',
                project: data.project !== 'Select project' ? data.project : 'Unassigned',
                size: file.size,
                // thumbnail: ... (we don't have one yet unless generated on client)
              })
            }

            // 4. Refresh list
            // Re-fetch items
            setIsLoading(true)
            const response = await listVaultItems({ parentId: 'root' })
            const mappedItems = (response.data || []).map(item => {
              let thumbnailUrl = item.thumbnail_url
              if (!thumbnailUrl && item.file_key && (item.title?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || item.type === 'image')) {
                thumbnailUrl = `https://manifestr-dev-bucket.s3.ap-southeast-2.amazonaws.com/${item.file_key}`
              }
              return {
                id: item.id,
                title: item.title,
                project: item.project || 'Project: Unknown',
                status: item.status || 'Draft',
                thumbnail: thumbnailUrl || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
                collaborators: [],
                lastEdited: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now',
                type: item.type
              }
            })
            // Filter again
            const newFiles = mappedItems
            // Need to update state in parent scope. simpler to just call the fetch logic again if it was a function.
            // But here I'm duplicating map logic.
            // Ideally refactor fetchVaultItems to be outside useEffect.
            setItems(newFiles)
            setIsLoading(false)

          } catch (err) {
            showError('Upload failed. Please try again.')
            setIsLoading(false) // ensuring loading stops
            throw err // Re-throw to let modal know it failed if needed (though we handle close manually)
          }
        }}
      />

      <CreateNewCollabModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingCard(null)
        }}
        mode="edit"
        initialData={{
          id: editingCard?.id,
          coverImage: editingCard?.thumbnail || null,
          collabName: editingCard?.title || '',
          purposeNotes: '',
          tags: ['campaign', 'social', 'manifestr'],
          inviteEmails: (editingCard?.collaborators || []).map((c) => c.email).filter(Boolean),
          role: 'Editor',
        }}
        onCreate={handleEditSave}
      />
    </>
  )
}

Vault.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}
