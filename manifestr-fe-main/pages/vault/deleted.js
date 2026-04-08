import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import DeletedCard from '../../components/vault/DeletedCard'
import { Trash2, RotateCcw, X } from 'lucide-react'
import api from '../../lib/api'
import { useSidebar } from '../../contexts/SidebarContext'

export default function VaultDeleted() {
  const [documentCards, setDocumentCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const { isSidebarOpen } = useSidebar()

  const showVaultSidebar = isSidebarOpen('vault')
  const showCollabsFolderSidebar = isSidebarOpen('collabsFolder')
  const showCollabHubSidebar = isSidebarOpen('collabHub')

  // Count how many sidebars are open
  const openSidebarsCount = [showVaultSidebar, showCollabsFolderSidebar, showCollabHubSidebar].filter(Boolean).length

  // When 2 or more sidebars are open, show 3 columns, otherwise use responsive grid
  const gridCols = openSidebarsCount >= 2
    ? 'grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  // Fetch deleted documents
  useEffect(() => {
    fetchDeletedDocuments()
  }, [])

  const fetchDeletedDocuments = async () => {
    try {
      setIsLoading(true)

      // Fetch deleted documents
      const response = await api.get('/ai/deleted')

      if (response.data.status === 'success') {
        const projects = response.data.data

        // Map projects
        const mappedItems = projects.map(project => {
          // Calculate days since deletion
          const deletedDate = new Date(project.deletedAt)
          const daysSinceDeleted = Math.floor((new Date() - deletedDate) / (1000 * 60 * 60 * 24))
          const daysLeft = Math.max(0, 30 - daysSinceDeleted)

          return {
            id: project.id,
            title: project.title || 'Untitled Project',
            project: getProjectTypeLabel(project.type),
            status: 'Deleted',
            thumbnail: project.coverImage || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
            type: project.type,
            isDeleted: true,
            deletedAt: project.deletedAt,
            daysLeft: daysLeft,
            rawData: project
          }
        })

        setDocumentCards(mappedItems)
      }
    } catch (err) {
      console.error('Failed to fetch deleted documents:', err)
      showToast('Failed to load deleted documents', 'error')
    } finally {
      setIsLoading(false)
    }
  }

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

  // Handle restore
  const handleRestore = async (card) => {
    try {
      await api.post(`/ai/restore/${card.id}`)
      console.log(`♻️ Restored: ${card.title}`)

      // Remove from local state
      setDocumentCards(prevCards =>
        prevCards.filter(item => item.id !== card.id)
      )

      showToast('Document restored successfully!', 'success')
    } catch (err) {
      console.error('Failed to restore:', err)
      showToast(err.response?.data?.message || 'Failed to restore document', 'error')
    }
  }

  // Handle permanent delete (not implemented yet, but placeholder)
  const handlePermanentDelete = async (card) => {
    showToast('Permanent delete coming soon - documents auto-delete after 30 days', 'info')
  }

  // Handle restore all
  const handleRestoreAll = async () => {
    if (!confirm(`Restore all ${documentCards.length} deleted documents?`)) return

    try {
      await Promise.all(
        documentCards.map(card => api.post(`/ai/restore/${card.id}`))
      )
      setDocumentCards([])
      showToast('All documents restored successfully!', 'success')
    } catch (err) {
      showToast('Failed to restore all documents', 'error')
    }
  }

  // Background image URL for the header
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/Rectangle-4.png`
    : 'http://localhost:3000/assets/banners/Rectangle-4.png'

  // Custom action button for restore all
  const customActionButton = documentCards.length > 0 && (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleRestoreAll}
      className="bg-white rounded-md h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
    >
      <RotateCcw className="w-4 h-4" />
      Restore All
    </motion.button>
  )

  return (
    <>
      <Head>
        <title>Deleted - The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Section */}
        <VaultHeader
          title="DELETED"
          description="Auto-deleted permanently after 30 days"
          backgroundImage={headerBackgroundImage}
          showActionButtons={!!customActionButton}
          customActionButton={customActionButton}
        />

        {/* Documents Grid - Show loading, empty, or data */}
        {isLoading ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg">Loading deleted documents...</p>
          </div>
        ) : documentCards.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Trash is empty.</p>
            <p className="text-gray-400 text-sm">Deleted documents will appear here and auto-delete after 30 days.</p>
          </div>
        ) : (
          <>
            {/* Warning Banner */}
            <div className="px-4 md:px-[38px] pt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold leading-[20px] text-red-900">
                    Documents will be permanently deleted after 30 days
                  </p>
                  <p className="text-[13px] leading-[18px] text-red-700 mt-1">
                    Restore documents before they're gone forever. Use the "Restore" button on each card.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Grid with DeletedCard */}
            <div className="px-4 md:px-[38px] py-6 w-full">
              <div className={`grid ${gridCols} gap-6 lg:gap-8 justify-items-center`}>
                {documentCards.map((card, index) => (
                  <DeletedCard
                    key={card.id}
                    card={card}
                    index={index}
                    onRestore={handleRestore}
                    onPermanentDelete={handlePermanentDelete}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 bg-white rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 px-4 py-3 min-w-[320px]"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              toast.type === 'success' ? 'bg-green-500' : 
              toast.type === 'error' ? 'bg-red-500' : 
              'bg-blue-500'
            }`} />
            <p className="text-[14px] font-medium text-gray-900 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

VaultDeleted.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}
