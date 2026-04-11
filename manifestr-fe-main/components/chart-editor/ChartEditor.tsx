/**
 * Chart Editor Component
 * 
 * Simplified chart editor following the same pattern as PhotoEditor
 * Uses ToolPanel for chart-specific controls and EditorBottomToolbar for tool selection
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from 'react-chartjs-2';
import * as Y from 'yjs';
import { SupabaseProvider } from '../../lib/supabase-yjs-provider';
import { supabase } from '../../lib/supabase';
import api from '../../lib/api';
import EditorBottomToolbar from '../editor/EditorBottomToolbar';
import ToolPanel from '../editor/panels/chart-editor/ToolPanel';

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

type ChartType = 'bar' | 'horizontalBar' | 'line' | 'area' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'scatter' | 'bubble' | 'histogram' | 'boxplot' | 'waterfall' | 'funnel' | 'gauge' | 'gantt';

interface ChartEditorProps {
    generationId?: string;
    onStoreReady?: (store: any) => void;
}

const getUserColor = (userId: string): string => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};

export default function ChartEditor({ generationId, onStoreReady }: ChartEditorProps) {
    const router = useRouter();
    const chartRef = useRef<any>(null);
    
    // Y.js collaboration
    const [ydoc] = useState(() => new Y.Doc());
    const [provider, setProvider] = useState<SupabaseProvider | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [activeUsers, setActiveUsers] = useState<any[]>([]);
    
    // Chart state
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [labels, setLabels] = useState<string[]>(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12']);
    const [datasets, setDatasets] = useState<any[]>([
        { label: 'Revenue', data: [850, 920, 1050, 880, 1100, 950, 1200, 980, 1150, 1050, 1180, 1250] },
        { label: 'Profit', data: [320, 380, 450, 340, 480, 410, 520, 420, 490, 460, 510, 550] }
    ]);
    const [chartTitle, setChartTitle] = useState('Financial Performance Dashboard');
    const [showLegend, setShowLegend] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    
    const colorSchemes = {
        professional: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
        ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#0891b2', '#0284c7'],
        sunset: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'],
    };
    const [selectedColorScheme, setSelectedColorScheme] = useState<keyof typeof colorSchemes>('professional');

    // Active tool state
    const [activeTool, setActiveTool] = useState<string>('charts');

    // Download chart as PNG
    const downloadChart = () => {
        if (chartRef.current) {
            const canvas = chartRef.current.canvas;
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${chartTitle.replace(/\s+/g, '_')}.png`;
            link.href = url;
            link.click();
        }
    };
    
    const [borderWidth] = useState(2);
    const [opacity] = useState(0.8);

    // Helper: Transform data for scatter/bubble charts
    const transformToScatterData = () => {
        const colors = colorSchemes[selectedColorScheme];
        
        if (chartType === 'bubble') {
            const allValues = datasets.flatMap(ds => ds.data);
            const maxValue = Math.max(...allValues.map(v => Math.abs(v)));
            const minValue = Math.min(...allValues.map(v => Math.abs(v)));
            const range = maxValue - minValue || 1;
            
            return datasets.map((dataset, idx) => {
                const color = colors[idx % colors.length];
                return {
                    label: dataset.label,
                    data: dataset.data.map((y: number, i: number) => {
                        const normalizedValue = (Math.abs(y) - minValue) / range;
                        const bubbleSize = 5 + (normalizedValue * 10);
                        
                        return {
                            x: i + 1,
                            y: y,
                            r: bubbleSize
                        };
                    }),
                    backgroundColor: color + '99',
                    borderColor: color,
                    borderWidth: 2,
                    hoverBackgroundColor: color + 'CC',
                    hoverBorderWidth: 3,
                };
            });
        } else {
            return datasets.map((dataset, idx) => {
                const color = colors[idx % colors.length];
                return {
                    label: dataset.label,
                    data: dataset.data.map((y: number, i: number) => ({
                        x: i + 1,
                        y: y
                    })),
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                };
            });
        }
    };

    // Helper: Transform data for histogram
    const transformToHistogramData = () => {
        const allValues = datasets[0]?.data || [];
        const min = Math.min(...allValues);
        const max = Math.max(...allValues);
        const binCount = 10;
        const binSize = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        allValues.forEach((val: number) => {
            const binIndex = Math.min(Math.floor((val - min) / binSize), binCount - 1);
            bins[binIndex]++;
        });
        
        return {
            labels: bins.map((_, i) => `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`),
            datasets: [{
                label: 'Frequency',
                data: bins,
                backgroundColor: colorSchemes[selectedColorScheme][0] + 'CC',
                borderColor: colorSchemes[selectedColorScheme][0],
                borderWidth: borderWidth,
            }]
        };
    };

    // Helper: Transform data for waterfall
    const transformToWaterfallData = () => {
        const colors = colorSchemes[selectedColorScheme];
        const waterfallData: number[] = [];
        const backgroundColors: string[] = [];
        let cumulative = 0;
        
        datasets[0]?.data.forEach((val: number) => {
            waterfallData.push(cumulative);
            waterfallData.push(val);
            cumulative += val;
            
            backgroundColors.push('transparent');
            backgroundColors.push(val >= 0 ? colors[1] : colors[2]);
        });
        
        return {
            labels: labels,
            datasets: [{
                label: datasets[0]?.label || 'Values',
                data: waterfallData,
                backgroundColor: backgroundColors,
                borderColor: colors[0],
                borderWidth: borderWidth,
            }]
        };
    };

    // Helper: Transform data for funnel
    const transformToFunnelData = () => {
        const sortedData = [...(datasets[0]?.data || [])].sort((a, b) => b - a);
        const colors = colorSchemes[selectedColorScheme];
        
        return {
            labels: labels,
            datasets: [{
                label: datasets[0]?.label || 'Values',
                data: sortedData,
                backgroundColor: sortedData.map((_, idx) => colors[idx % colors.length] + 'CC'),
                borderColor: sortedData.map((_, idx) => colors[idx % colors.length]),
                borderWidth: borderWidth,
            }]
        };
    };

    // Helper: Transform data for gauge
    const transformToGaugeData = () => {
        const allValues = datasets.flatMap(ds => ds.data).filter(v => typeof v === 'number');
        const value = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
        const max = Math.max(...allValues, 100);
        const percentage = (value / max) * 100;
        
        let gaugeColor = '#dc2626';
        if (percentage >= 90) {
            gaugeColor = '#16a34a';
        } else if (percentage >= 75) {
            gaugeColor = '#84cc16';
        } else if (percentage >= 50) {
            gaugeColor = '#f59e0b';
        }
        
        return {
            labels: ['Value', 'Remaining'],
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: [gaugeColor, '#e5e7eb'],
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
            }]
        };
    };

    // Load data from backend
    useEffect(() => {
        if (!generationId) {
            setLoading(false);
            return;
        }

        api.get(`/ai/generation/${generationId}`)
            .then((response) => {
                const content = response.data?.data?.result?.editorState;
                
                if (content?.chartState) {
                    const state = content.chartState;
                    setChartType(state.chartType || 'bar');
                    setLabels(state.labels || labels);
                    setDatasets(state.datasets || datasets);
                    setChartTitle(state.chartTitle || chartTitle);
                    setShowLegend(state.showLegend ?? showLegend);
                    setShowGrid(state.showGrid ?? showGrid);
                    setSelectedColorScheme(state.selectedColorScheme || selectedColorScheme);
                } else if (content?.sheets) {
                    // Convert from sheets format
                    const firstSheet = Object.values(content.sheets)[0] as any;
                    if (firstSheet?.cellData) {
                        // Extract labels and data from sheet
                        const extractedLabels: string[] = [];
                        const extractedData: number[] = [];
                        
                        Object.values(firstSheet.cellData).forEach((row: any) => {
                            Object.values(row).forEach((cell: any) => {
                                if (cell.v) {
                                    if (typeof cell.v === 'string') {
                                        extractedLabels.push(cell.v);
                                    } else if (typeof cell.v === 'number') {
                                        extractedData.push(cell.v);
                                    }
                                }
                            });
                        });
                        
                        if (extractedLabels.length > 0) setLabels(extractedLabels);
                        if (extractedData.length > 0) {
                            setDatasets([{ label: 'Data', data: extractedData }]);
                        }
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to load chart data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [generationId]);

    // Initialize user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setCurrentUser(user);
    }, []);

    // Fetch active users
    useEffect(() => {
        if (!generationId) return;

        const fetchActiveUsers = async () => {
            try {
                const response = await api.get(`/collaborations/${generationId}/active-users`);
                if (response.data.status === "success") {
                    setActiveUsers(response.data.data);
                }
            } catch (error: any) {
                console.error('Failed to fetch active users:', error);
            }
        };

        fetchActiveUsers();
        const interval = setInterval(fetchActiveUsers, 5000);

        return () => clearInterval(interval);
    }, [generationId]);

    // Y.js provider setup
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
                console.error('Failed to start collaboration session:', error);
            }
        };

        startSession();

        return () => {
            newProvider.destroy();
            api.post("/collaborations/session/end", { documentId: generationId }).catch(() => {});
        };
    }, [generationId, currentUser, ydoc]);

    // Y.js sync - Listen for remote changes
    useEffect(() => {
        if (!provider) return;

        const ymap = ydoc.getMap("chart-state");
        let isSyncing = false;

        const onYChange = () => {
            if (isSyncing) return;
            isSyncing = true;

            try {
                const remoteJSON = ymap.get("json");
                if (typeof remoteJSON === "string" && remoteJSON.length > 0) {
                    const state = JSON.parse(remoteJSON);
                    setChartType(state.chartType || chartType);
                    setLabels(state.labels || labels);
                    setDatasets(state.datasets || datasets);
                    setChartTitle(state.chartTitle || chartTitle);
                    setShowLegend(state.showLegend ?? showLegend);
                    setShowGrid(state.showGrid ?? showGrid);
                    setSelectedColorScheme(state.selectedColorScheme || selectedColorScheme);
                }
            } catch (error) {
                console.error("Failed to sync from Y.js:", error);
            } finally {
                isSyncing = false;
            }
        };

        ymap.observe(onYChange);

        return () => {
            ymap.unobserve(onYChange);
        };
    }, [provider, ydoc, loading]);

    // Y.js sync - Send local changes
    useEffect(() => {
        if (!provider || loading) return;

        const ymap = ydoc.getMap("chart-state");
        const state = {
            chartType,
            labels,
            datasets,
            chartTitle,
            showLegend,
            showGrid,
            selectedColorScheme,
        };
        const json = JSON.stringify(state);
        const currentRemote = ymap.get("json") as string | undefined;
        
        if (json !== currentRemote) {
            ymap.set("json", json);
        }
    }, [provider, chartType, labels, datasets, chartTitle, showLegend, showGrid, selectedColorScheme, loading]);

    // Auto-save to database
    useEffect(() => {
        if (!generationId) return;

        let timeout: any;

        const saveToDatabase = async () => {
            try {
                const state = {
                    chartType,
                    labels,
                    datasets,
                    chartTitle,
                    showLegend,
                    showGrid,
                    selectedColorScheme,
                };

                await api.patch(`/ai/generation/${generationId}`, {
                    content: { chartState: state },
                });

                console.log("Chart auto-saved");
            } catch (error: any) {
                console.error("Auto-save failed:", error);
            }
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            saveToDatabase();
        }, 2000);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [generationId, chartType, labels, datasets, chartTitle, showLegend, showGrid, selectedColorScheme]);

    // Create store object for compatibility
    const store = useMemo(() => ({
        chartType,
        setChartType,
        labels,
        setLabels,
        datasets,
        setDatasets,
        chartTitle,
        setChartTitle,
        showLegend,
        setShowLegend,
        showGrid,
        setShowGrid,
        selectedColorScheme,
        setSelectedColorScheme,
        colorSchemes,
        downloadChart,
        chartRef,
    }), [chartType, labels, datasets, chartTitle, showLegend, showGrid, selectedColorScheme]);

    useEffect(() => {
        if (onStoreReady && store) {
            onStoreReady(store);
        }
    }, [store, onStoreReady]);

    // Apply color scheme
    const applyColorScheme = (datasets: any[]) => {
        const colors = colorSchemes[selectedColorScheme];
        return datasets.map((dataset, i) => {
            const color = colors[i % colors.length];
            
            if (chartType === 'area') {
                return {
                    ...dataset,
                    backgroundColor: color + '40',
                    borderColor: color,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                };
            }
            
            if (chartType === 'line') {
                return {
                    ...dataset,
                    backgroundColor: color + '20',
                    borderColor: color,
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                };
            }
            
            if (['pie', 'doughnut', 'polarArea'].includes(chartType)) {
                return {
                    ...dataset,
                    backgroundColor: colors.map(c => c + 'CC'),
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 10,
                };
            }
            
            if (chartType === 'radar') {
                return {
                    ...dataset,
                    backgroundColor: color + '30',
                    borderColor: color,
                    borderWidth: 2,
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: color,
                };
            }
            
            return {
                ...dataset,
                backgroundColor: color + 'CC',
                borderColor: color,
                borderWidth: 2,
                borderRadius: 4,
            };
        });
    };

    const chartData = useMemo(() => {
        switch (chartType) {
            case 'scatter':
            case 'bubble':
                return { datasets: transformToScatterData() };
            case 'histogram':
                return transformToHistogramData();
            case 'waterfall':
                return transformToWaterfallData();
            case 'funnel':
                return transformToFunnelData();
            case 'gauge':
                return transformToGaugeData();
            default:
                return {
                    labels: labels,
                    datasets: applyColorScheme(datasets)
                };
        }
    }, [chartType, labels, datasets, selectedColorScheme, borderWidth, opacity]);

    const chartOptions = useMemo((): ChartOptions<any> => {
        const baseOptions: ChartOptions<any> = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: showLegend && chartType !== 'gauge',
                    position: 'top' as const,
                    labels: {
                        font: { size: 14, family: 'Hanken Grotesk, Inter, sans-serif', weight: '500' },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                    }
                },
                title: {
                    display: true,
                    text: chartTitle,
                    font: { size: 24, weight: 'bold' as const, family: 'Hanken Grotesk, Inter, sans-serif' },
                    padding: { bottom: 20 },
                    color: '#18181b',
                },
                tooltip: {
                    enabled: chartType !== 'gauge',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleFont: { size: 14, weight: 'bold' as const },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                }
            },
            scales: ['pie', 'doughnut', 'radar', 'polarArea', 'gauge'].includes(chartType) ? undefined : {
                y: {
                    beginAtZero: true,
                    grid: { 
                        display: showGrid,
                        color: 'rgba(0, 0, 0, 0.06)',
                        lineWidth: 1,
                    },
                    ticks: {
                        font: { size: 12, family: 'Hanken Grotesk, Inter, sans-serif' },
                        color: '#4a5565',
                        padding: 8,
                    },
                    border: {
                        display: true,
                        color: '#e5e7eb',
                    }
                },
                x: {
                    grid: { 
                        display: showGrid,
                        color: 'rgba(0, 0, 0, 0.06)',
                        lineWidth: 1,
                    },
                    ticks: {
                        font: { size: 12, family: 'Hanken Grotesk, Inter, sans-serif' },
                        color: '#4a5565',
                        padding: 8,
                    },
                    border: {
                        display: true,
                        color: '#e5e7eb',
                    }
                }
            }
        };

        // Special options for gauge
        if (chartType === 'gauge') {
            baseOptions.circumference = 180;
            baseOptions.rotation = -90;
            baseOptions.cutout = '75%';
            if (baseOptions.plugins) {
                baseOptions.plugins.legend = { display: false };
                baseOptions.plugins.tooltip = { enabled: false };
            }
        }

        // Special options for radar
        if (chartType === 'radar') {
            baseOptions.scales = {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                        font: { size: 11 },
                        backdropColor: 'transparent',
                    },
                    pointLabels: {
                        font: { size: 12, weight: '500' as const },
                    }
                }
            };
        }

        return baseOptions;
    }, [chartType, chartTitle, showLegend, showGrid]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-900 text-xl font-semibold">Loading Chart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#f3f4f6] flex flex-col relative">
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

            {/* Main Chart Canvas Area */}
            <div className={`flex-1 flex items-center justify-center bg-[#e7e7e7] overflow-hidden ${activeUsers.length > 0 ? 'pt-12' : ''}`}>
                <div className="w-full h-full max-w-6xl p-8">
                    <div className="bg-white rounded-2xl shadow-lg p-10 h-full">
                        <div style={{ height: '100%' }}>
                            {chartType === 'bar' && <Bar ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'horizontalBar' && <Bar ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />}
                            {chartType === 'line' && <Line ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'area' && <Line ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'pie' && <Pie ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'doughnut' && <Doughnut ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'radar' && <Radar ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'polarArea' && <PolarArea ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'scatter' && <Scatter ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'bubble' && <Bubble ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'histogram' && <Bar ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'boxplot' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1">
                                        <Bar ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
                                    </div>
                                    <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                                        <p className="font-semibold mb-2">Statistical Summary:</p>
                                        {datasets.map((ds, idx) => {
                                            const sorted = [...ds.data].sort((a, b) => a - b);
                                            const n = sorted.length;
                                            const min = sorted[0];
                                            const max = sorted[n - 1];
                                            const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
                                            const mean = sorted.reduce((a, b) => a + b, 0) / n;
                                            return (
                                                <div key={idx} className="mb-2 text-xs">
                                                    <strong>{ds.label}:</strong> Min: {min.toFixed(2)}, Q1: {sorted[Math.floor(n*0.25)].toFixed(2)}, Median: {median.toFixed(2)}, Q3: {sorted[Math.floor(n*0.75)].toFixed(2)}, Max: {max.toFixed(2)}, Mean: {mean.toFixed(2)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {chartType === 'waterfall' && <Bar ref={chartRef} data={chartData} options={chartOptions} />}
                            {chartType === 'funnel' && <Bar ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />}
                            {chartType === 'gauge' && (
                                <div className="flex flex-col items-center justify-center h-full relative">
                                    <div className="relative w-full max-w-md">
                                        <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
                                        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '25%' }}>
                                            <div className="text-center">
                                                <div className="text-5xl font-bold" style={{ color: chartData.datasets[0].backgroundColor[0] }}>
                                                    {chartData.datasets[0].data[0].toFixed(1)}%
                                                </div>
                                                <div className="text-sm text-gray-500 mt-2">
                                                    {chartData.datasets[0].data[0] >= 90 ? 'Excellent' : 
                                                     chartData.datasets[0].data[0] >= 75 ? 'Good' :
                                                     chartData.datasets[0].data[0] >= 50 ? 'Fair' : 'Critical'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {chartType === 'gantt' && (
                                <div className="flex items-center justify-center h-full">
                                    <Bar ref={chartRef} data={chartData} options={{ 
                                        ...chartOptions, 
                                        indexAxis: 'y' as const,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                display: true,
                                                text: chartTitle + ' - Timeline View',
                                                font: { size: 24, weight: 'bold', family: 'Hanken Grotesk, Inter, sans-serif' },
                                            }
                                        }
                                    }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tool Panel */}
            <ToolPanel activeTool={activeTool} store={store} />

            {/* Bottom Toolbar */}
            <EditorBottomToolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                editorType="chart"
            />
        </div>
    );
}
