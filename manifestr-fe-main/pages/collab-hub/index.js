import Head from 'next/head'
import { useMemo, useState, useEffect } from 'react'
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
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('All Tools')
  const [collabFilter, setCollabFilter] = useState('All Active Collabs')
  const [sortBy, setSortBy] = useState('Date Created')

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
    project:
      project.project_name ||
      project.projectName ||
      project.project ||
      project.purpose ||
      project.description ||
      `${project.documentCount || 0} projects`,
    status: project.status === 'active' ? 'Active' : 'Archived',
    thumbnail: project.cover_image || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
    collaborators: [], // Will be populated from members if needed
    memberCount: project.memberCount || 0,
    size: project.documentCount || 0,
    createdAt: project.created_at ? new Date(project.created_at).getTime() : 0,
    updatedAt: project.updated_at ? new Date(project.updated_at).getTime() : 0,
    rawData: project,
    lastEdited: project.updated_at ? new Date(project.updated_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'Just now',
  }))

  const filteredCollabCards = useMemo(() => {
    const q = query.trim().toLowerCase()
    let next = collabCards

    if (q) {
      next = next.filter((c) => {
        const haystack = [
          c.title,
          c.status,
          c.project,
          c.lastEdited,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }

    // Collab status / ownership filters (best-effort; uses fields if present)
    if (collabFilter === 'Archived') {
      next = next.filter((c) => c.status === 'Archived')
    } else if (collabFilter === 'All Active Collabs') {
      next = next.filter((c) => c.status === 'Active')
    } else if (collabFilter === 'My Collabs') {
      const myId = (() => {
        try {
          const u = JSON.parse(localStorage.getItem('user'))
          return u?.id
        } catch {
          return null
        }
      })()
      next = next.filter((c) => {
        const ownerId = c.rawData?.owner_id ?? c.rawData?.created_by ?? c.rawData?.user_id
        if (!myId || !ownerId) return true
        return String(ownerId) === String(myId)
      })
    } else if (collabFilter === 'Shared with Me') {
      next = next.filter((c) => {
        const isShared = c.rawData?.is_shared ?? c.rawData?.isShared
        return typeof isShared === 'boolean' ? isShared : true
      })
    }

    // Tool filter (best-effort; only applies if backend provides a tool/type field)
    if (toolFilter && toolFilter !== 'All Tools') {
      next = next.filter((c) => {
        const tool = c.rawData?.tool ?? c.rawData?.type ?? c.rawData?.source_tool ?? c.rawData?.source
        if (!tool) return true
        return String(tool).toLowerCase().includes(String(toolFilter).toLowerCase())
      })
    }

    const byTime = (c) => (c.updatedAt || c.createdAt || 0)
    const byName = (c) => (c.title || '').toLowerCase()
    const bySize = (c) => Number(c.size || 0)

    next = [...next].sort((a, b) => {
      if (sortBy === 'Name') return byName(a).localeCompare(byName(b))
      if (sortBy === 'Size') return bySize(b) - bySize(a)
      if (sortBy === 'Last Edited') return byTime(b) - byTime(a)
      // Date Created (default)
      return (b.createdAt || 0) - (a.createdAt || 0)
    })

    return next
  }, [collabCards, collabFilter, query, sortBy, toolFilter])

  const handleResetFilters = () => {
    setQuery('')
    setToolFilter('All Tools')
    setCollabFilter('All Active Collabs')
    setSortBy('Date Created')
  }

  const headerBackgroundImage =
    typeof window !== 'undefined'
      ? `https://res.cloudinary.com/dlifgfg6m/image/upload/v1777381205/Rectangle_8_mbdw84.png`
      : 'https://res.cloudinary.com/dlifgfg6m/image/upload/v1777381205/Rectangle_8_mbdw84.png'

  return (
    <>
      <Head>
        <title>Collab Hub - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {!viewingMembers && (
          <>
            <VaultHeader
              title="Collabs"
             
              description={(
                <span className="text-[#71717b] font-inter text-[18px] leading-[28px]">
                  Collabs are shared workspaces to keep people <br></br> + documents together, all in one view.
                </span>
              )}
              isBlack={false}
              align="end"
              contentClassName="md:px-[40px] md:pt-[65px] md:pb-[56px]"
              backgroundClassName="bg-[#dddcdd]"
              backgroundImageClassName="opacity-[0.99]"
              overlayClassName="!hidden"
              backgroundImage={headerBackgroundImage}
              showActionButtons={true}
              customActionButton={
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex shrink-0 w-[132.344px] items-center justify-center gap-2 rounded-[6px] bg-white px-[16px] py-[10px] text-[14px] font-medium leading-[20px] text-black whitespace-nowrap border border-[#e4e4e7] shadow-sm hover:bg-[#f4f4f5] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Collab
                </motion.button>
              }
            />

            <CollabsSearchBar
              placeholder="Search collabs..."
              viewMode={viewMode}
              setViewMode={setViewMode}
              query={query}
              onQueryChange={setQuery}
              selectedTool={toolFilter}
              onToolChange={setToolFilter}
              selectedCollab={collabFilter}
              onCollabChange={setCollabFilter}
              selectedSort={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
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
                cards={filteredCollabCards}
                showTitle={false}
                viewMode={viewMode}
                listVariant="collab"
                showListHeader={false}
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
