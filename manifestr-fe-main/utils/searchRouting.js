/**
 * Resolve navigation path for a global search result.
 * @param {Object} result - API search result item
 * @returns {string}
 */
export function getSearchResultPath(result) {
  if (result?.url) return result.url;

  const type = (result?.type || "document").toLowerCase();
  const id = result?.id;

  if (type.includes("presentation")) return `/presentation-editor?id=${id}`;
  if (type.includes("chart")) return `/chart-viewer?id=${id}`;
  if (type.includes("spreadsheet") || type.includes("sheet"))
    return `/spreadsheet-editor?id=${id}`;
  if (type.includes("image")) return `/image-editor?id=${id}`;
  return `/docs-editor?id=${id}`;
}
