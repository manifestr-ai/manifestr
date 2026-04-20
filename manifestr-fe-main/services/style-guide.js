import api from '../lib/api';
import { API_BASE_URL, ENDPOINTS } from './config';

/**
 * List all Style Guides
 * @returns {Promise<{data: Array}>}
 */
export const listStyleGuides = async () => {
    const response = await api.get(ENDPOINTS.STYLE_GUIDES.LIST, {
        baseURL: API_BASE_URL,
    });
    return response.data;
};

/**
 * Get details of a specific Style Guide
 * @param {string} id - Style Guide UUID
 * @returns {Promise<{data: Object}>}
 */
export const getStyleGuideDetails = async (id) => {
    const response = await api.get(ENDPOINTS.STYLE_GUIDES.DETAILS(id), {
        baseURL: API_BASE_URL,
    });
    return response.data;
};

/**
 * Create a new Style Guide
 * @param {Object} data
 * @param {string} data.name - Name of the Style Guide
 * @returns {Promise<{data: Object}>} Created style guide object
 */
export const createStyleGuide = async (data) => {
    const response = await api.post(ENDPOINTS.STYLE_GUIDES.CREATE, data, {
        baseURL: API_BASE_URL,
    });
    return response.data;
};

/**
 * Update a Style Guide (Save Step)
 * @param {string} id - Style Guide UUID
 * @param {Object} data - Partial update data (e.g. logo, colors, currentStep)
 * @returns {Promise<{data: Object}>} Updated style guide object
 */
export const updateStyleGuide = async (id, data) => {
    const response = await api.patch(ENDPOINTS.STYLE_GUIDES.UPDATE(id), data, {
        baseURL: API_BASE_URL,
    });
    return response.data;
};

/**
 * Delete a Style Guide
 * @param {string} id - Style Guide UUID
 * @returns {Promise<{data: Object}>} Deletion response
 */
export const deleteStyleGuide = async (id) => {
    const response = await api.delete(ENDPOINTS.STYLE_GUIDES.DELETE(id), {
        baseURL: API_BASE_URL,
    });
    return response.data;
};
