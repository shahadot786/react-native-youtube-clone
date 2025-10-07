export const TAGS = [
  { id: "0", title: "All" },
  { id: "13", title: "Trending" },
  { id: "1", title: "Viral" },
  { id: "2", title: "Music" },
  { id: "3", title: "Gaming" },
  { id: "4", title: "News" },
  { id: "5", title: "Live" },
  { id: "6", title: "Sports" },
  { id: "7", title: "Learning" },
  { id: "8", title: "Fashion" },
  { id: "9", title: "Comedy" },
  { id: "10", title: "Movies" },
  { id: "11", title: "Tech" },
  { id: "12", title: "Cooking" },
];

export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // milliseconds
export const API_TIMEOUT = 10000; // milliseconds

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  API_ERROR: "Failed to load data. Please try again later.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  NOT_FOUND: "Content not found.",
  TIMEOUT: "Request timed out. Please try again.",
  UNKNOWN: "An unexpected error occurred.",
};
