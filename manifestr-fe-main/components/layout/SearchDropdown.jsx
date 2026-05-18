import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  FileSearch,
  Loader2,
  Folder,
  Palette,
} from 'lucide-react'
import { globalSearch } from '../../services/search'
import { getSearchResultPath } from '../../utils/searchRouting'
import { timeAgo } from '../../utils/url'

const ICON_BY_SOURCE = {
  generation_job: FileText,
  vault_item: Folder,
  style_guide: Palette,
  collab_project: Users,
}

function getResultIcon(result) {
  const type = (result?.type || '').toLowerCase()
  if (type.includes('presentation') || type.includes('deck')) return TrendingUp
  if (type.includes('chart')) return TrendingUp
  if (type.includes('folder')) return Folder
  if (result?.source && ICON_BY_SOURCE[result.source]) {
    return ICON_BY_SOURCE[result.source]
  }
  if (type.includes('collab')) return Users
  if (type.includes('planning') || type.includes('calendar')) return Calendar
  return FileText
}

function formatSlidesLabel(slideCount, type) {
  if (slideCount && slideCount > 0) {
    return `${slideCount} slide${slideCount === 1 ? '' : 's'}`
  }
  const lower = (type || '').toLowerCase()
  if (lower.includes('presentation') || lower.includes('deck')) return 'Presentation'
  if (lower.includes('spreadsheet')) return 'Spreadsheet'
  if (lower.includes('chart')) return 'Chart'
  if (lower.includes('folder')) return 'Folder'
  return null
}

export default function SearchDropdown({ isOpen, onClose }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setSearchQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  const runSearch = useCallback(async (query) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setSearchError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setSearchError(null)
    try {
      const response = await globalSearch(trimmed, 10)
      if (response?.status === 'success') {
        setResults(response.data?.results || [])
      } else {
        setResults([])
        setSearchError(response?.message || 'Search unavailable')
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
      const status = error?.response?.status
      if (status === 404) {
        setSearchError(
          'Search API not found — restart the backend and rebuild the frontend (npm run dev).',
        )
      } else {
        setSearchError(
          error?.response?.data?.message ||
            'Could not reach search. Check that the API is running.',
        )
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!searchQuery.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      runSearch(searchQuery)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, runSearch])

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const navigateToResult = useCallback(
    (result) => {
      if (!result) return
      const path = getSearchResultPath(result)
      onClose()
      router.push(path)
    },
    [onClose, router],
  )

  const viewAllResults = useCallback(() => {
    const q = searchQuery.trim()
    onClose()
    if (q) {
      router.push(`/vault?search=${encodeURIComponent(q)}`)
    } else {
      router.push('/vault')
    }
  }, [searchQuery, onClose, router])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const maxIndex = results.length
        setSelectedIndex((prev) => Math.min(prev + 1, maxIndex))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex < results.length && results[selectedIndex]) {
          navigateToResult(results[selectedIndex])
        } else if (searchQuery.trim()) {
          viewAllResults()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    isOpen,
    results,
    selectedIndex,
    onClose,
    navigateToResult,
    viewAllResults,
    searchQuery,
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (results.length > 0 && results[selectedIndex]) {
      navigateToResult(results[selectedIndex])
    } else if (searchQuery.trim()) {
      viewAllResults()
    }
  }

  const showResultsPanel = searchQuery.trim() && (loading || results.length > 0)
  const showNoResults =
    searchQuery.trim() && !loading && results.length === 0 && !searchError
  const showSearchError = searchQuery.trim() && !loading && searchError

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 bottom-0 z-30 bg-black/20"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[55px] left-0 right-0 z-40 flex justify-center pt-4"
          >
            <motion.div
              layout
              transition={{ layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
              className="w-full max-w-[600px] mx-auto px-8"
            >
              <form onSubmit={handleSubmit}>
                <motion.div
                  layout
                  className="relative flex items-center w-full bg-white rounded-b-xl shadow-md border border-[#e4e4e7] border-t-transparent overflow-hidden p-2"
                >
                  <motion.div
                    layout="position"
                    className="flex items-center justify-center w-8 h-8 border border-[#f3f4f6cc] rounded-lg m-1.5 shrink-0"
                    style={{
                      background:
                        'linear-gradient(135deg, #F9FAFB 0%, #FFF 100%)',
                    }}
                  >
                    <Search className="w-4 h-4 text-[#3c3f45]" />
                  </motion.div>

                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects, vault, collabs..."
                    className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a]"
                    autoComplete="off"
                  />

                  <motion.div
                    layout="position"
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg m-1.5 shrink-0"
                  >
                    <span
                      className="text-[10px] leading-[14px] text-[#71717a] font-normal"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      ⌘
                    </span>
                    <span
                      className="text-[11px] leading-[14px] text-[#71717a] font-normal"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      K
                    </span>
                  </motion.div>
                </motion.div>
              </form>

              {showResultsPanel && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 bg-white rounded-lg shadow-lg border border-[#e4e4e7] overflow-hidden"
                >
                  <div className="max-h-[400px] overflow-y-auto">
                    {loading && (
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2 px-4 py-8 text-[#71717a]"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-[14px]">Searching...</span>
                      </motion.div>
                    )}

                    {!loading &&
                      results.map((item, index) => {
                        const Icon = getResultIcon(item)
                        const isSelected = index === selectedIndex
                        const slidesLabel = formatSlidesLabel(
                          item.slideCount,
                          item.type,
                        )
                        const updatedLabel = item.updatedAt
                          ? timeAgo(new Date(item.updatedAt))
                          : ''

                        return (
                          <motion.div
                            layout
                            key={`${item.source}-${item.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ backgroundColor: '#f4f4f5' }}
                            onClick={() => navigateToResult(item)}
                            className={`flex items-start gap-4 px-4 py-3 cursor-pointer relative ${
                              isSelected ? 'bg-[#f4f4f5]' : ''
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="search-selection-indicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-[#71717a]"
                              />
                            )}
                            <div className="flex items-center justify-center w-8 h-8 shrink-0 mt-0.5">
                              <Icon className="w-5 h-5 text-[#71717a]" />
                            </div>
                            <motion.div layout="position" className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[14px] font-medium leading-[20px] text-[#18181b] truncate">
                                  {item.title}
                                </h3>
                                {item.tag && (
                                  <span className="px-2 py-0.5 bg-[#f4f4f5] text-[#71717a] text-[11px] leading-[16px] font-medium rounded shrink-0">
                                    {item.tag}
                                  </span>
                                )}
                                {item.isShared && (
                                  <span className="px-2 py-0.5 bg-[#f4f4f5] text-[#71717a] text-[11px] leading-[16px] font-medium rounded shrink-0">
                                    SHARED
                                  </span>
                                )}
                              </div>
                              <p className="text-[13px] leading-[18px] text-[#71717a] mb-1.5 line-clamp-2">
                                {item.description}
                              </p>
                              <motion.div
                                layout="position"
                                className="flex items-center gap-4 text-[12px] leading-[16px] text-[#71717a] flex-wrap"
                              >
                                {slidesLabel && <span>{slidesLabel}</span>}
                                {slidesLabel && updatedLabel && <span>·</span>}
                                {updatedLabel && <span>{updatedLabel}</span>}
                                {item.category && (
                                  <>
                                    <span>·</span>
                                    <span>{item.category}</span>
                                  </>
                                )}
                              </motion.div>
                            </motion.div>
                            <div className="flex items-center justify-center w-6 h-6 shrink-0">
                              <ArrowRight className="w-4 h-4 text-[#71717a]" />
                            </div>
                          </motion.div>
                        )
                      })}
                  </div>

                  <motion.button
                    layout
                    type="button"
                    onClick={viewAllResults}
                    className="w-full border-t border-[#e4e4e7] px-4 py-3 bg-[#f4f4f5] flex items-center justify-between hover:bg-[#ebebed] transition-colors"
                  >
                    <motion.div layout="position" className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#71717a]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">
                        View all results
                      </span>
                    </motion.div>
                    <motion.div
                      layout="position"
                      className="flex items-center gap-1 text-[12px] leading-[16px] text-[#71717a]"
                    >
                      <span>Enter</span>
                      <ArrowRight className="w-3 h-3" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              )}

              {showSearchError && (
                <motion.div
                  layout
                  className="mt-2 bg-white rounded-lg shadow-lg border border-[#fecaca] overflow-hidden px-4 py-3"
                >
                  <p className="text-[14px] text-[#b91c1c]">{searchError}</p>
                </motion.div>
              )}

              {showNoResults && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 bg-white rounded-lg shadow-lg border border-[#e4e4e7] overflow-hidden"
                >
                  <div className="px-8 py-12 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-[#f4f4f5] rounded-full mx-auto mb-4">
                      <FileSearch className="w-8 h-8 text-[#71717a]" />
                    </div>
                    <h3 className="text-[18px] font-semibold leading-[24px] text-[#18181b] mb-2">
                      No results found
                    </h3>
                    <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                      We couldn&apos;t find any matches for{' '}
                      <span className="font-medium text-[#18181b]">
                        &quot;{searchQuery}&quot;
                      </span>
                      . Try different keywords or browse The Vault.
                    </p>
                  </div>

                  <motion.button
                    layout
                    type="button"
                    onClick={viewAllResults}
                    className="w-full border-t border-[#e4e4e7] px-4 py-3 bg-[#f4f4f5] flex items-center justify-between hover:bg-[#ebebed] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#71717a]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">
                        Search in The Vault
                      </span>
                    </div>
                    <motion.div
                      layout="position"
                      className="flex items-center gap-1 text-[12px] leading-[16px] text-[#71717a]"
                    >
                      <span>Enter</span>
                      <ArrowRight className="w-3 h-3" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
