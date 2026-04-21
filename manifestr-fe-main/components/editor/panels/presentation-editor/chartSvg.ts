export type PresentationChartType =
  | "column"
  | "stacked-column"
  | "bar"
  | "line"
  | "area"
  | "pie"
  | "donut"
  | "scatter";

export type ChartSeries = {
  name: string;
  values: number[];
};

export type ScatterPoint = { x: number; y: number };

export type PresentationChartSpec =
  | {
      kind: "category";
      type: Exclude<PresentationChartType, "scatter">;
      title?: string;
      labels: string[];
      series: ChartSeries[];
    }
  | {
      kind: "scatter";
      type: "scatter";
      title?: string;
      points: ScatterPoint[];
    };

const CHART_NAME_PREFIX = "presentation-chart:";

export function serializeChartSpecToName(spec: PresentationChartSpec): string {
  return `${CHART_NAME_PREFIX}${encodeURIComponent(JSON.stringify(spec))}`;
}

export function parseChartSpecFromName(
  name: string | undefined,
): PresentationChartSpec | null {
  if (!name || typeof name !== "string") return null;
  if (!name.startsWith(CHART_NAME_PREFIX)) return null;
  try {
    const raw = name.slice(CHART_NAME_PREFIX.length);
    return JSON.parse(decodeURIComponent(raw)) as PresentationChartSpec;
  } catch {
    return null;
  }
}

export function makeSvgDataUrl(svg: string): string {
  const cleaned = svg.replace(/\s+/g, " ").trim();
  const base64 = (() => {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(cleaned, "utf8").toString("base64");
    }
    const bytes = new TextEncoder().encode(cleaned);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  })();
  return `data:image/svg+xml;base64,${base64}`;
}

const chartColors = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#A855F7",
  "#EC4899",
  "#06B6D4",
];

export function createDefaultChartSpec(
  type: PresentationChartType,
): PresentationChartSpec {
  if (type === "scatter") {
    return {
      kind: "scatter",
      type: "scatter",
      title: "Scatter Chart",
      points: [
        { x: 8, y: 18 },
        { x: 14, y: 22 },
        { x: 24, y: 30 },
        { x: 31, y: 26 },
        { x: 37, y: 42 },
        { x: 49, y: 35 },
        { x: 62, y: 54 },
        { x: 71, y: 60 },
      ],
    };
  }

  const labels = ["Q1", "Q2", "Q3", "Q4"];
  const series: ChartSeries[] = [
    { name: "Series 1", values: [32, 56, 41, 68] },
  ];
  if (type === "stacked-column") {
    series.push({ name: "Series 2", values: [18, 22, 30, 24] });
  }

  return {
    kind: "category",
    type,
    title:
      type === "stacked-column"
        ? "Stacked Column Chart"
        : type === "column"
          ? "Column Chart"
          : type === "bar"
            ? "Bar Chart"
            : type === "line"
              ? "Line Chart"
              : type === "area"
                ? "Area Chart"
                : type === "pie"
                  ? "Pie Chart"
                  : type === "donut"
                    ? "Donut Chart"
                    : "Chart",
    labels,
    series,
  };
}

function clampNumber(n: number, fallback: number): number {
  if (typeof n !== "number" || Number.isNaN(n) || !Number.isFinite(n))
    return fallback;
  return n;
}

function normalizeCategorySpec(spec: Extract<PresentationChartSpec, { kind: "category" }>) {
  const labels = Array.isArray(spec.labels) ? spec.labels : [];
  const series = Array.isArray(spec.series) ? spec.series : [];
  const safeLabels = labels.map((l, i) => (typeof l === "string" ? l : `Cat ${i + 1}`));
  const safeSeries: ChartSeries[] = series.map((s, idx) => {
    const values = Array.isArray(s?.values) ? s.values : [];
    const safeValues = safeLabels.map((_, i) => clampNumber(values[i], 0));
    return {
      name: typeof s?.name === "string" ? s.name : `Series ${idx + 1}`,
      values: safeValues,
    };
  });
  return { ...spec, labels: safeLabels, series: safeSeries };
}

function normalizeScatterSpec(spec: Extract<PresentationChartSpec, { kind: "scatter" }>) {
  const points = Array.isArray(spec.points) ? spec.points : [];
  const safePoints = points
    .map((p) => ({ x: clampNumber(p?.x, 0), y: clampNumber(p?.y, 0) }))
    .slice(0, 50);
  return { ...spec, points: safePoints };
}

export function buildChartSvg(spec: PresentationChartSpec): string {
  const width = 620;
  const height = 380;
  const margin = { top: 60, right: 24, bottom: 56, left: 56 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const axis = "#667085";
  const grid = "#E5E7EB";

  if (spec.kind === "scatter") {
    const s = normalizeScatterSpec(spec);
    const maxX = Math.max(1, ...s.points.map((p) => p.x));
    const maxY = Math.max(1, ...s.points.map((p) => p.y));
    const body = s.points
      .map((p, i) => {
        const px = margin.left + (p.x / maxX) * plotW;
        const py = margin.top + plotH - (p.y / maxY) * plotH;
        return `<circle cx="${px}" cy="${py}" r="5" fill="${chartColors[i % chartColors.length]}" opacity="0.95" />`;
      })
      .join("");

    const axisSvg = `
      ${Array.from({ length: 5 })
        .map((_, i) => {
          const y = margin.top + (i * plotH) / 4;
          return `<line x1="${margin.left}" y1="${y}" x2="${margin.left + plotW}" y2="${y}" stroke="${grid}" />`;
        })
        .join("")}
      <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotH}" stroke="${axis}" stroke-width="1.2" />
      <line x1="${margin.left}" y1="${margin.top + plotH}" x2="${margin.left + plotW}" y2="${margin.top + plotH}" stroke="${axis}" stroke-width="1.2" />
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision">
      <rect width="${width}" height="${height}" fill="#FFFFFF" />
      <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
      <text x="${margin.left}" y="28" font-size="16" font-family="Inter, Arial, sans-serif" font-weight="600" fill="#111827">${s.title || "Scatter Chart"}</text>
      ${axisSvg}
      ${body}
    </svg>`;
  }

  const s = normalizeCategorySpec(spec);
  const title = s.title || "Chart";
  const labels = s.labels;
  const series = s.series.length > 0 ? s.series : [{ name: "Series 1", values: labels.map(() => 0) }];

  const maxValue =
    s.type === "stacked-column"
      ? Math.max(
          1,
          ...labels.map((_, i) =>
            series.reduce((acc, ser) => acc + clampNumber(ser.values[i], 0), 0),
          ),
        )
      : Math.max(1, ...series.flatMap((ser) => ser.values.map((v) => clampNumber(v, 0))));

  const yToPx = (v: number) => margin.top + plotH - (v / maxValue) * plotH;

  let body = "";
  let labelsSvg = "";

  if (s.type === "pie" || s.type === "donut") {
    const values = series[0]?.values?.map((v) => clampNumber(v, 0)) || labels.map(() => 0);
    const total = Math.max(1, values.reduce((a, b) => a + b, 0));
    const cx = 265;
    const cy = 190;
    const r = 118;
    const innerR = s.type === "donut" ? 62 : 0;
    let current = -Math.PI / 2;
    const slices: string[] = [];

    values.forEach((value, i) => {
      const sweep = (value / total) * Math.PI * 2;
      const start = current;
      const end = current + sweep;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const largeArc = sweep > Math.PI ? 1 : 0;

      if (innerR === 0) {
        slices.push(
          `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${chartColors[i % chartColors.length]}" />`,
        );
      } else {
        const ix1 = cx + innerR * Math.cos(start);
        const iy1 = cy + innerR * Math.sin(start);
        const ix2 = cx + innerR * Math.cos(end);
        const iy2 = cy + innerR * Math.sin(end);
        slices.push(
          `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z" fill="${chartColors[i % chartColors.length]}" />`,
        );
      }
      current = end;
    });

    body = slices.join("");
    labelsSvg = labels
      .map((label, i) => {
        const y = 96 + i * 30;
        return `
          <rect x="455" y="${y - 11}" width="12" height="12" rx="2" fill="${chartColors[i % chartColors.length]}" />
          <text x="475" y="${y}" font-size="13" fill="#4B5563">${label}</text>
        `;
      })
      .join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision">
      <rect width="${width}" height="${height}" fill="#FFFFFF" />
      <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
      <text x="${margin.left}" y="28" font-size="16" font-family="Inter, Arial, sans-serif" font-weight="600" fill="#111827">${title}</text>
      ${body}
      ${labelsSvg}
    </svg>`;
  }

  if (s.type === "column") {
    const groupWidth = plotW / Math.max(1, labels.length);
    const barsPerGroup = Math.max(1, series.length);
    const gap = Math.max(6, groupWidth * 0.08);
    const available = groupWidth - gap;
    const barWidth = Math.max(8, available / barsPerGroup - gap / barsPerGroup);

    body = labels
      .map((_, i) => {
        const baseX = margin.left + i * groupWidth + gap / 2;
        return series
          .map((ser, sIdx) => {
            const v = clampNumber(ser.values[i], 0);
            const h = (v / maxValue) * plotH;
            const y = margin.top + plotH - h;
            const x = baseX + sIdx * (barWidth + gap / barsPerGroup);
            return `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="5" fill="${chartColors[sIdx % chartColors.length]}" />`;
          })
          .join("");
      })
      .join("");

    labelsSvg = labels
      .map((label, i) => {
        const x = margin.left + (i + 0.5) * (plotW / labels.length);
        return `<text x="${x}" y="${height - 24}" text-anchor="middle" font-size="13" fill="#4B5563">${label}</text>`;
      })
      .join("");
  }

  if (s.type === "stacked-column") {
    const groupWidth = plotW / Math.max(1, labels.length);
    const barWidth = groupWidth * 0.55;
    body = labels
      .map((_, i) => {
        const x = margin.left + i * groupWidth + (groupWidth - barWidth) / 2;
        let currentTop = margin.top + plotH;
        return series
          .map((ser, sIdx) => {
            const v = clampNumber(ser.values[i], 0);
            const h = (v / maxValue) * plotH;
            const y = currentTop - h;
            currentTop = y;
            return `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${chartColors[sIdx % chartColors.length]}" />`;
          })
          .join("");
      })
      .join("");

    labelsSvg = labels
      .map((label, i) => {
        const x = margin.left + (i + 0.5) * (plotW / labels.length);
        return `<text x="${x}" y="${height - 24}" text-anchor="middle" font-size="13" fill="#4B5563">${label}</text>`;
      })
      .join("");
  }

  if (s.type === "bar") {
    const rowHeight = plotH / Math.max(1, labels.length);
    const barsPerRow = Math.max(1, series.length);
    const gap = Math.max(6, rowHeight * 0.12);
    const barHeight = Math.max(10, (rowHeight - gap) / barsPerRow);

    body = labels
      .map((label, i) => {
        const baseY = margin.top + i * rowHeight + gap / 2;
        const labelSvg = `<text x="${margin.left - 10}" y="${baseY + rowHeight / 2 + 4}" text-anchor="end" font-size="12" fill="#4B5563">${label}</text>`;
        const barsSvg = series
          .map((ser, sIdx) => {
            const v = clampNumber(ser.values[i], 0);
            const w = (v / maxValue) * plotW;
            const y = baseY + sIdx * barHeight;
            return `<rect x="${margin.left}" y="${y}" width="${w}" height="${barHeight - 2}" rx="4" fill="${chartColors[sIdx % chartColors.length]}" />`;
          })
          .join("");
        return `${labelSvg}${barsSvg}`;
      })
      .join("");
  }

  if (s.type === "line" || s.type === "area") {
    const lines = series
      .map((ser, sIdx) => {
        const points = labels
          .map((_, i) => {
            const x = margin.left + (i / Math.max(1, labels.length - 1)) * plotW;
            const y = yToPx(clampNumber(ser.values[i], 0));
            return `${x},${y}`;
          })
          .join(" ");
        const firstX = margin.left;
        const lastX = margin.left + plotW;
        const baseline = margin.top + plotH;
        const fill =
          s.type === "area"
            ? `<polygon points="${firstX},${baseline} ${points} ${lastX},${baseline}" fill="${sIdx === 0 ? "rgba(59,130,246,0.2)" : "rgba(34,197,94,0.18)"}" />`
            : "";
        const stroke = chartColors[sIdx % chartColors.length];
        const circles = labels
          .map((_, i) => {
            const x = margin.left + (i / Math.max(1, labels.length - 1)) * plotW;
            const y = yToPx(clampNumber(ser.values[i], 0));
            return `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="${stroke}" stroke-width="3" />`;
          })
          .join("");
        return `${fill}<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />${circles}`;
      })
      .join("");

    body = lines;
    labelsSvg = labels
      .map((label, i) => {
        const x = margin.left + (i / Math.max(1, labels.length - 1)) * plotW;
        return `<text x="${x}" y="${height - 24}" text-anchor="middle" font-size="13" fill="#4B5563">${label}</text>`;
      })
      .join("");
  }

  const axisSvg = `
    ${Array.from({ length: 5 })
      .map((_, i) => {
        const y = margin.top + (i * plotH) / 4;
        return `<line x1="${margin.left}" y1="${y}" x2="${margin.left + plotW}" y2="${y}" stroke="${grid}" />`;
      })
      .join("")}
    <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotH}" stroke="${axis}" stroke-width="1.2" />
    <line x1="${margin.left}" y1="${margin.top + plotH}" x2="${margin.left + plotW}" y2="${margin.top + plotH}" stroke="${axis}" stroke-width="1.2" />
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision">
    <rect width="${width}" height="${height}" fill="#FFFFFF" />
    <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
    <rect x="${margin.left}" y="${margin.top + 8}" width="${plotW}" height="${plotH - 8}" rx="8" fill="#FAFAFB" stroke="#EEF2F7" />
    <text x="${margin.left}" y="28" font-size="16" font-family="Inter, Arial, sans-serif" font-weight="600" fill="#111827">${title}</text>
    ${axisSvg}
    ${body}
    ${labelsSvg}
  </svg>`;
}
