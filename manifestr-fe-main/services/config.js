// Get base URL and remove any trailing slashes
const getBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 
        (process.env.NODE_ENV === 'production' 
            ? 'https://api.manifestr.ai' 
            : 'http://localhost:8000');
    return url.replace(/\/+$/, ''); // Remove trailing slashes
};

// Production API endpoints are at root, local dev uses /api prefix
const baseUrl = getBaseUrl();
export const API_BASE_URL = baseUrl.includes('localhost') ? `${baseUrl}/api` : baseUrl;

export const ENDPOINTS = {
    UPLOADS: {
        PRESIGN: '/uploads/presign',
    },
    VAULTS: {
        LIST: '/vaults',
        CREATE_FOLDER: '/vaults/folder',
        CREATE_FILE: '/vaults',
        UPDATE: (id) => `/vaults/${id}`,
        DELETE: (id) => `/vaults/${id}`,
    },
    STYLE_GUIDES: {
        LIST: '/style-guides',
        DETAILS: (id) => `/style-guides/${id}`,
        CREATE: '/style-guides',
        UPDATE: (id) => `/style-guides/${id}`,
        DELETE: (id) => `/style-guides/${id}`,
    }
};
