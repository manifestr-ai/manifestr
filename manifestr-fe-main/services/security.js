import api from '../lib/api';
import { API_BASE_URL } from './config';

const BASE_URL = API_BASE_URL.replace('/api', '');

export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
    }, {
        baseURL: BASE_URL
    });
    return response.data;
};

export const getSessions = async () => {
    const response = await api.get('/auth/sessions', {
        baseURL: BASE_URL
    });
    return response.data;
};

export const revokeSession = async (sessionId) => {
    const response = await api.delete(`/auth/sessions/${sessionId}`, {
        baseURL: BASE_URL
    });
    return response.data;
};

export const updateSecurityAlerts = async (alerts) => {
    const response = await api.patch('/auth/security-alerts', alerts, {
        baseURL: BASE_URL
    });
    return response.data;
};

export const deleteAccount = async () => {
    const response = await api.delete('/auth/account', {
        baseURL: BASE_URL
    });
    return response.data;
};
