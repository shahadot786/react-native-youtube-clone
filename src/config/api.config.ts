export const API_CONFIG = {
  RAPIDAPI_KEY: process.env.EXPO_PUBLIC_RAPIDAPI_KEY || "",
  RAPIDAPI_HOST:
    process.env.EXPO_PUBLIC_RAPIDAPI_HOST || "youtube138.p.rapidapi.com",
  BASE_URL: "https://youtube138.p.rapidapi.com",
};

export const validateApiConfig = (): boolean => {
  if (!API_CONFIG.RAPIDAPI_KEY) {
    console.error("RAPIDAPI_KEY is not configured");
    return false;
  }
  return true;
};
