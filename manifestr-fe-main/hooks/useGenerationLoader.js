import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';

export default function useGenerationLoader() {
    const router = useRouter();
    const { id } = router.query;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('LOADING'); // LOADING, POLLING, COMPLETED, FAILED
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (!router.isReady || !id) {
            if (router.isReady && !id) {
                // No ID provided, maybe just show default/empty or dummy? 
                // For now, let's assume we proceed with null content (default dummy)
                setLoading(false);
            }
            return;
        }

        let pollInterval;

        const checkStatus = async () => {
            try {
                const response = await api.get(`/ai/generation/${id}`);
                const data = response.data.data;

                if (!data) {
                    throw new Error("No data received");
                }

                if (data.status === 'failed' || data.status === 'FAILED') {
                    setStatus('FAILED');
                    setError(data.error_message || data.errorMessage || data.error || "Generation failed");
                    setLoading(false);
                    return true; // stop polling
                } else if (data.status === 'completed' || data.status === 'COMPLETED') {
                    setStatus('COMPLETED');

                    // Check both locations for editorState (new Supabase structure)
                    let rawContent = data.result?.editorState || data.current_step_data?.editorState;
                    let parsedContent = rawContent;

                    if (typeof rawContent === 'string') {
                        try {
                            parsedContent = JSON.parse(rawContent);
                            // If parsed content is still a string (double encoded), parse again
                            if (typeof parsedContent === 'string') {
                                try {
                                    parsedContent = JSON.parse(parsedContent);
                                } catch (e) {
                                    // ignore second parse error
                                }
                            }
                        } catch (e) {
                            // Keep as string if parsing fails, though likely an issue
                        }
                    }

                    setContent(parsedContent);
                    setLoading(false);
                    return true; // stop polling
                } else {
                    // Still processing
                    setStatus('POLLING');
                    return false; // continue polling
                }
            } catch (err) {
                // If 404 or other hard error, might want to fail. 
                // For now, retry a few times? Or just fail.
                // If it's a network error, maybe keep polling. 
                // Let's assum hard fail for simplicity unless specified.
                setStatus('FAILED');
                setError("Failed to load document");
                setLoading(false);
                return true;
            }
        };

        const runPoll = async () => {
            const finished = await checkStatus();
            if (!finished) {
                pollInterval = setInterval(async () => {
                    const stop = await checkStatus();
                    if (stop) clearInterval(pollInterval);
                }, 3000);
            }
        };

        runPoll();

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [id, router.isReady]);

    return { loading, error, status, content, id };
}
