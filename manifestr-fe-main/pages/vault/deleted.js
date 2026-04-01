import Head from 'next/head'
import { motion } from 'framer-motion'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import DeletedSearchBar from '../../components/vault/DeletedSearchBar'
import DeletedCard from '../../components/vault/DeletedCard'
import { Trash2 } from 'lucide-react'

export default function VaultDeleted() {
  // Sample data for deleted document cards with images
  const documentCards = [
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      daysLeft: '5',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=215&h=123&fit=crop',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      daysLeft: '5',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=215&h=123&fit=crop',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      daysLeft: '5',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=215&h=123&fit=crop',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      daysLeft: '5',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=215&h=123&fit=crop',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      daysLeft: '5',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=215&h=123&fit=crop',
    },
  ]

  // Background image URL for the header - using the same texture as Figma
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/wheel-banner.png`
    : 'http://localhost:3000/assets/banners/wheel-banner.png'

  const customActionButton = (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-md h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      Delete Permanently
    </motion.button>
  )

  return (
    <>
      <Head>
        <title>Deleted - The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Section with Black Background and Image */}
        <VaultHeader
          title="DELETED"
          description="Auto-deleted after 30 days."
          isBlack={true}
          backgroundImage={headerBackgroundImage}
          customActionButton={customActionButton}
          showActionButtons={true}
        />

        {/* Search and Filters */}
        <DeletedSearchBar />

        {/* Documents Grid */}
        <div className="px-[38px] py-6">
          <div className="grid grid-cols-3 gap-6 lg:gap-8">
            {documentCards.map((card, index) => (
              <DeletedCard key={index} card={card} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

VaultDeleted.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}
