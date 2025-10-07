export const formatViewCount = (count: string | number): string => {
  const num = typeof count === "string" ? parseInt(count) : count;

  if (isNaN(num)) return "0 views";

  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B views`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
};

export const formatNumber = (num: string | number): string => {
  const number = typeof num === "string" ? parseInt(num) : num;

  if (isNaN(number)) return "0";

  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(1)}B`;
  }
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `0:${seconds.toString().padStart(2, "0")}`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // invalid date fallback

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return dateString;
  }
};
