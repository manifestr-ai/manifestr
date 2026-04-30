// Get base URL and remove any trailing slashes
const getBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://api.manifestr.ai"
      : "http://localhost:8000");
  return url.replace(/\/+$/, ""); // Remove trailing slashes
};

// Base URL WITHOUT /api prefix (routes define their own prefixes)
const baseUrl = getBaseUrl();
export const API_BASE_URL = baseUrl;

// Endpoints with full paths (some have /api, some don't)
export const ENDPOINTS = {
  ADMIN: {
    OVERVIEW: "/api/admin/overview",
    GROWTH: "/api/admin/growth",
    PRODUCT_USAGE: "/api/admin/product-usage",
    MONETIZATION: "/api/admin/monetization",
    AI_PERFORMANCE: "/api/admin/ai-performance",
    RETENTION: "/api/admin/retention",
    LIFECYCLE: "/api/admin/lifecycle",
    FEATURE_ADOPTION: "/api/admin/feature-adoption",
    PLATFORM_HEALTH: "/api/admin/platform-health",
  },
  UPLOADS: {
    PRESIGN: "/api/uploads/presign",
  },
  VAULTS: {
    LIST: "/api/vaults",
    CREATE_FOLDER: "/api/vaults/folder",
    LIST_FOLDERS: "/api/vaults/folders",
    CREATE_FILE: "/api/vaults",
    UPDATE: (id) => `/api/vaults/${id}`,
    DELETE: (id) => `/api/vaults/${id}`,
  },
  STYLE_GUIDES: {
    LIST: "/api/style-guides",
    DETAILS: (id) => `/api/style-guides/${id}`,
    CREATE: "/api/style-guides",
    UPDATE: (id) => `/api/style-guides/${id}`,
    DELETE: (id) => `/api/style-guides/${id}`,
  },
};
