import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic, ChevronDown, LayoutGrid, List, Users } from 'lucide-react'

export default function CollabsSearchBar({ placeholder = 'Search The Vault...', viewMode: controlledViewMode, setViewMode: controlledSetViewMode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllToolsDropdown, setShowAllToolsDropdown] = useState(false)
  const [showAllActiveCollabsDropdown, setShowAllActiveCollabsDropdown] = useState(false)
  const [showLastEditedDropdown, setShowLastEditedDropdown] = useState(false)
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false)
  const [selectedTool, setSelectedTool] = useState('All Tools')
  const [selectedCollab, setSelectedCollab] = useState('All Active Collabs')
  const [selectedSort, setSelectedSort] = useState('Last Edited')
  const [localViewMode, setLocalViewMode] = useState('grid')
  const viewMode = controlledViewMode ?? localViewMode
  const setViewMode = controlledSetViewMode ?? setLocalViewMode

  const tools = ['All Tools', 'The Deck', 'The Briefcase', 'The Strategist', 'The Analyzer']
  const collabOptions = ['All Active Collabs', 'My Collabs', 'Shared with Me', 'Archived']
  const sortOptions = ['Last Edited', 'Name', 'Date Created', 'Size']

  return (
    <div className="px-[30px] py-6 space-y-4">
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
            placeholder={placeholder}
            className="w-full h-full pl-10 pr-12 text-[16px] leading-[24px] text-[#18181b] placeholder:text-[#71717a] focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Mic className="w-6 h-6 text-[#71717a] cursor-pointer hover:text-[#18181b] transition-colors" />
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* All Tools Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowAllToolsDropdown(!showAllToolsDropdown)
                setShowAllActiveCollabsDropdown(false)
                setShowLastEditedDropdown(false)
                setShowMoreFiltersDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <span>{selectedTool}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllToolsDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showAllToolsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[129px] overflow-hidden"
                >
                  {tools.map((tool) => (
                    <motion.button
                      key={tool}
                      onClick={() => {
                        setSelectedTool(tool)
                        setShowAllToolsDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                    >
                      {tool}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* All Active Collabs Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowAllActiveCollabsDropdown(!showAllActiveCollabsDropdown)
                setShowAllToolsDropdown(false)
                setShowLastEditedDropdown(false)
                setShowMoreFiltersDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>{selectedCollab}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllActiveCollabsDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showAllActiveCollabsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[188px] overflow-hidden"
                >
                  {collabOptions.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        setSelectedCollab(option)
                        setShowAllActiveCollabsDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                    >
                      {option}
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
                setShowAllActiveCollabsDropdown(false)
                setShowMoreFiltersDropdown(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <span>{selectedSort}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showLastEditedDropdown ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showLastEditedDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 min-w-[148px] overflow-hidden"
                >
                  {sortOptions.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option)
                        setShowLastEditedDropdown(false)
                      }}
                      whileHover={{ backgroundColor: '#f4f4f5' }}
                      className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                    >
                      {option}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Filters */}
          <motion.button
            onClick={() => {
              setShowMoreFiltersDropdown(!showMoreFiltersDropdown)
              setShowAllToolsDropdown(false)
              setShowAllActiveCollabsDropdown(false)
              setShowLastEditedDropdown(false)
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            More Filters
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          {/* Reset Filters */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-[13px] font-medium leading-[19.5px] text-[#71717b] hover:text-[#18181b] transition-colors"
          >
            Reset Filters
          </motion.button>

          {/* View Toggle */}
          <div className="flex items-center gap-0 bg-white border border-[#e4e4e7] rounded-lg p-1">
            <motion.button
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-[#18181b]' : 'bg-transparent'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : 'text-[#18181b]'}`} />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-[#18181b]' : 'bg-transparent'
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




