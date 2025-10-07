import axios, { AxiosError, isAxiosError } from "axios";
import { API_CONFIG } from "../config/api.config";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isError: boolean;
}

const handleApiError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const apiErrorMessage =
      axiosError.message || axiosError.response?.statusText;
    if (axiosError.response) {
      return `API Error: ${axiosError.response.status} - ${apiErrorMessage}`;
    } else if (axiosError.request) {
      return "Network Error: No response received from server";
    }
    return axiosError.message;
  }
  return "An unexpected error occurred";
};

const getHeaders = () => ({
  "x-rapidapi-key": API_CONFIG.RAPIDAPI_KEY,
  "x-rapidapi-host": API_CONFIG.RAPIDAPI_HOST,
});

export const fetchTrendingVideos = async (
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/trending`,
      params: { geo: "US", ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.data || [],
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchVideoDetails = async (
  videoId: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/video/info`,
      params: { id: videoId },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const searchVideos = async (
  query: string,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/search`,
      params: { query: query, ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchChannelDetails = async (
  channelId: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/channel/home`,
      params: { id: channelId },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchRelatedVideos = async (
  videoId: string,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/related`,
      params: { id: videoId, ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchComments = async (
  videoId: string,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/comments`,
      params: { id: videoId, ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchHashtagVideo = async (
  tag: string,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/hashtag`,
      params: { tag: tag, ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchChannelVideos = async (
  channelId: string,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/channel/videos`,
      params: { id: channelId, ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchChannelPlaylists = async (
  channelId: string,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/channel/playlists`,
      params: { id: channelId, ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.data || [],
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchPlaylistDetails = async (
  playlistId: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/playlist/details/`,
      params: { id: playlistId, hl: "en" },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};

export const fetchPlaylistVideos = async (
  playlistId: string,
  params?: Record<string, any>
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${API_CONFIG.BASE_URL}/playlist/videos/`,
      params: { id: playlistId, hl: "en", ...params },
      headers: getHeaders(),
      timeout: 10000,
    });
    return {
      data: response.data.contents || [],
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
      isError: true,
    };
  }
};
