import api from '../lib/api';
import { API_BASE_URL, ENDPOINTS } from './config';

/**
 * Get current user profile
 * @returns {Promise<{data: Object}>}
 */
export const getUserProfile = async () => {
    const response = await api.get('/auth/me', {
        baseURL: API_BASE_URL.replace('/api', ''),
    });
    return response.data;
};

/**
 * Update user profile
 * @param {Object} data - Profile data to update
 * @returns {Promise<{data: Object}>}
 */
export const updateUserProfile = async (data) => {
    const response = await api.patch('/auth/profile', data, {
        baseURL: API_BASE_URL.replace('/api', ''),
    });
    return response.data;
};
