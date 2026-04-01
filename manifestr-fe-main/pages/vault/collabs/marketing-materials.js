import Head from 'next/head'
import AppHeader from '../../../components/layout/AppHeader'
import SidebarLayout from '../../../components/layout/SidebarLayout'
import VaultHeader from '../../../components/vault/VaultHeader'
import VaultSearchBar from '../../../components/vault/VaultSearchBar'
import VaultFolderGrid from '../../../components/vault/VaultFolderGrid'
import VaultGrid from '../../../components/vault/VaultGrid'

export default function MarketingMaterials() {
  // Sample data for folders
  const folders = [
    { name: 'Marketing Materials' },
    { name: 'Finance Reports' },
    { name: 'Presentations' },
    { name: 'Brand Assets' },
    { name: 'Marketing Materials' },
    { name: 'Brand Assets' },
  ]

  // Sample data for document cards matching Figma design
  const documentCards = [
    {
      title: 'Q3 Product Launch Strategy',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
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
      title: 'Product Launch Deck',
      project: 'Project: Brand Refresh',
      status: 'In Review',
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
      title: 'Financial Report Q3',
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
      title: 'Annual Report 2025',
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
    // Second row
    {
      title: 'Q3 Product Launch Strategy',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
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
      title: 'Product Launch Deck',
      project: 'Project: Brand Refresh',
      status: 'In Review',
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
      title: 'Financial Report Q3',
      project: 'Project: Brand Refresh',
      status: 'Final',
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
      title: 'Annual Report 2025',
      project: 'Project: Brand Refresh',
      status: 'Draft',
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
    // Third row
    {
      title: 'Q3 Product Launch Strategy',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
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
    {
      title: 'Product Launch Deck',
      project: 'Project: Brand Refresh',
      status: 'In Review',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=71' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=72' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=73' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=74' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=75' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=76' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=77' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Financial Report Q3',
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=78' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=79' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=80' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=81' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=82' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=83' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=84' },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Annual Report 2025',
      project: 'Project: Brand Refresh',
      status: 'Draft',
      thumbnail: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=215&h=123&fit=crop',
      collaborators: [
        { name: 'John', avatar: 'https://i.pravatar.cc/150?img=85' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=86' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=87' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=88' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?img=89' },
        { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=90' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=91' },
      ],
      lastEdited: '2 hours ago',
    },
  ]

  // Background image URL for the header
  const headerBackgroundImage = typeof window !== 'undefined' 
    ? `${window.location.origin}/assets/banners/wheel-banner.png`
    : 'http://localhost:3000/assets/banners/wheel-banner.png'

  return (
    <>
      <Head>
        <title>Marketing Materials - Collabs - The Vault - Manifestr</title>
      </Head>
      <div className="min-h-screen bg-[#f4f4f4]">
        <AppHeader />
        
        <SidebarLayout>
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header Section with Background Image */}
            <VaultHeader 
              title="MARKETING material"
              description="Your secure workspace for every project, deck & document."
              isBlack={false}
              backgroundImage={headerBackgroundImage}
              showActionButtons={true}
            />

            {/* Search and Filters */}
            <VaultSearchBar />

            {/* Folders Section */}
            <VaultFolderGrid folders={folders} />

            {/* Documents Grid */}
            <VaultGrid cards={documentCards} showTitle={true} title="All Documents" />
          </div>
        </SidebarLayout>
      </div>
    </>
  )
}
