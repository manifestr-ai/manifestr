import Head from 'next/head'
import { useState } from 'react'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import VaultSearchBar from '../../components/vault/VaultSearchBar'
import VaultGrid from '../../components/vault/VaultGrid'

export default function VaultArchived() {
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample data for archived/completed document cards with images
  const documentCards = [
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=4' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=6' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=7' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=8' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=9' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=10' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=11' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=13' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=14' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=15' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=16' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=17' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=18' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=19' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=20' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=21' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Draft',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=22' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=23' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=24' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=25' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=26' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=27' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=28' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaboratorName: 'Tom',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=29' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=30' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=31' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=32' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=33' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=34' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=35' },
      ],
      lastEdited: '2 hours ago',
    },
    // Second row
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Draft',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=36' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=37' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=38' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=39' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=40' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=41' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=42' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaboratorName: 'Jess',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=43' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=44' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=45' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=46' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=47' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=48' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=49' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=50' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=51' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=52' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=53' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=54' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=55' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=56' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaboratorName: 'Tom',
      thumbnail: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=57' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=58' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=59' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=60' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=61' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=62' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=63' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaboratorName: 'Sarah',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=64' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=65' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=66' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=67' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=68' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=69' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=70' },
      ],
      lastEdited: '2 hours ago',
    },
  ]

  // Background image URL for the header - using the same texture as other vault pages
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
        <title>Archived / Completed - The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Section with Background Image */}
        <VaultHeader
          title="THE vault archived/completed"
          description={null}
          isBlack={false}
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

        {/* Documents Grid */}
        {filteredCards.length === 0 ? (
          <div className="px-4 md:px-[38px] py-12 w-full text-center">
            <p className="text-gray-500 text-lg mb-2">No results found.</p>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
          </div>
        ) : (
          <VaultGrid cards={filteredCards} showTitle={false} viewMode={viewMode} />
        )}
      </div>
    </>
  )
}

VaultArchived.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}
