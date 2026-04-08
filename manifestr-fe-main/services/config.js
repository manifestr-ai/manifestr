export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : (process.env.NODE_ENV === 'production' 
        ? 'https://api.manifestr.ai/api' 
        : 'http://localhost:8000/api');

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
