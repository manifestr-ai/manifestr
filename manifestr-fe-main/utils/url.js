/**
 * Convert localhost URLs to production URLs based on environment
 * @param {string} url - The URL to normalize
 * @returns {string} - The normalized URL
 */
export const normalizeUrl = (url) => {
  if (!url) return url;

  // If we're in production and the URL points to localhost, replace it with production API URL
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_API_URL?.includes("manifestr.ai")
  ) {
    const productionApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.manifestr.ai";

    // Replace localhost:XXXX with production URL
    return url.replace(/http:\/\/localhost:\d+/g, productionApiUrl);
  }

  return url;
};

/**
 * Get the base URL for API requests
 * @returns {string} - The base API URL
 */
export const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://api.manifestr.ai"
      : "http://localhost:8000")
  );
};

export function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}
