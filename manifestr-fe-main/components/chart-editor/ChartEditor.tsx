/**
 * Chart Editor Component
 *
 * Simplified chart editor following the same pattern as PhotoEditor
 * Uses ToolPanel for chart-specific controls and EditorBottomToolbar for tool selection
 */

import React, { useEffect, useState, useRef, useMemo } from "react";
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
  ChartOptions,
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
import * as Y from "yjs";
import { SupabaseProvider } from "../../lib/supabase-yjs-provider";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";
import EditorBottomToolbar from "../editor/EditorBottomToolbar";
import ToolPanel from "../editor/panels/chart-editor/ToolPanel";
import StyleGuideModal from "../editor/StyleGuideModal";

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

type ChartType =
  | "bar"
  | "horizontalBar"
  | "line"
  | "area"
  | "pie"
  | "doughnut"
  | "radar"
  | "polarArea"
  | "scatter"
  | "bubble"
  | "histogram"
  | "boxplot"
  | "waterfall"
  | "funnel"
  | "gauge"
  | "gantt";

interface ChartEditorProps {
  generationId?: string;
  onStoreReady?: (store: any) => void;
}

type TextAlign = "left" | "center" | "right";
type TextTarget =
  | { type: "title" }
  | { type: "legend"; datasetIndex: number }
  | null;
type TextFormat = { bold: boolean; italic: boolean; underline: boolean };

type ChartTheme =
  | "professional"
  | "ocean"
  | "sunset"
  | "mono"
  | "pastel"
  | "earth"
  | "neon";

type ShadowPreset = "none" | "soft" | "medium" | "hard";
type OutlinePreset = "none" | "thin" | "medium" | "thick";
type GlowPreset = "none" | "soft" | "medium" | "strong";

type TextEffectState = {
  shadow: { preset: ShadowPreset; color: string };
  outline: { preset: OutlinePreset; color: string };
  glow: { preset: GlowPreset; color: string };
  gradient: { enabled: boolean; from: string; to: string; angle: number };
};

const getUserColor = (userId: string): string => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function ChartEditor({
  generationId,
  onStoreReady,
}: ChartEditorProps) {
  const router = useRouter();
  const chartRef = useRef<any>(null);
  const chartStageRef = useRef<HTMLDivElement | null>(null);
  const titleElRef = useRef<HTMLDivElement | null>(null);
  const legendElRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  // Y.js collaboration
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<SupabaseProvider | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  // Chart state
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [labels, setLabels] = useState<string[]>([
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Q5",
    "Q6",
    "Q7",
    "Q8",
    "Q9",
    "Q10",
    "Q11",
    "Q12",
  ]);
  const [datasets, setDatasets] = useState<any[]>([
    {
      label: "Revenue",
      data: [850, 920, 1050, 880, 1100, 950, 1200, 980, 1150, 1050, 1180, 1250],
    },
    {
      label: "Profit",
      data: [320, 380, 450, 340, 480, 410, 520, 420, 490, 460, 510, 550],
    },
  ]);
  const [chartTitle, setChartTitle] = useState(
    "Financial Performance Dashboard",
  );
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedTextTarget, setSelectedTextTarget] =
    useState<TextTarget>(null);
  const [titleAlign, setTitleAlign] = useState<TextAlign>("center");
  const [legendAlign, setLegendAlign] = useState<TextAlign>("center");
  const [titleFormat, setTitleFormat] = useState<TextFormat>({
    bold: true,
    italic: false,
    underline: false,
  });
  const [legendFormats, setLegendFormats] = useState<
    Record<number, TextFormat>
  >({});

  const defaultTextEffects: TextEffectState = {
    shadow: { preset: "none", color: "#000000" },
    outline: { preset: "none", color: "#000000" },
    glow: { preset: "none", color: "#3b82f6" },
    gradient: { enabled: false, from: "#3b82f6", to: "#ef4444", angle: 90 },
  };

  const normalizeTextEffects = (effects: any): TextEffectState => {
    if (!effects) return defaultTextEffects;
    if (typeof effects.shadow === "boolean") {
      return {
        shadow: { preset: effects.shadow ? "soft" : "none", color: "#000000" },
        outline: {
          preset: effects.outline ? "thin" : "none",
          color: "#000000",
        },
        glow: { preset: effects.glow ? "soft" : "none", color: "#3b82f6" },
        gradient: {
          enabled: !!effects.gradient,
          from: "#3b82f6",
          to: "#ef4444",
          angle: 90,
        },
      };
    }
    return {
      shadow: {
        preset: effects.shadow?.preset || "none",
        color: effects.shadow?.color || "#000000",
      },
      outline: {
        preset: effects.outline?.preset || "none",
        color: effects.outline?.color || "#000000",
      },
      glow: {
        preset: effects.glow?.preset || "none",
        color: effects.glow?.color || "#3b82f6",
      },
      gradient: {
        enabled: !!effects.gradient?.enabled,
        from: effects.gradient?.from || "#3b82f6",
        to: effects.gradient?.to || "#ef4444",
        angle: Number.isFinite(Number(effects.gradient?.angle))
          ? Number(effects.gradient.angle)
          : 90,
      },
    };
  };

  const normalizeLegendEffects = (
    effects: any,
  ): Record<number, TextEffectState> => {
    if (!effects || typeof effects !== "object") return {};
    const out: Record<number, TextEffectState> = {};
    Object.entries(effects).forEach(([k, v]) => {
      const idx = Number(k);
      if (Number.isFinite(idx)) out[idx] = normalizeTextEffects(v);
    });
    return out;
  };

  const [titleEffects, setTitleEffects] =
    useState<TextEffectState>(defaultTextEffects);
  const [legendEffects, setLegendEffects] = useState<
    Record<number, TextEffectState>
  >({});

  const colorSchemes = {
    professional: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
    ocean: ["#0ea5e9", "#06b6d4", "#14b8a6", "#0891b2", "#0284c7"],
    sunset: ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"],
    mono: ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db"],
    pastel: ["#60a5fa", "#f9a8d4", "#86efac", "#fde68a", "#a5b4fc"],
    earth: ["#7c3aed", "#16a34a", "#b45309", "#0ea5e9", "#a16207"],
    neon: ["#22c55e", "#06b6d4", "#a855f7", "#f97316", "#ef4444"],
  };
  const [selectedColorScheme, setSelectedColorScheme] =
    useState<keyof typeof colorSchemes>("professional");

  // Active tool state
  const [activeTool, setActiveTool] = useState<string>("charts");
  const [toast, setToast] = useState<string | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [titleCaret, setTitleCaret] = useState<number | null>(null);
  const [legendCarets, setLegendCarets] = useState<Record<number, number>>({});

  // Style Guide Modal
  const [showStyleGuideModal, setShowStyleGuideModal] = useState(false);

  type InsertPickerKind = "shapes" | "icons" | "symbols" | "link" | null;
  const [insertPicker, setInsertPicker] = useState<{
    open: boolean;
    kind: InsertPickerKind;
  }>({ open: false, kind: null });
  type StylePickerKind =
    | "insert-style"
    | "theme"
    | "shadow"
    | "outline"
    | "glow"
    | "gradient"
    | null;
  const [stylePicker, setStylePicker] = useState<{
    open: boolean;
    kind: StylePickerKind;
  }>({ open: false, kind: null });
  const [gradientDraft, setGradientDraft] = useState<{
    from: string;
    to: string;
    angle: number;
  }>({
    from: "#3b82f6",
    to: "#ef4444",
    angle: 90,
  });
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const SHAPES: Array<{ label: string; value: string }> = [
    { label: "Square", value: "■" },
    { label: "Hollow Square", value: "□" },
    { label: "Circle", value: "●" },
    { label: "Hollow Circle", value: "○" },
    { label: "Circle Large", value: "⬤" },
    { label: "Circle Small", value: "∙" },
    { label: "Triangle Up", value: "▲" },
    { label: "Triangle Down", value: "▼" },
    { label: "Triangle Left", value: "◀" },
    { label: "Triangle Right", value: "▶" },
    { label: "Diamond", value: "◆" },
    { label: "Hollow Diamond", value: "◇" },
    { label: "Lozenge", value: "⬥" },
    { label: "Star", value: "★" },
    { label: "Hollow Star", value: "☆" },
    { label: "Pentagon", value: "⬟" },
    { label: "Hexagon", value: "⬢" },
    { label: "Hollow Hexagon", value: "⬡" },
    { label: "Octagon", value: "⯃" },
    { label: "Hollow Circle Dot", value: "⊙" },
    { label: "Bullseye", value: "◎" },
    { label: "Plus", value: "+" },
    { label: "Heavy Plus", value: "✚" },
    { label: "Cross", value: "✕" },
    { label: "Heavy Cross", value: "✖" },
    { label: "Check", value: "✓" },
    { label: "Heavy Check", value: "✔" },
    { label: "Dot", value: "•" },
    { label: "Middle Dot", value: "·" },
    { label: "Hollow Bullet", value: "◦" },
    { label: "Block", value: "█" },
    { label: "Half Block", value: "▌" },
    { label: "Light Shade", value: "░" },
    { label: "Medium Shade", value: "▒" },
    { label: "Dark Shade", value: "▓" },
    { label: "Arrow Right", value: "→" },
    { label: "Arrow Left", value: "←" },
    { label: "Arrow Up", value: "↑" },
    { label: "Arrow Down", value: "↓" },
    { label: "Arrow Up Right", value: "↗" },
    { label: "Arrow Down Right", value: "↘" },
    { label: "Arrow Down Left", value: "↙" },
    { label: "Arrow Up Left", value: "↖" },
    { label: "Double Arrow Left Right", value: "↔" },
    { label: "Double Arrow Up Down", value: "↕" },
    { label: "Thick Arrow Right", value: "➡" },
    { label: "Thick Arrow Left", value: "⬅" },
    { label: "Thick Arrow Up", value: "⬆" },
    { label: "Thick Arrow Down", value: "⬇" },
    { label: "Line", value: "—" },
    { label: "Em Dash", value: "—" },
    { label: "En Dash", value: "–" },
    { label: "Horizontal Bar", value: "―" },
    { label: "Vertical Bar", value: "|" },
    { label: "Double Vertical Bar", value: "‖" },
    { label: "Wave", value: "≈" },
  ];

  const ICONS: Array<{ label: string; value: string }> = [
    { label: "Star", value: "⭐" },
    { label: "Check", value: "✅" },
    { label: "Cross", value: "❌" },
    { label: "Question", value: "❓" },
    { label: "Exclamation", value: "❗" },
    { label: "Warning", value: "⚠️" },
    { label: "Info", value: "ℹ️" },
    { label: "Pin", value: "📌" },
    { label: "Idea", value: "💡" },
    { label: "Target", value: "🎯" },
    { label: "Chart", value: "📊" },
    { label: "Money", value: "💰" },
    { label: "Growth", value: "📈" },
    { label: "Down", value: "📉" },
    { label: "Up", value: "⬆️" },
    { label: "Down Arrow", value: "⬇️" },
    { label: "Right Arrow", value: "➡️" },
    { label: "Left Arrow", value: "⬅️" },
    { label: "Fire", value: "🔥" },
    { label: "Rocket", value: "🚀" },
    { label: "Sparkles", value: "✨" },
    { label: "Lightning", value: "⚡" },
    { label: "Trophy", value: "🏆" },
    { label: "Medal", value: "🏅" },
    { label: "Calendar", value: "📅" },
    { label: "Clock", value: "⏰" },
    { label: "Bell", value: "🔔" },
    { label: "Megaphone", value: "📣" },
    { label: "Email", value: "✉️" },
    { label: "Link", value: "🔗" },
    { label: "Lock", value: "🔒" },
    { label: "Unlock", value: "🔓" },
    { label: "Key", value: "🔑" },
    { label: "Shield", value: "🛡️" },
    { label: "Gear", value: "⚙️" },
    { label: "Wrench", value: "🔧" },
    { label: "Hammer", value: "🔨" },
    { label: "Clipboard", value: "📋" },
    { label: "Paperclip", value: "📎" },
    { label: "Folder", value: "📁" },
    { label: "Document", value: "📄" },
    { label: "Bookmark", value: "🔖" },
    { label: "Heart", value: "❤️" },
    { label: "Broken Heart", value: "💔" },
    { label: "Clap", value: "👏" },
    { label: "Thumbs Up", value: "👍" },
    { label: "Thumbs Down", value: "👎" },
    { label: "Handshake", value: "🤝" },
    { label: "People", value: "👥" },
    { label: "Person", value: "👤" },
    { label: "Globe", value: "🌍" },
    { label: "Map Pin", value: "📍" },
    { label: "Checkmark Box", value: "☑️" },
    { label: "Box", value: "☐" },
  ];

  const SYMBOLS: Array<{ label: string; value: string }> = [
    { label: "Sum", value: "∑" },
    { label: "Delta", value: "Δ" },
    { label: "Pi", value: "π" },
    { label: "Infinity", value: "∞" },
    { label: "Square Root", value: "√" },
    { label: "Plus/Minus", value: "±" },
    { label: "Not Equal", value: "≠" },
    { label: "Approximately", value: "≈" },
    { label: "Less/Equal", value: "≤" },
    { label: "Greater/Equal", value: "≥" },
    { label: "Omega", value: "Ω" },
    { label: "Micro", value: "µ" },
    { label: "Degree", value: "°" },
    { label: "Copyright", value: "©" },
    { label: "Trademark", value: "™" },
    { label: "Registered", value: "®" },
    { label: "Section", value: "§" },
    { label: "Paragraph", value: "¶" },
    { label: "Bullet", value: "•" },
    { label: "Middle Dot", value: "·" },
    { label: "Ellipsis", value: "…" },
    { label: "Em Dash", value: "—" },
    { label: "En Dash", value: "–" },
    { label: "Multiply", value: "×" },
    { label: "Divide", value: "÷" },
    { label: "Dot Operator", value: "⋅" },
    { label: "Integral", value: "∫" },
    { label: "Double Integral", value: "∬" },
    { label: "Partial Derivative", value: "∂" },
    { label: "Nabla", value: "∇" },
    { label: "Proportional", value: "∝" },
    { label: "Therefore", value: "∴" },
    { label: "Because", value: "∵" },
    { label: "Subset", value: "⊂" },
    { label: "Superset", value: "⊃" },
    { label: "Subset/Equal", value: "⊆" },
    { label: "Superset/Equal", value: "⊇" },
    { label: "Element Of", value: "∈" },
    { label: "Not Element Of", value: "∉" },
    { label: "Intersection", value: "∩" },
    { label: "Union", value: "∪" },
    { label: "Logical And", value: "∧" },
    { label: "Logical Or", value: "∨" },
    { label: "Not", value: "¬" },
    { label: "Implication", value: "⇒" },
    { label: "Equivalence", value: "⇔" },
  ];

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  };

  const getCaretOffset = (el: HTMLElement | null): number | null => {
    if (!el) return null;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!el.contains(range.startContainer)) return null;
    const preRange = range.cloneRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  };

  const setCaretOffset = (el: HTMLElement | null, offset: number) => {
    if (!el) return;
    const selection = window.getSelection();
    if (!selection) return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let currentOffset = 0;
    let node: Node | null = walker.nextNode();
    while (node) {
      const text = node.textContent || "";
      const nextOffset = currentOffset + text.length;
      if (offset <= nextOffset) {
        const range = document.createRange();
        range.setStart(node, Math.max(0, offset - currentOffset));
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      currentOffset = nextOffset;
      node = walker.nextNode();
    }

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const insertRow = () => {
    const nextLabel = `Item ${labels.length + 1}`;
    setLabels((prev) => [...prev, nextLabel]);
    setDatasets((prev) =>
      prev.map((ds: any) => ({ ...ds, data: [...(ds.data || []), 0] })),
    );
    showToast("Row inserted");
  };

  const insertColumn = () => {
    const nextName = `Series ${datasets.length + 1}`;
    const nextData = Array(labels.length).fill(0);
    setDatasets((prev) => [...prev, { label: nextName, data: nextData }]);
    setShowLegend(true);
    showToast("Column inserted");
  };

  const insertIntoActiveText = (insertText: string) => {
    if (!selectedTextTarget) {
      showToast("Select the title or a legend label to insert here");
      return;
    }
    if (selectedTextTarget.type === "title") {
      const base = chartTitle || "";
      const caret = titleCaret ?? base.length;
      const next = base.slice(0, caret) + insertText + base.slice(caret);
      const nextCaret = caret + insertText.length;
      setChartTitle(next);
      setTitleCaret(nextCaret);
      requestAnimationFrame(() => {
        titleElRef.current?.focus();
        setCaretOffset(titleElRef.current, nextCaret);
      });
      return;
    }
    const idx = selectedTextTarget.datasetIndex;
    const base = String(datasets?.[idx]?.label || "");
    const caret = legendCarets[idx] ?? base.length;
    const next = base.slice(0, caret) + insertText + base.slice(caret);
    const nextCaret = caret + insertText.length;
    setDatasets((prev) =>
      prev.map((d: any, i: number) => (i === idx ? { ...d, label: next } : d)),
    );
    setLegendCarets((prev) => ({ ...prev, [idx]: nextCaret }));
    requestAnimationFrame(() => {
      const el = legendElRefs.current[idx] || null;
      el?.focus();
      setCaretOffset(el, nextCaret);
    });
  };

  const openInsertPicker = (kind: InsertPickerKind) => {
    if (!selectedTextTarget) {
      showToast("Click the title or a legend label to choose where to insert");
      return;
    }
    if (kind === "link") {
      setLinkText("");
      setLinkUrl("");
    }
    setInsertPicker({ open: true, kind });
  };

  const updateSelectedEffects = (
    updater: (prev: TextEffectState) => TextEffectState,
  ) => {
    if (!selectedTextTarget) {
      showToast("Select the title or a legend label first");
      return;
    }

    if (selectedTextTarget.type === "title") {
      setTitleEffects((prev) => updater(prev));
      return;
    }

    const idx = selectedTextTarget.datasetIndex;
    setLegendEffects((prev) => {
      const current = prev[idx] || defaultTextEffects;
      return { ...prev, [idx]: updater(current) };
    });
  };

  const openStylePicker = (kind: StylePickerKind) => {
    if (kind === "theme") {
      setStylePicker({ open: true, kind });
      return;
    }

    if (!selectedTextTarget) {
      showToast("Select the title or a legend label first");
      return;
    }

    if (kind === "gradient") {
      const current =
        selectedTextTarget.type === "title"
          ? titleEffects
          : getLegendEffects(selectedTextTarget.datasetIndex);
      setGradientDraft({
        from: current.gradient.from,
        to: current.gradient.to,
        angle: current.gradient.angle,
      });
    }

    setStylePicker({ open: true, kind });
  };

  const applyShadowPreset = (preset: ShadowPreset) => {
    updateSelectedEffects((prev) => ({
      ...prev,
      shadow: { ...prev.shadow, preset },
    }));
  };

  const applyOutlinePreset = (preset: OutlinePreset) => {
    updateSelectedEffects((prev) => ({
      ...prev,
      outline: { ...prev.outline, preset },
    }));
  };

  const applyGlowPreset = (preset: GlowPreset) => {
    updateSelectedEffects((prev) => ({
      ...prev,
      glow: { ...prev.glow, preset },
    }));
  };

  const applyGradient = (
    enabled: boolean,
    from: string,
    to: string,
    angle: number,
  ) => {
    updateSelectedEffects((prev) => ({
      ...prev,
      gradient: {
        enabled,
        from: from || prev.gradient.from,
        to: to || prev.gradient.to,
        angle: Number.isFinite(angle) ? angle : prev.gradient.angle,
      },
    }));
  };

  const applyInsertStylePreset = (presetId: string) => {
    if (!selectedTextTarget) {
      showToast("Select the title or a legend label first");
      return;
    }

    const presets: Record<string, TextEffectState> = {
      clean: defaultTextEffects,
      shadow_soft: {
        ...defaultTextEffects,
        shadow: { ...defaultTextEffects.shadow, preset: "soft" },
      },
      shadow_hard: {
        ...defaultTextEffects,
        shadow: { ...defaultTextEffects.shadow, preset: "hard" },
      },
      outline_medium: {
        ...defaultTextEffects,
        outline: { ...defaultTextEffects.outline, preset: "medium" },
      },
      glow_strong: {
        ...defaultTextEffects,
        glow: { ...defaultTextEffects.glow, preset: "strong" },
      },
      gradient: {
        ...defaultTextEffects,
        gradient: {
          enabled: true,
          from: defaultTextEffects.gradient.from,
          to: defaultTextEffects.gradient.to,
          angle: 90,
        },
      },
      neon: {
        ...defaultTextEffects,
        glow: { preset: "strong", color: "#a855f7" },
        outline: { preset: "thin", color: "#0b0b0b" },
      },
    };

    const next = presets[presetId] || defaultTextEffects;
    updateSelectedEffects(() => next);
  };

  const getLegendFormat = useMemo(
    () =>
      (datasetIndex: number): TextFormat =>
        legendFormats[datasetIndex] || {
          bold: false,
          italic: false,
          underline: false,
        },
    [legendFormats],
  );

  const getLegendEffects = useMemo(
    () =>
      (datasetIndex: number): TextEffectState =>
        legendEffects[datasetIndex] || defaultTextEffects,
    [legendEffects],
  );

  const getSelectedTextEffects = useMemo(
    () => (): TextEffectState | null => {
      if (!selectedTextTarget) return null;
      if (selectedTextTarget.type === "title") return titleEffects;
      return getLegendEffects(selectedTextTarget.datasetIndex);
    },
    [selectedTextTarget, titleEffects, getLegendEffects],
  );

  const toggleTextEffect = useMemo(
    () => (key: "shadow" | "outline" | "glow" | "gradient") => {
      if (!selectedTextTarget) return;

      const toggle = (prev: TextEffectState): TextEffectState => {
        if (key === "shadow") {
          return {
            ...prev,
            shadow: {
              ...prev.shadow,
              preset: prev.shadow.preset === "none" ? "soft" : "none",
            },
          };
        }
        if (key === "outline") {
          return {
            ...prev,
            outline: {
              ...prev.outline,
              preset: prev.outline.preset === "none" ? "thin" : "none",
            },
          };
        }
        if (key === "glow") {
          return {
            ...prev,
            glow: {
              ...prev.glow,
              preset: prev.glow.preset === "none" ? "soft" : "none",
            },
          };
        }
        return {
          ...prev,
          gradient: { ...prev.gradient, enabled: !prev.gradient.enabled },
        };
      };

      if (selectedTextTarget.type === "title") {
        setTitleEffects((prev) => toggle(prev));
        return;
      }

      const idx = selectedTextTarget.datasetIndex;
      setLegendEffects((prev) => {
        const current = prev[idx] || defaultTextEffects;
        return { ...prev, [idx]: toggle(current) };
      });
    },
    [selectedTextTarget],
  );

  const getSelectedTextFormat = useMemo(
    () => (): TextFormat | null => {
      if (!selectedTextTarget) return null;
      if (selectedTextTarget.type === "title") return titleFormat;
      return getLegendFormat(selectedTextTarget.datasetIndex);
    },
    [selectedTextTarget, titleFormat, getLegendFormat],
  );

  const toggleTextFormat = useMemo(
    () => (key: keyof TextFormat) => {
      if (!selectedTextTarget) return;
      if (selectedTextTarget.type === "title") {
        setTitleFormat((prev) => ({ ...prev, [key]: !prev[key] }));
        return;
      }
      const idx = selectedTextTarget.datasetIndex;
      setLegendFormats((prev) => {
        const current = prev[idx] || {
          bold: false,
          italic: false,
          underline: false,
        };
        return { ...prev, [idx]: { ...current, [key]: !current[key] } };
      });
    },
    [selectedTextTarget],
  );

  const getTextStyleForEffects = (
    effects: TextEffectState,
    theme: ChartTheme,
    kind: "title" | "legend",
  ): React.CSSProperties => {
    const baseColor = kind === "title" ? "#18181b" : "#52525b";
    const style: React.CSSProperties = {};

    if (effects.shadow.preset !== "none") {
      const alpha =
        effects.shadow.preset === "soft"
          ? 0.18
          : effects.shadow.preset === "medium"
            ? 0.22
            : 0.28;
      const blur =
        effects.shadow.preset === "soft"
          ? 4
          : effects.shadow.preset === "medium"
            ? 8
            : 14;
      const y =
        effects.shadow.preset === "soft"
          ? 1
          : effects.shadow.preset === "medium"
            ? 2
            : 4;
      style.textShadow = `0px ${y}px ${blur}px rgba(0,0,0,${alpha})`;
    }

    if (effects.outline.preset !== "none") {
      const width =
        effects.outline.preset === "thin"
          ? 1
          : effects.outline.preset === "medium"
            ? 2
            : 3;
      style.WebkitTextStroke = `${width}px ${effects.outline.color || "#000000"}`;
    }

    if (effects.glow.preset !== "none") {
      const blur =
        effects.glow.preset === "soft"
          ? 10
          : effects.glow.preset === "medium"
            ? 16
            : 24;
      const color = effects.glow.color || colorSchemes[theme]?.[0] || "#3b82f6";
      const glow = `0 0 ${blur}px ${color}66, 0 0 ${Math.round(blur * 1.6)}px ${color}33`;
      style.textShadow = style.textShadow
        ? `${style.textShadow}, ${glow}`
        : glow;
    }

    if (effects.gradient.enabled) {
      const angle = Number.isFinite(effects.gradient.angle)
        ? effects.gradient.angle
        : 90;
      const from =
        effects.gradient.from || colorSchemes[theme]?.[0] || "#3b82f6";
      const to = effects.gradient.to || colorSchemes[theme]?.[1] || "#ef4444";
      style.backgroundImage = `linear-gradient(${angle}deg, ${from}, ${to})`;
      style.WebkitBackgroundClip = "text";
      style.WebkitTextFillColor = "transparent";
      style.color = "transparent";
    } else {
      style.color = baseColor;
    }

    return style;
  };

  const setSelectedTextAlign = useMemo(
    () => (align: TextAlign) => {
      if (!selectedTextTarget) return;
      if (selectedTextTarget.type === "title") {
        setTitleAlign(align);
        return;
      }
      setLegendAlign(align);
    },
    [selectedTextTarget],
  );

  // Download chart as PNG
  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${chartTitle.replace(/\s+/g, "_")}.png`;
      link.href = url;
      link.click();
    }
  };

  const [borderWidth] = useState(2);
  const [opacity] = useState(0.8);

  // Helper: Transform data for scatter/bubble charts
  const transformToScatterData = () => {
    const colors =
      colorSchemes[selectedColorScheme] || colorSchemes.professional;

    if (chartType === "bubble") {
      const allValues = datasets.flatMap((ds) => ds.data);
      const maxValue = Math.max(...allValues.map((v) => Math.abs(v)));
      const minValue = Math.min(...allValues.map((v) => Math.abs(v)));
      const range = maxValue - minValue || 1;

      return datasets.map((dataset, idx) => {
        const color = colors[idx % colors.length];
        return {
          label: dataset.label,
          data: dataset.data.map((y: number, i: number) => {
            const normalizedValue = (Math.abs(y) - minValue) / range;
            const bubbleSize = 5 + normalizedValue * 10;

            return {
              x: i + 1,
              y: y,
              r: bubbleSize,
            };
          }),
          backgroundColor: color + "99",
          borderColor: color,
          borderWidth: 2,
          hoverBackgroundColor: color + "CC",
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
            y: y,
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
      const binIndex = Math.min(
        Math.floor((val - min) / binSize),
        binCount - 1,
      );
      bins[binIndex]++;
    });

    const colors =
      colorSchemes[selectedColorScheme] || colorSchemes.professional;
    return {
      labels: bins.map(
        (_, i) =>
          `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
      ),
      datasets: [
        {
          label: "Frequency",
          data: bins,
          backgroundColor: colors[0] + "CC",
          borderColor: colors[0],
          borderWidth: borderWidth,
        },
      ],
    };
  };

  // Helper: Transform data for waterfall
  const transformToWaterfallData = () => {
    const colors =
      colorSchemes[selectedColorScheme] || colorSchemes.professional;
    const waterfallData: number[] = [];
    const backgroundColors: string[] = [];
    let cumulative = 0;

    datasets[0]?.data.forEach((val: number) => {
      waterfallData.push(cumulative);
      waterfallData.push(val);
      cumulative += val;

      backgroundColors.push("transparent");
      backgroundColors.push(val >= 0 ? colors[1] : colors[2]);
    });

    return {
      labels: labels,
      datasets: [
        {
          label: datasets[0]?.label || "Values",
          data: waterfallData,
          backgroundColor: backgroundColors,
          borderColor: colors[0],
          borderWidth: borderWidth,
        },
      ],
    };
  };

  // Helper: Transform data for funnel
  const transformToFunnelData = () => {
    const sortedData = [...(datasets[0]?.data || [])].sort((a, b) => b - a);
    const colors =
      colorSchemes[selectedColorScheme] || colorSchemes.professional;

    return {
      labels: labels,
      datasets: [
        {
          label: datasets[0]?.label || "Values",
          data: sortedData,
          backgroundColor: sortedData.map(
            (_, idx) => colors[idx % colors.length] + "CC",
          ),
          borderColor: sortedData.map((_, idx) => colors[idx % colors.length]),
          borderWidth: borderWidth,
        },
      ],
    };
  };

  // Helper: Transform data for gauge
  const transformToGaugeData = () => {
    const allValues = datasets
      .flatMap((ds) => ds.data)
      .filter((v) => typeof v === "number");
    const value =
      allValues.length > 0
        ? allValues.reduce((a, b) => a + b, 0) / allValues.length
        : 0;
    const max = Math.max(...allValues, 100);
    const percentage = (value / max) * 100;

    let gaugeColor = "#dc2626";
    if (percentage >= 90) {
      gaugeColor = "#16a34a";
    } else if (percentage >= 75) {
      gaugeColor = "#84cc16";
    } else if (percentage >= 50) {
      gaugeColor = "#f59e0b";
    }

    return {
      labels: ["Value", "Remaining"],
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: [gaugeColor, "#e5e7eb"],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
        },
      ],
    };
  };

  // Handle style guide selection
  const handleSelectStyleGuide = async (styleGuide: any) => {
    setShowStyleGuideModal(false);
    showToast("Regenerating chart with selected style...");

    try {
      const currentChartData = {
        chartType,
        labels,
        datasets,
        chartTitle,
        showLegend,
        showGrid,
        selectedColorScheme,
      };

      if (generationId) {
        // Update existing chart
        const response = await api.post("/chart-generator/modify", {
          generationId,
          currentChart: currentChartData,
          styleGuideId: styleGuide.id,
          styleGuide: {
            name: styleGuide.name,
            primaryColor: styleGuide.primaryColor,
            secondaryColor: styleGuide.secondaryColor,
            accentColor: styleGuide.accentColor,
            backgroundColor: styleGuide.backgroundColor,
            textColor: styleGuide.textColor,
            fontFamily: styleGuide.fontFamily,
          },
          modifyPrompt: `Regenerate this chart using the "${styleGuide.name}" style guide.`,
        });

        if (response.data.success) {
          showToast("Chart regenerated successfully!");
          window.location.reload();
        }
      } else {
        // Generate new chart
        const response = await api.post("/chart-generator/generate", {
          prompt: `Generate a chart with this data using the "${styleGuide.name}" style guide`,
          chartData: currentChartData,
          styleGuideId: styleGuide.id,
          styleGuide: {
            name: styleGuide.name,
            primaryColor: styleGuide.primaryColor,
            secondaryColor: styleGuide.secondaryColor,
            accentColor: styleGuide.accentColor,
            backgroundColor: styleGuide.backgroundColor,
            textColor: styleGuide.textColor,
            fontFamily: styleGuide.fontFamily,
          },
        });

        if (response.data.success && response.data.generationId) {
          showToast("Chart generated successfully!");
          router.push(`/chart-editor?id=${response.data.generationId}`);
        }
      }
    } catch (error) {
      console.error("Error applying style guide:", error);
      showToast("Failed to apply style guide");
    }
  };

  // Load data from backend
  useEffect(() => {
    if (!generationId) {
      setLoading(false);
      return;
    }

    api
      .get(`/ai/generation/${generationId}`)
      .then((response) => {
        const content = response.data?.data?.result?.editorState;

        if (content?.chartState) {
          const state = content.chartState;
          setChartType(state.chartType || "bar");
          setLabels(state.labels || labels);
          setDatasets(state.datasets || datasets);
          setChartTitle(state.chartTitle || chartTitle);
          setShowLegend(state.showLegend ?? showLegend);
          setShowGrid(state.showGrid ?? showGrid);
          setSelectedColorScheme(
            state.selectedColorScheme || selectedColorScheme,
          );
          setTitleAlign(state.titleAlign || "center");
          setLegendAlign(state.legendAlign || "center");
          setTitleFormat(
            state.titleFormat || {
              bold: true,
              italic: false,
              underline: false,
            },
          );
          setLegendFormats(state.legendFormats || {});
          setTitleEffects(normalizeTextEffects(state.titleEffects));
          setLegendEffects(normalizeLegendEffects(state.legendEffects));
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
                  if (typeof cell.v === "string") {
                    extractedLabels.push(cell.v);
                  } else if (typeof cell.v === "number") {
                    extractedData.push(cell.v);
                  }
                }
              });
            });

            if (extractedLabels.length > 0) setLabels(extractedLabels);
            if (extractedData.length > 0) {
              setDatasets([{ label: "Data", data: extractedData }]);
            }
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load chart data:", error);
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
        const response = await api.get(
          `/collaborations/${generationId}/active-users`,
        );
        if (response.data.status === "success") {
          setActiveUsers(response.data.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch active users:", error);
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
        console.error("Failed to start collaboration session:", error);
      }
    };

    startSession();

    return () => {
      newProvider.destroy();
      api
        .post("/collaborations/session/end", { documentId: generationId })
        .catch(() => {});
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
          setSelectedColorScheme(
            state.selectedColorScheme || selectedColorScheme,
          );
          setTitleAlign(state.titleAlign || "center");
          setLegendAlign(state.legendAlign || "center");
          setTitleFormat(
            state.titleFormat || {
              bold: true,
              italic: false,
              underline: false,
            },
          );
          setLegendFormats(state.legendFormats || {});
          setTitleEffects(normalizeTextEffects(state.titleEffects));
          setLegendEffects(normalizeLegendEffects(state.legendEffects));
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
      titleAlign,
      legendAlign,
      titleFormat,
      legendFormats,
      titleEffects,
      legendEffects,
    };
    const json = JSON.stringify(state);
    const currentRemote = ymap.get("json") as string | undefined;

    if (json !== currentRemote) {
      ymap.set("json", json);
    }
  }, [
    provider,
    chartType,
    labels,
    datasets,
    chartTitle,
    showLegend,
    showGrid,
    selectedColorScheme,
    titleAlign,
    legendAlign,
    titleFormat,
    legendFormats,
    titleEffects,
    legendEffects,
    loading,
  ]);

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
          titleAlign,
          legendAlign,
          titleFormat,
          legendFormats,
          titleEffects,
          legendEffects,
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
  }, [
    generationId,
    chartType,
    labels,
    datasets,
    chartTitle,
    showLegend,
    showGrid,
    selectedColorScheme,
    titleAlign,
    legendAlign,
    titleFormat,
    legendFormats,
    titleEffects,
    legendEffects,
  ]);

  // Create store object for compatibility
  const store = useMemo(
    () => ({
      chartType,
      setChartType,
      activeTool,
      setActiveTool,
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
      selectedTextTarget,
      setSelectedTextTarget,
      getSelectedTextFormat,
      toggleTextFormat,
      setSelectedTextAlign,
      getSelectedTextEffects,
      toggleTextEffect,
      openStylePicker,
      openTableModal: () => setIsTableModalOpen(true),
      insertRow,
      insertColumn,
      openInsertPicker,
      showToast,
    }),
    [
      chartType,
      activeTool,
      labels,
      datasets,
      chartTitle,
      showLegend,
      showGrid,
      selectedColorScheme,
      selectedTextTarget,
      getSelectedTextFormat,
      getSelectedTextEffects,
      toggleTextFormat,
      toggleTextEffect,
      openStylePicker,
      setSelectedTextAlign,
      insertRow,
      insertColumn,
      openInsertPicker,
    ],
  );

  useEffect(() => {
    if (onStoreReady && store) {
      onStoreReady(store);
    }
  }, [store, onStoreReady]);

  // Apply color scheme
  const applyColorScheme = (datasets: any[]) => {
    const colors =
      colorSchemes[selectedColorScheme] || colorSchemes.professional;
    return datasets.map((dataset, i) => {
      const color = colors[i % colors.length];

      if (chartType === "area") {
        return {
          ...dataset,
          backgroundColor: color + "40",
          borderColor: color,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      }

      if (chartType === "line") {
        return {
          ...dataset,
          backgroundColor: color + "20",
          borderColor: color,
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      }

      if (["pie", "doughnut", "polarArea"].includes(chartType)) {
        return {
          ...dataset,
          backgroundColor: colors.map((c) => c + "CC"),
          borderColor: "#fff",
          borderWidth: 3,
          hoverOffset: 10,
        };
      }

      if (chartType === "radar") {
        return {
          ...dataset,
          backgroundColor: color + "30",
          borderColor: color,
          borderWidth: 2,
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: color,
        };
      }

      return {
        ...dataset,
        backgroundColor: color + "CC",
        borderColor: color,
        borderWidth: 2,
        borderRadius: 4,
      };
    });
  };

  const chartData = useMemo(() => {
    switch (chartType) {
      case "scatter":
      case "bubble":
        return { datasets: transformToScatterData() };
      case "histogram":
        return transformToHistogramData();
      case "waterfall":
        return transformToWaterfallData();
      case "funnel":
        return transformToFunnelData();
      case "gauge":
        return transformToGaugeData();
      default:
        return {
          labels: labels,
          datasets: applyColorScheme(datasets),
        };
    }
  }, [chartType, labels, datasets, selectedColorScheme, borderWidth, opacity]);

  const chartOptions = useMemo((): ChartOptions<any> => {
    const baseOptions: ChartOptions<any> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: "easeInOutQuart",
      },
      plugins: {
        legend: {
          display: false,
          position: "top" as const,
          labels: {
            font: {
              size: 14,
              family: "Hanken Grotesk, Inter, sans-serif",
              weight: "500",
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        title: {
          display: false,
          font: {
            size: 24,
            weight: "bold" as const,
            family: "Hanken Grotesk, Inter, sans-serif",
          },
          padding: { bottom: 20 },
          color: "#18181b",
        },
        tooltip: {
          enabled: chartType !== "gauge",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          titleFont: { size: 14, weight: "bold" as const },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
        },
      },
      scales: ["pie", "doughnut", "radar", "polarArea", "gauge"].includes(
        chartType,
      )
        ? undefined
        : {
            y: {
              beginAtZero: true,
              grid: {
                display: showGrid,
                color: "rgba(0, 0, 0, 0.06)",
                lineWidth: 1,
              },
              ticks: {
                font: { size: 12, family: "Hanken Grotesk, Inter, sans-serif" },
                color: "#4a5565",
                padding: 8,
              },
              border: {
                display: true,
                color: "#e5e7eb",
              },
            },
            x: {
              grid: {
                display: showGrid,
                color: "rgba(0, 0, 0, 0.06)",
                lineWidth: 1,
              },
              ticks: {
                font: { size: 12, family: "Hanken Grotesk, Inter, sans-serif" },
                color: "#4a5565",
                padding: 8,
              },
              border: {
                display: true,
                color: "#e5e7eb",
              },
            },
          },
    };

    // Special options for gauge
    if (chartType === "gauge") {
      baseOptions.circumference = 180;
      baseOptions.rotation = -90;
      baseOptions.cutout = "75%";
      if (baseOptions.plugins) {
        baseOptions.plugins.legend = { display: false };
        baseOptions.plugins.tooltip = { enabled: false };
      }
    }

    // Special options for radar
    if (chartType === "radar") {
      baseOptions.scales = {
        r: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            font: { size: 11 },
            backdropColor: "transparent",
          },
          pointLabels: {
            font: { size: 12, weight: "500" as const },
          },
        },
      };
    }

    return baseOptions;
  }, [chartType, chartTitle, showLegend, showGrid]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-900 text-xl font-semibold">
            Loading Chart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f3f4f6] flex flex-col relative">
      {toast && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-[100]">
          <p className="font-inter text-sm font-medium">{toast}</p>
        </div>
      )}

      {isTableModalOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100]"
          onMouseDown={() => setIsTableModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-[min(1100px,calc(100vw-32px))] max-h-[min(720px,calc(100vh-32px))] overflow-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-semibold text-[#18181b]">
                  Data Table
                </h3>
                <p className="text-[12px] text-[#71717a]">
                  Edit labels, series names, and values
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={insertRow}
                  className="h-[36px] px-3 rounded-md border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[13px] font-medium"
                >
                  Insert Row
                </button>
                <button
                  type="button"
                  onClick={insertColumn}
                  className="h-[36px] px-3 rounded-md border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[13px] font-medium"
                >
                  Insert Column
                </button>
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="h-[36px] px-3 rounded-md bg-[#18181b] text-white text-[13px] font-medium"
                >
                  Done
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white border-b border-[#e4e4e7] p-2 text-left text-[12px] text-[#71717a] min-w-[180px]">
                      Series / Labels
                    </th>
                    {labels.map((lbl, i) => (
                      <th
                        key={i}
                        className="border-b border-[#e4e4e7] p-2 min-w-[140px]"
                      >
                        <input
                          value={lbl}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLabels((prev) =>
                              prev.map((x, idx) => (idx === i ? v : x)),
                            );
                          }}
                          className="w-full text-[13px] font-medium text-[#18181b] border border-[#e4e4e7] rounded-md px-2 py-1 focus:outline-none"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((ds: any, dsIdx: number) => (
                    <tr key={dsIdx}>
                      <td className="sticky left-0 bg-white border-b border-[#e4e4e7] p-2 min-w-[180px]">
                        <input
                          value={ds.label}
                          onChange={(e) => {
                            const v = e.target.value;
                            setDatasets((prev) =>
                              prev.map((d, i) =>
                                i === dsIdx ? { ...d, label: v } : d,
                              ),
                            );
                          }}
                          className="w-full text-[13px] font-semibold text-[#18181b] border border-[#e4e4e7] rounded-md px-2 py-1 focus:outline-none"
                        />
                      </td>
                      {labels.map((_, xIdx) => (
                        <td
                          key={xIdx}
                          className="border-b border-[#e4e4e7] p-2"
                        >
                          <input
                            type="number"
                            value={ds.data?.[xIdx] ?? 0}
                            onChange={(e) => {
                              const nextVal = Number(e.target.value);
                              setDatasets((prev) =>
                                prev.map((d, i) => {
                                  if (i !== dsIdx) return d;
                                  const next = Array.isArray(d.data)
                                    ? [...d.data]
                                    : [];
                                  while (next.length < labels.length)
                                    next.push(0);
                                  next[xIdx] = Number.isFinite(nextVal)
                                    ? nextVal
                                    : 0;
                                  return { ...d, data: next };
                                }),
                              );
                            }}
                            className="w-full text-[13px] text-[#18181b] border border-[#e4e4e7] rounded-md px-2 py-1 focus:outline-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {insertPicker.open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100]"
          onMouseDown={() => setInsertPicker({ open: false, kind: null })}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-[min(900px,calc(100vw-32px))] max-h-[min(680px,calc(100vh-32px))] overflow-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-semibold text-[#18181b]">
                  {insertPicker.kind === "shapes"
                    ? "Shapes"
                    : insertPicker.kind === "icons"
                      ? "Icons"
                      : insertPicker.kind === "symbols"
                        ? "Symbols"
                        : "Link"}
                </h3>
                <p className="text-[12px] text-[#71717a]">
                  Inserts at the current cursor position
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInsertPicker({ open: false, kind: null })}
                className="h-[36px] px-3 rounded-md border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[13px] font-medium"
              >
                Close
              </button>
            </div>

            {insertPicker.kind === "link" ? (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#52525b] mb-1">
                    Text
                  </label>
                  <input
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Optional display text"
                    className="w-full h-[40px] border border-[#e4e4e7] rounded-md px-3 text-[14px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#52525b] mb-1">
                    URL
                  </label>
                  <input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full h-[40px] border border-[#e4e4e7] rounded-md px-3 text-[14px] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInsertPicker({ open: false, kind: null })}
                    className="h-[40px] px-4 rounded-md border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[14px] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = linkUrl.trim();
                      const text = linkText.trim();
                      if (!url && !text) {
                        showToast("Enter a link");
                        return;
                      }
                      const insertion =
                        text && url ? `${text} (${url})` : text || url;
                      insertIntoActiveText(insertion);
                      setInsertPicker({ open: false, kind: null });
                    }}
                    className="h-[40px] px-4 rounded-md bg-[#18181b] text-white text-[14px] font-medium"
                  >
                    Insert
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {(insertPicker.kind === "shapes"
                  ? SHAPES
                  : insertPicker.kind === "icons"
                    ? ICONS
                    : SYMBOLS
                ).map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      insertIntoActiveText(item.value);
                      setInsertPicker({ open: false, kind: null });
                    }}
                    className="border border-[#e4e4e7] rounded-lg p-3 hover:bg-[#f4f4f5] transition-colors text-left"
                  >
                    <div className="text-[20px] leading-none">{item.value}</div>
                    <div className="mt-2 text-[12px] text-[#52525b] font-medium truncate">
                      {item.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {stylePicker.open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100]"
          onMouseDown={() => setStylePicker({ open: false, kind: null })}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-[min(920px,calc(100vw-32px))] max-h-[min(720px,calc(100vh-32px))] overflow-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-semibold text-[#18181b]">
                  {stylePicker.kind === "insert-style"
                    ? "Insert Style"
                    : stylePicker.kind === "theme"
                      ? "Select Theme"
                      : stylePicker.kind === "shadow"
                        ? "Shadow"
                        : stylePicker.kind === "outline"
                          ? "Outline"
                          : stylePicker.kind === "glow"
                            ? "Glow"
                            : "Gradient"}
                </h3>
                <p className="text-[12px] text-[#71717a]">
                  {stylePicker.kind === "theme"
                    ? "Applies to the chart"
                    : "Applies to the selected text (title or legend)"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStylePicker({ open: false, kind: null })}
                className="h-[36px] px-3 rounded-md border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[13px] font-medium"
              >
                Close
              </button>
            </div>

            {stylePicker.kind === "theme" && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(
                  Object.keys(colorSchemes) as Array<keyof typeof colorSchemes>
                ).map((themeKey) => (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => {
                      setSelectedColorScheme(themeKey);
                      setStylePicker({ open: false, kind: null });
                    }}
                    className={`border rounded-xl p-4 text-left hover:bg-[#f4f4f5] transition-colors ${
                      selectedColorScheme === themeKey
                        ? "border-[#18181b]"
                        : "border-[#e4e4e7]"
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-[#18181b] capitalize">
                      {String(themeKey)}
                    </div>
                    <div className="mt-3 flex gap-2">
                      {colorSchemes[themeKey].slice(0, 5).map((c) => (
                        <span
                          key={c}
                          className="w-6 h-6 rounded-full border border-[#e4e4e7]"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {stylePicker.kind === "insert-style" && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: "clean", label: "Clean", desc: "No effects" },
                  {
                    id: "shadow_soft",
                    label: "Soft Shadow",
                    desc: "Subtle depth",
                  },
                  {
                    id: "shadow_hard",
                    label: "Hard Shadow",
                    desc: "Strong depth",
                  },
                  {
                    id: "outline_medium",
                    label: "Outline",
                    desc: "Medium stroke",
                  },
                  { id: "glow_strong", label: "Glow", desc: "Strong glow" },
                  { id: "gradient", label: "Gradient", desc: "Two-color fill" },
                  { id: "neon", label: "Neon", desc: "Glow + outline" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      applyInsertStylePreset(p.id);
                      setStylePicker({ open: false, kind: null });
                    }}
                    className="border border-[#e4e4e7] rounded-xl p-4 text-left hover:bg-[#f4f4f5] transition-colors"
                  >
                    <div className="text-[13px] font-semibold text-[#18181b]">
                      {p.label}
                    </div>
                    <div className="mt-1 text-[12px] text-[#71717a]">
                      {p.desc}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {stylePicker.kind === "shadow" && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "none" as ShadowPreset, label: "None" },
                  { id: "soft" as ShadowPreset, label: "Soft" },
                  { id: "medium" as ShadowPreset, label: "Medium" },
                  { id: "hard" as ShadowPreset, label: "Hard" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      applyShadowPreset(p.id);
                      setStylePicker({ open: false, kind: null });
                    }}
                    className="border border-[#e4e4e7] rounded-lg p-3 hover:bg-[#f4f4f5] transition-colors text-left"
                  >
                    <div className="text-[13px] font-semibold text-[#18181b]">
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {stylePicker.kind === "outline" && (
              <div className="mt-5">
                <div className="flex items-center gap-3">
                  <div className="text-[12px] text-[#52525b] font-medium">
                    Color
                  </div>
                  <input
                    type="color"
                    value={
                      (getSelectedTextEffects() || defaultTextEffects).outline
                        .color
                    }
                    onChange={(e) =>
                      updateSelectedEffects((prev) => ({
                        ...prev,
                        outline: { ...prev.outline, color: e.target.value },
                      }))
                    }
                    className="h-9 w-12 border border-[#e4e4e7] rounded-md"
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "none" as OutlinePreset, label: "None" },
                    { id: "thin" as OutlinePreset, label: "Thin" },
                    { id: "medium" as OutlinePreset, label: "Medium" },
                    { id: "thick" as OutlinePreset, label: "Thick" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        applyOutlinePreset(p.id);
                        setStylePicker({ open: false, kind: null });
                      }}
                      className="border border-[#e4e4e7] rounded-lg p-3 hover:bg-[#f4f4f5] transition-colors text-left"
                    >
                      <div className="text-[13px] font-semibold text-[#18181b]">
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stylePicker.kind === "glow" && (
              <div className="mt-5">
                <div className="flex items-center gap-3">
                  <div className="text-[12px] text-[#52525b] font-medium">
                    Color
                  </div>
                  <input
                    type="color"
                    value={
                      (getSelectedTextEffects() || defaultTextEffects).glow
                        .color
                    }
                    onChange={(e) =>
                      updateSelectedEffects((prev) => ({
                        ...prev,
                        glow: { ...prev.glow, color: e.target.value },
                      }))
                    }
                    className="h-9 w-12 border border-[#e4e4e7] rounded-md"
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "none" as GlowPreset, label: "None" },
                    { id: "soft" as GlowPreset, label: "Soft" },
                    { id: "medium" as GlowPreset, label: "Medium" },
                    { id: "strong" as GlowPreset, label: "Strong" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        applyGlowPreset(p.id);
                        setStylePicker({ open: false, kind: null });
                      }}
                      className="border border-[#e4e4e7] rounded-lg p-3 hover:bg-[#f4f4f5] transition-colors text-left"
                    >
                      <div className="text-[13px] font-semibold text-[#18181b]">
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stylePicker.kind === "gradient" && (
              <div className="mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[#52525b] mb-1">
                      From
                    </label>
                    <input
                      type="color"
                      value={gradientDraft.from}
                      onChange={(e) =>
                        setGradientDraft((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                      className="h-10 w-full border border-[#e4e4e7] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#52525b] mb-1">
                      To
                    </label>
                    <input
                      type="color"
                      value={gradientDraft.to}
                      onChange={(e) =>
                        setGradientDraft((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                      className="h-10 w-full border border-[#e4e4e7] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#52525b] mb-1">
                      Angle
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={gradientDraft.angle}
                      onChange={(e) =>
                        setGradientDraft((prev) => ({
                          ...prev,
                          angle: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <div className="text-[12px] text-[#71717a] mt-1">
                      {gradientDraft.angle}°
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 border border-[#e4e4e7] rounded-xl">
                  <div
                    className="text-[20px] font-semibold"
                    style={{
                      backgroundImage: `linear-gradient(${gradientDraft.angle}deg, ${gradientDraft.from}, ${gradientDraft.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    Gradient Preview
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      applyGradient(
                        false,
                        gradientDraft.from,
                        gradientDraft.to,
                        gradientDraft.angle,
                      );
                      setStylePicker({ open: false, kind: null });
                    }}
                    className="h-[40px] px-4 rounded-md border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[14px] font-medium"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applyGradient(
                        true,
                        gradientDraft.from,
                        gradientDraft.to,
                        gradientDraft.angle,
                      );
                      setStylePicker({ open: false, kind: null });
                    }}
                    className="h-[40px] px-4 rounded-md bg-[#18181b] text-white text-[14px] font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                    : user.users?.email || "U")[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <span className="text-xs text-blue-700">
            Changes sync automatically
          </span>
        </div>
      )}

      {/* Main Chart Canvas Area */}
      <div
        className={`flex-1 flex items-center justify-center bg-[#e7e7e7] overflow-hidden ${activeUsers.length > 0 ? "pt-12" : ""}`}
      >
        <div className="w-full h-full max-w-6xl p-8">
          <div
            className="bg-white rounded-2xl shadow-lg p-10 h-full flex flex-col"
            onMouseDown={() => setSelectedTextTarget(null)}
          >
            <div className="shrink-0">
              <div
                ref={titleElRef}
                contentEditable
                suppressContentEditableWarning
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedTextTarget({ type: "title" });
                  setTitleCaret(getCaretOffset(titleElRef.current));
                }}
                onFocus={() => setSelectedTextTarget({ type: "title" })}
                onMouseUp={() =>
                  setTitleCaret(getCaretOffset(titleElRef.current))
                }
                onKeyUp={() =>
                  setTitleCaret(getCaretOffset(titleElRef.current))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    (e.currentTarget as HTMLDivElement).blur();
                  }
                }}
                onBlur={(e) => {
                  const next = (e.currentTarget.textContent || "").trim();
                  if (next.length > 0) setChartTitle(next);
                }}
                className={`text-[24px] leading-[32px] tracking-[-0.2px] text-[#18181b] focus:outline-none ${
                  titleAlign === "left"
                    ? "text-left"
                    : titleAlign === "right"
                      ? "text-right"
                      : "text-center"
                } ${titleFormat.bold ? "font-bold" : "font-semibold"} ${
                  titleFormat.italic ? "italic" : ""
                } ${titleFormat.underline ? "underline" : ""} ${
                  selectedTextTarget?.type === "title"
                    ? "ring-2 ring-[#18181b] rounded-md px-2 py-1 -mx-2 -my-1"
                    : ""
                }`}
                style={getTextStyleForEffects(
                  titleEffects,
                  selectedColorScheme as ChartTheme,
                  "title",
                )}
              >
                {chartTitle}
              </div>

              {showLegend && chartType !== "gauge" && datasets.length > 0 && (
                <div
                  className={`mt-4 flex items-center gap-6 ${
                    legendAlign === "left"
                      ? "justify-start"
                      : legendAlign === "right"
                        ? "justify-end"
                        : "justify-center"
                  }`}
                >
                  {datasets.map((ds, idx) => {
                    const colors =
                      colorSchemes[selectedColorScheme] ||
                      colorSchemes.professional;
                    const color = colors[idx % colors.length];
                    const fmt = getLegendFormat(idx);
                    const isSelected =
                      selectedTextTarget?.type === "legend" &&
                      selectedTextTarget.datasetIndex === idx;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span
                          ref={(el) => {
                            legendElRefs.current[idx] = el;
                          }}
                          contentEditable
                          suppressContentEditableWarning
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setSelectedTextTarget({
                              type: "legend",
                              datasetIndex: idx,
                            });
                            setLegendCarets((prev) => ({
                              ...prev,
                              [idx]:
                                getCaretOffset(legendElRefs.current[idx]) ??
                                prev[idx] ??
                                0,
                            }));
                          }}
                          onFocus={() =>
                            setSelectedTextTarget({
                              type: "legend",
                              datasetIndex: idx,
                            })
                          }
                          onMouseUp={() =>
                            setLegendCarets((prev) => ({
                              ...prev,
                              [idx]:
                                getCaretOffset(legendElRefs.current[idx]) ??
                                prev[idx] ??
                                0,
                            }))
                          }
                          onKeyUp={() =>
                            setLegendCarets((prev) => ({
                              ...prev,
                              [idx]:
                                getCaretOffset(legendElRefs.current[idx]) ??
                                prev[idx] ??
                                0,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              (e.currentTarget as HTMLSpanElement).blur();
                            }
                          }}
                          onBlur={(e) => {
                            const next = (
                              e.currentTarget.textContent || ""
                            ).trim();
                            if (!next) return;
                            setDatasets((prev) =>
                              prev.map((d, i) =>
                                i === idx ? { ...d, label: next } : d,
                              ),
                            );
                          }}
                          className={`text-[13px] leading-[18px] text-[#52525b] focus:outline-none ${
                            fmt.bold ? "font-semibold" : "font-medium"
                          } ${fmt.italic ? "italic" : ""} ${
                            fmt.underline ? "underline" : ""
                          } ${
                            isSelected
                              ? "ring-2 ring-[#18181b] rounded-md px-2 py-1 -mx-2 -my-1"
                              : ""
                          }`}
                          style={getTextStyleForEffects(
                            getLegendEffects(idx),
                            selectedColorScheme as ChartTheme,
                            "legend",
                          )}
                        >
                          {ds.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div ref={chartStageRef} className="flex-1 min-h-0 mt-6 relative">
              {chartType === "bar" && (
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === "horizontalBar" && (
                <Bar
                  ref={chartRef}
                  data={chartData}
                  options={{ ...chartOptions, indexAxis: "y" as const }}
                />
              )}
              {chartType === "line" && (
                <Line ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === "area" && (
                <Line ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === "pie" && (
                <Pie ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === "doughnut" && (
                <Doughnut
                  ref={chartRef}
                  data={chartData}
                  options={chartOptions}
                />
              )}
              {chartType === "radar" && (
                <Radar ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === "polarArea" && (
                <PolarArea
                  ref={chartRef}
                  data={chartData}
                  options={chartOptions}
                />
              )}
              {chartType === "scatter" && (
                <Scatter
                  ref={chartRef}
                  data={chartData}
                  options={chartOptions}
                />
              )}
              {chartType === "bubble" && (
                <Bubble
                  ref={chartRef}
                  data={chartData}
                  options={chartOptions}
                />
              )}
              {chartType === "histogram" && (
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === "boxplot" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <Bar
                      ref={chartRef}
                      data={chartData}
                      options={{ ...chartOptions, indexAxis: "y" as const }}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                    <p className="font-semibold mb-2">Statistical Summary:</p>
                    {datasets.map((ds, idx) => {
                      const sorted = [...ds.data].sort((a, b) => a - b);
                      const n = sorted.length;
                      const min = sorted[0];
                      const max = sorted[n - 1];
                      const median =
                        n % 2 === 0
                          ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
                          : sorted[Math.floor(n / 2)];
                      const mean = sorted.reduce((a, b) => a + b, 0) / n;
                      return (
                        <div key={idx} className="mb-2 text-xs">
                          <strong>{ds.label}:</strong> Min: {min.toFixed(2)},
                          Q1: {sorted[Math.floor(n * 0.25)].toFixed(2)}, Median:{" "}
                          {median.toFixed(2)}, Q3:{" "}
                          {sorted[Math.floor(n * 0.75)].toFixed(2)}, Max:{" "}
                          {max.toFixed(2)}, Mean: {mean.toFixed(2)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {chartType === "waterfall" && (
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              )}
              {chartType === "funnel" && (
                <Bar
                  ref={chartRef}
                  data={chartData}
                  options={{ ...chartOptions, indexAxis: "y" as const }}
                />
              )}
              {chartType === "gauge" && (
                <div className="flex flex-col items-center justify-center h-full relative">
                  <div className="relative w-full max-w-md">
                    <Doughnut
                      ref={chartRef}
                      data={chartData}
                      options={chartOptions}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ top: "25%" }}
                    >
                      <div className="text-center">
                        <div
                          className="text-5xl font-bold"
                          style={{
                            color: chartData.datasets[0].backgroundColor[0],
                          }}
                        >
                          {chartData.datasets[0].data[0].toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {chartData.datasets[0].data[0] >= 90
                            ? "Excellent"
                            : chartData.datasets[0].data[0] >= 75
                              ? "Good"
                              : chartData.datasets[0].data[0] >= 50
                                ? "Fair"
                                : "Critical"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {chartType === "gantt" && (
                <div className="flex items-center justify-center h-full">
                  <Bar
                    ref={chartRef}
                    data={chartData}
                    options={{ ...chartOptions, indexAxis: "y" as const }}
                  />
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
        onInsertTheme={() => setShowStyleGuideModal(true)}
      />

      {/* Style Guide Modal */}
      <StyleGuideModal
        isOpen={showStyleGuideModal}
        onClose={() => setShowStyleGuideModal(false)}
        onSelect={handleSelectStyleGuide}
        editorType="chart"
      />
    </div>
  );
}
