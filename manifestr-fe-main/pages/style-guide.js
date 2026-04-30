import React, { useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Search, Mic, ChevronDown, Clock, Grid3x3, List, MoreVertical, Plus } from 'lucide-react'
import AppHeader from '../components/layout/AppHeader'
import StyleGuideCard from '../components/style-guide/StyleGuideCard'
import RenameStyleGuideModal from '../components/ui/RenameStyleGuideModal'
import DeleteStyleGuideModal from '../components/ui/DeleteStyleGuideModal'
import StyleGuideDropdown from '../components/ui/StyleGuideDropdown'
import { useToast } from '../components/ui/Toast'
import { STYLE_GUIDE_HERO_BANNER_URL } from '../lib/styleGuideHeroBanner'

export default function StyleGuide() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const [styleGuides, setStyleGuides] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'completed' | 'in_progress'
  const [sortBy, setSortBy] = useState('recents') // 'recents' | 'oldest'
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const menusRef = useRef(null)

  // Modal states
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState(null)

  const [openDropdownGuideId, setOpenDropdownGuideId] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const listMenuButtonRefs = useRef({})

  useEffect(() => {
    const fetchStyleGuides = async () => {
      try {
        setIsLoading(true)
        const { listStyleGuides } = await import('../services/style-guide')
        // const response = await listStyleGuides({ project_id: '...' }) // Filter if needed
        const response = await listStyleGuides()

        // Map API response to UI props
        // API returns: { id, name, brand_name, logo, typography, colors, style, is_completed, created_at, updated_at, ... }
        const mappedGuides = (response.data || []).map((guide, index) => {
          // Generate a deterministic gradient based on index or ID if not stored
          const gradients = [
            'linear-gradient(135deg, #DC2626 0%, #18181b 100%)',
            'linear-gradient(135deg, #16A34A 0%, #18181b 100%)',
            'linear-gradient(135deg, #2563EB 0%, #18181b 100%)',
            'linear-gradient(135deg, #9333EA 0%, #18181b 100%)',
            'linear-gradient(135deg, #EA580C 0%, #92400E 0%, #18181b 100%)',
            'linear-gradient(135deg, #EC4899 0%, #BE185D 0%, #18181b 100%)',
          ]
          const gradient = gradients[index % gradients.length]

          // Format dates
          const updatedDate = guide.updated_at
            ? new Date(guide.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : ''

          // Count elements
          const logoCount = (guide.logo?.logos || []).length
          const colorCount = (guide.colors?.selected || []).length + (guide.colors?.custom || []).length
          const hasTypography = guide.typography && (guide.typography.headings || guide.typography.body)

          // Build subtitle with useful info
          let subtitleParts = []
          if (logoCount > 0) subtitleParts.push(`${logoCount} Logo${logoCount !== 1 ? 's' : ''}`)
          if (colorCount > 0) subtitleParts.push(`${colorCount} Color${colorCount !== 1 ? 's' : ''}`)
          if (hasTypography) subtitleParts.push('Typography')

          const subtitle = subtitleParts.length > 0
            ? subtitleParts.join(' • ')
            : (guide.is_completed ? 'Completed' : 'In Progress')

          // Determine display values
          const displayName = guide.brand_name || guide.name || 'Untitled Style Guide'
          const categoryText = guide.is_completed ? '✓ Completed' : (updatedDate ? `Updated ${updatedDate}` : 'Draft')

          return {
            id: guide.id,
            category: categoryText,
            title: displayName,
            subtitle: subtitle,
            projectCount: 0, // Not in API yet
            gradient: gradient,
            // Filtering/sorting fields
            isCompleted: Boolean(guide.is_completed),
            createdAt: guide.created_at ? new Date(guide.created_at).getTime() : 0,
            updatedAt: guide.updated_at ? new Date(guide.updated_at).getTime() : 0,
          }
        })
        setStyleGuides(mappedGuides)
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchStyleGuides()
  }, []) // Remove router dependency to avoid re-running loop if router changes, though router.push is safe.

  useEffect(() => {
    const onDocumentMouseDown = (e) => {
      if (!menusRef.current) return
      if (!menusRef.current.contains(e.target)) {
        setIsStatusMenuOpen(false)
        setIsSortMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocumentMouseDown)
    return () => document.removeEventListener('mousedown', onDocumentMouseDown)
  }, [])

  const handleCreateNew = () => {
    router.push('/create-style-guide')
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortBy('recents')
    setIsStatusMenuOpen(false)
    setIsSortMenuOpen(false)
  }

  // Handle opening a style guide
  const handleOpenGuide = (guide) => {
    router.push(`/style-guide/${guide.id}`)
  }

  // Handle renaming
  const handleRenameClick = (guide) => {
    setSelectedGuide(guide)
    setShowRenameModal(true)
  }

  const handleRenameConfirm = async (newName) => {
    try {
      const { updateStyleGuide } = await import('../services/style-guide')
      await updateStyleGuide(selectedGuide.id, { brand_name: newName })

      // Update local state
      setStyleGuides(prevGuides =>
        prevGuides.map(g =>
          g.id === selectedGuide.id
            ? { ...g, title: newName }
            : g
        )
      )

      setShowRenameModal(false)
      setSelectedGuide(null)
      success('Style guide renamed successfully!')
    } catch (error) {
      console.error('Failed to rename style guide:', error)
      showError('Failed to rename style guide. Please try again.')
    }
  }

  // Handle download - fetch full data and download as JSON
  const handleDownload = async (guide) => {
    try {
      // Fetch full style guide data from backend
      const { getStyleGuideDetails } = await import('../services/style-guide')
      const response = await getStyleGuideDetails(guide.id)
      const fullData = response.data

      // Create downloadable JSON file
      const fileName = `${fullData.brand_name || fullData.name || 'style-guide'}-${fullData.id}.json`.replace(/[^a-z0-9.-]/gi, '_')
      const jsonString = JSON.stringify(fullData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      success('Style guide downloaded successfully!')
    } catch (error) {
      console.error('Failed to download style guide:', error)
      showError('Failed to download style guide. Please try again.')
    }
  }

  // Handle delete
  const handleDeleteClick = (guide) => {
    setSelectedGuide(guide)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const { deleteStyleGuide } = await import('../services/style-guide')
      await deleteStyleGuide(selectedGuide.id)

      // Remove from local state
      setStyleGuides(prevGuides =>
        prevGuides.filter(g => g.id !== selectedGuide.id)
      )

      setShowDeleteModal(false)
      setSelectedGuide(null)
      success('Style guide deleted successfully!')
    } catch (error) {
      console.error('Failed to delete style guide:', error)
      showError('Failed to delete style guide. Please try again.')
    }
  }

  // Effect to redirect if loaded and empty. 
  // Doing it here to avoid race conditions in the fetch function or loop issues.
  useEffect(() => {
    if (!isLoading && styleGuides.length === 0) {
      router.replace('/create-style-guide')
    }
  }, [isLoading, styleGuides.length, router])

  const activeDropdownGuide = useMemo(() => {
    if (!openDropdownGuideId) return null
    return styleGuides.find((g) => g.id === openDropdownGuideId) || null
  }, [openDropdownGuideId, styleGuides])

  const displayedGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    let filtered = styleGuides

    if (q) {
      filtered = filtered.filter((g) => (g.title || '').toLowerCase().includes(q))
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((g) => (statusFilter === 'completed' ? g.isCompleted : !g.isCompleted))
    }

    const toSortTime = (g) => (g.updatedAt || g.createdAt || 0)
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'oldest') return toSortTime(a) - toSortTime(b)
      return toSortTime(b) - toSortTime(a)
    })

    return filtered
  }, [searchQuery, statusFilter, sortBy, styleGuides])

  return (
    <>
      <Head>
        <title>Style Guide - Manifestr</title>
        <meta name="description" content="Manage and organize your brand style guides and design systems" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white min-h-screen w-full flex flex-col">
        <AppHeader showRightActions={true} />
        <div className="h-[72px]" />

        {/* Hero Section */}
        <div className="relative w-full h-auto min-h-[210px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/dlifgfg6m/image/upload/v1777410547/StyleGuide_f6cinb.png"
              alt="Background"
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-[80px] pt-12 md:pt-[88px] pb-4 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-0">
            <div className="text-center md:text-left">
              <h1 className="text-[#181818] tracking-[0.4063px] whitespace-nowrap mb-4 flex items-baseline justify-center md:justify-start leading-[0]">
                <span className="font-inter font-bold text-[34px] leading-[48px] mr-[6px]">STYLE</span>
                <span className="font-ivy-presto italic font-semibold text-[44px] leading-[48px]">guide</span>
              </h1>
              <p className="text-[16px] leading-[24px] text-[#181818] font-['Inter'] font-normal not-italic tracking-[-0.312px]">
                Manage and organize your brand style guides and design systems
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex items-center justify-center gap-2 bg-white h-[40px] px-4 py-2 rounded-[6px] text-[14px] font-medium leading-[20px] text-[#18181b] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] hover:bg-[#f4f4f5] transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 text-[#18181b]" strokeWidth={2} />
              New Style Guide
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-[#f4f4f5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="w-full md:flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#71717a]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search style guides..."
                  className="w-full pl-12 pr-12 py-3 bg-[#ffffff] border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                />
                <Mic className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#71717a] cursor-pointer hover:text-[#18181b] transition-colors" />
              </div>

              {/* Filters */}
              <div
                ref={menusRef}
                className="w-full md:w-auto flex items-center gap-3 overflow-x-auto md:overflow-visible overflow-y-visible pb-2 md:pb-0 scrollbar-hide"
              >
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => {
                      setIsStatusMenuOpen((v) => !v)
                      setIsSortMenuOpen(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e4e4e7] rounded-lg hover:bg-[#f4f4f5] transition-colors"
                    type="button"
                  >
                    <span className="text-[14px] leading-[20px] text-[#18181b]">
                      {statusFilter === 'all' ? 'All status' : statusFilter === 'completed' ? 'Completed' : 'In progress'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#71717a]" />
                  </button>
                  {isStatusMenuOpen && (
                    <div className="absolute left-0 mt-2 w-44 rounded-lg border border-[#e4e4e7] bg-white shadow-lg z-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter('all')
                          setIsStatusMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#f4f4f5] ${statusFilter === 'all' ? 'text-[#18181b] font-semibold' : 'text-[#52525b]'}`}
                      >
                        All status
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter('completed')
                          setIsStatusMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#f4f4f5] ${statusFilter === 'completed' ? 'text-[#18181b] font-semibold' : 'text-[#52525b]'}`}
                      >
                        Completed
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter('in_progress')
                          setIsStatusMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#f4f4f5] ${statusFilter === 'in_progress' ? 'text-[#18181b] font-semibold' : 'text-[#52525b]'}`}
                      >
                        In progress
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => {
                      setIsSortMenuOpen((v) => !v)
                      setIsStatusMenuOpen(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e4e4e7] rounded-lg hover:bg-[#f4f4f5] transition-colors"
                    type="button"
                  >
                    <Clock className="w-4 h-4 text-[#71717a]" />
                    <span className="text-[14px] leading-[20px] text-[#18181b]">
                      {sortBy === 'recents' ? 'Recents' : 'Oldest'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#71717a]" />
                  </button>
                  {isSortMenuOpen && (
                    <div className="absolute left-0 mt-2 w-44 rounded-lg border border-[#e4e4e7] bg-white shadow-lg z-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy('recents')
                          setIsSortMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#f4f4f5] ${sortBy === 'recents' ? 'text-[#18181b] font-semibold' : 'text-[#52525b]'}`}
                      >
                        Recents
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy('oldest')
                          setIsSortMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#f4f4f5] ${sortBy === 'oldest' ? 'text-[#18181b] font-semibold' : 'text-[#52525b]'}`}
                      >
                        Oldest
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleResetFilters}
                  className="flex-shrink-0 px-4 py-2 text-[14px] leading-[20px] text-[#71717a] hover:text-[#18181b] transition-colors"
                  type="button"
                >
                  Reset Filters
                </button>
                <div className="flex-shrink-0 flex items-center border border-[#e4e4e7] rounded-lg overflow-hidden ml-auto md:ml-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[#18181b] text-white' : 'bg-white text-[#71717a] hover:bg-[#f4f4f5]'} transition-colors`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-[#18181b] text-white' : 'bg-white text-[#71717a] hover:bg-[#f4f4f5]'} transition-colors`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-[#f4f4f5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedGuides.map((guide, index) => (
                  <StyleGuideCard
                    key={guide.id}
                    category={guide.category}
                    title={guide.title}
                    subtitle={guide.subtitle}
                    projectCount={guide.projectCount}
                    gradient={guide.gradient}
                    index={index}
                    onClick={() => handleOpenGuide(guide)}
                    onOpen={() => handleOpenGuide(guide)}
                    onRename={() => handleRenameClick(guide)}
                    onDownload={() => handleDownload(guide)}
                    onDelete={() => handleDeleteClick(guide)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedGuides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-shadow cursor-pointer gap-4 md:gap-0"
                    onClick={() => handleOpenGuide(guide)}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 flex-1 w-full md:w-auto">
                      <div
                        className="w-full md:w-20 h-20 rounded-lg flex-shrink-0"
                        style={{ background: guide.gradient }}
                      />
                      <div className="flex-1 w-full md:w-auto">
                        <p className="text-[14px] leading-[20px] text-[#71717a] mb-1">
                          {guide.category}
                        </p>
                        <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-[16px] leading-[24px] text-[#71717a]">
                          {guide.subtitle}
                        </p>
                      </div>
                      <div className="text-[14px] leading-[20px] text-[#71717a]">
                        <div className="flex items-center gap-2">
                          <span>{guide.projectCount} Projects</span>
                          <button
                            ref={(el) => {
                              listMenuButtonRefs.current[guide.id] = el
                            }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()

                              if (openDropdownGuideId === guide.id) {
                                setOpenDropdownGuideId(null)
                                return
                              }

                              const el = listMenuButtonRefs.current[guide.id]
                              if (el) {
                                const rect = el.getBoundingClientRect()
                                const dropdownWidth = 200
                                setDropdownPosition({
                                  top: rect.bottom + 8,
                                  left: rect.right - dropdownWidth,
                                })
                              }
                              setOpenDropdownGuideId(guide.id)
                            }}
                            className="w-8 h-8 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center hover:bg-[#f4f4f5] transition-colors"
                            type="button"
                            aria-label="Style guide actions"
                          >
                            <MoreVertical className="w-4 h-4 text-[#18181b]" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Note: For list view, using a simpler button approach since StyleGuideCard handles grid view */}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#18181b] rounded-full flex items-center justify-center text-white text-[18px] font-semibold shadow-lg hover:shadow-xl transition-shadow z-50"
        >
          M.
        </motion.button>
      </div>

      {/* Rename Modal */}
      <RenameStyleGuideModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false)
          setSelectedGuide(null)
        }}
        onConfirm={handleRenameConfirm}
        currentName={selectedGuide?.title || ''}
      />

      {/* Delete Modal */}
      <DeleteStyleGuideModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedGuide(null)
        }}
        onConfirm={handleDeleteConfirm}
        styleGuideName={selectedGuide?.title || ''}
      />

      {/* List view dropdown (portal) */}
      {typeof document !== 'undefined' && openDropdownGuideId && activeDropdownGuide && createPortal(
        <>
          <div
            onClick={(e) => {
              e.stopPropagation()
              setOpenDropdownGuideId(null)
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9998,
              background: 'transparent',
            }}
          />
          <StyleGuideDropdown
            isOpen={true}
            onClose={() => setOpenDropdownGuideId(null)}
            onOpen={() => handleOpenGuide(activeDropdownGuide)}
            onRename={() => handleRenameClick(activeDropdownGuide)}
            onDownload={() => handleDownload(activeDropdownGuide)}
            onDelete={() => handleDeleteClick(activeDropdownGuide)}
            position={dropdownPosition}
          />
        </>,
        document.body
      )}
    </>
  )
}
