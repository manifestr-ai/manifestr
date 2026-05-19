import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
    ChevronDown,
    Undo2,
    Redo2,
    Plus,
    Download,
    CloudCheck,
    Share2,
} from 'lucide-react';
import pptxgen from "pptxgenjs";
import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import { trackDeckExport } from "../../lib/productAnalytics";

// Dynamically import ShareModal to avoid SSR issues
const ShareModal = dynamic(() => import('../collaboration/ShareModal'), { ssr: false });



const downloadPPTX = async (store) => {
  try {
    const pptx = new pptxgen();

    const widthInch = store.width / 96;
    const heightInch = store.height / 96;

    pptx.defineLayout({
      name: "CUSTOM",
      width: widthInch,
      height: heightInch,
    });

    pptx.layout = "CUSTOM";

    for (const page of store.pages) {
      const slide = pptx.addSlide();

      const dataUrl = await store.toDataURL({
        pageId: page.id,
        pixelRatio: 2,
      });

      slide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: widthInch,
        h: heightInch,
      });
    }

    pptx.writeFile({ fileName: "presentation.pptx" });
    trackDeckExport("pptx");
  } catch (err) {
    console.error("Failed to generate PPTX:", err);
  }
};

export default function TopHeader({
    onDownload = () => { },
    store = null,
    editorType = 'spreadsheet',
    documentId = null,
    documentTitle = 'Untitled document',
    enableCollaboration = false,
    activeUsers = [],
}) {
    const router = useRouter();
    const [status, setStatus] = useState('In Progress');
    const [mode, setMode] = useState('Editing');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Dynamic download button text based on editor type
    const getDownloadText = () => {
        switch (editorType) {
            case 'document':
                return 'Download DOC';
            case 'spreadsheet':
                return 'Download XLSX';
            case 'presentation':
                return 'Download PPTX';
            case 'chart':
                return 'Download PNG';
            case 'image':
                return 'Download PNG';
            default:
                return 'Download';
        }
    };

    const statusDropdownRef = useRef(null);
    const modeDropdownRef = useRef(null);

    const handleLogoClick = () => {
        router.push('/home');
    };

    const statuses = ['In Progress', 'Draft', 'Final', 'Archived'];
    const modes = ['Editing', 'Suggesting', 'Viewing'];
    const collabAvatarSlice = activeUsers.slice(0, 5);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setShowStatusDropdown(false);
            }
            if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target)) {
                setShowModeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
        <div className="flex items-center justify-between border-b border-[#e4e4e7] bg-white px-8 py-3">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
                    <img src="/assets/logos/text-logo.svg" alt="Manifestr Logo" className="h-6" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{documentTitle}</span>
                    <div className="flex items-center gap-2 ml-4">
                        {/* Status Dropdown */}
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700"
                            >
                                <span className="w-4 h-4 rounded-full border border-dashed border-gray-400 animate-spin-slow mr-1"></span>
                                {status}
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            {showStatusDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    {statuses.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setStatus(s);
                                                setShowStatusDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${status === s ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mode Dropdown */}
                        <div className="relative" ref={modeDropdownRef}>
                            <button
                                onClick={() => setShowModeDropdown(!showModeDropdown)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700"
                            >
                                {mode}
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            {showModeDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    {modes.map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                setMode(m);
                                                setShowModeDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${mode === m ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-3">
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                            <Undo2 size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                            <Redo2 size={16} />
                        </button>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">v1.1</span>
                </div>
            </div>

            {/* Right: Figma 10478:187727 — cloud sync, avatars + invite, Share & Export */}
            <div className="flex shrink-0 items-center gap-4">
                {enableCollaboration && documentId && (
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="flex size-10 shrink-0 items-center justify-center rounded-md text-[#18181b] transition hover:bg-gray-50"
                            title="Changes sync automatically"
                            aria-label="Changes sync automatically"
                        >
                            <CloudCheck className="size-4" strokeWidth={2} aria-hidden />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center -space-x-1">
                                {collabAvatarSlice.map((user, idx) => (
                                    <div
                                        key={user.user_id ?? idx}
                                        className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/[0.08] text-xs font-semibold text-white ring-2 ring-white"
                                        style={{
                                            backgroundColor: user.user_color || '#3b82f6',
                                            zIndex: collabAvatarSlice.length - idx,
                                        }}
                                        title={
                                            user.users
                                                ? `${user.users.first_name || ''} ${user.users.last_name || ''}`.trim() ||
                                                  user.users.email
                                                : 'Collaborator'
                                        }
                                    >
                                        {(user.users
                                            ? `${user.users.first_name || ''} ${user.users.last_name || ''}`.trim() ||
                                              user.users.email
                                            : user.users?.email || 'U')[0]?.toUpperCase() ?? 'U'}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setShowShareModal(true)}
                                    className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-[#e4e4e7] bg-white text-[#18181b] transition hover:bg-gray-50"
                                    aria-label="Invite collaborators"
                                >
                                    <Plus size={16} strokeWidth={2} aria-hidden />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowShareModal(true)}
                                className="flex h-10 shrink-0 items-center gap-2 rounded-md bg-[#18181b] px-4 text-sm font-medium leading-5 text-white transition hover:bg-zinc-800"
                            >
                                <Share2 className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                                Share &amp; Export
                            </button>
                        </div>
                    </div>
                )}
                {/* Download Button - Only for document editor */}
                {editorType === 'document' && onDownload && (
                    <button 
                        onClick={onDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                        <Download size={16} />
                        Download DOCX
                    </button>
                )}

                {/* Download Button - Only for spreadsheet editor */}
                {editorType === 'spreadsheet' && onDownload && (
                    <button 
                        onClick={onDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
                    >
                        <Download size={16} />
                        Download XLSX
                    </button>
                )}

                    {/* Download Button - Only for presentation editor */}

                    {editorType === 'presentation' && (
                        <Popover
                            position={Position.BOTTOM_RIGHT}
                            content={
                            <Menu>
                                <MenuItem
                                
                                text="PDF"
                                disabled={!store}
                                onClick={() => {
                                    store?.saveAsPDF({ fileName: "presentation.pdf" });
                                    trackDeckExport("pdf");
                                }}
                                />
                                <MenuItem
                              
                                text="PPTX"
                                disabled={!store}
                                onClick={() => {
                                    if (editorType === 'presentation' && store) {
                                        downloadPPTX(store);
                                    } else if ((editorType === 'chart' || editorType === 'image') && store?.downloadChart) {
                                        store.downloadChart();
                                    } else if (store) {
                                        downloadPPTX(store);
                                    }
                                }}
                                />
                            </Menu>
                            }
                        >
                            <Button
                                className={`
                                    flex 
                                    items-center 
                                    justify-center
                                    gap-[8px]
                                    h-[40px]
                                    px-[16px]
                                    py-[8px]
                                    !border-none
                                    !text-white
                                `}
                                style={{
                                    borderRadius: "var(--border-radius-default, 6px)",
                                    background: "var(--base-secondary, #18181B)",
                                }}
                                disabled={!store}
                            >
                                <span className="flex items-center gap-2">
                                    <Download size={16} />
                                    <span>Download</span>
                                </span>
                            </Button>
                       
                        </Popover>
                        )}


                         {/* Download Button - Only for image editor */}

                    {editorType === 'image' && (
                        <Popover
                            position={Position.BOTTOM_RIGHT}
                            content={
                            <Menu>
                                <MenuItem
                                
                                text="PNG"
                                disabled={!store}
                                onClick={() =>
                                    store?.saveAsImage({ fileName: "manifestr-edit.png" })
                                }
                                />
                              
                            </Menu>
                            }
                        >
                            <Button
                                className={`
                                    flex 
                                    items-center 
                                    justify-center
                                    gap-[8px]
                                    h-[40px]
                                    px-[16px]
                                    py-[8px]
                                    !border-none
                                    !text-white
                                `}
                                style={{
                                    borderRadius: "var(--border-radius-default, 6px)",
                                    background: "var(--base-secondary, #18181B)",
                                }}
                                disabled={!store}
                            >
                                <span className="flex items-center gap-2">
                                    <Download size={16} />
                                    <span>Download</span>
                                </span>
                            </Button>
                       
                        </Popover>
                        )}

                    {/* Download Chart Button - Only for chart editor */}
                    {editorType === 'chart' && onDownload && (
                        <button 
                            onClick={onDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
                        >
                            <Download size={16} />
                            Download Chart
                        </button>
                    )}
            </div>

        </div>

            {/* Share Modal - Only render if collaboration enabled */}
            {enableCollaboration && documentId && (
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    documentId={documentId}
                    documentTitle={documentTitle}
                />
            )}
        </>
    );
}
