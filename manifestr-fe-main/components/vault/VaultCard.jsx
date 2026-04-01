import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Pencil, Share2, Download, MoreVertical, Pin } from 'lucide-react'
import DocumentActionsModal from './DocumentActionsModal'

// Collaborator badge colors based on name
const getCollaboratorBadgeColor = (name) => {
  const colors = {
    'Jess': 'bg-[#d1fae5]', // light green
    'Leah': 'bg-[#dbeafe]', // light blue
    'Tom': 'bg-[#fed7aa]', // light orange
    'Sarah': 'bg-[#e9d5ff]', // light purple
    'M.': 'bg-[#18181b]', // dark gray/black
  }
  return colors[name] || 'bg-[#dbeafe]'
}

const getCollaboratorTextColor = (name) => {
  const colors = {
    'Jess': 'text-[#065f46]', // dark green
    'Leah': 'text-[#1e40af]', // dark blue
    'Tom': 'text-[#9a3412]', // dark orange
    'Sarah': 'text-[#6b21a8]', // dark purple
    'M.': 'text-white', // white for dark background
  }
  return colors[name] || 'text-[#1e40af]'
}

export default function VaultCard({ card, index, viewMode = 'grid', onClick, onPin }) {
  const [imageError, setImageError] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [isPinning, setIsPinning] = useState(false)

  // Handle pin button click
  const handlePinClick = async (e) => {
    e.stopPropagation()
    if (isPinning || !onPin) return
    
    setIsPinning(true)
    try {
      await onPin(card)
    } finally {
      setIsPinning(false)
    }
  }

  const statusBgColors = {
    'In Progress': 'bg-[#dbeafe]',
    'In Review': 'bg-[#fef3c7]',
    'Final': 'bg-[#d1fae5]',
    'Draft': 'bg-[#f4f4f5]',
  }

  const statusTextColors = {
    'In Progress': 'text-[#1e40af]',
    'In Review': 'text-[#92400e]',
    'Final': 'text-[#065f46]',
    'Draft': 'text-[#71717a]',
  }

  // Default image from the description - woman working on laptop
  const defaultImage = 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop'
  const cardImage = card.thumbnail || defaultImage

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="flex items-center px-4 py-3 border-b border-[#e4e4e7] last:border-b-0 hover:bg-[#fafafa] transition-colors cursor-pointer group"
        onClick={onClick}
      >
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="relative w-[180px] h-[84px] rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#e4e4e7] shrink-0">
            {!imageError ? (
              <img
                src={cardImage}
                alt={card.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7]" />
            )}
            {(card.status || card.collaboratorName) && (
              <div className="absolute bottom-2 left-2">
                <span
                  className={`px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] ${card.collaboratorName
                      ? getCollaboratorBadgeColor(card.collaboratorName)
                      : statusBgColors[card.status] || 'bg-[#dbeafe]'
                    } ${card.collaboratorName
                      ? getCollaboratorTextColor(card.collaboratorName)
                      : statusTextColors[card.status] || 'text-[#1e40af]'
                    }`}
                >
                  {card.collaboratorName || card.status}
                </span>
              </div>
            )}
            {/* Shared Badge - Top Left (List View) */}
            {card.isShared && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 rounded-md text-[10px] font-medium leading-[14px] bg-blue-500 text-white shadow-lg">
                  Shared
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-semibold text-[#18181b] truncate leading-[22px]">
              {card.title}
            </h3>
            <p className="text-[13px] text-[#71717a] truncate leading-[18px]">{card.project}</p>

            {/* Collaborators in List View */}
            {card.collaborators && card.collaborators.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {card.collaborators.slice(0, 4).map((collab, idx) => (
                  <div
                    key={idx}
                    className="w-[24px] h-[24px] rounded-full bg-[#f4f4f5] border border-white flex items-center justify-center overflow-hidden shrink-0"
                    title={collab.name}
                  >
                    {collab.avatar ? (
                      <img src={collab.avatar} alt={collab.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-medium text-[#18181b]">
                        {collab.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
                {card.collaborators.length > 4 && (
                  <span className="text-[11px] text-[#71717a] ml-1">
                    +{card.collaborators.length - 4}
                  </span>
                )}
              </div>
            )}

            {card.lastEdited && (
              <p className="text-[12px] text-[#a1a1aa] leading-[16px] mt-1">{card.lastEdited}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            >
              <FileText className="w-4 h-4 text-[#18181b]" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            >
              <Pencil className="w-4 h-4 text-[#18181b]" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#18181b]" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
            >
              <Download className="w-4 h-4 text-[#18181b]" />
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActionsModal(true)
            }}
            className="w-8 h-8 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#18181b]" />
          </button>
        </div>

        {/* Document Actions Modal */}
        <DocumentActionsModal
          isOpen={showActionsModal}
          onClose={() => setShowActionsModal(false)}
          document={card}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className="w-full max-w-[320px] flex flex-col bg-white rounded-lg overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] border border-[#e4e4e7] group cursor-pointer hover:shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_2px_4px_rgba(0,0,0,0.06)] transition-shadow"
    >
      {/* Header Section with Image */}
      <div className="relative w-full h-[180px] overflow-hidden">
        {/* Background Image */}
        <div className="w-full h-full relative">
          {!imageError ? (
            <img
              src={cardImage}
              alt={card.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7]" />
          )}
          {/* Blur overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
        </div>

        {/* Action Icons - Top Right */}
        <div className="absolute top-2 px-2 w-full justify-between flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-[#18181b]" />
          </motion.button>
          <div className='flex gap-1'>
          <motion.button
            onClick={handlePinClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            title={card.isPinned ? "Unpin document" : "Pin document"}
            disabled={isPinning}
          >
            <Pin 
              className={`w-3.5 h-3.5 transition-all ${
                card.isPinned 
                  ? 'text-blue-600 fill-blue-600' 
                  : 'text-[#18181b]'
              } ${isPinning ? 'opacity-50' : ''}`} 
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-[#18181b]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#18181b]" />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              setShowActionsModal(true)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <MoreVertical className="w-3.5 h-3.5 text-[#18181b]" />
          </motion.button>
          </div>
        </div>

        {/* Status Badge - Bottom Left */}
        {(card.status || card.collaboratorName) && (
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] ${card.collaboratorName
              ? getCollaboratorBadgeColor(card.collaboratorName)
              : statusBgColors[card.status] || 'bg-[#dbeafe]'
              } ${card.collaboratorName
                ? getCollaboratorTextColor(card.collaboratorName)
                : statusTextColors[card.status] || 'text-[#1e40af]'
              }`}>
              {card.collaboratorName || card.status}
            </span>
          </div>
        )}

        {/* Shared Badge - Top Left */}
        {/* {card.isShared && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] bg-blue-500 text-white shadow-lg">
              Shared with you
            </span>
          </div>
        )} */}
      </div>

      {/* Content Section */}
      <div className="w-full bg-white p-5 flex flex-col min-h-[180px]">
        {/* Project Title */}
        <h3 className="text-[16px] font-bold leading-[24px] text-[#18181b] mb-1 line-clamp-2">
          {card.title}
        </h3>

        {/* Project Subtitle */}
        <p className="text-[14px] font-normal leading-[20px] text-[#18181b] mb-3">
          {card.project}
        </p>

        {/* Collaborators */}
        {card.collaborators && card.collaborators.length > 0 && (
          <div className="flex items-center mb-3">
            {card.collaborators.slice(0, 6).map((collab, idx) => (
              <div
                key={idx}
                className={`w-[30px] h-[30px] rounded-full bg-[#f4f4f5] border-2 border-white flex items-center justify-center overflow-hidden shrink-0 ${idx > 0 ? '-ml-3' : ''
                  }`}
                style={{ zIndex: 10 - idx }}
              >
                {collab.avatar ? (
                  <img src={collab.avatar} alt={collab.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[13px] font-medium text-[#18181b]">
                    {collab.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {card.collaborators.length > 6 && (
              <div
                className="w-[30px] h-[30px] rounded-full bg-[#e4e4e7] border-2 border-white flex items-center justify-center shrink-0 -ml-2.5"
                style={{ zIndex: 4 }}
              >
                <span className="text-[13px] font-medium text-[#52525b]">
                  +{card.collaborators.length - 6}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Last Edited */}
        {card.lastEdited && (
          <p className="text-[12px] leading-[18px] text-[#71717a] mt-auto">
            Last edited: <span className="text-[#18181b]">{card.lastEdited}</span>
          </p>
        )}
      </div>

      {/* Document Actions Modal */}
      <DocumentActionsModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        document={card}
      />
    </motion.div>
  )
}
