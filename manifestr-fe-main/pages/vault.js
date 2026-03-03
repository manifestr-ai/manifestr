import Head from 'next/head'
import { useState, useEffect } from 'react'
import AppHeader from '../components/layout/AppHeader'
import SidebarLayout from '../components/layout/SidebarLayout'
import VaultHeader from '../components/vault/VaultHeader'
import VaultSearchBar from '../components/vault/VaultSearchBar'
import VaultFolderGrid from '../components/vault/VaultFolderGrid'
import VaultGrid from '../components/vault/VaultGrid'
import CreateNewCollabModal from '../components/vault/CreateNewCollabModal'
import UploadFileModal from '../components/vault/UploadFileModal'

export default function Vault() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  // State for vault items
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch vault items on mount
  useEffect(() => {
    const fetchVaultItems = async () => {
      try {
        setIsLoading(true)
        // Dynamically import to ensure we use the client-side module
        const { listVaultItems } = await import('../services/vault')

        // Fetch items from the root folder
        const response = await listVaultItems({ parentId: 'root' })

        // Map API response to UI card format
        // API returns: { id, title, type, project, createdAt, file_key, thumbnail_url }
        // UI expects: { title, project, status, thumbnail, collaborators, lastEdited }
        const mappedItems = (response.data || []).map(item => {
          let thumbnailUrl = item.thumbnail_url
          // If no thumbnail URL provided but we have a file key and it's an image, construct the S3 URL
          if (!thumbnailUrl && item.file_key && (item.title?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || item.type === 'image')) {
            // Assuming public bucket or we can access it.
            // Based on previous error log: https://manifestr-dev-bucket.s3.ap-southeast-2.amazonaws.com/vaults/documents/...
            thumbnailUrl = `https://manifestr-dev-bucket.s3.ap-southeast-2.amazonaws.com/${item.file_key}`
          }

          return {
            id: item.id,
            title: item.title,
            project: item.project || 'Project: Unknown',
            status: item.status || 'Draft',
            thumbnail: thumbnailUrl || 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop', // Fallback
            collaborators: [], // API doesn't return collaborators yet
            lastEdited: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now',
            type: item.type
          }
        })

        setItems(mappedItems)
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchVaultItems()
  }, [])

  // Filter items based on view/search if needed, or pass all to Grid
  // For now, assuming API returns mixed content or we filter client side
  const documentCards = items.filter(item => item.type === 'file')

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

        {/* Documents Grid */}
        <VaultGrid cards={documentCards} viewMode={viewMode} />
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

