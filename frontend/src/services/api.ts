import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8080';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export const getCurrentUser = async () => {
    const response = await apiClient.get('/api/me');
    return response.data;
}