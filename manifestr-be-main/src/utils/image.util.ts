
export const fetchUnsplashImage = async (query: string): Promise<string> => {
    const fallback = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";
    if (!process.env.UNSPLASH_ACCESS_KEY) return fallback;

    try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`, {
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
        });
        const data = await res.json();
        if (data.results && data.results[0]) {
            return data.results[0].urls.regular;
        }
    } catch (e) {
    }
    return fallback;
};
