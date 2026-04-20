import { motion } from 'framer-motion'
import { Plus, Upload, Trash2 } from 'lucide-react'

export default function VaultHeader({ title = 'THE vault', description = 'Your secure workspace for every project, deck & document.', isBlack = false, backgroundImage = null, customActionButton = null, showActionButtons = true, onNewCollabClick = null, onUploadClick = null }) {
  const headerHeight = isBlack ? 'min-h-[199px]' : 'min-h-[199px]'
  const paddingY = isBlack ? 'py-[30px] md:py-[45px]' : 'py-[30px] md:py-[45px]'

  return (
    <div className={`relative w-full ${headerHeight} overflow-hidden ${isBlack ? 'bg-black' : ''}`}>
      {/* Background with texture/image */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {isBlack ? (
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/20 lg:hidden" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f5]/80 to-[#ffffff]/80 lg:hidden" />
          )}
        </div>
      ) : !isBlack ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f5] to-[#ffffff]" />
      ) : null}

      <div className={`relative z-10 px-4 md:px-[30px] ${paddingY}`}>
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0">
            {/* Left Section */}
            <div className={`flex flex-col gap-2 w-full ${showActionButtons ? 'md:max-w-[300px]' : ''}`}>
              {typeof title === 'string' ? (
                <h1 className={`text-[34px] leading-[48px] tracking-[0.4063px] ${isBlack ? 'text-white' : 'text-[#18181b]'}`}>
                  {title.split(' ').map((word, index) => {
                    if (index === 0) {
                      // First word: bold, uppercase, sans-serif (Hanken Grotesk)
                      return (
                        <span key={index} className="font-bold uppercase font-sans">
                          {word}
                        </span>
                      )
                    } else {
                      // Rest: italicized, lowercase, serif (Playfair Display)
                      return (
                        <span key={index} className="italic lowercase font-accent">
                          {' '}{word}
                        </span>
                      )
                    }
                  })}
                </h1>
              ) : (
                <h1 className={`text-[48px] leading-[48px] tracking-tight ${isBlack ? 'text-white' : 'text-[#18181b]'}`}>
                  {title}
                </h1>
              )}
              {description && (
                <p className={`text-[16px] leading-[24px] tracking-[-0.3125px] max-w-[560px] ${isBlack ? 'text-white/80' : 'text-[#181818]'}`}>
                  {description}
                </p>
              )}
            </div>

            {/* Right Section - Action Buttons */}
            {showActionButtons && (
              customActionButton ? (
                customActionButton
              ) : (
                <div className="flex flex-col md:flex-row items-center self-end gap-3 w-full md:w-auto">
                  <motion.button
                    onClick={onNewCollabClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-[#18181b] rounded-md h-[40px] px-4 flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity w-full md:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    New Collab
                  </motion.button>
                 
                  <motion.button
                    onClick={onUploadClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors w-full md:w-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Upload new
                  </motion.button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
