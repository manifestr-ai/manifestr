import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import VaultSearchBar from '../../components/vault/VaultSearchBar'
import VaultGrid from '../../components/vault/VaultGrid'
import api from '../../lib/api'
import { useToast } from '../../components/ui/Toast'

export default function VaultArchived() {
  const router = useRouter()
  const { error: showError } = useToast()
  const [viewMode, setViewMode] = useState('grid')
  const [documentCards, setDocumentCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch archived documents
  useEffect(() => {
    const fetchArchivedDocuments = async () => {
      try {
        setIsLoading(true)

        // Fetch archived documents
        const response = await api.get('/ai/archived')

        if (response.data.status === 'success') {
          const projects = response.data.data

          // 🚀 BATCH FETCH: Get ALL collaborators in ONE API call!
          console.log(`🚀 BATCH: Fetching collaborators for ${projects.length} archived projects...`)
          const startTime = Date.now()
          
          let collaboratorsByDocId = {}
          try {
            const docIds = projects.map(p => p.id)
            const batchRes = await api.post('/collaborations/batch-collaborators', { documentIds: docIds })
            
            if (batchRes.data.status === 'success') {
              collaboratorsByDocId = batchRes.data.data
              console.log(`✅ BATCH: Fetched in ${Date.now() - startTime}ms`)
            }
          } catch (err) {
            console.log('⚠️ Batch fetch failed, collaborators will be empty')
          }

          // Map projects with their collaborators (NO MORE API CALLS!)
          const mappedItems = projects.map(project => {
            // Get collaborators from batch response
            const collabsData = collaboratorsByDocId[project.id] || []
            
            // Map to VaultCard format
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
              status: 'Archived',
              thumbnail: project.coverImage || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
              collaborators: collaborators,
              lastEdited: project.updatedAt
                ? new Date(project.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'Just now',
              type: project.type,
              isShared: project.isShared || false,
              isArchived: true,
              rawData: project
            }
          })

          setDocumentCards(mappedItems)
        }
      } catch (err) {
        console.error('Failed to fetch archived documents:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArchivedDocuments()
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

    let path
    if (type.includes('presentation')) {
      path = `/presentation-editor?id=${project.id}`
    } else if (type.includes('chart')) {
      path = `/chart-editor?id=${project.id}`
    } else if (type.includes('spreadsheet') || type.includes('sheet')) {
      path = `/spreadsheet-editor?id=${project.id}`
    } else if (type.includes('image')) {
      path = `/image-editor?id=${project.id}`
    } else {
      path = `/docs-editor?id=${project.id}`
    }

    router.push(path)
  }

  // Handle unarchive
  const handleUnarchive = async (card) => {
    try {
      await api.post(`/ai/unarchive/${card.id}`)
      console.log(`📦 Unarchived: ${card.title}`)

      // Remove from local state
      setDocumentCards(prevCards =>
        prevCards.filter(item => item.id !== card.id)
      )
    } catch (err) {
      console.error('Failed to unarchive:', err)
      showError(err.response?.data?.message || 'Failed to unarchive document')
    }
  }

  // Background image URL for the header (dark marble wave - matches Figma)
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/abstract-black-wave.png`
    : 'http://localhost:3000/assets/banners/abstract-black-wave.png'

  return (
    <>
      <Head>
        <title>Archived - The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Section */}
        <VaultHeader
          title="THE vault ARCHIVED/COMPLETED"
          description={null}
          backgroundImage={headerBackgroundImage}
          isBlack={true}
          showActionButtons={false}
        />

        {/* Search and Filters */}
        <VaultSearchBar
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Documents Grid - Show loading, empty, or data */}
        {isLoading ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg">Loading archived documents...</p>
          </div>
        ) : documentCards.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg mb-2">No archived documents.</p>
            <p className="text-gray-400 text-sm">Archive documents from the Vault to hide them here!</p>
          </div>
        ) : (
          <VaultGrid
            cards={documentCards}
            showTitle={false}
            viewMode={viewMode}
            onCardClick={handleProjectClick}
          />
        )}
      </div>
    </>
  )
}

VaultArchived.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}
