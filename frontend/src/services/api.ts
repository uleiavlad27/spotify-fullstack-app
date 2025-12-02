import axios from "axios";
import { type Track } from "../types/Track";
import { type Album } from "../types/Album"
import { type Artist } from "../types/Artist";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8080';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export const getCurrentUser = async () => {
    const response = await apiClient.get('/api/me');
    return response.data;
}

export const getUserTopTracks = async (timeRange = 'short_term', limit = 10) => {
    const response = await apiClient.get<Track[]>('/api/user/top-tracks', {
        params: {
            time_range: timeRange,
            limit: limit
        }
    });
    return response.data;
}

export const getUserTopArtist = async (timeRange = 'short_term', limit = 10) => {
    const response = await apiClient.get<Artist[]>("/api/user/top-artists", {
        params: { 
            time_range: timeRange,
            limit : limit
        }
    });
    return response.data;
}

export const getArtistsAlbums = async (artistId: string) => {
    const response = await apiClient.get<Album[]>(`/api/${artistId}/albums`);
    return response.data;
}
