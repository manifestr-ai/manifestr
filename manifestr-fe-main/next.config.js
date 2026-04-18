/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        // Set API URL based on environment
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ||
            (process.env.NODE_ENV === 'production'
                ? 'https://api.manifestr.ai'
                : 'http://localhost:8000'),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '*.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
            }
        ]
    },
}

module.exports = nextConfig
