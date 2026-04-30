import React, { useState, useEffect } from "react";
import {
  Scissors,
  Copy,
  Clipboard,
  Eraser,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  IndentDecrease,
  IndentIncrease,
  Space,
  Strikethrough,
  Subscript,
  Superscript,
} from "lucide-react";

interface FormatPanelProps {
  store?: any;
  editor?: any;
}

export default function FormatPanel({ store, editor }: FormatPanelProps) {
  const [style, setStyle] = useState("Normal");
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState("12pt");

  // Update active states based on editor state
  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      if (editor.isActive("heading", { level: 1 })) setStyle("Heading 1");
      else if (editor.isActive("heading", { level: 2 })) setStyle("Heading 2");
      else if (editor.isActive("heading", { level: 3 })) setStyle("Heading 3");
      else setStyle("Normal");
    };

    editor.on("selectionUpdate", updateStates);
    editor.on("update", updateStates);

    return () => {
      editor.off("selectionUpdate", updateStates);
      editor.off("update", updateStates);
    };
  }, [editor]);

  // Quick Actions
  const handleCut = () => {
    document.execCommand("cut");
  };

  const handleCopy = () => {
    document.execCommand("copy");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
    } catch (err) {
      // Fallback to execCommand paste
      document.execCommand("paste");
    }
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
      case "Heading 1":
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case "Heading 2":
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case "Heading 3":
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
          <button
            onClick={handleCut}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Scissors className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">Cut</p>
          </button>
          <button
            onClick={handleCopy}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Copy className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Copy
            </p>
          </button>
          <button
            onClick={handlePaste}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Clipboard className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Paste
            </p>
          </button>
          <button
            onClick={handleClear}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eraser className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Clear
            </p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Style */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Style
        </p>
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
          <ChevronDown
            className="absolute right-3 top-[11px] size-3 pointer-events-none"
            stroke="#364153"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Font */}
      <div className="h-[58px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Font
        </p>
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
            <ChevronDown
              className="absolute right-3 top-[11px] size-3 pointer-events-none"
              stroke="#364153"
              strokeWidth={1.5}
            />
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
            <ChevronDown
              className="absolute right-3 top-[11px] size-3 pointer-events-none"
              stroke="#364153"
              strokeWidth={1.5}
            />
          </div>
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive("bold")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Bold 
              className="size-[18px]" 
              stroke={editor?.isActive("bold") ? "#2563eb" : "#364153"} 
              strokeWidth={editor?.isActive("bold") ? 2 : 1.5} 
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive("italic")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Italic
              className="size-[18px]"
              stroke={editor?.isActive("italic") ? "#2563eb" : "#364153"}
              strokeWidth={editor?.isActive("italic") ? 2 : 1.5}
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive("underline")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Underline
              className="size-[18px]"
              stroke={editor?.isActive("underline") ? "#2563eb" : "#364153"}
              strokeWidth={editor?.isActive("underline") ? 2 : 1.5}
            />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Alignment */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Alignment
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "left" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignLeft 
              className="size-4" 
              stroke={editor?.isActive({ textAlign: "left" }) ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "center" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignCenter
              className="size-4"
              stroke={editor?.isActive({ textAlign: "center" }) ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "right" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignRight 
              className="size-4" 
              stroke={editor?.isActive({ textAlign: "right" }) ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().setTextAlign("justify").run()
            }
            className={`border rounded-[10px] size-[30px] transition-all flex items-center justify-center ${
              editor?.isActive({ textAlign: "justify" })
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <AlignJustify
              className="size-4"
              stroke={editor?.isActive({ textAlign: "justify" }) ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* Lists & Spacing */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          Lists & Spacing
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("bulletList")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <List 
              className="size-4" 
              stroke={editor?.isActive("bulletList") ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("bulletList") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Bullets
            </p>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("orderedList")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <ListOrdered
              className="size-4"
              stroke={editor?.isActive("orderedList") ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("orderedList") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Numbers
            </p>
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().liftListItem("listItem").run()
            }
            disabled={!editor?.can().liftListItem("listItem")}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              !editor?.can().liftListItem("listItem")
                ? "border-transparent opacity-40 cursor-not-allowed"
                : "border-transparent hover:bg-gray-100 hover:border-gray-200"
            }`}
          >
            <IndentDecrease
              className="size-4"
              stroke="#364153"
              strokeWidth={1.5}
            />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Outdent
            </p>
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().sinkListItem("listItem").run()
            }
            disabled={!editor?.can().sinkListItem("listItem")}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              !editor?.can().sinkListItem("listItem")
                ? "border-transparent opacity-40 cursor-not-allowed"
                : "border-transparent hover:bg-gray-100 hover:border-gray-200"
            }`}
          >
            <IndentIncrease
              className="size-4"
              stroke="#364153"
              strokeWidth={1.5}
            />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Indent
            </p>
          </button>
          <button 
            onClick={() => {
              // Toggle line spacing (add/remove margin)
              const selection = window.getSelection();
              if (selection && selection.anchorNode) {
                const parent = selection.anchorNode.parentElement;
                if (parent) {
                  const currentMargin = parent.style.marginBottom;
                  parent.style.marginBottom = currentMargin === '16pt' ? '8pt' : '16pt';
                }
              }
            }}
            className="border border-transparent h-[30px] rounded-[10px] px-2.5 hover:bg-gray-100 hover:border-gray-200 transition-all flex items-center gap-2"
          >
            <Space className="size-4" stroke="#364153" strokeWidth={1.5} />
            <p className="font-inter font-normal text-[#4a5565] text-xs">
              Spacing
            </p>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#d1d5dc] h-14 w-px shrink-0" />

      {/* More */}
      <div className="h-[54px] flex flex-col gap-2 shrink-0">
        <p className="font-inter font-normal leading-4 text-[#6a7282] text-xs text-center">
          More
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("strike")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Strikethrough
              className="size-4"
              stroke={editor?.isActive("strike") ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("strike") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Strike
            </p>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("subscript")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Subscript 
              className="size-4" 
              stroke={editor?.isActive("subscript") ? "#2563eb" : "#364153"} 
              strokeWidth={1.5} 
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("subscript") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Subscript
            </p>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
            className={`border h-[30px] rounded-[10px] px-2.5 transition-all flex items-center gap-2 ${
              editor?.isActive("superscript")
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <Superscript
              className="size-4"
              stroke={editor?.isActive("superscript") ? "#2563eb" : "#364153"}
              strokeWidth={1.5}
            />
            <p className={`font-inter font-normal text-xs ${
              editor?.isActive("superscript") ? "text-blue-600 font-medium" : "text-[#4a5565]"
            }`}>
              Super
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
