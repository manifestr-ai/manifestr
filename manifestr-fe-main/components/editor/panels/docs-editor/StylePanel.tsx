import React, { useMemo, useState } from "react";
import { FileText, Palette, Droplet, Grid3x3, Layers, Square, Sparkles, Droplets, RotateCcw, X } from "lucide-react";

interface StylePanelProps {
  store?: any;
  editor?: any;
}

export default function StylePanel({ store, editor }: StylePanelProps) {

  // State
  const [toast, setToast] = useState<string | null>(null);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [currentTheme, setCurrentTheme] = useState("default");
  const [activeEffectPicker, setActiveEffectPicker] = useState<null | "shadow" | "outline" | "glow" | "gradient">(null);

  // Toast notification helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // Insert Style Templates
  const handleInsertStyle = () => {
    setShowStyleModal(true);
  };

  const applyStyle = (styleType: string) => {
    if (!editor) return;

    const styles = {
      professional: {
        html: '<h1 style="font-size: 28px; font-weight: 700; color: #1e40af; margin-bottom: 16px;">Professional Heading</h1><p style="font-size: 16px; line-height: 1.6; color: #374151;">Professional paragraph style with clean formatting.</p>',
        name: 'Professional'
      },
      creative: {
        html: '<h1 style="font-size: 32px; font-weight: 800; background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px;">Creative Heading</h1><p style="font-size: 16px; line-height: 1.8; color: #6b7280; font-style: italic;">Creative paragraph with artistic flair.</p>',
        name: 'Creative'
      },
      minimal: {
        html: '<h1 style="font-size: 24px; font-weight: 600; color: #000000; margin-bottom: 12px; letter-spacing: -0.5px;">Minimal Heading</h1><p style="font-size: 15px; line-height: 1.5; color: #52525b;">Minimal clean paragraph.</p>',
        name: 'Minimal'
      },
      bold: {
        html: '<h1 style="font-size: 36px; font-weight: 900; color: #000000; text-transform: uppercase; margin-bottom: 16px;">Bold Heading</h1><p style="font-size: 18px; line-height: 1.6; color: #18181b; font-weight: 600;">Bold impactful paragraph.</p>',
        name: 'Bold Impact'
      }
    };

    if (styles[styleType]) {
      editor.chain().focus().insertContent(styles[styleType].html).run();
      showToast(`${styles[styleType].name} style inserted`);
      setShowStyleModal(false);
    }
  };

  // Select Theme
  const handleSelectTheme = () => {
    setShowThemeModal(true);
  };

  const applyTheme = (theme: string) => {
    if (!editor) return;
    setCurrentTheme(theme);

    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (!editorElement) return;

    const themes = {
      default: {
        bg: '#ffffff',
        color: '#000000',
        name: 'Default'
      },
      dark: {
        bg: '#1f2937',
        color: '#f9fafb',
        name: 'Dark Mode'
      },
      sepia: {
        bg: '#fef3e2',
        color: '#78350f',
        name: 'Sepia'
      },
      nord: {
        bg: '#eceff4',
        color: '#2e3440',
        name: 'Nord'
      },
      nature: {
        bg: '#f0fdf4',
        color: '#14532d',
        name: 'Nature'
      }
    };

    if (themes[theme]) {
      editorElement.style.backgroundColor = themes[theme].bg;
      editorElement.style.color = themes[theme].color;
      showToast(`Theme: ${themes[theme].name}`);
      setShowThemeModal(false);
    }
  };

  // Background Color
  const handleBackgroundColor = () => {
    setShowColorModal(true);
  };

  const applyBackgroundColor = (color: string) => {
    if (!editor) return;
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      editorElement.style.backgroundColor = color;
      setBgColor(color);
      showToast('Background color applied');
      setShowColorModal(false);
    }
  };

  // Background Pattern
  const handlePattern = () => {
    setShowPatternModal(true);
  };

  const applyPattern = (pattern: string) => {
    if (!editor) return;
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (!editorElement) return;

    const patterns = {
      dots: {
        bg: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        size: '20px 20px',
        name: 'Dots'
      },
      grid: {
        bg: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)',
        size: '20px 20px',
        name: 'Grid'
      },
      lines: {
        bg: 'repeating-linear-gradient(0deg, #f3f4f6, #f3f4f6 1px, transparent 1px, transparent 20px)',
        size: 'auto',
        name: 'Lines'
      },
      diagonal: {
        bg: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)',
        size: 'auto',
        name: 'Diagonal'
      }
    };

    if (patterns[pattern]) {
      editorElement.style.backgroundImage = patterns[pattern].bg;
      editorElement.style.backgroundSize = patterns[pattern].size;
      showToast(`Pattern: ${patterns[pattern].name}`);
      setShowPatternModal(false);
    }
  };

  type EffectKind = "shadow" | "outline" | "glow" | "gradient";
  type EffectPreset = string;

  const focusEditor = () => {
    if (!editor) return;
    try {
      if (typeof editor?.chain === "function") {
        const chain = editor.chain();
        if (typeof chain?.focus === "function") {
          const maybe = chain.focus();
          if (maybe && typeof maybe.run === "function") maybe.run();
          return;
        }
      }
    } catch {}

    const el = document.querySelector(".ProseMirror") as HTMLElement | null;
    el?.focus?.();
  };

  const getOutlineParts = (p: string) => {
    const parsed = String(p || "").toLowerCase();
    const color =
      parsed.includes("white") ? "#ffffff" : parsed.includes("blue") ? "#2563eb" : "#000000";
    const w = parsed.includes("thick") ? 3 : parsed.includes("medium") ? 2 : 1;
    return { w, color };
  };

  const getGlowColor = (p: string) => {
    const parsed = String(p || "").toLowerCase();
    if (parsed.includes("cyan")) return "#06b6d4";
    if (parsed.includes("green")) return "#22c55e";
    if (parsed.includes("pink")) return "#ec4899";
    if (parsed.includes("purple")) return "#8b5cf6";
    if (parsed.includes("orange")) return "#f97316";
    return "#3b82f6";
  };

  const getGradient = (p: string) => {
    const parsed = String(p || "").toLowerCase();
    if (parsed.includes("ocean")) return "linear-gradient(to right, #06b6d4, #2563eb)";
    if (parsed.includes("purple")) return "linear-gradient(to right, #ec4899, #8b5cf6)";
    if (parsed.includes("lime")) return "linear-gradient(to right, #a3e635, #22c55e)";
    if (parsed.includes("fire")) return "linear-gradient(to right, #f97316, #dc2626)";
    if (parsed.includes("neon")) return "linear-gradient(to right, #22c55e, #06b6d4, #2563eb)";
    return "linear-gradient(to right, #f97316, #dc2626)";
  };

  const getShadow = (p: string) => {
    const parsed = String(p || "").toLowerCase();
    if (parsed.includes("subtle")) return "0 1px 1px rgba(0,0,0,0.18)";
    if (parsed.includes("medium")) return "2px 4px 8px rgba(0,0,0,0.28)";
    if (parsed.includes("hard")) return "3px 3px 0 rgba(0,0,0,0.35)";
    if (parsed.includes("long")) return "0 10px 14px rgba(0,0,0,0.28)";
    if (parsed.includes("dramatic")) return "0 18px 24px rgba(0,0,0,0.35)";
    return "1px 2px 4px rgba(0,0,0,0.25)";
  };

  const applyTextEffectDOM = (kind: EffectKind, preset: EffectPreset) => {
    const root = document.querySelector(".ProseMirror") as HTMLElement | null;
    if (!root) return false;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return false;

    const anchorEl =
      (selection.anchorNode &&
        (selection.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (selection.anchorNode as HTMLElement)
          : (selection.anchorNode as any).parentElement)) ||
      null;
    if (!anchorEl || !root.contains(anchorEl)) return false;

    const existing = anchorEl.closest?.(`span[data-doc-effect="${kind}"]`) as HTMLElement | null;
    const wrapper = existing && root.contains(existing) ? existing : document.createElement("span");
    wrapper.setAttribute("data-doc-effect", kind);
    wrapper.setAttribute("data-doc-effect-preset", preset);

    const applyStyles = () => {
      wrapper.style.textShadow = "";
      wrapper.style.fontWeight = "";
      wrapper.style.color = "";
      wrapper.style.background = "";
      (wrapper.style as any).webkitBackgroundClip = "";
      wrapper.style.backgroundClip = "";
      (wrapper.style as any).webkitTextFillColor = "";

      if (kind === "shadow") {
        wrapper.style.textShadow = getShadow(preset);
      } else if (kind === "outline") {
        const { w, color } = getOutlineParts(preset);
        wrapper.style.textShadow = [
          `-${w}px -${w}px 0 ${color}`,
          `${w}px -${w}px 0 ${color}`,
          `-${w}px ${w}px 0 ${color}`,
          `${w}px ${w}px 0 ${color}`,
        ].join(", ");
        wrapper.style.fontWeight = "700";
      } else if (kind === "glow") {
        const color = getGlowColor(preset);
        wrapper.style.textShadow = `0 0 8px ${color}, 0 0 18px ${color}`;
        wrapper.style.color = color;
        wrapper.style.fontWeight = "600";
      } else if (kind === "gradient") {
        const gradient = getGradient(preset);
        wrapper.style.background = gradient;
        (wrapper.style as any).webkitBackgroundClip = "text";
        wrapper.style.backgroundClip = "text";
        (wrapper.style as any).webkitTextFillColor = "transparent";
        wrapper.style.color = "transparent";
        wrapper.style.fontWeight = "700";
      }
    };

    applyStyles();

    if (existing && root.contains(existing)) {
      return true;
    }

    const frag = range.extractContents();
    wrapper.appendChild(frag);
    range.insertNode(wrapper);
    selection.removeAllRanges();
    const nextRange = document.createRange();
    nextRange.selectNodeContents(wrapper);
    nextRange.collapse(false);
    selection.addRange(nextRange);
    return true;
  };

  const removeEffectDOM = (kind: EffectKind) => {
    const root = document.querySelector(".ProseMirror") as HTMLElement | null;
    if (!root) return false;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);

    const anchorEl =
      (selection.anchorNode &&
        (selection.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (selection.anchorNode as HTMLElement)
          : (selection.anchorNode as any).parentElement)) ||
      null;
    if (!anchorEl || !root.contains(anchorEl)) return false;

    const direct = anchorEl.closest?.(`span[data-doc-effect="${kind}"]`) as HTMLElement | null;
    if (direct && root.contains(direct)) {
      const parent = direct.parentNode;
      if (!parent) return true;
      while (direct.firstChild) parent.insertBefore(direct.firstChild, direct);
      parent.removeChild(direct);
      root.normalize();
      return true;
    }

    if (range.collapsed) return false;

    const container =
      (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement) || root;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (n: Node) => {
        const el = n as HTMLElement;
        if (el.tagName !== "SPAN") return NodeFilter.FILTER_SKIP;
        if (el.getAttribute("data-doc-effect") !== kind) return NodeFilter.FILTER_SKIP;
        try {
          const elRange = document.createRange();
          elRange.selectNodeContents(el);
          const intersects =
            range.compareBoundaryPoints(Range.END_TO_START, elRange) < 0 &&
            range.compareBoundaryPoints(Range.START_TO_END, elRange) > 0;
          return intersects ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        } catch {
          return NodeFilter.FILTER_SKIP;
        }
      },
    } as any);

    const toUnwrap: HTMLElement[] = [];
    while (walker.nextNode()) toUnwrap.push(walker.currentNode as HTMLElement);
    if (!toUnwrap.length) return false;

    toUnwrap.forEach((el) => {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    });
    root.normalize();
    return true;
  };

  const resetEffectsDOM = () => {
    const root = document.querySelector(".ProseMirror") as HTMLElement | null;
    if (!root) return false;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);

    const anchorEl =
      (selection.anchorNode &&
        (selection.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (selection.anchorNode as HTMLElement)
          : (selection.anchorNode as any).parentElement)) ||
      null;
    if (!anchorEl || !root.contains(anchorEl)) return false;

    const direct = anchorEl.closest?.(`span[data-doc-effect]`) as HTMLElement | null;
    if (direct && root.contains(direct)) {
      const parent = direct.parentNode;
      if (!parent) return true;
      while (direct.firstChild) parent.insertBefore(direct.firstChild, direct);
      parent.removeChild(direct);
      root.normalize();
      return true;
    }

    if (range.collapsed) return false;

    const container =
      (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement) || root;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (n: Node) => {
        const el = n as HTMLElement;
        if (el.tagName !== "SPAN") return NodeFilter.FILTER_SKIP;
        if (!el.getAttribute("data-doc-effect")) return NodeFilter.FILTER_SKIP;
        try {
          const elRange = document.createRange();
          elRange.selectNodeContents(el);
          const intersects =
            range.compareBoundaryPoints(Range.END_TO_START, elRange) < 0 &&
            range.compareBoundaryPoints(Range.START_TO_END, elRange) > 0;
          return intersects ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        } catch {
          return NodeFilter.FILTER_SKIP;
        }
      },
    } as any);

    const toUnwrap: HTMLElement[] = [];
    while (walker.nextNode()) toUnwrap.push(walker.currentNode as HTMLElement);
    if (!toUnwrap.length) return false;

    toUnwrap.forEach((el) => {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    });
    root.normalize();
    return true;
  };

  const applyTextEffect = (kind: EffectKind, preset: EffectPreset) => {
    if (!editor) return;
    focusEditor();

    const isTiptap =
      typeof editor?.commands?.focus === "function" &&
      !!editor?.state?.selection &&
      !!editor?.state?.doc;

    if (isTiptap) {
      const { from, to } = editor.state.selection;
      if (from === to) {
        showToast("Select text to apply effect");
        return;
      }

      const text = editor.state.doc.textBetween(from, to, " ");
      const shadowCss = getShadow(preset);
      const outline = getOutlineParts(preset);
      const glowColor = getGlowColor(preset);
      const gradientCss = getGradient(preset);

      const style =
        kind === "shadow"
          ? `text-shadow: ${shadowCss};`
          : kind === "outline"
            ? `text-shadow: -${outline.w}px -${outline.w}px 0 ${outline.color}, ${outline.w}px -${outline.w}px 0 ${outline.color}, -${outline.w}px ${outline.w}px 0 ${outline.color}, ${outline.w}px ${outline.w}px 0 ${outline.color}; font-weight: 700;`
            : kind === "glow"
              ? `text-shadow: 0 0 8px ${glowColor}, 0 0 18px ${glowColor}; color: ${glowColor}; font-weight: 600;`
              : `background: ${gradientCss}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;`;

      const styledText = `<span data-doc-effect="${kind}" data-doc-effect-preset="${preset}" style="${style}">${text}</span>`;
      editor.chain().focus().deleteSelection().insertContent(styledText).run();
      showToast(`Text ${kind} applied`);
      return;
    }

    const ok = applyTextEffectDOM(kind, preset);
    if (!ok) {
      showToast("Select text to apply effect");
      return;
    }
    showToast(`Text ${kind} applied`);
  };

  // Text Effects - Outline
  const handleOutline = () => {
    setActiveEffectPicker("outline");
  };

  // Text Effects - Glow
  const handleGlow = () => {
    setActiveEffectPicker("glow");
  };

  // Text Effects - Gradient
  const handleGradient = () => {
    setActiveEffectPicker("gradient");
  };

  const handleShadow = () => {
    setActiveEffectPicker("shadow");
  };

  const handleResetEffects = () => {
    if (!editor) return;
    focusEditor();

    const isTiptap =
      typeof editor?.commands?.focus === "function" &&
      !!editor?.state?.selection &&
      !!editor?.state?.doc;

    if (isTiptap) {
      const { from, to } = editor.state.selection;
      if (from === to) {
        showToast("Select text to reset effects");
        return;
      }
      const text = editor.state.doc.textBetween(from, to, " ");
      editor.chain().focus().deleteSelection().insertContent(text).run();
      showToast("Effects reset");
      return;
    }

    const ok = resetEffectsDOM();
    if (!ok) {
      showToast("Select text to reset effects");
      return;
    }
    showToast("Effects reset");
  };

  const effectOptions = useMemo(() => {
    const base = {
      shadow: [
        { preset: "subtle" as const, label: "Subtle" },
        { preset: "soft" as const, label: "Soft" },
        { preset: "medium" as const, label: "Medium" },
        { preset: "hard" as const, label: "Hard" },
        { preset: "long" as const, label: "Long" },
        { preset: "dramatic" as const, label: "Dramatic" },
      ],
      outline: [
        { preset: "thin-black" as const, label: "Thin Black" },
        { preset: "medium-black" as const, label: "Med Black" },
        { preset: "thick-black" as const, label: "Thick Black" },
        { preset: "thin-white" as const, label: "Thin White" },
        { preset: "medium-white" as const, label: "Med White" },
        { preset: "thick-white" as const, label: "Thick White" },
      ],
      glow: [
        { preset: "blue" as const, label: "Blue" },
        { preset: "cyan" as const, label: "Cyan" },
        { preset: "purple" as const, label: "Purple" },
        { preset: "pink" as const, label: "Pink" },
        { preset: "green" as const, label: "Green" },
        { preset: "orange" as const, label: "Orange" },
      ],
      gradient: [
        { preset: "sunset" as const, label: "Sunset" },
        { preset: "ocean" as const, label: "Ocean" },
        { preset: "purple" as const, label: "Purple" },
        { preset: "lime" as const, label: "Lime" },
        { preset: "fire" as const, label: "Fire" },
        { preset: "neon" as const, label: "Neon" },
      ],
    };
    return base;
  }, []);

  const removeEffect = (kind: EffectKind) => {
    if (!editor) return;
    focusEditor();

    const isTiptap =
      typeof editor?.commands?.focus === "function" &&
      !!editor?.state?.selection &&
      !!editor?.state?.doc;

    if (isTiptap) {
      const { from, to } = editor.state.selection;
      if (from === to) {
        showToast("Select text to remove effect");
        return;
      }
      const text = editor.state.doc.textBetween(from, to, " ");
      editor.chain().focus().deleteSelection().insertContent(text).run();
      showToast(`${kind} removed`);
      return;
    }

    const ok = removeEffectDOM(kind);
    if (!ok) {
      showToast("Select text to remove effect");
      return;
    }
    showToast(`${kind} removed`);
  };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[89px] overflow-x-auto px-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <p className="font-inter text-sm font-medium">{toast}</p>
        </div>
      )}

      {activeEffectPicker && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setActiveEffectPicker(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-w-[calc(100vw-32px)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 capitalize">{activeEffectPicker}</h3>
              <button
                type="button"
                onClick={() => setActiveEffectPicker(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="size-4" stroke="#364153" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {effectOptions[activeEffectPicker].map((opt: { preset: EffectPreset; label: string }) => (
                <button
                  key={opt.preset}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyTextEffect(activeEffectPicker, opt.preset);
                    setActiveEffectPicker(null);
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-3 hover:bg-gray-50 transition-colors text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  removeEffect(activeEffectPicker);
                  setActiveEffectPicker(null);
                }}
                className="border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
              >
                Remove
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  handleResetEffects();
                  setActiveEffectPicker(null);
                }}
                className="border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              >
                <RotateCcw className="size-4" stroke="#364153" strokeWidth={1.5} />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Templates Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowStyleModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Insert Style Template</h3>
            <div className="space-y-3">
              <button
                onClick={() => applyStyle('professional')}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <p className="font-bold text-gray-900">Professional</p>
                <p className="text-sm text-gray-600">Clean business style</p>
              </button>
              <button
                onClick={() => applyStyle('creative')}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <p className="font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">Creative</p>
                <p className="text-sm text-gray-600">Artistic gradient style</p>
              </button>
              <button
                onClick={() => applyStyle('minimal')}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <p className="font-bold text-gray-900">Minimal</p>
                <p className="text-sm text-gray-600">Simple and clean</p>
              </button>
              <button
                onClick={() => applyStyle('bold')}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <p className="font-black text-gray-900 text-lg">BOLD IMPACT</p>
                <p className="text-sm text-gray-600">Strong and powerful</p>
              </button>
            </div>
            <button
              onClick={() => setShowStyleModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowThemeModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Document Theme</h3>
            <div className="space-y-3">
              <button
                onClick={() => applyTheme('default')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="w-16 h-12 rounded border-2 border-gray-300" style={{ backgroundColor: '#ffffff' }}></div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Default</p>
                  <p className="text-sm text-gray-600">White background</p>
                </div>
              </button>
              <button
                onClick={() => applyTheme('dark')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded border-2 border-gray-700" style={{ backgroundColor: '#1f2937' }}></div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Dark gray background</p>
                </div>
              </button>
              <button
                onClick={() => applyTheme('sepia')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded border-2 border-amber-300" style={{ backgroundColor: '#fef3e2' }}></div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Sepia</p>
                  <p className="text-sm text-gray-600">Warm vintage tone</p>
                </div>
              </button>
              <button
                onClick={() => applyTheme('nord')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded border-2 border-gray-300" style={{ backgroundColor: '#eceff4' }}></div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Nord</p>
                  <p className="text-sm text-gray-600">Cool blue-gray</p>
                </div>
              </button>
              <button
                onClick={() => applyTheme('nature')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded border-2 border-green-300" style={{ backgroundColor: '#f0fdf4' }}></div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Nature</p>
                  <p className="text-sm text-gray-600">Fresh green tint</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Background Color Modal */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowColorModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Background Color</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-3">
                {['#ffffff', '#f3f4f6', '#dbeafe', '#fef3c7', '#fce7f3', '#ede9fe', '#d1fae5', '#fed7aa', '#fecaca', '#1f2937'].map(color => (
                  <button
                    key={color}
                    onClick={() => applyBackgroundColor(color)}
                    className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Color:</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-16 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowColorModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => applyBackgroundColor(bgColor)}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Modal */}
      {showPatternModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowPatternModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Background Pattern</h3>
            <div className="space-y-3">
              <button
                onClick={() => applyPattern('dots')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded" style={{ 
                  backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                  backgroundSize: '12px 12px'
                }}></div>
                <p className="font-bold text-gray-900">Dots</p>
              </button>
              <button
                onClick={() => applyPattern('grid')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded" style={{ 
                  backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)',
                  backgroundSize: '12px 12px'
                }}></div>
                <p className="font-bold text-gray-900">Grid</p>
              </button>
              <button
                onClick={() => applyPattern('lines')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded" style={{ 
                  backgroundImage: 'repeating-linear-gradient(0deg, #f3f4f6, #f3f4f6 1px, transparent 1px, transparent 12px)'
                }}></div>
                <p className="font-bold text-gray-900">Lines</p>
              </button>
              <button
                onClick={() => applyPattern('diagonal')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-4"
              >
                <div className="w-16 h-12 rounded" style={{ 
                  backgroundImage: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 6px, #f3f4f6 6px, #f3f4f6 12px)'
                }}></div>
                <p className="font-bold text-gray-900">Diagonal</p>
              </button>
            </div>
            <button
              onClick={() => setShowPatternModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Insert Style */}
      <div className="h-[79px] w-[81px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Insert Style
        </p>
        <button 
          onClick={handleInsertStyle}
          className="flex-1 border border-transparent rounded-[14px] hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <FileText className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
              Insert Style
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Themes */}
      <div className="h-[79px] w-[92px] shrink-0 flex flex-col gap-2">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Themes
        </p>
        <button 
          onClick={handleSelectTheme}
          className={`flex-1 border border-transparent rounded-[14px] hover:bg-gray-100 transition-colors ${
            currentTheme !== 'default' ? 'bg-gray-100' : ''
          }`}
        >
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            <Palette className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
              Select Theme
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Background */}
      <div className="h-[80px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Background
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleBackgroundColor}
            className="border border-transparent h-[65px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Droplet className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Color
              </p>
            </div>
          </button>
          <button 
            onClick={handlePattern}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors mt-[10px]"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Grid3x3 className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Pattern
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Text Effects */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Text Effects
        </p>
        <div className="flex gap-2">
          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleShadow}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Layers className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Shadow
              </p>
            </div>
          </button>
          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOutline}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Square className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Outline
              </p>
            </div>
          </button>
          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleGlow}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Sparkles className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Glow
              </p>
            </div>
          </button>
          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleGradient}
            className="border border-transparent h-[55px] w-[73px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Droplets className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Gradient
              </p>
            </div>
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleResetEffects}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <RotateCcw className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Reset
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
