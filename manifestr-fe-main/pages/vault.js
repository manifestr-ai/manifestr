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

export default function Vault() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  // State for vault items
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

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

        // Fetch collaborators for all projects in parallel (batched)
        console.log(`📊 Fetching collaborators for ${allProjects.length} projects...`)

        const mappedItems = await Promise.all(
          allProjects.map(async (project) => {
            // Fetch collaborators for this project
            let collaborators = []
            try {
              const collabRes = await api.get(`/collaborations/${project.id}/collaborators`)
              if (collabRes.data.status === 'success') {
                // Map to VaultCard format: { name, avatar }
                collaborators = (collabRes.data.data || []).map(collab => {
                  const user = collab.users || {}
                  const firstName = user.first_name || ''
                  const lastName = user.last_name || ''
                  const fullName = `${firstName} ${lastName}`.trim()
                  const displayName = fullName || user.email?.split('@')[0] || 'User'

                  return {
                    name: displayName,
                    avatar: null, // Can add avatar URL if available in future
                    role: collab.role, // owner, editor, viewer
                    email: user.email
                  }
                })

                console.log(`✅ ${project.title}: ${collaborators.length} collaborators`)
              }
            } catch (err) {
              // Silently continue without collaborators if API fails
              console.log(`⚠️ No collaborators for ${project.id}`)
            }

            return {
              id: project.id,
              title: project.title || 'Untitled Project',
              project: getProjectTypeLabel(project.type),
              status: project.status?.toUpperCase() === 'COMPLETED' ? 'Final' : 'In Progress',
              thumbnail: project.coverImage || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
              collaborators: collaborators, // Real collaborators (owner + shared users)!
              lastEdited: project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Just now',
              type: project.type,
              isShared: project.isShared || false,
              rawData: project
            }
          })
        )

        console.log(`✅ Vault loaded with ${mappedItems.length} projects`)
        setItems(mappedItems)
      } catch (err) {
        console.error('Failed to fetch projects:', err)
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

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const documentCards = items.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of vault content
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Background image URL for the header
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/abstract-white-wave.png`
    : 'http://localhost:3000/assets/banners/abstract-white-wave.png'

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
        />

        {/* Folders Section - Hidden for now */}
        {/* <VaultFolderGrid /> */}

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
        ) : (
          <>
            <VaultGrid
              cards={documentCards}
              viewMode={viewMode}
              onCardClick={handleProjectClick}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 md:px-[38px] pb-8 w-full">
                <div className="flex items-center justify-between">
                  {/* Left: Showing X-Y of Z items */}
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, items.length)} of {items.length} projects
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
            alert('Upload failed. Please try again.')
            setIsLoading(false) // ensuring loading stops
            throw err // Re-throw to let modal know it failed if needed (though we handle close manually)
          }
        }}
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

