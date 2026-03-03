import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, Calendar, Users, TrendingUp, ArrowRight, FileSearch } from 'lucide-react'

// Dummy search data
const searchItems = [
  {
    id: 1,
    title: 'Q4 2024 Strategic Planning Deck',
    description: 'Executive-level strategy framework',
    slides: 42,
    updated: 'today',
    category: 'Strategy',
    tag: 'TRENDING',
    icon: TrendingUp,
  },
  {
    id: 2,
    title: 'Product Roadmap Planning Template',
    description: 'Feature prioritization & timeline visualization',
    slides: 28,
    updated: '2 days ago',
    category: 'Product',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Investor Pitch Planning Guide',
    description: 'Seed to Series A fundraising deck · Expert insights',
    slides: 35,
    updated: '1 week ago',
    category: 'Finance',
    icon: TrendingUp,
  },
  {
    id: 4,
    title: 'Annual Business Planning Framework',
    description: 'Goal setting, budgets & OKRs · Cross-functional',
    slides: 51,
    updated: '3 days ago',
    category: 'Planning',
    icon: Calendar,
  },
  {
    id: 5,
    title: 'Marketing Campaign Planner',
    description: 'Multi-channel strategy deck · ROI tracking',
    slides: 22,
    updated: '5 days ago',
    category: 'Marketing',
    icon: Users,
  },
  {
    id: 6,
    title: 'Brand Guidelines Template',
    description: 'Complete brand identity documentation',
    slides: 45,
    updated: '1 week ago',
    category: 'Design',
    icon: FileText,
  },
  {
    id: 7,
    title: 'Quarterly Review Presentation',
    description: 'Performance metrics and analysis',
    slides: 30,
    updated: '4 days ago',
    category: 'Business',
    icon: Calendar,
  },
]

export default function SearchDropdown({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Filter search results
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return searchItems.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredResults])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filteredResults.length > 0) {
        e.preventDefault()
        // Handle selection
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredResults, selectedIndex, onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (filteredResults.length > 0) {
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 bottom-0 z-30 bg-black/20"
            onClick={onClose}
          />
          
          {/* Search Input Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[55px] left-0 right-0 z-40 flex justify-center pt-4"
          >
            <div className="w-full max-w-[600px] mx-auto px-8">
              <form onSubmit={handleSubmit}>
                <div className="relative flex items-center w-full bg-white rounded-b-lg shadow-md border border-[#e4e4e7] overflow-hidden">
                  {/* Search Icon Container */}
                  <div
                    className="flex items-center justify-center w-8 h-8 border border-[#f3f4f6cc] rounded-md m-1.5 shrink-0"
                    style={{ background: 'linear-gradient(135deg, #F9FAFB 0%, #FFF 100%)' }}
                  >
                    <Search className="w-3 h-3 text-[#3c3f45]" />
                  </div>
                  
                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a]"
                  />
                  
                  {/* Keyboard Shortcut Indicator */}
                  <div className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg m-1.5 shrink-0">
                    <span className="text-[11px] leading-[14px] text-[#18181b] font-normal" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      ⌘
                    </span>
                    <span className="text-[11px] leading-[14px] text-[#18181b] font-normal" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      K 
                    </span>
                  </div>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {(searchQuery.trim() && filteredResults.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 bg-white rounded-lg shadow-lg border border-[#e4e4e7] overflow-hidden"
                >
                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredResults.map((item, index) => {
                      const Icon = item.icon
                      const isSelected = index === selectedIndex
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ backgroundColor: '#f4f4f5' }}
                          className={`flex items-start gap-4 px-4 py-3 cursor-pointer relative ${
                            isSelected ? 'bg-[#f4f4f5]' : ''
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#71717a]" />
                          )}
                          <div className="flex items-center justify-center w-8 h-8 shrink-0 mt-0.5">
                            <Icon className="w-5 h-5 text-[#71717a]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-[14px] font-medium leading-[20px] text-[#18181b]">
                                {item.title}
                              </h3>
                              {item.tag && (
                                <span className="px-2 py-0.5 bg-[#f4f4f5] text-[#71717a] text-[11px] leading-[16px] font-medium rounded">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] leading-[18px] text-[#71717a] mb-1.5">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-4 text-[12px] leading-[16px] text-[#71717a]">
                              <span>{item.slides} slides</span>
                              <span>·</span>
                              <span>{item.updated}</span>
                              <span>·</span>
                              <span>{item.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-6 h-6 shrink-0">
                            <ArrowRight className="w-4 h-4 text-[#71717a]" />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  
                  {/* View All Results */}
                  <div className="border-t border-[#e4e4e7] px-4 py-3 bg-[#f4f4f5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#71717a]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">
                        View all results
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#71717a]">
                      <span>Enter</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* No Results State */}
              {(searchQuery.trim() && filteredResults.length === 0) && (
                <motion.div
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
                      We couldn't find any matches for <span className="font-medium text-[#18181b]">"{searchQuery}"</span>. Try using different keywords or check your spelling.
                    </p>
                  </div>
                  
                  {/* View All Results */}
                  <div className="border-t border-[#e4e4e7] px-4 py-3 bg-[#f4f4f5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#71717a]" />
                      <span className="text-[14px] leading-[20px] text-[#18181b] font-medium">
                        View all results
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] leading-[16px] text-[#71717a]">
                      <span>Enter</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

