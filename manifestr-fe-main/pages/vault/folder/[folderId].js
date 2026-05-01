import Head from "next/head";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import AppHeader from "../../../components/layout/AppHeader";
import SidebarLayout from "../../../components/layout/SidebarLayout";
import VaultHeader from "../../../components/vault/VaultHeader";
import VaultSearchBar from "../../../components/vault/VaultSearchBar";
import VaultFolderGrid from "../../../components/vault/VaultFolderGrid";
import VaultGrid from "../../../components/vault/VaultGrid";
import { Loader2, FileText } from "lucide-react";
import { listFolders, listVaultItems } from "../../../services/vault";
import {
  VAULT_FOLDERS,
  VAULT_FOLDER_DESCRIPTION,
  getVaultFolderById,
  getVaultFolderDocuments,
  getVaultFolderHref,
  setVaultFolders,
} from "../../../components/vault/vaultFolders";

export default function VaultFolderDetailPage() {
  const router = useRouter();
  const { folderId } = router.query;
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tool: "All Tools",
    sort: "Last Edited",
    collab: "All Collabs",
  });
  const [folderData, setFolderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documentCards, setDocumentCards] = useState([]);

  useEffect(() => {
    if (typeof folderId !== "string" || folderId.length === 0) return;
    if (!router.isReady) return;

    fetchVaultFolderDetails(folderId);
  }, [router.isReady, folderId]);

  const mapVaultItemToCard = (item) => {
    const createdAt = item?.createdAt || item?.updatedAt;
    const fallbackThumb =
      "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop";
    let thumbnail = item?.thumbnail_url || fallbackThumb;

    if (
      !item?.thumbnail_url &&
      item?.file_key &&
      (item?.title?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
        item?.type === "image")
    ) {
      thumbnail = `https://manifestr-dev-bucket.s3.ap-southeast-2.amazonaws.com/${item.file_key}`;
    }

    return {
      id: item?.id,
      title: item?.title || "Untitled",
      project: item?.project || "Vault File",
      status: item?.status || "Draft",
      thumbnail,
      collaborators: [],
      lastEdited: createdAt
        ? new Date(createdAt).toLocaleDateString("en-GB")
        : "Just now",
      type: item?.type || "document",
      rawData: item,
    };
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await listFolders();
        const data = res?.data || res || [];

        setVaultFolders(data);
      } catch (err) {
        console.error("Failed to load folders", err);
      }
    };

    fetchFolders();
  }, []);

  const fetchVaultFolderDetails = async (id) => {
    try {
      setIsLoading(true);
      const knownFolder = getVaultFolderById(id);
      setFolderData({
        name: knownFolder?.name || "Vault Folder",
        purpose_notes: VAULT_FOLDER_DESCRIPTION,
        cover_image: null,
      });

      const response = await listVaultItems({ folder_id: id });
      const vaultItems = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      // Keep only files in this view. Folder navigation is already shown in the grid above.
      const onlyFiles = vaultItems.filter((item) => item?.type !== "folder");
      const mappedDocs = onlyFiles.map(mapVaultItemToCard);

      setDocumentCards(
        mappedDocs.length > 0 ? mappedDocs : [],
      );
    } catch (error) {
      setFolderData(null);
      setDocumentCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isVaultFolder =
    typeof folderId === "string" && !!getVaultFolderById(folderId);
  const vaultFolder =
    typeof folderId === "string" ? getVaultFolderById(folderId) : null;
  const hideVaultFolderHeaderChrome =
    isVaultFolder &&
    typeof folderId === "string" &&
    [
      "marketing-materials",
      "finance-reports",
      "presentations",
      "client-assets",
    ].includes(folderId);

  const handleProjectClick = (card) => {
    if (!card?.id) return;
    if (card?.isDummy) return;

    const type = (
      card?.rawData?.type ||
      card?.type ||
      "document"
    ).toLowerCase();

    if (type.includes("presentation")) {
      router.push(`/presentation-editor?id=${card.id}`);
    } else if (type.includes("chart")) {
      router.push(`/chart-viewer?id=${card.id}`);
    } else if (type.includes("spreadsheet") || type.includes("sheet")) {
      router.push(`/spreadsheet-editor?id=${card.id}`);
    } else if (type.includes("image")) {
      router.push(`/image-editor?id=${card.id}`);
    } else {
      router.push(`/docs-editor?id=${card.id}`);
    }
  };

  const headerBackgroundImage =
    typeof window !== "undefined"
      ? `${window.location.origin}/assets/banners/wheel-banner.png`
      : "http://localhost:3000/assets/banners/wheel-banner.png";

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCards = useMemo(() => {
    return documentCards
      .filter((card) => {
        if (normalizedQuery) {
          const haystack = [
            card.title,
            card.project,
            card.status,
            card.lastEdited,
            ...(card.collaborators || []).map((c) => c?.name),
            ...(card.collaborators || []).map((c) => c?.email),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(normalizedQuery)) return false;
        }

        if (filters.tool !== "All Tools") {
          if (
            !card.project?.toLowerCase().includes(filters.tool.toLowerCase())
          ) {
            return false;
          }
        }

        if (filters.collab !== "All Collabs") {
          const hasCollab = card.collaborators?.some(
            (c) => c.name === filters.collab,
          );
          if (!hasCollab) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case "Last Edited":
            return (
              new Date(
                b.rawData?.lastAccessed ||
                  b.rawData?.updatedAt ||
                  b.rawData?.createdAt ||
                  0,
              ) -
              new Date(
                a.rawData?.lastAccessed ||
                  a.rawData?.updatedAt ||
                  a.rawData?.createdAt ||
                  0,
              )
            );

          case "Recently Saved":
            return (
              new Date(b.rawData?.createdAt || 0) -
              new Date(a.rawData?.createdAt || 0)
            );

          case "Most Used":
            return (b.rawData?.usage || 0) - (a.rawData?.usage || 0);

          case "Tool Origin":
            return (a.project || "").localeCompare(b.project || "");

          default:
            return 0;
        }
      });
  }, [documentCards, normalizedQuery, filters]);

  return (
    <>
      <Head>
        <title>
          {folderData?.name || "Vault Folder"} - The Vault - Manifestr
        </title>
      </Head>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <VaultHeader
          title={
            (isVaultFolder
              ? vaultFolder?.headerTitle
              : folderData?.name?.toUpperCase()) || "VAULT FOLDER"
          }
          description={null}
          isBlack={false}
          backgroundImage={headerBackgroundImage}
          showActionButtons={false}
        />

        {isLoading ? (
          <div className="px-4 md:px-[38px] py-12 w-full flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 text-lg">Loading vault folder...</p>
          </div>
        ) : !folderData ? (
          <div className="px-4 md:px-[38px] py-12 w-full flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Vault folder not found</p>
          </div>
        ) : (
          <>
            <VaultSearchBar
              viewMode={viewMode}
              setViewMode={setViewMode}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
              }}
            />

            {isVaultFolder && (
              <VaultFolderGrid
                folders={VAULT_FOLDERS.map((f) => ({
                  id: f.id,
                  name: f.name,
                  href: getVaultFolderHref(f.id),
                }))}
                heighLightFolder={folderId}
              />
            )}

            {filteredCards.length === 0 ? (
              <div className="px-4 md:px-[38px] py-12 w-full text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  {documentCards.length === 0
                    ? "No documents in this folder yet"
                    : "No results found"}
                </p>
                {documentCards.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    Add your first document to get started!
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Try a different search term or filter.
                  </p>
                )}
              </div>
            ) : (
              <VaultGrid
                cards={filteredCards}
                showTitle={true}
                viewMode={viewMode}
                onCardClick={handleProjectClick}
                title="Documents"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

VaultFolderDetailPage.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>{page}</SidebarLayout>
    </div>
  );
};
