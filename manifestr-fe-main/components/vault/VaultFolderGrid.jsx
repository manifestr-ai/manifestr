import { motion } from 'framer-motion'
import Link from 'next/link'

export default function VaultFolderGrid({ folders = [], onFolderClick = null }) {
  // NO DEFAULT FOLDERS - only show real data from DB
  const foldersToDisplay = folders

  return (
    <div className="px-4 md:px-[38px] pb-6">
      <div className="mb-4">
        <h2 className="text-[20px] font-semibold leading-[30px] text-[#18181b]">
          All Folders
        </h2>
      </div>

      <div className="flex items-center gap-10 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
        {foldersToDisplay.map((folder, index) => {
          const folderName = typeof folder === 'string' ? folder : folder.name
          const folderHref = typeof folder === 'string' ? null : folder.href
          const folderId = typeof folder === 'string' ? null : folder.id
          const memberCount = typeof folder === 'string' ? null : folder.memberCount
          const documentCount = typeof folder === 'string' ? null : folder.documentCount

          const FolderContent = () => (
            <div className="relative w-[125px] h-[80px]">
              <div className="absolute inset-0 rounded-md overflow-hidden shadow-[0px_5px_4px_rgba(0,0,0,0.04)]">
                <img
                  src="/assets/icons/folder-icon.svg"
                  alt={folderName}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                  <p className="text-white text-[12px] pt-2 font-medium leading-[18px] text-center line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {folderName.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </p>
                  {/* {(memberCount !== null || documentCount !== null) && (
                    <p className="text-white/80 text-[10px] mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {documentCount || 0} docs • {memberCount || 0} members
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          )

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                if (onFolderClick && folder) {
                  onFolderClick(folder)
                }
              }}
            >
              {folderHref ? (
                <Link href={folderHref}>
                  <FolderContent />
                </Link>
              ) : (
                <FolderContent />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
