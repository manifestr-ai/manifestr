import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { createVaultFolder, listFolders } from "../../services/vault";
import { setVaultFolders } from "./vaultFolders";
import { useRouter } from "next/router";

export default function VaultFolderGrid({
  folders = [],
  onFolderClick = null,
}) {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const router = useRouter();
  // NO DEFAULT FOLDERS - only show real data from DB
  const foldersToDisplay = folders;

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
    <div className="px-4 md:px-[38px]">
      <div className="mb-4">
        <h2
          className="text-[20px] font-bold leading-[30px] text-[var(--base-foreground,#18181B)] font-[Inter] not-italic"
          style={{
            color: "var(--base-foreground, #18181B)",
            fontFamily: "Inter",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "30px",
          }}
        >
          All Folders
        </h2>
      </div>

      <div
        className="flex items-center gap-3 overflow-x-auto  -mx-4 px-4 md:mx-0 md:px-0"
        style={{ height: 130 }}
      >
        {foldersToDisplay.map((folder, index) => {
          const folderName = typeof folder === "string" ? folder : folder.name;
          const folderHref = typeof folder === "string" ? null : folder.href;
          const folderId = typeof folder === "string" ? null : folder.id;
          const memberCount =
            typeof folder === "string" ? null : folder.memberCount;
          const documentCount =
            typeof folder === "string" ? null : folder.documentCount;

          const FolderContent = () => (
            <div className="relative w-[125px] h-[90px]">
              <div className="absolute inset-0 rounded-md overflow-hidden ">
                <img
                  src="/assets/icons/folder-icon.svg"
                  alt={folderName}
                  className="shadow-[0px_5px_4px_rgba(0,0,0,0.04)]"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                  <p
                    style={{
                      color: "#FFF",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "18px",
                    }}
                    className="pt-2 line-clamp-2"
                  >
                    {folderName.split(" ").map((word, i) => (
                      <span key={i} className="block">
                        {word}
                      </span>
                    ))}
                  </p>

                  {/* {(memberCount !== null || documentCount !== null) && (
                    <p className="text-white/80 text-[10px] mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {documentCount || 0} docs • {memberCount || 0} members
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          );

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                if (onFolderClick && folder) {
                  onFolderClick(folder);
                }
              }}
            >
              {folderHref ? (
                <Link href={folderHref}>
                  <FolderContent />
                </Link>
              ) : (
                <FolderContent />
              )}
            </motion.div>
          );
        })}
        <motion.div
          onClick={() => setShowModal(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <svg
            width="130"
            height="96"
            viewBox="0 0 87 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_dd_12313_45566)">
              <path
                d="M3.19922 12.1637C3.19922 8.62803 6.06542 5.76184 9.60105 5.76184H76.8203C80.3559 5.76184 83.2221 8.62804 83.2221 12.1637V50.5747C83.2221 54.1103 80.3559 56.9765 76.8203 56.9765H9.60105C6.06542 56.9765 3.19922 54.1103 3.19922 50.5747V12.1637Z"
                fill="white"
                shape-rendering="crispEdges"
              />
              <path
                d="M9.60059 6.26184H76.8203C80.0796 6.26184 82.7214 8.90393 82.7217 12.1632V50.5743C82.7217 53.8338 80.0798 56.4767 76.8203 56.4767H9.60059C6.34131 56.4764 3.69922 53.8337 3.69922 50.5743V12.1632C3.69947 8.90408 6.34146 6.26209 9.60059 6.26184Z"
                stroke="#E5E7EB"
                shape-rendering="crispEdges"
              />
              <path
                d="M16.002 1.1402H41.6094C42.7474 1.1402 43.6698 2.06272 43.6699 3.20074V7.82281H13.9414V3.20074L13.9521 2.98981C14.0579 1.95094 14.9352 1.14029 16.002 1.1402Z"
                fill="white"
              />
              <path
                d="M16.002 1.1402H41.6094C42.7474 1.1402 43.6698 2.06272 43.6699 3.20074V7.82281H13.9414V3.20074L13.9521 2.98981C14.0579 1.95094 14.9352 1.14029 16.002 1.1402Z"
                stroke="#E5E7EB"
              />
              <path
                d="M31.7773 30.9765H55.1107"
                stroke="#868686"
                stroke-width="2.0895"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M43.4453 20.9765V40.9765"
                stroke="#868686"
                stroke-width="2.0895"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <filter
                id="filter0_dd_12313_45566"
                x="-0.00169832"
                y="1.42455e-05"
                width="86.4253"
                height="62.7381"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="1.28037"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect1_dropShadow_12313_45566"
                />
                <feOffset dy="1.28037" />
                <feGaussianBlur stdDeviation="1.28037" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_12313_45566"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="0.640183"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect2_dropShadow_12313_45566"
                />
                <feOffset dy="2.56073" />
                <feGaussianBlur stdDeviation="1.92055" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_dropShadow_12313_45566"
                  result="effect2_dropShadow_12313_45566"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect2_dropShadow_12313_45566"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </motion.div>
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
    </div>
  );
}
