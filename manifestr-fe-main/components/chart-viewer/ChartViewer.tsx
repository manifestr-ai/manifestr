import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

export default function ChartViewer() {
    const router = useRouter();
    const { id: jobId } = router.query;
    const chartRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        if (!jobId) {
            setLoading(false);
            return;
        }

        const loadAndDisplayChart = async () => {
            try {
                console.log('📊 Loading chart data for job:', jobId);
                
                // Fetch job data
                const response = await api.get(`/ai/generation/${jobId}`);
                if (response.data?.status !== 'success') {
                    throw new Error('Failed to load chart data');
                }

                const editorState = response.data.data?.result?.editorState;

                // Handle both formats: new chartState format AND old sheets format
                if (!editorState?.sheets && !editorState?.chartState) {
                    throw new Error('No chart data available');
                }

                console.log('✅ Chart data loaded');
                setChartData(editorState);

                // Load Highcharts dynamically
                await loadHighcharts();

                // Extract data and create chart
                // NEW FORMAT: chartState (from collaborative editor)
                if (editorState.chartState) {
                    console.log('📊 Loading from chartState format (collaborative editor)');
                    createChartFromState(editorState.chartState, editorState.name || 'AI Generated Chart');
                } 
                // OLD FORMAT: sheets (from original AI generation)
                else if (editorState.sheets) {
                    console.log('📊 Loading from sheets format (original AI generation)');
                    const firstSheet = Object.values(editorState.sheets)[0] as any;
                    if (firstSheet?.cellData) {
                        createChart(firstSheet.cellData, editorState.name || 'AI Generated Chart');
                    }
                }

            } catch (err: any) {
                console.error('❌ Failed to load chart:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAndDisplayChart();
    }, [jobId]);

    const loadHighcharts = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if ((window as any).Highcharts) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = '/assets/highcharts-editor/highstock.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Highcharts'));
            document.body.appendChild(script);
        });
    };

    const createChart = (cellData: any, title: string) => {
        if (!chartRef.current) return;

        const Highcharts = (window as any).Highcharts;
        if (!Highcharts) {
            console.error('Highcharts not loaded');
            return;
        }

        // Convert cell data to series
        const { categories, series } = convertCellDataToSeries(cellData);

        renderHighcharts(categories, series, title);
    };

    const createChartFromState = (chartState: any, title: string) => {
        if (!chartRef.current) return;

        const Highcharts = (window as any).Highcharts;
        if (!Highcharts) {
            console.error('Highcharts not loaded');
            return;
        }

        // Use data from chart state
        const categories = chartState.labels || [];
        const series = (chartState.datasets || []).map((ds: any) => ({
            name: ds.label,
            data: ds.data
        }));

        renderHighcharts(categories, series, chartState.chartTitle || title);
    };

    const renderHighcharts = (categories: string[], series: any[], title: string) => {
        if (!chartRef.current) return;

        const Highcharts = (window as any).Highcharts;

        // Create container for multiple charts
        chartRef.current.innerHTML = `
            <div class="space-y-8">
                <div id="column-chart" style="min-height: 400px;"></div>
                <div id="line-chart" style="min-height: 400px;"></div>
                <div id="pie-chart" style="min-height: 400px;"></div>
            </div>
        `;

        const commonOptions = {
            chart: {
                backgroundColor: '#ffffff',
                style: {
                    fontFamily: 'Hanken Grotesk, Inter, sans-serif'
                }
            },
            title: {
                style: {
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#18181b'
                }
            },
            credits: { enabled: false },
            legend: {
                itemStyle: {
                    fontSize: '13px',
                    fontWeight: '500'
                }
            }
        };

        // Create Column Chart
        Highcharts.chart('column-chart', {
            ...commonOptions,
            chart: {
                ...commonOptions.chart,
                type: 'column',
            },
            title: {
                text: title + ' - Column Chart',
                style: {
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#18181b'
                }
            },
            subtitle: {
                text: 'Bar Chart View',
                style: {
                    fontSize: '13px',
                    color: '#71717a'
                }
            },
            xAxis: {
                categories: categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: { text: 'Values' }
            },
            tooltip: {
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    dataLabels: { enabled: true }
                }
            },
            series: series
        });

        // Create Line Chart
        Highcharts.chart('line-chart', {
            ...commonOptions,
            chart: {
                ...commonOptions.chart,
                type: 'line',
            },
            title: {
                ...commonOptions.title,
                text: title + ' - Line Chart'
            },
            subtitle: {
                text: 'Trend Analysis View',
                style: {
                    fontSize: '14px',
                    color: '#71717a'
                }
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: { text: 'Values' }
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                line: {
                    dataLabels: { enabled: false },
                    enableMouseTracking: true
                }
            },
            series: series
        });

        // Create Pie Chart (using first series only)
        const pieData = series.length > 0 ? categories.map((cat, idx) => ({
            name: cat,
            y: series[0].data[idx]
        })) : [];

        Highcharts.chart('pie-chart', {
            ...commonOptions,
            chart: {
                ...commonOptions.chart,
                type: 'pie',
            },
            title: {
                ...commonOptions.title,
                text: title + ' - Distribution View'
            },
            subtitle: {
                text: series[0]?.name || 'Pie Chart',
                style: {
                    fontSize: '14px',
                    color: '#71717a'
                }
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f}%'
                    }
                }
            },
            series: [{
                name: 'Share',
                data: pieData
            }]
        });

        console.log('✅ All charts rendered successfully!');
    };

    const convertCellDataToSeries = (cellData: any) => {
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

        // First row is headers
        const headers = rows[0] || [];
        const dataRows = rows.slice(1);

        // Create categories from first column
        const categories = dataRows.map(row => String(row[0] || ''));

        // Create series from remaining columns
        const series = headers.slice(1).map((header, idx) => {
            const columnIndex = idx + 1;
            const data = dataRows.map(row => {
                const value = row[columnIndex];
                return typeof value === 'number' ? value : parseFloat(value) || 0;
            });

            return {
                name: String(header),
                data: data
            };
        }).filter(s => s.data.some(v => v !== 0)); // Only include series with data

        return { categories, series };
    };

    if (loading) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Generating your chart...</p>
                    <p className="text-gray-400 text-sm mt-2">AI is analyzing your data</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <div className="text-red-600 text-2xl font-bold">!</div>
                    </div>
                    <p className="text-gray-900 text-lg font-semibold mb-2">Failed to Load Chart</p>
                    <p className="text-gray-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-50 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Generated Charts</h1>
                    <p className="text-gray-600">Multiple visualizations of your data</p>
                </div>
                
                {/* Charts Container */}
                <div ref={chartRef} className="w-full space-y-8" />
                
                {/* Action Buttons */}
                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => router.push(`/chart-editor?id=${jobId}`)}
                        className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md"
                    >
                        Open in Editor
                    </button>
                    <button
                        onClick={() => {
                            const Highcharts = (window as any).Highcharts;
                            if (Highcharts) {
                                // Download first chart
                                const charts = Highcharts.charts.filter((c: any) => c);
                                if (charts.length > 0) {
                                    charts[0].exportChart({ type: 'image/png', filename: 'ai-chart-column' });
                                }
                            }
                        }}
                        className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md"
                    >
                        Download Charts
                    </button>
                </div>
                
                {/* Info Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        These charts were automatically generated by AI from your data
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Showing: Column Chart • Line Chart • Pie Chart
                    </p>
                </div>
            </div>
        </div>
    );
}
