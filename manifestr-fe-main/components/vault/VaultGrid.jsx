import VaultCard from './VaultCard'
import { useSidebar } from '../../contexts/SidebarContext'
import { useState } from 'react'
import DocumentPreviewModal from './DocumentPreviewModal'

export default function VaultGrid({ cards, showTitle = true, title = 'All Documents', viewMode = 'grid', onCardClick = null }) {
  const { isSidebarOpen } = useSidebar()
  const showVaultSidebar = isSidebarOpen('vault')
  const showCollabsFolderSidebar = isSidebarOpen('collabsFolder')
  const showCollabHubSidebar = isSidebarOpen('collabHub')

  // Added: State to track the selected card for the preview modal
  const [selectedCard, setSelectedCard] = useState(null)

  // Count how many sidebars are open
  const openSidebarsCount = [showVaultSidebar, showCollabsFolderSidebar, showCollabHubSidebar].filter(Boolean).length

  // When 2 or more sidebars are open, show 3 columns, otherwise use responsive grid
  const gridCols = openSidebarsCount >= 2
    ? 'grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  // Handle card click - use custom handler if provided, otherwise open modal
  const handleCardClick = (card) => {
    if (onCardClick) {
      onCardClick(card)
    } else {
      setSelectedCard(card)
    }
  }

  return (
    <div className="px-4 md:px-[38px] py-6 w-full">
      {showTitle && (
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold leading-[30px] text-[#18181b]">
            {title}
          </h2>
        </div>
      )}

      <div className={
        viewMode === 'list'
          ? "flex flex-col gap-0 mb-6 bg-white rounded-lg border border-[#e4e4e7] overflow-hidden"
          : `grid ${gridCols} gap-6 lg:gap-8 mb-6 justify-items-center`
      }>
        {viewMode === 'list' && (
          <div className="flex items-center px-4 py-3 border-b border-[#e4e4e7] bg-[#f4f4f5] text-[12px] font-medium text-[#71717a]">
            <div className="flex-1 pl-2">Name</div>
            <div className="w-[100px] text-center hidden md:block">Status</div>
            <div className="w-[120px] pl-2 hidden md:block">Team</div>
            <div className="w-[140px] text-right hidden lg:block pr-4">Last Edited</div>
            <div className="w-[40px]"></div>
          </div>
        )}
        {cards.map((card, index) => (
          <VaultCard
            key={index}
            card={card}
            index={index}
            viewMode={viewMode}
            onClick={() => handleCardClick(card)} // Use custom handler
          />
        ))}
      </div>

      {/* Added: DocumentPreviewModal */}
      <DocumentPreviewModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        document={selectedCard}
      />
    </div>
  )
}
