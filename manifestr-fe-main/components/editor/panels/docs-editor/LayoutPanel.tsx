import React, { useState } from "react";
import { Layout, RotateCw, Maximize2, Columns as ColumnsIcon, Split } from "lucide-react";

interface LayoutPanelProps {
  store?: any;
  editor?: any;
}

export default function LayoutPanel({ store, editor }: LayoutPanelProps) {

  const [indentLeft, setIndentLeft] = useState(0);
  const [indentRight, setIndentRight] = useState(0);
  const [spacingBefore, setSpacingBefore] = useState(0);
  const [spacingAfter, setSpacingAfter] = useState(0);
  const [currentMargin, setCurrentMargin] = useState("normal");
  const [currentOrientation, setCurrentOrientation] = useState("portrait");
  const [currentColumns, setCurrentColumns] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Toast notification helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // Margins Handler
  const handleMargins = () => {
    if (!editor) return;
    
    const margins = {
      normal: { margin: '2.54cm' },
      narrow: { margin: '1.27cm' },
      wide: { margin: '3.81cm' }
    };
    
    const nextMargin = currentMargin === "normal" ? "narrow" : currentMargin === "narrow" ? "wide" : "normal";
    setCurrentMargin(nextMargin);
    
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      editorElement.style.padding = margins[nextMargin].margin;
    }
    
    showToast(`Margins: ${nextMargin.toUpperCase()}`);
  };

  // Orientation Handler
  const handleOrientation = () => {
    if (!editor) return;
    
    const nextOrientation = currentOrientation === "portrait" ? "landscape" : "portrait";
    setCurrentOrientation(nextOrientation);
    
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      if (nextOrientation === "landscape") {
        editorElement.style.maxWidth = '29.7cm';
        editorElement.style.minHeight = '21cm';
      } else {
        editorElement.style.maxWidth = '21cm';
        editorElement.style.minHeight = '29.7cm';
      }
    }
    
    showToast(`Orientation: ${nextOrientation.toUpperCase()}`);
  };

  // Size Handler
  const handleSize = () => {
    if (!editor) return;
    setShowSizeModal(true);
  };

  const selectSize = (sizeKey: string) => {
    const sizes = {
      'a4': { width: '21cm', height: '29.7cm', name: 'A4' },
      'letter': { width: '8.5in', height: '11in', name: 'Letter' },
      'legal': { width: '8.5in', height: '14in', name: 'Legal' }
    };
    
    if (sizes[sizeKey]) {
      const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
      if (editorElement) {
        editorElement.style.maxWidth = sizes[sizeKey].width;
        editorElement.style.minHeight = sizes[sizeKey].height;
      }
      showToast(`Page Size: ${sizes[sizeKey].name}`);
      setShowSizeModal(false);
    }
  };

  // Columns Handler
  const handleColumns = () => {
    if (!editor) return;
    
    const nextColumns = currentColumns === 1 ? 2 : currentColumns === 2 ? 3 : 1;
    setCurrentColumns(nextColumns);
    
    const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorElement) {
      if (nextColumns === 1) {
        editorElement.style.columnCount = '';
        editorElement.style.columnGap = '';
      } else {
        editorElement.style.columnCount = String(nextColumns);
        editorElement.style.columnGap = '2rem';
      }
    }
    
    showToast(`Columns: ${nextColumns}`);
  };

  // Breaks Handler (Insert Page Break)
  const handleBreaks = () => {
    if (!editor) return;
    editor.chain().focus().setPageBreak().run();
  };

  // Apply Indent Left
  const applyIndentLeft = () => {
    if (!editor || indentLeft === 0) return;
    editor.chain().focus().setIndentLeft(`${indentLeft}cm`).run();
  };

  // Apply Indent Right
  const applyIndentRight = () => {
    if (!editor || indentRight === 0) return;
    editor.chain().focus().setIndentRight(`${indentRight}cm`).run();
  };

  // Apply Spacing Before
  const applySpacingBefore = () => {
    if (!editor || spacingBefore === 0) return;
    editor.chain().focus().setSpacingBefore(`${spacingBefore}pt`).run();
  };

  // Apply Spacing After
  const applySpacingAfter = () => {
    if (!editor || spacingAfter === 0) return;
    editor.chain().focus().setSpacingAfter(`${spacingAfter}pt`).run();
  };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-5 h-[120px] overflow-x-auto px-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <p className="font-inter text-sm font-medium">{toast}</p>
        </div>
      )}

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowSizeModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Page Size</h3>
            <div className="space-y-3">
              <button
                onClick={() => selectSize('a4')}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
              >
                <p className="font-bold text-gray-900 text-base">A4</p>
                <p className="text-sm text-gray-500 mt-1">21cm × 29.7cm</p>
              </button>
              <button
                onClick={() => selectSize('letter')}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
              >
                <p className="font-bold text-gray-900 text-base">Letter</p>
                <p className="text-sm text-gray-500 mt-1">8.5in × 11in</p>
              </button>
              <button
                onClick={() => selectSize('legal')}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
              >
                <p className="font-bold text-gray-900 text-base">Legal</p>
                <p className="text-sm text-gray-500 mt-1">8.5in × 14in</p>
              </button>
            </div>
            <button
              onClick={() => setShowSizeModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Page Setup Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Page Setup
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleMargins}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Layout className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Margins
              </p>
            </div>
          </button>
          <button 
            onClick={handleOrientation}
            className={`border border-transparent h-[55px] w-[86px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors ${
              currentOrientation === "landscape" ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <RotateCw className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Orientation
              </p>
            </div>
          </button>
          <button 
            onClick={handleSize}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Maximize2 className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Size
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Layout Options Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Layout Options
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleColumns}
            className={`border border-transparent h-[55px] w-[76px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors ${
              currentColumns > 1 ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <ColumnsIcon className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Columns
              </p>
            </div>
          </button>
          <button 
            onClick={handleBreaks}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Split className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Breaks
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Paragraph Spacing Section */}
      <div className="h-[81px] flex flex-col shrink-0 w-[388px]">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center mb-2">
          Paragraph Spacing
        </p>
        <div className="flex items-center gap-3">
          {/* Indent Label */}
          <p className="font-inter font-normal leading-[15px] text-[#6a7282] text-[10px] tracking-[0.117px]">
            Indent
          </p>

          {/* Indent Inputs */}
          <div className="flex gap-2">
            {/* Left */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                Left
              </p>
              <input
                type="number"
                value={indentLeft}
                onChange={(e) => setIndentLeft(Number(e.target.value))}
                onBlur={applyIndentLeft}
                onKeyDown={(e) => e.key === 'Enter' && applyIndentLeft()}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                cm
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                Right
              </p>
              <input
                type="number"
                value={indentRight}
                onChange={(e) => setIndentRight(Number(e.target.value))}
                onBlur={applyIndentRight}
                onKeyDown={(e) => e.key === 'Enter' && applyIndentRight()}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                cm
              </p>
            </div>
          </div>

          {/* Spacing Label */}
          <p className="font-inter font-normal leading-[15px] text-[#6a7282] text-[10px] tracking-[0.117px]">
            Spacing
          </p>

          {/* Spacing Inputs */}
          <div className="flex gap-2">
            {/* Before */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                Before
              </p>
              <input
                type="number"
                value={spacingBefore}
                onChange={(e) => setSpacingBefore(Number(e.target.value))}
                onBlur={applySpacingBefore}
                onKeyDown={(e) => e.key === 'Enter' && applySpacingBefore()}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                pt
              </p>
            </div>

            {/* After */}
            <div className="flex flex-col gap-0.5 items-center w-16">
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                After
              </p>
              <input
                type="number"
                value={spacingAfter}
                onChange={(e) => setSpacingAfter(Number(e.target.value))}
                onBlur={applySpacingAfter}
                onKeyDown={(e) => e.key === 'Enter' && applySpacingAfter()}
                className="border border-[#d1d5dc] rounded-md px-2 py-1 text-[#364153] text-xs text-center font-inter w-16 h-[26px]"
              />
              <p className="font-inter font-normal leading-[13.5px] text-[#99a1af] text-[9px] tracking-[0.167px]">
                pt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
