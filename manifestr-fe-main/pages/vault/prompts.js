import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "../../components/layout/AppHeader";
import SidebarLayout from "../../components/layout/SidebarLayout";
import VaultHeader from "../../components/vault/VaultHeader";
import VaultSearchBar from "../../components/vault/VaultSearchBar";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import api from "../../lib/api";
import { useRouter } from "next/router";
import { timeAgo } from "../../utils/url";

export default function VaultPromptsInProgress() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    tool: "All Tools",
    sort: "Last Edited",
    collab: "All Collabs",
  });

  const headerBackgroundImage =
    typeof window !== "undefined"
      ? `${window.location.origin}/assets/banners/abstract-white-wave.png`
      : "http://localhost:3000/assets/banners/abstract-white-wave.png";

  // const prompts = [
  //   {
  //     id: "p1",
  //     title: "Brand Identity Guidelines for Tech Startup",
  //     tool: "The Deck",
  //     edited: "Edited 21h ago",
  //   },
  //   {
  //     id: "p2",
  //     title: "Social Media Content Calendar Q4",
  //     tool: "The Huddle",
  //     edited: "Edited 21h ago",
  //   },
  //   {
  //     id: "p3",
  //     title: "User Research Interview Questions",
  //     tool: "The Strategist",
  //     edited: "Edited 21h ago",
  //   },
  //   {
  //     id: "p4",
  //     title: "User Research Interview Questions",
  //     tool: "The Strategist",
  //     edited: "Edited 21h ago",
  //   },
  //   {
  //     id: "p5",
  //     title: "Brand Identity Guidelines for Tech Startup",
  //     tool: "The Deck",
  //     edited: "Edited 21h ago",
  //   },
  //   {
  //     id: "p6",
  //     title: "Social Media Content Calendar Q4",
  //     tool: "The Huddle",
  //     edited: "Edited 21h ago",
  //   },
  //   {
  //     id: "p7",
  //     title: "User Research Interview Questions",
  //     tool: "The Strategist",
  //     edited: "Edited 21h ago",
  //   },
  //   {
  //     id: "p8",
  //     title: "User Research Interview Questions",
  //     tool: "The Strategist",
  //     edited: "Edited 21h ago",
  //   },
  // ];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [ownedRes] = await Promise.all([
          api.get("/ai/processing-generations"),
        ]);

        let allProcessingPrompts = [];

        // Owned
        if (ownedRes?.data?.status === "success") {
          allProcessingPrompts = [...ownedRes.data.data];
        }

        setItems(allProcessingPrompts);
      } catch (err) {
        console.error("Failed to fetch vault data:", err);
        setItems([]); // important for empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const prompts = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      title: item.title || "Untitled",
      tool: item.type || "AI Tool",
      edited: item.createdAt ? timeAgo(new Date(item.createdAt)) : "Just now",
    }));
  }, [items]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPrompts = useMemo(() => {
    return prompts
      .filter((p) => {
        // SEARCH
        if (normalizedQuery) {
          const haystack = `${p.title} ${p.tool} ${p.edited}`.toLowerCase();
          if (!haystack.includes(normalizedQuery)) return false;
        }

        // TOOL FILTER
        if (filters.tool && filters.tool !== "All Tools") {
          if (!p.tool?.toLowerCase().includes(filters.tool.toLowerCase())) {
            return false;
          }
        }

        //  COLLAB FILTER
        if (filters.collab !== "All Collabs") {
          const hasCollab = p.collaborators?.some(
            (c) => c.name === filters.collab,
          );
          if (!hasCollab) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case "Last Edited":
            // Compare by actual createdAt date if available, fallback to string if not
            return (
              (items.find((i) => i.id === b.id)?.createdAt
                ? new Date(items.find((i) => i.id === b.id).createdAt)
                : new Date(b.edited || 0)) -
              (items.find((i) => i.id === a.id)?.createdAt
                ? new Date(items.find((i) => i.id === a.id).createdAt)
                : new Date(a.edited || 0))
            );
          case "Tool Origin":
            return (a.tool || "").localeCompare(b.tool || "");
          default:
            return 0;
        }
      });
  }, [normalizedQuery, prompts, filters]);

  const gridCols =
    viewMode === "list"
      ? "grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const handleProjectClick = (prompt) => {
    // AGGRESSIVE type detection - check EVERY possible location
    const type = (
      prompt.type ||
      prompt.output_type ||
      prompt.outputType ||
      prompt.input_data?.output ||
      prompt.input_data?.type ||
      prompt.result?.outputFormat ||
      "document"
    ).toLowerCase();

    // Smart routing based on type
    let path;
    if (type.includes("presentation")) {
      path = `/presentation-editor?id=${prompt.id}`;
    } else if (type.includes("chart")) {
      // THE analyser shows auto-generated charts - go to viewer first
      path = `/chart-viewer?id=${prompt.id}`;
    } else if (type.includes("spreadsheet") || type.includes("sheet")) {
      // Other spreadsheet tools open spreadsheet editor
      path = `/spreadsheet-editor?id=${prompt.id}`;
    } else if (type.includes("image")) {
      path = `/image-editor?id=${prompt.id}`;
    } else {
      path = `/docs-editor?id=${prompt.id}`;
    }

    router.push(path);
  };

  return (
    <>
      <Head>
        <title>Prompts In Progress - The Vault - Manifestr</title>
      </Head>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <VaultHeader
          title="THE vault PROMPTS IN PROGRESS"
          description={null}
          isBlack={false}
          backgroundImage={headerBackgroundImage}
          showActionButtons={false}
        />

        <VaultSearchBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          query={searchQuery}
          onQueryChange={(q) => {
            setSearchQuery(q);
          }}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
          }}
        />

        <div className="px-4 md:px-[38px] pb-10">
          {isLoading ? (
            <div className="px-4 md:px-[38px] py-12 w-full text-center">
              <p className="text-gray-500 text-lg">Loading your Prompts...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="py-12 w-full text-center">
              <p className="text-gray-500 text-lg mb-2">No results found.</p>
              <p className="text-gray-400 text-sm">
                Try a different search term.
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="grid grid-cols-1  gap-6">
              {filteredPrompts.map((prompt, idx) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.02 }}
                  className="bg-white border border-[#e4e4e7] rounded-xl shadow-[0px_10px_20px_rgba(0,0,0,0.06)] px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                  onClick={() => handleProjectClick(prompt)}
                >
                  <div className="flex items-center gap-3 min-w-0 mb-4 md:mb-0">
                    <Sparkles className="w-5 h-5 text-[#18181b] shrink-0" />
                    <h3 className="text-[14px] font-semibold leading-[20px] text-[#18181b] truncate">
                      {prompt.title}
                    </h3>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4 shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#f4f4f5] text-[#18181b] text-[12px] font-medium leading-[18px]">
                      {prompt.tool}
                    </span>
                    <div className="text-[11px] leading-[16px] text-[#71717a] italic whitespace-nowrap">
                      In Progress • {prompt.edited}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="h-[40px] px-6 rounded-md bg-[#18181b] text-white flex items-center justify-center gap-2 text-[14px] font-medium mt-2 md:mt-0"
                      type="button"
                    >
                      <Play className="w-4 h-4" />
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`grid ${gridCols} gap-6`}>
              {filteredPrompts.map((prompt, idx) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="bg-white border border-[#e4e4e7] rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.08)] p-5 flex flex-col"
                  onClick={() => handleProjectClick(prompt)}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#18181b]" />
                    </div>
                    <h3 className="text-[14px] font-semibold leading-[20px] text-[#18181b] line-clamp-2">
                      {prompt.title}
                    </h3>
                  </div>

                  <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#f4f4f5] text-[#18181b] text-[12px] font-medium leading-[18px]">
                      {prompt.tool}
                    </span>
                  </div>

                  <div className="mt-4 text-[11px] leading-[16px] text-[#71717a] italic">
                    In Progress • {prompt.edited}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="mt-4 w-full h-[40px] rounded-md bg-[#18181b] text-white flex items-center justify-center gap-2 text-[14px] font-medium"
                    type="button"
                  >
                    <Play className="w-4 h-4" />
                    Continue
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

VaultPromptsInProgress.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <AppHeader />
      <SidebarLayout>{page}</SidebarLayout>
    </div>
  );
};
