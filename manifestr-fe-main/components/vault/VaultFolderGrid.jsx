import { motion } from 'framer-motion'

export default function VaultFolderGrid({ folders = [] }) {
  const defaultFolders = [
    'Marketing Materials',
    'Finance Reports',
    'Presentations',
    'Client Assets',
  ]

  const foldersToDisplay = folders.length > 0 ? folders : defaultFolders


  return (
    <div className="px-4 md:px-[38px] pb-6">
      <div className="mb-4">
        <h2 className="text-[20px] font-semibold leading-[30px] text-[#18181b]">
          All Folders
        </h2>
      </div>

      {/* Added more bottom padding to prevent shadow clipping */}
      <div className="flex items-center gap-10 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
        {foldersToDisplay.map((folder, index) => {
          const folderName = typeof folder === 'string' ? folder : folder.name

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex-shrink-0 cursor-pointer"
            >
              {/* Folder Icon */}
              <div className="relative w-[125px] h-[80px]">
                {/* Folder SVG Image */}
                <div className="absolute inset-0 rounded-md overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)]">
                  <img
                    src="/assets/icons/folder-icon.svg"
                    alt={folderName}
                    className="w-full h-full object-cover"
                  />

                  {/* Text overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                    <p className="text-white text-[12px] font-medium leading-[18px] text-center line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {folderName.split(' ').map((word, i) => (
                        <span key={i} className="block">{word}</span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
