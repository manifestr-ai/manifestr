import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { Folder, Plus, ChevronLeft } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { VAULT_FOLDERS, getVaultFolderHref } from "./vaultFolders";
import { useEffect, useState } from "react";
import { createVaultFolder } from "../../services/vault";
import { setVaultFolders } from "./vaultFolders";
import { listFolders } from "../../services/vault";

export default function CollabsFolderSidebar() {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0];
  const { toggleSidebar } = useSidebar();

  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await listFolders();
        const data = res?.data || res || [];

        setVaultFolders(data);

        // update local state for immediate UI response
        setFolders(
          (data || []).map((f) => ({
            id: f.id,
            name: f.name || f.title,
            href: getVaultFolderHref(f.id),
          }))
        );
      } catch (err) {
        console.error("Failed to load folders", err);
      }
    };

    fetchFolders();
  }, []);

  // If VAULT_FOLDERS gets set elsewhere, you may want to sync local folders from the global as well:
  useEffect(() => {
    setFolders(
      (VAULT_FOLDERS || []).map((f) => ({
        id: f.id,
        name: f.name,
        href: getVaultFolderHref(f.id),
      }))
    );
  }, [VAULT_FOLDERS]);

  const isActive = (href) => {
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  const handleCreateFolder = async () => {
    const name = folderName.trim();
    if (!name) return;

    try {
      const res = await createVaultFolder({ name });

      const newFolder = res?.data ?? res;

      if (!newFolder?.id) {
        throw new Error("Invalid folder response");
      }

      // REFETCH ALL folders
      const folderRes = await listFolders();
      const data = folderRes?.data || folderRes || [];

      // update global VAULT_FOLDERS
      setVaultFolders(data);

      // force UI refresh (IMPORTANT)
      router.replace(router.asPath);

      setShowModal(false);
      setFolderName("");
    } catch (err) {
      console.error("Create folder failed:", err);
    }
  };
  return (
    <>
      <div className="relative w-[240px] bg-white border-r border-[#e4e4e7] h-full flex flex-col">
        <button
          type="button"
          onClick={() => toggleSidebar("collabsFolder")}
          className="absolute -left-3 top-[26px] w-6 h-6 bg-white border border-[#e4e4e7] rounded-md flex items-center justify-center shadow-sm hover:bg-[#f4f4f5] transition-colors z-50"
        >
          <ChevronLeft className="w-4 h-4 text-[#18181b]" />
        </button>
        <div className="p-5">
          {/* Folders List */}
          <div className="space-y-0 mb-4">
            {folders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-gray-500 text-sm text-center">No folders yet. Create your first folder to get started.</p>
              </div>
            ) : (
              folders.map((folder, index) => {
                const folderIsActive = isActive(folder.href);

                return (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Link href={folder.href || "/vault"}>
                      <motion.div
                        whileHover={{ backgroundColor: "#f4f4f5" }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full h-[37px] px-3 flex items-center gap-2 rounded-md transition-colors cursor-pointer ${
                          folderIsActive ? "bg-[#f4f4f5]" : ""
                        }`}
                      >
                        <Folder className="w-4 h-4 text-[#18181b] flex-shrink-0" />
                        <span
                          className={`text-[14px] leading-[21px] whitespace-nowrap overflow-hidden text-ellipsis ${
                            folderIsActive
                              ? "font-medium text-[#18181b]"
                              : "text-[#18181b]"
                          }`}
                        >
                          {folder.name}
                        </span>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })
            )}
       
          </div>

          {/* New Folder Button */}
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[40px] flex items-center justify-center gap-2 px-3 text-[14px] font-medium leading-[20px] bg-[#71717a] text-white rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Folder
          </motion.button>
        </div>
      </div>

      {showModal && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/1">
          <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>

            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-black"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 text-sm bg-black text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
