import React, { useState, useEffect } from "react";

interface FormatPanelProps {
  store?: any;
  editor?: any;
}

export default function FormatPanel({ store, editor }: FormatPanelProps) {
  // Icon URLs from Figma - FORMAT TAB
  const imgCut = "https://www.figma.com/api/mcp/asset/0f6e6651-677e-400c-84fb-932a3756b0f9";
  const imgCopy = "https://www.figma.com/api/mcp/asset/6941d466-a05e-4067-adae-46c4609b675c";
  const imgPaste = "https://www.figma.com/api/mcp/asset/a6675df6-c205-4fff-982e-ccfd2bf6a395";
  const imgClear = "https://www.figma.com/api/mcp/asset/1f1a8028-abd9-4067-85d2-8437b366c277";
  const imgDropdown = "https://www.figma.com/api/mcp/asset/586235f5-9d68-4efa-93c9-45d860cbfd4b";
  const imgBold = "https://www.figma.com/api/mcp/asset/7e3b074f-2d0c-45ac-b754-ae54daedfba3";
  const imgItalic = "https://www.figma.com/api/mcp/asset/15aafe29-9195-4f8b-ba9b-495f211a5673";
  const imgUnderline = "https://www.figma.com/api/mcp/asset/27c8c6a9-8609-4391-997a-9a55414ad8d9";
  const imgTextColor = "https://www.figma.com/api/mcp/asset/d94d780c-4b01-4da2-b8de-ae878bfed96a";
  const imgHighlight = "https://www.figma.com/api/mcp/asset/bb913643-312f-4235-b7fd-0c671a4b4812";
  const imgAlignLeft = "https://www.figma.com/api/mcp/asset/92afd248-4994-4759-8cc6-36c00c666ae2";
  const imgAlignCenter = "https://www.figma.com/api/mcp/asset/d9ea7836-1ec7-47c2-b325-726270fc00a7";
  const imgAlignRight = "https://www.figma.com/api/mcp/asset/96ed8982-6cf8-48c1-8747-5761c948f95b";
  const imgAlignJustify = "https://www.figma.com/api/mcp/asset/e7a0eeb1-5ff0-4f00-8c81-36809944fa81";
  const imgBullets = "https://www.figma.com/api/mcp/asset/012cc8fd-4287-4cbc-ad04-12e6b62b55d7";
  const imgNumbers = "https://www.figma.com/api/mcp/asset/96d25f30-2541-4328-b535-5bc47fbf7961";
  const imgOutdent = "https://www.figma.com/api/mcp/asset/af0eef3c-6920-422a-817e-77557465eb42";
  const imgIndent = "https://www.figma.com/api/mcp/asset/8a8c9f53-19a3-4f49-8e5c-5b8323b7c37b";
  const imgSpacing = "https://www.figma.com/api/mcp/asset/d94bd09f-acc6-4e88-ab9e-e26c7d0964b4";
  const imgStrike = "https://www.figma.com/api/mcp/asset/b1959782-a5fb-4039-8715-3299cf09601f";
  const imgSubscript = "https://www.figma.com/api/mcp/asset/6c2c5c21-2e41-4a21-adc3-eca45d5421d8";
  const imgSuperscript = "https://www.figma.com/api/mcp/asset/d5e4bf77-6a3c-4ac3-9c77-16e0233f887b";

  const [style, setStyle] = useState("Normal");
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState("12pt");

  // Update active states based on editor state
  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      if (editor.isActive('heading', { level: 1 })) setStyle('Heading 1');
      else if (editor.isActive('heading', { level: 2 })) setStyle('Heading 2');
      else if (editor.isActive('heading', { level: 3 })) setStyle('Heading 3');
      else setStyle('Normal');
    };

    editor.on('selectionUpdate', updateStates);
    editor.on('update', updateStates);
    
    return () => {
      editor.off('selectionUpdate', updateStates);
      editor.off('update', updateStates);
    };
  }, [editor]);

  // Quick Actions
  const handleCut = () => {
    document.execCommand('cut');
  };

  const handleCopy = () => {
    document.execCommand('copy');
  };

  const handlePaste = () => {
    document.execCommand('paste');
  };

  const handleClear = () => {
    if (editor) {
      // Clear all formatting and marks from selection
      editor.chain().focus().unsetAllMarks().clearNodes().run();
      // Also delete the selected content
      editor.chain().focus().deleteSelection().run();
    }
  };

  // Style changes
  const handleStyleChange = (newStyle: string) => {
    setStyle(newStyle);
    if (!editor) return;

    switch (newStyle) {
      case 'Heading 1':
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case 'Heading 2':
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case 'Heading 3':
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
  };

  // Font family changes
  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    if (!editor) return;
    
    // Apply font family using Tiptap FontFamily extension
    editor.chain().focus().setFontFamily(newFont).run();
  };

  // Font size changes
  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    if (!editor) return;
    
    // Apply font size using custom FontSize extension
    editor.chain().focus().setFontSize(newSize).run();
  };

  return (
    <div className="bg-white border-t border-[#e4e4e7] flex items-center gap-5 h-[89px] overflow-x-auto px-6">
      {/* Quick Actions */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Quick Actions
        </p>
        <div className="flex gap-2">
          <button onClick={handleCut} className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgCut} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Cut</p>
          </button>
          <button onClick={handleCopy} className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgCopy} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Copy</p>
          </button>
          <button onClick={handlePaste} className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgPaste} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Paste</p>
          </button>
          <button onClick={handleClear} className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgClear} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Clear</p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Style */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Style</p>
        <div className="relative">
          <select
            value={style}
            onChange={(e) => handleStyleChange(e.target.value)}
            className="border border-[#d1d5dc] rounded-md h-[34px] w-[144px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
          >
            <option>Normal</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>
          <img alt="" className="absolute right-3 top-[11px] size-3 pointer-events-none" src={imgDropdown} />
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Font */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Font</p>
        <div className="flex gap-2.5 items-center">
          <div className="relative">
            <select
              value={font}
              onChange={(e) => handleFontChange(e.target.value)}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[249px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>Inter</option>
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
            </select>
            <img alt="" className="absolute right-3 top-[11px] size-3 pointer-events-none" src={imgDropdown} />
          </div>
          <div className="relative">
            <select
              value={fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="border border-[#d1d5dc] rounded-md h-[34px] w-[80px] px-3 font-inter text-sm text-[#0a0a0a] appearance-none"
            >
              <option>8pt</option>
              <option>10pt</option>
              <option>12pt</option>
              <option>14pt</option>
              <option>16pt</option>
              <option>18pt</option>
              <option>24pt</option>
            </select>
            <img alt="" className="absolute right-3 top-[11px] size-3 pointer-events-none" src={imgDropdown} />
          </div>
          <button 
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`border border-transparent rounded-[10px] size-[30px] hover:bg-gray-100 transition-colors flex items-center justify-center ${
              editor?.isActive('bold') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-[18px]" src={imgBold} />
          </button>
          <button 
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`border border-transparent rounded-[10px] size-[30px] hover:bg-gray-100 transition-colors flex items-center justify-center ${
              editor?.isActive('italic') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-[18px]" src={imgItalic} />
          </button>
          <button 
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`border border-transparent rounded-[10px] size-[30px] hover:bg-gray-100 transition-colors flex items-center justify-center ${
              editor?.isActive('underline') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-[18px]" src={imgUnderline} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Text & Highlight Colors */}
      <div className="h-[81px] flex gap-5 shrink-0 pt-2">
        <button className="border border-transparent h-[65px] w-[39px] rounded-[14px] hover:bg-gray-50 transition-colors flex flex-col items-center justify-start pt-2 gap-1">
          <img alt="" className="block size-[18px]" src={imgTextColor} />
          <div className="bg-black h-1.5 w-8 rounded"></div>
          <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">Text</p>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
          className={`border border-transparent h-[65px] w-[47px] rounded-[14px] hover:bg-gray-50 transition-colors flex flex-col items-center justify-start pt-2 gap-1 ${
            editor?.isActive('highlight') ? 'bg-gray-100' : ''
          }`}
        >
          <img alt="" className="block size-[18px]" src={imgHighlight} />
          <div className="bg-yellow-400 h-1.5 w-8 rounded"></div>
          <p className="font-inter font-normal leading-[15px] text-[#4a5565] text-[10px] tracking-[0.117px]">Highlight</p>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Alignment */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Alignment</p>
        <div className="flex gap-2">
          <button 
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className={`border border-transparent rounded-[10px] size-[30px] hover:bg-gray-100 transition-colors flex items-center justify-center ${
              editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgAlignLeft} />
          </button>
          <button 
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className={`border border-transparent rounded-[10px] size-[30px] hover:bg-gray-100 transition-colors flex items-center justify-center ${
              editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgAlignCenter} />
          </button>
          <button 
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className={`border border-transparent rounded-[10px] size-[30px] hover:bg-gray-100 transition-colors flex items-center justify-center ${
              editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgAlignRight} />
          </button>
          <button 
            onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
            className={`border border-transparent rounded-[10px] size-[30px] hover:bg-gray-100 transition-colors flex items-center justify-center ${
              editor?.isActive({ textAlign: 'justify' }) ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgAlignJustify} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Lists & Spacing */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">Lists & Spacing</p>
        <div className="flex gap-2">
          <button 
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
              editor?.isActive('bulletList') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgBullets} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Bullets</p>
          </button>
          <button 
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
              editor?.isActive('orderedList') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgNumbers} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Numbers</p>
          </button>
          <button 
            onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
            disabled={!editor?.can().liftListItem('listItem')}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <img alt="" className="block size-4" src={imgOutdent} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Outdent</p>
          </button>
          <button 
            onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
            disabled={!editor?.can().sinkListItem('listItem')}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <img alt="" className="block size-4" src={imgIndent} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Indent</p>
          </button>
          <button className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2">
            <img alt="" className="block size-4" src={imgSpacing} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Spacing</p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* More */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">More</p>
        <div className="flex gap-2">
          <button 
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
              editor?.isActive('strike') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgStrike} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Strike</p>
          </button>
          <button 
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
            className={`border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
              editor?.isActive('subscript') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgSubscript} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Subscript</p>
          </button>
          <button 
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
            className={`border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
              editor?.isActive('superscript') ? 'bg-gray-100' : ''
            }`}
          >
            <img alt="" className="block size-4" src={imgSuperscript} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Super</p>
          </button>
        </div>
      </div>
    </div>
  );
}
