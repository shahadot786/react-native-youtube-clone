export const API_CONFIG = {
  RAPIDAPI_KEY: process.env.EXPO_PUBLIC_RAPIDAPI_KEY || "",
  RAPIDAPI_HOST:
    process.env.EXPO_PUBLIC_RAPIDAPI_HOST || "yt-api.p.rapidapi.com",
  BASE_URL: "https://yt-api.p.rapidapi.com",
};

export const validateApiConfig = (): boolean => {
  if (!API_CONFIG.RAPIDAPI_KEY) {
    return false;
  }
  return true;
};
