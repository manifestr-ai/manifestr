import { motion } from 'framer-motion'
import Link from 'next/link'

export default function VaultFolderGrid({ folders = [], onFolderClick = null }) {
  // NO DEFAULT FOLDERS - only show real data from DB
  const foldersToDisplay = folders

  return (
    <div className="px-4 md:px-[38px]">
      <div className="mb-4">
        <h2
          className="text-[20px] font-bold leading-[30px] text-[var(--base-foreground,#18181B)] font-[Inter] not-italic"
          style={{
            color: "var(--base-foreground, #18181B)",
            fontFamily: "Inter",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "30px",
          }}
        >
          All Folders
        </h2>
   
      </div>

      <div className="flex items-center gap-3 overflow-x-auto  -mx-4 px-4 md:mx-0 md:px-0" style={{ height: 130 }}>
 
        {foldersToDisplay.map((folder, index) => {
          const folderName = typeof folder === 'string' ? folder : folder.name
          const folderHref = typeof folder === 'string' ? null : folder.href
          const folderId = typeof folder === 'string' ? null : folder.id
          const memberCount = typeof folder === 'string' ? null : folder.memberCount
          const documentCount = typeof folder === 'string' ? null : folder.documentCount

          const FolderContent = () => (
            <div className="relative w-[125px] h-[90px]">
              <div className="absolute inset-0 rounded-md overflow-hidden ">
                <img
                  src="/assets/icons/folder-icon.svg"
                  alt={folderName}
                  className="shadow-[0px_5px_4px_rgba(0,0,0,0.04)]"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                  <p
                    style={{
                      color: "#FFF",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "18px",
                    }}
                    className="pt-2 line-clamp-2"
                  >
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
