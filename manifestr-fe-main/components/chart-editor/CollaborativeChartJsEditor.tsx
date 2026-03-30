/**
 * Collaborative Chart.js Editor
 *
 * Real-time collaboration for Chart.js charts with Y.js + Supabase Realtime
 * Shows active users, syncs changes across clients
 *
 * SAFE: NEW component, existing ChartJsEditor unchanged
 */

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import * as Y from 'yjs';
import { SupabaseProvider } from '../../lib/supabase-yjs-provider';
import { supabase } from '../../lib/supabase';
import api from '../../lib/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'horizontalBar' | 'area';

interface CollaborativeChartJsEditorProps {
    generationId: string;
}

// Generate consistent color for user
const getUserColor = (userId: string): string => {
    const colors = [
        "#3b82f6", "#10b981", "#f59e0b", 
        "#ef4444", "#8b5cf6", "#ec4899",
    ];
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};

export default function CollaborativeChartJsEditor({ generationId }: CollaborativeChartJsEditorProps) {
    const router = useRouter();
    const chartRef = useRef<any>(null);
    const [ydoc] = useState(() => new Y.Doc());
    const [provider, setProvider] = useState<SupabaseProvider | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [activeUsers, setActiveUsers] = useState<any[]>([]);
    const [lastSavedContent, setLastSavedContent] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [originalEditorState, setOriginalEditorState] = useState<any>(null); // Store original format
    
    // State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [labels, setLabels] = useState<string[]>([]);
    const [datasets, setDatasets] = useState<any[]>([]);
    const [chartTitle, setChartTitle] = useState('AI Generated Chart');
    const [chartSubtitle, setChartSubtitle] = useState('');
    const [showLegend, setShowLegend] = useState(true);
    const [showDataLabels, setShowDataLabels] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [enableAnimation, setEnableAnimation] = useState(true);
    const [legendPosition, setLegendPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
    const [xAxisLabel, setXAxisLabel] = useState('');
    const [yAxisLabel, setYAxisLabel] = useState('Values');
    const [borderWidth, setBorderWidth] = useState(2);
    const [opacity, setOpacity] = useState(0.8);
    const [fontSize, setFontSize] = useState(14);

    const colorSchemes = {
        professional: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#0891b2', '#0284c7', '#0369a1'],
        sunset: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#f59e0b'],
        forest: ['#22c55e', '#16a34a', '#15803d', '#14532d', '#84cc16', '#65a30d']
    };
    
    const [selectedColorScheme, setSelectedColorScheme] = useState<keyof typeof colorSchemes>('professional');

    // Handle auth errors
    const handleAuthError = (error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            router.push("/login");
            return true;
        }
        return false;
    };

    // Get current user info
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setCurrentUser(user);
    }, []);

    // Fetch initial chart data
    useEffect(() => {
        if (!generationId) {
            setLoading(false);
            return;
        }

        const fetchChartData = async () => {
            try {
                console.log('📊 Loading AI-generated chart data...');
                
                const response = await api.get(`/ai/generation/${generationId}`);
                if (response.data?.status !== 'success') {
                    throw new Error('Failed to load chart data');
                }

                const editorState = response.data.data?.result?.editorState;

                // Handle both old (sheets) and new (chartState) formats
                if (!editorState?.sheets && !editorState?.chartState) {
                    throw new Error('No chart data available');
                }

                // Store original for backwards compatibility
                setOriginalEditorState(editorState);

                // Load from chartState if available (edited format)
                if (editorState.chartState) {
                    console.log('📊 Loading from chartState (previously edited)');
                    const state = editorState.chartState;
                    setChartType(state.chartType || 'bar');
                    setLabels(state.labels || []);
                    setDatasets(state.datasets || []);
                    setChartTitle(state.chartTitle || 'AI Generated Chart');
                    setChartSubtitle(state.chartSubtitle || '');
                    setShowLegend(state.showLegend ?? true);
                    setShowDataLabels(state.showDataLabels ?? true);
                    setShowGrid(state.showGrid ?? true);
                    setEnableAnimation(state.enableAnimation ?? true);
                    setLegendPosition(state.legendPosition || 'top');
                    setXAxisLabel(state.xAxisLabel || '');
                    setYAxisLabel(state.yAxisLabel || 'Values');
                    setBorderWidth(state.borderWidth || 2);
                    setOpacity(state.opacity || 0.8);
                    setFontSize(state.fontSize || 14);
                    setSelectedColorScheme(state.selectedColorScheme || 'professional');
                }
                // Load from sheets format (original AI generation)
                else if (editorState.sheets) {
                    console.log('📊 Loading from sheets format (original AI generation)');
                    const firstSheet = Object.values(editorState.sheets)[0] as any;
                    if (firstSheet?.cellData) {
                        const { labels: extractedLabels, datasets: extractedDatasets } = 
                            convertUniverToChartData(firstSheet.cellData);
                        
                        setLabels(extractedLabels);
                        setDatasets(extractedDatasets);
                        setChartTitle(editorState.name || 'AI Generated Chart');
                    }
                }

                console.log('✅ Chart data loaded and ready!');

            } catch (err: any) {
                console.error('❌ Failed to load chart:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [generationId]);

    const convertUniverToChartData = (cellData: any) => {
        const rows: any[][] = [];
        const maxRow = Math.max(...Object.keys(cellData).map(k => parseInt(k)));

        for (let r = 0; r <= maxRow; r++) {
            const rowData = cellData[r] || {};
            const maxCol = Math.max(...Object.keys(rowData).map(k => parseInt(k)));
            const row: any[] = [];

            for (let c = 0; c <= maxCol; c++) {
                const cell = rowData[c];
                row.push(cell?.v !== undefined ? cell.v : '');
            }
            rows.push(row);
        }

        const startRow = rows[0]?.length === 1 ? 1 : 0;
        const headers = rows[startRow] || [];
        const dataRows = rows.slice(startRow + 1);

        const extractedLabels = dataRows.map(row => String(row[0] || ''));

        const extractedDatasets = headers.slice(1).map((header, idx) => {
            const columnIndex = idx + 1;
            const data = dataRows.map(row => {
                const value = row[columnIndex];
                return typeof value === 'number' ? value : parseFloat(value) || 0;
            });

            return {
                label: String(header),
                data: data
            };
        }).filter(ds => ds.data.some(v => v !== 0));

        return { labels: extractedLabels, datasets: extractedDatasets };
    };

    // Initialize collaboration provider
    useEffect(() => {
        if (!generationId || !currentUser?.id) return;

        const newProvider = new SupabaseProvider(ydoc, generationId, supabase);
        setProvider(newProvider);

        const startSession = async () => {
            try {
                await api.post("/collaborations/session/start", {
                    documentId: generationId,
                    sessionId: ydoc.clientID.toString(),
                    userColor: getUserColor(currentUser.id),
                });
            } catch (error: any) {
                if (handleAuthError(error)) return;
            }
        };

        startSession();

        return () => {
            newProvider.destroy();
            api.post("/collaborations/session/end", { documentId: generationId }).catch(() => {});
        };
    }, [generationId, currentUser, ydoc]);

    // Fetch active users periodically
    useEffect(() => {
        if (!generationId) return;

        const fetchActiveUsers = async () => {
            try {
                const response = await api.get(`/collaborations/${generationId}/active-users`);
                if (response.data.status === "success") {
                    setActiveUsers(response.data.data);
                }
            } catch (error: any) {
                if (handleAuthError(error)) return;
            }
        };

        fetchActiveUsers();
        const interval = setInterval(fetchActiveUsers, 5000);

        return () => clearInterval(interval);
    }, [generationId]);

    // Get current chart state as JSON
    const getChartState = () => {
        return JSON.stringify({
            chartType,
            labels,
            datasets: datasets.map(ds => ({ label: ds.label, data: ds.data })), // Only core data
            chartTitle,
            chartSubtitle,
            showLegend,
            showDataLabels,
            showGrid,
            enableAnimation,
            legendPosition,
            xAxisLabel,
            yAxisLabel,
            borderWidth,
            opacity,
            fontSize,
            selectedColorScheme
        });
    };

    // Load chart state from JSON
    const loadChartState = (stateJSON: string) => {
        try {
            const state = JSON.parse(stateJSON);
            setChartType(state.chartType || 'bar');
            setLabels(state.labels || []);
            setDatasets(state.datasets || []);
            setChartTitle(state.chartTitle || 'AI Generated Chart');
            setChartSubtitle(state.chartSubtitle || '');
            setShowLegend(state.showLegend ?? true);
            setShowDataLabels(state.showDataLabels ?? true);
            setShowGrid(state.showGrid ?? true);
            setEnableAnimation(state.enableAnimation ?? true);
            setLegendPosition(state.legendPosition || 'top');
            setXAxisLabel(state.xAxisLabel || '');
            setYAxisLabel(state.yAxisLabel || 'Values');
            setBorderWidth(state.borderWidth || 2);
            setOpacity(state.opacity || 0.8);
            setFontSize(state.fontSize || 14);
            setSelectedColorScheme(state.selectedColorScheme || 'professional');
        } catch (e) {
            console.error("Failed to load chart state:", e);
        }
    };

    // Y.js <-> Chart State Sync
    useEffect(() => {
        if (!provider) return;

        const ymap = ydoc.getMap("chart-state");
        let isSyncing = false;

        // Y.js → Chart (remote changes)
        const onYChange = () => {
            if (isSyncing) return;
            isSyncing = true;

            try {
                const remoteJSON = ymap.get("json") as string | undefined;
                if (remoteJSON) {
                    const currentJSON = getChartState();
                    if (currentJSON !== remoteJSON) {
                        loadChartState(remoteJSON);
                    }
                }
            } catch (error) {
                console.error("Failed to sync from Y.js:", error);
            } finally {
                isSyncing = false;
            }
        };

        ymap.observe(onYChange);

        // Chart → Y.js (local changes)
        const syncToYjs = () => {
            if (isSyncing) return;
            isSyncing = true;

            try {
                const json = getChartState();
                const currentRemote = ymap.get("json") as string | undefined;
                if (json !== currentRemote) {
                    ymap.set("json", json);
                }
            } catch (error) {
                console.error("Failed to sync to Y.js:", error);
            } finally {
                isSyncing = false;
            }
        };

        // Initialize Y.js with current state if empty
        if (!ymap.has("json") && !loading) {
            ymap.set("json", getChartState());
        }

        return () => {
            ymap.unobserve(onYChange);
        };
    }, [provider, ydoc, loading]);

    // Initialize lastSavedContent
    useEffect(() => {
        if (!loading && !lastSavedContent) {
            setLastSavedContent(getChartState());
        }
    }, [loading]);

    // AUTO-SAVE to database
    useEffect(() => {
        if (!generationId || loading) return;

        let timeout: any;

        const saveToDatabase = async () => {
            try {
                const currentContent = getChartState();

                // SMART SAVE: Only save if content actually changed
                if (currentContent === lastSavedContent) {
                    return;
                }

                const state = JSON.parse(currentContent);
                
                // Save in BOTH formats for backwards compatibility
                const saveData = {
                    ...originalEditorState, // Preserve original sheets data
                    chartState: state, // Add new collaborative state
                    type: 'chart'
                };

                await api.patch(`/ai/generation/${generationId}`, {
                    content: saveData,
                });

                setLastSavedContent(currentContent);
                console.log("Auto-saved chart");
            } catch (error: any) {
                if (handleAuthError(error)) return;
                console.error("Auto-save failed:", error);
            }
        };

        // Trigger save on any state change
        setIsEditing(true);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            saveToDatabase();
            setTimeout(() => setIsEditing(false), 3000);
        }, 2000);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [
        generationId, chartType, labels, datasets, chartTitle, chartSubtitle,
        showLegend, showDataLabels, showGrid, enableAnimation, legendPosition,
        xAxisLabel, yAxisLabel, borderWidth, opacity, fontSize, selectedColorScheme
    ]);

    // Sync to Y.js on state changes
    useEffect(() => {
        if (!provider || loading) return;

        const ymap = ydoc.getMap("chart-state");
        const json = getChartState();
        const currentRemote = ymap.get("json") as string | undefined;
        
        if (json !== currentRemote) {
            ymap.set("json", json);
        }
    }, [
        provider, chartType, labels, datasets, chartTitle, chartSubtitle,
        showLegend, showDataLabels, showGrid, enableAnimation, legendPosition,
        xAxisLabel, yAxisLabel, borderWidth, opacity, fontSize, selectedColorScheme
    ]);

    // AUTO-REFRESH content from database every 10 seconds
    useEffect(() => {
        if (!generationId || loading) return;

        const refreshFromDatabase = async () => {
            // Don't refresh while user is editing!
            if (isEditing) return;

            try {
                const response = await api.get(`/ai/generation/${generationId}`);

                if (response.data?.status === "success") {
                    const latestContent = response.data.data?.result?.editorState;

                    // Handle both formats
                    if (latestContent?.chartState) {
                        const currentContent = getChartState();
                        const latestJSON = JSON.stringify(latestContent.chartState);

                        // Update if content changed
                        if (currentContent !== latestJSON) {
                            loadChartState(latestJSON);
                        }
                    } else if (latestContent?.sheets) {
                        // Original format - extract and convert
                        const firstSheet = Object.values(latestContent.sheets)[0] as any;
                        if (firstSheet?.cellData) {
                            const { labels: extractedLabels, datasets: extractedDatasets } = 
                                convertUniverToChartData(firstSheet.cellData);
                            
                            setLabels(extractedLabels);
                            setDatasets(extractedDatasets);
                            setChartTitle(latestContent.name || 'AI Generated Chart');
                        }
                        // Update original state
                        setOriginalEditorState(latestContent);
                    }
                }
            } catch (error: any) {
                if (handleAuthError(error)) return;
            }
        };

        // Run on mount and every 10 seconds
        refreshFromDatabase();
        const interval = setInterval(refreshFromDatabase, 10000);

        return () => clearInterval(interval);
    }, [generationId, loading, isEditing]);

    const applyColorScheme = (datasets: any[]) => {
        const colors = colorSchemes[selectedColorScheme];
        return datasets.map((dataset, idx) => {
            const color = colors[idx % colors.length];
            const baseConfig = {
                ...dataset,
                borderColor: color,
                borderWidth: borderWidth,
            };
            
            if (chartType === 'line' || chartType === 'area') {
                baseConfig.backgroundColor = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
                baseConfig.fill = chartType === 'area';
                baseConfig.tension = 0.4;
                baseConfig.pointRadius = 4;
                baseConfig.pointHoverRadius = 6;
            } else if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
                baseConfig.backgroundColor = colors.map(c => c + Math.round(opacity * 255).toString(16).padStart(2, '0'));
                baseConfig.borderWidth = 2;
            } else {
                baseConfig.backgroundColor = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
            }
            
            return baseConfig;
        });
    };

    const chartData = {
        labels: labels,
        datasets: applyColorScheme(datasets)
    };

    const chartOptions: ChartOptions<any> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: enableAnimation ? {
            duration: 1000,
            easing: 'easeInOutQuart'
        } : false,
        plugins: {
            legend: {
                display: showLegend,
                position: legendPosition,
                labels: {
                    font: {
                        size: fontSize,
                        family: 'Hanken Grotesk, Inter, sans-serif'
                    },
                    padding: 15,
                    usePointStyle: true
                }
            },
            title: {
                display: true,
                text: [chartTitle, chartSubtitle].filter(Boolean),
                font: {
                    size: fontSize + 10,
                    weight: 'bold',
                    family: 'Hanken Grotesk, Inter, sans-serif'
                },
                padding: { bottom: 20 }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                titleFont: {
                    size: fontSize,
                    weight: 'bold'
                },
                bodyFont: {
                    size: fontSize - 1
                },
                padding: 12,
                cornerRadius: 8
            },
            datalabels: showDataLabels ? {
                display: true,
                color: '#18181b',
                font: {
                    size: fontSize - 2,
                    weight: '600'
                }
            } : {
                display: false
            }
        },
        scales: !['pie', 'doughnut', 'radar', 'polarArea'].includes(chartType) ? {
            y: {
                beginAtZero: true,
                grid: {
                    display: showGrid,
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                title: {
                    display: !!yAxisLabel,
                    text: yAxisLabel,
                    font: {
                        size: fontSize,
                        weight: '600'
                    }
                },
                ticks: {
                    font: {
                        size: fontSize - 2
                    }
                }
            },
            x: {
                grid: {
                    display: showGrid,
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                title: {
                    display: !!xAxisLabel,
                    text: xAxisLabel,
                    font: {
                        size: fontSize,
                        weight: '600'
                    }
                },
                ticks: {
                    font: {
                        size: fontSize - 2
                    }
                }
            }
        } : undefined
    };

    const downloadChart = () => {
        if (chartRef.current) {
            const link = document.createElement('a');
            link.download = `${chartTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = chartRef.current.toBase64Image();
            link.click();
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-900 text-xl font-semibold">Loading Chart...</p>
                    <p className="text-gray-500 text-sm mt-2">Preparing your visualization</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <div className="text-red-600 text-3xl font-bold">!</div>
                    </div>
                    <p className="text-gray-900 text-xl font-semibold mb-2">Failed to Load Chart</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-50 flex relative">
            {/* Active Users Bar */}
            {activeUsers.length > 0 && (
                <div className="absolute top-0 left-0 right-0 bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between z-50">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-900">
                            {activeUsers.length} editing now:
                        </span>
                        <div className="flex -space-x-2">
                            {activeUsers.map((user) => (
                                <div
                                    key={user.user_id}
                                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white shadow-sm"
                                    style={{ backgroundColor: user.user_color || "#3b82f6" }}
                                    title={
                                        user.users
                                            ? `${user.users.first_name || ""} ${user.users.last_name || ""}`.trim() ||
                                              user.users.email
                                            : "User"
                                    }
                                >
                                    {(user.users
                                        ? `${user.users.first_name || ""} ${user.users.last_name || ""}`.trim() ||
                                          user.users.email
                                        : user.users?.email || "U"
                                    )[0].toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                    <span className="text-xs text-blue-700">Changes sync automatically</span>
                </div>
            )}

            {/* Left Sidebar - Editing Controls */}
            <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chart Editor</h2>
                
                {/* Chart Type */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-3">Chart Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: 'bar', label: 'Bar', desc: 'Vertical bars' },
                            { value: 'horizontalBar', label: 'Horizontal Bar', desc: 'Horizontal bars' },
                            { value: 'line', label: 'Line', desc: 'Trend line' },
                            { value: 'area', label: 'Area', desc: 'Filled area' },
                            { value: 'pie', label: 'Pie', desc: 'Pie slices' },
                            { value: 'doughnut', label: 'Doughnut', desc: 'Ring chart' },
                            { value: 'radar', label: 'Radar', desc: 'Spider web' },
                            { value: 'polarArea', label: 'Polar', desc: 'Radial chart' }
                        ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => setChartType(option.value as ChartType)}
                                className={`text-left p-2 rounded-lg border-2 transition-all ${
                                    chartType === option.value
                                        ? 'border-blue-600 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                                }`}
                            >
                                <div className="font-semibold text-xs">{option.label}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{option.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Content */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-3">Text Content</label>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Main Title</label>
                            <input
                                type="text"
                                value={chartTitle}
                                onChange={(e) => setChartTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Chart title..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Subtitle (Optional)</label>
                            <input
                                type="text"
                                value={chartSubtitle}
                                onChange={(e) => setChartSubtitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Subtitle..."
                            />
                        </div>
                    </div>
                </div>

                {/* Axis Labels */}
                {!['pie', 'doughnut', 'radar', 'polarArea'].includes(chartType) && (
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-800 mb-3">Axis Labels</label>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">X-Axis Label</label>
                                <input
                                    type="text"
                                    value={xAxisLabel}
                                    onChange={(e) => setXAxisLabel(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Categories"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Y-Axis Label</label>
                                <input
                                    type="text"
                                    value={yAxisLabel}
                                    onChange={(e) => setYAxisLabel(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Values"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Color Scheme */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Color Scheme</label>
                    <div className="space-y-2">
                        {Object.keys(colorSchemes).map(scheme => (
                            <button
                                key={scheme}
                                onClick={() => setSelectedColorScheme(scheme as keyof typeof colorSchemes)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                    selectedColorScheme === scheme
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="font-medium text-sm capitalize mb-2">{scheme}</div>
                                <div className="flex gap-1">
                                    {colorSchemes[scheme as keyof typeof colorSchemes].map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="w-6 h-6 rounded"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Legend Options */}
                {showLegend && (
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-800 mb-3">Legend Position</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'top', label: 'Top' },
                                { value: 'bottom', label: 'Bottom' },
                                { value: 'left', label: 'Left' },
                                { value: 'right', label: 'Right' }
                            ].map(pos => (
                                <button
                                    key={pos.value}
                                    onClick={() => setLegendPosition(pos.value as any)}
                                    className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                                        legendPosition === pos.value
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    {pos.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Display Options */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-3">Display Options</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={showLegend}
                                onChange={(e) => setShowLegend(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700 font-medium">Show Legend</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={showDataLabels}
                                onChange={(e) => setShowDataLabels(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700 font-medium">Show Data Labels</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700 font-medium">Show Grid Lines</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={enableAnimation}
                                onChange={(e) => setEnableAnimation(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700 font-medium">Enable Animations</span>
                        </label>
                    </div>
                </div>

                {/* Style Controls */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-3">Style Controls</label>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-600 mb-2">Font Size: {fontSize}px</label>
                            <input
                                type="range"
                                min="10"
                                max="24"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-600 mb-2">Border Width: {borderWidth}px</label>
                            <input
                                type="range"
                                min="0"
                                max="8"
                                value={borderWidth}
                                onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-600 mb-2">Opacity: {Math.round(opacity * 100)}%</label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                    <button
                        onClick={downloadChart}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                        Download PNG
                    </button>
                    <button
                        onClick={() => router.push(`/chart-viewer?id=${generationId}`)}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        Back to View
                    </button>
                </div>
                
                {/* Chart Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium mb-2">Chart Statistics</p>
                    <div className="space-y-1 text-xs text-gray-600">
                        <p>Data Series: <strong>{datasets.length}</strong></p>
                        <p>Data Points: <strong>{labels.length}</strong></p>
                        <p>Chart Type: <strong className="capitalize">{chartType}</strong></p>
                    </div>
                </div>
            </div>

            {/* Right Side - Chart Display */}
            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-10">
                        <div style={{ height: '600px' }}>
                            {chartType === 'bar' && (
                                <Bar ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'horizontalBar' && (
                                <Bar ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
                            )}
                            {chartType === 'line' && (
                                <Line ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'area' && (
                                <Line ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'pie' && (
                                <Pie ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'doughnut' && (
                                <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'radar' && (
                                <Radar ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'polarArea' && (
                                <PolarArea ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                        </div>
                    </div>
                    
                    {/* Quick Tips */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 font-semibold mb-2">Quick Tips:</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>Switch chart types to see your data in different ways</li>
                            <li>Try different color schemes for better visual impact</li>
                            <li>Adjust opacity and borders for custom styling</li>
                            <li>Use horizontal bars for long category names</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
