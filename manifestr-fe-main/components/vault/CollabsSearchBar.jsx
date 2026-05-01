import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, ChevronDown, Users, Clock, Plus, Grid, List } from "lucide-react";

export default function CollabsSearchBar({
  placeholder = "Search The Vault...",
  viewMode: controlledViewMode,
  setViewMode: controlledSetViewMode,
  query,
  onQueryChange,
  selectedTool,
  onToolChange,
  selectedCollab,
  onCollabChange,
  selectedSort,
  onSortChange,
  onResetFilters,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllToolsDropdown, setShowAllToolsDropdown] = useState(false);
  const [showAllActiveCollabsDropdown, setShowAllActiveCollabsDropdown] =
    useState(false);
  const [showLastEditedDropdown, setShowLastEditedDropdown] = useState(false);
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);
  const [localSelectedTool, setLocalSelectedTool] = useState("All Tools");
  const [localSelectedCollab, setLocalSelectedCollab] =
    useState("All Active Collabs");
  const [localSelectedSort, setLocalSelectedSort] = useState("Last Edited");
  const [localViewMode, setLocalViewMode] = useState("grid");
  const viewMode = controlledViewMode ?? localViewMode;
  const setViewMode = controlledSetViewMode ?? setLocalViewMode;
  const effectiveQuery = query ?? searchQuery;
  const effectiveSelectedTool = selectedTool ?? localSelectedTool;
  const effectiveSelectedCollab = selectedCollab ?? localSelectedCollab;
  const effectiveSelectedSort = selectedSort ?? localSelectedSort;

  const setEffectiveQuery = (next) => {
    if (onQueryChange) onQueryChange(next);
    else setSearchQuery(next);
  };
  const setEffectiveTool = (next) => {
    if (onToolChange) onToolChange(next);
    else setLocalSelectedTool(next);
  };
  const setEffectiveCollab = (next) => {
    if (onCollabChange) onCollabChange(next);
    else setLocalSelectedCollab(next);
  };
  const setEffectiveSort = (next) => {
    if (onSortChange) onSortChange(next);
    else setLocalSelectedSort(next);
  };

  const tools = [
    "All Tools",
    "The Deck",
    "The Briefcase",
    "The Strategist",
    "The Analyzer",
  ];
  const collabOptions = [
    "All Active Collabs",
    "My Collabs",
    "Shared with Me",
    "Archived",
  ];
  const sortOptions = ["Last Edited", "Name", "Date Created", "Size"];

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
            value={effectiveQuery}
            onChange={(e) => setEffectiveQuery(e.target.value)}
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
                setShowAllToolsDropdown(!showAllToolsDropdown);
                setShowAllActiveCollabsDropdown(false);
                setShowLastEditedDropdown(false);
                setShowMoreFiltersDropdown(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.9974 1.33594H3.9974C3.64377 1.33594 3.30464 1.47641 3.05459 1.72646C2.80454 1.97651 2.66406 2.31565 2.66406 2.66927V13.3359C2.66406 13.6896 2.80454 14.0287 3.05459 14.2787C3.30464 14.5288 3.64377 14.6693 3.9974 14.6693H11.9974C12.351 14.6693 12.6902 14.5288 12.9402 14.2787C13.1903 14.0287 13.3307 13.6896 13.3307 13.3359V4.66927L9.9974 1.33594Z"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.33594 1.33594V4.0026C9.33594 4.35623 9.47641 4.69536 9.72646 4.94541C9.97651 5.19546 10.3156 5.33594 10.6693 5.33594H13.3359"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66927 6H5.33594"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.6693 8.66406H5.33594"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.6693 11.3359H5.33594"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{effectiveSelectedTool}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAllToolsDropdown ? "rotate-180" : ""}`}
              />
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
                        setEffectiveTool(tool);
                        setShowAllToolsDropdown(false);
                      }}
                      whileHover={{ backgroundColor: "#f4f4f5" }}
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
                setShowAllActiveCollabsDropdown(!showAllActiveCollabsDropdown);
                setShowAllToolsDropdown(false);
                setShowLastEditedDropdown(false);
                setShowMoreFiltersDropdown(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>{effectiveSelectedCollab}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAllActiveCollabsDropdown ? "rotate-180" : ""}`}
              />
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
                        setEffectiveCollab(option);
                        setShowAllActiveCollabsDropdown(false);
                      }}
                      whileHover={{ backgroundColor: "#f4f4f5" }}
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
                setShowLastEditedDropdown(!showLastEditedDropdown);
                setShowAllToolsDropdown(false);
                setShowAllActiveCollabsDropdown(false);
                setShowMoreFiltersDropdown(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 flex items-center gap-2 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            >
              <Clock className="w-4 h-4 text-[#18181b]" />
              <span>{effectiveSelectedSort}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showLastEditedDropdown ? "rotate-180" : ""}`}
              />
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
                        setEffectiveSort(option);
                        setShowLastEditedDropdown(false);
                      }}
                      whileHover={{ backgroundColor: "#f4f4f5" }}
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
              setShowMoreFiltersDropdown(!showMoreFiltersDropdown);
              setShowAllToolsDropdown(false);
              setShowAllActiveCollabsDropdown(false);
              setShowLastEditedDropdown(false);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg h-[36px] px-3 text-[14px] font-medium leading-[21px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              More Filters
            </span>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          {/* Reset Filters */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onResetFilters?.()}
            className="text-[13px] font-medium leading-[19.5px] text-[#71717b] hover:text-[#18181b] transition-colors"
            type="button"
          >
            Reset Filters
          </motion.button>

          {/* View Toggle */}
          <div className="flex items-center gap-0 bg-white border border-[#e4e4e7] rounded-xl">
            <motion.button
              onClick={() => setViewMode("grid")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`w-9 h-9 flex items-center justify-center rounded-l-xl transition-colors ${
                viewMode === "grid" ? "bg-[#18181b]" : "bg-transparent"
              }`}
            >
              <Grid
                className={`w-4 h-4 ${viewMode === "grid" ? "text-white" : "text-[#18181b]"}`}
              />
            </motion.button>
            <motion.button
              onClick={() => setViewMode("list")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`w-9 h-9 flex items-center justify-center  rounded-r-xl transition-colors ${
                viewMode === "list" ? "bg-[#18181b]" : "bg-transparent"
              }`}
            >
              <List
                className={`w-4 h-4 ${viewMode === "list" ? "text-white" : "text-[#18181b]"}`}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
