import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import VaultSearchBar from '../../components/vault/VaultSearchBar'
import VaultGrid from '../../components/vault/VaultGrid'
import api from '../../lib/api'

export default function VaultRecents() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState('grid')
  const [documentCards, setDocumentCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch recent activity (last 12 used projects)
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setIsLoading(true)

        // Fetch last 12 accessed/edited documents
        const response = await api.get('/ai/recent-activity')

        if (response.data.status === 'success') {
          const projects = response.data.data

          // 🚀 BATCH FETCH: Get ALL collaborators in ONE API call!
          console.log(`🚀 BATCH: Fetching collaborators for ${projects.length} recent projects...`)
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
              status: project.status?.toUpperCase() === 'COMPLETED' ? 'Final' : 'In Progress',
              thumbnail: project.coverImage || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
              collaborators: collaborators,
              lastEdited: project.lastAccessed
                ? getRelativeTime(project.lastAccessed)
                : 'Just now',
              type: project.type,
              isShared: project.isShared || false,
              rawData: project
            }
          })

          setDocumentCards(mappedItems)
        }
      } catch (err) {
        console.error('Failed to fetch recent activity:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentActivity()
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

  // Helper function to convert timestamp to relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return past.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
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

  // Background image URL for the header
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/wheel-banner.png`
    : 'http://localhost:3000/assets/banners/wheel-banner.png'

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCards = documentCards.filter((card) => {
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

  return (
    <>
      <Head>
        <title>Recents - The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Section */}
        <VaultHeader
          title="THE vault recents"
          description="Your secure workspace for every project, deck & document."
          backgroundImage={headerBackgroundImage}
          showActionButtons={false}
        />

        {/* Search and Filters */}
        <VaultSearchBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          query={searchQuery}
          onQueryChange={setSearchQuery}
        />

        {/* Documents Grid - Show loading, empty, or data */}
        {isLoading ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg">Loading recent activity...</p>
          </div>
        ) : documentCards.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg mb-2">No recent activity.</p>
            <p className="text-gray-400 text-sm">Start working on projects to see them here!</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg mb-2">No results found.</p>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
          </div>
        ) : (
          <VaultGrid
            cards={filteredCards}
            showTitle={false}
            viewMode={viewMode}
            onCardClick={handleProjectClick}
          />
        )}
      </div>
    </>
  )
}

VaultRecents.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}
