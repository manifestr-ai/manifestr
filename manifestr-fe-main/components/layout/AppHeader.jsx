import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Search, Plus, Menu, X } from 'lucide-react'
import Logo from '../logo/Logo'
import ProfileDropdown from './ProfileDropdown'
import WinsDropdown from './WinsDropdown'
import NotificationDropdown from './NotificationDropdown'
import SearchDropdown from './SearchDropdown'
import { AnimatePresence } from 'framer-motion'

export default function AppHeader({ showRightActions = true }) {
  const router = useRouter()
  const currentPath = router.pathname
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle Command+K / Ctrl+K shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  const isActive = (path) => {
    if (path === '/home') {
      return currentPath === '/home' || currentPath === '/'
    }
    return currentPath === path
  }

  const NavItem = ({ href, label, isActive, onClick }) => {
    if (isActive) {
      return (
        <div className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-md px-3 py-2">
          <p className="text-[16px] font-semibold leading-[24px] text-[#18181b]">{label}</p>
        </div>
      )
    }
    return (
      <Link href={href} className="px-3 py-2 rounded-md" onClick={onClick}>
        <p className="text-[16px] font-semibold leading-[24px] text-[#52525b]">{label}</p>
      </Link>
    )
  }

  return (
    <>
      <header className="bg-white border-b border-[#e4e4e7] fixed top-0 left-0 right-0 z-[100] h-[72px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left Section: Logo + Navigation */}
            <div className="flex items-center gap-8">
              <div className="w-[120.656px]">
                <Logo size="sm" />
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-4">
                <NavItem href="/home" label="Home" isActive={isActive('/home')} />
                <NavItem href="/toolkit" label="Toolkit" isActive={isActive('/toolkit')} />
                <NavItem href="/vault" label="The Vault" isActive={isActive('/vault')} />
                <NavItem href="/collab-hub" label="Collab Hub" isActive={isActive('/collab-hub')} />
                <NavItem href="/style-guide" label="Style Guide" isActive={isActive('/style-guide')} />
              </nav>
            </div>

            {/* Right Section: Actions (Desktop) */}
            {showRightActions && (
              <div className="hidden md:flex items-center gap-6">
                <motion.button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border border-[#e4e4e7] rounded-md p-3 hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5 text-[#18181b]" />
                </motion.button>
                <Link href="/create-project">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#18181b] text-white rounded-md px-4 py-2 h-[40px] flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[14px] font-medium leading-[20px]">Create</span>
                  </motion.button>
                </Link>
                <div className="flex items-center gap-4">
                  <NotificationDropdown />
                  <WinsDropdown />
                </div>
                <ProfileDropdown />
              </div>
            )}

            {/* Mobile Actions: Hamburger */}
            <div className="flex md:hidden items-center gap-4">
              {showRightActions && <ProfileDropdown />}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -mr-2 text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-[101]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[102] shadow-xl flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <span className="font-bold text-lg">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4">
                <NavItem href="/home" label="Home" isActive={isActive('/home')} />
                <NavItem href="/toolkit" label="Toolkit" isActive={isActive('/toolkit')} />
                <NavItem href="/vault" label="The Vault" isActive={isActive('/vault')} />
                <NavItem href="/collab-hub" label="Collab Hub" isActive={isActive('/collab-hub')} />
                <NavItem href="/style-guide" label="Style Guide" isActive={isActive('/style-guide')} />

                <div className="my-2 border-t border-gray-100" />

                {showRightActions && (
                  <>
                    <Link href="/create-project" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="bg-[#18181b] text-white rounded-md px-4 py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        <span className="text-[14px] font-medium">Create Project</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setIsSearchOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#52525b] font-semibold flex items-center gap-3"
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </button>
                    {/* Wins and Notifications could be added here if they have mobile views */}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Dropdown */}
      <SearchDropdown isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

