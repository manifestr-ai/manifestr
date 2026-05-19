/**
 * URL Utilities
 * Smart URL resolution for production vs development environments
 */

/**
 * Get the correct frontend URL based on environment
 * 
 * PRODUCTION: https://dashboard.manifestr.ai
 * DEVELOPMENT: http://localhost:3001
 * 
 * Auto-detects based on:
 * - NODE_ENV environment variable
 * - BACKEND_URL containing production domain
 * - Falls back to FRONTEND_URL env var or localhost
 */
export function getFrontendUrl(): string {
    // Check if we're in production
    const isProduction = 
        process.env.NODE_ENV === 'production' 
        || process.env.BACKEND_URL?.includes('api.manifestr.ai')
        || process.env.BACKEND_URL?.includes('manifestr.ai')
        || !process.env.BACKEND_URL?.includes('localhost');
    
    if (isProduction) {
        return 'https://dashboard.manifestr.ai';
    }
    
    // Development/Local
    return process.env.FRONTEND_URL || 'http://localhost:3001';
}

/**
 * Get the correct backend URL based on environment
 * 
 * PRODUCTION: https://api.manifestr.ai
 * DEVELOPMENT: http://localhost:8000
 */
export function getBackendUrl(): string {
    const isProduction = 
        process.env.NODE_ENV === 'production' 
        || process.env.BACKEND_URL?.includes('api.manifestr.ai');
    
    if (isProduction) {
        return 'https://api.manifestr.ai';
    }
    
    return process.env.BACKEND_URL || 'http://localhost:8000';
}

/**
 * Build a full frontend URL with path
 * 
 * @example
 * buildFrontendUrl('/pricing') // => 'https://dashboard.manifestr.ai/pricing'
 */
export function buildFrontendUrl(path: string): string {
    const baseUrl = getFrontendUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}

/**
 * Build a full backend URL with path
 * 
 * @example
 * buildBackendUrl('/api/health') // => 'https://api.manifestr.ai/api/health'
 */
export function buildBackendUrl(path: string): string {
    const baseUrl = getBackendUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}
