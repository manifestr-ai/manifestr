import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from '../../contexts/SidebarContext'
import VaultSidebar from '../vault/VaultSidebar'
import CollabHubSidebar from '../collab-hub/CollabHubSidebar'
import CollabsFolderSidebar from '../vault/CollabsFolderSidebar'

export default function SidebarLayout({ children }) {
  const { isSidebarOpen } = useSidebar()
  const showVaultSidebar = isSidebarOpen('vault')
  const showCollabHubSidebar = isSidebarOpen('collabHub')
  const showCollabsFolderSidebar = isSidebarOpen('collabsFolder')

  return (
    <div className="flex pt-[72px] min-h-screen relative">
      {/* Collab Hub Sidebar - shown on collab-hub pages */}
      <AnimatePresence>
        {showCollabHubSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 273, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden hidden md:block" // Hide on mobile, use overlay if needed later or assume it's hidden
          >
            <CollabHubSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vault Sidebar - shown on vault pages or when toggled from collab hub */}
      <AnimatePresence>
        {showVaultSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 273, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden hidden md:block"
          >
            <VaultSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collabs Folder Sidebar - shown on collabs pages */}
      <AnimatePresence>
        {showCollabsFolderSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 218.5, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block"
          >
            <CollabsFolderSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}


