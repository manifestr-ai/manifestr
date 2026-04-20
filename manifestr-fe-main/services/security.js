import api from '../lib/api';
import { API_BASE_URL } from './config';

export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
    }, {
        baseURL: API_BASE_URL
    });
    return response.data;
};

export const getSessions = async () => {
    const response = await api.get('/auth/sessions', {
        baseURL: API_BASE_URL
    });
    return response.data;
};

export const revokeSession = async (sessionId) => {
    const response = await api.delete(`/auth/sessions/${sessionId}`, {
        baseURL: API_BASE_URL
    });
    return response.data;
};

export const updateSecurityAlerts = async (alerts) => {
    const response = await api.patch('/auth/security-alerts', alerts, {
        baseURL: API_BASE_URL
    });
    return response.data;
};

export const deleteAccount = async () => {
    const response = await api.delete('/auth/account', {
        baseURL: API_BASE_URL
    });
    return response.data;
};
