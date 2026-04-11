import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
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
} from "chart.js";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Scatter,
  Bubble,
} from "react-chartjs-2";
import api from "../../lib/api";

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
  Filler,
);

export default function ChartViewer() {
  const router = useRouter();
  const { id: jobId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    const loadAndDisplayChart = async () => {
      try {
        console.log("📊 Loading chart data for job:", jobId);

        // Fetch job data
        const response = await api.get(`/ai/generation/${jobId}`);
        if (response.data?.status !== "success") {
          throw new Error("Failed to load chart data");
        }

        const editorState = response.data.data?.result?.editorState;

        // Handle both formats: new chartState format AND old sheets format
        if (!editorState?.sheets && !editorState?.chartState) {
          throw new Error("No chart data available");
        }

        console.log("✅ Chart data loaded");

        // Extract data and create multiple charts
        let labels: string[] = [];
        let datasets: any[] = [];
        let chartTitle = editorState.name || "AI Generated Chart";

        // NEW FORMAT: chartState (from collaborative editor)
        if (editorState.chartState) {
          console.log(
            "📊 Loading from chartState format (collaborative editor)",
          );
          labels = editorState.chartState.labels || [];
          datasets = editorState.chartState.datasets || [];
          chartTitle = editorState.chartState.chartTitle || chartTitle;
          console.log("✅ Extracted labels:", labels);
          console.log("✅ Extracted datasets:", datasets);
        }
        // OLD FORMAT: sheets (from original AI generation)
        else if (editorState.sheets) {
          console.log("📊 Loading from sheets format (original AI generation)");
          const firstSheet = Object.values(editorState.sheets)[0] as any;
          if (firstSheet?.cellData) {
            const converted = convertCellDataToSeries(firstSheet.cellData);
            labels = converted.categories;
            datasets = converted.series.map((s: any) => ({
              label: s.name,
              data: s.data,
              backgroundColor: getRandomColor(0.6),
              borderColor: getRandomColor(1),
              borderWidth: 2,
            }));
            console.log("✅ Converted labels:", labels);
            console.log("✅ Converted datasets:", datasets);
          }
        }

        console.log("📊 FINAL DATA - Labels:", labels, "Datasets:", datasets);

        // Create multiple chart types
        const chartTypes = [
          { type: "bar", title: "Bar Chart" },
          { type: "line", title: "Trend Chart" },
          { type: "doughnut", title: "Efficiency Gain" },
          { type: "horizontalBar", title: "Horizontal Bar" },
          { type: "radar", title: "Radar Chart" },
          { type: "area", title: "Area Chart" },
          { type: "scatter", title: "Scatter Plot" },
          { type: "bubble", title: "Bubble Chart" },
          { type: "histogram", title: "Histogram" },
          { type: "waterfall", title: "Waterfall Chart" },
          { type: "funnel", title: "Funnel Chart" },
          { type: "gauge", title: "KPI Gauge" },
          { type: "boxplot", title: "Box & Whisker" },
        ];

        const generatedCharts = chartTypes.map((ct) => ({
          type: ct.type,
          title: ct.title,
          labels,
          datasets: datasets.map((ds, idx) => ({
            ...ds,
            backgroundColor: getChartColor(idx, ct.type, 0.6),
            borderColor: getChartColor(idx, ct.type, 1),
          })),
        }));

        setCharts(generatedCharts);
      } catch (err: any) {
        console.error("❌ Failed to load chart:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAndDisplayChart();
  }, [jobId]);

  const convertCellDataToSeries = (cellData: any) => {
    const rows = Object.keys(cellData)
      .map(Number)
      .sort((a, b) => a - b);
    const cols = Object.keys(cellData[rows[0]] || {})
      .map(Number)
      .sort((a, b) => a - b);

    const categories: string[] = [];
    const series: any[] = [];

    // Row 0 = headers
    const headerRow = cellData[rows[0]];
    cols.slice(1).forEach((col) => {
      const header = headerRow[col]?.v || `Series ${col}`;
      series.push({ name: header, data: [] });
    });

    // Data rows
    rows.slice(1).forEach((row) => {
      const rowData = cellData[row];
      const label = rowData[cols[0]]?.v || "";
      categories.push(String(label));

      cols.slice(1).forEach((col, idx) => {
        const value = rowData[col]?.v;
        series[idx].data.push(typeof value === "number" ? value : 0);
      });
    });

    return { categories, series };
  };

  const getRandomColor = (opacity: number) => {
    const colors = [
      `rgba(59, 130, 246, ${opacity})`,
      `rgba(239, 68, 68, ${opacity})`,
      `rgba(16, 185, 129, ${opacity})`,
      `rgba(245, 158, 11, ${opacity})`,
      `rgba(139, 92, 246, ${opacity})`,
      `rgba(236, 72, 153, ${opacity})`,
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getChartColor = (index: number, chartType: string, opacity: number) => {
    const colors = [
      [59, 130, 246],
      [239, 68, 68],
      [16, 185, 129],
      [245, 158, 11],
      [139, 92, 246],
      [236, 72, 153],
    ];
    const color = colors[index % colors.length];
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
  };

  const renderChart = (chart: any) => {
    const chartData = {
      labels: chart.labels,
      datasets: chart.datasets,
    };

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        title: {
          display: true,
          text: chart.title,
          font: { size: 16, weight: "bold" },
        },
      },
      scales:
        chart.type !== "pie" &&
        chart.type !== "doughnut" &&
        chart.type !== "radar" &&
        chart.type !== "polarArea"
          ? {
              y: {
                beginAtZero: true,
                grid: { display: true },
              },
              x: {
                grid: { display: false },
              },
            }
          : undefined,
    };

    switch (chart.type) {
      case "bar":
        return <Bar data={chartData} options={options} />;
      case "horizontalBar":
        return (
          <Bar
            data={chartData}
            options={{ ...options, indexAxis: "y" as const }}
          />
        );
      case "line":
        return <Line data={chartData} options={options} />;
      case "area":
        const areaData = {
          ...chartData,
          datasets: chartData.datasets.map((ds: any) => ({
            ...ds,
            fill: true,
          })),
        };
        return <Line data={areaData} options={options} />;
      case "pie":
        return <Pie data={chartData} options={options} />;
      case "doughnut":
        return <Doughnut data={chartData} options={options} />;
      case "radar":
        return <Radar data={chartData} options={options} />;
      case "polarArea":
        return <PolarArea data={chartData} options={options} />;
      case "scatter":
        const scatterData = {
          datasets: chartData.datasets.map((ds: any, idx: number) => ({
            ...ds,
            data: ds.data.map((y: number, i: number) => ({ x: i + 1, y })),
            showLine: false,
          })),
        };
        return <Scatter data={scatterData} options={options} />;
      case "bubble":
        const bubbleData = {
          datasets: chartData.datasets.map((ds: any) => ({
            ...ds,
            data: ds.data.map((y: number, i: number) => ({
              x: i + 1,
              y,
              r: Math.abs(y) / 2 + 5,
            })),
          })),
        };
        return <Bubble data={bubbleData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading charts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Failed to Load Chart
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  AI Generated Charts
                </h1>
                <p className="text-gray-600 mb-4">
                  Multiple visualizations of your data as:{" "}
                  {charts.map((c) => c.title.toLowerCase()).join(", ")}
                </p>
              </div>
              <button
                onClick={() => router.push(`/chart-editor?id=${jobId}`)}
                className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit in Chart Editor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {charts.map((chart, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="h-80">{renderChart(chart)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
