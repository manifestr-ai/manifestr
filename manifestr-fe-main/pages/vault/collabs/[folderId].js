import Head from 'next/head'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import AppHeader from '../../../components/layout/AppHeader'
import SidebarLayout from '../../../components/layout/SidebarLayout'
import VaultHeader from '../../../components/vault/VaultHeader'
import VaultSearchBar from '../../../components/vault/VaultSearchBar'
import VaultFolderGrid from '../../../components/vault/VaultFolderGrid'
import VaultGrid from '../../../components/vault/VaultGrid'
import { VAULT_FOLDERS, VAULT_FOLDER_DESCRIPTION, getVaultFolderById, getVaultFolderDocuments } from '../../../components/vault/vaultFolders'

export default function VaultFolderPage() {
  const router = useRouter()
  const folderId = typeof router.query.folderId === 'string' ? router.query.folderId : ''
  const folder = getVaultFolderById(folderId)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const headerTitle = folder?.headerTitle || (folder?.name ? folder.name.toUpperCase() : 'FOLDER')
  const headerBackgroundImage =
    typeof window !== 'undefined'
      ? `${window.location.origin}/assets/banners/wheel-banner.png`
      : 'http://localhost:3000/assets/banners/wheel-banner.png'

  const allDocs = useMemo(() => getVaultFolderDocuments(folderId), [folderId])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCards = useMemo(() => {
    if (!normalizedQuery) return allDocs
    return allDocs.filter((card) => {
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
  }, [allDocs, normalizedQuery])

  return (
    <>
      <Head>
        <title>{folder?.name || 'Folder'} - The Vault - Manifestr</title>
      </Head>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <VaultHeader
          title={headerTitle}
          description={VAULT_FOLDER_DESCRIPTION}
          isBlack={false}
          backgroundImage={headerBackgroundImage}
          showActionButtons={true}
        />

        <VaultSearchBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          query={searchQuery}
          onQueryChange={setSearchQuery}
        />

        <VaultFolderGrid folders={VAULT_FOLDERS.map((f) => ({ name: f.name, href: `/vault/collabs/${f.id}` }))} />

        {filteredCards.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg mb-2">No results found.</p>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
          </div>
        ) : (
          <VaultGrid cards={filteredCards} showTitle={true} title="All Documents" viewMode={viewMode} />
        )}
      </div>
    </>
  )
}

VaultFolderPage.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>{page}</SidebarLayout>
    </div>
  )
}

