import React, { useState } from "react";
import { FileText, Palette, Droplet, Grid3x3, Layers, Square, Sparkles, Droplets } from "lucide-react";

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

  // Text Effects - Shadow
  const handleShadow = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      showToast('Select text to apply shadow');
      return;
    }

    const shadowHTML = editor.state.doc.textBetween(from, to, ' ');
    const styledText = `<span style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${shadowHTML}</span>`;
    
    editor.chain().focus().deleteSelection().insertContent(styledText).run();
    showToast('Text shadow applied');
  };

  // Text Effects - Outline
  const handleOutline = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      showToast('Select text to apply outline');
      return;
    }

    const outlineHTML = editor.state.doc.textBetween(from, to, ' ');
    const styledText = `<span style="-webkit-text-stroke: 1px #000000; font-weight: 700;">${outlineHTML}</span>`;
    
    editor.chain().focus().deleteSelection().insertContent(styledText).run();
    showToast('Text outline applied');
  };

  // Text Effects - Glow
  const handleGlow = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      showToast('Select text to apply glow');
      return;
    }

    const glowHTML = editor.state.doc.textBetween(from, to, ' ');
    const styledText = `<span style="text-shadow: 0 0 10px #3b82f6, 0 0 20px #3b82f6; color: #3b82f6; font-weight: 600;">${glowHTML}</span>`;
    
    editor.chain().focus().deleteSelection().insertContent(styledText).run();
    showToast('Text glow applied');
  };

  // Text Effects - Gradient
  const handleGradient = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      showToast('Select text to apply gradient');
      return;
    }

    const gradientHTML = editor.state.doc.textBetween(from, to, ' ');
    const styledText = `<span style="background: linear-gradient(to right, #f97316, #dc2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; font-size: 1.2em;">${gradientHTML}</span>`;
    
    editor.chain().focus().deleteSelection().insertContent(styledText).run();
    showToast('Text gradient applied');
  };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[89px] overflow-x-auto px-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <p className="font-inter text-sm font-medium">{toast}</p>
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
        </div>
      </div>
    </div>
  );
}
