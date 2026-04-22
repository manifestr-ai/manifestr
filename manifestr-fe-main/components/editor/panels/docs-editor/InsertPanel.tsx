import React, { useRef, useState } from "react";
import { Image as ImageIcon, Table2, Link2, Minus, Calendar, FileText, FileImage } from "lucide-react";

interface InsertPanelProps {
  store?: any;
  editor?: any;
}

export default function InsertPanel({ store, editor }: InsertPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  

  // Image Upload Handler
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Convert to base64 and insert
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
  };

  // Table Insert Handler
  const handleInsertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  // Divider Insert Handler
  const handleInsertDivider = () => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  };

  // Date Insert Handler
  const handleInsertDate = () => {
    if (!editor) return;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    editor.chain().focus().insertContent(formattedDate).run();
  };

  // Link Insert Handler (for future implementation)
  const handleInsertLink = () => {
    if (!editor) return;
    setShowLinkModal(true);
  };

  const submitLink = () => {
    if (!editor || !linkUrl) return;
    
    if (linkText) {
      // Insert text with link
      editor.chain().focus().insertContent(`<a href="${linkUrl}" style="color: #3b82f6; text-decoration: underline;">${linkText}</a>`).run();
    } else {
      // Just apply link to selected text
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  // Page Break Insert Handler
  const handleInsertPageBreak = () => {
    if (!editor) return;
    editor.chain().focus().setPageBreak().run();
  };

  // Header Insert Handler
  const handleInsertHeader = () => {
    if (!editor) return;
    editor.chain().focus().setDocumentHeader().run();
  };

  // Footer Insert Handler
  const handleInsertFooter = () => {
    if (!editor) return;
    editor.chain().focus().setDocumentFooter().run();
  };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-3 h-[79px] overflow-x-auto px-6 relative">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL *</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link Text (optional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to apply link to selected text</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitLink}
                disabled={!linkUrl}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Media Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Media
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleImageUpload}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <ImageIcon className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Image
              </p>
            </div>
          </button>
          <button 
            onClick={handleInsertTable}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Table2 className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Table
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Links & Elements Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Links & Elements
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleInsertLink}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Link2 className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Link
              </p>
            </div>
          </button>
          <button 
            onClick={handleInsertDivider}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Minus className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Divider
              </p>
            </div>
          </button>
          <button 
            onClick={handleInsertDate}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <Calendar className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Date
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Page Elements Section */}
      <div className="h-[79px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Page Elements
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleInsertPageBreak}
            className="border border-transparent h-[55px] w-[86px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileText className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Page Break
              </p>
            </div>
          </button>
          <button 
            onClick={handleInsertHeader}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileImage className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Header
              </p>
            </div>
          </button>
          <button 
            onClick={handleInsertFooter}
            className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileImage className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Footer
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <FileText className="size-[18px]" stroke="#364153" strokeWidth={1.5} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Page #
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
