import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, X } from 'lucide-react'

export default function DeletedCard({ card, index, onRestore, onPermanentDelete }) {
  const [imageError, setImageError] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const defaultImage = 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop'
  const cardImage = card.thumbnail || defaultImage

  const handleRestore = async (e) => {
    e.stopPropagation()
    if (isProcessing || !onRestore) return

    setIsProcessing(true)
    try {
      await onRestore(card)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (isProcessing || !onPermanentDelete) return

    if (!confirm('Permanently delete this document? This action cannot be undone!')) {
      return
    }

    setIsProcessing(true)
    try {
      await onPermanentDelete(card)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="w-full max-w-[320px] flex flex-col bg-white rounded-lg overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] border border-[#e4e4e7]"
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
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
        </div>

        {/* Days Left Badge - Bottom Left */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] bg-white text-red-500 shadow-lg">
            {card.daysLeft} days left
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full bg-white p-5 flex flex-col">
        {/* Title */}
        <h3 className="text-[16px] font-bold leading-[24px] text-[#18181b] mb-1 line-clamp-2">
          {card.title}
        </h3>

        {/* Project Subtitle */}
        <p className="text-[14px] font-normal leading-[20px] text-[#71717a] mb-4">
          {card.project}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Restore Button */}
          <motion.button
            onClick={handleRestore}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[40px] bg-white border border-[#e4e4e7] rounded-[6px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Restore
          </motion.button>

          {/* Delete Button */}
          <motion.button
            onClick={handleDelete}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[40px] bg-[#18181b] text-white rounded-[6px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
