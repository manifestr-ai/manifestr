import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Folder, Plus, ChevronLeft } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import { VAULT_FOLDERS, getVaultFolderHref } from './vaultFolders'

export default function CollabsFolderSidebar() {
  const router = useRouter()
  const currentPath = router.asPath.split('?')[0]
  const { toggleSidebar } = useSidebar()

  const folders = VAULT_FOLDERS.map((f) => ({ id: f.id, name: f.name, href: getVaultFolderHref(f.id) }))

  const isActive = (href) => {
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <div className="relative w-[240px] bg-white border-r border-[#e4e4e7] h-full flex flex-col">
      <button
        type="button"
        onClick={() => toggleSidebar('collabsFolder')}
        className="absolute -left-3 top-[26px] w-6 h-6 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center shadow-sm hover:bg-[#f4f4f5] transition-colors z-50"
      >
        <ChevronLeft className="w-4 h-4 text-[#18181b]" />
      </button>
      <div className="p-5">
        {/* Folders List */}
        <div className="space-y-0 mb-4">
          {folders.map((folder, index) => {
            const folderIsActive = isActive(folder.href)

            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link href={folder.href || '/vault'}>
                  <motion.div
                    whileHover={{ backgroundColor: '#f4f4f5' }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-[37px] px-3 flex items-center gap-2 rounded-md transition-colors cursor-pointer ${
                      folderIsActive ? 'bg-[#f4f4f5]' : ''
                    }`}
                  >
                    <Folder className="w-4 h-4 text-[#18181b] flex-shrink-0" />
                    <span className={`text-[14px] leading-[21px] whitespace-nowrap overflow-hidden text-ellipsis ${
                      folderIsActive ? 'font-medium text-[#18181b]' : 'text-[#18181b]'
                    }`}>
                      {folder.name}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* New Folder Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-[40px] flex items-center justify-center gap-2 px-3 text-[14px] font-medium leading-[20px] bg-[#71717a] text-white rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Folder
        </motion.button>
      </div>
    </div>
  )
}




