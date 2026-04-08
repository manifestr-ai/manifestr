import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";

// Helper function to convert Univer cellData to CSV
const convertUniverToCSV = (cellData: any): string => {
  const rows: string[][] = [];
  const maxRow = Math.max(...Object.keys(cellData).map((k) => parseInt(k)));

  for (let r = 0; r <= maxRow; r++) {
    const rowData = cellData[r] || {};
    const maxCol = Math.max(...Object.keys(rowData).map((k) => parseInt(k)));
    const row: string[] = [];

    for (let c = 0; c <= maxCol; c++) {
      const cell = rowData[c];
      row.push(cell?.v ? String(cell.v) : "");
    }
    rows.push(row);
  }

  return rows.map((row) => row.join(",")).join("\n");
};

export default function ChartEditor() {
  const router = useRouter();
  const { id: jobId } = router.query;
  const containerRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);
  const loadedElements = useRef<Array<HTMLElement>>([]); // To track elements for cleanup
  const [chartData, setChartData] = useState<any>(null);
  const [csvData, setCsvData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch generated chart data if jobId is provided
  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    const fetchChartData = async () => {
      try {
        console.log("📊 Fetching chart data for job:", jobId);
        const response = await api.get(`/ai/status/${jobId}`);

        if (response.data?.status === "success") {
          const jobData = response.data.data;
          const editorState = jobData.result?.editorState;

          console.log("✅ Chart data loaded:", editorState);
          setChartData(editorState);

          // Pre-convert CSV for easier access
          if (editorState?.sheets) {
            const firstSheet = Object.values(editorState.sheets)[0] as any;
            if (firstSheet?.cellData) {
              const csv = convertUniverToCSV(firstSheet.cellData);
              setCsvData(csv);
              console.log("📄 CSV ready for import");
            }
          }
        }
      } catch (error) {
        console.error("❌ Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [jobId]);

  useEffect(() => {
    const loadScript = (src: string): Promise<HTMLScriptElement> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists to prevent duplicates
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve(existingScript as HTMLScriptElement);
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve(script);
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
        loadedElements.current.push(script);
      });
    };

    const loadCSS = (href: string): HTMLLinkElement | undefined => {
      // Check if link already exists to prevent duplicates
      if (document.querySelector(`link[href="${href}"]`)) {
        return undefined; // Already loaded
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      loadedElements.current.push(link);
      return link;
    };

    const initEditor = async () => {
      try {
        console.log("📊 Loading Highcharts Editor...");

        // Load CSS
        loadCSS("/assets/highcharts-editor/highcharts-editor.min.css");

        // Load Highcharts core from LOCAL (highstock includes core + stock features)
        await loadScript("/assets/highcharts-editor/highstock.js");

        // Load ONLY the editor (not complete bundle which includes highcharts again)
        await loadScript("/assets/highcharts-editor/highcharts-editor.js");

        // Initialize Editor
        console.log("🎨 Initializing Highcharts Editor...");
        const highed = (window as any).highed;
        if (highed && containerRef.current) {
          highed.ready(() => {
            if (containerRef.current) {
              containerRef.current.innerHTML = "";
              // Build chart options with CSV data
              const chartOptions: any = {
                features: "import templates customize",
              };

              // If we have CSV, pre-create a chart
              if (csvData) {
                chartOptions.defaultChartOptions = {
                  chart: {
                    type: "column",
                  },
                  title: {
                    text: chartData?.name || "AI Generated Chart",
                  },
                  data: {
                    csv: csvData,
                  },
                };
              }

              editorInstance.current = highed.Editor(
                containerRef.current,
                chartOptions,
              );
              console.log("✅ Highcharts Editor initialized!");

              // Force chart creation after init
              if (csvData) {
                setTimeout(() => {
                  const Highcharts = (window as any).Highcharts;
                  const editor = editorInstance.current;

                  if (Highcharts && editor && containerRef.current) {
                    try {
                      // Find the chart preview container in the editor
                      const previewEl =
                        containerRef.current.querySelector(
                          ".highed-chart-preview",
                        ) ||
                        containerRef.current.querySelector(
                          "#highed-chart-preview",
                        ) ||
                        containerRef.current.querySelector(".chart-preview");

                      if (previewEl) {
                        // Create chart in preview area
                        Highcharts.chart(previewEl, {
                          chart: { type: "column" },
                          title: {
                            text: chartData?.name || "AI Generated Chart",
                          },
                          data: { csv: csvData },
                          credits: { enabled: false },
                        });
                        console.log("✅ Chart auto-loaded in editor!");
                      }
                    } catch (err) {
                      console.log(
                        "⚠️ Chart preview loaded, use editor to customize",
                      );
                    }
                  }
                }, 2000);
              }
            }
          });
        } else {
          console.error("❌ Highcharts Editor library not loaded!");
        }
      } catch (error) {
        console.error("❌ Failed to initialize Highcharts Editor:", error);
      }
    };

    // Only init editor when not loading
    if (!loading) {
      initEditor();
    }

    return () => {
      // Cleanup: Remove all dynamically added scripts and links (only ones we tracked)
      loadedElements.current.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      loadedElements.current = [];

      if (editorInstance.current) {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        editorInstance.current = null;
      }
    };
  }, [loading, chartData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(csvData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white relative">
      {csvData && (
        <div
          className="absolute top-4 right-4 z-50 bg-green-50 border border-green-300 rounded-lg p-4 shadow-lg"
          style={{ maxWidth: "320px" }}
        >
          <p className="text-sm text-green-900 font-semibold mb-2">
            ✅ Chart Loaded Successfully!
          </p>
          <p className="text-xs text-green-700">
            Your chart should appear automatically. Use the editor tools on the
            left to customize it.
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className="h-full w-full"
        id="highed-mountpoint"
      />
    </div>
  );
}
