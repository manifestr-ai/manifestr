import Head from 'next/head'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import AppHeader from '../../../components/layout/AppHeader'
import SidebarLayout from '../../../components/layout/SidebarLayout'
import VaultHeader from '../../../components/vault/VaultHeader'
import VaultSearchBar from '../../../components/vault/VaultSearchBar'
import VaultFolderGrid from '../../../components/vault/VaultFolderGrid'
import VaultGrid from '../../../components/vault/VaultGrid'
import AddDocumentToCollabModal from '../../../components/vault/AddDocumentToCollabModal'
import InviteMemberModal from '../../../components/vault/InviteMemberModal'
import { Loader2, Users, FileText, UserPlus, FilePlus, Settings } from 'lucide-react'
import api from '../../../lib/api'
import { VAULT_FOLDERS, VAULT_FOLDER_DESCRIPTION, getVaultFolderById, getVaultFolderDocuments, getCollabFolderHref } from '../../../components/vault/vaultFolders'

export default function CollabDetailPage() {
  const router = useRouter()
  const { folderId } = router.query
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [collabData, setCollabData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documentCards, setDocumentCards] = useState([])
  const [showAddDocModal, setShowAddDocModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    if (typeof folderId !== 'string' || folderId.length === 0) return

    const vaultFolder = getVaultFolderById(folderId)
    if (vaultFolder) {
      setCollabData({
        name: vaultFolder.name,
        purpose_notes: VAULT_FOLDER_DESCRIPTION,
        cover_image: null,
      })
      setDocumentCards(getVaultFolderDocuments(folderId))
      setIsLoading(false)
      return
    }

    fetchCollabDetails(folderId)
  }, [router.isReady, folderId])

  const fetchCollabDetails = async (id) => {
    try {
      setIsLoading(true)
      console.log(`📊 Fetching collab details for: ${id}`)

      const response = await api.get(`/collab-projects/${id}`)

      if (response.data.status === 'success') {
        const data = response.data.data
        console.log(`✅ Collab loaded: ${data.name}`, data)
        setCollabData(data)

        // Map documents to card format
        const mappedDocs = (data.documents || []).map(doc => {
          // Get collaborators (members of this collab who can access this doc)
          const collabMembers = (data.members || []).map(member => {
            const user = member.users || {}
            const firstName = user.first_name || ''
            const lastName = user.last_name || ''
            const fullName = `${firstName} ${lastName}`.trim()
            const displayName = fullName || user.email?.split('@')[0] || 'User'

            return {
              name: displayName,
              avatar: null,
              role: member.role,
              email: user.email
            }
          })

          return {
            id: doc.id,
            title: doc.title || 'Untitled',
            project: `Collab: ${data.name}`,
            status: doc.status || 'Draft',
            thumbnail: doc.coverImage || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
            collaborators: collabMembers,
            lastEdited: doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'Just now',
            type: doc.type,
            rawData: doc
          }
        })

        setDocumentCards(mappedDocs)
      }
    } catch (error) {
      console.error('❌ Failed to fetch collab details:', error)
      setCollabData(null)
      setDocumentCards([])
    } finally {
      setIsLoading(false)
    }
  }

  const isVaultFolder = typeof folderId === 'string' && !!getVaultFolderById(folderId)
  const vaultFolder = typeof folderId === 'string' ? getVaultFolderById(folderId) : null
  const hideVaultFolderHeaderChrome =
    isVaultFolder &&
    typeof folderId === 'string' &&
    ['marketing-materials', 'finance-reports', 'presentations', 'client-assets'].includes(folderId)

  const handleProjectClick = (card) => {
    if (!card?.id) return
    if (card?.isDummy) return

    const type = (card?.rawData?.type || card?.type || 'document').toLowerCase()

    if (type.includes('presentation')) {
      router.push(`/presentation-editor?id=${card.id}`)
    } else if (type.includes('chart')) {
      router.push(`/chart-viewer?id=${card.id}`)
    } else if (type.includes('spreadsheet') || type.includes('sheet')) {
      router.push(`/spreadsheet-editor?id=${card.id}`)
    } else if (type.includes('image')) {
      router.push(`/image-editor?id=${card.id}`)
    } else {
      router.push(`/docs-editor?id=${card.id}`)
    }
  }

  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/wheel-banner.png`
    : 'http://localhost:3000/assets/banners/wheel-banner.png'

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCards = useMemo(() => {
    if (!normalizedQuery) return documentCards
    return documentCards.filter((card) => {
      const haystack = [
        card.title,
        card.project,
        card.status,
        card.lastEdited,
        ...(card.collaborators || []).map((c) => c?.name),
        ...(card.collaborators || []).map((c) => c?.email),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [documentCards, normalizedQuery])

  return (
    <>
      <Head>
        <title>{collabData?.name || 'Collab'} - The Vault - Manifestr</title>
      </Head>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <VaultHeader
          title={(isVaultFolder ? vaultFolder?.headerTitle : collabData?.name?.toUpperCase()) || 'COLLAB PROJECT'}
          description={
            (isVaultFolder
              ? hideVaultFolderHeaderChrome
                ? null
                : VAULT_FOLDER_DESCRIPTION
              : collabData?.purpose_notes) || null
          }
          isBlack={false}
          backgroundImage={(isVaultFolder ? headerBackgroundImage : collabData?.cover_image) || headerBackgroundImage}
          showActionButtons={isVaultFolder && !hideVaultFolderHeaderChrome}
        />

        {isLoading ? (
          <div className="px-4 md:px-[38px] py-12 w-full flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 text-lg">Loading collab...</p>
          </div>
        ) : !collabData ? (
          <div className="px-4 md:px-[38px] py-12 w-full flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Collab not found</p>
          </div>
        ) : (
          <>
            {/* Collab Info Bar */}
            {!isVaultFolder && (
              <div className="px-4 md:px-[38px] py-4 bg-white border-b border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#71717a]" />
                      <span className="text-[14px] font-medium text-[#18181b]">
                        {collabData.members?.length || 0} Members
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#71717a]" />
                      <span className="text-[14px] font-medium text-[#18181b]">
                        {documentCards.length} Projects
                      </span>
                    </div>
                    {collabData.tags && collabData.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        {collabData.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-[#f4f4f5] text-[#52525b] text-[12px] font-medium rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setShowAddDocModal(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-2 bg-[#18181b] text-white rounded-md text-[14px] font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <FilePlus className="w-4 h-4" />
                      New Project
                    </motion.button>
                    <motion.button
                      onClick={() => setShowInviteModal(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-2 bg-white border border-[#e4e4e7] text-[#18181b] rounded-md text-[14px] font-medium flex items-center gap-2 hover:bg-[#f4f4f5] transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Invite
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            <VaultSearchBar
              viewMode={viewMode}
              setViewMode={setViewMode}
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />

            {isVaultFolder && (
              <VaultFolderGrid
                folders={VAULT_FOLDERS.map((f) => ({
                  id: f.id,
                  name: f.name,
                  href: getCollabFolderHref(f.id),
                }))}
              />
            )}

            {filteredCards.length === 0 ? (
              <div className="px-4 md:px-[38px] py-12 w-full text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  {normalizedQuery ? 'No results found' : isVaultFolder ? 'No documents in this folder yet' : 'No projects in this collab yet'}
                </p>
                {!normalizedQuery && (
                  <p className="text-gray-400 text-sm">Add your first project to get started!</p>
                )}
              </div>
            ) : (
              <VaultGrid
                cards={filteredCards}
                showTitle={false}
                viewMode={viewMode}
                onCardClick={handleProjectClick}
              />
            )}
          </>
        )}
      </div>

      {/* Add Document Modal */}
      {!isVaultFolder && (
        <AddDocumentToCollabModal
          isOpen={showAddDocModal}
          onClose={() => setShowAddDocModal(false)}
          collabProjectId={folderId}
          onDocumentAdded={() => {
            setShowAddDocModal(false)
            if (typeof folderId === 'string') fetchCollabDetails(folderId)
          }}
        />
      )}

      {/* Invite Member Modal */}
      {!isVaultFolder && (
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          collabProjectId={folderId}
          collabName={collabData?.name || 'Collab'}
          onMemberAdded={() => {
            setShowInviteModal(false)
            if (typeof folderId === 'string') fetchCollabDetails(folderId)
          }}
        />
      )}
    </>
  )
}

CollabDetailPage.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>{page}</SidebarLayout>
    </div>
  )
}
