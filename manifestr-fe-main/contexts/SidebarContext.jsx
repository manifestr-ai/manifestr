import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const router = useRouter()
  const [sidebars, setSidebars] = useState({
    vault: false,
    collabHub: false,
    collabsFolder: false,
  })

  // Auto-open sidebars based on current route
  // Note: Sidebars can coexist - we don't auto-close them unless navigating away from their section
  useEffect(() => {
    const path = router.pathname

    // Determine which sidebars should be open based on route
    if (path.startsWith('/vault')) {
      setSidebars(prev => ({
        ...prev,
        vault: true,
        collabsFolder: prev.vault ? prev.collabsFolder : true,
      }))
    } else if (path === '/collab-hub') {
      setSidebars(prev => ({
        ...prev,
        vault: true,
        collabHub: false,
        collabsFolder: false,
      }))
    } else if (path.startsWith('/collab-hub')) {
      setSidebars(prev => ({
        ...prev,
        collabHub: true, // Always show collab hub sidebar on collab-hub pages
        collabsFolder: false,
      }))
    } else {
      setSidebars(prev => ({
        ...prev,
        collabsFolder: false,
      }))
    }
    // Note: Main sidebars (vault, collabHub) stay open when toggled
    // Only collabsFolder closes when navigating away from collabs section
  }, [router.pathname])

  const toggleSidebar = (sidebarName) => {
    setSidebars(prev => ({
      ...prev,
      [sidebarName]: !prev[sidebarName],
    }))
  }

  const openSidebar = (sidebarName) => {
    setSidebars(prev => ({
      ...prev,
      [sidebarName]: true,
    }))
  }

  const closeSidebar = (sidebarName) => {
    setSidebars(prev => ({
      ...prev,
      [sidebarName]: false,
    }))
  }

  const isSidebarOpen = (sidebarName) => {
    return sidebars[sidebarName] || false
  }

  return (
    <SidebarContext.Provider
      value={{
        sidebars,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        isSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
