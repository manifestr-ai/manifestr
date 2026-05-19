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
            className="hidden md:block shrink-0 self-start sticky top-[72px] z-30 h-[calc(100vh-72px)]"
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
            className="hidden md:block shrink-0 self-start sticky top-[72px] z-30 h-[calc(100vh-72px)]"
          >
            <VaultSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collabs Folder Sidebar - shown on collabs pages */}
      {/* Only show CollabsFolderSidebar if the route is /vault */}
      {typeof window !== 'undefined' && window.location.pathname === '/vault' && (
        <AnimatePresence>
          {showCollabsFolderSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block shrink-0 self-start sticky top-[72px] z-20 h-[calc(100vh-72px)]"
            >
              <CollabsFolderSidebar />
            </motion.div>
          )}
        </AnimatePresence>
      )}
 

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}


