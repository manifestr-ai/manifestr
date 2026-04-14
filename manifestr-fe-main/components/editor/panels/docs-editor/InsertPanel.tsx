import React, { useRef, useState } from "react";

interface InsertPanelProps {
  store?: any;
  editor?: any;
}

export default function InsertPanel({ store, editor }: InsertPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  
  // Icon URLs from Figma - INSERT TAB
  const imgImage = "https://www.figma.com/api/mcp/asset/68bc1e1f-7c1d-4b52-a00b-55f8444d10a3";
  const imgTable = "https://www.figma.com/api/mcp/asset/6de9984a-c7cc-46d3-a0fc-c039f39db82e";
  const imgLink = "https://www.figma.com/api/mcp/asset/b0117435-0469-40a9-8aa8-7524cab1df81";
  const imgDivider = "https://www.figma.com/api/mcp/asset/0188dfe6-2984-44fb-ab75-da4e602140ef";
  const imgDate = "https://www.figma.com/api/mcp/asset/1fe45ac6-b0b1-4b77-8e8c-ea5a1ee8fd85";
  const imgPageBreak = "https://www.figma.com/api/mcp/asset/f7b2dc0e-e934-468c-b026-87d0575d0ead";
  const imgHeader = "https://www.figma.com/api/mcp/asset/fc61b620-3d66-4401-886c-c9440f62a18e";
  const imgPageNumber = "https://www.figma.com/api/mcp/asset/944d9319-13ec-440b-b573-bbe69ab7126c";

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
              <img alt="" className="block size-[18px]" src={imgImage} />
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
              <img alt="" className="block size-[18px]" src={imgTable} />
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
              <img alt="" className="block size-[18px]" src={imgLink} />
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
              <img alt="" className="block size-[18px]" src={imgDivider} />
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
              <img alt="" className="block size-[18px]" src={imgDate} />
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
              <img alt="" className="block size-[18px]" src={imgPageBreak} />
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
              <img alt="" className="block size-[18px]" src={imgHeader} />
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
              <img alt="" className="block size-[18px]" src={imgHeader} />
              <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">
                Footer
              </p>
            </div>
          </button>
          <button className="border border-transparent h-[55px] w-[68px] shrink-0 rounded-[14px] hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed">
            <div className="flex flex-col gap-1 items-center justify-center h-full">
              <img alt="" className="block size-[18px]" src={imgPageNumber} />
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
