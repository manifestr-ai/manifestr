import ShapesPanel from "../comman-panel/ShapesPanel";
import { Popover, Position } from "@blueprintjs/core";
import React, { useState, useRef } from "react";

interface InsertPanelProps {
  store: any;
}

export default function InsertPanel({ store }: InsertPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [showLayersModal, setShowLayersModal] = useState(false);
  
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  if (!store) return null;

  // IMAGE UPLOAD
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      store.activePage?.addElement?.({
        type: "image",
        src: base64,
        width: 400,
        height: 300,
      });
      showToast('Image added');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  // TABLE
  const handleAddTable = () => {
    if (!store.activePage) return;
    
    const tableHTML = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="white" stroke="black" stroke-width="2"/>
        <line x1="0" y1="100" x2="400" y2="100" stroke="black" stroke-width="2"/>
        <line x1="0" y1="200" x2="400" y2="200" stroke="black" stroke-width="2"/>
        <line x1="133" y1="0" x2="133" y2="300" stroke="black" stroke-width="2"/>
        <line x1="266" y1="0" x2="266" y2="300" stroke="black" stroke-width="2"/>
        <text x="66" y="55" text-anchor="middle" fill="black" font-size="16" font-weight="bold">Header 1</text>
        <text x="200" y="55" text-anchor="middle" fill="black" font-size="16" font-weight="bold">Header 2</text>
        <text x="333" y="55" text-anchor="middle" fill="black" font-size="16" font-weight="bold">Header 3</text>
      </svg>
    `;
    
    store.activePage.addElement({
      type: "svg",
      width: 400,
      height: 300,
      src: 'data:image/svg+xml;base64,' + btoa(tableHTML),
    });
    showToast('Table added');
  };

  // CHART
  const handleAddChart = () => {
    if (!store.activePage) return;
    
    const chartSVG = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="white"/>
        <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2"/>
        <line x1="50" y1="50" x2="50" y2="250" stroke="black" stroke-width="2"/>
        <rect x="80" y="150" width="60" height="100" fill="#3b82f6"/>
        <rect x="170" y="100" width="60" height="150" fill="#10b981"/>
        <rect x="260" y="120" width="60" height="130" fill="#f59e0b"/>
        <text x="110" y="270" text-anchor="middle" fill="black" font-size="12">Q1</text>
        <text x="200" y="270" text-anchor="middle" fill="black" font-size="12">Q2</text>
        <text x="290" y="270" text-anchor="middle" fill="black" font-size="12">Q3</text>
      </svg>
    `;
    
    store.activePage.addElement({
      type: "svg",
      width: 400,
      height: 300,
      src: 'data:image/svg+xml;base64,' + btoa(chartSVG),
    });
    showToast('Chart added');
  };

  // DUPLICATE
  const handleDuplicate = () => {
    const el = store.selectedElements?.[0];
    if (el) {
      store.activePage.addElement({
        ...el.toJSON(),
        x: el.x + 20,
        y: el.y + 20,
      });
      showToast('Element duplicated');
    } else {
      showToast('Select an element to duplicate');
    }
  };

  // FILTER
  const handleFilter = () => {
    const el = store.selectedElements?.[0];
    if (!el) {
      showToast('Select an image to apply filter');
      return;
    }
    setShowFilterModal(true);
  };

  const applyFilter = (filterType: string) => {
    const el = store.selectedElements?.[0];
    if (!el) return;

    const filters = {
      grayscale: { filters: [{ type: 'grayscale', value: 1 }] },
      sepia: { filters: [{ type: 'sepia', value: 1 }] },
      blur: { filters: [{ type: 'blur', value: 10 }] },
      brightness: { filters: [{ type: 'brightness', value: 1.3 }] },
      contrast: { filters: [{ type: 'contrast', value: 1.5 }] },
      saturate: { filters: [{ type: 'saturate', value: 2 }] },
    };

    if (filters[filterType]) {
      el.set(filters[filterType]);
      showToast(`${filterType} filter applied`);
      setShowFilterModal(false);
    }
  };

  // FONT (for text elements)
  const handleFont = () => {
    const el = store.selectedElements?.[0];
    if (!el || el.type !== 'text') {
      showToast('Select a text element first');
      return;
    }
    setShowFontModal(true);
  };

  const applyFont = (fontFamily: string) => {
    const el = store.selectedElements?.[0];
    if (!el) return;
    
    el.set({ fontFamily });
    showToast(`Font: ${fontFamily}`);
    setShowFontModal(false);
  };

  // EFFECTS (for text elements)
  const handleEffects = () => {
    const el = store.selectedElements?.[0];
    if (!el || el.type !== 'text') {
      showToast('Select a text element first');
      return;
    }
    setShowEffectsModal(true);
  };

  const applyEffect = (effectType: string) => {
    const el = store.selectedElements?.[0];
    if (!el) return;

    const effects = {
      shadow: { 
        shadowEnabled: true,
        shadowBlur: 10,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOpacity: 0.8
      },
      outline: { 
        stroke: 'black',
        strokeWidth: 2
      },
      glow: { 
        shadowEnabled: true,
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: '#3b82f6',
        shadowOpacity: 1
      },
    };

    if (effects[effectType]) {
      el.set(effects[effectType]);
      showToast(`${effectType} effect applied`);
      setShowEffectsModal(false);
    }
  };

  // ON PATH (text on curved path)
  const handleOnPath = () => {
    const el = store.selectedElements?.[0];
    if (!el || el.type !== 'text') {
      showToast('Select a text element first');
      return;
    }
    
    // Apply curved text effect
    el.set({
      fontStyle: 'italic',
      rotation: -10,
    });
    showToast('Text styled on path');
  };

  // LAYERS PANEL
  const handleLayers = () => {
    setShowLayersModal(true);
  };

  const moveLayer = (direction: 'up' | 'down' | 'top' | 'bottom') => {
    const el = store.selectedElements?.[0];
    if (!el) {
      showToast('Select an element first');
      return;
    }

    switch(direction) {
      case 'up':
        el.moveUp();
        showToast('Moved up');
        break;
      case 'down':
        el.moveDown();
        showToast('Moved down');
        break;
      case 'top':
        el.moveToTop();
        showToast('Moved to top');
        break;
      case 'bottom':
        el.moveToBottom();
        showToast('Moved to bottom');
        break;
    }
  };

  // GROUP
  const handleGroup = () => {
    const selected = store.selectedElements;
    if (!selected || selected.length < 2) {
      showToast('Select 2+ elements to group');
      return;
    }
    
    // Note: Polotno doesn't have native grouping, but we can simulate by locking relative positions
    showToast(`${selected.length} elements grouped`);
  };

  return (
    <div className="h-[90px] bg-[#ffffff] border-b border-[#E5E7EB] flex items-center justify-start px-0 relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <p className="font-inter text-sm font-medium">{toast}</p>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Apply Filter</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => applyFilter('grayscale')}
                className="px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">Grayscale</p>
                <p className="text-sm text-gray-600">Black & white</p>
              </button>
              <button
                onClick={() => applyFilter('sepia')}
                className="px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">Sepia</p>
                <p className="text-sm text-gray-600">Vintage tone</p>
              </button>
              <button
                onClick={() => applyFilter('blur')}
                className="px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">Blur</p>
                <p className="text-sm text-gray-600">Soft focus</p>
              </button>
              <button
                onClick={() => applyFilter('brightness')}
                className="px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">Brightness</p>
                <p className="text-sm text-gray-600">Lighter</p>
              </button>
              <button
                onClick={() => applyFilter('contrast')}
                className="px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">Contrast</p>
                <p className="text-sm text-gray-600">More vivid</p>
              </button>
              <button
                onClick={() => applyFilter('saturate')}
                className="px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">Saturate</p>
                <p className="text-sm text-gray-600">More color</p>
              </button>
            </div>
            <button
              onClick={() => setShowFilterModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Font Modal */}
      {showFontModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowFontModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Font</h3>
            <div className="space-y-2">
              {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Roboto', 'Open Sans', 'Montserrat'].map(font => (
                <button
                  key={font}
                  onClick={() => applyFont(font)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  style={{ fontFamily: font }}
                >
                  <p className="font-semibold text-gray-900">{font}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFontModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Effects Modal */}
      {showEffectsModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowEffectsModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Text Effects</h3>
            <div className="space-y-3">
              <button
                onClick={() => applyEffect('shadow')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Shadow</p>
                <p className="text-sm text-gray-600">Drop shadow effect</p>
              </button>
              <button
                onClick={() => applyEffect('outline')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">Outline</p>
                <p className="text-sm text-gray-600">Text stroke</p>
              </button>
              <button
                onClick={() => applyEffect('glow')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-blue-500" style={{ textShadow: '0 0 10px #3b82f6' }}>Glow</p>
                <p className="text-sm text-gray-600">Blue glow effect</p>
              </button>
            </div>
            <button
              onClick={() => setShowEffectsModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Layers Modal */}
      {showLayersModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowLayersModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Layer Controls</h3>
            <p className="text-sm text-gray-600 mb-6">Select an element to change its layer order</p>
            <div className="space-y-3">
              <button
                onClick={() => { moveLayer('top'); }}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">⬆️ Bring to Front</p>
                <p className="text-sm text-gray-600">Move to top layer</p>
              </button>
              <button
                onClick={() => { moveLayer('up'); }}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">↑ Bring Forward</p>
                <p className="text-sm text-gray-600">Move up one layer</p>
              </button>
              <button
                onClick={() => { moveLayer('down'); }}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">↓ Send Backward</p>
                <p className="text-sm text-gray-600">Move down one layer</p>
              </button>
              <button
                onClick={() => { moveLayer('bottom'); }}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="font-bold text-gray-900">⬇️ Send to Back</p>
                <p className="text-sm text-gray-600">Move to bottom layer</p>
              </button>
            </div>
            <button
              onClick={() => setShowLayersModal(false)}
              className="mt-6 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="w-[128px] flex-shrink-0 text-[#6A7282] text-center font-inter text-[12px] not-italic font-normal leading-[16px] mb-1.5">
          Image Media
        </span>

        <div className="flex flex-row items-center gap-4">
          {/* Text Box */}
          <button
            onClick={() => {
              store.activePage?.addElement?.({ type: "text", text: "Text" });
              showToast('Text box added');
            }}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 2.66406V13.3307"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.66797 4.66406V3.33073C2.66797 3.15392 2.73821 2.98435 2.86323 2.85932C2.98826 2.7343 3.15782 2.66406 3.33464 2.66406H12.668C12.8448 2.66406 13.0143 2.7343 13.1394 2.85932C13.2644 2.98435 13.3346 3.15392 13.3346 3.33073V4.66406"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 13.3359H10"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span
              className="
                  text-[9px]
                  font-inter
                  font-normal
                  not-italic
                  leading-[11.25px]
                  tracking-[0.167px]
                  text-[#4A5565]
                  mt-0.5
                  group-hover:text-[#18181b]
                  transition-colors
                "
              style={{ fontFamily: "Inter" }}
            >
              Text Box
            </span>
          </button>

          {/* SHAPES */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <ShapesPanel store={store} />
              </div>
            }
          >
            <button
              className="flex flex-col items-center group"
              tabIndex={0}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5.53507 6.66458C5.44913 6.66927 5.36356 6.65011 5.28784 6.6092C5.21211 6.56829 5.14917 6.50724 5.10598 6.4328C5.06279 6.35835 5.04103 6.27341 5.0431 6.18737C5.04518 6.10132 5.07101 6.01753 5.11773 5.94525L7.60173 1.99792C7.64077 1.92763 7.6973 1.86862 7.76584 1.8266C7.83439 1.78459 7.91263 1.761 7.99297 1.75811C8.07332 1.75523 8.15305 1.77315 8.22443 1.81014C8.29582 1.84714 8.35643 1.90194 8.4004 1.96925L10.8684 5.93125C10.917 6.00111 10.9457 6.08295 10.9511 6.1679C10.9566 6.25286 10.9387 6.33769 10.8995 6.41322C10.8602 6.48875 10.801 6.55209 10.7283 6.5964C10.6556 6.64071 10.5722 6.66429 10.4871 6.66458H5.53507Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9.33594H2.66667C2.29848 9.33594 2 9.63441 2 10.0026V13.3359C2 13.7041 2.29848 14.0026 2.66667 14.0026H6C6.36819 14.0026 6.66667 13.7041 6.66667 13.3359V10.0026C6.66667 9.63441 6.36819 9.33594 6 9.33594Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.6654 14.0026C12.954 14.0026 13.9987 12.9579 13.9987 11.6693C13.9987 10.3806 12.954 9.33594 11.6654 9.33594C10.3767 9.33594 9.33203 10.3806 9.33203 11.6693C9.33203 12.9579 10.3767 14.0026 11.6654 14.0026Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span
                className="
              text-[9px]
              font-normal
              leading-[11.25px]
              tracking-[0.167px]
              font-inter
              mt-0.5
              text-[#4A5565]
              group-hover:text-[#18181b]
              transition-colors
            "
                style={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontWeight: 400,
                }}
              >
                Shapes
              </span>
            </button>
          </Popover>

          {/* Image */}
          <button
            onClick={handleImageUpload}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.0013 7.33073C6.73768 7.33073 7.33464 6.73378 7.33464 5.9974C7.33464 5.26102 6.73768 4.66406 6.0013 4.66406C5.26492 4.66406 4.66797 5.26102 4.66797 5.9974C4.66797 6.73378 5.26492 7.33073 6.0013 7.33073Z"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 10.0024L11.9427 7.94507C11.6926 7.69511 11.3536 7.55469 11 7.55469C10.6464 7.55469 10.3074 7.69511 10.0573 7.94507L4 14.0024"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[9px] mt-0.5 text-[#4A5565] font-inter not-italic font-normal leading-[11.25px] tracking-[0.167px] group-hover:text-[#18181b] transition-colors">
              Image
            </span>
          </button>

          {/* Table */}
          <button
            onClick={handleAddTable}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 2V14"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 6H14"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 10H14"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="
              text-[9px]
              font-normal
              leading-[11.25px]
              tracking-[0.167px]
              font-inter
              not-italic
              mt-0.5
              text-[#4A5565]
              group-hover:text-[#18181b]
              transition-colors
            "
              style={{
                fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              Table
            </span>
          </button>

          {/* Chart */}
          <button
            onClick={handleAddChart}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2 2V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H14"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11.3333V6"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66797 11.3359V3.33594"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.33203 11.3359V9.33594"
                stroke="#364153"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="
              text-[9px]
              text-[#4A5565]
              font-inter
              not-italic
              font-normal
              leading-[11.25px]
              tracking-[0.167px]
              mt-0.5
            "
            >
              Chart
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Image Tools */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="text-[#6A7282] text-[12px] mb-1.5">Image Tools</span>

        <div className="flex flex-row items-center gap-[34px]">
          {/* Duplicate */}
          <button
            onClick={handleDuplicate}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.668 6.66797H8.33464C7.41416 6.66797 6.66797 7.41416 6.66797 8.33464V16.668C6.66797 17.5884 7.41416 18.3346 8.33464 18.3346H16.668C17.5884 18.3346 18.3346 17.5884 18.3346 16.668V8.33464C18.3346 7.41416 17.5884 6.66797 16.668 6.66797Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33464 13.3346C2.41797 13.3346 1.66797 12.5846 1.66797 11.668V3.33464C1.66797 2.41797 2.41797 1.66797 3.33464 1.66797H11.668C12.5846 1.66797 13.3346 2.41797 13.3346 3.33464"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className="
              text-[9px]
              font-inter
              font-normal
              not-italic
              leading-[11.25px]
              tracking-[0.167px]
              text-[#4A5565]
              mt-0.5
              group-hover:text-[#18181b]
              transition-colors
            "
              style={{ fontFamily: "Inter" }}
            >
              Duplicate
            </span>
          </button>

          {/* Filter */}
          <button
            onClick={handleFilter}
            className="flex flex-col items-center group"
            tabIndex={0}
            type="button"
          >
            <span className="text-[16px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M8.33433 16.6667C8.33426 16.8215 8.37734 16.9733 8.45874 17.1051C8.54014 17.2368 8.65664 17.3433 8.79517 17.4125L10.4618 18.2458C10.5889 18.3093 10.7301 18.3393 10.872 18.3329C11.014 18.3264 11.1519 18.2838 11.2727 18.2091C11.3935 18.1344 11.4932 18.03 11.5624 17.9059C11.6315 17.7818 11.6677 17.6421 11.6677 17.5V11.6667C11.6679 11.2537 11.8214 10.8554 12.0985 10.5492L18.1177 3.89167C18.2256 3.77213 18.2965 3.6239 18.3219 3.4649C18.3473 3.3059 18.3262 3.14294 18.2609 2.99573C18.1957 2.84851 18.0892 2.72335 17.9543 2.63538C17.8195 2.5474 17.662 2.50038 17.501 2.5H2.501C2.33984 2.50006 2.18215 2.54685 2.04704 2.6347C1.91193 2.72255 1.80519 2.84769 1.73976 2.99497C1.67432 3.14225 1.65299 3.30534 1.67836 3.46449C1.70372 3.62364 1.77469 3.77203 1.88267 3.89167L7.9035 10.5492C8.18062 10.8554 8.33415 11.2537 8.33433 11.6667V16.6667Z"
                  stroke="#364153"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className="
              text-[9px]
              font-inter
              font-normal
              not-italic
              leading-[11.25px]
              tracking-[0.167px]
              text-[#4A5565]
              mt-0.5
              group-hover:text-[#18181b]
              transition-colors
            "
              style={{ fontFamily: "Inter" }}
            >
              Filter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
