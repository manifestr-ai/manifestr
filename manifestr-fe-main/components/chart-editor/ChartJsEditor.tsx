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
import api from '../../lib/api';

// Register Chart.js components
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

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'horizontalBar' | 'area' | 'scatter' | 'bubble' | 'histogram' | 'boxplot' | 'waterfall' | 'funnel' | 'gauge' | 'gantt';

export default function ChartJsEditor() {
    const router = useRouter();
    const { id: jobId } = router.query;
    const chartRef = useRef<any>(null);
    
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

    // Color schemes
    const colorSchemes = {
        professional: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#0891b2', '#0284c7', '#0369a1'],
        sunset: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#f59e0b'],
        forest: ['#22c55e', '#16a34a', '#15803d', '#14532d', '#84cc16', '#65a30d']
    };
    
    const [selectedColorScheme, setSelectedColorScheme] = useState<keyof typeof colorSchemes>('professional');

    useEffect(() => {
        if (!jobId) {
            setLoading(false);
            return;
        }

        const fetchChartData = async () => {
            try {
                console.log('📊 Loading AI-generated chart data...');
                
                const response = await api.get(`/ai/status/${jobId}`);
                if (response.data?.status !== 'success') {
                    throw new Error('Failed to load chart data');
                }

                const jobData = response.data.data;
                const editorState = jobData.result?.editorState;

                if (!editorState?.sheets) {
                    throw new Error('No chart data available');
                }

                // Extract data from Univer format
                const firstSheet = Object.values(editorState.sheets)[0] as any;
                if (firstSheet?.cellData) {
                    const { labels: extractedLabels, datasets: extractedDatasets } = 
                        convertUniverToChartData(firstSheet.cellData);
                    
                    setLabels(extractedLabels);
                    setDatasets(extractedDatasets);
                    setChartTitle(editorState.name || 'AI Generated Chart');
                    
                    console.log('✅ Chart data loaded and ready!');
                    console.log('📊 Labels:', extractedLabels);
                    console.log('📊 Datasets:', extractedDatasets.length);
                }

            } catch (err: any) {
                console.error('❌ Failed to load chart:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [jobId]);

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

        // Skip first row if it's a title
        const startRow = rows[0]?.length === 1 ? 1 : 0;
        const headers = rows[startRow] || [];
        const dataRows = rows.slice(startRow + 1);

        // Extract labels from first column
        const extractedLabels = dataRows.map(row => String(row[0] || ''));

        // Create datasets from remaining columns
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

    // Helper: Transform data for scatter/bubble charts
    const transformToScatterData = () => {
        const colors = colorSchemes[selectedColorScheme];
        
        if (chartType === 'bubble') {
            // For bubble charts, calculate dynamic sizing
            const allValues = datasets.flatMap(ds => ds.data);
            const maxValue = Math.max(...allValues.map(v => Math.abs(v)));
            const minValue = Math.min(...allValues.map(v => Math.abs(v)));
            const range = maxValue - minValue || 1;
            
            return datasets.map((dataset, idx) => {
                const color = colors[idx % colors.length];
                return {
                    label: dataset.label,
                    data: dataset.data.map((y: number, i: number) => {
                        // Scale bubble size between 3 and 9 (smaller, nicer bubbles)
                        const normalizedValue = (Math.abs(y) - minValue) / range;
                        const bubbleSize = 3 + (normalizedValue * 6);

                        return {
                            x: i + 1,
                            y: y,
                            r: bubbleSize
                        };
                    }),
                    backgroundColor: color + '99', // 60% opacity
                    borderColor: color,
                    borderWidth: 2,
                    hoverBackgroundColor: color + 'CC', // 80% opacity on hover
                    hoverBorderWidth: 3,
                };
            });
        } else {
            // For scatter charts
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
                    borderWidth: borderWidth,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
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
                backgroundColor: colorSchemes[selectedColorScheme][0] + Math.round(opacity * 255).toString(16).padStart(2, '0'),
                borderColor: colorSchemes[selectedColorScheme][0],
                borderWidth: borderWidth,
            }]
        };
    };

    // Helper: Transform data for waterfall chart
    const transformToWaterfallData = () => {
        const colors = colorSchemes[selectedColorScheme];
        const waterfallData: number[] = [];
        const backgroundColors: string[] = [];
        let cumulative = 0;
        
        datasets[0]?.data.forEach((val: number, idx: number) => {
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

    // Helper: Transform data for funnel chart
    const transformToFunnelData = () => {
        const sortedData = [...(datasets[0]?.data || [])].sort((a, b) => b - a);
        const colors = colorSchemes[selectedColorScheme];
        
        return {
            labels: labels,
            datasets: [{
                label: datasets[0]?.label || 'Values',
                data: sortedData,
                backgroundColor: sortedData.map((_, idx) => colors[idx % colors.length] + Math.round(opacity * 255).toString(16).padStart(2, '0')),
                borderColor: sortedData.map((_, idx) => colors[idx % colors.length]),
                borderWidth: borderWidth,
            }]
        };
    };

    // Helper: Transform data for gauge (using doughnut) - Industrial Standard KPI
    const transformToGaugeData = () => {
        // Calculate average or use first value
        const allValues = datasets.flatMap(ds => ds.data).filter(v => typeof v === 'number');
        const value = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
        const max = Math.max(...allValues, 100);
        const percentage = (value / max) * 100;
        
        // Industrial standard color coding (Red-Amber-Green)
        let gaugeColor = '#dc2626'; // Red for poor (0-50%)
        let colorName = 'Critical';
        if (percentage >= 90) {
            gaugeColor = '#16a34a'; // Green for excellent (90-100%)
            colorName = 'Excellent';
        } else if (percentage >= 75) {
            gaugeColor = '#84cc16'; // Light green for good (75-90%)
            colorName = 'Good';
        } else if (percentage >= 50) {
            gaugeColor = '#f59e0b'; // Amber for fair (50-75%)
            colorName = 'Fair';
        }
        
        return {
            labels: ['Value', 'Remaining'],
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: [
                    gaugeColor,
                    '#e5e7eb' // Light gray for background
                ],
                borderWidth: 0,
                borderRadius: 2,
                cutout: '75%', // More compact donut
                circumference: 180,
                rotation: 270,
            }],
            colorName,
            actualValue: value,
            maxValue: max,
            percentage
        };
    };

    // Helper: Transform data for boxplot (statistical) - Industrial Standard
    const transformToBoxplotData = () => {
        const colors = colorSchemes[selectedColorScheme];
        
        // Calculate proper statistical quartiles using standard methodology
        const calculateStats = (data: number[]) => {
            const sorted = [...data].sort((a, b) => a - b);
            const n = sorted.length;
            
            // Standard statistical calculations
            const min = sorted[0];
            const max = sorted[n - 1];
            
            // Median (Q2)
            const median = n % 2 === 0 
                ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
                : sorted[Math.floor(n / 2)];
            
            // Q1 (25th percentile)
            const q1Index = Math.floor(n * 0.25);
            const q1 = sorted[q1Index];
            
            // Q3 (75th percentile)
            const q3Index = Math.floor(n * 0.75);
            const q3 = sorted[q3Index];
            
            // IQR (Interquartile Range) - important for outlier detection
            const iqr = q3 - q1;
            
            // Calculate mean for additional stats
            const mean = sorted.reduce((a, b) => a + b, 0) / n;
            
            // Calculate standard deviation
            const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
            const stdDev = Math.sqrt(variance);
            
            // Detect outliers (values beyond 1.5 * IQR from Q1 or Q3)
            const lowerFence = q1 - 1.5 * iqr;
            const upperFence = q3 + 1.5 * iqr;
            const outliers = sorted.filter(val => val < lowerFence || val > upperFence);
            
            return { 
                min, q1, median, q3, max, 
                mean, stdDev, iqr, 
                lowerFence, upperFence, 
                outliers: outliers.length,
                dataPoints: n 
            };
        };
        
        // Create boxplot-style data using horizontal bars to simulate box and whiskers
        const allStats = datasets.map(ds => calculateStats(ds.data));
        
        return {
            labels: datasets.map(ds => ds.label),
            datasets: datasets.map((dataset, idx) => {
                const stats = allStats[idx];
                const color = colors[idx % colors.length];
                
                return {
                    label: dataset.label,
                    data: [
                        { 
                            x: [stats.min, stats.q1], 
                            y: idx,
                            type: 'whisker-low'
                        },
                        { 
                            x: [stats.q1, stats.q3], 
                            y: idx,
                            type: 'box'
                        },
                        { 
                            x: [stats.q3, stats.max], 
                            y: idx,
                            type: 'whisker-high'
                        }
                    ],
                    backgroundColor: color + '60', // 40% opacity for box
                    borderColor: color,
                    borderWidth: 2,
                    stats: stats
                };
            }),
            allStats
        };
    };

    // Helper: Transform data for Gantt chart
    const transformToGanttData = () => {
        const colors = colorSchemes[selectedColorScheme];
        const ganttData: any[] = [];
        
        // Create task bars for each data point
        datasets[0]?.data.forEach((value: number, idx: number) => {
            const start = idx * 10;
            const duration = Math.abs(value);
            ganttData.push({
                x: [start, start + duration],
                y: labels[idx] || `Task ${idx + 1}`,
            });
        });
        
        return {
            labels: labels,
            datasets: [{
                label: 'Timeline',
                data: ganttData.map(d => d.x),
                backgroundColor: colors.map((c, idx) => c + Math.round(opacity * 255).toString(16).padStart(2, '0')),
                borderColor: colors[0],
                borderWidth: borderWidth,
                barThickness: 20,
            }]
        };
    };

    const applyColorScheme = (datasets: any[]) => {
        const colors = colorSchemes[selectedColorScheme];
        return datasets.map((dataset, idx) => {
            const color = colors[idx % colors.length];
            const baseConfig = {
                ...dataset,
                borderColor: color,
                borderWidth: borderWidth,
            };
            
            // Different background opacity for different chart types
            if (chartType === 'line' || chartType === 'area') {
                baseConfig.backgroundColor = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
                baseConfig.fill = chartType === 'area';
                baseConfig.tension = 0.4; // Smooth lines
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
            case 'boxplot':
                return transformToBoxplotData();
            case 'gantt':
                return transformToGanttData();
            default:
                return {
                    labels: labels,
                    datasets: applyColorScheme(datasets)
                };
        }
    }, [chartType, labels, datasets, selectedColorScheme, opacity, borderWidth]);

    const chartOptions = useMemo((): ChartOptions<any> => {
        const baseOptions: ChartOptions<any> = {
            responsive: true,
            maintainAspectRatio: false,
            animation: enableAnimation ? {
                duration: 1000,
                easing: 'easeInOutQuart'
            } : false,
            plugins: {
                legend: {
                    display: showLegend && chartType !== 'gauge',
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
                datalabels: {
                    display: false
                }
            }
        };

        // Special options for gauge - Industrial standard
        if (chartType === 'gauge') {
            return {
                ...baseOptions,
                circumference: 180,
                rotation: 270,
                cutout: '75%',
                plugins: {
                    ...baseOptions.plugins,
                    title: {
                        display: false
                    },
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            };
        }

        // Add scales for chart types that need them
        if (!['pie', 'doughnut', 'radar', 'polarArea', 'gauge'].includes(chartType)) {
            baseOptions.scales = {
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
            };
        }

        return baseOptions;
    }, [chartType, showLegend, legendPosition, fontSize, chartTitle, chartSubtitle, enableAnimation, showGrid, xAxisLabel, yAxisLabel]);

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
        <div className="w-full h-full bg-gray-50 flex">
            {/* Left Sidebar - Editing Controls */}
            <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chart Editor</h2>
                
                {/* Chart Type */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-3">Chart Type</label>
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                        {[
                            { value: 'bar', label: 'Bar', desc: 'Vertical bars' },
                            { value: 'horizontalBar', label: 'Horizontal Bar', desc: 'Horizontal bars' },
                            { value: 'line', label: 'Line', desc: 'Trend line' },
                            { value: 'area', label: 'Area', desc: 'Filled area' },
                            { value: 'pie', label: 'Pie', desc: 'Pie slices' },
                            { value: 'doughnut', label: 'Doughnut', desc: 'Ring chart' },
                            { value: 'radar', label: 'Radar', desc: 'Spider web' },
                            { value: 'polarArea', label: 'Polar', desc: 'Radial chart' },
                            { value: 'scatter', label: 'Scatter', desc: 'Data points' },
                            { value: 'bubble', label: 'Bubble', desc: 'Sized points' },
                            { value: 'histogram', label: 'Histogram', desc: 'Distribution' },
                            { value: 'boxplot', label: 'Box & Whisker', desc: 'Statistical' },
                            { value: 'waterfall', label: 'Waterfall', desc: 'Cumulative' },
                            { value: 'funnel', label: 'Funnel', desc: 'Conversion' },
                            { value: 'gauge', label: 'KPI Gauge', desc: 'Performance' },
                            { value: 'gantt', label: 'Gantt Chart', desc: 'Timeline' }
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
                        {/* Font Size */}
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
                        
                        {/* Border Width */}
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
                        
                        {/* Opacity */}
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
                        <div style={{ height: '600px' }} key={chartType}>
                            {chartType === 'bar' && (
                                <Bar key="bar-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'horizontalBar' && (
                                <Bar key="horizontal-bar-chart" ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
                            )}
                            {chartType === 'line' && (
                                <Line key="line-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'area' && (
                                <Line key="area-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'pie' && (
                                <Pie key="pie-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'doughnut' && (
                                <Doughnut key="doughnut-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'radar' && (
                                <Radar key="radar-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'polarArea' && (
                                <PolarArea key="polar-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'scatter' && (
                                <Scatter key="scatter-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'bubble' && (
                                <Bubble key="bubble-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'histogram' && (
                                <Bar key="histogram-chart" ref={chartRef} data={chartData} options={chartOptions} />
                            )}
                            {chartType === 'boxplot' && (
                                <div className="h-full flex flex-col overflow-auto">
                                    <div className="relative" style={{ height: '350px', minHeight: '350px' }}>
                                        <Bar key="boxplot-chart" ref={chartRef} data={{
                                            labels: datasets.map(ds => ds.label),
                                            datasets: datasets.map((dataset, idx) => {
                                                const colors = colorSchemes[selectedColorScheme];
                                                const color = colors[idx % colors.length];
                                                
                                                // Calculate stats
                                                const sorted = [...dataset.data].sort((a, b) => a - b);
                                                const n = sorted.length;
                                                const min = sorted[0];
                                                const max = sorted[n - 1];
                                                const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
                                                const q1 = sorted[Math.floor(n * 0.25)];
                                                const q3 = sorted[Math.floor(n * 0.75)];
                                                
                                                return {
                                                    label: dataset.label,
                                                    data: [{ x: dataset.label, y: [min, q1, median, q3, max] }],
                                                    backgroundColor: color + '60',
                                                    borderColor: color,
                                                    borderWidth: 2,
                                                    outlierBackgroundColor: color,
                                                    outlierBorderColor: color,
                                                    outlierRadius: 4,
                                                    itemRadius: 0
                                                };
                                            })
                                        }} options={{
                                            ...chartOptions,
                                            indexAxis: 'x' as const
                                        }} />
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                        {datasets.map((dataset, idx) => {
                                            const sorted = [...dataset.data].sort((a, b) => a - b);
                                            const n = sorted.length;
                                            const min = sorted[0];
                                            const max = sorted[n - 1];
                                            const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
                                            const q1 = sorted[Math.floor(n * 0.25)];
                                            const q3 = sorted[Math.floor(n * 0.75)];
                                            const iqr = q3 - q1;
                                            const mean = sorted.reduce((a, b) => a + b, 0) / n;
                                            const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
                                            const stdDev = Math.sqrt(variance);
                                            const colors = colorSchemes[selectedColorScheme];
                                            const color = colors[idx % colors.length];
                                            
                                            return (
                                                <div key={idx} className="bg-gray-50 rounded-lg p-3 border-2" style={{ borderColor: color }}>
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                                                        <h4 className="font-semibold text-xs text-gray-900 truncate">{dataset.label}</h4>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-gray-600">Min</span>
                                                            <span className="font-bold text-gray-900">{min.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-gray-600">Q1</span>
                                                            <span className="font-bold text-gray-900">{q1.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px] bg-blue-50 px-1.5 py-0.5 rounded">
                                                            <span className="text-blue-700 font-semibold">Med</span>
                                                            <span className="font-bold text-blue-700">{median.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-gray-600">Q3</span>
                                                            <span className="font-bold text-gray-900">{q3.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px]">
                                                            <span className="text-gray-600">Max</span>
                                                            <span className="font-bold text-gray-900">{max.toFixed(2)}</span>
                                                        </div>
                                                        <div className="border-t border-gray-300 pt-1 mt-1">
                                                            <div className="flex justify-between text-[11px]">
                                                                <span className="text-gray-500">μ</span>
                                                                <span className="font-semibold text-gray-800">{mean.toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[11px]">
                                                                <span className="text-gray-500">σ</span>
                                                                <span className="font-semibold text-gray-800">{stdDev.toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[11px]">
                                                                <span className="text-gray-500">IQR</span>
                                                                <span className="font-semibold text-gray-800">{iqr.toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[11px]">
                                                                <span className="text-gray-500">n</span>
                                                                <span className="font-semibold text-gray-800">{n}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {chartType === 'waterfall' && (
                                <Bar key="waterfall-chart" ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'x' as const }} />
                            )}
                            {chartType === 'funnel' && (
                                <Bar key="funnel-chart" ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
                            )}
                            {chartType === 'gauge' && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-full max-w-md">
                                        <div className="relative" style={{ height: '280px' }}>
                                            <Doughnut key="gauge-chart" ref={chartRef} data={chartData} options={chartOptions} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '55%' }}>
                                                <div className="text-6xl font-bold text-gray-900 leading-none">
                                                    {(() => {
                                                        const allValues = datasets.flatMap(ds => ds.data).filter(v => typeof v === 'number');
                                                        const value = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
                                                        return value.toFixed(1);
                                                    })()}
                                                </div>
                                                <div className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                                                    {(() => {
                                                        const allValues = datasets.flatMap(ds => ds.data).filter(v => typeof v === 'number');
                                                        const value = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
                                                        const max = Math.max(...allValues, 100);
                                                        return `of ${max.toFixed(0)}`;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">Status</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    (() => {
                                                        const allValues = datasets.flatMap(ds => ds.data).filter(v => typeof v === 'number');
                                                        const value = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
                                                        const max = Math.max(...allValues, 100);
                                                        const pct = (value / max) * 100;
                                                        if (pct >= 90) return 'bg-green-100 text-green-800';
                                                        if (pct >= 75) return 'bg-lime-100 text-lime-800';
                                                        if (pct >= 50) return 'bg-amber-100 text-amber-800';
                                                        return 'bg-red-100 text-red-800';
                                                    })()
                                                }`}>
                                                    {(() => {
                                                        const allValues = datasets.flatMap(ds => ds.data).filter(v => typeof v === 'number');
                                                        const value = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
                                                        const max = Math.max(...allValues, 100);
                                                        const pct = (value / max) * 100;
                                                        if (pct >= 90) return 'Excellent';
                                                        if (pct >= 75) return 'Good';
                                                        if (pct >= 50) return 'Fair';
                                                        return 'Critical';
                                                    })()}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Performance</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {(() => {
                                                            const allValues = datasets.flatMap(ds => ds.data).filter(v => typeof v === 'number');
                                                            const value = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
                                                            const max = Math.max(...allValues, 100);
                                                            return ((value / max) * 100).toFixed(1);
                                                        })()}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Data Points</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {datasets.flatMap(ds => ds.data).length}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Metric</span>
                                                    <span className="font-semibold text-gray-900 truncate max-w-[150px]">
                                                        {datasets[0]?.label || 'KPI'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {chartType === 'gantt' && (
                                <Bar key="gantt-chart" ref={chartRef} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
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
