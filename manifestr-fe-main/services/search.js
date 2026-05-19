import api from "../lib/api";

/**
 * Global search across projects, vault, style guides, and collabs.
 * @param {string} query
 * @param {number} [limit=10]
 */
export async function globalSearch(query, limit = 10) {
  const response = await api.get("/api/search", {
    params: { q: query, limit },
  });
  return response.data;
}
