import Head from 'next/head'
import { useState } from 'react'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import CollabsSearchBar from '../../components/vault/CollabsSearchBar'
import VaultGrid from '../../components/vault/VaultGrid'
import CreateNewCollabModal from '../../components/vault/CreateNewCollabModal'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function CollabHub() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState('list')

  const documentCards = [
    {
      title: 'Brand Guidelines 2025',
      project: 'Project: Brand Refresh',
      status: 'Archived',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
      collaborators: [],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Customer Research Insights',
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=430&h=246&fit=crop',
      collaborators: [],
      lastEdited: '2 hours ago',
    },
  ]

  const headerBackgroundImage =
    typeof window !== 'undefined'
      ? `${window.location.origin}/assets/banners/abstract-white-wave.png`
      : 'http://localhost:3000/assets/banners/abstract-white-wave.png'

  return (
    <>
      <Head>
        <title>Collab Hub - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <VaultHeader
          title={<span className="text-[#18181b] font-bold">Collabs</span>}
          description="Collabs are shared workspaces to keep people + documents together, all in one view."
          isBlack={false}
          backgroundImage={headerBackgroundImage}
          showActionButtons={true}
          customActionButton={
            <motion.button
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#18181b] text-white rounded-md h-[40px] px-4 flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity w-full md:w-auto"
            >
              <Plus className="w-4 h-4" />
              New Collab
            </motion.button>
          }
        />

        <CollabsSearchBar
          placeholder="Search style guides..."
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <VaultGrid cards={documentCards} showTitle={false} viewMode={viewMode} />

        <CreateNewCollabModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
          }}
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
