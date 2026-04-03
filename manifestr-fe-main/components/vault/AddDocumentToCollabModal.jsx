import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Loader2, FileText, Search } from 'lucide-react'
import api from '../../lib/api'

export default function AddDocumentToCollabModal({ isOpen, onClose, collabProjectId, onDocumentAdded }) {
  const [availableDocuments, setAvailableDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDocuments()
    }
  }, [isOpen])

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const fetchAvailableDocuments = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all user's documents (owned + shared) with high limit
      let owned = []
      let shared = []
      
      try {
        const ownedRes = await api.get('/ai/recent-generations?limit=1000')
        owned = ownedRes.data.status === 'success' ? ownedRes.data.data : []
      } catch (err) {
        console.warn('⚠️ Failed to fetch owned documents:', err)
      }
      
      try {
        const sharedRes = await api.get('/collaborations/shared-with-me?limit=1000')
        shared = sharedRes.data.status === 'success' ? sharedRes.data.data : []
      } catch (err) {
        console.warn('⚠️ Failed to fetch shared documents:', err)
      }
      
      const allDocs = [...owned, ...shared]
      console.log(`📊 Fetched ${owned.length} owned + ${shared.length} shared = ${allDocs.length} total documents`)

      // Get documents already in this collab
      const collabDocsRes = await api.get(`/collab-projects/${collabProjectId}/documents`)
      const existingDocIds = collabDocsRes.data.status === 'success' 
        ? collabDocsRes.data.data.map(d => d.id) 
        : []

      console.log(`📊 ${existingDocIds.length} documents already in this collab`)

      // Filter out documents already in collab
      const availableDocs = allDocs
        .filter(doc => !existingDocIds.includes(doc.id))
        .map(doc => ({
          id: doc.id,
          title: doc.title || doc.input_data?.title || doc.inputData?.title || 'Untitled',
          type: doc.type || doc.output_type || doc.outputType || doc.input_data?.output || 'document',
          coverImage: doc.cover_image || doc.coverImage || doc.input_data?.cover_image || null,
          isShared: doc.isShared || doc.is_shared || false
        }))

      console.log(`✅ ${availableDocs.length} documents available to add`)
      setAvailableDocuments(availableDocs)
    } catch (error) {
      console.error('❌ Failed to fetch documents:', error)
      showToast('Failed to fetch documents', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDocument = async (documentId) => {
    try {
      setIsAdding(true)

      const response = await api.post(`/collab-projects/${collabProjectId}/documents`, {
        documentId
      })

      if (response.data.status === 'success') {
        showToast('Project added to collab!', 'success')
        
        // Remove from available list
        setAvailableDocuments(prev => prev.filter(d => d.id !== documentId))
        
        if (onDocumentAdded) {
          setTimeout(() => {
            onDocumentAdded()
          }, 500)
        }
      }
    } catch (error) {
      console.error('❌ Failed to add document:', error)
      showToast(error.response?.data?.message || 'Failed to add project', 'error')
    } finally {
      setIsAdding(false)
    }
  }

  const filteredDocs = availableDocuments.filter(doc => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return doc.title.toLowerCase().includes(query) || doc.type.toLowerCase().includes(query)
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-[#e4e4e7] rounded-lg w-full max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-[#e4e4e7] p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                  Add Project to Collab
                </h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5] transition-colors"
                >
                  <X className="w-5 h-5 text-[#71717a]" />
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#e4e4e7]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full h-[36px] pl-10 pr-3 bg-white border border-[#e4e4e7] rounded-md text-[14px] leading-[20px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-4" />
                  <p className="text-gray-500 text-sm">Loading documents...</p>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm mb-1">
                    {searchQuery ? 'No projects found' : 'No projects available'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {searchQuery ? 'Try a different search term' : 'All your projects are already in this collab'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-[#f9fafb] hover:bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {doc.coverImage ? (
                          <img
                            src={doc.coverImage}
                            alt={doc.title}
                            className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-[#71717a]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium text-[#18181b] truncate">
                            {doc.title}
                          </p>
                          <p className="text-[12px] text-[#71717a]">
                            {doc.type} {doc.isShared && '• Shared'}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleAddDocument(doc.id)}
                        disabled={isAdding}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-[#18181b] text-white rounded-md text-[12px] font-medium flex items-center gap-1 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {toast.show && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-4 right-4"
                >
                  <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                    toast.type === 'error' ? 'bg-red-500' : 
                    toast.type === 'success' ? 'bg-green-500' : 
                    'bg-blue-500'
                  } text-white`}>
                    <span className="text-sm font-medium">{toast.message}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
