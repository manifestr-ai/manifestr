import api from "../lib/api";
import { API_BASE_URL, ENDPOINTS } from "./config";

/**
 * List Vault items (files and folders)
 * @param {Object} params - Query parameters
 * @param {string} [params.parentId] - UUID of folder (omit or 'root' for top-level)
 * @param {string} [params.search] - String to filter by title
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export const listVaultItems = async (params = {}) => {
  const response = await api.get(ENDPOINTS.VAULTS.LIST, {
    params,
    baseURL: API_BASE_URL,
  });
  return response.data;
};

/**
 * Create a new folder in the Vault
 * @param {Object} data
 * @param {string} data.title - Title of the folder
 * @param {string} [data.parentId] - UUID of parent folder
 * @param {string} data.project - Project name or ID
 * @returns {Promise<Object>} Created folder object
 */
export const createFolder = async (data) => {
  const response = await api.post(ENDPOINTS.VAULTS.CREATE_FOLDER, data, {
    baseURL: API_BASE_URL,
  });
  return response.data;
};

/**
 * Create a new file item in the Vault
 * @param {Object} data
 * @param {string} data.title - Title of the file
 * @param {string} data.fileKey - S3 key from presigned upload
 * @param {string} [data.parentId] - UUID of parent folder
 * @param {string} [data.status] - Status: 'Draft', 'In Progress', 'In Review', 'Final'
 * @param {string} data.project - Project name or ID
 * @param {number} data.size - File size in bytes
 * @param {string} [data.thumbnailUrl] - Optional URL for thumbnail
 * @returns {Promise<Object>} Created file item object
 */
export const createFileItem = async (data) => {
  const response = await api.post(ENDPOINTS.VAULTS.CREATE_FILE, data, {
    baseURL: API_BASE_URL,
  });
  return response.data;
};

/**
 * Update a Vault item
 * @param {string} id - Item UUID
 * @param {Object} data - Fields to update (title, status, parentId)
 * @returns {Promise<Object>} Updated item object
 */
export const updateVaultItem = async (id, data) => {
  const response = await api.patch(ENDPOINTS.VAULTS.UPDATE(id), data, {
    baseURL: API_BASE_URL,
  });
  return response.data;
};

/**
 * Delete a Vault item
 * @param {string} id - Item UUID
 * @returns {Promise<void>}
 */
export const deleteVaultItem = async (id) => {
  await api.delete(ENDPOINTS.VAULTS.DELETE(id), {
    baseURL: API_BASE_URL,
  });
};

/**
 * Create a new folder in the Vault
 */
export const createVaultFolder = async (data) => {
  const response = await api.post(ENDPOINTS.VAULTS.CREATE_FOLDER, data, {
    baseURL: API_BASE_URL,
  });
  return response.data;
};

/**
 * Get all folders
 */
export const listFolders = async () => {
  const response = await api.get(ENDPOINTS.VAULTS.LIST_FOLDERS, {
    baseURL: API_BASE_URL,
  });
  return response.data;
};

/**
 * Get only folders from vault
 */
// export const listVaultFolders = async (params = {}) => {
//   const response = await api.get(ENDPOINTS.VAULTS.LIST, {
//     params,
//     baseURL: API_BASE_URL,
//   });

//   // filter folders only
//   const folders = (response.data.data || []).filter(
//     (item) => item.type === "folder",
//   );

//   return folders;
// };
