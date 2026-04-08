/**
 * Convert localhost URLs to production URLs based on environment
 * @param {string} url - The URL to normalize
 * @returns {string} - The normalized URL
 */
export const normalizeUrl = (url) => {
    if (!url) return url;
    
    // If we're in production and the URL points to localhost, replace it with production API URL
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_API_URL?.includes('manifestr.ai')) {
        const productionApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.manifestr.ai';
        
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
    return process.env.NEXT_PUBLIC_API_URL || 
        (process.env.NODE_ENV === 'production' 
            ? 'https://api.manifestr.ai' 
            : 'http://localhost:8000');
};
