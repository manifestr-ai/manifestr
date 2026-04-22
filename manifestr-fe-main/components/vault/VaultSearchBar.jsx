import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic, ChevronDown, Grid, List, Clock, Plus, Users, Check } from 'lucide-react'

export default function VaultSearchBar({ viewMode = 'grid', setViewMode = () => { }, query, onQueryChange }) {
  const [localQuery, setLocalQuery] = useState('')
  const searchQuery = typeof query === 'string' ? query : localQuery
  const setSearchQuery = onQueryChange || setLocalQuery
  const [showAllToolsDropdown, setShowAllToolsDropdown] = useState(false)
  const [showLastEditedDropdown, setShowLastEditedDropdown] = useState(false)
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false)
  const [selectedTool, setSelectedTool] = useState('All Tools')
  const [selectedCollab, setSelectedCollab] = useState('All Collabs')
  const [selectedSort, setSelectedSort] = useState('Last Edited')

  const tools = [
    'All Tools',
    'The Deck',
    'The Briefcase',
    'The Strategist',
    'The Analyzer',
    'Design Studio',
    'The Huddle',
    'The Wordsmith',
    'Cost CTRL',
  ]
  const collabOptions = ['All Collabs', 'Collab Name 1', 'Collab Name 2', 'Collab Name 3', 'Collab Name 4', 'Collab Name 5']
  const sortOptions = ['Last Edited', 'Most Used', 'Recently Saved', 'Tool Origin']

  return (
    <div className="px-4 md:px-[30px] py-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative h-[48px] bg-white border border-[#e4e4e7] rounded-md overflow-hidden">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-[#71717a]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search The Vault..."
            className="w-full h-full pl-10 pr-12 text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Mic className="w-6 h-6 text-[#71717a]" />
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* All Tools Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowAllToolsDropdown(!showAllToolsDropdown)
                setShowLastEditedDropdown(false)
                setShowMoreFiltersDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.9974 1.33594H3.9974C3.64377 1.33594 3.30464 1.47641 3.05459 1.72646C2.80454 1.97651 2.66406 2.31565 2.66406 2.66927V13.3359C2.66406 13.6896 2.80454 14.0287 3.05459 14.2787C3.30464 14.5288 3.64377 14.6693 3.9974 14.6693H11.9974C12.351 14.6693 12.6902 14.5288 12.9402 14.2787C13.1903 14.0287 13.3307 13.6896 13.3307 13.3359V4.66927L9.9974 1.33594Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.33594 1.33594V4.0026C9.33594 4.35623 9.47641 4.69536 9.72646 4.94541C9.97651 5.19546 10.3156 5.33594 10.6693 5.33594H13.3359" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.66927 6H5.33594" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.6693 8.66406H5.33594" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.6693 11.3359H5.33594" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{selectedTool}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllToolsDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showAllToolsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[220px] overflow-hidden"
                >
                  {tools.map((tool) => (
                    <motion.button
                      key={tool}
                      onClick={() => {
                        setSelectedTool(tool)
                        setShowAllToolsDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {tool === 'All tools' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.9974 1.33594H3.9974C3.64377 1.33594 3.30464 1.47641 3.05459 1.72646C2.80454 1.97651 2.66406 2.31565 2.66406 2.66927V13.3359C2.66406 13.6896 2.80454 14.0287 3.05459 14.2787C3.30464 14.5288 3.64377 14.6693 3.9974 14.6693H11.9974C12.351 14.6693 12.6902 14.5288 12.9402 14.2787C13.1903 14.0287 13.3307 13.6896 13.3307 13.3359V4.66927L9.9974 1.33594Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.33594 1.33594V4.0026C9.33594 4.35623 9.47641 4.69536 9.72646 4.94541C9.97651 5.19546 10.3156 5.33594 10.6693 5.33594H13.3359" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.66927 6H5.33594" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.6693 8.66406H5.33594" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.6693 11.3359H5.33594" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        <span className={tool !== 'All tools' ? 'ml-[28px]' : ''}>{tool}</span>
                      </div>
                      {selectedTool === tool && <Check className="w-4 h-4 text-[#18181b]" />}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Last Edited Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowLastEditedDropdown(!showLastEditedDropdown)
                setShowAllToolsDropdown(false)
                setShowMoreFiltersDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <Clock className="w-4 h-4 text-[#18181b]" />
              <span>{selectedSort}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showLastEditedDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showLastEditedDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[220px] overflow-hidden"
                >
                  {sortOptions.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option)
                        setShowLastEditedDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b] flex items-center justify-between gap-3"
                    >
                      <span>{option}</span>
                      {selectedSort === option && <Check className="w-4 h-4 text-[#18181b]" />}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Filters */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowMoreFiltersDropdown(!showMoreFiltersDropdown)
                setShowAllToolsDropdown(false)
                setShowLastEditedDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] rounded-md h-[36px] px-3 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                More Filters
              </span>
            </motion.button>
            <AnimatePresence>
              {showMoreFiltersDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[220px] overflow-hidden"
                >
                  <div className="px-3 py-2 text-[12px] font-medium text-[#71717a] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#71717a]" />
                    All Collabs
                  </div>
                  {collabOptions.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        setSelectedCollab(option)
                        setShowMoreFiltersDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b] flex items-center justify-between gap-3"
                    >
                      <span>{option}</span>
                      {selectedCollab === option && <Check className="w-4 h-4 text-[#18181b]" />}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end md:self-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-[13px] font-medium leading-[19.5px] text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            Reset Filters
          </motion.button>

          {/* View Toggle */}
          <div className="flex items-center gap-0 bg-white border border-[#e4e4e7] rounded-md p-1">
            <motion.button
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#18181b]' : 'bg-transparent'
                }`}
            >
              <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : 'text-[#18181b]'}`} />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#18181b]' : 'bg-transparent'
                }`}
            >
              <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-white' : 'text-[#18181b]'}`} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
