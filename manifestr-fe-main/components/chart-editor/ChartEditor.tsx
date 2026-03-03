import React, { useEffect, useRef } from 'react';

export default function ChartEditor() {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorInstance = useRef<any>(null);
    const loadedElements = useRef<Array<HTMLElement>>([]); // To track elements for cleanup

    useEffect(() => {
        const loadScript = (src: string): Promise<HTMLScriptElement> => {
            return new Promise((resolve, reject) => {
                // Check if script already exists to prevent duplicates
                const existingScript = document.querySelector(`script[src="${src}"]`);
                if (existingScript) {
                    resolve(existingScript as HTMLScriptElement);
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve(script);
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.body.appendChild(script);
                loadedElements.current.push(script);
            });
        };

        const loadCSS = (href: string): HTMLLinkElement | undefined => {
            // Check if link already exists to prevent duplicates
            if (document.querySelector(`link[href="${href}"]`)) {
                return undefined; // Already loaded
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
            loadedElements.current.push(link);
            return link;
        };

        const initEditor = async () => {
            try {
                // Load Highcharts Core
                await loadScript('https://code.highcharts.com/7.0.0/highcharts.js');
                // Load Highcharts Modules
                await loadScript('https://code.highcharts.com/7.0.0/highcharts-more.js');
                await loadScript('https://code.highcharts.com/7.0.0/modules/exporting.js');
                await loadScript('https://code.highcharts.com/7.0.0/modules/data.js');

                // Load FontAwesome
                loadCSS('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

                // Load Highcharts Editor
                loadCSS('/assets/highcharts-editor/highcharts-editor.min.css');
                await loadScript('/assets/highcharts-editor/highcharts-editor.js');

                // Initialize Editor
                const highed = (window as any).highed;
                if (highed && containerRef.current) {
                    highed.ready(() => {
                        if (containerRef.current) {
                            containerRef.current.innerHTML = '';
                            editorInstance.current = highed.Editor(containerRef.current, {
                                features: 'import templates customize',
                            });
                        }
                    });
                }
            } catch (error) {
            }
        };

        initEditor();

        return () => {
            // Cleanup: Remove all dynamically added scripts and links (only ones we tracked)
            loadedElements.current.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            loadedElements.current = [];

            if (editorInstance.current) {
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                }
                editorInstance.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full h-full bg-white relative">
            <div ref={containerRef} className="h-full w-full" id="highed-mountpoint" />
        </div>
    );
}
